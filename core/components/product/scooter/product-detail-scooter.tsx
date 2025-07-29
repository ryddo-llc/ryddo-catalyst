import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { CompareDrawer, CompareDrawerProvider } from '@/vibes/soul/primitives/compare-drawer';
import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { type Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import {
  ProductDetailForm,
  ProductDetailFormAction,
} from '@/vibes/soul/sections/product-detail/product-detail-form';
import { ProductGallery } from '@/vibes/soul/sections/product-detail/product-gallery';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';

interface ScooterSpecifications {
  motorPower?: string;
  batteryCapacity?: string;
  maxSpeed?: string;
  range?: string;
  maxWeight?: string;
  wheelSize?: string;
  brakeSystem?: string;
  foldable?: boolean;
  ipRating?: string;
}

interface BaseProductDetailProduct {
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
  accordions?: Streamable<
    Array<{
      title: string;
      content: ReactNode;
    }>
  >;
  inventoryStatus?: Streamable<{
    isInStock: boolean;
    status: 'Available' | 'Unavailable' | 'Preorder';
  } | null>;
}

interface ProductDetailScooterProduct extends BaseProductDetailProduct {
  scooterSpecs?: Streamable<ScooterSpecifications | null>;
}

export interface ProductDetailScooterProps<F extends Field> {
  breadcrumbs?: Streamable<Breadcrumb[]>;
  product: Streamable<ProductDetailScooterProduct | null>;
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  quantityLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
  emptySelectPlaceholder?: string;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  prefetch?: boolean;
  thumbnailLabel?: string;
  additionalInformationTitle?: string;
  additionalActions?: ReactNode;
  // Compare functionality
  compareProducts?: Streamable<
    Array<{ id: string; image?: { src: string; alt: string }; href: string; title: string }>
  >;
  compareLabel?: string;
  maxCompareItems?: number;
  maxCompareLimitMessage?: string;
}

export function ProductDetailScooter<F extends Field>({
  product: streamableProduct,
  action,
  fields: streamableFields,
  breadcrumbs,
  quantityLabel,
  incrementLabel,
  decrementLabel,
  emptySelectPlaceholder,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  prefetch,
  thumbnailLabel,
  additionalInformationTitle = 'Additional information',
  additionalActions,
  compareProducts,
  compareLabel = 'Compare',
  maxCompareItems = 3,
  maxCompareLimitMessage = "You've reached the maximum number of products for comparison.",
}: ProductDetailScooterProps<F>) {
  return (
    <Stream fallback={<ProductDetailScooterSkeleton />} value={compareProducts || []}>
      {(compareItems) => (
        <CompareDrawerProvider
          items={compareItems}
          maxCompareLimitMessage={maxCompareLimitMessage}
          maxItems={maxCompareItems}
        >
          <SectionLayout containerSize="full">
            <h1>Scooter</h1>
            <div className="group/product-detail">
              {breadcrumbs && (
                <div className="group/breadcrumbs mb-6">
                  <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
              )}
              <Stream fallback={<ProductDetailScooterSkeleton />} value={streamableProduct}>
                {(product) =>
                  product && (
                    <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-8 @2xl:grid-cols-2 @5xl:gap-x-12">
                      <div className="group/product-gallery hidden @2xl:block">
                        <Stream fallback={<ProductGallerySkeleton />} value={product.images}>
                          {(images) => <ProductGallery images={images} />}
                        </Stream>
                      </div>
                      <div className="text-[var(--product-detail-primary-text,hsl(var(--foreground)))]">
                        {Boolean(product.subtitle) && (
                          <p className="font-[family-name:var(--product-detail-subtitle-font-family,var(--font-family-mono))] text-sm uppercase">
                            {product.subtitle}
                          </p>
                        )}
                        <h1 className="mb-3 mt-2 font-[family-name:var(--product-detail-title-font-family,var(--font-family-heading))] text-2xl font-medium leading-none @xl:mb-4 @xl:text-3xl @4xl:text-4xl">
                          {product.title}
                        </h1>
                        <div className="group/product-rating">
                          <Stream fallback={<RatingSkeleton />} value={product.rating}>
                            {(rating) => <Rating rating={rating ?? 0} />}
                          </Stream>
                        </div>
                        <div className="group/product-price">
                          <Stream fallback={<PriceLabelSkeleton />} value={product.price}>
                            {(price) => (
                              <PriceLabel className="my-3 text-xl @xl:text-2xl" price={price ?? ''} />
                            )}
                          </Stream>
                        </div>

                        {/* Scooter-specific specs section */}
                        <div className="mb-6">
                          <div className="group/scooter-quick-specs">
                            <Stream fallback={<ScooterSpecsSkeleton />} value={product.scooterSpecs}>
                              {(specs) =>
                                specs && (
                                  <div className="rounded-lg border border-[var(--product-detail-border,hsl(var(--contrast-100)))] p-4">
                                    <h3 className="mb-3 text-sm font-semibold uppercase text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                                      Key Features
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3 text-sm @md:grid-cols-2">
                                      {specs.motorPower ? (
                                        <div className="flex items-center">
                                          <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                                            Motor:
                                          </span>
                                          <span className="ml-2 font-medium">{specs.motorPower}</span>
                                        </div>
                                      ) : null}
                                      {specs.maxSpeed ? (
                                        <div className="flex items-center">
                                          <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                                            Max Speed:
                                          </span>
                                          <span className="ml-2 font-medium">{specs.maxSpeed}</span>
                                        </div>
                                      ) : null}
                                      {specs.range ? (
                                        <div className="flex items-center">
                                          <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                                            Range:
                                          </span>
                                          <span className="ml-2 font-medium">{specs.range}</span>
                                        </div>
                                      ) : null}
                                      {specs.maxWeight ? (
                                        <div className="flex items-center">
                                          <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                                            Max Load:
                                          </span>
                                          <span className="ml-2 font-medium">{specs.maxWeight}</span>
                                        </div>
                                      ) : null}
                                      {specs.foldable !== undefined ? (
                                        <div className="flex items-center">
                                          <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                                            Foldable:
                                          </span>
                                          <span className="ml-2 font-medium">
                                            {specs.foldable ? 'Yes' : 'No'}
                                          </span>
                                        </div>
                                      ) : null}
                                      {specs.ipRating ? (
                                        <div className="flex items-center">
                                          <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                                            Water Resistant:
                                          </span>
                                          <span className="ml-2 font-medium">{specs.ipRating}</span>
                                        </div>
                                      ) : null}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                      {specs.foldable ? (
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                          Portable
                                        </span>
                                      ) : null}
                                      {specs.ipRating ? (
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                          Weather Resistant
                                        </span>
                                      ) : null}
                                      {specs.maxSpeed && parseInt(specs.maxSpeed, 10) > 25 ? (
                                        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                                          High Performance
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                )
                              }
                            </Stream>
                          </div>
                        </div>

                        <div className="group/product-gallery mb-8 @2xl:hidden">
                          <Stream fallback={<ProductGallerySkeleton />} value={product.images}>
                            {(images) => (
                              <ProductGallery images={images} thumbnailLabel={thumbnailLabel} />
                            )}
                          </Stream>
                        </div>
                        <div className="group/product-summary">
                          <Stream fallback={<ProductSummarySkeleton />} value={product.summary}>
                            {(summary) =>
                              Boolean(summary) && (
                                <p className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                                  {summary}
                                </p>
                              )
                            }
                          </Stream>
                        </div>
                        <div className="group/product-detail-form">
                          <Stream
                            fallback={<ProductDetailFormSkeleton />}
                            value={Streamable.all([
                              streamableFields,
                              streamableCtaLabel,
                              streamableCtaDisabled,
                            ])}
                          >
                            {([fields, ctaLabel, ctaDisabled]) => (
                              <ProductDetailForm
                                action={action}
                                additionalActions={additionalActions}
                                ctaDisabled={ctaDisabled ?? undefined}
                                ctaLabel={ctaLabel ?? undefined}
                                decrementLabel={decrementLabel}
                                emptySelectPlaceholder={emptySelectPlaceholder}
                                fields={fields}
                                incrementLabel={incrementLabel}
                                prefetch={prefetch}
                                productId={product.id}
                                quantityLabel={quantityLabel}
                              />
                            )}
                          </Stream>
                        </div>
                        <div className="group/product-description">
                          <Stream fallback={<ProductDescriptionSkeleton />} value={product.description}>
                            {(description) =>
                              Boolean(description) && (
                                <div className="prose prose-sm max-w-none border-t border-[var(--product-detail-border,hsl(var(--contrast-100)))] py-8 [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0">
                                  {description}
                                </div>
                              )
                            }
                          </Stream>
                        </div>
                        <h2 className="sr-only">{additionalInformationTitle}</h2>
                        <div className="group/product-accordion">
                          <Stream fallback={<ProductAccordionsSkeleton />} value={product.accordions}>
                            {(accordions) =>
                              accordions && (
                                <Accordion
                                  className="border-t border-[var(--product-detail-border,hsl(var(--contrast-100)))] pt-4"
                                  type="multiple"
                                >
                                  {accordions.map((accordion, index) => (
                                    <AccordionItem
                                      key={index}
                                      title={accordion.title}
                                      value={index.toString()}
                                    >
                                      {accordion.content}
                                    </AccordionItem>
                                  ))}
                                </Accordion>
                              )
                            }
                          </Stream>
                        </div>
                      </div>
                    </div>
                  )
                }
              </Stream>
            </div>
          </SectionLayout>

          <CompareDrawer href="/compare" submitLabel={compareLabel} />
        </CompareDrawerProvider>
      )}
    </Stream>
  );
}

// Skeleton components
function ProductGallerySkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
      <div className="flex">
        <div className="aspect-[4/5] h-full w-full shrink-0 grow-0 basis-full animate-pulse bg-gray-200" />
      </div>
    </div>
  );
}

function RatingSkeleton() {
  return (
    <div className="flex w-[136px] items-center gap-1">
      <div className="h-4 w-[100px] animate-pulse rounded-md bg-gray-200" />
      <div className="h-6 w-8 animate-pulse rounded-xl bg-gray-200" />
    </div>
  );
}

function PriceLabelSkeleton() {
  return <div className="my-5 h-4 w-20 animate-pulse rounded-md bg-gray-200" />;
}

function ProductSummarySkeleton() {
  return (
    <div className="flex w-full flex-col gap-3.5 pb-6">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="h-2.5 w-full animate-pulse bg-gray-200" />
      ))}
    </div>
  );
}

function ProductDetailFormSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex gap-2">
        <div className="h-12 w-[120px] animate-pulse rounded-lg bg-gray-200" />
        <div className="h-12 w-[216px] animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

function ProductDescriptionSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3.5 pb-6">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div key={idx} className="h-2.5 w-full animate-pulse bg-gray-200" />
      ))}
      <div className="h-2.5 w-3/4 animate-pulse bg-gray-200" />
    </div>
  );
}

function ProductAccordionsSkeleton() {
  return (
    <div className="flex h-[600px] w-full flex-col gap-8 pt-4">
      <div className="flex items-center justify-between">
        <div className="h-2 w-20 animate-pulse rounded-sm bg-gray-200" />
        <div className="h-3 w-3 animate-pulse rounded-sm bg-gray-200" />
      </div>
      <div className="mb-1 flex flex-col gap-4">
        <div className="h-3 w-full animate-pulse rounded-sm bg-gray-200" />
        <div className="h-3 w-full animate-pulse rounded-sm bg-gray-200" />
        <div className="h-3 w-3/5 animate-pulse rounded-sm bg-gray-200" />
      </div>
    </div>
  );
}

function ScooterSpecsSkeleton() {
  return (
    <Skeleton.Root
      className="rounded-lg border border-[var(--product-detail-border,hsl(var(--contrast-100)))] p-4 group-has-[[data-pending]]/scooter-quick-specs:animate-pulse"
      pending
    >
      <Skeleton.Box className="mb-3 h-4 w-24 rounded-md" />
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton.Box className="h-3 w-full rounded-md" key={idx} />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton.Box className="h-6 w-16 rounded-full" key={idx} />
        ))}
      </div>
    </Skeleton.Root>
  );
}


