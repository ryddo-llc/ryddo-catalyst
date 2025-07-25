import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { CompareDrawer, CompareDrawerProvider } from '@/vibes/soul/primitives/compare-drawer';
import { Rating } from '@/vibes/soul/primitives/rating';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { getSessionCustomerAccessToken } from '~/auth';
import { Image } from '~/components/image';
import type { ProductSpecification } from '~/components/product/shared/product-specifications';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';

import Addons from '../layout/addons';
import { getAccessories } from '../layout/addons-query';
import { BaseProductDetailProduct } from '../layout/product-detail-layout';
import { ProductBadges } from '../shared/product-badges';
import {
  BikeImageSkeleton,
  BikeSpecsSkeleton,
  ProductDetailBikeSkeleton,
  ProductDetailFormSkeleton,
  ProductSummarySkeleton,
  RatingSkeleton,
} from '../shared/product-detail-skeletons';
import { AuthorizedDealerCard, OffersCard } from '../shared/product-side-cards';

import { BikeAddToCartForm } from './bike-add-to-cart-form';
import { BikeSpecsIcons } from './bike-specifications';

interface ProductDetailBikeProduct extends BaseProductDetailProduct {
  bikeSpecs?: Streamable<ProductSpecification[] | null>;
  backgroundImage?: string;
  colors?: ColorOption[];
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
  // Create streamable addons data
  const streamableAddons = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const accessories = await getAccessories(customerAccessToken);

