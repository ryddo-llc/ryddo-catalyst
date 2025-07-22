import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import {
  ProductDetailForm,
  ProductDetailFormAction,
} from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import { Image } from '~/components/image';

import { BaseProductDetailProduct } from './product-detail-layout';

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
                      product.backgroundImage || images[1]?.src || '/default-background.jpg';

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
              <div className="relative z-10 flex h-full flex-col justify-center px-4 py-8 md:px-8">
                <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
                  {/* Top Section - Product Name & Stock */}
                  <div className="mb-4 text-center md:mb-8">
                    {/* Stock Status */}
                    <div className="mb-4 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                      In Stock
                    </div>

                    {/* Product Title */}
                    <h1
                      className="font-['Nunito'] text-3xl font-black leading-tight text-zinc-800 md:text-5xl lg:text-6xl xl:text-7xl"
                      id="product-heading"
                    >
                      {product.title}
                      <span className="text-[#F92F7B]">.</span>
                    </h1>
                    {product.subtitle ? (
                      <p className="justify-center self-stretch text-center font-['Nunito'] text-3xl font-medium leading-loose text-neutral-500">
                        {product.subtitle}
                      </p>
                    ) : null}
                  </div>

                  {/* Middle Section - Bike Image Centered with Cards on Sides */}
                  <div className="relative mb-8 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                    {/* Centered Bike Image */}
                    <div className="flex items-center justify-center">
                      <div className="mx-auto w-full max-w-xs px-4 sm:max-w-sm md:max-w-lg lg:max-w-3xl xl:max-w-4xl">
                        <Stream fallback={<BikeImageSkeleton />} value={product.images}>
                          {(images) => {
                            const bikeImage = images[2];

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
                    <div className="absolute left-0 top-0 hidden lg:block">
                      <OffersCard />
                    </div>

                    {/* Right side - PriceCard */}
                    <div className="absolute right-0 top-0 hidden lg:block">
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

// Side Card Components
function OffersCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Special Offers</h3>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <span className="text-sm font-bold text-red-600">%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Adventure Full Suspension</p>
            <p className="text-xs text-gray-500">Premium riding experience</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <span className="text-sm font-bold text-blue-600">📱</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Super73 App</p>
            <p className="text-xs text-gray-500">Control your bike digitally</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AuthorizedDealerCardProps {
  product: ProductDetailBikeProduct;
}

function AuthorizedDealerCard({ product }: AuthorizedDealerCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Authorized Dealer</h3>
      <div className="text-center">
        <Stream fallback={<Skeleton.Box className="mx-auto mb-4 h-8 w-24" />} value={product.price}>
          {(price) => (
            <div className="mb-4 text-3xl font-bold text-gray-900">
              {typeof price === 'string' ? price : '$3,695'}
            </div>
          )}
        </Stream>
        <button className="mb-3 w-full rounded-full bg-pink-500 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-600">
          Buy Now
        </button>

        {/* Dynamic Color Swatches from BigCommerce */}
        {product.colors && product.colors.length > 0 ? (
          <>
            <div className="mb-4 flex justify-center space-x-2">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    color.isSelected || color.isDefault ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  key={color.entityId}
                  style={{
                    backgroundColor: color.hexColors?.[0] || '#ccc',
                    backgroundImage: color.imageUrl ? `url(${color.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                  }}
                  title={color.label}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {product.colors.length} color{product.colors.length > 1 ? 's' : ''} available
            </p>
          </>
        ) : (
          // Fallback static colors
          <>
            <div className="mb-4 flex justify-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-gray-800" />
              <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white" />
              <div className="h-4 w-4 rounded-full bg-red-500" />
              <div className="h-4 w-4 rounded-full bg-blue-500" />
            </div>
            <p className="text-sm text-gray-600">4 colors available</p>
          </>
        )}
      </div>
    </div>
  );
}

interface BikeSpecsIconsProps {
  specs: BikeSpecifications;
}

function BikeSpecsIcons({ specs }: BikeSpecsIconsProps) {
  return (
    <div className="flex justify-center space-x-8">
      {specs.motorPower ? (
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
            <span className="text-xl text-pink-600">⚡</span>
          </div>
          <span className="text-sm text-gray-600">Motor Power</span>
        </div>
      ) : null}
      {specs.batteryCapacity ? (
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <span className="text-xl text-green-600">🔋</span>
          </div>
          <span className="text-sm text-gray-600">Battery</span>
        </div>
      ) : null}
      {specs.maxSpeed ? (
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <span className="text-xl text-blue-600">🏃</span>
          </div>
          <span className="text-sm text-gray-600">Max Speed</span>
        </div>
      ) : null}
      {specs.range ? (
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <span className="text-xl text-purple-600">📍</span>
          </div>
          <span className="text-sm text-gray-600">Range</span>
        </div>
      ) : null}
      <div className="flex flex-col items-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
          <span className="text-xl text-orange-600">🎯</span>
        </div>
        <span className="text-sm text-gray-600">Precision</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
          <span className="text-xl text-red-600">🔧</span>
        </div>
        <span className="text-sm text-gray-600">Maintenance</span>
      </div>
    </div>
  );
}

// Skeleton Components
function BikeImageSkeleton() {
  return <Skeleton.Box className="aspect-square w-full max-w-lg rounded-lg" />;
}

function BikeSpecsSkeleton() {
  return (
    <div className="flex justify-center space-x-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div className="flex flex-col items-center" key={idx}>
          <Skeleton.Box className="mb-2 h-12 w-12 rounded-lg" />
          <Skeleton.Box className="h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

function RatingSkeleton() {
  return (
    <Skeleton.Root className="mx-auto flex w-[136px] items-center gap-1" pending>
      <Skeleton.Box className="h-4 w-[100px] rounded-md" />
      <Skeleton.Box className="h-6 w-8 rounded-xl" />
    </Skeleton.Root>
  );
}

function ProductSummarySkeleton() {
  return (
    <Skeleton.Root className="flex w-full flex-col gap-3.5 pb-6" pending>
      {Array.from({ length: 2 }).map((_, idx) => (
        <Skeleton.Box className="mx-auto h-2.5 w-full max-w-md" key={idx} />
      ))}
    </Skeleton.Root>
  );
}

function ProductDetailFormSkeleton() {
  return (
    <Skeleton.Root className="flex flex-col gap-8 py-8" pending>
      <div className="flex justify-center">
        <Skeleton.Box className="h-12 w-48 rounded-full" />
      </div>
    </Skeleton.Root>
  );
}

export function ProductDetailBikeSkeleton() {
  return (
    <section className="relative w-full">
      <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh]">
        {/* Background Skeleton */}
        <div className="absolute inset-0 h-full w-full">
          <Skeleton.Box className="h-full w-full" />
        </div>

        {/* Content Skeleton */}
        <div className="relative z-10 flex h-full flex-col justify-center px-4 py-8 md:px-8">
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
            <Skeleton.Root className="animate-pulse" pending>
              {/* Header */}
              <div className="mb-4 text-center md:mb-8">
                <Skeleton.Box className="mx-auto mb-4 h-8 w-32" />
                <Skeleton.Box className="mx-auto mb-2 h-16 w-96" />
                <Skeleton.Box className="mx-auto h-6 w-48" />
              </div>

              {/* Main Content Area */}
              <div className="relative mb-8 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                {/* Side Cards */}
                <div className="absolute left-0 top-0 hidden lg:block">
                  <Skeleton.Box className="h-64 w-64 rounded-lg" />
                </div>
                <div className="absolute right-0 top-0 hidden lg:block">
                  <Skeleton.Box className="h-64 w-64 rounded-lg" />
                </div>

                {/* Center Image */}
                <div className="mx-auto w-full max-w-xs px-4 sm:max-w-sm md:max-w-lg lg:max-w-3xl xl:max-w-4xl">
                  <Skeleton.Box className="aspect-square w-full rounded-lg" />
                </div>
              </div>

              {/* Bottom Specs */}
              <div className="mt-auto">
                <BikeSpecsSkeleton />
              </div>
            </Skeleton.Root>
          </div>
        </div>
      </div>
    </section>
  );
}
