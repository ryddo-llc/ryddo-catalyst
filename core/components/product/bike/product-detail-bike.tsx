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
import { imageManagerImageUrl } from '~/lib/store-assets';

import { ProductBadges } from '../shared/product-badges';
import {
  BikeImageSkeleton,
  BikeSpecsSkeleton,
  ProductDetailBikeSkeleton,
} from '../shared/product-detail-skeletons';

import { BikeMobileSection } from './bike-mobile-section';
import { BikeSpecsIcons } from './bike-specs-icons';
import { BikeVariantCoordinator } from './bike-variant-coordinator';

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
  warranty?: string | null;
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
                    <div className="absolute inset-0 h-full w-full opacity-55">
                      <Stream fallback={null} value={product.images}>
                        {(images) => {
                          const backgroundImage = findBackgroundImage(images);
                          const backgroundSrc =
                            product.backgroundImage ||
                            backgroundImage?.src ||
                            imageManagerImageUrl('default-ebike-background.png', 'original');

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
                        <header className="mt-10 text-center md:mb-1">
                          {/* Hidden h1 for SEO - Screen readers and crawlers only */}
                          <h1 className="sr-only" id="product-heading">
                            {product.title}
                          </h1>

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
                        </header>

                        {/* Middle Section - Center bike image with absolutely positioned sidebars */}
                        <BikeVariantCoordinator
                          action={action}
                          additionalActions={additionalActions}
                          ctaDisabled={streamableCtaDisabled}
                          ctaLabel={streamableCtaLabel}
                          fields={streamableFields}
                          product={{
                            id: product.id,
                            subtitle: product.subtitle,
                            description: product.description,
                            images: product.images,
                            colors: product.colors,
                            title: product.title,
                            href: product.href,
                            price: product.price,
                            warranty: product.warranty,
                          }}
                        >
                          <div className="flex h-[14.5rem] w-full max-w-xl items-center justify-center transition-all duration-300 ease-in-out sm:h-[18rem] md:h-[20.5rem] md:max-w-2xl lg:h-[23.5rem] lg:max-w-3xl xl:h-[25.5rem] xl:max-w-4xl">
                            <Stream fallback={<BikeImageSkeleton />} value={product.images}>
                              {(images) => {
                                const bikeImage = findHeroProductImage(images);

                                return bikeImage ? (
                                  <Image
                                    alt={bikeImage.alt}
                                    className="w-full object-contain transition-all duration-300"
                                    height={1500}
                                    priority
                                    sizes="(max-width: 640px) 460px, (max-width: 768px) 540px, (max-width: 1024px) 690px, (max-width: 1280px) 845px, 1080px"
                                    src={bikeImage.src}
                                    width={1500}
                                  />
                                ) : (
                                  <div className="text-center text-gray-500">
                                    No bike image available
                                  </div>
                                );
                              }}
                            </Stream>
                          </div>
                        </BikeVariantCoordinator>

                        {/* Bottom Section - Desktop/Tablet Specifications - Natural flow */}
                        <div className="mt-auto hidden pt-16 md:block">
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
