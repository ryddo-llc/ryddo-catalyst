// Export all performance comparison components and utilities

export { PerformanceComparison } from './PerformanceComparison';
export { PerformanceMetrics } from './PerformanceMetrics';
export { PulseRings } from './PulseRings';

// Export types
export type { PerformanceMetric, WheelSpecs, ProductImage, PerformanceComparisonProps } from './types';

// Export configuration
export { 
  getBikeConfig, 
  getSuper73RXWheelConfig, 
  createProductConfig,
  getContainerTransform,
  getPerformanceMetricsTransform,
  type PerformanceComparisonConfig,
  type WheelConfig,
  type ImageConfig
} from './config';

// Export curve utilities
export { 
  getCurveOffset, 
  getAnimationDelay, 
  createCurveConfigFromWheelSpecs,
  getCurveConfig,
  type CurveConfig
} from './curve-config';
