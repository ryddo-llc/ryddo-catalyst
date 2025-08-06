import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Price } from '@/vibes/soul/primitives/price-label';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { type Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import { ProductGallery } from '@/vibes/soul/sections/product-detail/product-gallery';

import { ProductDetailForm, ProductDetailFormAction } from './product-detail-form';
import { Field } from './schema';

// Helper function to identify variant fields (color/size)
const isVariantField = (field: Field): boolean => {
  const variantTypes = ['swatch-radio-group', 'button-radio-group', 'card-radio-group'];
  const variantNames = ['color', 'colour', 'size', 'variant'];

  return (
    variantTypes.includes(field.type) ||
    variantNames.some((name) => field.name.toLowerCase().includes(name))
  );
};

// Helper function to render color swatch as small square
const renderColorSwatch = (field: Field, option: unknown, label: string) => {
  if (
    field.type === 'swatch-radio-group' &&
    typeof option === 'object' &&
    option !== null &&
    'type' in option &&
    option.type === 'color' &&
    'color' in option
  ) {
    return (
      <div
        className="mx-auto h-6 w-6 rounded border border-gray-300 shadow-sm"
        style={{
          backgroundColor: 'color' in option ? String(option.color) : '#ccc',
        }}
        title={label}
      />
    );
  }

  return <span className="text-base font-medium text-gray-600">{label}</span>;
};

// Helper function to render size badge
const renderSizeBadge = (label: string) => {
  return (
    <div className="mx-auto flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white shadow-sm">
      <span className="text-xs font-bold uppercase text-gray-700">{label}</span>
    </div>
  );
};

// Helper function to create specification item
const createSpecificationItem = (title: string, content: React.ReactNode) => (
  <div className="text-center">
    <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-900">{title}</div>
    {content}
  </div>
);

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
    <section className="relative min-h-screen overflow-hidden bg-white @container">
      {/* Dynamic background with gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 80%)',
          background: 'linear-gradient(135deg, #E5F3F9 0%, #F0F8FF 100%)',
        }}
      />

      <div className="group/product-detail z-5 relative mx-auto w-full max-w-screen-2xl px-4 py-8 @xl:px-6 @xl:py-12 @4xl:px-8 @4xl:py-16">
        {breadcrumbs && (
          <div className="group/breadcrumbs mb-6">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        )}

        <Stream fallback={<ProductDetailSkeleton />} value={streamableProduct}>
          {(product) =>
            product && (
              <div className="space-y-16">
                <div className="grid grid-cols-1 items-start gap-6 max-h-[85vh] @lg:grid-cols-2 @lg:gap-12 @2xl:gap-16 @5xl:gap-20">
                  {/* Product Gallery - Left Side */}
                  <div className="group/product-gallery order-2 @lg:order-1">
                    <Stream fallback={<ProductGallerySkeleton />} value={product.images}>
                      {(images) => (
                        <div className="sticky top-0">
                          <ProductGallery
                            aspectRatio="4:5"
                            images={images}
                            productTitle={product.title}
                            thumbnailLabel={thumbnailLabel}
                          />
                        </div>
                      )}
                    </Stream>
                  </div>

                  {/* Product Information - Right Side */}
                  <div className="group/product-info order-1 space-y-4 @lg:order-2">
                    {/* Badge */}
                    <div className="inline-flex items-center justify-center gap-2 rounded border border-[#757575] p-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#333]">
                        Ryddo Recommended
                      </span>
                    </div>

                    {/* Subtitle */}
                    {Boolean(product.subtitle) && (
                      <p className="font-mono text-sm font-medium uppercase tracking-wider text-gray-600">
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
                          {(rating) => rating && rating > 0 ? <Rating rating={rating} /> : null}
                        </Stream>
                      </div>

                      {/* Description */}
                      <div className="group/product-description">
                        <Stream fallback={<ProductDescriptionSkeleton />} value={product.description}>
                          {(description) =>
                            Boolean(description) && (
                              <div className="max-w-[421px] text-[#757575] font-normal text-base leading-relaxed @md:text-lg @lg:text-xl" style={{ fontFamily: 'Inter' }}>
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

                    {/* Product Form - Non-variant fields only */}
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
                  </div>
                </div>

                {/* Product Specifications & Options - Single Row Layout */}
                <div className="group/product-specifications">
                  <Stream fallback={null} value={streamableFields}>
                    {(fields) => {
                      const variantFields = fields.filter(isVariantField);

                      // Find color and size fields
                      const colorField =
                        variantFields.find(
                          (field) =>
                            field.name.toLowerCase().includes('color') ||
                            field.name.toLowerCase().includes('colour'),
                        ) || variantFields[0]; // Fallback to first variant field

                      const sizeField =
                        variantFields.find((field) => field.name.toLowerCase().includes('size')) ||
                        variantFields[1]; // Fallback to second variant field

                      const specifications = [];

                      // Add Colors section
                      if (colorField && 'options' in colorField && colorField.options.length > 0) {
                        const colorSwatches = colorField.options.map((option, index) => {
                          const label = typeof option === 'string' ? option : option.label;
                          const value = typeof option === 'string' ? option : option.value;

                          return (
                            <div key={value || index}>
                              {renderColorSwatch(colorField, option, label)}
                            </div>
                          );
                        });

                        specifications.push(
                          createSpecificationItem(
                            'Colors',
                            <div className="flex flex-wrap justify-center gap-0.5">
                              {colorSwatches}
                            </div>,
                          ),
                        );
                      }

                      // Add Sizes section
                      if (sizeField && 'options' in sizeField && sizeField.options.length > 0) {
                        const sizeBadges = sizeField.options.map((option, index) => {
                          const label = typeof option === 'string' ? option : option.label;
                          const value = typeof option === 'string' ? option : option.value;

                          return <div key={value || index}>{renderSizeBadge(label)}</div>;
                        });

                        specifications.push(
                          createSpecificationItem(
                            'Size',
                            <div className="flex flex-wrap justify-center gap-0.5">
                              {sizeBadges}
                            </div>,
                          ),
                        );
                      }

                      // Add static specifications
                      specifications.push(
                        createSpecificationItem(
                          'Weight',
                          <span className="text-base font-medium text-gray-600">2.5 lbs</span>,
                        ),
                        createSpecificationItem(
                          'Construction',
                          <span className="text-base font-medium text-gray-600">
                            Aluminum Frame
                          </span>,
                        ),
                        createSpecificationItem(
                          'Color Finish',
                          <span className="text-base font-medium text-gray-600">
                            Powder Coated
                          </span>,
                        ),
                        createSpecificationItem(
                          'Certifications',
                          <span className="text-base font-medium text-gray-600">
                            CE, UL Listed
                          </span>,
                        ),
                      );

                      return (
                        <div className="grid grid-cols-2 gap-8 @md:grid-cols-4 @xl:grid-cols-6">
                          {specifications.map((spec, index) => (
                            <div key={index}>{spec}</div>
                          ))}
                        </div>
                      );
                    }}
                  </Stream>
                </div>
              </div>
            )
          }
        </Stream>
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
