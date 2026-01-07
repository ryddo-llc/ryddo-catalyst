import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { CompareDrawer, CompareDrawerProvider } from '@/vibes/soul/primitives/compare-drawer';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import { Image } from '~/components/image';
import { type ProductSpecification } from '~/components/product/shared/product-specifications';
import { SectionContainer } from '~/components/section-container';
import type { ColorOption } from '~/data-transformers/product-transformer';
import { getBase64BlurDataURL } from '~/lib/generate-blur-placeholder';
import { selectProductDisplayImage } from '~/lib/image-resolver';
import { imageManagerImageUrl } from '~/lib/store-assets';

import { ProductMobileSection } from './product-mobile-section';
import { ProductSpecsIcons } from './product-specs-icons';
import { ProductVariantCoordinator } from './product-variant-coordinator';
import { GalleryButtonWithModal } from './shared/gallery-button-with-modal';
import { ProductBadges } from './shared/product-badges';
import { ProductDetailSkeleton, ProductSpecsSkeleton } from './shared/product-detail-skeletons';
import { ProductImageOverlay } from './shared/product-image-overlay';

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

interface ProductDetailProduct extends BaseProductDetailProduct {
  productSpecs?: Streamable<ProductSpecification[] | null>;
  backgroundImage?: string;
  colors?: ColorOption[];
  brandLogo?: { url: string; altText: string } | null;
  warranty?: string | null;
}

export interface ProductDetailProps<F extends Field> {
  product: Streamable<ProductDetailProduct | null>;
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

export function ProductDetail<F extends Field>({
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
}: ProductDetailProps<F>) {
  return (
    <Stream fallback={<ProductDetailSkeleton />} value={compareProducts || []}>
      {(compareItems) => (
        <CompareDrawerProvider
          items={compareItems}
          maxCompareLimitMessage={maxCompareLimitMessage}
          maxItems={maxCompareItems}
        >
          <SectionContainer>
            <SectionContainer.Outer
              radius={30}
              rounded="bottom"
              padding="pb-10"
              innerPadding="px-2"
              aria-labelledby="product-heading"
            >
              <Stream fallback={<ProductDetailSkeleton />} value={streamableProduct}>
                {(product) => {
                  if (!product) return null;

                  return (
                    <SectionContainer.Inner
                      radius={30}
                      minHeight="min-h-[70vh]"
                      overflow="hidden"
                      className="relative"
                    >
                      {/* Background Image - Loaded immediately */}
                      <div className="absolute inset-0 h-full w-full overflow-hidden rounded-[30px] opacity-55">
                        <Image
                          alt="detail page background"
                          blurDataURL={getBase64BlurDataURL()}
                          className="object-cover"
                          fill
                          placeholder="blur"
                          quality={60}
                          src={
                            product.backgroundImage ||
                            imageManagerImageUrl('default-ebike-background.png', 'original')
                          }
                        />
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
                                    sizes="(max-width: 640px) 210px, (max-width: 768px) 315px, (max-width: 1024px) 420px, (max-width: 1280px) 472px, 525px"
                                    src={product.brandLogo.url}
                                    width={500}
                                  />
                                </div>
                              )}
                            </div>
                          </header>

                          {/* Middle Section - Center product image with absolutely positioned sidebars */}
                          <ProductVariantCoordinator
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
                            {/* Product Image Display */}
                            <div className="relative flex h-[14.14rem] w-[23.4rem] translate-y-7 items-center justify-center sm:h-[17.55rem] sm:w-[29.25rem] md:h-[19.99rem] md:w-[37.05rem] lg:h-[22.91rem] lg:w-[44.85rem] xl:h-[24.86rem] xl:w-[52.65rem]">
                              <Stream
                                fallback={
                                  <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
                                }
                                value={product.images}
                              >
                                {(imageList) => {
                                  const heroImage = selectProductDisplayImage(imageList);

                                  return (
                                    <>
                                      {heroImage ? (
                                        <Image
                                          alt={heroImage.alt}
                                          className="h-full w-full -translate-y-2 scale-[1.0725] object-contain sm:-translate-y-3 sm:scale-[1.1213] md:-translate-y-4 md:scale-[1.2188] lg:-translate-y-6 lg:scale-[1.2188] xl:-translate-y-8 xl:scale-[1.2188]"
                                          height={1500}
                                          key={heroImage.src}
                                          priority
                                          sizes="(max-width: 640px) 384px, (max-width: 768px) 480px, (max-width: 1024px) 608px, (max-width: 1280px) 736px, 864px"
                                          src={heroImage.src}
                                          width={1500}
                                        />
                                      ) : (
                                        <div className="text-center text-gray-500">
                                          No product image available
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
                          </ProductVariantCoordinator>

                          {/* Bottom Section - Desktop/Tablet Specifications - Centered with product */}
                          <div className="ml-12 hidden md:mt-10 md:flex md:justify-center lg:mt-10 xl:mt-10">
                            <Stream
                              fallback={<ProductSpecsSkeleton />}
                              value={product.productSpecs}
                            >
                              {(specs) => {
                                if (!specs || specs.length === 0) return null;

                                return (
                                  <div className="w-[24rem] sm:w-[30rem] md:w-[38rem] lg:w-[46rem] xl:w-[54rem]">
                                    <ProductSpecsIcons specs={specs} />
                                  </div>
                                );
                              }}
                            </Stream>
                          </div>
                        </div>
                      </div>

                      {/* Additional Content Below - Only show on mobile */}
                      <ProductMobileSection
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
                          productSpecs: product.productSpecs,
                          colors: product.colors,
                        }}
                      />
                    </SectionContainer.Inner>
                  );
                }}
              </Stream>
            </SectionContainer.Outer>
          </SectionContainer>

          <CompareDrawer href="/compare" submitLabel={compareLabel} />
        </CompareDrawerProvider>
      )}
    </Stream>
  );
}

// Re-export the skeleton for external use
export { ProductDetailSkeleton };
