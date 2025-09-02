import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { ResultOf } from 'gql.tada';
import { getFormatter } from 'next-intl/server';

import { ColorOption, Product } from '@/vibes/soul/primitives/product-card';
import { ExistingResultType } from '~/client/util';
import { AddonsProductCardFragment } from '~/components/product/shared/addons-fragment';

import { pricesTransformer } from './prices-transformer';

export const singleAddonsProductCardTransformer = (
  product: ResultOf<typeof AddonsProductCardFragment>,
  format: ExistingResultType<typeof getFormatter>,
): Product => {
  const priceData = pricesTransformer(product.prices, format);

  // Store raw productOptions for Streamable transformation in modal (matches main product page pattern)

  // Extract product options for colors and sizes (for backward compatibility)
  const productOptions = removeEdgesAndNodes(product.productOptions);

  // Helper function to get hex colors with fallback mapping
  const getHexColorsFromValue = (optionValue: {
    __typename?: string;
    label: string;
    hexColors?: string[];
  }): string[] | undefined => {
    // First try to get from BigCommerce swatch data
    if (optionValue.__typename === 'SwatchOptionValue' && optionValue.hexColors?.length) {
      return optionValue.hexColors;
    }

    // Fallback to common color name mapping
    const colorName = optionValue.label.toLowerCase();
    const colorMap: Record<string, string> = {
      red: '#ef4444',
      green: '#22c55e',
      blue: '#3b82f6',
      black: '#000000',
      white: '#ffffff',
    };

    const mappedColor = colorMap[colorName];

    return mappedColor ? [mappedColor] : undefined;
  };

  // Extract color options
  const colorOption = productOptions.find(
    (option) =>
      option.displayName.toLowerCase().includes('color') ||
      option.displayName.toLowerCase().includes('colour'),
  );

  const colors: ColorOption[] =
    colorOption && colorOption.__typename === 'MultipleChoiceOption'
      ? removeEdgesAndNodes(colorOption.values).map((optionValue) => {
          let imageUrl: string | undefined;

          try {
            if ('__typename' in optionValue && optionValue.__typename === 'SwatchOptionValue') {
              imageUrl = optionValue.imageUrl || undefined;
            } else if (
              '__typename' in optionValue &&
              optionValue.__typename === 'ProductPickListOptionValue'
            ) {
              imageUrl = optionValue.defaultImage?.url;
            }

            return {
              entityId: optionValue.entityId,
              label: optionValue.label,
              hexColors: getHexColorsFromValue(optionValue),
              imageUrl,
              isSelected: optionValue.isSelected ?? false,
              isDefault: optionValue.isDefault,
            };
          } catch {
            return {
              entityId: optionValue.entityId,
              label: optionValue.label,
              hexColors: undefined,
              imageUrl: undefined,
              isSelected: false,
              isDefault: optionValue.isDefault,
            };
          }
        })
      : [];

  // Extract size options
  const sizeOption = productOptions.find(
    (option) =>
      option.displayName.toLowerCase().includes('size') ||
      option.displayName.toLowerCase().includes('variant'),
  );

  const sizes: string[] =
    sizeOption && sizeOption.__typename === 'MultipleChoiceOption'
      ? removeEdgesAndNodes(sizeOption.values).map((optionValue) => optionValue.label)
      : [];

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
    colors,
    sizes,
    productOptions: product.productOptions, // Raw product options for Streamable transformation
    availabilityStatus: product.availabilityV2.status,
  };
};

export const addonsProductCardTransformer = (
  products: Array<ResultOf<typeof AddonsProductCardFragment>>,
  format: ExistingResultType<typeof getFormatter>,
): Product[] => {
  return products.map((product) => singleAddonsProductCardTransformer(product, format));
};
