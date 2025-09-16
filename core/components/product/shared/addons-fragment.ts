import { ProductOptionsFragment } from '~/app/[locale]/(default)/product/[slug]/page-data';
import { PricingFragment } from '~/client/fragments/pricing';
import { graphql } from '~/client/graphql';

export const AddonsProductCardFragment = graphql(
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
      availabilityV2 {
        status
      }
      ...ProductOptionsFragment
      ...PricingFragment
    }
  `,
  [ProductOptionsFragment, PricingFragment],
);