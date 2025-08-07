import type { ResultOf } from 'gql.tada';

export interface ProductFeature {
  title: string;
  description: string;
  imageDescriptor?: string; // BigCommerce image alt text to search for
  imageUrl?: string; // Fallback URL if descriptor doesn't match
  imageAlt: string;
  layout?: 'normal' | 'reverse';
}

export interface ProductFeaturesData {
  features: ProductFeature[];
}

interface BigCommerceCustomField {
  entityId: number;
  name: string;
  value: string;
}

interface BigCommerceCustomFields {
  edges: Array<{
    node: BigCommerceCustomField;
  }> | null;
}

interface ProductImage {
  src: string;
  alt: string;
}

/**
 * Flatten BigCommerce custom fields from edges/nodes format to key-value pairs
 */
function flattenCustomFields(customFields: BigCommerceCustomFields): Record<string, string> {
  const flattened: Record<string, string> = {};
  
  if (!customFields.edges || customFields.edges.length === 0) {
    return flattened;
  }
  
  customFields.edges.forEach(({ node }) => {
    if (node.name && node.value) {
      flattened[node.name] = node.value;
    }
  });
  
  return flattened;
}

/**
 * Parse layout pattern string into array
 * @param layoutPattern - String like "normal,reverse,normal"
 * @returns Array of layout values
 */
function parseLayoutPattern(layoutPattern?: string): ('normal' | 'reverse')[] {
  if (!layoutPattern) {
    return ['normal', 'reverse', 'normal']; // default pattern
  }
  
  return layoutPattern
    .split(',')
    .map(layout => layout.trim() as 'normal' | 'reverse')
    .filter(layout => layout === 'normal' || layout === 'reverse');
}

/**
 * Find a feature image from product images based on descriptor (alt text)
 * Similar to findPerformanceImage but for feature images
 * @param images - Array of product images from BigCommerce
 * @param descriptor - Image descriptor/alt text to search for
 * @returns Matching image object or null if not found
 */
function findFeatureImage(
  images: ProductImage[],
  descriptor?: string
): ProductImage | null {
  if (!descriptor || images.length === 0) {
    return null;
  }

  // Try exact match first
  const exactMatch = images.find(img => img.alt === descriptor);
  if (exactMatch) {
    return exactMatch;
  }

  // Try partial match (case-insensitive)
  const partialMatch = images.find(img => 
    img.alt.toLowerCase().includes(descriptor.toLowerCase()) ||
    descriptor.toLowerCase().includes(img.alt.toLowerCase())
  );
  if (partialMatch) {
    return partialMatch;
  }

  return null;
}

/**
 * Extract product features from BigCommerce custom fields and images
 * @param customFields - BigCommerce custom fields
 * @param images - BigCommerce product images (optional, for descriptor-based image lookup)
 * @returns Transformed product features data
 */
export function productFeaturesTransformer(
  customFields: BigCommerceCustomFields,
  images?: ProductImage[]
): ProductFeaturesData {
  const flattenedFields = flattenCustomFields(customFields);
  const features: ProductFeature[] = [];
  
  // Parse layout pattern
  const layoutPattern = parseLayoutPattern(flattenedFields.feature_layout_pattern);
  
  // Extract up to 6 features (can be extended)
  for (let i = 1; i <= 6; i++) {
    const titleKey = `feature_${i}_title`;
    const descriptionKey = `feature_${i}_description`;
    const imageDescriptorKey = `feature_${i}_image_descriptor`; // Image descriptor (like performance_image_description)
    const imageUrlKey = `feature_${i}_image_url`; // Fallback: direct URL
    const imageAltKey = `feature_${i}_image_alt`; // Optional: custom alt text
    
    const title = flattenedFields[titleKey];
    const description = flattenedFields[descriptionKey];
    const imageDescriptor = flattenedFields[imageDescriptorKey];
    const imageUrl = flattenedFields[imageUrlKey];
    const customAlt = flattenedFields[imageAltKey];
    
    // Only add feature if title and description are present
    if (title && description) {
      const layoutIndex = (i - 1) % layoutPattern.length;
      
      // Try to find image by descriptor first, then fall back to URL
      let featureImageDescriptor: string | undefined;
      let featureImageUrl: string | undefined;
      let featureImageAlt: string;

      if (imageDescriptor) {
        // Use descriptor to find image in BigCommerce images
        featureImageDescriptor = imageDescriptor.trim();
        featureImageAlt = customAlt || imageDescriptor.trim();
      } else if (imageUrl) {
        // Fall back to direct URL
        featureImageUrl = imageUrl.trim();
        featureImageAlt = customAlt || `${title} feature image`;
      } else {
        // Skip this feature if no image source is provided
        continue;
      }
      
      features.push({
        title: title.trim(),
        description: description.trim(),
        imageDescriptor: featureImageDescriptor,
        imageUrl: featureImageUrl,
        imageAlt: featureImageAlt,
        layout: layoutPattern[layoutIndex] || 'normal',
      });
    }
  }
  
  return {
    features,
  };
}

/**
 * Resolve feature images by finding them in the product images array
 * This function should be called after productFeaturesTransformer to resolve image descriptors
 * @param featuresData - Product features data with descriptors
 * @param images - BigCommerce product images
 * @returns Features data with resolved image URLs
 */
export function resolveFeatureImages(
  featuresData: ProductFeaturesData,
  images: ProductImage[]
): ProductFeaturesData {
  const resolvedFeatures = featuresData.features.map(feature => {
    // If already has imageUrl, use it
    if (feature.imageUrl) {
      return feature;
    }

    // Try to resolve imageDescriptor to actual image
    if (feature.imageDescriptor) {
      const foundImage = findFeatureImage(images, feature.imageDescriptor);
      if (foundImage) {
        return {
          ...feature,
          imageUrl: foundImage.src,
          imageAlt: feature.imageAlt || foundImage.alt,
        };
      }
    }

    // If no image found, this feature will be skipped in the component
    return feature;
  });

  return {
    features: resolvedFeatures,
  };
}

/**
 * Default product features for fallback (can be customized per product type)
 */
export const defaultProductFeatures: ProductFeaturesData = {
  features: [
    {
      title: 'Headlight & Tail Light',
      description: 'Stay safe with advanced LED lighting systems, featuring high-lumen headlights and integrated brake lights for maximum visibility.',
      imageUrl: '/images/features/lighting.jpg',
      imageAlt: 'Electric vehicle LED lighting system',
      layout: 'normal',
    },
    {
      title: 'Advanced Suspension',
      description: 'Premium suspension system with adjustable preload, compression, and rebound damping for optimal comfort and control.',
      imageUrl: '/images/features/suspension.jpg',
      imageAlt: 'Electric vehicle suspension system',
      layout: 'reverse',
    },
    {
      title: 'Powerful Braking',
      description: 'High-performance hydraulic disc brakes with multi-piston calipers and oversized rotors for superior stopping power.',
      imageUrl: '/images/features/braking.jpg',
      imageAlt: 'Electric vehicle disc brake system',
      layout: 'normal',
    },
  ],
};