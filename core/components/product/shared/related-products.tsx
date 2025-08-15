import { Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { ProductList } from '@/vibes/soul/sections/product-list';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';

interface RelatedProductsProps {
  products: Streamable<Product[]>;
  compareProducts?: Streamable<Product[]>;
  showCompare?: boolean;
  compareHref?: string;
  compareLabel?: string;
  compareParamName?: string;
  removeLabel?: string;
  maxItems?: number;
  maxCompareLimitMessage?: string;
}

export default function RelatedProducts({
  products,
  compareProducts = [],
  showCompare = true,
  compareHref,
  compareLabel = 'Compare',
  compareParamName = 'compare',
  removeLabel,
  maxItems = 3,
  maxCompareLimitMessage,
}: RelatedProductsProps) {
  return (
    <SectionLayout containerSize="2xl">
      <div className="mb-6 @4xl:mb-8">
        <header>
          <h2 className="text-4xl font-extrabold leading-none text-gray-900 @xl:text-5xl @4xl:text-6xl">
            <span className="text-[#F92F7B]">Related</span> Products
            <span className="text-gray-900">.</span>
          </h2>
        </header>
      </div>
      <div className="group/related-products">
        <ProductList
          className="[&>div]:grid [&>div]:grid-cols-1 [&>div]:gap-6 [&>div]:sm:grid-cols-2 [&>div]:lg:grid-cols-4"
          compareHref={compareHref}
          compareLabel={compareLabel}
          compareParamName={compareParamName}
          compareProducts={compareProducts}
          emptyStateSubtitle="Check out our other products"
          emptyStateTitle="No related products found"
          maxCompareLimitMessage={maxCompareLimitMessage}
          maxItems={maxItems}
          placeholderCount={4}
          products={products}
          removeLabel={removeLabel}
          showCompare={showCompare}
        />
      </div>
    </SectionLayout>
  );
}