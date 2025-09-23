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
 * @param customFields - BigCommerce custom fields from GraphQL query
 * @returns Array of parsed feature objects
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
        const parsedFeature = JSON.parse(node.value) as ParsedFeature;

        // Validate that required fields exist
        if (parsedFeature.title && parsedFeature.desc && parsedFeature.img) {
          featureFields.push({ order, data: parsedFeature });
        } else {
          console.warn(`Invalid feature data in ${node.name}:`, parsedFeature);
        }
      } catch (error) {
        console.warn(`Failed to parse feature field ${node.name}:`, error);
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
 * @param features - Parsed features with img descriptors
 * @param images - BigCommerce product images
 * @returns Features with resolved imageUrl properties
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