    // Simple transformation - only what we need for images
    return accessories.map((accessory) => ({
      id: accessory.entityId.toString(),
      title: accessory.name,
      href: accessory.path,
      image: accessory.defaultImage
        ? {
            src: accessory.defaultImage.url,
            alt: accessory.defaultImage.altText,
          }
        : undefined,
    }));
  });

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
                  <div className="relative min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh]">
                    {/* Background Image */}
                    <div className="absolute inset-0 h-full w-full">
                      <Stream
                        fallback={<div className="h-full w-full bg-gray-100" />}
                        value={product.images}
                      >
                        {(images) => {
                          const backgroundSrc =
                            product.backgroundImage ||
                            images[1]?.src ||
                            '/images/backgrounds/default-background.webp';

                          return (
                            <Image
                              alt="detail page background"
                              className="object-cover"
                              fill
                              priority
                              src={backgroundSrc}
                            />
                          );
                        }}
                      </Stream>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-0 flex h-full flex-col justify-start px-4 py-4 md:px-8 md:py-6">
                      <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
                        {/* Top Section - Product Name & Stock */}
                        <div className="mb-4 text-center md:mb-8">
                          {/* Product Badges */}
                          <ProductBadges
                            inventoryStatus={product.inventoryStatus}
                            price={product.price}
                          />

                          {/* Product Title */}
                          <h1
                            className="px-4 font-['Nunito'] text-2xl font-black leading-tight text-zinc-800 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                            id="product-heading"
                          >
                            {product.title}
                            <span aria-hidden="true" className="text-[#F92F7B]">
                              .
                            </span>
                          </h1>
                          <Stream
                            fallback={<div className="h-4 animate-pulse bg-gray-200" />}
                            value={product.description}
                          >
                            {(description) =>
                              Boolean(description) && (
                                <div className="justify-center self-stretch text-center font-['Nunito'] text-3xl font-medium leading-loose text-neutral-500">
                                  {description}
                                </div>
                              )
                            }
                          </Stream>
                        </div>

                        {/* Middle Section - Bike Image Centered with Cards on Sides */}
                        <div className="relative mb-8 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                          {/* Centered Bike Image */}
                          <div className="flex items-center justify-center">
                            <div className="mx-auto w-full max-w-xs px-4 sm:max-w-sm md:max-w-lg lg:max-w-3xl xl:max-w-4xl">
                              <Stream fallback={<BikeImageSkeleton />} value={product.images}>
                                {(images) => {
                                  const bikeImage = images[2] ?? images[0];

                                  return bikeImage ? (
                                    <Image
                                      alt={bikeImage.alt}
                                      className="h-auto max-h-full w-full object-contain"
                                      height={2000}
                                      priority
                                      src={bikeImage.src}
                                      width={2000}
                                    />
                                  ) : (
                                    <div className="text-center text-gray-500">
                                      No bike image available (index 2)
                                    </div>
                                  );
                                }}
                              </Stream>
                            </div>
                          </div>

                          {/* Left side - OffersCard */}
                          <div className="absolute left-0 top-0 z-0 hidden lg:block">
                            <OffersCard />
                          </div>

                          {/* Right side - PriceCard */}
                          <div className="absolute right-0 top-0 z-0 hidden lg:block">
                            <Stream
                              fallback={<ProductDetailFormSkeleton />}
                              value={Streamable.all([
                                product.images,
                                streamableFields,
                                streamableCtaLabel,
                                streamableCtaDisabled,
                              ])}
                            >
                              {([images, fields, ctaLabel, ctaDisabled]) => (
                                <AuthorizedDealerCard
                                  product={{
                                    id: product.id,
                                    title: product.title,
                                    href: product.href,
                                    images,
                                    price: product.price,
                                    colors: product.colors,
                                    action,
                                    fields,
                                    ctaLabel: ctaLabel || undefined,
                                    ctaDisabled: ctaDisabled || undefined,
                                    additionalActions,
                                  }}
                                />
                              )}
                            </Stream>
                          </div>
                        </div>

                        {/* Bottom Section - Specs Grid */}
                        <div className="mt-auto">
                          <Stream fallback={<BikeSpecsSkeleton />} value={product.bikeSpecs}>
                            {(specs) =>
                              specs && (
                                <SectionLayout>
                                  <BikeSpecsIcons specs={specs} />
                                </SectionLayout>
                              )
                            }
                          </Stream>
                        </div>
                      </div>
                    </div>

                    {/* Additional Content Below - Only show on mobile or when needed */}
                    <div className="bg-white p-4 lg:hidden">
                      <div className="mx-auto max-w-2xl space-y-6">
                        <div className="group/product-rating text-center">
                          <Stream fallback={<RatingSkeleton />} value={product.rating}>
                            {(rating) => <Rating rating={rating ?? 0} />}
                          </Stream>
                        </div>

                        <div className="group/product-summary text-center">
                          <Stream fallback={<ProductSummarySkeleton />} value={product.summary}>
                            {(summary) =>
                              Boolean(summary) && (
                                <p className="text-lg text-neutral-600">{summary}</p>
                              )
                            }
                          </Stream>
                        </div>

                        <div className="group/product-detail-form">
                          <Stream
                            fallback={<ProductDetailFormSkeleton />}
                            value={Streamable.all([
                              product.images,
                              streamableFields,
                              streamableCtaLabel,
                              streamableCtaDisabled,
                            ])}
                          >
                            {([images, fields, ctaLabel, ctaDisabled]) => (
                              <div className="space-y-6">
                                {/* Mobile Price Display */}
                                <div className="text-center">
                                  <Stream
                                    fallback={
                                      <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
                                    }
                                    value={product.price}
                                  >
                                    {(price) => {
                                      let displayPrice = '$3,695';

                                      if (typeof price === 'string') {
                                        displayPrice = price;
                                      } else if (
                                        price &&
                                        'type' in price &&
                                        price.type === 'sale' &&
                                        'currentValue' in price
                                      ) {
                                        displayPrice = price.currentValue;
                                      } else if (price && 'type' in price && 'minValue' in price) {
                                        displayPrice = `${price.minValue} - ${price.maxValue}`;
                                      }

                                      return (
                                        <div className="text-3xl font-black text-gray-900">
                                          {displayPrice}
                                        </div>
                                      );
                                    }}
                                  </Stream>
                                </div>

                                {/* Mobile Bike Add to Cart Form with Colors */}
                                <BikeAddToCartForm
                                  action={action}
                                  additionalActions={additionalActions}
                                  colors={product.colors}
                                  compareProduct={{
                                    id: product.id,
                                    title: product.title,
                                    href: product.href,
                                    image: images[0],
                                  }}
                                  ctaLabel={ctaLabel || 'Add to cart'}
                                  disabled={ctaDisabled || false}
                                  fields={fields}
                                  productId={product.id}
                                />
                              </div>
                            )}
                          </Stream>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </Stream>
          </section>

          {/* Addons section */}
          <Stream fallback={null} value={streamableProduct}>
            {(product) =>
              product ? <Addons addons={streamableAddons} name={product.title} /> : null
            }
          </Stream>

          <CompareDrawer href="/compare" submitLabel={compareLabel} />
        </CompareDrawerProvider>
      )}
    </Stream>
  );
}

// Re-export the skeleton for external use
export { ProductDetailBikeSkeleton };
