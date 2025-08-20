import type { OptionalProductImage } from '~/lib/types';

export interface PerformanceMetric {
  category: string;
  label: string;
  value: string;
  percentage: number;
  sublabel: string;
}

export type ProductImage = OptionalProductImage;

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
