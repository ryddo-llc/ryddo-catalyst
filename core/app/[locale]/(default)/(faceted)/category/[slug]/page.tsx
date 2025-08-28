import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { createLoader, SearchParams } from 'nuqs/server';
import { cache } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { PageHeader } from '@/vibes/soul/sections/page-header';
import { ProductsListSection } from '@/vibes/soul/sections/products-list-section';
import { getFilterParsers } from '@/vibes/soul/sections/products-list-section/filter-parsers';
import { getSessionCustomerAccessToken } from '~/auth';
import { facetsTransformer } from '~/data-transformers/facets-transformer';
import { numberedPaginationTransformer } from '~/data-transformers/numbered-pagination-transformer';
import { pageInfoTransformer } from '~/data-transformers/page-info-transformer';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { MAX_COMPARE_LIMIT } from '../../../compare/page-data';
import { getCompareProducts } from '../../fetch-compare-products';
import { fetchFacetedSearch } from '../../fetch-faceted-search';

import { CategoryViewed } from './_components/category-viewed';
import { getCategoryPageData } from './page-data';

const getCachedCategory = cache((categoryId: number) => {
  return {
    category: categoryId,
  };
});

const compareLoader = createCompareLoader();

const createCategorySearchParamsLoader = cache(
  async (categoryId: number, customerAccessToken?: string) => {
    const cachedCategory = getCachedCategory(categoryId);
    const categorySearch = await fetchFacetedSearch(cachedCategory, undefined, customerAccessToken);
    const categoryFacets = categorySearch.facets.items.filter(
      (facet) => facet.__typename !== 'CategorySearchFilter',
    );
    const transformedCategoryFacets = await facetsTransformer({
      refinedFacets: categoryFacets,
      allFacets: categoryFacets,
      searchParams: {},
    });
    const categoryFilters = transformedCategoryFacets.filter((facet) => facet != null);
    const filterParsers = getFilterParsers(categoryFilters);

    // If there are no filters, return `null`, since calling `createLoader` with an empty
    // object will throw the following cryptic error:
    //
    // ```
    // Error: [nuqs] Empty search params cache. Search params can't be accessed in Layouts.
    //   See https://err.47ng.com/NUQS-500
    // ```
    if (Object.keys(filterParsers).length === 0) {
      return null;
    }

    return createLoader(filterParsers);
  },
);

interface Props {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const customerAccessToken = await getSessionCustomerAccessToken();

  const categoryId = Number(slug);

  const { category } = await getCategoryPageData(categoryId, customerAccessToken);

  if (!category) {
    return notFound();
  }

  const { pageTitle, metaDescription, metaKeywords } = category.seo;

  return {
    title: pageTitle || category.name,
    description: metaDescription,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
  };
}

