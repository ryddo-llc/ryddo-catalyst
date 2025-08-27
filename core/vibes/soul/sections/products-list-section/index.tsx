import { Sliders } from 'lucide-react';
import { Suspense } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Button } from '@/vibes/soul/primitives/button';
import { CursorPagination, CursorPaginationInfo } from '@/vibes/soul/primitives/cursor-pagination';
import { NumberedPagination, NumberedPaginationInfo } from '@/vibes/soul/primitives/numbered-pagination';
import { Product } from '@/vibes/soul/primitives/product-card';
import * as SidePanel from '@/vibes/soul/primitives/side-panel';
import { Breadcrumb, Breadcrumbs, BreadcrumbsSkeleton } from '@/vibes/soul/sections/breadcrumbs';
import { ProductList } from '@/vibes/soul/sections/product-list';
import { Filter, FiltersPanel } from '@/vibes/soul/sections/products-list-section/filters-panel';
import {
  Sorting,
  SortingSkeleton,
  Option as SortOption,
} from '@/vibes/soul/sections/products-list-section/sorting';

interface Props {
  breadcrumbs?: Streamable<Breadcrumb[]>;
  totalCount: Streamable<string>;
  products: Streamable<Product[]>;
  filters: Streamable<Filter[]>;
  sortOptions: Streamable<SortOption[]>;
  compareProducts?: Streamable<Product[]>;
  paginationInfo?: Streamable<CursorPaginationInfo>;
  numberedPaginationInfo?: Streamable<NumberedPaginationInfo>;
  useNumberedPagination?: boolean;
  compareHref?: string;
  compareLabel?: Streamable<string>;
  showCompare?: Streamable<boolean>;
  filterLabel?: string;
  filtersPanelTitle?: Streamable<string>;
  resetFiltersLabel?: Streamable<string>;
  rangeFilterApplyLabel?: Streamable<string>;
  sortLabel?: Streamable<string | null>;
  sortPlaceholder?: Streamable<string | null>;
  sortParamName?: string;
  sortDefaultValue?: string;
  compareParamName?: string;
  emptyStateSubtitle?: Streamable<string>;
  emptyStateTitle?: Streamable<string>;
  placeholderCount?: number;
  removeLabel?: Streamable<string>;
  maxItems?: number;
  maxCompareLimitMessage?: Streamable<string>;
}

