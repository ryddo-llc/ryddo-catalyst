'use client';

import { clsx } from 'clsx';

import { Badge } from '@/vibes/soul/primitives/badge';
import {
  AddToCartForm,
  CompareAddToCartAction,
} from '@/vibes/soul/primitives/compare-card/add-to-cart-form';
import { Favorite } from '@/vibes/soul/primitives/favorite';
import type { Price } from '@/vibes/soul/primitives/price-label';
import type { Product } from '@/vibes/soul/primitives/product-card';
import { Compare } from '@/vibes/soul/primitives/product-card/compare';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

export interface GalleryProduct extends Product {
  hasVariants?: boolean;
  disabled?: boolean;
  isPreorder?: boolean;
}

export interface GalleryProductCardProps {
  product: GalleryProduct;
  className?: string;
  showCompare?: boolean;
  compareLabel?: string;
  compareParamName?: string;
  addToCartLabel?: string;
  preorderLabel?: string;
  addToCartAction?: CompareAddToCartAction;
}

export function GalleryProductCard({
  product,
  className,
  showCompare = true,
  compareLabel = 'Compare',
  compareParamName,
  addToCartLabel = 'Add to Cart',
  preorderLabel = 'Preorder',
  addToCartAction,
}: GalleryProductCardProps) {
  const { id, title, name, href, image, price, onSale, outOfStock, disabled, isPreorder } = product;
  const productName = name || title;

  return (
    <article
      className={clsx(
        'group overflow-hidden rounded-2xl bg-white shadow-sm',
        'transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-[#F92F7B]',
        className,
      )}
    >
      <div className="flex flex-col md:flex-row">
        {/* Left: Image Gallery */}
        <Link className="w-full p-3 md:w-1/2" href={href}>
          {/* Main Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
            {image?.src ? (
              <Image
                alt={productName || 'Product image'}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                src={image.src}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                No image
              </div>
            )}
            {/* Badges */}
            {onSale && (
              <Badge className="absolute left-3 top-3 bg-[#F92F7B] text-white" shape="rounded">
                Sale!
              </Badge>
            )}
            {outOfStock && (
              <Badge className="absolute right-3 top-3 bg-[#0000009e] text-white" shape="rounded">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Thumbnails Row */}
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg" key={i}>
                {image?.src ? (
                  <Image
                    alt={`${productName} view ${i}`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 33vw, 10vw"
                    src={image.src}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100" />
                )}
              </div>
            ))}
          </div>
        </Link>

        {/* Right: Product Details */}
        <div className="flex w-full flex-col justify-center p-4 md:w-1/2 md:p-6">
          {/* Product Name */}
          <Link href={href}>
            <h2 className="text-lg font-bold text-gray-900 transition-colors hover:text-[#F92F7B] md:text-xl">
              {productName}
            </h2>
          </Link>

          {/* Price */}
          <div className="mt-2">
            <PriceDisplay price={price} />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-2">
            {/* Add to Cart - using existing AddToCartForm */}
            {addToCartAction && (
              <div className="flex-1">
                <AddToCartForm
                  addToCartAction={addToCartAction}
                  addToCartLabel={addToCartLabel}
                  disabled={disabled || outOfStock}
                  isPreorder={isPreorder}
                  preorderLabel={preorderLabel}
                  productId={id}
                />
              </div>
            )}

            {/* Compare - using existing Compare component */}
            {showCompare && (
              <Compare
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#F92F7B] hover:text-[#F92F7B]"
                label={compareLabel}
                paramName={compareParamName}
                product={{ id, title: productName, href, image }}
              />
            )}

            {/* Wishlist Heart - using existing Favorite component */}
            <Favorite label="Add to wishlist" variant="simple" />
          </div>
        </div>
      </div>
    </article>
  );
}

function PriceDisplay({ price }: { price: Price | undefined }) {
  if (!price) return null;

  if (typeof price === 'string') {
    return <span className="text-xl font-semibold text-gray-900">{price}</span>;
  }

  if (price.type === 'sale') {
    return (
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-gray-500 line-through">{price.previousValue}</span>
        <span className="text-xl font-semibold text-gray-900">{price.currentValue}</span>
      </div>
    );
  }

  // Range price
  return (
    <span className="text-xl font-semibold text-gray-900">
      {price.minValue} – {price.maxValue}
    </span>
  );
}
