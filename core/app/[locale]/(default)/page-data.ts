import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { FeaturedProductsCarouselFragment } from '~/components/featured-products-carousel/fragment';
import { FeaturedProductsListFragment } from '~/components/featured-products-list/fragment';
import { FooterFragment, FooterSectionsFragment } from '~/components/footer/fragment';
import { CurrencyCode, HeaderFragment, HeaderLinksFragment } from '~/components/header/fragment';
import { ProductCardFragment } from '~/components/product-card/fragment';

export const LayoutQuery = graphql(
  `
    query LayoutQuery {
      site {
        ...HeaderFragment
        ...FooterFragment
      }
    }
  `,
  [HeaderFragment, FooterFragment],
);

export const GetLinksAndSectionsQuery = graphql(
  `
    query GetLinksAndSectionsQuery {
      site {
        ...HeaderLinksFragment
        ...FooterSectionsFragment
      }
    }
  `,
  [HeaderLinksFragment, FooterSectionsFragment],
);

const HomePageQuery = graphql(
  `
    query HomePageQuery($currencyCode: currencyCode) {
      site {
        featuredProducts(first: 12) {
          edges {
            node {
              ...FeaturedProductsListFragment
            }
          }
        }
        newestProducts(first: 12) {
          edges {
            node {
              ...FeaturedProductsCarouselFragment
            }
          }
        }
      }
    }
  `,
  [FeaturedProductsCarouselFragment, FeaturedProductsListFragment],
);

const PopularProductsQuery = graphql(
  `
    query PopularProductsQuery($currencyCode: currencyCode) {
      site {
        search {
          searchProducts(
            filters: { 
              categoryEntityIds: [28, 29]
              isFeatured: true
            }
            sort: FEATURED
          ) {
            products(first: 12) {
              edges {
                node {
                  ...ProductCardFragment
                }
              }
            }
          }
        }
      }
    }
  `,
  [ProductCardFragment],
);

export const getPageData = cache(
  async (currencyCode?: CurrencyCode, customerAccessToken?: string) => {
    const { data } = await client.fetch({
      document: HomePageQuery,
      customerAccessToken,
      variables: { currencyCode },
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
    });

    return data;
  },
);

export const getPopularProductsData = cache(
  async (currencyCode?: CurrencyCode, customerAccessToken?: string) => {
    const { data } = await client.fetch({
      document: PopularProductsQuery,
      customerAccessToken,
      variables: { currencyCode },
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
    });

    return data;
  },
);

const BannersQuery = graphql(`
  query BannersQuery {
    site {
      content {
        banners {
          homePage {
            edges {
              node {
                entityId
                name
                content
                location
              }
            }
          }
          searchPage {
            edges {
              node {
                entityId
                name
                content
                location
              }
            }
          }
        }
      }
    }
  }
`);

export const getBannersData = cache(async (customerAccessToken?: string) => {
  const { data } = await client.fetch({
    document: BannersQuery,
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });

  return data;
});

