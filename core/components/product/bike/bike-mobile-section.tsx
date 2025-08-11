import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Rating } from '@/vibes/soul/primitives/rating';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ProductSpecification } from '~/components/product/shared/product-specifications';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';

import {
  ProductDetailFormSkeleton,
  ProductSummarySkeleton,
  RatingSkeleton,
} from '../shared/product-detail-skeletons';

import { BikeAddToCartForm } from './bike-add-to-cart-form';
import { BikeMobileSpecs } from './bike-mobile-specs';
import { ProductPrice } from './types';

interface BikeMobileSectionProps<F extends Field> {
  product: {
    id: string;
    title: string;
    href: string;
    images: Streamable<Array<{ src: string; alt: string }>>;
    rating?: Streamable<number | null>;
    summary?: Streamable<string>;
    price?: ProductPrice;
    bikeSpecs?: Streamable<ProductSpecification[] | null>;
    colors?: ColorOption[];
  };
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  additionalActions?: ReactNode;
  defaultPrice?: string;
}

export function BikeMobileSection<F extends Field>({
  product,
  action,
  fields,
  ctaLabel,
  ctaDisabled,
  additionalActions,
  defaultPrice = '$0',
}: BikeMobileSectionProps<F>) {
  return (
    <div className="relative z-20 bg-white p-4 md:hidden">
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
              fields,
              ctaLabel,
              ctaDisabled,
            ])}
          >
            {([images, streamedFields, streamedCtaLabel, streamedCtaDisabled]) => (
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
                      let displayPrice = defaultPrice;

                      if (typeof price === 'string') {
                        displayPrice = price;
                      } else if (
                        price &&
                        typeof price === 'object' &&
                        'type' in price &&
                        price.type === 'sale' &&
                        'currentValue' in price &&
                        price.currentValue
                      ) {
                        displayPrice = price.currentValue;
                      } else if (
                        price &&
                        typeof price === 'object' &&
                        'type' in price &&
                        'minValue' in price &&
                        'maxValue' in price &&
                        price.minValue &&
                        price.maxValue
                      ) {
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
                  ctaLabel={streamedCtaLabel || 'Add to cart'}
                  disabled={streamedCtaDisabled || false}
                  fields={streamedFields}
                  productId={product.id}
                />
              </div>
            )}
          </Stream>
        </div>

        {/* Mobile Specifications */}
        <BikeMobileSpecs bikeSpecs={product.bikeSpecs} />
      </div>
    </div>
  );
}