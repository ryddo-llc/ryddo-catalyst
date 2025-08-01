import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { ResultOf } from 'gql.tada';

import { ProductOptionsFragment } from '~/app/[locale]/(default)/product/[slug]/page-data';
import { type ProductSpecification } from '~/components/product/shared/product-specifications';

// Re-export shared type for consistency
export { type ProductSpecification as BikeSpecifications } from '~/components/product/shared/product-specifications';

export interface ColorOption {
  entityId: number;
  label: string;
  hexColors?: string[];
  imageUrl?: string;
  isSelected?: boolean;
  isDefault?: boolean;
}

// Use the actual GraphQL result type
type ProductWithOptions = ResultOf<typeof ProductOptionsFragment> & {
  customFields: {
    edges: Array<{
      node: {
        entityId: number;
        name: string;
        value: string;
      };
    }> | null;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }> | null;
  };
  inventory?: {
    isInStock: boolean;
  };
  availabilityV2?: {
    status: 'Available' | 'Unavailable' | 'Preorder';
  };
};

export interface BikeProductData {
  backgroundImage?: string;
  bikeSpecs?: ProductSpecification[];
  colors?: ColorOption[];
  inventoryStatus?: {
    isInStock: boolean;
    status: 'Available' | 'Unavailable' | 'Preorder';
  };
}

export function bikeProductTransformer(product: ProductWithOptions): BikeProductData {
  const customFields = removeEdgesAndNodes(product.customFields);
  const images = removeEdgesAndNodes(product.images);
  const productOptions = removeEdgesAndNodes(product.productOptions);

  // Extract background image from custom fields - check for background/hero image fields
  const backgroundImageField = customFields.find(
    (field) =>
      field.name === 'Background Image URL' ||
      field.name === 'Hero Image' ||
      field.name.toLowerCase().includes('background'),
  );
  const backgroundImage = backgroundImageField?.value || images[1]?.url;

  // Return all custom fields as bike specs - let the component handle display logic
  const bikeSpecs: ProductSpecification[] = customFields
    .filter((field) => field.name !== 'Background Image URL' && field.name !== 'Hero Image')
    .map((field) => ({
      name: field.name,
      value: field.value,
    }));

  // Extract color options from product options
  const colorOption = productOptions.find(
    (option) =>
      option.displayName.toLowerCase().includes('color') ||
      option.displayName.toLowerCase().includes('colour'),
  );

  // Helper function to get hex colors with proper typing
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

  const colors: ColorOption[] =
    colorOption && colorOption.__typename === 'MultipleChoiceOption'
      ? removeEdgesAndNodes(colorOption.values).map((optionValue) => {
          let imageUrl: string | undefined;

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
        })
      : [];

  // Extract inventory status
  const inventoryStatus =
    product.inventory && product.availabilityV2
      ? {
          isInStock: product.inventory.isInStock,
          status: product.availabilityV2.status,
        }
      : undefined;

  return {
    backgroundImage,
    bikeSpecs: bikeSpecs.length > 0 ? bikeSpecs : undefined,
    colors: colors.length > 0 ? colors : undefined,
    inventoryStatus,
  };
}
