import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

interface CustomField {
  entityId: number;
  name: string;
  value: string;
}

interface ProductImage {
  url: string;
  altText: string;
}

interface BikeSpecifications {
  motorPower?: string;
  batteryCapacity?: string;
  maxSpeed?: string;
  range?: string;
  frameSize?: string;
  wheelSize?: string;
  brakeSystem?: string;
  transmissionType?: string;
}

interface ColorOption {
  entityId: number;
  label: string;
  hexColors?: string[];
  imageUrl?: string;
  isSelected?: boolean;
  isDefault?: boolean;
}

interface ProductWithCustomFields {
  customFields: {
    edges: Array<{
      node: CustomField;
    }> | null;
  };
  images: {
    edges: Array<{
      node: ProductImage;
    }> | null;
  };
  productOptions?: {
    edges: Array<{
      node: {
        entityId: number;
        displayName: string;
        values: {
          edges: Array<{
            node: {
              entityId: number;
              label: string;
              isDefault: boolean;
              isSelected: boolean;
              hexColors?: string[];
              imageUrl?: string;
            };
          }>;
        };
      };
    }> | null;
  };
  inventory?: {
    isInStock: boolean;
  };
  availabilityV2?: {
    status: 'Available' | 'Unavailable' | 'Preorder';
  };
}

export interface BikeProductData {
  backgroundImage?: string;
  bikeSpecs?: BikeSpecifications;
  colors?: ColorOption[];
  inventoryStatus?: {
    isInStock: boolean;
    status: 'Available' | 'Unavailable' | 'Preorder';
  };
}

export function bikeProductTransformer(product: ProductWithCustomFields): BikeProductData {
  const customFields = removeEdgesAndNodes(product.customFields);
  const images = removeEdgesAndNodes(product.images);
  const productOptions = removeEdgesAndNodes(product.productOptions || { edges: [] });

  // Extract background image from custom fields
  const backgroundImageField = customFields.find(
    field => field.name.toLowerCase().includes('background') || 
             field.name.toLowerCase().includes('hero') ||
             field.name === 'Background Image URL'
  );

  const backgroundImage = backgroundImageField?.value || images[1]?.url; // Fallback to second image (index 1) - skip thumbnail

  // Extract bike specifications from custom fields
  const bikeSpecs: BikeSpecifications = {
    motorPower: customFields.find(f => 
      f.name.toLowerCase().includes('motor') || 
      f.name.toLowerCase().includes('power')
    )?.value,
    batteryCapacity: customFields.find(f => 
      f.name.toLowerCase().includes('battery') || 
      f.name.toLowerCase().includes('capacity')
    )?.value,
    maxSpeed: customFields.find(f => 
      f.name.toLowerCase().includes('speed') || 
      f.name.toLowerCase().includes('max speed')
    )?.value,
    range: customFields.find(f => 
      f.name.toLowerCase().includes('range') || 
      f.name.toLowerCase().includes('distance')
    )?.value,
    frameSize: customFields.find(f => 
      f.name.toLowerCase().includes('frame') || 
      f.name.toLowerCase().includes('size')
    )?.value,
    wheelSize: customFields.find(f => 
      f.name.toLowerCase().includes('wheel')
    )?.value,
    brakeSystem: customFields.find(f => 
      f.name.toLowerCase().includes('brake')
    )?.value,
    transmissionType: customFields.find(f => 
      f.name.toLowerCase().includes('transmission') || 
      f.name.toLowerCase().includes('gear')
    )?.value,
  };

  // Extract color options from product options
  const colorOption = productOptions.find(option => 
    option.displayName.toLowerCase().includes('color') ||
    option.displayName.toLowerCase().includes('colour')
  );

  const colors: ColorOption[] = colorOption ? 
    removeEdgesAndNodes(colorOption.values).map(value => ({
      entityId: value.entityId,
      label: value.label,
      hexColors: value.hexColors,
      imageUrl: value.imageUrl,
      isSelected: value.isSelected,
      isDefault: value.isDefault,
    })) : [];

  // Extract inventory status
  const inventoryStatus = product.inventory && product.availabilityV2 ? {
    isInStock: product.inventory.isInStock,
    status: product.availabilityV2.status,
  } : undefined;

  return {
    backgroundImage,
    bikeSpecs: Object.values(bikeSpecs).some(Boolean) ? bikeSpecs : undefined,
    colors: colors.length > 0 ? colors : undefined,
    inventoryStatus,
  };
}