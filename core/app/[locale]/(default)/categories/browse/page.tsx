import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getSessionCustomerAccessToken } from '~/auth';
import { Image } from '~/components/image';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { imageManagerImageUrl } from '~/lib/store-assets';

import { fetchFacetedSearch } from '../../(faceted)/fetch-faceted-search';

import { CategoryBrowseClient } from './_components/category-browse-client';
import { getBrandsWithImages, getBrowseCategories } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');

  return {
    title: `Browse Categories | ${t('title')}`,
    description:
      'Browse electric bikes by category, brand, and model. Find the perfect e-ride for your lifestyle.',
  };
}

export default async function BrowseCategoriesPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const customerAccessToken = await getSessionCustomerAccessToken();
  const currencyCode = await getPreferredCurrencyCode();

  // Fetch initial data in parallel, with graceful fallbacks to prevent SSR crashes
  const [categoriesResult, brandsResult, productsSearchResult] = await Promise.allSettled([
    getBrowseCategories(),
    getBrandsWithImages(),
    fetchFacetedSearch({ isFeatured: true, limit: 12 }, currencyCode, customerAccessToken),
  ]);

  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const brands = brandsResult.status === 'fulfilled' ? brandsResult.value : [];
  const productsResult =
    productsSearchResult.status === 'fulfilled'
      ? productsSearchResult.value
      : { products: { items: [] }, facets: { items: [] } };

  const initialProducts = productsResult.products.items.map((product) => ({
    entityId: product.entityId,
    name: product.name,
    path: product.path,
    defaultImage: product.defaultImage
      ? { altText: product.defaultImage.altText, url: product.defaultImage.url }
      : null,
    brand: product.brand ? { name: product.brand.name, path: product.brand.path } : null,
  }));

  const initialBrands = brands.map((brand) => ({
    entityId: brand.entityId,
    name: brand.name,
    path: brand.path,
    defaultImage: brand.defaultImage
      ? { altText: brand.defaultImage.altText, url: brand.defaultImage.url }
      : null,
  }));

  const initialCategories = categories.map((category) => ({
    entityId: category.entityId,
    name: category.name,
    path: category.path,
    image: category.image ? { url: category.image.url, altText: category.image.altText } : null,
  }));

  return (
    <div>
      <div className="fixed inset-0 left-1/2 -z-10 w-screen -translate-x-1/2">
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover object-center"
          fill
          preload
          quality={70}
          sizes="100vw"
          src={imageManagerImageUrl('product-page-bg.png')}
        />
      </div>
      <CategoryBrowseClient
        initialBrands={initialBrands}
        initialCategories={initialCategories}
        initialProducts={initialProducts}
      />
    </div>
  );
}
