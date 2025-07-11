import { graphql } from '~/client/graphql';

export const PageHeaderFragment = graphql(`
  fragment PageHeaderFragment on Category {
    entityId
    name
    defaultImage {
      url: urlTemplate(lossy: true)
      altText
    }
  }
`); 