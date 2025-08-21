import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';
import { ResultOf } from 'gql.tada';
import { getFormatter } from 'next-intl/server';

import { client } from '~/client';
import { PricingFragment } from '~/client/fragments/pricing';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { CurrencyCode } from '~/components/header/fragment';
import { addonsProductCardTransformer } from '~/data-transformers/addons-product-card-transformer';

// Category IDs from BigCommerce store
const GEAR_CATEGORY_ID = 30; // Gear category
const ACCESSORIES_CATEGORY_ID = 31; // Accessories category

// Enhanced fragment for addons that includes images collection for second image access
const AddonsProductCardFragment = graphql(
  `
    fragment AddonsProductCardFragment on Product {
      entityId
      name
      images(first: 2) {
        edges {
          node {
            altText
            url: urlTemplate(lossy: true)
            isDefault
          }
        }
      }
      defaultImage {
        altText
        url: urlTemplate(lossy: true)
      }
      path
      brand {
        name
        path
      }
      reviewSummary {
        numberOfReviews
        averageRating
      }
      inventory {
        isInStock
      }
      ...PricingFragment
    }
  `,
  [PricingFragment],
);

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
                  ...AddonsProductCardFragment
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
                  ...AddonsProductCardFragment
                }
              }
            }
          }
        }
      }
    }
  `,
  [AddonsProductCardFragment],
);

// Type for the query result
type FeaturedAddonsQueryResult = ResultOf<typeof FeaturedAddonsAndAccessoriesQuery>;

/**
 * Fetches and transforms featured gear and accessories with optimized Streamable usage
 * Returns properly transformed Product[] ready for component consumption
 */
export const getFeaturedAddonsAndAccessories = cache(
  async (currencyCode?: CurrencyCode, customerAccessToken?: string) => {
    try {
      // Get formatter once for efficiency
      const format = await getFormatter();
      
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

      // Combine and transform with second image preference
      const combinedProducts = [...gearProducts, ...accessoriesProducts];
      
      // Return fully transformed products ready for component
      return addonsProductCardTransformer(combinedProducts, format);
    } catch (error) {
      // Type-safe error handling
      console.error('Failed to fetch featured gear and accessories:', error);
      
      // Return empty array to prevent component failure
      return [];
    }
  },
);