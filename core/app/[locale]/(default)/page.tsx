import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { getSessionCustomerAccessToken } from '~/auth';
import { BrandShowcase } from '~/components/brand-showcase';
import { LegitBrands } from '~/components/legit-brands';
import { MarketplaceShowcase } from '~/components/marketplace-showcase';
import { ProcessSection } from '~/components/process-section';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { imageManagerImageUrl } from '~/lib/store-assets';

import { getCompareProducts as getCompareProductsData } from './(faceted)/fetch-compare-products';
import { getSearchPageData } from './(faceted)/search/page-data';
import { OrganizationSchema } from './_components/organization-schema';
import { getPopularProductsData } from './page-data';

const compareLoader = createCompareLoader();

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');

  const pageDescription =
    'Discover premium electric bikes at Ryddo. From commuter e-bikes to mountain e-bikes, find the perfect electric bicycle for your lifestyle. Free shipping, expert support, and financing available.';

  return {
    title: t('title'),
    description: pageDescription,
    keywords: [
      'electric bikes',
      'e-bikes',
      'electric bicycles',
      'commuter bikes',
      'mountain bikes',
      'sustainable transportation',
    ],
    openGraph: {
      type: 'website',
      title: t('title'),
      description: pageDescription,
      siteName: 'Ryddo',
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: pageDescription,
    },
    alternates: {
      canonical: '/',
    },
  };
}

export default async function Home({ params, searchParams }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const format = await getFormatter();

  const { settings } = await getSearchPageData();
  const productComparisonsEnabled =
    settings?.storefront.catalog?.productComparisonsEnabled ?? false;

  // Constants for product limits
  const MAX_MARKETPLACE_PRODUCTS = 6;

  // Fetch products once and share the data
  const streamableProductsData = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const currencyCode = await getPreferredCurrencyCode();
    const data = await getPopularProductsData(currencyCode, customerAccessToken);
    return removeEdgesAndNodes(data.site.search.searchProducts.products);
  });

  const streamableMarketplaceProducts = Streamable.from(async () => {
    const products = await streamableProductsData;
    return products.slice(0, MAX_MARKETPLACE_PRODUCTS).map((product) => ({
      entityId: product.entityId,
      name: product.name,
      path: product.path,
      defaultImage: product.defaultImage,
      brand: product.brand,
    }));
  });

  const streamableCompareProducts = Streamable.from(async () => {
    const searchParamsData = await searchParams;
    const customerAccessToken = await getSessionCustomerAccessToken();

    if (!productComparisonsEnabled) {
      return [];
    }

    const { compare } = compareLoader(searchParamsData);

    const compareIds = { entityIds: compare ? compare.map((id: string) => Number(id)) : [] };

    const products = await getCompareProductsData(compareIds, customerAccessToken);

    return products.map((product) => ({
      id: product.entityId.toString(),
      title: product.name,
      image: product.defaultImage
        ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
        : undefined,
      href: product.path,
    }));
  });

  return (
    <>
      <OrganizationSchema />
      <MarketplaceShowcase
        imageUrl={imageManagerImageUrl('hero-bg.png', 'original')}
        products={streamableMarketplaceProducts}
      />
      <BrandShowcase
        adventureGuarantee={{
          title: t('BrandShowcase.adventureGuarantee.title'),
          description: t('BrandShowcase.adventureGuarantee.description'),
        }}
        certifiedPreOwned={{
          title: t('BrandShowcase.certifiedPreOwned.title'),
          description: t('BrandShowcase.certifiedPreOwned.description'),
        }}
        certifiedService={{
          title: t('BrandShowcase.certifiedService.title'),
          description: t('BrandShowcase.certifiedService.description'),
        }}
        imageUrl={imageManagerImageUrl('rethink-the-ride-bg.png', 'original')}
        sameDayDelivery={{
          title: t('BrandShowcase.sameDayDelivery.title'),
          description: t('BrandShowcase.sameDayDelivery.description'),
        }}
        subtitle={t('BrandShowcase.subtitle')}
        tradeInUp={{
          title: t('BrandShowcase.tradeInUp.title'),
          description: t('BrandShowcase.tradeInUp.description'),
        }}
      />

      <LegitBrands
        backgroundImageUrl={imageManagerImageUrl('legit-brands-image.png', 'original')}
        description={{
          line1: t('LegitBrands.description.line1'),
          line2: t('LegitBrands.description.line2'),
          line3: t('LegitBrands.description.line3'),
        }}
        imageAlt={t('LegitBrands.imageAlt')}
        imageUrl={imageManagerImageUrl('legit-brands-image.png', 'original')}
        linkText={{
          highlight: t('LegitBrands.linkText.highlight'),
          rest: t('LegitBrands.linkText.rest'),
        }}
        title={{
          line1: t('LegitBrands.title.line1'),
          line2: t('LegitBrands.title.line2'),
          line2Highlight: t('LegitBrands.title.line2Highlight'),
          line3: t('LegitBrands.title.line3'),
          line4: t('LegitBrands.title.line4'),
          line5: t('LegitBrands.title.line5'),
        }}
      />

      <ProcessSection
        howItWorksTitle={t('ProcessSection.howItWorks.title')}
        imageUrl={imageManagerImageUrl('process-bg.png', 'original')}
        rolloutCards={[
          {
            badge: t('ProcessSection.rollout.cards.online.badge'),
            title: t('ProcessSection.rollout.cards.online.title'),
            subtitle: t('ProcessSection.rollout.cards.online.subtitle'),
            description: t('ProcessSection.rollout.cards.online.description'),
          },
          {
            badge: t('ProcessSection.rollout.cards.kiosk.badge'),
            title: t('ProcessSection.rollout.cards.kiosk.title'),
            subtitle: t('ProcessSection.rollout.cards.kiosk.subtitle'),
            description: t('ProcessSection.rollout.cards.kiosk.description'),
          },
          {
            badge: t('ProcessSection.rollout.cards.inStore.badge'),
            title: t('ProcessSection.rollout.cards.inStore.title'),
            subtitle: t('ProcessSection.rollout.cards.inStore.subtitle'),
            description: t('ProcessSection.rollout.cards.inStore.description'),
          },
        ]}
        rolloutSubtitle={t('ProcessSection.rollout.subtitle')}
        rolloutTitle={t('ProcessSection.rollout.title')}
        steps={[
          {
            number: t('ProcessSection.howItWorks.steps.step01.number'),
            description: t('ProcessSection.howItWorks.steps.step01.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step02.number'),
            description: t('ProcessSection.howItWorks.steps.step02.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step03.number'),
            description: t('ProcessSection.howItWorks.steps.step03.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step04.number'),
            description: t('ProcessSection.howItWorks.steps.step04.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step05.number'),
            description: t('ProcessSection.howItWorks.steps.step05.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step06.number'),
            description: t('ProcessSection.howItWorks.steps.step06.description'),
          },
        ]}
      />
    </>
  );
}
