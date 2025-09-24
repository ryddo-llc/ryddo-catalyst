import { findImageByRole } from '~/lib/image-resolver';
import type { ProductImage } from '~/lib/types';

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

export interface ParsedFeature {
  title: string;
  desc: string;
  img: string;
  imageUrl?: string; // Resolved BigCommerce image URL
}

/**
 * Extract and parse feature custom fields from BigCommerce
 * @param {BigCommerceCustomFields} customFields - BigCommerce custom fields from GraphQL query
 * @returns {ParsedFeature[]} Array of parsed feature objects
 */
export function extractFeatureFields(customFields: BigCommerceCustomFields): ParsedFeature[] {
  if (!customFields.edges || customFields.edges.length === 0) {
    return [];
  }

  const features: ParsedFeature[] = [];
  const featureFields: Array<{ order: number; data: ParsedFeature }> = [];

  // Find and parse all feature fields
  customFields.edges.forEach(({ node }) => {
    if (node.name.startsWith('features_')) {
      try {
        // Extract the number from features_1, features_2, etc.
        const orderMatch = /features_(\d+)/.exec(node.name);
        const order = orderMatch?.[1] ? parseInt(orderMatch[1], 10) : 999;

        // Parse the JSON value
        const parsedFeature: ParsedFeature = JSON.parse(node.value);

        // Validate that required fields exist
        if (parsedFeature.title && parsedFeature.desc && parsedFeature.img) {
          featureFields.push({ order, data: parsedFeature });
        } else {
          // Invalid feature data - skip this feature
        }
      } catch {
        // Failed to parse feature field - skip this feature
      }
    }
  });

  // Sort by order and extract data
  featureFields
    .sort((a, b) => a.order - b.order)
    .forEach(({ data }) => {
      features.push(data);
    });

  return features;
}

/**
 * Resolve feature images for carousel format using existing image utilities
 * @param {ParsedFeature[]} features - Parsed features with img descriptors
 * @param {ProductImage[]} images - BigCommerce product images
 * @returns {ParsedFeature[]} Features with resolved imageUrl properties
 */
export function resolveCarouselImages(
  features: ParsedFeature[],
  images: ProductImage[]
): ParsedFeature[] {
  return features.map(feature => {
    const foundImage = findImageByRole(images, feature.img);

    return {
      ...feature,
      imageUrl: foundImage?.src || undefined
    };
  });
}