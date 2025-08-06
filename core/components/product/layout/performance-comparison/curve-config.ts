// Centralized configuration for performance metrics curve calculations

export interface CurveConfig {
  // Container dimensions
  containerWidth: number;
  containerHeight: number;
  
  // Curve positioning
  curveRadius: number;
  curveCenterX: number;
  curveCenterY: number;
  
  // Metrics spacing and sizing
  lineSpacing: number;
  barWidth: number;
  
  // Y-axis adjustments for different elements
  labelYAdjust: number;
  barYAdjust: number;
  sublabelYAdjust: number;
  
  // Animation settings
  baseAnimationDelay: number;
  
  // Visual settings
  barHeight: number;
  barBorderRadius: number;
}

// Default curve configuration
export const DEFAULT_CURVE_CONFIG: CurveConfig = {
  containerWidth: 600,
  containerHeight: 600,
  curveRadius: 150,
  curveCenterX: 300,
  curveCenterY: 300,
  lineSpacing: 48,
  barWidth: 350,
  labelYAdjust: -16,
  barYAdjust: 0,
  sublabelYAdjust: 16,
  baseAnimationDelay: 150,
  barHeight: 8,
  barBorderRadius: 4,
};

// Helper function to calculate curve offset for positioning metrics around the wheel
export function getCurveOffset(
  index: number,
  total: number,
  yAdjust: number,
  config: CurveConfig,
  curveRadiusMultiplier = 0.6,
  gapFromWheel = 0
): number {
  // Calculate Y position based on index and spacing
  const y = config.curveCenterY - ((total - 1) / 2 - index) * config.lineSpacing + yAdjust;
  
  // Calculate X offset using circle equation: (x-h)² + (y-k)² = r²
  // Solving for x: x = h ± √(r² - (y-k)²)
  const yDiff = y - config.curveCenterY;
  
  // Adjust curve radius using the multiplier from BigCommerce
  const adjustedRadius = config.curveRadius * curveRadiusMultiplier;
  const dx = Math.sqrt(Math.max(0, adjustedRadius ** 2 - yDiff ** 2));
  
  // Return the X position (right side of the circle) plus the gap from wheel
  return config.curveCenterX + dx - config.barWidth + gapFromWheel;
}

// Helper function to get animation delay based on index
export function getAnimationDelay(index: number, config: CurveConfig): number {
  return index * config.baseAnimationDelay;
}

// Helper function to create curve configuration from wheel specs
export function createCurveConfigFromWheelSpecs(
  wheelSpecs: { centerX: number; centerY: number; radius: number; lineSpacing: number; barWidth: number }
): CurveConfig {
  return {
    ...DEFAULT_CURVE_CONFIG,
    curveRadius: wheelSpecs.radius,
    curveCenterX: wheelSpecs.centerX,
    curveCenterY: wheelSpecs.centerY,
    lineSpacing: wheelSpecs.lineSpacing,
    barWidth: wheelSpecs.barWidth,
  };
}

// Predefined curve configurations for different wheel sizes
export const CURVE_CONFIGS = {
  'small': {
    ...DEFAULT_CURVE_CONFIG,
    curveRadius: 100,
    lineSpacing: 32,
    barWidth: 250,
  },
  'medium': DEFAULT_CURVE_CONFIG,
  'large': {
    ...DEFAULT_CURVE_CONFIG,
    curveRadius: 200,
    lineSpacing: 64,
    barWidth: 450,
  },
} as const;

// Helper function to get curve configuration
export function getCurveConfig(size?: keyof typeof CURVE_CONFIGS): CurveConfig {
  if (size && size in CURVE_CONFIGS) {
    return CURVE_CONFIGS[size];
  }
  
  return DEFAULT_CURVE_CONFIG;
}
