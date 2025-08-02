import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ProductShowcase } from '~/components/product-showcase';

import Addons from '../layout/addons';
import { getBikeConfig } from '../layout/performance-comparison/config';
import { PerformanceComparison } from '../layout/performance-comparison/performance-comparison';
import { BaseProductDetailProduct, PerformanceComparisonSkeleton } from '../layout/product-detail-layout';

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
          <div className={className}>
            <PerformanceComparison
              config={getBikeConfig('super73-rx')}
              metrics={[
                {
                  category: 'range',
                  label: 'Maximum Range',
                  percentage: 85,
                  sublabel: '960 watt-hours, 21700 cells',
                  value: '45+ Miles (pedal assist*)',
                },
                {
                  category: 'power',
                  label: 'Power',
                  percentage: 100,
                  sublabel: '48V Motor: 2,000W peak',
                  value: '2,000 Watts',
                },
                {
                  category: 'speed',
                  label: 'Top Speed',
                  percentage: 88,
                  sublabel: 'Based on ideal conditions',
                  value: '28+ mph',
                },
                {
                  category: 'brakes',
                  label: 'Braking Power',
                  percentage: 90,
                  sublabel: 'Quad Piston Hydraulic',
                  value: '90%',
                },
                {
                  category: 'portability',
                  label: 'Portability',
                  percentage: 50,
                  sublabel: 'Weight & Portability',
                  value: '50%',
                },
                {
                  category: 'comfort',
                  label: 'Comfort',
                  percentage: 85,
                  sublabel: 'Suspension + Position + Seat',
                  value: '85%',
                },
                {
                  category: 'tech',
                  label: 'Tech Features',
                  percentage: 75,
                  sublabel: 'Apps, Lighting, Navigation, Electrical',
                  value: '75%',
                },
              ]}
              productImage={{
                // Use hardcoded image for now, will be replaced with BigCommerce data later
                src: '/images/backgrounds/S73-RX-RED-performance.webp',
                alt: 'SUPER73 RX Performance',
              }}
              productTitle={productData.title}
            />
          </div>
        )
      }
    </Stream>
  );
}
