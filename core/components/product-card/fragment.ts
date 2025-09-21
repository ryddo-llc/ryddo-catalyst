import { PricingFragment } from '~/client/fragments/pricing';
import { graphql } from '~/client/graphql';

export const ProductCardFragment = graphql(
  `
    fragment ProductCardFragment on Product {
      entityId
      name
      defaultImage {
        altText
        url: urlTemplate(lossy: true)
      }
      path
      categories {
        edges {
          node {
            name
            path
          }
        }
      }
      brand {
        name
        path
        defaultImage {
          altText
          url: urlTemplate(lossy: true)
        }
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
