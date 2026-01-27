import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';

const GetAllBrandsQuery = graphql(`
  query GetAllBrandsQuery {
    site {
      brands(first: 50) {
        edges {
          node {
            entityId
            name
          }
        }
      }
    }
  }
`);

export const fetchBrands = cache(async () => {
  const response = await client.fetch({
    document: GetAllBrandsQuery,
    fetchOptions: { next: { revalidate: 300 } },
  });

  return removeEdgesAndNodes(response.data.site.brands);
});
