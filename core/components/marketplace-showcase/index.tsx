import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { SectionContainer } from '~/components/section-container';

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
        'group block w-full min-w-[110px] max-w-[180px] overflow-hidden rounded-[24px] bg-white p-1 transition-all hover:shadow-lg',
        className,
      )}
      href={product.path}
    >
      <div
        className={clsx(
          'relative flex aspect-[3/4.2] flex-col overflow-hidden rounded-[22px]',
          bgColor,
        )}
      >
        {/* Top 45% - Content Area */}
        <div className="relative h-[45%] p-3">
          {/* Badge Text - Top Left */}
          {badgeText != null && badgeText !== '' ? (
            <span className="absolute left-4 top-3 font-[family-name:var(--font-family-body)] text-sm font-extralight italic text-white">
              {badgeText}
            </span>
          ) : null}

          {/* Circle Button - Top Right */}
          <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <span className="relative -top-[3px] text-xl font-bold leading-none text-black">+</span>
          </div>

          {/* Brand & Product Names - Centered Vertically */}
          <div className="flex h-full flex-col items-start justify-end px-1 pb-2">
            {product.brand?.name != null && product.brand.name !== '' ? (
              <p className="font-[family-name:var(--font-family-body)] text-lg font-extrabold text-black">
                {product.brand.name}
              </p>
            ) : null}
            <h3 className="w-full truncate font-[family-name:var(--font-family-body)] text-sm font-light italic text-black">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Bottom 55% - Image Area */}
        <div className="relative h-[55%] overflow-hidden rounded-t-[22px]">
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
  imageUrl?: string;
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
const PLACEHOLDER_BADGES = ['New!', 'Sale!', 'Top Seller', 'Pre-Order', null, null];

export async function MarketplaceShowcase({
  products: streamableProducts,
  imageUrl,
}: MarketplaceShowcaseProps) {
  const t = await getTranslations('Home.MarketplaceShowcase');
  const products = await streamableProducts;

  // Limit to max 6 products
  const displayProducts = products.slice(0, 6);

  return (
    <SectionContainer>
      <SectionContainer.Outer innerPadding="px-1 @xl:px-1 @4xl:px-2" padding="pb-5 md:pb-8 lg:pb-12" radius={30} rounded="bottom">
        <SectionContainer.Inner
          bgColor="bg-blue-100"
          bgImage={imageUrl}
          padding="px-1 pb-2 pt-16 md:px-8 md:pb-3 md:pt-20 lg:pb-4"
          radius={30}
        >
          {/* Header Section */}
          <header className="mb-16 pl-8 text-left font-[family-name:var(--font-family-body)] md:pl-12">
            <h1 className="leading-[0.8]">
              <span className="mb-2 block font-[family-name:var(--font-family-kanit)] text-[2.34rem] font-semibold italic text-[rgb(255,237,0)]">
                {t('title.line1')}
              </span>
              <span className="-ml-2 block font-[family-name:var(--font-family-kanit)] text-[4.68rem] font-black italic text-white">
                {t('title.line2')}
              </span>
            </h1>
            <p className="mt-3 font-[family-name:var(--font-family-body)] text-[2.26rem] font-medium italic leading-[28px] text-[rgb(164,206,246)]">
              {t('subtitle')}
            </p>
            <p className="mt-10 font-[family-name:var(--font-family-body)] text-3xl font-black italic leading-[28px] text-[rgb(255,255,0)]">
              {t('guarantee.line1')}
              <br />
              {t('guarantee.line2')}
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
        </SectionContainer.Inner>
      </SectionContainer.Outer>
    </SectionContainer>
  );
}
