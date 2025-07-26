import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const AccessoriesQuery = graphql(`
  query AccessoriesQuery($first: Int!) {
    site {
      products(first: $first) {
        edges {
          node {
            entityId
            name
            path
            defaultImage {
              altText
              url: urlTemplate(lossy: true)
            }
          }
        }
      }
    }
  }
`);

export const getAccessories = cache(async (customerAccessToken?: string) => {
  const { data } = await client.fetch({
    document: AccessoriesQuery,
    variables: { 
      first: 6
    },
    customerAccessToken,
    validateCustomerAccessToken: false,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });
  
  return data.site.products.edges?.map(({ node }) => node) || [];
});