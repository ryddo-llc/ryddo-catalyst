import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ProductShowcase } from '~/components/product-showcase';

import Addons from '../layout/addons';
import { BaseProductDetailProduct } from '../layout/product-detail-layout';

// Shared Addons Section - now uses related products instead of separate call
export function ProductAddonsSection({
  product,
  relatedProducts,
  className,
}: {
  product: Streamable<BaseProductDetailProduct | null>;
  relatedProducts: Streamable<
    Array<{ id: string; title: string; href: string; image?: { src: string; alt: string } }>
  >;
  className?: string;
}) {
  return (
    <div className={className}>
      <Stream fallback={null} value={product}>
        {(productData) =>
          productData ? <Addons addons={relatedProducts} name={productData.title} /> : null
        }
      </Stream>
    </div>
  );
}

// Shared ProductShowcase Section
export function ProductShowcaseSection({
  product,
  className,
}: {
  product: Streamable<BaseProductDetailProduct | null>;
  className?: string;
}) {
  return (
    <div className={clsx('w-full', className)}>
      <Stream fallback={null} value={product}>
        {(productData) =>
          productData ? (
            <div>
              <ProductShowcase
                aria-labelledby="product-images-heading"
                images={productData.images}
                productName={productData.title}
              />
            </div>
          ) : null
        }
      </Stream>
    </div>
  );
}
