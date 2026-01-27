/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable valid-jsdoc */
'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { ChevronDown, Minus, Plus, Trash2 } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import { Suspense, useEffect, useOptimistic, useState, useTransition } from 'react';

import { RangeInput } from '@/vibes/soul/form/range-input';
import { Streamable, useStreamable } from '@/vibes/soul/lib/streamable';
import { CursorPaginationInfo } from '@/vibes/soul/primitives/cursor-pagination';
import { Rating } from '@/vibes/soul/primitives/rating';
import { Link } from '~/components/link';

import { getFilterParsers } from './filter-parsers';

// Shared checkmark SVG data URI for checked checkboxes
const CHECKMARK_SVG = `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e")`;

const CHECKMARK_STYLES: React.CSSProperties = {
  backgroundImage: CHECKMARK_SVG,
  backgroundSize: '100% 100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

export interface LinkGroupFilter {
  type: 'link-group';
  label: string;
  links: Array<{ label: string; href: string }>;
}

export interface ToggleGroupFilter {
  type: 'toggle-group';
  paramName: string;
  label: string;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  defaultCollapsed?: boolean;
  renderAs?: 'checkbox' | 'dropdown';
}

export interface RatingFilter {
  type: 'rating';
  paramName: string;
  label: string;
  disabled?: boolean;
  defaultCollapsed?: boolean;
}

export interface RangeFilter {
  type: 'range';
  label: string;
  minParamName: string;
  maxParamName: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  minPrepend?: React.ReactNode;
  maxPrepend?: React.ReactNode;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  disabled?: boolean;
  defaultCollapsed?: boolean;
}

export type Filter = ToggleGroupFilter | RangeFilter | RatingFilter | LinkGroupFilter;

interface Props {
  className?: string;
  filters: Streamable<Filter[]>;
  resetFiltersLabel?: Streamable<string>;
  paginationInfo?: Streamable<CursorPaginationInfo>;
  rangeFilterApplyLabel?: Streamable<string>;
  totalCount?: Streamable<string>;
}

export function FiltersPanel({
  className,
  filters,
  resetFiltersLabel,
  rangeFilterApplyLabel,
  totalCount,
  paginationInfo,
}: Props) {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <FiltersPanelInner
        className={className}
        filters={filters}
        paginationInfo={paginationInfo}
        rangeFilterApplyLabel={rangeFilterApplyLabel}
        resetFiltersLabel={resetFiltersLabel}
        totalCount={totalCount}
      />
    </Suspense>
  );
}

