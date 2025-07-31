export interface PerformanceMetric {
  category: string;
  label: string;
  value: string;
  percentage: number;
  sublabel: string;
}

export interface WheelSpecs {
  centerX: number;
  centerY: number;
  radius: number;
  lineSpacing: number;
  barWidth: number;
}

export interface ProductImage {
  src?: string;
  alt?: string;
  wheelSpecs?: WheelSpecs;
  wheelConfig?: {
    centerX: number;
    centerY: number;
    radius: number;
    ringSpacing: number;
    ringCount: number;
    pulseSpeed: number;
    baseColor: string;
    fadeColor: string;
    opacity: number;
  };
}

export interface PerformanceComparisonProps {
  productTitle: string;
  productImage: ProductImage;
  metrics: PerformanceMetric[];
  animationConfig?: {
    duration?: number;
    delay?: number;
    easing?: string;
  };
  className?: string;
}
