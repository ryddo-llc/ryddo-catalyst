'use client';

import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Compare } from '@/vibes/soul/primitives/product-card/compare';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';

import { ColorOption } from '../../../data-transformers/bike-product-transformer';
import { BikeAddToCartForm } from '../../product/bike/bike-add-to-cart-form';

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
    <div className="max-w-sm text-right">
      {/* Authorized Dealer Header */}
      <div className="mb-6">
        <h3 className="text-md mb-1 font-bold text-gray-900">Authorized Dealer</h3>
        <p className="text-xs leading-relaxed text-[#AE9D77]">
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
                <div className="mb-2 text-4xl font-black text-gray-900">{displayPrice}</div>
                <div className="text-xs leading-relaxed text-gray-600">
                  <span>Payment options available </span>
                  <span className="font-medium text-pink-500">with Affirm, Klarna</span>
                  <br />
                  <span className="cursor-pointer font-medium text-pink-500 underline">
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
        {product.action && product.fields ? (
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
        ) : (
          <div className="flex gap-3 justify-end">
            <Compare
              label="Compare"
              product={{
                id: product.id,
                title: product.title,
                href: product.href,
                image: product.images?.[0]
              }}
            />
            <button 
              className="bg-[#F92F7B] text-white py-2 px-5 rounded-full font-semibold hover:bg-pink-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
