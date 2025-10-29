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
  brand?: {
    name: string;
  } | null;
}

interface MarketplaceCardProps {
  product: MarketplaceProduct;
  bgColor?: string;
  badgeText?: string | null;
  className?: string;
}

function MarketplaceCard({
  product,
  bgColor = 'bg-blue-500',
  badgeText,
  className,
}: MarketplaceCardProps) {
  return (
    <Link
      className={clsx(
        'group block w-full min-w-[120px] max-w-[200px] overflow-hidden rounded-[13%] bg-white p-1 transition-all hover:shadow-lg',
        className,
      )}
      href={product.path}
    >
      <div
        className={clsx(
          'relative flex aspect-[3/4] flex-col overflow-hidden rounded-[calc(13%-1px)]',
          bgColor,
        )}
      >
        {/* Top 50% - Content Area */}
        <div className="relative h-1/2 p-3">
          {/* Badge Text - Top Left */}
          {badgeText && (
            <span className="absolute left-3 top-3 font-[family-name:var(--font-family-body)] text-xs font-extralight italic text-white">
              {badgeText}
            </span>
          )}

          {/* Circle Button - Top Right */}
          <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-black">
            <span className="relative -top-[3px] text-xl font-bold leading-none text-white">+</span>
          </div>

          {/* Brand & Product Names - Centered Vertically */}
          <div className="flex h-full flex-col items-start justify-center px-1">
            {product.brand?.name && (
              <p className="font-[family-name:var(--font-family-body)] text-lg font-extrabold text-black">
                {product.brand.name}
              </p>
            )}
            <h3 className="font-[family-name:var(--font-family-body)] text-sm font-light italic text-black">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Bottom 50% - Image Area */}
        <div className="relative h-1/2 overflow-hidden rounded-t-[13%]">
          {product.defaultImage ? (
            <Image
              alt={product.defaultImage.altText}
              className="object-cover"
              fill
              sizes="(max-width: 640px) 120px, 200px"
              src={product.defaultImage.url}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/20">
              <span className="text-xs text-white">No Image</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export interface MarketplaceShowcaseProps {
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

// Placeholder badge texts (will be replaced with real logic later)
const PLACEHOLDER_BADGES = ['New!', 'Sale', 'Top Seller', 'Pre-Order', null, null];

export async function MarketplaceShowcase({
  products: streamableProducts,
}: MarketplaceShowcaseProps) {
  const products = await streamableProducts;

  // Limit to max 6 products
  const displayProducts = products.slice(0, 6);

  return (
    <section className="rounded-b-[30px] pb-8 md:pb-12 lg:pb-16">
      <div className="mx-auto max-w-[var(--section-max-width-2xl,1536px)] px-4 @xl:px-6 @4xl:px-8">
        <div className="rounded-[30px] bg-blue-100 px-4 pb-2 pt-12 md:px-8 md:pb-2 md:pt-16">
          {/* Header Section */}
          <header className="mb-6 pl-8 text-left font-[family-name:var(--font-family-body)] md:pl-12">
            <h1 className="leading-none">
              <span className="block font-[family-name:var(--font-family-kanit)] text-4xl font-semibold text-orange-500">
                THE E-RIDE
              </span>
              <span className="block font-[family-name:var(--font-family-kanit)] text-7xl font-black italic text-orange-600">
                MARKETPLACE
              </span>
            </h1>
            <p className="mt-3 font-[family-name:var(--font-family-body)] text-3xl font-normal text-gray-700">
              Only the Good Stuff.
            </p>
            <p className="mt-2 font-[family-name:var(--font-family-body)] text-3xl font-black italic leading-tight text-yellow-400">
              10-DAY ADVENTURE
              <br />
              GUARANTEE
            </p>
          </header>

          {/* Products Grid - Always 6 columns */}
          <div className="flex justify-start gap-4 overflow-x-auto pl-8 md:pl-12">
            {displayProducts.map((product, index) => (
              <MarketplaceCard
                badgeText={PLACEHOLDER_BADGES[index]}
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
