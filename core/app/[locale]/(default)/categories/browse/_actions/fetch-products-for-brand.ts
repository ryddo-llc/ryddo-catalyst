'use server';

import { getSessionCustomerAccessToken } from '~/auth';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { fetchFacetedSearch } from '../../../(faceted)/fetch-faceted-search';

export interface BrowseProduct {
  entityId: number;
  name: string;
  path: string;
  defaultImage: {
    altText: string;
    url: string;
  } | null;
  brand: {
    name: string;
    path: string;
  } | null;
}

export async function fetchProductsForBrand(
  categoryEntityId: number,
  brandEntityId: number,
): Promise<BrowseProduct[]> {
  const customerAccessToken = await getSessionCustomerAccessToken();
  const currencyCode = await getPreferredCurrencyCode();

  const searchResult = await fetchFacetedSearch(
    {
      category: categoryEntityId,
      brand: [String(brandEntityId)],
      limit: 12,
    },
    currencyCode,
    customerAccessToken,
  );

  return searchResult.products.items.map((product) => ({
    entityId: product.entityId,
    name: product.name,
    path: product.path,
    defaultImage: product.defaultImage
      ? { altText: product.defaultImage.altText, url: product.defaultImage.url }
      : null,
    brand: product.brand
      ? { name: product.brand.name, path: product.brand.path }
      : null,
  }));
}
