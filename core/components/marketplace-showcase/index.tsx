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
        'group block w-full min-w-[110px] max-w-[180px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-white p-1 transition-all hover:shadow-lg',
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
      <SectionContainer.Outer
        innerPadding="px-1 @xl:px-1 @4xl:px-2"
        padding="pb-5 md:pb-8 lg:pb-12"
        radius={30}
        rounded="bottom"
      >
        <SectionContainer.Inner
          bgColor="bg-blue-100"
          bgImage={imageUrl}
          bgImagePosition="55% 15%"
          padding="px-1 pb-2 pt-20 md:px-8 md:pb-3 md:pt-24 lg:pb-4"
          radius={30}
        >
          {/* Header Section */}
          <header className="mb-10 pl-8 text-left font-[family-name:var(--font-family-body)] sm:pl-12 md:mb-16 md:pl-16">
            <h1 className="leading-[0.8]">
              <span className="mb-2 block font-[family-name:var(--font-family-kanit)] text-xl font-semibold italic text-[rgb(255,237,0)] md:text-[2.34rem]">
                {t('title.line1')}
              </span>
              <span className="-ml-1 block font-[family-name:var(--font-family-kanit)] text-4xl font-black italic text-white md:-ml-2 md:text-[4.68rem]">
                {t('title.line2')}
              </span>
            </h1>
            <p className="mt-3 font-[family-name:var(--font-family-body)] text-xl font-medium italic leading-tight text-[rgb(164,206,246)] md:text-[2.26rem] md:leading-[28px]">
              {t('subtitle')}
            </p>
            <p className="mt-6 font-[family-name:var(--font-family-body)] text-lg font-black italic leading-tight text-[rgb(255,255,0)] md:mt-10 md:text-3xl md:leading-[28px]">
              {t('guarantee.line1')}
              <br />
              {t('guarantee.line2')}
            </p>
          </header>

          {/* Products Grid - Horizontally scrollable with fade hint */}
          <div className="relative">
            <div className="flex snap-x snap-mandatory justify-start gap-3 overflow-x-auto pl-8 pr-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:pl-12 md:gap-4 md:pl-16 md:pr-12 [&::-webkit-scrollbar]:hidden">
              {displayProducts.map((product, index) => (
                <MarketplaceCard
                  badgeText={PLACEHOLDER_BADGES[index]}
                  bgColor={cardColors[index % cardColors.length]}
                  key={product.entityId}
                  product={product}
                />
              ))}
            </div>
            {/* Fade hint on right edge - mobile only */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-blue-100/80 to-transparent md:hidden" />
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
