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
 * @param {BigCommerceCustomFields} customFields - BigCommerce custom fields data
 * @returns {Record<string, string>} Flattened key-value pairs
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
 * @param {string} layoutPattern - String like "normal,reverse,normal"
 * @returns {Array<'normal' | 'reverse'>} Array of layout values
 */
function parseLayoutPattern(layoutPattern?: string): Array<'normal' | 'reverse'> {
  if (!layoutPattern) {
    return ['normal', 'reverse', 'normal']; // default pattern
  }
  
  return layoutPattern
    .split(',')
    .map(layout => layout.trim())
    .filter((layout): layout is 'normal' | 'reverse' => {

      return layout === 'normal' || layout === 'reverse';
    });
}

/**
 * Find a feature image from product images based on descriptor (alt text)
 * Similar to findPerformanceImage but for feature images
 * @param {ProductImage[]} images - Array of product images from BigCommerce
 * @param {string} descriptor - Image descriptor/alt text to search for
 * @returns {ProductImage | null} Matching image object or null if not found
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
  const partialMatch = images.find(img => {
    const imgAlt = img.alt.toLowerCase();
    const desc = descriptor.toLowerCase();
    
    // Prefer descriptor being contained in alt text over the reverse
    return imgAlt.includes(desc);
  });

  if (partialMatch) {
    return partialMatch;
  }

  return null;
}

/**
 * Extract product features from BigCommerce custom fields and images
 * @param {BigCommerceCustomFields} customFields - BigCommerce custom fields
 * @returns {ProductFeaturesData} Transformed product features data
 */
/**
 * Create a product feature from flattened fields
 * @param {number} i - Feature index
 * @param {Record<string, string>} flattenedFields - Flattened custom fields
 * @param {Array<'normal' | 'reverse'>} layoutPattern - Layout pattern array
 * @returns {ProductFeature | null} Created feature or null if invalid
 */
function createFeature(
  i: number,
  flattenedFields: Record<string, string>,
  layoutPattern: Array<'normal' | 'reverse'>
): ProductFeature | null {
  const title = flattenedFields[`feature_${i}_title`];
  const description = flattenedFields[`feature_${i}_description`];
  
  if (!title || !description) {
    return null;
  }
  
  const imageDescriptor = flattenedFields[`feature_${i}_image_descriptor`];
  const imageUrl = flattenedFields[`feature_${i}_image_url`];
  const customAlt = flattenedFields[`feature_${i}_image_alt`];
  
  if (!imageDescriptor && !imageUrl) {
    return null;
  }
  
  const layoutIndex = (i - 1) % layoutPattern.length;
  
  return {
    title: title.trim(),
    description: description.trim(),
    imageDescriptor: imageDescriptor?.trim(),
    imageUrl: imageUrl?.trim(),
    imageAlt: customAlt || imageDescriptor?.trim() || `${title} feature image`,
    layout: layoutPattern[layoutIndex] || 'normal',
  };
}

export function productFeaturesTransformer(
  customFields: BigCommerceCustomFields,
): ProductFeaturesData {
  const flattenedFields = flattenCustomFields(customFields);
  const features: ProductFeature[] = [];
  
  // Parse layout pattern
  const layoutPattern = parseLayoutPattern(flattenedFields.feature_layout_pattern);
  
  // Extract up to 6 features (can be extended)
  for (let i = 1; i <= 6; i += 1) {
    const feature = createFeature(i, flattenedFields, layoutPattern);
    if (feature) {
      features.push(feature);
    }
  }
  
  return {
    features,
  };
}

/**
 * Resolve feature images by finding them in the product images array
 * This function should be called after productFeaturesTransformer to resolve image descriptors
 * @param {ProductFeaturesData} featuresData - Product features data with descriptors
 * @param {ProductImage[]} images - BigCommerce product images
 * @returns {ProductFeaturesData} Features data with resolved image URLs
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