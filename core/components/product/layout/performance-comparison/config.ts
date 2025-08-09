// Centralized configuration for Performance Comparison components

export interface WheelConfig {
  // Wheel positioning within the image
  centerX: number;
  centerY: number;
  radius: number;
  
  // Ring configuration
  ringSpacing: number;
  
  // Animation settings
  pulseSpeed: number;
  
  // Visual settings
  baseColor: string;
  edgeColor: string;
  opacity: number;
  
  // Mobile-specific adjustments
  mobileOffsetX?: number;  // Additional X offset for mobile positioning
  mobileOffsetY?: number;  // Additional Y offset for mobile positioning
}

export interface ImageConfig {
  // Image source
  src: string;
  alt: string;
  
  // Image dimensions
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
  
  // Container positioning
  containerTransform: string;
  containerScale: number;
  
  // Custom offset adjustments for each product image
  offsetX: number;  // Left/right offset adjustment
  offsetY: number;  // Top/bottom offset adjustment
  
  // Z-index layering
  zIndex: number;
}

export interface PerformanceMetricsConfig {
  trackingMultiplier: number;
  zIndex: number;
  gapFromWheel: number;  // Gap from wheel edge to metrics center
  lineSpacing: number;   // Space between metrics
  barWidth: number;      // Progress bar width
  containerWidth: number; // Container width for metrics
  containerHeight: number; // Container height for metrics
  topOffset: number;     // Top offset for metrics container
  curveRadiusMultiplier: number; // Multiplier for curve radius
}

export interface PerformanceComparisonConfig {
  wheel: WheelConfig;
  image: ImageConfig;
  performanceMetrics: PerformanceMetricsConfig;
  disabledOnMobile: boolean;
}

// Transform calculation constants
const TRANSFORM_BASE_VW = 22;
const TRANSFORM_BASE_PX = 625;

/**
 * Default wheel configuration optimized for standard bike layout
 * Position values are calibrated for typical product image dimensions
 */
export const DEFAULT_WHEEL_CONFIG: WheelConfig = {
  // Positioned for center-right wheel placement in standard 2200x1650 image
  centerX: 750,
  centerY: 180,
  radius: 150,
  ringSpacing: 35,
  pulseSpeed: 1750,
  baseColor: 'rgba(237, 216, 98, 0.1)',
  edgeColor: 'rgba(200, 180, 50, 0.5)',
  opacity: 1,
  mobileOffsetX: 0,
  mobileOffsetY: 0,
};

export const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  src: '/images/backgrounds/S73-RX-RED-performance.webp',
  alt: 'SUPER73 RX Performance',
  width: 2200,
  height: 1650,
  maxWidth: 1800,
  maxHeight: 1000,
  containerTransform: 'translateX(calc(22vw - 625px))',
  containerScale: 0.9,
  offsetX: 0,
  offsetY: 0,
  zIndex: 2,
};

export const DEFAULT_PERFORMANCE_CONFIG: PerformanceComparisonConfig = {
  wheel: DEFAULT_WHEEL_CONFIG,
  image: DEFAULT_IMAGE_CONFIG,
      performanceMetrics: {
      trackingMultiplier: 0.3,
      zIndex: 3,
      gapFromWheel: 20,  // 20 pixels from wheel edge to metrics center
      lineSpacing: 48,   // Space between metrics
      barWidth: 350,     // Progress bar width
      containerWidth: 800, // Container width for metrics
      containerHeight: 1000, // Container height for metrics
      topOffset: 0,     // Offset to align with wheel center
      curveRadiusMultiplier: 0.6, // Multiplier for curve radius
    },
  disabledOnMobile: true,
};

// Helper function to get default performance configuration
// The actual dynamic configuration is handled by the transformers:
// - performance-comparison-transformer.ts pulls wheel, image, and metrics config from custom fields
// - bike-product-transformer.ts handles product-specific wheel specs
// This approach eliminates the need to hardcode every bike model
export function getPerformanceConfig(): PerformanceComparisonConfig {
  return DEFAULT_PERFORMANCE_CONFIG;
}



export interface CreateProductConfigOptions {
  wheelCenterX?: number;
  wheelCenterY?: number;
  wheelRadius?: number;
  imageSrc?: string;
  imageAlt?: string;
  offsetX?: number;
  offsetY?: number;
  trackingMultiplier?: number;
  gapFromWheel?: number;
  lineSpacing?: number;
  barWidth?: number;
  containerWidth?: number;
  containerHeight?: number;
  topOffset?: number;
}

// Helper function to create custom configuration for any product
// This is primarily used for manual overrides. For fully dynamic configs from BigCommerce,
// use the performance-comparison-transformer.ts which reads from custom fields
export function createProductConfig(options: CreateProductConfigOptions): PerformanceComparisonConfig {
  const baseConfig = getPerformanceConfig();
  
  return {
    ...baseConfig,
    wheel: {
      ...baseConfig.wheel,
      centerX: options.wheelCenterX ?? baseConfig.wheel.centerX,
      centerY: options.wheelCenterY ?? baseConfig.wheel.centerY,
      radius: options.wheelRadius ?? baseConfig.wheel.radius,
    },
    image: {
      ...baseConfig.image,
      src: options.imageSrc ?? baseConfig.image.src,
      alt: options.imageAlt ?? baseConfig.image.alt,
      offsetX: options.offsetX ?? baseConfig.image.offsetX,
      offsetY: options.offsetY ?? baseConfig.image.offsetY,
    },
    performanceMetrics: {
      ...baseConfig.performanceMetrics,
      trackingMultiplier: options.trackingMultiplier ?? baseConfig.performanceMetrics.trackingMultiplier,
      gapFromWheel: options.gapFromWheel ?? baseConfig.performanceMetrics.gapFromWheel,
      lineSpacing: options.lineSpacing ?? baseConfig.performanceMetrics.lineSpacing,
      barWidth: options.barWidth ?? baseConfig.performanceMetrics.barWidth,
      containerWidth: options.containerWidth ?? baseConfig.performanceMetrics.containerWidth,
      containerHeight: options.containerHeight ?? baseConfig.performanceMetrics.containerHeight,
      topOffset: options.topOffset ?? baseConfig.performanceMetrics.topOffset,
    },
  };
}

// Helper function to calculate container transform with custom offsets
export function getContainerTransform(config: ImageConfig): string {
  const baseTransform = config.containerTransform;
  const offsetTransform = `translate(${config.offsetX}px, ${config.offsetY}px)`;

  return `${baseTransform} ${offsetTransform} scale(${config.containerScale})`;
}

// Helper function to calculate performance metrics transform with tracking
export function getPerformanceMetricsTransform(imageConfig: ImageConfig, trackingMultiplier: number): string {
  // Build transform string from constants
  const trackedTransform = `translateX(calc((${TRANSFORM_BASE_VW}vw - ${TRANSFORM_BASE_PX}px) * ${trackingMultiplier}))`;
  
  return `${trackedTransform} scale(${imageConfig.containerScale})`;
}
