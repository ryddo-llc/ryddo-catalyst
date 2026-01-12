import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { ProductDetail } from '@/vibes/soul/sections/product-detail';

import { ProductDetail as ProductDetailCustom } from '../product-detail';

interface ProductCategory {
  name: string;
  path: string;
}

interface ProductWithCategories {
  categories: {
    edges: Array<{
      node: ProductCategory;
    }> | null;
  };
}

type ProductDetailVariant = 'e-rides' | 'default';

export function getProductDetailVariant(product: ProductWithCategories): ProductDetailVariant {
  if (!product.categories.edges) {
    return 'default';
  }

  const categories = removeEdgesAndNodes(product.categories);
  const categoryNames = categories.map((category) => category.name.toLowerCase());

  // E-rides includes all bikes and scooters
  const eRidesKeywords = [
    'e-rides',
    'e-ride',
    'erides',
    'e-bike',
    'ebike',
    'electric bike',
    'bike',
    'bicycle',
    'e-scooter',
    'escooter',
    'electric scooter',
    'scooter',
  ];
  const isERide = eRidesKeywords.some((keyword) =>
    categoryNames.some((name) => name.includes(keyword)),
  );

  if (isERide) {
    return 'e-rides';
  }

  // Default for gear & accessories
  return 'default';
}


// Export component variants for easy access
export { ProductDetail, ProductDetailCustom };