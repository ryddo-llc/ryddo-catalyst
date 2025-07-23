import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Rating } from '@/vibes/soul/primitives/rating';
import {
  ProductDetailForm,
  ProductDetailFormAction,
} from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import { Image } from '~/components/image';

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

import { BikeSpecsIcons } from './bike-specifications';

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

interface ColorOption {
  entityId: number;
  label: string;
  hexColors?: string[];
  imageUrl?: string;
  isSelected?: boolean;
  isDefault?: boolean;
}

interface ProductDetailBikeProduct extends BaseProductDetailProduct {
  bikeSpecs?: Streamable<BikeSpecifications | null>;
  backgroundImage?: string;
  colors?: ColorOption[];
}

export interface ProductDetailBikeProps<F extends Field> {
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
  additionalActions?: ReactNode;
}

export function ProductDetailBike<F extends Field>({
  product: streamableProduct,
  action,
  fields: streamableFields,
  quantityLabel,
  incrementLabel,
  decrementLabel,
  emptySelectPlaceholder,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  prefetch,
  additionalActions,
}: ProductDetailBikeProps<F>) {
  return (
    <section aria-labelledby="product-heading" className="relative w-full">
      <Stream fallback={<ProductDetailBikeSkeleton />} value={streamableProduct}>
        {(product) =>
          product && (
            <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh]">
              {/* Background Image */}
              <div className="absolute inset-0 h-full w-full opacity-40">
                <Stream
                  fallback={<div className="h-full w-full bg-gray-100" />}
                  value={product.images}
                >
                  {(images) => {
                    const backgroundSrc =
                      product.backgroundImage ||
                      images[1]?.src ||
                      '/images/backgrounds/default-background.png';

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
              <div className="relative z-0 flex h-full flex-col justify-center px-4 py-8 md:px-8">
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
                      className="font-['Nunito'] text-3xl font-black leading-tight text-zinc-800 md:text-5xl lg:text-6xl xl:text-7xl"
                      id="product-heading"
                    >
                      {product.title}
                      <span aria-hidden="true" className="text-[#F92F7B]">
                        .
                      </span>
                    </h1>
                    <Stream fallback={<div className="h-4 animate-pulse bg-gray-200" />} value={product.description}>
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
                                height={1000}
                                priority
                                src={bikeImage.src}
                                width={1000}
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
                      <AuthorizedDealerCard product={product} />
                    </div>
                  </div>

                  {/* Bottom Section - Specs Grid */}
                  <div className="mt-auto">
                    <Stream fallback={<BikeSpecsSkeleton />} value={product.bikeSpecs}>
                      {(specs) => specs && <BikeSpecsIcons specs={specs} />}
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
                        Boolean(summary) && <p className="text-lg text-neutral-600">{summary}</p>
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
                </div>
              </div>
            </div>
          )
        }
      </Stream>
    </section>
  );
}

// Re-export the skeleton for external use
export { ProductDetailBikeSkeleton };