export function FiltersPanelInner({
  className,
  filters: streamableFilters,
  resetFiltersLabel: streamableResetFiltersLabel,
  rangeFilterApplyLabel: streamableRangeFilterApplyLabel,
  paginationInfo: streamablePaginationInfo,
  totalCount: streamableTotalCount,
}: Props) {
  const filters = useStreamable(streamableFilters);
  const resetFiltersLabel = useStreamable(streamableResetFiltersLabel) ?? 'Reset all filters';
  const rangeFilterApplyLabel = useStreamable(streamableRangeFilterApplyLabel);
  const paginationInfo = useStreamable(streamablePaginationInfo);
  const totalCount = useStreamable(streamableTotalCount) ?? '0';
  const startCursorParamName = paginationInfo?.startCursorParamName ?? 'before';
  const endCursorParamName = paginationInfo?.endCursorParamName ?? 'after';
  const [params, setParams] = useQueryStates(
    {
      ...getFilterParsers(filters),
      [startCursorParamName]: parseAsString,
      [endCursorParamName]: parseAsString,
    },
    {
      shallow: false,
      history: 'push',
    },
  );
  const [isPending, startTransition] = useTransition();
  const [optimisticParams, setOptimisticParams] = useOptimistic(params);

  // Prevent accordion animations on first render
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const accordionItems = filters
    .map((filter, index) => ({
      key: `filter-${index}`,
      filter,
      defaultExpanded: 'defaultCollapsed' in filter && filter.defaultCollapsed ? false : index < 3,
    }));

  const defaultExpandedValues = accordionItems
    .filter((item) => item.defaultExpanded)
    .map((item) => item.key);

  if (filters.length === 0) return null;

  const handleReset = () => {
    startTransition(async () => {
      const nextParams = {
        ...Object.fromEntries(Object.entries(optimisticParams).map(([key]) => [key, null])),
        [startCursorParamName]: optimisticParams[startCursorParamName],
        [endCursorParamName]: optimisticParams[endCursorParamName],
      };

      setOptimisticParams(nextParams);
      await setParams(nextParams);
    });
  };

  return (
    <div
      className={clsx('flex h-full w-full flex-col bg-white', className)}
      data-pending={isPending ? true : null}
    >
      {/* Scrollable filter content */}
      <div className="flex-1">
        {/* Collapsible filter sections */}
        <AccordionPrimitive.Root
          defaultValue={defaultExpandedValues}
          type="multiple"
        >
          {accordionItems.map((accordionItem) => {
            const { key, filter } = accordionItem;

            return (
              <AccordionPrimitive.Item
                className="border-b border-gray-200"
                key={key}
                value={key}
              >
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between py-4 text-left focus:outline-none">
                    <span className="text-sm font-semibold text-foreground">{filter.label}</span>
                    <span className="flex h-5 w-5 items-center justify-center text-gray-400 transition-colors group-hover:text-foreground">
                      <Minus
                        className="hidden group-data-[state=open]:block"
                        size={16}
                        strokeWidth={1.5}
                      />
                      <Plus
                        className="hidden group-data-[state=closed]:block"
                        size={16}
                        strokeWidth={1.5}
                      />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content
                  className={clsx(
                    'overflow-hidden',
                    isMounted &&
                      'data-[state=closed]:animate-collapse data-[state=open]:animate-expand',
                  )}
                >
                  <div className="pb-4">
                    {renderFilterContent(
                      filter,
                      optimisticParams,
                      startTransition,
                      setOptimisticParams,
                      setParams,
                      startCursorParamName,
                      endCursorParamName,
                      rangeFilterApplyLabel,
                    )}
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            );
          })}
        </AccordionPrimitive.Root>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white pb-2 pt-4">
        <div className="space-y-3">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-gray-300 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-gray-400 hover:bg-gray-50"
            onClick={handleReset}
            type="button"
          >
            <Trash2 size={14} strokeWidth={1.5} />
            {resetFiltersLabel}
          </button>
          <Dialog.Close asChild>
            <button
              className="w-full rounded-sm bg-[#F92F7B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E91E63] active:bg-[#C2185B]"
              type="button"
            >
              Show {totalCount} Results
            </button>
          </Dialog.Close>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the content for each filter type inside an accordion section.
 */
function renderFilterContent(
  filter: Filter,
  optimisticParams: Record<string, unknown>,
  startTransition: (callback: () => Promise<void>) => void,
  setOptimisticParams: (params: Record<string, unknown>) => void,
  setParams: (params: Record<string, unknown>) => Promise<URLSearchParams>,
  startCursorParamName: string,
  endCursorParamName: string,
  rangeFilterApplyLabel?: string,
) {
  switch (filter.type) {
    case 'toggle-group':
      if (filter.renderAs === 'dropdown') {
        return (
          <DropdownFilter
            filter={filter}
            onChange={(value) => {
              startTransition(async () => {
                const nextParams = {
                  ...optimisticParams,
                  [startCursorParamName]: null,
                  [endCursorParamName]: null,
                  [filter.paramName]: value ? [value] : null,
                };

                setOptimisticParams(nextParams);
                await setParams(nextParams);
              });
            }}
            value={(optimisticParams[filter.paramName] as string[] | null)?.[0] ?? ''}
          />
        );
      }

      return (
        <div className="space-y-2.5">
          {filter.options.map((option) => (
            <FilterCheckbox
              checked={((optimisticParams[filter.paramName] as string[] | null) ?? []).includes(
                option.value,
              )}
              disabled={option.disabled}
              id={option.value}
              key={option.value}
              label={option.label}
              onChange={(checked) => {
                startTransition(async () => {
                  const currentValues =
                    (optimisticParams[filter.paramName] as string[] | null) ?? [];
                  const newValues = checked
                    ? [...currentValues, option.value]
                    : currentValues.filter((v: string) => v !== option.value);

                  const nextParams = {
                    ...optimisticParams,
                    [startCursorParamName]: null,
                    [endCursorParamName]: null,
                    [filter.paramName]: newValues.length === 0 ? null : newValues,
                  };

                  setOptimisticParams(nextParams);
                  await setParams(nextParams);
                });
              }}
            />
          ))}
        </div>
      );

    case 'range':
      return (
        <RangeInput
          applyLabel={rangeFilterApplyLabel}
          disabled={filter.disabled}
          max={filter.max}
          maxLabel={filter.maxLabel}
          maxName={filter.maxParamName}
          maxPlaceholder={filter.maxPlaceholder}
          maxPrepend={filter.maxPrepend}
          min={filter.min}
          minLabel={filter.minLabel}
          minName={filter.minParamName}
          minPlaceholder={filter.minPlaceholder}
          minPrepend={filter.minPrepend}
          onChange={({ min, max }) => {
            startTransition(async () => {
              const nextParams = {
                ...optimisticParams,
                [filter.minParamName]: min,
                [filter.maxParamName]: max,
                [startCursorParamName]: null,
                [endCursorParamName]: null,
              };

              setOptimisticParams(nextParams);
              await setParams(nextParams);
            });
          }}
          value={{
            min: (optimisticParams[filter.minParamName] as number | null) ?? null,
            max: (optimisticParams[filter.maxParamName] as number | null) ?? null,
          }}
        />
      );

    case 'rating':
      return (
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <FilterCheckbox
              checked={
                (optimisticParams[filter.paramName] as string[] | null)?.includes(
                  rating.toString(),
                ) ?? false
              }
              disabled={filter.disabled}
              id={`rating-${rating}`}
              key={rating}
              label={<Rating rating={rating} showRating={false} />}
              onChange={(checked) => {
                startTransition(async () => {
                  const ratings = new Set(
                    (optimisticParams[filter.paramName] as string[] | null) ?? [],
                  );

                  if (checked) ratings.add(rating.toString());
                  else ratings.delete(rating.toString());

                  const nextParams = {
                    ...optimisticParams,
                    [filter.paramName]: Array.from(ratings),
                    [startCursorParamName]: null,
                    [endCursorParamName]: null,
                  };

                  setOptimisticParams(nextParams);
                  await setParams(nextParams);
                });
              }}
            />
          ))}
        </div>
      );

    case 'link-group':
      return (
        <ul className="space-y-2.5">
          {filter.links.map((link, linkIndex) => (
            <li key={linkIndex.toString()}>
              <Link
                className="block text-sm text-gray-600 transition-colors duration-200 hover:text-foreground"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

/**
 * Porsche-style checkbox with clean styling and animated checkmark.
 */
function FilterCheckbox({
  id,
  label,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <input
        checked={checked}
        className="relative mr-3 h-[18px] w-[18px] cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white transition-all checked:border-[#F92F7B] checked:bg-[#F92F7B] focus:outline-none focus:ring-2 focus:ring-[#F92F7B] focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled}
        id={id}
        onChange={(e) => onChange(e.target.checked)}
        onInput={(e) => {
          const target = e.currentTarget;

          if (target.checked) {
            Object.assign(target.style, CHECKMARK_STYLES);
          } else {
            target.style.backgroundImage = 'none';
          }
        }}
        ref={(el) => {
          if (el) {
            if (checked) {
              Object.assign(el.style, CHECKMARK_STYLES);
            } else {
              el.style.backgroundImage = 'none';
            }
          }
        }}
        style={{ backgroundImage: 'none' }}
        type="checkbox"
      />
      <label
        className={clsx(
          'flex cursor-pointer items-center text-sm',
          disabled && 'cursor-not-allowed text-gray-400',
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}

/**
 * Dropdown variant for toggle-group filters (Porsche-style select).
 */
function DropdownFilter({
  filter,
  value,
  onChange,
}: {
  filter: ToggleGroupFilter;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        className="w-full cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-foreground transition-colors focus:border-[#F92F7B] focus:outline-none focus:ring-1 focus:ring-[#F92F7B]"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        <option value="">All {filter.label}</option>
        {filter.options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={16}
        strokeWidth={1.5}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Skeleton States                               */
/* -------------------------------------------------------------------------- */

export function FiltersSkeleton() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex-1 divide-y divide-gray-200">
        <FilterSectionSkeleton>
          <ToggleGroupSkeleton options={4} seed={2} />
        </FilterSectionSkeleton>
        <FilterSectionSkeleton>
          <ToggleGroupSkeleton options={3} seed={1} />
        </FilterSectionSkeleton>
        <FilterSectionSkeleton>
          <RangeSkeleton />
        </FilterSectionSkeleton>
      </div>
      {/* Footer skeleton */}
      <div className="border-t border-gray-200 pb-2 pt-4">
        <div className="space-y-3">
          <div className="h-[46px] w-full animate-pulse rounded-sm bg-gray-100" />
          <div className="h-[46px] w-full animate-pulse rounded-sm bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function FilterSectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-[8ch] animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ToggleGroupSkeleton({ options, seed = 0 }: { options: number; seed?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: options }, (_, i) => {
        const width = Math.floor(((i * 3 + 7 + seed) % 8) + 6);

        return (
          <div className="flex items-center" key={i}>
            <div className="mr-3 h-[18px] w-[18px] animate-pulse rounded-sm bg-gray-200" />
            <div
              className="h-4 w-[var(--width)] animate-pulse rounded bg-gray-200"
              style={{ '--width': `${width}ch` } as React.CSSProperties}
            />
          </div>
        );
      })}
    </div>
  );
}

function RangeSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-[10ch] animate-pulse rounded-md bg-gray-200" />
      <div className="h-10 w-[10ch] animate-pulse rounded-md bg-gray-200" />
      <div className="h-8 w-8 shrink-0 animate-pulse rounded bg-gray-200" />
    </div>
  );
}
