import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const AccessoriesQuery = graphql(`
  query AccessoriesQuery($first: Int!, $categoryEntityId: Int) {
    site {
      products(first: $first, filters: { categoryEntityId: $categoryEntityId }) {
        edges {
          node {
            entityId
            name
            path
            defaultImage {
              altText
              url: urlTemplate(lossy: true)
            }
            prices {
              basePrice {
                ... on Money {
                  value
                  currencyCode
                }
              }
              price {
                ... on Money {
                  value
                  currencyCode
                }
              }
              salePrice {
                ... on Money {
                  value
                  currencyCode
                }
              }
              retailPrice {
                ... on Money {
                  value
                  currencyCode
                }
              }
              priceRange {
                min {
                  value
                  currencyCode
                }
                max {
                  value
                  currencyCode
                }
              }
            }
            reviewSummary {
              averageRating
              numberOfReviews
            }
            brand {
              name
              path
            }
            inventory {
              isInStock
            }
          }
        }
      }
    }
  }
`);

export const getAccessories = cache(async (categoryEntityId?: number, customerAccessToken?: string) => {
  const { data } = await client.fetch({
    document: AccessoriesQuery,
    variables: { 
      first: 6,
      categoryEntityId: categoryEntityId || undefined
    },
    customerAccessToken,
    validateCustomerAccessToken: false,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });
  
  return data.site.products.edges?.map(({ node }) => node) || [];
});