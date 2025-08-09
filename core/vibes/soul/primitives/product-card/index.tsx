import { clsx } from 'clsx';

import { Badge } from '@/vibes/soul/primitives/badge';
import { Price } from '@/vibes/soul/primitives/price-label';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

import { Compare } from './compare';

export interface Product {
  id: string;
  title: string;
  href: string;
  image?: { src: string; alt: string };
  price?: Price;
  subtitle?: string;
  badge?: string;
  rating?: number;
  onSale?: boolean;
  outOfStock?: boolean;
  type?: string;
  name?: string;
}

export interface ProductCardProps {
  className?: string;
  colorScheme?: 'light' | 'dark';
  aspectRatio?: '5:6' | '3:4' | '1:1';
  showCompare?: boolean;
  imagePriority?: boolean;
  imageSizes?: string;
  compareLabel?: string;
  compareParamName?: string;
  product: Product;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --product-card-focus: hsl(var(--primary));
 *   --product-card-light-offset: hsl(var(--background));
 *   --product-card-light-background: hsl(var(--contrast-100));
 *   --product-card-light-title: hsl(var(--foreground));
 *   --product-card-light-subtitle: hsl(var(--foreground) / 75%);
 *   --product-card-dark-offset: hsl(var(--foreground));
 *   --product-card-dark-background: hsl(var(--contrast-500));
 *   --product-card-dark-title: hsl(var(--background));
 *   --product-card-dark-subtitle: hsl(var(--background) / 75%);
 *   --product-card-font-family: var(--font-family-body);
 * }
 * ```
 */
export function ProductCard({
  product: { id, title, price, image, href, onSale, outOfStock, name },
  imagePriority = false,
  showCompare = false,
  compareLabel,
  compareParamName,
}: ProductCardProps) {
  const productName = name || title;
  const imageUrl = image?.src;

  return (
    <article className="group relative mb-5 flex w-full max-w-md flex-col items-center overflow-hidden bg-white rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <Link className="block h-full w-full" href={href} title={`View details for ${productName}`}>
        <div className="absolute left-4 top-3 z-10">
          {onSale && (
            <Badge className="bg-[#F92F7B] text-white" shape="rounded">
              Sale!
            </Badge>
          )}
        </div>
        <div className="absolute right-3 top-1 z-10">
          {outOfStock && (
            <Badge className="bg-[#0000009e] text-white" shape="rounded">
              Out of Stock
            </Badge>
          )}
        </div>
        <div className="relative w-full p-1">
          <Image
            alt={productName || 'Product image'}
            className="w-full object-contain"
            height={200}
            priority={imagePriority}
            src={imageUrl || ''}
            width={200}
          />
          {showCompare && (
            <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Compare
                label={compareLabel}
                paramName={compareParamName}
                product={{ id, title, href, image }}
              />
            </div>
          )}
        </div>
        <div className="px-2 pb-2 pt-1 text-center">
          <h2 className="text-sm font-bold text-zinc-800">{productName}</h2>
          <div>
            {(() => {
              if (!price) return null;

              if (typeof price === 'string') {
                return <span className="text-black">{price}</span>;
              }

              if (price.type === 'sale') {
                return (
                  <>
                    <span className="mr-2 text-sm text-neutral-500 line-through">
                      {price.previousValue}
                    </span>
                    <span className="font-medium text-black">{price.currentValue}</span>
                  </>
                );
              }

              // price.type === 'range'
              return (
                <span className="text-black">
                  {price.minValue} – {price.maxValue}
                </span>
              );
            })()}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductCardSkeleton({
  className,
  aspectRatio = '5:6',
}: {
  aspectRatio?: '5:6' | '3:4' | '1:1';
  className?: string;
}) {
  return (
    <div className={clsx('@container', className)}>
      <Skeleton.Box
        className={clsx(
          'rounded-xl @md:rounded-2xl',
          {
            '5:6': 'aspect-[5/6]',
            '3:4': 'aspect-[3/4]',
            '1:1': 'aspect-square',
          }[aspectRatio],
        )}
      />
      <div className="mt-2 flex flex-col items-start gap-x-4 gap-y-3 px-1 @xs:mt-3 @2xl:flex-row">
        <div className="w-full text-sm @[16rem]:text-base">
          <Skeleton.Text characterCount={10} className="rounded" />
          <Skeleton.Text characterCount={8} className="rounded" />
          <Skeleton.Text characterCount={6} className="rounded" />
        </div>
      </div>
    </div>
  );
}
