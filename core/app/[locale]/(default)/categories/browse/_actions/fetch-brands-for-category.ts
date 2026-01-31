'use server';

import { getSessionCustomerAccessToken } from '~/auth';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { fetchFacetedSearch } from '../../../(faceted)/fetch-faceted-search';
import { getBrandsWithImages } from '../page-data';

export interface BrowseBrand {
  entityId: number;
  name: string;
  path: string;
  defaultImage: {
    altText: string;
    url: string;
  } | null;
}

export async function fetchBrandsForCategory(
  categoryEntityId: number,
): Promise<BrowseBrand[]> {
  const customerAccessToken = await getSessionCustomerAccessToken();
  const currencyCode = await getPreferredCurrencyCode();

  // Step 1: Use faceted search to find which brands exist in this category
  const searchResult = await fetchFacetedSearch(
    { category: categoryEntityId, limit: 1 },
    currencyCode,
    customerAccessToken,
  );

  // Step 2: Extract brand entityIds from the BrandSearchFilter facet
  const brandFacet = searchResult.facets.items.find(
    (item) => item.__typename === 'BrandSearchFilter',
  );

  if (!brandFacet) {
    return [];
  }

  const brandIds = brandFacet.brands.map((b) => b.entityId);

  if (brandIds.length === 0) {
    return [];
  }

  // Step 3: Fetch full brand data with images
  const brands = await getBrandsWithImages(brandIds);

  return brands.map((brand) => ({
    entityId: brand.entityId,
    name: brand.name,
    path: brand.path,
    defaultImage: brand.defaultImage
      ? { altText: brand.defaultImage.altText, url: brand.defaultImage.url }
      : null,
  }));
}
