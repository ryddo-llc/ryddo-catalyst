import { Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { ProductList } from '@/vibes/soul/sections/product-list';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ArrowButton } from '~/components/arrow-button';
import { Link } from '~/components/link';

interface Link {
  label: string;
  href: string;
}

export interface PopularProductsProps {
  title: string;
  description?: string;
  cta?: Link;
  products: Streamable<Product[]>;
  emptyStateTitle?: Streamable<string>;
  emptyStateSubtitle?: Streamable<string>;
  placeholderCount?: number;
  showCompare?: Streamable<boolean>;
  compareLabel?: Streamable<string>;
  compareParamName?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --popular-products-font-family: var(--font-family-body);
 *   --popular-products-title-font-family: var(--font-family-heading);
 *   --popular-products-title: hsl(var(--foreground));
 *   --popular-products-description: hsl(var(--contrast-500));
 * }
 * ```
 */
export function PopularProducts({
  title,
  description,
  cta,
  products,
  emptyStateTitle,
  emptyStateSubtitle,
  placeholderCount = 8,
  showCompare = true,
  compareLabel = 'Compare',
  compareParamName = 'compare',
}: PopularProductsProps) {
  return (
    <SectionLayout containerSize="2xl">
      <div className="mb-6 flex w-full flex-row flex-wrap items-end justify-between gap-x-8 gap-y-6 @4xl:mb-8">
        <header className="font-[family-name:var(--popular-products-font-family,var(--font-family-body))]">
          <h2 className="font-[family-name:var(--popular-products-title-font-family,var(--font-family-heading))] text-2xl leading-none text-[var(--popular-products-title,hsl(var(--foreground)))] @xl:text-3xl @4xl:text-4xl">
            {title}
          </h2>
          {description != null && description !== '' && (
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--popular-products-description,hsl(var(--contrast-500)))]">
              {description}
            </p>
          )}
        </header>
        {cta != null && cta.href !== '' && cta.label !== '' && (
          <Link href={cta.href}>
            <ArrowButton className="bg-[#F92F7B] hover:bg-[#d41f63]">
              {cta.label}
            </ArrowButton>
          </Link>
        )}
      </div>
      <div className="group/popular-products">
        <ProductList
          className="[&>div]:grid [&>div]:grid-cols-1 [&>div]:gap-6 [&>div]:sm:grid-cols-2 [&>div]:lg:grid-cols-4"
          compareLabel={compareLabel}
          compareParamName={compareParamName}
          emptyStateSubtitle={emptyStateSubtitle}
          emptyStateTitle={emptyStateTitle}
          placeholderCount={placeholderCount}
          products={products}
          showCompare={showCompare}
        />
      </div>
    </SectionLayout>
  );
}