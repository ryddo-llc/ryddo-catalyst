// Centralized configuration for Performance Comparison components

export interface WheelConfig {
  // Wheel positioning within the image
  centerX: number;
  centerY: number;
  radius: number;
  
  // Ring configuration
  ringSpacing: number;
  ringCount: number;
  
  // Animation settings
  pulseSpeed: number;
  
  // Visual settings
  baseColor: string;
  fadeColor: string;
  opacity: number;
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

export interface PerformanceComparisonConfig {
  wheel: WheelConfig;
  image: ImageConfig;
  performanceMetrics: {
    trackingMultiplier: number;
    zIndex: number;
    gapFromWheel: number;  // Gap from wheel edge to metrics center
    lineSpacing: number;   // Space between metrics
    barWidth: number;      // Progress bar width
    containerWidth: number; // Container width for metrics
    containerHeight: number; // Container height for metrics
    topOffset: number;     // Top offset for metrics container
  };
  disabledOnMobile: boolean;
}

// Default configurations for different bike types
export const DEFAULT_WHEEL_CONFIG: WheelConfig = {
  centerX: 750,
  centerY: 180,
  radius: 150,
  ringSpacing: 25,
  ringCount: 3,
  pulseSpeed: 2000,
  baseColor: '#FFD600',
  fadeColor: '#FFF59D',
  opacity: 0.7,
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
  offsetX: 0,  // No horizontal offset by default
  offsetY: 0,  // No vertical offset by default
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
      topOffset: 0,     // No top offset - align with wheel center
    },
  disabledOnMobile: true,
};

// Predefined configurations for different bike models
export const BIKE_CONFIGS = {
  'super73-rx': {
    wheel: {
      ...DEFAULT_WHEEL_CONFIG,
      centerX: 662,  // Wheel center X within 600px container
      centerY: 497,  // Wheel center Y within 600px container
      radius: 235,   // Wheel radius
    },
    image: {
      ...DEFAULT_IMAGE_CONFIG,
      src: '/images/backgrounds/S73-RX-RED-performance.webp',
      alt: 'SUPER73 RX Performance',
      maxWidth: 1800,
      maxHeight: 1000,
      containerScale: 1,
      offsetX: 0,  // Move bike image left within container
      offsetY: 0,     // No vertical offset
    },
    performanceMetrics: {
      trackingMultiplier: 0.3,
      zIndex: 3,
      gapFromWheel: 20,  // 20 pixels from wheel edge to metrics center
      lineSpacing: 48,   // Space between metrics
      barWidth: 350,     // Progress bar width
      containerWidth: 800, // Container width for metrics
      containerHeight: 1000, // Container height for metrics
      topOffset: 0,     // No top offset - align with wheel center
    },
    disabledOnMobile: true,
  },
  'eagle-pro': {
    wheel: {
      ...DEFAULT_WHEEL_CONFIG,
      centerX: 800,
      centerY: 200,
      radius: 160,
    },
    image: {
      ...DEFAULT_IMAGE_CONFIG,
      src: '/images/backgrounds/S73-RX-RED-performance.webp',
      alt: 'SUPER73 RX Performance',
      maxWidth: 1800,
      maxHeight: 1000,
      containerScale: 0.8,
      offsetX: 50,   // Custom offset for Eagle Pro
      offsetY: -20,  // Custom offset for Eagle Pro
    },
    performanceMetrics: {
      trackingMultiplier: 0.3,
      zIndex: 3,
      gapFromWheel: 20,
      lineSpacing: 48,   // Space between metrics
      barWidth: 350,     // Progress bar width
      containerWidth: 800, // Container width for metrics
      containerHeight: 1000, // Container height for metrics
      topOffset: 0,     // No top offset - align with wheel center
    },
    disabledOnMobile: true,
  },
  // Add more bike configurations as needed
} as const;

// Helper function to get configuration for a specific bike model
export function getBikeConfig(modelSlug?: string): PerformanceComparisonConfig {
  if (modelSlug && modelSlug in BIKE_CONFIGS) {
    return BIKE_CONFIGS[modelSlug as keyof typeof BIKE_CONFIGS];
  }
  return DEFAULT_PERFORMANCE_CONFIG;
}

// Helper function to get default wheel coordinates for Super73 RX
export function getSuper73RXWheelConfig() {
  return {
    centerX: 750,
    centerY: 180,
    radius: 150,
    ringSpacing: 25,
    ringCount: 3,
    pulseSpeed: 2000,
    baseColor: '#FFD600',
    fadeColor: '#FFF59D',
    opacity: 0.7,
  };
}

// Helper function to create custom configuration for any product
export function createProductConfig(options: {
  modelSlug?: string;
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
}): PerformanceComparisonConfig {
  const baseConfig = getBikeConfig(options.modelSlug);
  
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
  const baseTransform = imageConfig.containerTransform;
  const trackedTransform = baseTransform.replace(
    'translateX(calc(22vw - 625px))',
    `translateX(calc(22vw - 625px) * ${trackingMultiplier})`
  );
  return `${trackedTransform} scale(${imageConfig.containerScale})`;
}
