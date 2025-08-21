import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { ResultOf } from 'gql.tada';
import { getFormatter } from 'next-intl/server';

import { Product } from '@/vibes/soul/primitives/product-card';
import { ExistingResultType } from '~/client/util';
import { AddonsProductCardFragment } from '~/components/product/shared/addons-fragment';

import { pricesTransformer } from './prices-transformer';

export const singleAddonsProductCardTransformer = (
  product: ResultOf<typeof AddonsProductCardFragment>,
  format: ExistingResultType<typeof getFormatter>,
): Product => {
  const priceData = pricesTransformer(product.prices, format);

  // Extract images and prefer second image for clean background
  const images = removeEdgesAndNodes(product.images);
  const secondImage = images[1]; // Preferred clean image
  const firstImage = images[0]; // Fallback thumbnail

  // Image selection priority: second -> first -> default
  const selectedImage = secondImage || firstImage;

  // Determine image data with proper fallback chain
  let imageData;

  if (selectedImage) {
    imageData = { src: selectedImage.url, alt: selectedImage.altText };
  } else if (product.defaultImage) {
    imageData = { src: product.defaultImage.url, alt: product.defaultImage.altText };
  } else {
    imageData = undefined;
  }

  return {
    id: product.entityId.toString(),
    title: product.name,
    name: product.name,
    href: product.path,
    type: 'product',
    image: imageData,
    price: priceData,
    subtitle: product.brand?.name ?? undefined,
    rating: product.reviewSummary.averageRating,
    onSale: typeof priceData === 'object' && priceData.type === 'sale',
    outOfStock: !product.inventory.isInStock,
  };
};

export const addonsProductCardTransformer = (
  products: Array<ResultOf<typeof AddonsProductCardFragment>>,
  format: ExistingResultType<typeof getFormatter>,
): Product[] => {
  return products.map((product) => singleAddonsProductCardTransformer(product, format));
};
