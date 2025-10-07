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

type ProductDetailVariant = 'bike' | 'scooter' | 'default';

export function getProductDetailVariant(product: ProductWithCategories): ProductDetailVariant {
  if (!product.categories.edges) {
    return 'default';
  }
  
  const categories = removeEdgesAndNodes(product.categories);
  const categoryNames = categories.map(category => category.name.toLowerCase());
  
  // Check for bike-related categories
  const bikeKeywords = ['e-bike', 'ebike', 'electric bike', 'bike', 'bicycle'];
  const isBike = bikeKeywords.some(keyword => 
    categoryNames.some(name => name.includes(keyword))
  );
  
  if (isBike) {
    return 'bike';
  }
  
  // Check for scooter-related categories
  const scooterKeywords = ['e-scooter', 'escooter', 'electric scooter', 'scooter'];
  const isScooter = scooterKeywords.some(keyword => 
    categoryNames.some(name => name.includes(keyword))
  );
  
  if (isScooter) {
    return 'scooter';
  }
  
  // Default to standard product detail
  return 'default';
}


// Export component variants for easy access
export { ProductDetail, ProductDetailCustom };