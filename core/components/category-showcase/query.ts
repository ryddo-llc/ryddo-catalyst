import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const HeaderCategoriesQuery = graphql(`
  query HeaderCategoriesQuery {
    site {
      categoryTree {
        name
        path
        image {
          url: urlTemplate(lossy: true)
          altText
        }
      }
    }
  }
`);

export const getHeaderCategories = cache(async (customerAccessToken?: string) => {
  const { data } = await client.fetch({
    document: HeaderCategoriesQuery,
    customerAccessToken,
    validateCustomerAccessToken: false,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });
  
  return data.site.categoryTree;
});
