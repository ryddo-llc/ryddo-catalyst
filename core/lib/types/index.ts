/**
 * Shared type definitions for the application
 */

/**
 * Standard product image interface with required properties
 */
export interface ProductImage {
  src: string;
  alt: string;
}

/**
 * Optional product image interface for cases where properties may be undefined
 * Used in performance comparison and other optional contexts
 */
export interface OptionalProductImage {
  src?: string;
  alt?: string;
}