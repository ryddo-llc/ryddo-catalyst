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

import { GalleryButtonWithModal } from '../shared/gallery-button-with-modal';
import { ProductBadges } from '../shared/product-badges';
import { BikeSpecsSkeleton, ProductDetailBikeSkeleton } from '../shared/product-detail-skeletons';
import { ProductImageOverlay } from '../shared/product-image-overlay';

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
  rating?: number | null;
  reviewCount?: number | null;
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
  // Image overlay actions
  wishlistButton?: ReactNode;
  digitalTagLink?: ReactNode;
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
  wishlistButton,
  digitalTagLink,
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
          <section aria-labelledby="product-heading" className="relative w-full overflow-hidden">
            <Stream fallback={<ProductDetailBikeSkeleton />} value={streamableProduct}>
              {(product) => {
                if (!product) return null;

                return (
                  <div className="relative min-h-[86vh] md:h-[86vh]">
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
                              className="-translate-y-16 scale-110 bg-fixed bg-center object-bottom"
                              placeholder="blur"
                              fill
                              priority
                              src={backgroundSrc}
                            />
                          );
                        }}
                      </Stream>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 flex h-full flex-col justify-start px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-12 lg:py-5 xl:px-16 xl:py-6">
                      <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
                        {/* Top Section - Product Name and Brand */}
                        <header className="mt-6 text-center sm:mt-8 md:mb-1 md:mt-10">
                          {/* Hidden h1 for SEO - Screen readers and crawlers only */}
                          <h1 className="sr-only" id="product-heading">
                            {product.title}
                          </h1>

                          <div className="flex flex-col items-center">
                            {/* Product Title Badge */}
                            <ProductBadges title={product.title} />

                            {/* Brand Logo - Fixed size container */}
                            {product.brandLogo && (
                              <div className="-mt-8 flex h-[8.4rem] w-[12.6rem] items-center justify-center sm:-mt-12 sm:h-[10.5rem] sm:w-[15.75rem] md:-mt-14 md:h-[12.6rem] md:w-[18.9rem] lg:-mt-16 lg:h-[14.7rem] lg:w-[21rem] xl:-mt-20 xl:h-[16.8rem] xl:w-[25.2rem]">
                                <Image
                                  alt={product.brandLogo.altText || 'Brand logo'}
                                  className="max-h-full max-w-full object-contain"
                                  height={500}
                                  loading="eager"
                                  priority
                                  sizes="(max-width: 640px) 210px, (max-width: 768px) 315px, (max-width: 1024px) 420px, (max-width: 1280px) 472px, 525px"
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
                            rating: product.rating,
                            reviewCount: product.reviewCount,
                          }}
                        >
                          {/* Bike Image Display */}
                          <div className="relative flex h-[14.5rem] w-[24rem] items-center justify-center transition-all duration-300 ease-in-out sm:h-[18rem] sm:w-[30rem] md:h-[20.5rem] md:w-[38rem] lg:h-[23.5rem] lg:w-[46rem] xl:h-[25.5rem] xl:w-[54rem]">
                            <Stream
                              fallback={
                                <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
                              }
                              value={product.images}
                            >
                              {(imageList) => {
                                // Robust image selection with fallback hierarchy:
                                // 1. Variant-specific default image (first in array) - for variant switching
                                // 2. Main product image (third position) - original main image logic
                                // 3. Hero pattern image (product-hero, main-product, etc.)
                                // 4. Any available image
                                // 5. null (show error message)
                                // Check if first image is a thumbnail, if so skip to main product image
                                const isFirstImageThumbnail = imageList[0]?.alt
                                  ?.toLowerCase()
                                  .includes('thumbnail');
                                const variantImage = isFirstImageThumbnail ? null : imageList[0];
                                const mainProductImage = imageList[2];

                                const heroImage =
                                  variantImage ||
                                  mainProductImage ||
                                  findHeroProductImage(imageList) ||
                                  imageList.find(Boolean) ||
                                  null;

                                return (
                                  <>
                                    {heroImage ? (
                                      <Image
                                        alt={heroImage.alt}
                                        className="sm:scale-115 h-full w-full -translate-y-2 scale-110 object-contain duration-300 ease-out animate-in fade-in zoom-in-95 sm:-translate-y-3 md:-translate-y-4 md:scale-125 lg:-translate-y-6 lg:scale-125 xl:-translate-y-8 xl:scale-125"
                                        height={1500}
                                        key={heroImage.src}
                                        priority
                                        sizes="(max-width: 640px) 384px, (max-width: 768px) 480px, (max-width: 1024px) 608px, (max-width: 1280px) 736px, 864px"
                                        src={heroImage.src}
                                        width={1500}
                                      />
                                    ) : (
                                      <div className="text-center text-gray-500">
                                        No bike image available
                                      </div>
                                    )}

                                    {/* Floating Action Buttons Overlay */}
                                    <ProductImageOverlay
                                      digitalTagLink={digitalTagLink}
                                      galleryButton={
                                        <GalleryButtonWithModal
                                          images={imageList}
                                          productTitle={product.title}
                                        />
                                      }
                                      wishlistButton={wishlistButton}
                                    />
                                  </>
                                );
                              }}
                            </Stream>
                          </div>
                        </BikeVariantCoordinator>

                        {/* Bottom Section - Desktop/Tablet Specifications - Centered with bike */}
                        <div className="hidden md:mt-8 md:flex md:justify-center lg:mt-8 xl:mt-10">
                          <Stream fallback={<BikeSpecsSkeleton />} value={product.bikeSpecs}>
                            {(specs) => {
                              if (!specs || specs.length === 0) return null;

                              return (
                                <div className="w-[38rem] md:w-[38rem] lg:w-[46rem] xl:w-[54rem]">
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
                      additionalActions={null}
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
                );
              }}
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