export function ProductsListSection({
  breadcrumbs: streamableBreadcrumbs,
  totalCount,
  products,
  compareProducts,
  sortOptions: streamableSortOptions,
  sortDefaultValue,
  filters,
  compareHref,
  compareLabel,
  showCompare,
  paginationInfo,
  numberedPaginationInfo,
  useNumberedPagination = false,
  filterLabel = 'Filters',
  filtersPanelTitle: streamableFiltersPanelTitle = 'Filters',
  resetFiltersLabel,
  rangeFilterApplyLabel,
  sortLabel: streamableSortLabel,
  sortPlaceholder: streamableSortPlaceholder,
  sortParamName,
  compareParamName,
  emptyStateSubtitle,
  emptyStateTitle,
  placeholderCount = 8,
  removeLabel,
  maxItems,
  maxCompareLimitMessage,
}: Props) {
  return (
    <div className="group/products-list-section @container" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="mx-auto max-w-screen-2xl px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-12">
        <div>
          <Stream fallback={<BreadcrumbsSkeleton />} value={streamableBreadcrumbs}>
            {(breadcrumbs) =>
              breadcrumbs && breadcrumbs.length > 1 && <Breadcrumbs breadcrumbs={breadcrumbs} />
            }
          </Stream>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 pt-6 text-foreground">
            <Suspense
              fallback={
                <div className="text-sm text-gray-600 @3xl:ml-64 @4xl:ml-72">
                  <span className="inline-flex h-4 w-32 animate-pulse rounded bg-contrast-100" />
                </div>
              }
            >
              <Stream
                value={Streamable.all([products, totalCount])}
              >
                {([productList, total]) => {
                  const totalResults = parseInt(total, 10) || 0;
                  const currentResults = productList.length;
                  const startResult = currentResults > 0 ? 1 : 0;
                  const endResult = currentResults;
                  
                  // If we have numbered pagination info, use it to calculate the correct range
                  if (useNumberedPagination && numberedPaginationInfo) {
                    // Handled in a separate stream to avoid complexity
                    return (
                      <Stream value={numberedPaginationInfo}>
                        {(numberedPaginationData) => {
                          const { currentPage, itemsPerPage } = numberedPaginationData;
                          const calculatedStartResult = (currentPage - 1) * itemsPerPage + 1;
                          const calculatedEndResult = Math.min(currentPage * itemsPerPage, totalResults);
                          
                          return (
                            <div className="text-sm text-gray-600 @3xl:ml-64 @4xl:ml-72">
                              {calculatedStartResult === calculatedEndResult 
                                ? `Showing ${calculatedStartResult} of ${totalResults} results`
                                : `Showing ${calculatedStartResult}-${calculatedEndResult} of ${totalResults} results`
                              }
                            </div>
                          );
                        }}
                      </Stream>
                    );
                  }

                  return (
                    <div className="text-sm text-gray-600 @3xl:ml-64 @4xl:ml-72">
                      {startResult === endResult 
                        ? `Showing ${startResult} of ${totalResults} results`
                        : `Showing ${startResult}-${endResult} of ${totalResults} results`
                      }
                    </div>
                  );
                }}
              </Stream>
            </Suspense>
            <div className="flex gap-2">
              <Stream
                fallback={<SortingSkeleton />}
                value={Streamable.all([
                  streamableSortLabel,
                  streamableSortOptions,
                  streamableSortPlaceholder,
                ])}
              >
                {([label, options, placeholder]) => (
                  <Sorting
                    defaultValue={sortDefaultValue}
                    label={label}
                    options={options}
                    paramName={sortParamName}
                    placeholder={placeholder}
                  />
                )}
              </Stream>
              <div className="block @3xl:hidden">
                <SidePanel.Root>
                  <SidePanel.Trigger asChild>
                    <Button size="medium" variant="secondary">
                      {filterLabel}
                      <span className="hidden @xl:block">
                        <Sliders size={20} />
                      </span>
                    </Button>
                  </SidePanel.Trigger>
                  <Stream value={streamableFiltersPanelTitle}>
                    {(filtersPanelTitle) => (
                      <SidePanel.Content title={filtersPanelTitle}>
                        <FiltersPanel
                          filters={filters}
                          paginationInfo={paginationInfo}
                          rangeFilterApplyLabel={rangeFilterApplyLabel}
                          resetFiltersLabel={resetFiltersLabel}
                        />
                      </SidePanel.Content>
                    )}
                  </Stream>
                </SidePanel.Root>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-8 @4xl:gap-10">
          <aside className="hidden w-52 @3xl:block @4xl:w-60">
            <Stream value={streamableFiltersPanelTitle}>
              {(filtersPanelTitle) => <h2 className="sr-only">{filtersPanelTitle}</h2>}
            </Stream>
            <FiltersPanel
              className="sticky top-4"
              filters={filters}
              paginationInfo={paginationInfo}
              rangeFilterApplyLabel={rangeFilterApplyLabel}
              resetFiltersLabel={resetFiltersLabel}
            />
          </aside>

          <div className="group-has-data-pending/products-list-section:animate-pulse flex-1">
            <ProductList
              compareHref={compareHref}
              compareLabel={compareLabel}
              compareParamName={compareParamName}
              compareProducts={compareProducts}
              emptyStateSubtitle={emptyStateSubtitle}
              emptyStateTitle={emptyStateTitle}
              maxCompareLimitMessage={maxCompareLimitMessage}
              maxItems={maxItems}
              placeholderCount={placeholderCount}
              products={products}
              removeLabel={removeLabel}
              showCompare={showCompare}
            />

            {(() => {
              if (useNumberedPagination && numberedPaginationInfo) {
                return <NumberedPagination info={numberedPaginationInfo} />;
              }
              
              if (paginationInfo) {
                return <CursorPagination info={paginationInfo} />;
              }

              return null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
