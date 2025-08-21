import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { ResultOf } from 'gql.tada';
import { getFormatter } from 'next-intl/server';

import { Product } from '@/vibes/soul/primitives/product-card';
import { ExistingResultType } from '~/client/util';

import { pricesTransformer } from './prices-transformer';

// Type for products with images collection (from AddonsProductCardFragment)
type AddonsProductData = {
  entityId: number;
  name: string;
  images: {
    edges: Array<{
      node: {
        altText: string;
        url: string;
        isDefault: boolean;
      };
    }>;
  };
  defaultImage?: {
    altText: string;
    url: string;
  } | null;
  path: string;
  brand?: {
    name: string;
    path: string;
  } | null;
  reviewSummary: {
    numberOfReviews: number;
    averageRating: number;
  };
  inventory: {
    isInStock: boolean;
  };
  prices?: any; // From PricingFragment
};

/**
 * Transforms addon/accessory products with preference for second image (clean background)
 * Image priority: Second image -> First image -> Default image
 */
export const singleAddonsProductCardTransformer = (
  product: AddonsProductData,
  format: ExistingResultType<typeof getFormatter>,
): Product => {
  const priceData = pricesTransformer(product.prices, format);
  
  // Extract images and prefer second image for clean background
  const images = removeEdgesAndNodes(product.images);
  const secondImage = images[1]; // Preferred clean image
  const firstImage = images[0];  // Fallback thumbnail
  
  // Image selection priority: second -> first -> default
  const selectedImage = secondImage || firstImage;
  
  return {
    id: product.entityId.toString(),
    title: product.name,
    name: product.name,
    href: product.path,
    type: 'product',
    image: selectedImage
      ? { src: selectedImage.url, alt: selectedImage.altText }
      : product.defaultImage
        ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
        : undefined,
    price: priceData,
    subtitle: product.brand?.name ?? undefined,
    rating: product.reviewSummary.averageRating,
    onSale: typeof priceData === 'object' && priceData.type === 'sale',
    outOfStock: !product.inventory.isInStock,
  };
};

/**
 * Transforms multiple addon/accessory products with second image preference
 */
export const addonsProductCardTransformer = (
  products: AddonsProductData[],
  format: ExistingResultType<typeof getFormatter>,
): Product[] => {
  return products.map((product) => singleAddonsProductCardTransformer(product, format));
};