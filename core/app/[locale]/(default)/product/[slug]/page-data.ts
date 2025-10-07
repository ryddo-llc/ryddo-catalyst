import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';

import { client } from '~/client';
import { PricingFragment } from '~/client/fragments/pricing';
import { graphql, VariablesOf } from '~/client/graphql';
import { FeaturedProductsCarouselFragment } from '~/components/featured-products-carousel/fragment';
import type { CurrencyCode } from '~/components/header/fragment';
import { ProductCardFragment } from '~/components/product-card/fragment';

import { ProductSchemaFragment } from './_components/product-schema/fragment';
import { ProductViewedFragment } from './_components/product-viewed/fragment';

const MultipleChoiceFieldFragment = graphql(`
  fragment MultipleChoiceFieldFragment on MultipleChoiceOption {
    entityId
    displayName
    displayStyle
    isRequired
    values(first: 50) {
      edges {
        node {
          entityId
          label
          isDefault
          isSelected
          ... on SwatchOptionValue {
            __typename
            hexColors
            imageUrl(lossy: true, width: 40)
          }
          ... on ProductPickListOptionValue {
            __typename
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

const CheckboxFieldFragment = graphql(`
  fragment CheckboxFieldFragment on CheckboxOption {
    entityId
    isRequired
    displayName
    checkedByDefault
    label
    checkedOptionValueEntityId
    uncheckedOptionValueEntityId
  }
`);

const NumberFieldFragment = graphql(`
  fragment NumberFieldFragment on NumberFieldOption {
    entityId
    displayName
    isRequired
    defaultNumber: defaultValue
    highest
    isIntegerOnly
    limitNumberBy
    lowest
  }
`);

const TextFieldFragment = graphql(`
  fragment TextFieldFragment on TextFieldOption {
    entityId
    displayName
    isRequired
    defaultText: defaultValue
    maxLength
    minLength
  }
`);

const MultiLineTextFieldFragment = graphql(`
  fragment MultiLineTextFieldFragment on MultiLineTextFieldOption {
    entityId
    displayName
    isRequired
    defaultText: defaultValue
    maxLength
    minLength
    maxLines
  }
`);

const DateFieldFragment = graphql(`
  fragment DateFieldFragment on DateFieldOption {
    entityId
    displayName
    isRequired
    defaultDate: defaultValue
    earliest
    latest
    limitDateBy
  }
`);

export const ProductOptionsFragment = graphql(
  `
    fragment ProductOptionsFragment on Product {
      entityId
      productOptions(first: 50) {
        edges {
          node {
            __typename
            entityId
            displayName
            isRequired
            isVariantOption
            ...MultipleChoiceFieldFragment
            ...CheckboxFieldFragment
            ...NumberFieldFragment
            ...TextFieldFragment
            ...MultiLineTextFieldFragment
            ...DateFieldFragment
          }
        }
      }
      options(first: 50) {
        edges {
          node {
            entityId
            displayName
            isRequired
            values(first: 50) {
              edges {
                node {
                  entityId
                  label
                }
              }
            }
          }
        }
      }
    }
  `,
  [
    MultipleChoiceFieldFragment,
    CheckboxFieldFragment,
    NumberFieldFragment,
    TextFieldFragment,
    MultiLineTextFieldFragment,
    DateFieldFragment,
  ],
);

// Consolidated query for metadata - minimal fields for generateMetadata only
const ProductPageMetadataQuery = graphql(`
  query ProductPageMetadataQuery($entityId: Int!) {
    site {
      product(entityId: $entityId) {
        name
        defaultImage {
          altText
          url: urlTemplate(lossy: true)
        }
        seo {
          pageTitle
          metaDescription
          metaKeywords
        }
        plainTextDescription(characterLimit: 1200)
      }
    }
  }
`);

export const getProductPageMetadata = cache(
  async (entityId: number, customerAccessToken?: string) => {
    const { data } = await client.fetch({
      document: ProductPageMetadataQuery,
      variables: { entityId },
      customerAccessToken,
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate: 3600 } }, // 1 hour for metadata
    });

    return data.site.product;
  },
);

// Consolidated comprehensive product query - combines old ProductQuery + StreamableProductQuery
const ProductQuery = graphql(
  `
    query ProductQuery(
      $entityId: Int!
      $optionValueIds: [OptionValueId!]
      $useDefaultOptionSelections: Boolean
    ) {
      site {
        product(
          entityId: $entityId
          optionValueIds: $optionValueIds
          useDefaultOptionSelections: $useDefaultOptionSelections
        ) {
          entityId
          name
          description
          plainTextDescription(characterLimit: 1200)
          plainTextDescriptionShort: plainTextDescription(characterLimit: 300)
          path
          sku
          brand {
            name
            defaultImage {
              altText
              url: urlTemplate(lossy: true)
            }
          }
          reviewSummary {
            averageRating
            numberOfReviews
          }
          categories {
            edges {
              node {
                name
                path
                entityId
              }
            }
          }
          images(first: 20) {
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
          weight {
            value
            unit
          }
          condition
          customFields {
            edges {
              node {
                entityId
                name
                value
              }
            }
          }
          warranty
          inventory {
            isInStock
          }
          availabilityV2 {
            status
          }
          ...ProductOptionsFragment
          ...ProductViewedFragment
          ...ProductSchemaFragment
        }
      }
    }
  `,
  [ProductOptionsFragment, ProductViewedFragment, ProductSchemaFragment],
);

type Variables = VariablesOf<typeof ProductQuery>;

// Consolidated function - replaces both getProduct and getStreamableProduct
export const getProduct = cache(async (variables: Variables, customerAccessToken?: string) => {
  const { data } = await client.fetch({
    document: ProductQuery,
    variables,
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate: 3600 } }, // 1 hour for product content
  });

  return data.site.product;
});

// Legacy alias for backwards compatibility - will be removed in page.tsx refactor
export const getStreamableProduct = getProduct;

// Fields that require currencyCode as a query variable
// Separated from the rest to cache separately
const ProductPricingAndRelatedProductsQuery = graphql(
  `
    query ProductPricingAndRelatedProductsQuery(
      $entityId: Int!
      $optionValueIds: [OptionValueId!]
      $useDefaultOptionSelections: Boolean
      $currencyCode: currencyCode
    ) {
      site {
        product(
          entityId: $entityId
          optionValueIds: $optionValueIds
          useDefaultOptionSelections: $useDefaultOptionSelections
        ) {
          ...PricingFragment
          categories {
            edges {
              node {
                entityId
              }
            }
          }
          relatedProducts(first: 4) {
            edges {
              node {
                ...FeaturedProductsCarouselFragment
              }
            }
          }
        }
      }
    }
  `,
  [PricingFragment, FeaturedProductsCarouselFragment],
);

export const getProductPricingAndRelatedProducts = cache(
  async (variables: Variables, customerAccessToken?: string) => {
    const { data } = await client.fetch({
      document: ProductPricingAndRelatedProductsQuery,
      variables,
      customerAccessToken,
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate: 300 } }, // 5 min for pricing
    });

    return data.site.product;
  },
);

// Query to fetch products from the same category
const ProductsByCategoryQuery = graphql(
  `
    query ProductsByCategoryQuery(
      $categoryEntityId: Int!
      $currencyCode: currencyCode
    ) {
      site {
        search {
          searchProducts(
            filters: { categoryEntityId: $categoryEntityId }
            sort: RELEVANCE
          ) {
            products(first: 5) {
              edges {
                node {
                  entityId
                  ...ProductCardFragment
                }
              }
            }
          }
        }
      }
    }
  `,
  [ProductCardFragment],
);

export const getProductsByCategory = cache(
  async (
    categoryEntityId: number,
    excludeProductId: number,
    currencyCode?: CurrencyCode,
    customerAccessToken?: string,
  ) => {
    const { data } = await client.fetch({
      document: ProductsByCategoryQuery,
      variables: {
        categoryEntityId,
        currencyCode,
      },
      customerAccessToken,
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate: 3600 } }, // 1 hour for category products
    });

    const searchResults = data.site.search.searchProducts;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!searchResults?.products) {
      return [];
    }

    // Remove the current product from results and limit to 4
    const products = removeEdgesAndNodes(searchResults.products);

    return products.filter((p) => p.entityId !== excludeProductId).slice(0, 4);
  },
);

// Type for product card data (used in related products and category products)
type ProductCardData = Awaited<ReturnType<typeof getProductsByCategory>>[number];

// Optimized function to get related products - tries both sources in parallel
export const getRelatedProductsOptimized = cache(
  async (
    relatedProducts: ProductCardData[],
    categoryId: number | null,
    excludeProductId: number,
    currencyCode: CurrencyCode | undefined,
    customerAccessToken: string | undefined,
  ) => {
    // If we have related products, use them immediately
    if (relatedProducts.length > 0) {
      return relatedProducts;
    }

    // Otherwise fall back to category products
    if (categoryId) {
      return getProductsByCategory(categoryId, excludeProductId, currencyCode, customerAccessToken);
    }

    return [];
  },
);

// Query to get variant SKU based on selected options
const VariantSkuQuery = graphql(`
  query VariantSkuQuery(
    $entityId: Int!
    $optionValueIds: [OptionValueId!]
    $useDefaultOptionSelections: Boolean
  ) {
    site {
      product(
        entityId: $entityId
        optionValueIds: $optionValueIds
        useDefaultOptionSelections: $useDefaultOptionSelections
      ) {
        sku
        variants(first: 1) {
          edges {
            node {
              entityId
              sku
              defaultImage {
                altText
                url: urlTemplate(lossy: true)
              }
            }
          }
        }
      }
    }
  }
`);

type VariantSkuVariables = VariablesOf<typeof VariantSkuQuery>;

export const getVariantSku = cache(
  async (variables: VariantSkuVariables, customerAccessToken?: string): Promise<string> => {
    try {
      const { data } = await client.fetch({
        document: VariantSkuQuery,
        variables,
        customerAccessToken,
        fetchOptions: { cache: 'no-store' },
      });

      const product = data.site.product;
      
      if (!product) {
        return '';
      }

      // First try to get SKU directly from the product (for selected variant)
      if (product.sku && product.sku.trim() !== '') {
        return product.sku;
      }

      // If no direct SKU, try to get from variants  
      const variants = removeEdgesAndNodes(product.variants);

      if (variants.length > 0 && variants[0]?.sku && variants[0].sku.trim() !== '') {
        return variants[0].sku;
      }

      return '';
    } catch {
      return '';
    }
  },
);
