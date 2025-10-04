/**
 * Code splitting utilities for better performance
 */

import { lazy } from 'react';

// Lazy load heavy components
export const LazyProductShowcase = lazy(() => 
  import('~/components/product-showcase').then(module => ({
    default: module.ProductShowcase
  }))
);

export const LazyPerformanceComparison = lazy(() => 
  import('~/components/product/layout/performance-comparison/performance-comparison').then(module => ({
    default: module.PerformanceComparison
  }))
);

export const LazyProductModal = lazy(() => 
  import('~/components/product/shared/product-modal').then(module => ({
    default: module.ProductModal
  }))
);

export const LazyRelatedProducts = lazy(() => 
  import('~/components/product/shared/related-products').then(module => ({
    default: module.default
  }))
);

/**
 * Preload critical components
 * @param {number} delay - Delay in milliseconds before preloading
 * @returns {void}
 */
export function preloadCriticalComponents(delay = 1000) {
  if (typeof window !== 'undefined') {
    // Preload critical components after initial load
    setTimeout(() => {
      void import('~/components/product-showcase');
      void import('~/components/product/layout/performance-comparison/performance-comparison');
    }, delay);
  }
}
