'use client';

import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Compare } from '@/vibes/soul/primitives/product-card/compare';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';

import { ColorOption } from '../../../data-transformers/bike-product-transformer';
import { BikeAddToCartForm } from '../../product/bike/bike-add-to-cart-form';
import { ScooterAddToCartForm } from '../../product/scooter/scooter-add-to-cart-form';

interface ProductPrice {
  type?: 'sale' | 'range';
  currentValue?: string;
  previousValue?: string;
}

interface ProductWithSideCardData<F extends Field = Field> {
  id: string;
  title: string;
  href: string;
  images?: Array<{ src: string; alt: string }>;
  price?: Streamable<ProductPrice | string | null>;
  colors?: ColorOption[];
  warranty?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  // Form props for add to cart functionality
  action?: ProductDetailFormAction<F>;
  fields?: F[];
  ctaLabel?: string;
  ctaDisabled?: boolean;
  additionalActions?: ReactNode;
  productType?: 'bike' | 'scooter';
}

// Offers Card Component
export function OffersCard() {
  return (
    <aside
      aria-labelledby="offers-heading"
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900" id="offers-heading">
        Special Offers
      </h3>
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
    </aside>
  );
}

// Authorized Dealer Card Component
// Calculate monthly payment for Klarna (36 months)
const calculateKlarnaPayment = (price: ProductPrice | string | null | undefined): string => {
  if (!price) return '$0';

  let numericPrice: number;

  if (typeof price === 'string') {
    // Extract number from string like "$1,234.56"
    numericPrice = parseFloat(price.replace(/[$,]/g, ''));
  } else if (price.currentValue) {
    numericPrice = parseFloat(price.currentValue.replace(/[$,]/g, ''));
  } else {
    return '$0';
  }

  if (Number.isNaN(numericPrice)) return '$0';

  // Klarna monthly payments - divide by 36 months
  const monthlyPayment = numericPrice / 36;

  return `$${Math.round(monthlyPayment)}`;
};

export function AuthorizedDealerCard<F extends Field = Field>({
  product,
}: {
  product: ProductWithSideCardData<F>;
}) {
  return (
    <div className="max-w-sm rounded-2xl bg-white/75 p-6 text-right md:p-7 lg:p-8">
      {/* Price Section */}
      <div className="mb-6">
        <Stream fallback={<Skeleton.Box className="ml-auto h-12 w-32" />} value={product.price}>
          {(price) => {
            const displayPrice =
              typeof price === 'string' ? price : (price?.currentValue ?? '');
            const klarnaPayment = calculateKlarnaPayment(price);

            return (
              <>
                <div className="mb-0 pt-2 text-6xl font-black leading-none text-zinc-800">
                  <span className="font-kanit">{displayPrice}</span>
                  <span aria-hidden="true" className="text-[#F92F7B]">
                    .
                  </span>
                </div>
                <div className="font-kanit text-sm font-medium leading-snug text-stone-400 mt-1">
                  <span className="font-['Inter'] font-semibold text-black text-lg">
                    {klarnaPayment}/mo. with Klarna
                  </span>
                  <br />
                  <span className="cursor-pointer font-['Inter'] font-semibold text-black underline">
                    Check your purchase power
                  </span>
                </div>
              </>
            );
          }}
        </Stream>

        {/* Rating - Bikes Only */}
        {product.productType === 'bike' && product.rating ? (
          <div className="mt-4">
            <div className="flex items-center justify-end gap-2">
              <span className="font-['Inter'] text-lg font-semibold text-black">({product.reviewCount || 15})</span>
              <div className="flex items-center">
                <Rating rating={product.rating} showRating={false} />
              </div>
            </div>
          </div>
        ) : null}

        {/* Warranty Information - Bikes Only */}
        {product.productType === 'bike' && product.warranty ? (
          <div className="mt-2 pt-2">
            <div className="mb-2 font-kanit text-lg font-semibold text-black">
              {product.warranty}
            </div>
          </div>
        ) : null}
      </div>

      {/* Action Buttons - Side by Side */}
      <div className="mb-6">
        {product.action && product.fields && product.productType === 'scooter' && (
          <ScooterAddToCartForm
            action={product.action}
            additionalActions={product.additionalActions}
            compareProduct={{
              id: product.id,
              title: product.title,
              href: product.href,
              image: product.images?.[0],
            }}
            ctaLabel={product.ctaLabel || 'Add to Cart'}
            disabled={product.ctaDisabled}
            fields={product.fields}
            productId={product.id}
          />
        )}

        {product.action && product.fields && product.productType === 'bike' && (
          <BikeAddToCartForm
            action={product.action}
            additionalActions={product.additionalActions}
            compareProduct={{
              id: product.id,
              title: product.title,
              href: product.href,
              image: product.images?.[0],
            }}
            ctaLabel={product.ctaLabel || 'Add to Cart'}
            disabled={product.ctaDisabled}
            fields={product.fields}
            productId={product.id}
          />
        )}

        {(!product.action || !product.fields) && (
          <div className="flex flex-col items-stretch gap-3">
            <button
              className="min-h-[43px] rounded-full bg-[#F92F7B] px-4 py-2.5 text-base font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={product.ctaDisabled}
            >
              {product.ctaLabel || 'Add to Cart'}
            </button>
            <Compare
              className="min-h-[43px] rounded-full bg-black/[.62] px-4 py-2.5 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              label="Compare"
              product={{
                id: product.id,
                title: product.title,
                href: product.href,
                image: product.images?.[0],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
