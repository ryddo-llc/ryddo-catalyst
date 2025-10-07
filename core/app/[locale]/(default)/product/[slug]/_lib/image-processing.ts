import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { getProduct } from '../page-data';

/**
 * Process product images and ensure the default image appears first
 * @param product - The product data from BigCommerce
 * @returns Array of processed images with default image first
 */
export function processProductImages(
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>,
): Array<{ src: string; alt: string }> {
  const allImages = removeEdgesAndNodes(product.images).map((image) => ({
    src: image.url,
    alt: image.altText,
  }));

  if (!product.defaultImage) return allImages;

  const defaultImageInArray = allImages.find((img) => img.src === product.defaultImage?.url);

  if (defaultImageInArray) {
    const otherImages = allImages.filter((img) => img.src !== product.defaultImage?.url);

    return [{ src: product.defaultImage.url, alt: product.defaultImage.altText }, ...otherImages];
  }

  return [{ src: product.defaultImage.url, alt: product.defaultImage.altText }, ...allImages];
}
