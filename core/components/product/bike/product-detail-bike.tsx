import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { CompareDrawer, CompareDrawerProvider } from '@/vibes/soul/primitives/compare-drawer';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import { Image } from '~/components/image';
import { type ProductSpecification } from '~/components/product/shared/product-specifications';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';
import { getBase64BlurDataURL } from '~/lib/generate-blur-placeholder';
import { findBackgroundImage, findHeroProductImage } from '~/lib/image-resolver';

import { ProductBadges } from '../shared/product-badges';
import {
  BikeImageSkeleton,
  BikeSpecsSkeleton,
  ProductDetailBikeSkeleton,
} from '../shared/product-detail-skeletons';

import { BikeLeftSidebar } from './bike-left-sidebar';
import { BikeMobileSection } from './bike-mobile-section';
import { BikeRightSidebar } from './bike-right-sidebar';
import { BikeSpecsIcons } from './bike-specs-icons';

interface BaseProductDetailProduct {
  id: string;
  title: string;
  href: string;
  images: Streamable<Array<{ src: string; alt: string }>>;
  price?: Streamable<
    | {
        type?: 'sale' | 'range';
        currentValue?: string;
        previousValue?: string;
        minValue?: string;
        maxValue?: string;
      }
    | string
    | null
  >;
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

interface ProductDetailBikeProduct extends BaseProductDetailProduct {
  bikeSpecs?: Streamable<ProductSpecification[] | null>;
  backgroundImage?: string;
  colors?: ColorOption[];
  brandLogo?: { url: string; altText: string } | null;
}

export interface ProductDetailBikeProps<F extends Field> {
  product: Streamable<ProductDetailBikeProduct | null>;
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  additionalActions?: ReactNode;
  // Compare functionality
  compareProducts?: Streamable<
    Array<{ id: string; image?: { src: string; alt: string }; href: string; title: string }>
  >;
  compareLabel?: string;
  maxCompareItems?: number;
  maxCompareLimitMessage?: string;
}

export function ProductDetailBike<F extends Field>({
  product: streamableProduct,
  action,
  fields: streamableFields,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  additionalActions,
  compareProducts,
  compareLabel = 'Compare',
  maxCompareItems = 3,
  maxCompareLimitMessage = "You've reached the maximum number of products for comparison.",
}: ProductDetailBikeProps<F>) {
  return (
    <Stream fallback={<ProductDetailBikeSkeleton />} value={compareProducts || []}>
      {(compareItems) => (
        <CompareDrawerProvider
          items={compareItems}
          maxCompareLimitMessage={maxCompareLimitMessage}
          maxItems={maxCompareItems}
        >
          <section aria-labelledby="product-heading" className="relative w-full">
            <Stream fallback={<ProductDetailBikeSkeleton />} value={streamableProduct}>
              {(product) =>
                product && (
                  <div className="relative min-h-[60vh] md:max-h-[85vh] md:min-h-[70vh]">
                    {/* Background Image - Loaded immediately without Stream */}
                    <div className="absolute inset-0 h-full w-full">
                      <Stream fallback={null} value={product.images}>
                        {(images) => {
                          const backgroundImage = findBackgroundImage(images);
                          const backgroundSrc =
                            product.backgroundImage ||
                            backgroundImage?.src ||
                            '/images/backgrounds/default-background.webp';

                          return (
                            <Image
                              alt="detail page background"
                              blurDataURL={getBase64BlurDataURL()}
                              className="object-cover"
                              fill
                              placeholder="blur"
                              priority
                              src={backgroundSrc}
                            />
                          );
                        }}
                      </Stream>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 flex h-full flex-col justify-start px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:px-12 xl:px-16">
                      <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
                        {/* Top Section - Product Name and Brand */}
                        <div className="mt-6 text-center md:mb-4">
                          <div className="flex flex-col items-center">
                            {/* Product Title Badge */}
                            <ProductBadges title={product.title} />

                            {/* Brand Logo - with responsive negative margin */}
                            {product.brandLogo && (
                              <div className="sm:-mt-18 -mt-16 flex justify-center md:-mt-20 lg:-mt-20 xl:-mt-20">
                                <Image
                                  alt={product.brandLogo.altText || 'Brand logo'}
                                  className="h-auto max-h-32 w-auto object-contain sm:max-h-40 md:max-h-48 lg:max-h-56 xl:max-h-64"
                                  height={500}
                                  loading="eager"
                                  priority
                                  sizes="(max-width: 640px) 200px, (max-width: 768px) 300px, (max-width: 1024px) 400px, (max-width: 1280px) 450px, 500px"
                                  src={product.brandLogo.url}
                                  width={500}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Middle Section - Center bike image with absolutely positioned sidebars */}
                        <div className="relative mb-4 flex min-h-0 flex-1 items-start justify-center pt-4">
                          {/* Left Sidebar - Special Offers - Absolutely positioned */}
                          <BikeLeftSidebar />

                          {/* Center - Bike Image - Smaller constrained width with sidebar spacing */}
                          <div className="flex items-center justify-center px-6 sm:px-8 md:px-16 xl:px-20">
                            <div className="flex h-64 w-full max-w-lg items-center justify-center transition-all duration-300 ease-in-out md:h-80 md:max-w-xl xl:h-96">
                              <Stream fallback={<BikeImageSkeleton />} value={product.images}>
                                {(images) => {
                                  const bikeImage = findHeroProductImage(images);

                                  return bikeImage ? (
                                    <Image
                                      alt={bikeImage.alt}
                                      className="h-auto w-full object-contain transition-all duration-300"
                                      height={1000}
                                      priority
                                      sizes="(max-width: 640px) 384px, (max-width: 768px) 448px, (max-width: 1024px) 512px, (max-width: 1280px) 576px, 672px"
                                      src={bikeImage.src}
                                      width={1000}
                                    />
                                  ) : (
                                    <div className="text-center text-gray-500">
                                      No bike image available
                                    </div>
                                  );
                                }}
                              </Stream>
                            </div>
                          </div>

                          {/* Right Sidebar - Price Card - Absolutely positioned */}
                          <BikeRightSidebar
                            action={action}
                            additionalActions={additionalActions}
                            ctaDisabled={streamableCtaDisabled}
                            ctaLabel={streamableCtaLabel}
                            fields={streamableFields}
                            product={{
                              id: product.id,
                              title: product.title,
                              href: product.href,
                              images: product.images,
                              price: product.price,
                              colors: product.colors,
                            }}
                          />
                        </div>

                        {/* Bottom Section - Desktop/Tablet Specifications - Natural flow */}
                        <div className="mt-auto hidden pt-4 md:block">
                          <Stream fallback={<BikeSpecsSkeleton />} value={product.bikeSpecs}>
                            {(specs) => {
                              if (!specs || specs.length === 0) return null;

                              return (
                                <div className="mx-auto max-w-4xl">
                                  <BikeSpecsIcons specs={specs} />
                                </div>
                              );
                            }}
                          </Stream>
                        </div>
                      </div>
                    </div>

                    {/* Additional Content Below - Only show on mobile */}
                    <BikeMobileSection
                      action={action}
                      additionalActions={additionalActions}
                      ctaDisabled={streamableCtaDisabled}
                      ctaLabel={streamableCtaLabel}
                      fields={streamableFields}
                      product={{
                        id: product.id,
                        title: product.title,
                        href: product.href,
                        images: product.images,
                        rating: product.rating,
                        summary: product.summary,
                        price: product.price,
                        bikeSpecs: product.bikeSpecs,
                        colors: product.colors,
                      }}
                    />
                  </div>
                )
              }
            </Stream>
          </section>

          <CompareDrawer href="/compare" submitLabel={compareLabel} />
        </CompareDrawerProvider>
      )}
    </Stream>
  );
}

// Re-export the skeleton for external use
export { ProductDetailBikeSkeleton };
