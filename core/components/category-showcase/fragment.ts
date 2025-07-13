import { graphql } from '~/client/graphql';

export const CategoryShowcaseFragment = graphql(`
  fragment CategoryShowcaseFragment on CategoryTreeItem {
    entityId
    name
    path
    image {
      url: urlOriginal
      altText
    }
    description
  }
`);