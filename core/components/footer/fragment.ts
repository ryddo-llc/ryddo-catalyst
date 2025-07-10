import { graphql } from '~/client/graphql';

export const FooterFragment = graphql(`
  fragment FooterFragment on Site {
    settings {
      storeName
      contact {
        address
        phone
      }
      socialMediaLinks {
        name
        url
      }
      logoV2 {
        __typename
        ... on StoreTextLogo {
          text
        }
        ... on StoreImageLogo {
          image {
            url: urlTemplate(lossy: true)
            altText
          }
        }
      }
    }
  }
`);

export const FooterSectionsFragment = graphql(`
  fragment FooterSectionsFragment on Site {
    categoryTree {
      name
      path
    }
  }
`);
