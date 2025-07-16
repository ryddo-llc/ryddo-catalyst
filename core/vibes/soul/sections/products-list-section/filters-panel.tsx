/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client';

import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import { Suspense, useOptimistic, useTransition } from 'react';

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
}


export function FiltersPanel({
  className,
  filters,
  resetFiltersLabel,
  rangeFilterApplyLabel,
}: Props) {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <FiltersPanelInner
        className={className}
        filters={filters}
        rangeFilterApplyLabel={rangeFilterApplyLabel}
        resetFiltersLabel={resetFiltersLabel}
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
}: Props) {
  const filters = useStreamable(streamableFilters);
  const resetFiltersLabel = useStreamable(streamableResetFiltersLabel) ?? 'Reset filters';
  const rangeFilterApplyLabel = useStreamable(streamableRangeFilterApplyLabel);
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
  const accordionItems = filters
    .filter((filter) => filter.type !== 'link-group')
    .map((filter, index) => ({
      key: index.toString(),
      value: index.toString(),
      filter,
      expanded: index < 3,
    }));

  if (filters.length === 0) return null;

  const linkGroupFilters = filters.filter(
    (filter): filter is LinkGroupFilter => filter.type === 'link-group',
  );

  return (
    <div
      className={clsx(
        'h-fit w-full space-y-6 rounded-lg bg-white p-5 shadow-sm md:w-[220px]',
        className,
      )}
      data-pending={isPending ? true : null}
    >
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-bold">Let&apos;s find you a scooter!</h3>
        <p className="mb-3 text-sm">
          Welcome back <span className="text-[#F92F7B]">thomas</span>! Please tell us all about your
          ideal new e-scooter and we can make some suggestions.
        </p>
        <div className="mt-4 flex w-full gap-1">
          <input
            className="min-w-0 flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm text-[#F92F7B] placeholder:text-[#F92F7B]"
            placeholder="Search..."
            type="text"
          />
          <button className="flex-shrink-0 rounded-r-md bg-[#F92F7B] px-3 py-2 text-white hover:bg-[#E91E63] active:bg-[#C2185B] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {linkGroupFilters.map((linkGroup, index) => (
        <div key={index.toString()}>
          <h3 className="mb-3 font-bold">{linkGroup.label}</h3>
          <ul>
            {linkGroup.links.map((link, linkIndex) => (
              <li className="py-1" key={linkIndex.toString()}>
                <div className="flex items-center">
                  <input
                    className="mr-2 h-4 w-4 appearance-none border-2 border-[#F92F7B] checked:bg-[#F92F7B] rounded focus:ring-[#F92F7B] focus:ring-opacity-25"
                    id={`link-${index}-${linkIndex}`}
                    type="checkbox"
                  />
                  <label className="text-sm" htmlFor={`link-${index}-${linkIndex}`}>
                    <Link
                      className="text-gray-700 transition-colors duration-300 ease-out hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </label>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 h-px bg-[#DBDBDB]" />
        </div>
      ))}

      {accordionItems.map((accordionItem) => {
        const { key, filter } = accordionItem;

        switch (filter.type) {
          case 'toggle-group':
            return (
              <div className="mb-6" key={key}>
                <div className="mb-3 flex items-center">
                  <input
                    className="mr-2 h-4 w-4 appearance-none border-2 border-[#F92F7B] checked:bg-[#F92F7B] rounded focus:ring-[#F92F7B] focus:ring-opacity-25"
                    id={`filter-${key}`}
                    type="checkbox"
                  />
                  <label className="font-bold" htmlFor={`filter-${key}`}>
                    {filter.label}
                  </label>
                </div>
                <div className="space-y-2">
                  {filter.options.map((option) => (
                    <div className="flex items-center" key={option.value}>
                      <input
                        checked={(optimisticParams[filter.paramName] ?? []).includes(option.value)}
                        className="relative mr-2 h-4 w-4 appearance-none rounded border-2 border-[var(--primary,#F92F7B)] bg-white checked:border-[var(--primary,#F92F7B)] checked:bg-[var(--primary,#F92F7B)] focus:ring-[var(--primary,#F92F7B)] focus:ring-opacity-25"
                        disabled={option.disabled}
                        id={option.value}
                        onChange={(e) => {
                          startTransition(async () => {
                            const currentValues = optimisticParams[filter.paramName] ?? [];
                            const newValues = e.target.checked
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
                        onInput={(e) => {
                          const target = e.currentTarget;

                          if (target.checked) {
                            target.style.backgroundImage = `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e")`;
                            target.style.backgroundSize = '100% 100%';
                            target.style.backgroundPosition = 'center';
                            target.style.backgroundRepeat = 'no-repeat';
                          } else {
                            target.style.backgroundImage = 'none';
                          }
                        }}
                        ref={(el) => {
                          if (
                            el &&
                            (optimisticParams[filter.paramName] ?? []).includes(option.value)
                          ) {
                            el.style.backgroundImage = `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e")`;
                            el.style.backgroundSize = '100% 100%';
                            el.style.backgroundPosition = 'center';
                            el.style.backgroundRepeat = 'no-repeat';
                          }
                        }}
                        style={{
                          backgroundImage: 'none',
                        }}
                        type="checkbox"
                      />
                      <label className="text-sm" htmlFor={option.value}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'range':
            return (
              <div className="mb-6" key={key}>
                <div className="mb-3 flex items-center">
                  <input
                    className="mr-2 h-4 w-4 appearance-none border-2 border-[#F92F7B] checked:bg-[#F92F7B] rounded focus:ring-[#F92F7B] focus:ring-opacity-25"
                    id={`filter-${key}`}
                    type="checkbox"
                  />
                  <label className="font-bold" htmlFor={`filter-${key}`}>
                    {filter.label}
                  </label>
                </div>
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
                    min: optimisticParams[filter.minParamName] ?? null,
                    max: optimisticParams[filter.maxParamName] ?? null,
                  }}
                />
              </div>
            );

          case 'rating':
            return (
              <div className="mb-6" key={key}>
                <div className="mb-3 flex items-center">
                  <input
                    className="mr-2 h-4 w-4 appearance-none border-2 border-[#F92F7B] checked:bg-[#F92F7B] rounded focus:ring-[#F92F7B] focus:ring-opacity-25"
                    id={`filter-${key}`}
                    type="checkbox"
                  />
                  <label className="font-bold" htmlFor={`filter-${key}`}>
                    {filter.label}
                  </label>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div className="flex items-center" key={rating}>
                      <input
                        checked={
                          optimisticParams[filter.paramName]?.includes(rating.toString()) ?? false
                        }
                        className="relative mr-2 h-4 w-4 appearance-none rounded border-2 border-[var(--primary,#F92F7B)] bg-white checked:border-[var(--primary,#F92F7B)] checked:bg-[var(--primary,#F92F7B)] focus:ring-[var(--primary,#F92F7B)] focus:ring-opacity-25"
                        disabled={filter.disabled}
                        id={`rating-${rating}`}
                        onChange={(e) => {
                          startTransition(async () => {
                            const ratings = new Set(optimisticParams[filter.paramName]);

                            if (e.target.checked) ratings.add(rating.toString());
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
                        onInput={(e) => {
                          const target = e.currentTarget;

                          if (target.checked) {
                            target.style.backgroundImage = `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e")`;
                            target.style.backgroundSize = '100% 100%';
                            target.style.backgroundPosition = 'center';
                            target.style.backgroundRepeat = 'no-repeat';
                          } else {
                            target.style.backgroundImage = 'none';
                          }
                        }}
                        ref={(el) => {
                          if (
                            el &&
                            (optimisticParams[filter.paramName] ?? []).includes(rating.toString())
                          ) {
                            el.style.backgroundImage = `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e")`;
                            el.style.backgroundSize = '100% 100%';
                            el.style.backgroundPosition = 'center';
                            el.style.backgroundRepeat = 'no-repeat';
                          }
                        }}
                        style={{
                          backgroundImage: 'none',
                        }}
                        type="checkbox"
                      />
                      <label className="flex items-center text-sm" htmlFor={`rating-${rating}`}>
                        <Rating rating={rating} showRating={false} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}

      <Button
        className="w-full"
        onClick={() => {
          startTransition(async () => {
            const nextParams = {
              ...Object.fromEntries(Object.entries(optimisticParams).map(([key]) => [key, null])),
              [startCursorParamName]: optimisticParams[startCursorParamName],
              [endCursorParamName]: optimisticParams[endCursorParamName],
            };

            setOptimisticParams(nextParams);
            await setParams(nextParams);
          });
        }}
        size="small"
        variant="secondary"
      >
        {resetFiltersLabel}
      </Button>
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="h-fit w-full space-y-6 rounded-lg bg-white p-5 shadow-sm md:w-[220px]">
      <div className="space-y-4">
        <div className="h-6 w-[15ch] animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>

      <FilterSkeleton>
        <ToggleGroupSkeleton options={4} seed={2} />
      </FilterSkeleton>
      <FilterSkeleton>
        <ToggleGroupSkeleton options={3} seed={1} />
      </FilterSkeleton>
      <FilterSkeleton>
        <RangeSkeleton />
      </FilterSkeleton>
      {/* Reset Filters Button */}
      <div className="h-10 w-full animate-pulse rounded-md bg-gray-100" />
    </div>
  );
}

function FilterSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="h-5 w-[8ch] animate-pulse rounded bg-gray-200" />
      <div>{children}</div>
    </div>
  );
}

function ToggleGroupSkeleton({ options, seed = 0 }: { options: number; seed?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: options }, (_, i) => {
        const width = Math.floor(((i * 3 + 7 + seed) % 8) + 6);

        return (
          <div className="flex items-center" key={i}>
            <div className="mr-2 h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div
              className="h-4 w-[var(--width)] animate-pulse rounded bg-gray-200"
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
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