export function ProductDetailScooterSkeleton() {
  return (
    <Skeleton.Root
      className="grid grid-cols-1 items-stretch gap-x-6 gap-y-8 group-has-[[data-pending]]/product-detail:animate-pulse @2xl:grid-cols-2 @5xl:gap-x-12"
      pending
    >
      <div className="hidden @2xl:block">
        <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
          <div className="flex">
            <Skeleton.Box className="aspect-[4/5] h-full w-full shrink-0 grow-0 basis-full" />
          </div>
        </div>
        <div className="mt-2 flex max-w-full gap-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton.Box className="h-12 w-12 shrink-0 rounded-lg @md:h-16 @md:w-16" key={idx} />
          ))}
        </div>
      </div>
      <div>
        <Skeleton.Box className="mb-6 h-4 w-20 rounded-lg" />
        <Skeleton.Box className="mb-6 h-6 w-72 rounded-lg" />
        <div className="flex w-[136px] items-center gap-1">
          <Skeleton.Box className="h-4 w-[100px] rounded-md" />
          <Skeleton.Box className="h-6 w-8 rounded-xl" />
        </div>
        <Skeleton.Box className="my-5 h-4 w-20 rounded-md" />
        <ScooterSpecsSkeleton />
        <div className="flex w-full flex-col gap-3.5 pb-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton.Box className="h-2.5 w-full" key={idx} />
          ))}
        </div>
        <div className="mb-8 @2xl:hidden">
          <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
            <Skeleton.Box className="aspect-[4/5] h-full w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-8 py-8">
          <div className="flex gap-2">
            <Skeleton.Box className="h-12 w-[120px] rounded-lg" />
            <Skeleton.Box className="h-12 w-[216px] rounded-full" />
          </div>
        </div>
      </div>
    </Skeleton.Root>
  );
}
