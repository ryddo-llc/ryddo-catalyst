import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';
import { ResultOf } from 'gql.tada';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { CurrencyCode } from '~/components/header/fragment';
import { ProductCardFragment } from '~/components/product-card/fragment';

// Category IDs from BigCommerce store
const GEAR_CATEGORY_ID = 30; // Gear category
const ACCESSORIES_CATEGORY_ID = 31; // Accessories category

const FeaturedAddonsAndAccessoriesQuery = graphql(
  `
    query FeaturedAddonsAndAccessoriesQuery(
      $gearCategoryIds: [Int!]!
      $accessoriesCategoryIds: [Int!]!
      $currencyCode: currencyCode
    ) {
      site {
        gear: search {
          searchProducts(
            filters: { 
              categoryEntityIds: $gearCategoryIds, 
              isFeatured: true 
            }
            sort: FEATURED
          ) {
            products(first: 3) {
              edges {
                node {
                  ...ProductCardFragment
                }
              }
            }
          }
        }
        accessories: search {
          searchProducts(
            filters: { 
              categoryEntityIds: $accessoriesCategoryIds, 
              isFeatured: true 
            }
            sort: FEATURED
          ) {
            products(first: 3) {
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

// Type for the query result
type FeaturedAddonsQueryResult = ResultOf<typeof FeaturedAddonsAndAccessoriesQuery>;

export const getFeaturedAddonsAndAccessories = cache(
  async (currencyCode?: CurrencyCode, customerAccessToken?: string) => {
    try {
      const { data }: { data: FeaturedAddonsQueryResult } = await client.fetch({
        document: FeaturedAddonsAndAccessoriesQuery,
        variables: { 
          gearCategoryIds: [GEAR_CATEGORY_ID],
          accessoriesCategoryIds: [ACCESSORIES_CATEGORY_ID],
          currencyCode 
        },
        customerAccessToken,
        fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
      });

      // Type-safe extraction of products
      const gearProducts = removeEdgesAndNodes(data.site.gear.searchProducts.products);
      const accessoriesProducts = removeEdgesAndNodes(data.site.accessories.searchProducts.products);

      // Combine results from both searches - returns raw product data for transformation
      return [...gearProducts, ...accessoriesProducts];
    } catch (error) {
      // Type-safe error handling
      console.error('Failed to fetch featured gear and accessories:', error);
      
      // Return empty array to prevent component failure
      return [];
    }
  },
);