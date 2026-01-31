import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const BrowseCategoriesQuery = graphql(`
  query BrowseCategoriesQuery {
    site {
      categoryTree {
        entityId
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

const BrandsWithImagesQuery = graphql(`
  query BrandsWithImagesQuery($entityIds: [Int!], $first: Int) {
    site {
      brands(entityIds: $entityIds, first: $first) {
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

export const getBrowseCategories = cache(async () => {
  const { data } = await client.fetch({
    document: BrowseCategoriesQuery,
    fetchOptions: { next: { revalidate } },
  });

  return data.site.categoryTree;
});

export const getBrandsWithImages = cache(
  async (entityIds?: number[]) => {
    const { data } = await client.fetch({
      document: BrandsWithImagesQuery,
      variables: { entityIds, first: 50 },
      fetchOptions: { next: { revalidate: 300 } },
    });

    return removeEdgesAndNodes(data.site.brands);
  },
);
