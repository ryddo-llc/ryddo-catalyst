import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
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
            products(first: 6) {
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

