import type { ProductImage } from '~/lib/types';

/**
 * Find background image for product detail pages
 * Looks for images with background-related alt text, then falls back to position
 * @param {ProductImage[]} images - Array of product images
 * @returns {ProductImage | null} Background image or null if not found
 */
export function findBackgroundImage(images: ProductImage[]): ProductImage | null {
  if (!images.length) {
    return null;
  }

  // Try to find by alt text first
  const backgroundPatterns = ['background', 'hero-background', 'background-image'];
  
  const found = backgroundPatterns
    .map(pattern => images.find(img => 
      img.alt.toLowerCase().includes(pattern.toLowerCase())
    ))
    .find(Boolean);

  if (found) {
    return found;
  }

  // Fallback to position-based selection (current behavior)
  return images[1] || images[0] || null;
}

/**
 * Find hero product image (main product image for detail pages)
 * Looks for images with product-hero related alt text, then falls back to position
 * @param {ProductImage[]} images - Array of product images
 * @returns {ProductImage | null} Hero product image or null if not found
 */
export function findHeroProductImage(images: ProductImage[]): ProductImage | null {
  if (!images.length) {
    return null;
  }

  // Try to find by alt text first
  const heroPatterns = ['product-hero', 'main-product', 'hero-product'];
  
  const found = heroPatterns
    .map(pattern => images.find(img => 
      img.alt.toLowerCase().includes(pattern.toLowerCase())
    ))
    .find(Boolean);

  if (found) {
    return found;
  }

  // Fallback to position-based selection (current behavior)
  return images[2] || images[0] || null;
}

/**
 * Find showcase images for product showcase component
 * Looks for images with showcase- prefix, then falls back to position range
 * @param {ProductImage[]} images - Array of product images
 * @returns {ProductImage[]} Array of showcase images
 */
export function findShowcaseImages(images: ProductImage[]): ProductImage[] {
  if (!images.length) {
    return [];
  }

  // Try to find images by alt text pattern (showcase-1, showcase-2, etc.)
  // More flexible matching - look for 'showcase' anywhere in alt text
  const showcaseImages = images
    .filter(img => {
      const altText = img.alt.toLowerCase().trim();

      // Match 'showcase-1', 'showcase-2', etc. or just 'showcase' followed by number
      return altText.includes('showcase') && /showcase[-\s]*\d+/.test(altText);
    })
    .sort((a, b) => {
      // Extract number from alt text more flexibly
      const aMatch = /(\d+)/.exec(a.alt);
      const bMatch = /(\d+)/.exec(b.alt);
      
      if (aMatch?.[1] && bMatch?.[1]) {
        return parseInt(aMatch[1], 10) - parseInt(bMatch[1], 10);
      }
      
      return a.alt.localeCompare(b.alt);
    });

  if (showcaseImages.length > 0) {
    return showcaseImages;
  }

  // Fallback to position-based selection (current behavior: images 2-5)
  return images.slice(2, 6);
}

/**
 * Generic helper to find image by role/pattern
 * Useful for extending to other image types in the future
 * @param {ProductImage[]} images - Array of product images
 * @param {string} role - Role or pattern to search for
 * @returns {ProductImage | null} Image matching the role or null if not found
 */
export function findImageByRole(images: ProductImage[], role: string): ProductImage | null {
  if (!images.length) {
    return null;
  }

  return images.find(img => 
    img.alt.toLowerCase().includes(role.toLowerCase())
  ) || null;
}

/**
 * Find multiple images by role prefix
 * Useful for finding collections like gallery-1, gallery-2, etc.
 * @param {ProductImage[]} images - Array of product images
 * @param {string} prefix - Prefix to search for
 * @returns {ProductImage[]} Array of images matching the prefix
 */
export function findImagesByPrefix(images: ProductImage[], prefix: string): ProductImage[] {
  if (!images.length) {
    return [];
  }

  return images
    .filter(img => img.alt.toLowerCase().startsWith(prefix.toLowerCase()))
    .sort((a, b) => {
      // Try to extract number for sorting
      const aMatch = /(\d+)$/.exec(a.alt);
      const bMatch = /(\d+)$/.exec(b.alt);
      
      if (aMatch?.[1] && bMatch?.[1]) {
        return parseInt(aMatch[1], 10) - parseInt(bMatch[1], 10);
      }
      
      // Fallback to alphabetical sorting
      return a.alt.localeCompare(b.alt);
    });
}