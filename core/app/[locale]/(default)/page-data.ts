import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { FooterFragment, FooterSectionsFragment } from '~/components/footer/fragment';
import { HeaderFragment, HeaderLinksFragment } from '~/components/header/fragment';

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

