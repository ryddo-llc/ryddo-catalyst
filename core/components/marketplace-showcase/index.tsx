import { getTranslations } from 'next-intl/server';

import { SectionContainer } from '~/components/section-container';
import { imageManagerImageUrl } from '~/lib/store-assets';

import { MarketplaceCard } from './marketplace-card';

const SHOWCASE_PRODUCTS = [
  {
    entityId: 1,
    brand: 'Super73',
    name: 'Mojave Series',
    badge: 'New!',
    bgColor: 'bg-[#C44531]',
    image: imageManagerImageUrl('s73-card.png'),
  },
  {
    entityId: 2,
    brand: 'UBCO 2X2',
    name: '20% Discount',
    badge: 'Sale!',
    bgColor: 'bg-[#E37D4F]',
    image: imageManagerImageUrl('ubco-card.png'),
  },
  {
    entityId: 3,
    brand: 'Zooz 1100',
    name: 'Gen. 2',
    badge: 'Top Seller',
    bgColor: 'bg-[#EDAB6C]',
    image: imageManagerImageUrl('zooz-card.png'),
  },
  {
    entityId: 4,
    brand: 'Onyx',
    name: 'RCR 2025',
    badge: '2025 Models',
    bgColor: 'bg-[#EDAB6C]',
    image: imageManagerImageUrl('onyx-card.png'),
  },
  {
    entityId: 5,
    brand: 'Cake Kalk',
    name: 'Street Legal Edition',
    badge: 'Pre-Order',
    bgColor: 'bg-[#6EA3DF]',
    image: imageManagerImageUrl('cake-card.png'),
  },
  {
    entityId: 6,
    brand: 'Hummingbird',
    name: 'Princess Edition',
    badge: 'U.S. Exclusive',
    bgColor: 'bg-[#3B69AC]',
    image: imageManagerImageUrl('hummingbird-card.png'),
  },
];

export interface MarketplaceShowcaseProps {
  imageUrl?: string;
}

export async function MarketplaceShowcase({ imageUrl }: MarketplaceShowcaseProps) {
  const t = await getTranslations('Home.MarketplaceShowcase');

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

          {/* Products Grid */}
          <div className="relative">
            <div className="flex snap-x snap-mandatory justify-start gap-3 overflow-x-auto pl-8 pr-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:pl-12 md:gap-4 md:pl-16 md:pr-12 [&::-webkit-scrollbar]:hidden">
              {SHOWCASE_PRODUCTS.map((product) => (
                <MarketplaceCard
                  badgeText={product.badge}
                  bgColor={product.bgColor}
                  key={product.entityId}
                  product={{
                    entityId: product.entityId,
                    name: product.name,
                    path: '/e-rides',
                    defaultImage: { altText: `${product.brand} ${product.name}`, url: product.image },
                    brand: { name: product.brand },
                  }}
                />
              ))}
            </div>
            {/* Fade hint on right edge - mobile only */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-blue-100/80 to-transparent md:hidden" />
          </div>
        </SectionContainer.Inner>
      </SectionContainer.Outer>
    </SectionContainer>
  );
}
