import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Price } from '@/vibes/soul/primitives/price-label';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { type Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import { ProductGallery } from '@/vibes/soul/sections/product-detail/product-gallery';

import { ProductDetailForm, ProductDetailFormAction } from './product-detail-form';
import { Field } from './schema';

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
  quantityLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
  emptySelectPlaceholder?: string;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  prefetch?: boolean;
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
  emptySelectPlaceholder,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  prefetch,
  thumbnailLabel,
  additionalActions,
}: ProductDetailProps<F>) {
  return (
    <section className="relative overflow-hidden bg-[#F5F5F5] @container">
      {/* Colored background section */}
      <div
        className="absolute inset-0 z-0"
        style={{ clipPath: 'polygon(0 0, 160% 0, 0 80%)', backgroundColor: '#E5F3F9' }}
      />
      v
      <div className="group/product-detail z-5 relative mx-auto w-full max-w-screen-2xl px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        {breadcrumbs && (
          <div className="group/breadcrumbs mb-6">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        )}
        <Stream fallback={<ProductDetailSkeleton />} value={streamableProduct}>
          {(product) =>
            product && (
              <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-8 @2xl:grid-cols-2 @5xl:gap-x-12">
                <div className="group/product-gallery hidden @2xl:block">
                  <Stream fallback={<ProductGallerySkeleton />} value={product.images}>
                    {(images) => <ProductGallery images={images} productTitle={product.title} />}
                  </Stream>
                </div>
                {/* Product Details */}
                <div className="-mt-16 text-[var(--product-detail-primary-text,hsl(var(--foreground)))] @2xl:-mt-14">
                  {/* Ryddo Recommended Banner */}
                  <div className="mb-3 inline-block rounded border border-gray-300 bg-transparent px-3 py-0">
                    <span className="text-xs font-medium text-gray-700">Ryddo Recommended</span>
                  </div>
                  {Boolean(product.subtitle) && (
                    <p className="font-[family-name:var(--product-detail-subtitle-font-family,var(--font-family-mono))] text-sm uppercase">
                      {product.subtitle}
                    </p>
                  )}
                  <h1
                    className="mb-3 mt-2 text-3xl font-black leading-none @xl:mb-4 @xl:text-4xl @4xl:text-5xl"
                    style={{ fontFamily: 'Nunito' }}
                  >
                    <span className="text-[#F92F7B]">{product.title.split(' ')[0]}</span>
                    {product.title.split(' ').length > 1 && (
                      <span className="text-black">{` ${product.title.split(' ')[1]}`}</span>
                    )}
                    {product.title.split(' ').length > 2 && (
                      <>
                        <br />
                        <span className="text-black">
                          {product.title.split(' ').slice(2).join(' ')}
                        </span>
                      </>
                    )}
                  </h1>
                  <div className="group/product-summary mb-4">
                    <Stream fallback={<ProductSummarySkeleton />} value={product.summary}>
                      {(summary) =>
                        Boolean(summary) && (
                          <p className="mb-4 text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                            {summary}
                          </p>
                        )
                      }
                    </Stream>
                  </div>
                  <div className="group/product-description">
                    <Stream fallback={<ProductDescriptionSkeleton />} value={product.description}>
                      {(description) =>
                        Boolean(description) && (
                          <div className="line-clamp-3 max-w-xs pb-1 pt-4 text-[#757575]">
                            {description}
                          </div>
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
                        product.price,
                      ])}
                    >
                      {([fields, ctaLabel, ctaDisabled, price]) => (
                        <ProductDetailForm
                          action={action}
                          additionalActions={additionalActions}
                          ctaDisabled={ctaDisabled ?? undefined}
                          ctaLabel={ctaLabel ?? undefined}
                          emptySelectPlaceholder={emptySelectPlaceholder}
                          fields={fields}
                          prefetch={prefetch}
                          price={price}
                          productId={product.id}
                        />
                      )}
                    </Stream>
                  </div>
                  <div className="group/product-rating">
                    <Stream fallback={<RatingSkeleton />} value={product.rating}>
                      {(rating) => <Rating rating={rating ?? 0} />}
                    </Stream>
                  </div>
                  <div className="group/product-gallery mb-8 @2xl:hidden">
                    <Stream fallback={<ProductGallerySkeleton />} value={product.images}>
                      {(images) => (
                        <ProductGallery
                          images={images}
                          productTitle={product.title}
                          thumbnailLabel={thumbnailLabel}
                        />
                      )}
                    </Stream>
                  </div>
                </div>
              </div>
            )
          }
        </Stream>
        {/* Product Specifications - Full Width */}
        <div className="group/product-specifications mt-12">
          <div className="pt-1">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-2 text-sm">
              <div className="flex flex-col text-center">
                <span className="font-semibold text-gray-900">Weight:</span>
                <span className="text-gray-600">2.5 lbs</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="font-semibold text-gray-900">Construction:</span>
                <span className="text-gray-600">Aluminum Frame</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="font-semibold text-gray-900">Color Finish:</span>
                <span className="text-gray-600">Powder Coated</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="font-semibold text-gray-900">Certifications:</span>
                <span className="text-gray-600">CE, UL Listed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
        <div className="mb-8 @2xl:hidden">
          <ProductGallerySkeleton />
        </div>
        <ProductDetailFormSkeleton />
      </div>
    </Skeleton.Root>
  );
}
