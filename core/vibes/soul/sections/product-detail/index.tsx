import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Price } from '@/vibes/soul/primitives/price-label';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { type Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import { ProductGallery } from '@/vibes/soul/sections/product-detail/product-gallery';
import { SectionContainer } from '~/components/section-container';

import { ProductDetailFormAction } from './product-detail-form';
import { ProductSpecifications } from './product-specifications';
import { PurchaseSection } from './purchase-section';
import { Field } from './schema';

interface InventoryStatus {
  isInStock: boolean;
  status: 'Available' | 'Unavailable' | 'Preorder';
}

interface ProductDetailProduct {
  id: string;
  title: string;
  href: string;
  images: Streamable<Array<{ src: string; alt: string }>>;
  price?: Streamable<Price | null>;
  subtitle?: string;
  badge?: string;
  rating?: Streamable<number | null>;
  summary?: Streamable<string>;
  description?: Streamable<string | ReactNode | null>;
  inventoryStatus?: Streamable<InventoryStatus>;
  accordions?: Streamable<
    Array<{
      title: string;
      content: ReactNode;
    }>
  >;
}

export interface ProductDetailProps<F extends Field> {
  breadcrumbs?: Streamable<Breadcrumb[]>;
  product: Streamable<ProductDetailProduct | null>;
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  thumbnailLabel?: string;
  additionalActions?: ReactNode;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --product-detail-border: hsl(var(--contrast-100));
 *   --product-detail-subtitle-font-family: var(--font-family-mono);
 *   --product-detail-title-font-family: var(--font-family-heading);
 *   --product-detail-primary-text: hsl(var(--foreground));
 *   --product-detail-secondary-text:  hsl(var(--contrast-500));
 * }
 * ```
 */
export function ProductDetail<F extends Field>({
  product: streamableProduct,
  action,
  fields: streamableFields,
  breadcrumbs,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  thumbnailLabel,
  additionalActions,
}: ProductDetailProps<F>) {
  return (
    <SectionContainer>
      <SectionContainer.Outer
        className="vh-[85] relative min-h-screen overflow-hidden"
        containerQuery={true}
        radius={30}
        rounded="bottom"
      >
        <div className="relative">
          {/* Dynamic background with gradient */}
          <div
            className="absolute inset-0 z-0"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 80%)',
              background: 'linear-gradient(135deg, #E5F3F9 0%, #F0F8FF 100%)',
            }}
          />

          <div className="group/product-detail relative z-10 py-8 @xl:py-12 @4xl:py-16">
        {breadcrumbs && (
          <div className="group/breadcrumbs mb-6">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        )}

        <Stream fallback={<ProductDetailSkeleton />} value={streamableProduct}>
          {(product) =>
            product && (
              <div className="flex min-h-[calc(85vh-4rem)] flex-col">
                {/* Main Content Area */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 items-start gap-6 @lg:grid-cols-2 @lg:gap-12 @2xl:gap-16 @5xl:gap-20">
                    {/* Product Gallery - Left Side */}
                    <div className="group/product-gallery order-2 @lg:order-1">
                      <Stream fallback={<ProductGallerySkeleton />} value={product.images}>
                        {(images) => (
                          <div className="sticky top-0">
                            <ProductGallery
                              aspectRatio="4:5"
                              images={images}
                              priority={true}
                              productTitle={product.title}
                              thumbnailLabel={thumbnailLabel}
                            />
                          </div>
                        )}
                      </Stream>
                    </div>

                    {/* Product Information - Right Side */}
                    <div className="group/product-info order-1 space-y-6 @lg:order-2">
                      {/* Badge */}
                      <div className="inline-flex items-center justify-center gap-2 rounded border border-[#757575] p-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#333]">
                          Ryddo Recommended
                        </span>
                      </div>

                      {/* Subtitle */}
                      {Boolean(product.subtitle) && (
                        <p className="text-sm font-medium uppercase tracking-wider text-gray-600">
                          {product.subtitle}
                        </p>
                      )}

                      {/* Product Title, Rating, Description - Tight spacing */}
                      <div className="space-y-2">
                        {/* Product Title */}
                        <h1
                          className="text-3xl font-black leading-tight text-gray-900 @md:text-4xl @lg:text-5xl @xl:text-6xl"
                          style={{ fontFamily: 'Nunito' }}
                        >
                          <span className="text-[#F92F7B]">{product.title.split(' ')[0]}</span>
                          {product.title.split(' ').length > 1 && (
                            <span className="text-gray-900">{` ${product.title.split(' ').slice(1).join(' ')}`}</span>
                          )}
                        </h1>

                        {/* Rating */}
                        <div className="group/product-rating">
                          <Stream fallback={<RatingSkeleton />} value={product.rating}>
                            {(rating) => (rating && rating > 0 ? <Rating rating={rating} /> : null)}
                          </Stream>
                        </div>

                        {/* Description */}
                        <div className="group/product-description">
                          <Stream
                            fallback={<ProductDescriptionSkeleton />}
                            value={product.description}
                          >
                            {(description) =>
                              Boolean(description) && (
                                <div
                                  className="max-w-[421px] text-base font-normal leading-relaxed text-[#757575] @md:text-lg @lg:text-xl"
                                  style={{ fontFamily: 'Inter' }}
                                >
                                  {description}
                                </div>
                              )
                            }
                          </Stream>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="group/product-summary">
                        <Stream fallback={<ProductSummarySkeleton />} value={product.summary}>
                          {(summary) =>
                            Boolean(summary) && (
                              <p className="text-base leading-relaxed text-gray-600 @xl:text-lg">
                                {summary}
                              </p>
                            )
                          }
                        </Stream>
                      </div>

                      {/* Inventory Status */}
                      {product.inventoryStatus && (
                        <div className="group/inventory-status">
                          <Stream
                            fallback={<InventoryStatusSkeleton />}
                            value={product.inventoryStatus}
                          >
                            {(inventory) => <InventoryStatusIndicator inventory={inventory} />}
                          </Stream>
                        </div>
                      )}

                      {/* Purchase Section - Client Component */}
                      <div className="group/purchase-section">
                        <Stream
                          fallback={<PurchaseSectionSkeleton />}
                          value={Streamable.all([
                            streamableFields,
                            streamableCtaLabel,
                            streamableCtaDisabled,
                            product.price,
                          ])}
                        >
                          {([fields, ctaLabel, ctaDisabled, price]) => (
                            <PurchaseSection
                              action={action}
                              additionalActions={additionalActions}
                              ctaDisabled={ctaDisabled ?? undefined}
                              ctaLabel={ctaLabel ?? undefined}
                              fields={fields}
                              price={price}
                              productId={product.id}
                            />
                          )}
                        </Stream>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Specifications - Sticky positioning on desktop, natural flow on mobile */}
                <div>
                  <ProductSpecifications fields={streamableFields} showVariantInteractions={true} />
                </div>
              </div>
            )
          }
        </Stream>
          </div>
        </div>
      </SectionContainer.Outer>
    </SectionContainer>
  );
}

function ProductGallerySkeleton() {
  return (
    <Skeleton.Root className="group-has-[[data-pending]]/product-gallery:animate-pulse" pending>
      {/* Match actual layout structure */}
      <div className="relative flex flex-col items-start gap-4 @md:flex-row @md:gap-6">
        {/* Main image skeleton - Mobile First */}
        <div className="order-1 w-full @md:order-2 @md:w-[calc(100%-7rem)] @lg:w-[calc(100%-8rem)] @xl:w-[calc(100%-9rem)]">
          <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
            <Skeleton.Box className="aspect-[4/5] h-full w-full" />
          </div>
        </div>

        {/* Thumbnails skeleton - Mobile Second */}
        <div className="order-2 flex w-full flex-row @md:order-1 @md:ml-4 @md:w-24 @md:flex-col @md:items-center @lg:ml-6 @lg:w-28 @xl:ml-8 @xl:w-32">
          <div className="flex max-w-full gap-2 overflow-x-auto @md:flex-col">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton.Box
                className="@lg:h-22 h-16 w-20 shrink-0 rounded-xl @md:h-20 @md:w-24 @lg:w-28 @xl:h-24 @xl:w-32"
                key={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </Skeleton.Root>
  );
}

function PriceLabelSkeleton() {
  return <Skeleton.Box className="my-5 h-12 w-32 rounded-md @md:h-16 @md:w-40 @lg:h-20 @lg:w-48" />;
}

function RatingSkeleton() {
  return (
    <Skeleton.Root
      className="flex w-[136px] items-center gap-1 group-has-[[data-pending]]/product-rating:animate-pulse"
      pending
    >
      <Skeleton.Box className="h-4 w-[100px] rounded-md" />
      <Skeleton.Box className="h-6 w-8 rounded-xl" />
    </Skeleton.Root>
  );
}

function ProductSummarySkeleton() {
  return (
    <Skeleton.Root
      className="flex w-full flex-col gap-3.5 pb-6 group-has-[[data-pending]]/product-summary:animate-pulse"
      pending
    >
      {Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton.Box className="h-2.5 w-full" key={idx} />
      ))}
    </Skeleton.Root>
  );
}

function ProductDescriptionSkeleton() {
  return (
    <Skeleton.Root
      className="flex w-full flex-col gap-3.5 pb-6 group-has-[[data-pending]]/product-description:animate-pulse"
      pending
    >
      {Array.from({ length: 2 }).map((_, idx) => (
        <Skeleton.Box className="h-2.5 w-full" key={idx} />
      ))}
      <Skeleton.Box className="h-2.5 w-3/4" />
    </Skeleton.Root>
  );
}

function PurchaseSectionSkeleton() {
  return (
    <Skeleton.Root
      className="flex flex-col gap-4 group-has-[[data-pending]]/purchase-section:animate-pulse @sm:flex-row @sm:items-center @sm:gap-6"
      pending
    >
      <Skeleton.Box className="h-12 w-8 rounded-md" /> {/* Inventory status */}
      <Skeleton.Box className="h-12 w-32 rounded-md @md:h-16 @md:w-40 @lg:h-20 @lg:w-48" />{' '}
      {/* Price */}
      <Skeleton.Box className="h-12 w-[200px] rounded-full @sm:min-w-[200px] @sm:flex-none" />{' '}
      {/* Button */}
    </Skeleton.Root>
  );
}

function InventoryStatusIndicator({ inventory }: { inventory: InventoryStatus }) {
  const getStatusConfig = () => {
    if (!inventory.isInStock || inventory.status === 'Unavailable') {
      return {
        text: 'Out of Stock',
        className: 'bg-red-50 text-red-700 border-red-200',
        icon: '❌',
      };
    }

    if (inventory.status === 'Preorder') {
      return {
        text: 'Available for Pre-order',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: '⏳',
      };
    }

    return {
      text: 'In Stock',
      className: 'bg-green-50 text-green-700 border-green-200',
      icon: '✅',
    };
  };

  const config = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${config.className}`}
    >
      <span>{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
}

function InventoryStatusSkeleton() {
  return (
    <Skeleton.Root className="group-has-[[data-pending]]/inventory-status:animate-pulse" pending>
      <Skeleton.Box className="h-8 w-24 rounded-lg" />
    </Skeleton.Root>
  );
}

export function ProductDetailSkeleton() {
  return (
    <Skeleton.Root
      className="grid grid-cols-1 items-stretch gap-x-6 gap-y-8 group-has-[[data-pending]]/product-detail:animate-pulse @2xl:grid-cols-2 @5xl:gap-x-12"
      pending
    >
      <div className="hidden @2xl:block">
        <ProductGallerySkeleton />
      </div>
      <div>
        <Skeleton.Box className="mb-6 h-4 w-20 rounded-lg" />
        <Skeleton.Box className="mb-6 h-6 w-72 rounded-lg" />
        <RatingSkeleton />
        <PriceLabelSkeleton />
        <ProductSummarySkeleton />
        <InventoryStatusSkeleton />
        <div className="mb-8 @2xl:hidden">
          <ProductGallerySkeleton />
        </div>
        <PurchaseSectionSkeleton />
      </div>
    </Skeleton.Root>
  );
}
