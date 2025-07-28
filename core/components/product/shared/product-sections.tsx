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
  title = 'Product Images',
}: {
  product: Streamable<BaseProductDetailProduct | null>;
  className?: string;
  title?: string;
}) {
  return (
    <div className={className}>
      <Stream fallback={null} value={product}>
        {(productData) =>
          productData ? (
            <div className="mt-12 pt-8">
              <h2 className="mb-6 text-center font-[family-name:var(--font-family-heading)] text-2xl font-bold">
                {title}
              </h2>
              <ProductShowcase
                aria-labelledby="product-images-heading"
                images={productData.images}
              />
            </div>
          ) : null
        }
      </Stream>
    </div>
  );
}
