import { clsx } from 'clsx';

import { CompareAddToCartAction } from '@/vibes/soul/primitives/compare-card/add-to-cart-form';
import { GalleryProduct, GalleryProductCard } from '~/components/gallery-product-card';

export interface GalleryProductListProps {
  products: GalleryProduct[];
  className?: string;
  showCompare?: boolean;
  compareLabel?: string;
  compareParamName?: string;
  addToCartLabel?: string;
  preorderLabel?: string;
  addToCartAction?: CompareAddToCartAction;
}

export function GalleryProductList({
  products,
  className,
  showCompare = true,
  compareLabel,
  compareParamName,
  addToCartLabel,
  preorderLabel,
  addToCartAction,
}: GalleryProductListProps) {
  if (products.length === 0) {
    return <div className="py-12 text-center text-gray-500">No products found</div>;
  }

  return (
    <div className={clsx('grid grid-cols-1 gap-6 lg:grid-cols-2', className)}>
      {products.map((product) => (
        <GalleryProductCard
          addToCartAction={addToCartAction}
          addToCartLabel={addToCartLabel}
          compareLabel={compareLabel}
          compareParamName={compareParamName}
          key={product.id}
          preorderLabel={preorderLabel}
          product={product}
          showCompare={showCompare}
        />
      ))}
    </div>
  );
}
