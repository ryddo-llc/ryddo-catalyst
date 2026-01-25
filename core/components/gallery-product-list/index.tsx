'use client';

import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { CompareDrawer, CompareDrawerProvider } from '@/vibes/soul/primitives/compare-drawer';
import { type Product, ProductCardSkeleton } from '@/vibes/soul/primitives/product-card';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { GalleryProduct, GalleryProductCard } from '~/components/gallery-product-card';

export interface GalleryProductListProps {
  products: Streamable<GalleryProduct[]>;
  compareProducts?: Streamable<Product[]>;
  className?: string;
  showCompare?: Streamable<boolean>;
  compareHref?: string;
  compareLabel?: Streamable<string>;
  compareParamName?: string;
  emptyStateTitle?: Streamable<string>;
  emptyStateSubtitle?: Streamable<string>;
  placeholderCount?: number;
  removeLabel?: Streamable<string>;
  maxItems?: number;
  maxCompareLimitMessage?: Streamable<string>;
  addToCartLabel?: string;
  preorderLabel?: string;
}

export function GalleryProductList({
  products: streamableProducts,
  className,
  showCompare: streamableShowCompare = true,
  compareHref,
  compareProducts: streamableCompareProducts = [],
  compareLabel: streamableCompareLabel = 'Compare',
  compareParamName = 'compare',
  emptyStateTitle = 'No products found',
  emptyStateSubtitle = 'Try browsing our complete catalog of products.',
  placeholderCount = 6,
  removeLabel: streamableRemoveLabel,
  maxItems,
  maxCompareLimitMessage: streamableMaxCompareLimitMessage,
  addToCartLabel = 'Add to Cart',
  preorderLabel = 'Preorder',
}: GalleryProductListProps) {
  return (
    <Stream
      fallback={<GalleryProductListSkeleton placeholderCount={placeholderCount} />}
      value={Streamable.all([
        streamableProducts,
        streamableCompareLabel,
        streamableShowCompare,
        streamableCompareProducts,
        streamableRemoveLabel,
        streamableMaxCompareLimitMessage,
      ])}
    >
      {([
        products,
        compareLabel,
        showCompare,
        compareProducts,
        removeLabel,
        maxCompareLimitMessage,
      ]) => {
        if (products.length === 0) {
          return (
            <GalleryProductListEmptyState
              emptyStateSubtitle={emptyStateSubtitle}
              emptyStateTitle={emptyStateTitle}
              placeholderCount={placeholderCount}
            />
          );
        }

        return (
          <CompareDrawerProvider
            items={compareProducts}
            maxCompareLimitMessage={maxCompareLimitMessage}
            maxItems={maxItems}
          >
            <div className={clsx('w-full @container', className)}>
              <div className="mx-auto grid grid-cols-1 gap-6 @3xl:grid-cols-2">
                {products.map((product) => (
                  <GalleryProductCard
                    addToCartLabel={addToCartLabel}
                    compareLabel={compareLabel}
                    compareParamName={compareParamName}
                    key={product.id}
                    preorderLabel={preorderLabel}
                    product={product}
                    showCompare={showCompare}
                  />
                ))}
              </div>
            </div>
            {showCompare && (
              <CompareDrawer
                href={compareHref}
                paramName={compareParamName}
                removeLabel={removeLabel}
                submitLabel={compareLabel}
              />
            )}
          </CompareDrawerProvider>
        );
      }}
    </Stream>
  );
}

function GalleryProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Left: Image skeleton */}
        <div className="w-full p-3 md:w-1/2">
          <Skeleton.Box className="aspect-[4/3] w-full rounded-xl" />
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <Skeleton.Box className="aspect-[4/3] rounded-lg" key={i} />
            ))}
          </div>
        </div>
        {/* Right: Details skeleton */}
        <div className="flex w-full flex-col justify-center p-4 md:w-1/2 md:p-6">
          <Skeleton.Box className="h-6 w-3/4 rounded" />
          <Skeleton.Box className="mt-2 h-8 w-1/3 rounded" />
          <div className="mt-4 flex gap-2">
            <Skeleton.Box className="h-10 flex-1 rounded-lg" />
            <Skeleton.Box className="h-10 w-24 rounded-lg" />
            <Skeleton.Box className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryProductListSkeleton({
  className,
  placeholderCount = 6,
}: Pick<GalleryProductListProps, 'className' | 'placeholderCount'>) {
  return (
    <Skeleton.Root
      className={clsx('group-has-data-pending/product-list:animate-pulse', className)}
      pending
    >
      <div className="mx-auto grid grid-cols-1 gap-6 @3xl:grid-cols-2">
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <GalleryProductCardSkeleton key={index} />
        ))}
      </div>
    </Skeleton.Root>
  );
}

export function GalleryProductListEmptyState({
  className,
  placeholderCount = 6,
  emptyStateTitle,
  emptyStateSubtitle,
}: Pick<
  GalleryProductListProps,
  'className' | 'placeholderCount' | 'emptyStateTitle' | 'emptyStateSubtitle'
>) {
  return (
    <Skeleton.Root className={clsx('relative', className)}>
      <div className="mx-auto grid grid-cols-1 gap-6 [mask-image:linear-gradient(to_bottom,_black_0%,_transparent_90%)] @3xl:grid-cols-2">
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
      <div className="absolute inset-0 mx-auto px-3 py-16 pb-3 @4xl:px-10 @4xl:pb-10 @4xl:pt-28">
        <div className="mx-auto max-w-xl space-y-2 text-center @4xl:space-y-3">
          <h3 className="font-[family-name:var(--product-list-empty-state-title-font-family,var(--font-family-heading))] text-2xl leading-tight text-[var(--product-list-empty-state-title,hsl(var(--foreground)))] @4xl:text-4xl @4xl:leading-none">
            {emptyStateTitle}
          </h3>
          <p className="font-[family-name:var(--product-list-empty-state-subtitle-font-family,var(--font-family-body))] text-sm text-[var(--product-list-empty-state-subtitle,hsl(var(--contrast-500)))] @4xl:text-lg">
            {emptyStateSubtitle}
          </p>
        </div>
      </div>
    </Skeleton.Root>
  );
}
