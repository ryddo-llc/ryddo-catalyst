'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { clsx } from 'clsx';
import { Check, ChevronDown, X } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import { Suspense, useId, useOptimistic, useState, useTransition } from 'react';

import { RangeInput } from '@/vibes/soul/form/range-input';
import { Streamable, useStreamable } from '@/vibes/soul/lib/streamable';
import { Button } from '@/vibes/soul/primitives/button';
import { CursorPaginationInfo } from '@/vibes/soul/primitives/cursor-pagination';
import { Rating } from '@/vibes/soul/primitives/rating';
import { Link } from '~/components/link';

import { getFilterParsers } from './filter-parsers';

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
}

export interface RatingFilter {
  type: 'rating';
  paramName: string;
  label: string;
  disabled?: boolean;
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
}

export type Filter = ToggleGroupFilter | RangeFilter | RatingFilter | LinkGroupFilter;

interface Props {
  className?: string;
  filters: Streamable<Filter[]>;
  resetFiltersLabel?: Streamable<string>;
  paginationInfo?: Streamable<CursorPaginationInfo>;
  rangeFilterApplyLabel?: Streamable<string>;
  clearAllLabel?: Streamable<string>;
  showMoreLabel?: Streamable<string>;
  showLessLabel?: Streamable<string>;
}

const VISIBLE_OPTIONS_COUNT = 5;

// Type helper functions to avoid type assertions
function getStringArrayParam(
  params: Record<string, unknown>,
  key: string,
): string[] | undefined {
  const value = params[key];

  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
    return value;
  }

  return undefined;
}

function getNumberParam(params: Record<string, unknown>, key: string): number | null {
  const value = params[key];

  if (typeof value === 'number') {
    return value;
  }

  return null;
}

export function FiltersPanel({
  className,
  filters,
  resetFiltersLabel,
  rangeFilterApplyLabel,
  clearAllLabel,
  showMoreLabel,
  showLessLabel,
}: Props) {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <FiltersPanelInner
        className={className}
        clearAllLabel={clearAllLabel}
        filters={filters}
        rangeFilterApplyLabel={rangeFilterApplyLabel}
        resetFiltersLabel={resetFiltersLabel}
        showLessLabel={showLessLabel}
        showMoreLabel={showMoreLabel}
      />
    </Suspense>
  );
}

