import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ProductShowcase } from '~/components/product-showcase';

import Addons from '../layout/addons';
import { BaseProductDetailProduct } from '../layout/product-detail-layout';
import { PerformanceComparison } from '../layout/performance-comparison';
import type { PerformanceMetric } from '../layout/performance-comparison/types';
import { PerformanceComparisonSkeleton } from '../layout/product-detail-layout';
import { getSuper73RXWheelConfig, getBikeConfig } from '../layout/performance-comparison/config';

// Shared Addons Section - now uses related products instead of separate call
export function ProductAddonsSection({
  product,
  relatedProducts,
  className,
}: {
  product: Streamable<BaseProductDetailProduct | null>;
  relatedProducts: Streamable<
    Array<{ id: string; title: string; href: string; image?: { src: string; alt: string } }>
  >;
  className?: string;
}) {
  return (
    <div className={className}>
      <Stream fallback={null} value={product}>
        {(productData) =>
          productData ? <Addons addons={relatedProducts} name={productData.title} /> : null
        }
      </Stream>
    </div>
  );
}

// Shared ProductShowcase Section
export function ProductShowcaseSection({
  product,
  className,
}: {
  product: Streamable<BaseProductDetailProduct | null>;
  className?: string;
}) {
  return (
    <div className={clsx('w-full', className)}>
      <Stream fallback={null} value={product}>
        {(productData) =>
          productData ? (
            <div>
              <ProductShowcase
                aria-labelledby="product-images-heading"
                images={productData.images}
                productName={productData.title}
              />
            </div>
          ) : null
        }
      </Stream>
    </div>
  );
}

export function PerformanceComparisonSection({
  product,
  className = '',
}: {
  product: Streamable<BaseProductDetailProduct | null>;
  className?: string;
}) {
  return (
    <Stream fallback={<PerformanceComparisonSkeleton />} value={product}>
      {(productData) => 
        productData && (
          <Stream fallback={<PerformanceComparisonSkeleton />} value={productData.images}>
            {(images) => (
              <div className={className}>
                <PerformanceComparison
                  productTitle={productData.title}
                  productImage={{
                    // Use hardcoded image for now, will be replaced with BigCommerce data later
                    src: '/images/backgrounds/S73-RX-RED-performance.webp',
                    alt: 'SUPER73 RX Performance',
                    wheelSpecs: productData.wheelPositioning ? {
                      centerX: productData.wheelPositioning.centerX,
                      centerY: productData.wheelPositioning.centerY,
                      radius: productData.wheelPositioning.radius,
                      lineSpacing: 48,
                      barWidth: 350,
                    } : undefined,
                    wheelConfig: productData.wheelPositioning ? {
                      centerX: productData.wheelPositioning.centerX,
                      centerY: productData.wheelPositioning.centerY,
                      radius: productData.wheelPositioning.radius,
                      ringSpacing: 25,
                      ringCount: 3,
                      pulseSpeed: 2000,
                      baseColor: '#FFD600',
                      fadeColor: '#FFF59D',
                      opacity: 0.7,
                    } : getSuper73RXWheelConfig()
                  }}
                  config={getBikeConfig('super73-rx')}
                  metrics={[
                    {
                      category: 'range',
                      label: 'Maximum Range',
                      value: '45+ Miles (pedal assist*)',
                      percentage: 85,
                      sublabel: '960 watt-hours, 21700 cells',
                    },
                    {
                      category: 'power',
                      label: 'Power',
                      value: '2,000 Watts',
                      percentage: 100,
                      sublabel: '48V Motor: 2,000W peak',
                    },
                    {
                      category: 'speed',
                      label: 'Top Speed',
                      value: '28+ mph',
                      percentage: 88,
                      sublabel: 'Based on ideal conditions',
                    },
                    {
                      category: 'brakes',
                      label: 'Breaking Power',
                      value: '90%',
                      percentage: 90,
                      sublabel: 'Quad Piston Hydraulic',
                    },
                    {
                      category: 'portability',
                      label: 'Portability',
                      value: '50%',
                      percentage: 50,
                      sublabel: 'Weight & Portability',
                    },
                    {
                      category: 'comfort',
                      label: 'Comfort',
                      value: '85%',
                      sublabel: 'Suspension + Position + Seat',
                    },
                    {
                      category: 'tech',
                      label: 'Tech Features',
                      value: '75%',
                      percentage: 75,
                      sublabel: 'Apps, Lighting, Navigation, Electrical',
                    },
                  ]}
                />
              </div>
            )}
          </Stream>
        )
      }
    </Stream>
  );
}
