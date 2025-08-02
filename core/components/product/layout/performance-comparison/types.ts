export interface PerformanceMetric {
  category: string;
  label: string;
  value: string;
  percentage: number;
  sublabel: string;
}

export interface ProductImage {
  src?: string;
  alt?: string;
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
