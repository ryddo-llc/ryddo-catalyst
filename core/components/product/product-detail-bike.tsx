import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { type Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import { ProductDetailForm, ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { ProductGallery } from '@/vibes/soul/sections/product-detail/product-gallery';
import { Field } from '@/vibes/soul/sections/product-detail/schema';

interface BikeSpecifications {
  motorPower?: string;
  batteryCapacity?: string;
  maxSpeed?: string;
  range?: string;
  frameSize?: string;
  wheelSize?: string;
  brakeSystem?: string;
  transmissionType?: string;
}

interface ProductDetailBikeProduct {
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
  bikeSpecs?: Streamable<BikeSpecifications | null>;
  accordions?: Streamable<
    Array<{
      title: string;
      content: ReactNode;
    }>
  >;
}

export interface ProductDetailBikeProps<F extends Field> {
  breadcrumbs?: Streamable<Breadcrumb[]>;
  product: Streamable<ProductDetailBikeProduct | null>;
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
}

export function ProductDetailBike<F extends Field>({
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
}: ProductDetailBikeProps<F>) {
  return (
    <section className="@container">
      <h1>Bike</h1>
      <div className="group/product-detail mx-auto w-full max-w-screen-2xl px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        {breadcrumbs && (
          <div className="group/breadcrumbs mb-6">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        )}
        <Stream fallback={<ProductDetailBikeSkeleton />} value={streamableProduct}>
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
                  
                  {/* Bike-specific quick specs section */}
                  <div className="group/bike-quick-specs mb-6">
                    <Stream fallback={<BikeSpecsSkeleton />} value={product.bikeSpecs}>
                      {(specs) =>
                        specs && (
                          <div className="rounded-lg border border-[var(--product-detail-border,hsl(var(--contrast-100)))] p-4">
                            <h3 className="mb-3 text-sm font-semibold uppercase text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                              Quick Specs
                            </h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {specs.motorPower ? (
                                <div>
                                  <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">Motor:</span>
                                  <span className="ml-2 font-medium">{specs.motorPower}</span>
                                </div>
                              ) : null}
                              {specs.batteryCapacity ? (
                                <div>
                                  <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">Battery:</span>
                                  <span className="ml-2 font-medium">{specs.batteryCapacity}</span>
                                </div>
                              ) : null}
                              {specs.maxSpeed ? (
                                <div>
                                  <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">Max Speed:</span>
                                  <span className="ml-2 font-medium">{specs.maxSpeed}</span>
                                </div>
                              ) : null}
                              {specs.range ? (
                                <div>
                                  <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">Range:</span>
                                  <span className="ml-2 font-medium">{specs.range}</span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )
                      }
                    </Stream>
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
    </section>
  );
}

// Skeleton components (reusing from original with bike-specific additions)
function ProductGallerySkeleton() {
  return (
    <Skeleton.Root className="group-has-[[data-pending]]/product-gallery:animate-pulse" pending>
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
    </Skeleton.Root>
  );
}

function BikeSpecsSkeleton() {
  return (
    <Skeleton.Root
      className="rounded-lg border border-[var(--product-detail-border,hsl(var(--contrast-100)))] p-4 group-has-[[data-pending]]/bike-quick-specs:animate-pulse"
      pending
    >
      <Skeleton.Box className="mb-3 h-4 w-20 rounded-md" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton.Box className="h-3 w-full rounded-md" key={idx} />
        ))}
      </div>
    </Skeleton.Root>
  );
}

function PriceLabelSkeleton() {
  return <Skeleton.Box className="my-5 h-4 w-20 rounded-md" />;
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

function ProductDetailFormSkeleton() {
  return (
    <Skeleton.Root
      className="flex flex-col gap-8 py-8 group-has-[[data-pending]]/product-detail-form:animate-pulse"
      pending
    >
      <div className="flex flex-col gap-5">
        <Skeleton.Box className="h-2 w-10 rounded-md" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton.Box className="h-11 w-[72px] rounded-full" key={idx} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton.Box className="h-3 w-16 rounded-md" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton.Box className="h-10 w-10 rounded-full" key={idx} />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton.Box className="h-12 w-[120px] rounded-lg" />
        <Skeleton.Box className="h-12 w-[216px] rounded-full" />
      </div>
    </Skeleton.Root>
  );
}

function ProductAccordionsSkeleton() {
  return (
    <Skeleton.Root
      className="flex h-[600px] w-full flex-col gap-8 pt-4 group-has-[[data-pending]]/product-accordion:animate-pulse"
      pending
    >
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-20 rounded-sm" />
        <Skeleton.Box className="h-3 w-3 rounded-sm" />
      </div>
      <div className="mb-1 flex flex-col gap-4">
        <Skeleton.Box className="h-3 w-full rounded-sm" />
        <Skeleton.Box className="h-3 w-full rounded-sm" />
        <Skeleton.Box className="h-3 w-3/5 rounded-sm" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-24 rounded-sm" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-20 rounded-sm" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-32 rounded-sm" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
    </Skeleton.Root>
  );
}

export function ProductDetailBikeSkeleton() {
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
        <BikeSpecsSkeleton />
        <ProductSummarySkeleton />
        <div className="mb-8 @2xl:hidden">
          <ProductGallerySkeleton />
        </div>
        <ProductDetailFormSkeleton />
      </div>
    </Skeleton.Root>
  );
}