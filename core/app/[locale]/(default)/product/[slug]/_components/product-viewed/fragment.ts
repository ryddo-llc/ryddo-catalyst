import { graphql } from '~/client/graphql';

export const ProductViewedFragment = graphql(`
  fragment ProductViewedFragment on Product {
    entityId
    name
    brand {
      name
      defaultImage {
        altText
        url: urlTemplate(lossy: true)
      }
    }
    sku
    description
    plainTextDescription(characterLimit: 1200)
    path
    variants {
      edges {
        node {
          entityId
        }
      }
    }
  }
`);
