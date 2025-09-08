'use client';

import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Compare } from '@/vibes/soul/primitives/product-card/compare';
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
export function AuthorizedDealerCard<F extends Field = Field>({ product }: { product: ProductWithSideCardData<F> }) {
  return (
    <div className="max-w-sm text-right rounded-lg bg-white/50 p-4 md:p-5 lg:p-6 backdrop-blur-md">
      {/* Authorized Dealer Header */}
      <div className="mb-6">
        <h3 className="text-xl mb-1 font-black font-['Inter'] text-zinc-800">Authorized Dealer</h3>
        <p className="text-base font-medium font-['Inter'] leading-snug text-stone-400">
          Specializing in service
          <br />& custom modifications
        </p>
      </div>

      {/* Price Section */}
      <div className="mb-6">
        <Stream fallback={<Skeleton.Box className="ml-auto h-12 w-32" />} value={product.price}>
          {(price) => {
            const displayPrice =
              typeof price === 'string' ? price : price?.currentValue || '$3,695';

            return (
              <>
                <div className="mb-2 text-4xl font-black font-['Inter'] text-zinc-800">{displayPrice}</div>
                <div className="text-base font-medium font-['Inter'] leading-snug text-stone-400">
                  <span>Payment options available </span>
                  <span className="font-black font-['Inter'] text-pink-600">with Affirm, Klarna</span>
                  <br />
                  <span className="cursor-pointer font-black font-['Inter'] text-pink-600 underline">
                    Learn more
                  </span>
                </div>
              </>
            );
          }}
        </Stream>
      </div>

      {/* Action Buttons - Side by Side */}
      <div className="mb-6">
        {product.action && product.fields && product.productType === 'scooter' && (
          <ScooterAddToCartForm
            action={product.action}
            additionalActions={product.additionalActions}
            colors={product.colors}
            compareProduct={{
              id: product.id,
              title: product.title,
              href: product.href,
              image: product.images?.[0]
            }}
            ctaLabel={product.ctaLabel || "Add to cart"}
            disabled={product.ctaDisabled}
            fields={product.fields}
            productId={product.id}
          />
        )}
        
        {product.action && product.fields && product.productType === 'bike' && (
          <BikeAddToCartForm
            action={product.action}
            additionalActions={product.additionalActions}
            colors={product.colors}
            compareProduct={{
              id: product.id,
              title: product.title,
              href: product.href,
              image: product.images?.[0]
            }}
            ctaLabel={product.ctaLabel || "Add to cart"}
            disabled={product.ctaDisabled}
            fields={product.fields}
            productId={product.id}
          />
        )}

        {(!product.action || !product.fields) && (
          <div className="flex gap-3 justify-end items-stretch">
            <Compare
              className="w-24 bg-black/[.62] text-white min-h-[43px] px-4 py-2.5 rounded-full text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              label="Compare"
              product={{
                id: product.id,
                title: product.title,
                href: product.href,
                image: product.images?.[0]
              }}
            />
            <button 
              className="w-24 bg-[#F92F7B] text-white min-h-[43px] px-4 py-2.5 rounded-full font-bold hover:bg-pink-600 transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.ctaDisabled}
            >
              {product.ctaLabel || "Add to cart"}
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
