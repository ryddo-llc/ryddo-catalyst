import { clsx } from 'clsx';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

interface MarketplaceProduct {
  entityId: number;
  name: string;
  path: string;
  defaultImage: {
    altText: string;
    url: string;
  } | null;
}

interface MarketplaceCardProps {
  product: MarketplaceProduct;
  bgColor?: string;
  className?: string;
}

function MarketplaceCard({ product, bgColor = 'bg-blue-500', className }: MarketplaceCardProps) {
  return (
    <Link
      className={clsx(
        'group block w-[200px] overflow-hidden rounded-[30px] bg-white p-1.5 transition-all hover:shadow-lg',
        className,
      )}
      href={product.path}
    >
      <div
        className={clsx(
          'relative flex h-[275px] flex-col items-center justify-between overflow-hidden rounded-[28px] p-4',
          bgColor,
        )}
      >
        {/* Product Name at Top */}
        <div className="w-full text-center">
          <h3 className="font-[family-name:var(--font-family-body)] text-sm font-bold uppercase text-white">
            {product.name}
          </h3>
        </div>

        {/* Product Image in Middle */}
        <div className="relative flex flex-1 items-center justify-center">
          {product.defaultImage ? (
            <Image
              alt={product.defaultImage.altText}
              className="object-contain"
              fill
              sizes="200px"
              src={product.defaultImage.url}
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center bg-white/20 text-white">
              No Image
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export interface MarketplaceShowcaseProps {
  title: string;
  subtitle: string;
  guarantee: string;
  products: Streamable<MarketplaceProduct[]>;
}

const cardColors = [
  'bg-blue-500',
  'bg-yellow-400',
  'bg-pink-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
];

export async function MarketplaceShowcase({
  title,
  subtitle,
  guarantee,
  products: streamableProducts,
}: MarketplaceShowcaseProps) {
  const products = await streamableProducts;

  // Limit to max 6 products
  const displayProducts = products.slice(0, 6);

  return (
    <section className="pb-8 md:pb-12 lg:pb-16">
      <div className="mx-auto max-w-[var(--section-max-width-2xl,1536px)] px-4 @xl:px-6 @4xl:px-8">
        <div className="rounded-[30px] bg-gray-100 px-4 pb-12 pt-4 md:px-8 md:pb-16 md:pt-6">
          {/* Header Section */}
          <header className="mb-12 text-center font-[family-name:var(--font-family-body)]">
            <h1 className="font-[family-name:var(--font-family-body)] text-5xl font-extrabold text-[hsl(var(--foreground))] md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-3 text-xl font-medium text-gray-700 md:text-2xl">{subtitle}</p>
            <p className="mt-2 text-lg font-light text-gray-600">{guarantee}</p>
          </header>

          {/* Products Grid - Always 6 columns */}
          <div className="flex justify-center gap-4 overflow-x-auto">
            {displayProducts.map((product, index) => (
              <MarketplaceCard
                bgColor={cardColors[index % cardColors.length]}
                key={product.entityId}
                product={product}
              />
            ))}
          </div>

          {/* Empty State */}
          {displayProducts.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p>No products available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