export function FiltersPanelInner({
  className,
  filters: streamableFilters,
  resetFiltersLabel: streamableResetFiltersLabel,
  rangeFilterApplyLabel: streamableRangeFilterApplyLabel,
  clearAllLabel: streamableClearAllLabel,
  showMoreLabel: streamableShowMoreLabel,
  showLessLabel: streamableShowLessLabel,
  paginationInfo: streamablePaginationInfo,
}: Props) {
  const filters = useStreamable(streamableFilters);
  const resetFiltersLabel = useStreamable(streamableResetFiltersLabel) ?? 'Reset filters';
  const rangeFilterApplyLabel = useStreamable(streamableRangeFilterApplyLabel);
  const clearAllLabel = useStreamable(streamableClearAllLabel) ?? 'Clear all';
  const showMoreLabel = useStreamable(streamableShowMoreLabel) ?? 'Show more';
  const showLessLabel = useStreamable(streamableShowLessLabel) ?? 'Show less';
  const paginationInfo = useStreamable(streamablePaginationInfo);
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

  // Get active filters for chips display
  const activeFilters = getActiveFilters(filters, optimisticParams);
  const hasActiveFilters = activeFilters.length > 0;

  // Determine which accordions should be open by default
  const nonLinkFilters = filters.filter((filter) => filter.type !== 'link-group');
  const defaultExpandedFilters = nonLinkFilters.slice(0, 3).map((_, i) => `filter-${i}`);

  const linkGroupFilters = filters.filter(
    (filter): filter is LinkGroupFilter => filter.type === 'link-group',
  );

  const handleClearAll = () => {
    startTransition(async () => {
      const nextParams = {
        ...Object.fromEntries(Object.entries(optimisticParams).map(([key]) => [key, null])),
        [startCursorParamName]: null,
        [endCursorParamName]: null,
      };

      setOptimisticParams(nextParams);
      await setParams(nextParams);
    });
  };

  const handleRemoveFilter = (paramName: string, value?: string) => {
    startTransition(async () => {
      let nextValue = null;
      const currentArray = getStringArrayParam(optimisticParams, paramName);

      if (value && currentArray) {
        const filtered = currentArray.filter((v) => v !== value);

        nextValue = filtered.length > 0 ? filtered : null;
      }

      const nextParams = {
        ...optimisticParams,
        [paramName]: nextValue,
        [startCursorParamName]: null,
        [endCursorParamName]: null,
      };

      setOptimisticParams(nextParams);
      await setParams(nextParams);
    });
  };

  if (filters.length === 0) return null;

  return (
    <div
      className={clsx('h-fit w-full rounded-lg bg-white', className)}
      data-pending={isPending ? true : null}
    >
      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="border-b border-contrast-100 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((activeFilter) => (
              <FilterChip
                key={`${activeFilter.paramName}-${activeFilter.value}`}
                label={activeFilter.label}
                onRemove={() => handleRemoveFilter(activeFilter.paramName, activeFilter.value)}
              />
            ))}
            <button
              className="ml-auto text-sm font-medium text-contrast-400 transition-colors hover:text-foreground"
              onClick={handleClearAll}
              type="button"
            >
              {clearAllLabel}
            </button>
          </div>
        </div>
      )}

      {/* Link Group Filters */}
      {linkGroupFilters.length > 0 && (
        <div className="border-b border-contrast-100 px-5 py-4">
          {linkGroupFilters.map((linkGroup, index) => (
            <div key={`link-group-${index}`}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{linkGroup.label}</h3>
              <ul className="space-y-1">
                {linkGroup.links.map((link, linkIndex) => (
                  <li key={`link-${index}-${linkIndex}`}>
                    <Link
                      className="block py-1.5 text-sm text-contrast-500 transition-colors hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Filter Accordions */}
      <AccordionPrimitive.Root
        className="divide-y divide-contrast-100"
        defaultValue={defaultExpandedFilters}
        type="multiple"
      >
        {nonLinkFilters.map((filter, index) => {
          const filterKey = `filter-${index}`;
          const activeCount = getFilterActiveCount(filter, optimisticParams);

          return (
            <FilterAccordionItem
              activeCount={activeCount}
              key={filterKey}
              label={filter.label}
              value={filterKey}
            >
              <FilterContent
                endCursorParamName={endCursorParamName}
                filter={filter}
                optimisticParams={optimisticParams}
                rangeFilterApplyLabel={rangeFilterApplyLabel}
                setOptimisticParams={setOptimisticParams}
                setParams={setParams}
                showLessLabel={showLessLabel}
                showMoreLabel={showMoreLabel}
                startCursorParamName={startCursorParamName}
                startTransition={startTransition}
              />
            </FilterAccordionItem>
          );
        })}
      </AccordionPrimitive.Root>

      {/* Reset Button */}
      <div className="p-5">
        <Button className="w-full" onClick={handleClearAll} size="small" variant="secondary">
          {resetFiltersLabel}
        </Button>
      </div>
    </div>
  );
}

// Filter Chip Component
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-contrast-100 py-1.5 pe-2 ps-3 text-xs font-medium text-foreground">
      {label}
      <button
        className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-contrast-200"
        onClick={onRemove}
        type="button"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// Filter Accordion Item Component
function FilterAccordionItem({
  value,
  label,
  activeCount,
  children,
}: {
  value: string;
  label: string;
  activeCount: number;
  children: React.ReactNode;
}) {
  return (
    <AccordionPrimitive.Item className="px-5" value={value}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {label}
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F92F7B] px-1.5 text-xs font-medium text-white">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 text-contrast-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
        <div className="pb-4">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

// Filter Checkbox Component
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
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <div className="flex items-center gap-2.5">
      <CheckboxPrimitive.Root
        checked={checked}
        className={clsx(
          'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked
            ? 'border-[#F92F7B] bg-[#F92F7B]'
            : 'border-contrast-200 bg-white hover:border-contrast-300',
        )}
        disabled={disabled}
        id={checkboxId}
        onCheckedChange={onChange}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label
        className={clsx(
          'cursor-pointer text-sm text-contrast-500 transition-colors hover:text-foreground',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        htmlFor={checkboxId}
      >
        {label}
      </label>
    </div>
  );
}

// Filter Content Component
function FilterContent({
  filter,
  optimisticParams,
  setOptimisticParams,
  setParams,
  startTransition,
  startCursorParamName,
  endCursorParamName,
  rangeFilterApplyLabel,
  showMoreLabel,
  showLessLabel,
}: {
  filter: ToggleGroupFilter | RangeFilter | RatingFilter;
  optimisticParams: Record<string, unknown>;
  setOptimisticParams: (params: Record<string, unknown>) => void;
  setParams: (params: Record<string, unknown>) => Promise<URLSearchParams>;
  startTransition: (callback: () => Promise<void>) => void;
  startCursorParamName: string;
  endCursorParamName: string;
  rangeFilterApplyLabel?: string;
  showMoreLabel: string;
  showLessLabel: string;
}) {
  const [showAll, setShowAll] = useState(false);

  switch (filter.type) {
    case 'toggle-group': {
      const visibleOptions = showAll
        ? filter.options
        : filter.options.slice(0, VISIBLE_OPTIONS_COUNT);
      const hasMoreOptions = filter.options.length > VISIBLE_OPTIONS_COUNT;
      const remainingCount = filter.options.length - VISIBLE_OPTIONS_COUNT;
      const currentValues = getStringArrayParam(optimisticParams, filter.paramName) ?? [];

      return (
        <div className="space-y-3">
          {visibleOptions.map((option) => (
            <FilterCheckbox
              checked={currentValues.includes(option.value)}
              disabled={option.disabled}
              id={`${filter.paramName}-${option.value}`}
              key={option.value}
              label={option.label}
              onChange={(checked) => {
                startTransition(async () => {
                  const newValues = checked
                    ? [...currentValues, option.value]
                    : currentValues.filter((v) => v !== option.value);

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
          {hasMoreOptions && (
            <button
              className="mt-2 text-sm font-medium text-[#F92F7B] transition-colors hover:text-[#E91E63]"
              onClick={() => setShowAll(!showAll)}
              type="button"
            >
              {showAll ? showLessLabel : `${showMoreLabel} (${remainingCount})`}
            </button>
          )}
        </div>
      );
    }

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
            min: getNumberParam(optimisticParams, filter.minParamName),
            max: getNumberParam(optimisticParams, filter.maxParamName),
          }}
        />
      );

    case 'rating': {
      const ratingValues = getStringArrayParam(optimisticParams, filter.paramName) ?? [];

      return (
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((ratingValue) => {
            const isChecked = ratingValues.includes(ratingValue.toString());

            return (
              <FilterCheckbox
                checked={isChecked}
                disabled={filter.disabled}
                id={`${filter.paramName}-${ratingValue}`}
                key={ratingValue}
                label={
                  <span className="flex items-center gap-1.5">
                    <Rating rating={ratingValue} showRating={false} />
                    <span className="text-contrast-400">& up</span>
                  </span>
                }
                onChange={(checked) => {
                  startTransition(async () => {
                    const ratings = new Set(ratingValues);

                    if (checked) {
                      ratings.add(ratingValue.toString());
                    } else {
                      ratings.delete(ratingValue.toString());
                    }

                    const nextParams = {
                      ...optimisticParams,
                      [filter.paramName]: ratings.size > 0 ? Array.from(ratings) : null,
                      [startCursorParamName]: null,
                      [endCursorParamName]: null,
                    };

                    setOptimisticParams(nextParams);
                    await setParams(nextParams);
                  });
                }}
              />
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

// Helper function to format range label
function formatRangeLabel(min: number | null, max: number | null): string {
  if (min !== null && max !== null) {
    return `$${min} - $${max}`;
  }

  if (min !== null) {
    return `$${min}+`;
  }

  return `Up to $${max}`;
}

// Helper function to get active filters for chips display
function getActiveFilters(
  filters: Filter[],
  params: Record<string, unknown>,
): Array<{ paramName: string; value?: string; label: string }> {
  const activeFilters: Array<{ paramName: string; value?: string; label: string }> = [];

  filters.forEach((filter) => {
    if (filter.type === 'toggle-group') {
      const values = getStringArrayParam(params, filter.paramName);

      if (values && values.length > 0) {
        values.forEach((value) => {
          const option = filter.options.find((opt) => opt.value === value);

          if (option) {
            activeFilters.push({
              paramName: filter.paramName,
              value,
              label: option.label,
            });
          }
        });
      }
    } else if (filter.type === 'range') {
      const min = getNumberParam(params, filter.minParamName);
      const max = getNumberParam(params, filter.maxParamName);

      if (min !== null || max !== null) {
        activeFilters.push({
          paramName: filter.minParamName,
          label: formatRangeLabel(min, max),
        });
      }
    } else if (filter.type === 'rating') {
      const values = getStringArrayParam(params, filter.paramName);

      if (values && values.length > 0) {
        const maxRating = Math.max(...values.map(Number));

        activeFilters.push({
          paramName: filter.paramName,
          label: `${maxRating}+ Stars`,
        });
      }
    }
  });

  return activeFilters;
}

// Helper function to get active filter count for accordion badge
function getFilterActiveCount(
  filter: ToggleGroupFilter | RangeFilter | RatingFilter,
  params: Record<string, unknown>,
): number {
  switch (filter.type) {
    case 'toggle-group': {
      const values = getStringArrayParam(params, filter.paramName);

      return values?.length ?? 0;
    }

    case 'range': {
      const min = getNumberParam(params, filter.minParamName);
      const max = getNumberParam(params, filter.maxParamName);

      return min !== null || max !== null ? 1 : 0;
    }

    case 'rating': {
      const values = getStringArrayParam(params, filter.paramName);

      return values?.length ?? 0;
    }

    default:
      return 0;
  }
}

// Skeleton Components
export function FiltersSkeleton() {
  return (
    <div className="h-fit w-full rounded-lg bg-white">
      {/* Active filters skeleton */}
      <div className="border-b border-contrast-100 px-5 py-4">
        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-contrast-100" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-contrast-100" />
        </div>
      </div>

      {/* Filter accordions skeleton */}
      <div className="divide-y divide-contrast-100">
        <FilterAccordionSkeleton optionsCount={4} />
        <FilterAccordionSkeleton optionsCount={3} />
        <FilterAccordionSkeleton optionsCount={2} />
      </div>

      {/* Reset button skeleton */}
      <div className="p-5">
        <div className="h-10 w-full animate-pulse rounded-md bg-contrast-100" />
      </div>
    </div>
  );
}

function FilterAccordionSkeleton({ optionsCount }: { optionsCount: number }) {
  return (
    <div className="px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-24 animate-pulse rounded bg-contrast-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-contrast-100" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: optionsCount }, (_, i) => (
          <div className="flex items-center gap-2.5" key={i}>
            <div className="h-5 w-5 animate-pulse rounded bg-contrast-100" />
            <div
              className="h-4 animate-pulse rounded bg-contrast-100"
              style={{ width: `${Math.floor(Math.random() * 40 + 60)}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