export default async function Category(props: Props) {
  const { slug, locale } = await props.params;
  const customerAccessToken = await getSessionCustomerAccessToken();

  setRequestLocale(locale);

  const t = await getTranslations('Faceted');

  const categoryId = Number(slug);

  const { category, settings, categoryTree } = await getCategoryPageData(
    categoryId,
    customerAccessToken,
  );

  if (!category) {
    return notFound();
  }

  const breadcrumbs = removeEdgesAndNodes(category.breadcrumbs).map(({ name, path }) => ({
    label: name,
    href: path ?? '#',
  }));

  const productComparisonsEnabled =
    settings?.storefront.catalog?.productComparisonsEnabled ?? false;

  // Items-per-page is consistent across fetch, slice, and pagination
  const ITEMS_PER_PAGE = 9;
  // Cap the maximum limit to prevent API stress on very large page numbers
  const MAX_LIMIT = 100;

  const streamableFacetedSearch = Streamable.from(async () => {
    const searchParams = await props.searchParams;
    const currencyCode = await getPreferredCurrencyCode();

    const loadSearchParams = await createCategorySearchParamsLoader(
      categoryId,
      customerAccessToken,
    );
    const parsedSearchParams = loadSearchParams?.(searchParams) ?? {};

    // Convert page parameter to cursor-based pagination for data fetching
    let paginationParams = {};
    const { page, before, after } = searchParams;
    
    if (typeof page === 'string') {
      const pageNum = parseInt(page, 10);
      
      if (!Number.isNaN(pageNum) && pageNum > 1) {
        // For page-based navigation, we need to calculate the appropriate cursor
        // Since we can't jump directly to arbitrary pages with cursors,
        // we use a different approach: fetch more products and slice them
        const offset = (pageNum - 1) * ITEMS_PER_PAGE;
        
        // Use a larger limit to get enough products for the desired page
        const limit = Math.min(offset + ITEMS_PER_PAGE, MAX_LIMIT);
        
        paginationParams = {
          // Start from the beginning; do not include before/after
          limit: limit.toString(),
        };
      } else {
        // For page 1, use normal cursor-based pagination
        paginationParams = { before, after };
      }
    } else {
      // Use existing cursor parameters if no page parameter
      paginationParams = { before, after };
    }

    const search = await fetchFacetedSearch(
      {
        ...searchParams,
        ...parsedSearchParams,
        ...paginationParams,
        category: categoryId,
      },
      currencyCode,
      customerAccessToken,
    );

    return search;
  });

  const streamableProducts = Streamable.from(async () => {
    const format = await getFormatter();
    const searchParams = await props.searchParams;

    const search = await streamableFacetedSearch;
    let products = search.products.items;

    // If we're using page-based navigation, slice the products to show only the current page
    const { page } = searchParams;

    if (typeof page === 'string') {
      const pageNum = parseInt(page, 10);

      if (!Number.isNaN(pageNum) && pageNum > 1) {
        const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        products = products.slice(startIndex, endIndex);
      }
    }

    return products.map((product) => ({
      id: product.entityId.toString(),
      title: product.name,
      href: product.path,
      image: product.defaultImage
        ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
        : undefined,
      price: pricesTransformer(product.prices, format),
      subtitle: product.brand?.name ?? undefined,
    }));
  });

  const streamableTotalCount = Streamable.from(async () => {
    const format = await getFormatter();
    const search = await streamableFacetedSearch;

    return format.number(search.products.collectionInfo?.totalItems ?? 0);
  });

  const streamablePagination = Streamable.from(async () => {
    const search = await streamableFacetedSearch;

    return pageInfoTransformer(search.products.pageInfo);
  });

  const streamableNumberedPagination = Streamable.from(async () => {
    const search = await streamableFacetedSearch;
    const searchParams = await props.searchParams;
    const totalItems = search.products.collectionInfo?.totalItems ?? 0;
    
    // Get current page from URL parameter or calculate from cursor
    let currentPage = 1;
    const { before, after, page } = searchParams;
    
    // If we have a page parameter, use it
    if (typeof page === 'string') {
      const pageNum = parseInt(page, 10);
      
      if (!Number.isNaN(pageNum) && pageNum > 0) {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        // Clamp to [1, totalPages] (when totalPages is 0, clamp to 1 and let UI handle 0 results)
        currentPage = Math.min(Math.max(1, pageNum), Math.max(1, totalPages));
      }
    } else if (before || after) {
      // If we have cursors but no page parameter, we can't accurately determine the page
      // This is a limitation of cursor-based pagination - we don't know which page we're on
      // For now, we'll default to page 1 and let the UI handle it gracefully
      currentPage = 1;
    }

    return numberedPaginationTransformer(search.products.pageInfo, {
      totalItems,
      itemsPerPage: ITEMS_PER_PAGE,
      currentPage,
      pageParamName: 'page',
    });
  });

  const streamableFilters = Streamable.from(async () => {
    const searchParams = await props.searchParams;

    const loadSearchParams = await createCategorySearchParamsLoader(
      categoryId,
      customerAccessToken,
    );
    const parsedSearchParams = loadSearchParams?.(searchParams) ?? {};
    const cachedCategory = getCachedCategory(categoryId);
    const categorySearch = await fetchFacetedSearch(cachedCategory, undefined, customerAccessToken);
    const refinedSearch = await streamableFacetedSearch;

    const allFacets = categorySearch.facets.items.filter(
      (facet) => facet.__typename !== 'CategorySearchFilter',
    );
    const refinedFacets = refinedSearch.facets.items.filter(
      (facet) => facet.__typename !== 'CategorySearchFilter',
    );

    const transformedFacets = await facetsTransformer({
      refinedFacets,
      allFacets,
      searchParams: { ...searchParams, ...parsedSearchParams },
    });

    const filters = transformedFacets.filter((facet) => facet != null);

    const tree = categoryTree[0];
    const subCategoriesFilters =
      tree == null || tree.children.length === 0
        ? []
        : [
            {
              type: 'link-group' as const,
              label: t('Category.subCategories'),
              links: tree.children.map((child) => ({
                label: child.name,
                href: child.path,
              })),
            },
          ];

    return [...subCategoriesFilters, ...filters];
  });

  const streamableCompareProducts = Streamable.from(async () => {
    const searchParams = await props.searchParams;

    if (!productComparisonsEnabled) {
      return [];
    }

    const { compare } = compareLoader(searchParams);

    const compareIds = { entityIds: compare ? compare.map((id: string) => Number(id)) : [] };

    const products = await getCompareProducts(compareIds, customerAccessToken);

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
      <PageHeader
        backgroundImage={category.defaultImage
          ? { 
              src: category.defaultImage.url, 
              alt: category.defaultImage.altText || category.name 
            }
          : null
        }
        title={category.name}
      />

      <ProductsListSection
        breadcrumbs={breadcrumbs}
        compareLabel={t('Compare.compare')}
        compareProducts={streamableCompareProducts}
        emptyStateSubtitle={t('Category.Empty.subtitle')}
        emptyStateTitle={t('Category.Empty.title')}
        filterLabel={t('FacetedSearch.filters')}
        filters={streamableFilters}
        filtersPanelTitle={t('FacetedSearch.filters')}
        maxCompareLimitMessage={t('Compare.maxCompareLimit')}
        maxItems={MAX_COMPARE_LIMIT}
        numberedPaginationInfo={streamableNumberedPagination}
        paginationInfo={streamablePagination}
        products={streamableProducts}
        rangeFilterApplyLabel={t('FacetedSearch.Range.apply')}
        removeLabel={t('Compare.remove')}
        resetFiltersLabel={t('FacetedSearch.resetFilters')}
        showCompare={productComparisonsEnabled}
        sortDefaultValue="featured"
        sortLabel={t('SortBy.sortBy')}
        sortOptions={[
          { value: 'featured', label: t('SortBy.featuredItems') },
          { value: 'newest', label: t('SortBy.newestItems') },
          { value: 'best_selling', label: t('SortBy.bestSellingItems') },
          { value: 'a_to_z', label: t('SortBy.aToZ') },
          { value: 'z_to_a', label: t('SortBy.zToA') },
          { value: 'best_reviewed', label: t('SortBy.byReview') },
          { value: 'lowest_price', label: t('SortBy.priceAscending') },
          { value: 'highest_price', label: t('SortBy.priceDescending') },
          { value: 'relevance', label: t('SortBy.relevance') },
        ]}
        sortParamName="sort"
        totalCount={streamableTotalCount}
        useNumberedPagination={true}
      />
      <Stream value={streamableFacetedSearch}>
        {(search) => <CategoryViewed category={category} products={search.products.items} />}
      </Stream>
    </>
  );
}
