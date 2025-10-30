import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { getSessionCustomerAccessToken } from '~/auth';
import { BrandShowcase } from '~/components/brand-showcase';
import { LegitBrands } from '~/components/legit-brands';
import { MarketplaceShowcase } from '~/components/marketplace-showcase';
import { PaymentOptions } from '~/components/payment-options';
import { PopularProducts } from '~/components/popular-products';
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

  return {
    title: t('title'),
    description:
      'Discover premium electric bikes at Ryddo. From commuter e-bikes to mountain e-bikes, find the perfect electric bicycle for your lifestyle. Free shipping, expert support, and financing available.',
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
      description:
        'Discover premium electric bikes at Ryddo. From commuter e-bikes to mountain e-bikes, find the perfect electric bicycle for your lifestyle.',
      siteName: 'Ryddo',
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description:
        'Discover premium electric bikes at Ryddo. From commuter e-bikes to mountain e-bikes, find the perfect electric bicycle for your lifestyle.',
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

  const streamablePopularProducts = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const currencyCode = await getPreferredCurrencyCode();

    const data = await getPopularProductsData(currencyCode, customerAccessToken);

    const searchProducts = removeEdgesAndNodes(data.site.search.searchProducts.products);

    // Take only first 8 products for popular products section
    return productCardTransformer(searchProducts.slice(0, 8), format);
  });

  const streamableMarketplaceProducts = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const currencyCode = await getPreferredCurrencyCode();

    const data = await getPopularProductsData(currencyCode, customerAccessToken);

    const searchProducts = removeEdgesAndNodes(data.site.search.searchProducts.products);

    // Take first 6 products for marketplace showcase
    return searchProducts.slice(0, 6).map((product) => ({
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
      <MarketplaceShowcase products={streamableMarketplaceProducts} />
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
        title={{
          line1: t('LegitBrands.title.line1'),
          line2: t('LegitBrands.title.line2'),
          line2Highlight: t('LegitBrands.title.line2Highlight'),
          line3: t('LegitBrands.title.line3'),
          line4: t('LegitBrands.title.line4'),
          line5: t('LegitBrands.title.line5'),
        }}
        description={{
          line1: t('LegitBrands.description.line1'),
          line2: t('LegitBrands.description.line2'),
          line3: t('LegitBrands.description.line3'),
        }}
        linkText={{
          highlight: t('LegitBrands.linkText.highlight'),
          rest: t('LegitBrands.linkText.rest'),
        }}
        imageAlt={t('LegitBrands.imageAlt')}
        imageUrl={imageManagerImageUrl('legit-brands-hero.jpg', 'original')}
      />

      {/* <PaymentOptions /> */}

      <PopularProducts
        compareHref="/compare"
        compareProducts={streamableCompareProducts}
        cta={{ label: t('PopularProducts.cta'), href: '/e-bikes/' }}
        description={t('PopularProducts.description')}
        emptyStateSubtitle={t('PopularProducts.emptyStateSubtitle')}
        emptyStateTitle={t('PopularProducts.emptyStateTitle')}
        maxItems={4}
        products={streamablePopularProducts}
        showCompare={productComparisonsEnabled}
        title={t('PopularProducts.title')}
      />
    </>
  );
}
