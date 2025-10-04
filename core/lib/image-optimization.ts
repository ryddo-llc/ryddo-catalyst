/**
 * Image optimization utilities for better Core Web Vitals
 */

export interface ImageOptimizationConfig {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

/**
 * Generate optimized image URL with BigCommerce parameters
 * @param {string} baseUrl - The base image URL to optimize
 * @param {ImageOptimizationConfig} config - Optimization configuration options
 * @returns {string} Optimized image URL with BigCommerce parameters
 */
export function getOptimizedImageUrl(
  baseUrl: string,
  config: ImageOptimizationConfig = {}
): string {
  try {
    const {
      quality = 85,
      format = 'webp',
      width,
      height,
    } = config;

    const url = new URL(baseUrl);
    
    // Add BigCommerce optimization parameters
    url.searchParams.set('compression', 'lossy');
    url.searchParams.set('quality', quality.toString());
    
    if (format !== 'jpeg' && format !== 'png') {
      url.searchParams.set('format', format);
    }
    
    if (width) {
      url.searchParams.set('width', width.toString());
    }
    
    if (height) {
      url.searchParams.set('height', height.toString());
    }

    return url.toString();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Invalid image URL:', baseUrl, error);

    return baseUrl;
  }
}

/**
 * Generate responsive image srcSet for different screen sizes
 * @param {string} baseUrl - The base image URL to generate srcSet for
 * @param {number[]} sizes - Array of image sizes to generate
 * @returns {string} Responsive srcSet string for different screen sizes
 */
export function generateResponsiveSrcSet(
  baseUrl: string,
  sizes: number[] = [640, 768, 1024, 1280, 1920]
): string {
  return sizes
    .map(size => {
      const optimizedUrl = getOptimizedImageUrl(baseUrl, {
        width: size,
        quality: size <= 768 ? 80 : 85, // Lower quality for mobile
      });
      
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Get appropriate sizes attribute for responsive images
 * @param {'mobile' | 'tablet' | 'desktop'} breakpoint - The breakpoint to get sizes for
 * @returns {string} Sizes attribute string for responsive images
 */
export function getResponsiveSizes(breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop'): string {
  switch (breakpoint) {
    case 'mobile':
      return '100vw';

    case 'tablet':
      return '(max-width: 1200px) 100vw, 50vw';

    case 'desktop':
      return '33vw';

    default:
      return '100vw';
  }
}

/**
 * Generate blur placeholder for images (server-side)
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @returns {string} Base64 encoded SVG placeholder
 */
export function generateBlurPlaceholder(width = 10, height = 10): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate client-safe blur placeholder for images
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @returns {string} Data URL SVG placeholder
 */
export function generateClientBlurPlaceholder(width = 10, height = 10): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/></svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Check if image should be prioritized (above the fold)
 * @param {number} index - The index of the image
 * @returns {boolean} Whether the image should be prioritized
 */
export function shouldPrioritizeImage(index: number): boolean {
  return index < 2; // First 2 images should be prioritized
}

/**
 * Get optimal image configuration based on context
 * @param {'showcase' | 'gallery' | 'thumbnail'} context - The image context
 * @param {number} index - The index of the image
 * @returns {ImageOptimizationConfig} Image optimization configuration
 */
export function getImageConfig(
  context: 'showcase' | 'gallery' | 'thumbnail',
  index = 0
): ImageOptimizationConfig {
  const isAboveFold = shouldPrioritizeImage(index);
  
  switch (context) {
    case 'showcase':
      return {
        quality: 90,
        format: 'webp',
        priority: isAboveFold,
        loading: isAboveFold ? 'eager' : 'lazy',
      };

    case 'gallery':
      return {
        quality: 85,
        format: 'webp',
        priority: false,
        loading: 'lazy',
      };

    case 'thumbnail':
      return {
        quality: 75,
        format: 'webp',
        width: 300,
        height: 300,
        priority: false,
        loading: 'lazy',
      };

    default:
      return {
        quality: 85,
        format: 'webp',
        priority: false,
        loading: 'lazy',
      };
  }
}
