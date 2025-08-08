import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import type { TransformedPerformanceData } from '~/data-transformers/performance-comparison-transformer';

import type { PerformanceComparisonConfig } from './config';
import { PerformanceComparison } from './performance-comparison';
import { PerformanceComparisonSkeleton } from './performance-comparison-skeleton';
import type { PerformanceComparisonProps } from './types';

interface PerformanceComparisonStreamableProps {
  productTitle: Streamable<string>;
  productImage: Streamable<PerformanceComparisonProps['productImage']>;
  metrics: Streamable<PerformanceComparisonProps['metrics']>;
  className?: string;
  config?: PerformanceComparisonConfig;
  dynamicData?: Streamable<TransformedPerformanceData>;
}

export function PerformanceComparisonStreamable({
  productTitle,
  productImage,
  metrics,
  className = '',
  config,
  dynamicData,
}: PerformanceComparisonStreamableProps) {
  return (
    <Stream 
      fallback={<PerformanceComparisonSkeleton />} 
      value={Streamable.all([productTitle, productImage, metrics, dynamicData || Streamable.from(() => Promise.resolve(null))])}
    >
      {([title, image, metricsData, dynamicDataResolved]) => (
        <PerformanceComparison
          className={className}
          config={config}
          dynamicData={dynamicDataResolved || undefined}
          metrics={metricsData}
          productImage={image}
          productTitle={title}
        />
      )}
    </Stream>
  );
} 