import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';
import type { ProductFeature, ProductFeaturesData } from '~/data-transformers/product-features-transformer';

import styles from './product-features.module.css';

interface ProductFeaturesProps {
  features: Streamable<ProductFeaturesData | null>;
  className?: string;
}

interface ProductFeatureItemProps {
  feature: ProductFeature;
  index: number;
}

/**
 * Individual feature item component that displays a product feature with image and text
 * @param {ProductFeature} feature - The feature data to display
 * @param {number} index - The index of the feature in the list
 * @returns {JSX.Element} A React component displaying the feature
 */
function ProductFeatureItem({ feature, index }: ProductFeatureItemProps) {
  const isReverse = feature.layout === 'reverse';
  
  // Split title into two parts for styling (first word gets primary color)
  const titleWords = feature.title.split(' ');
  const firstWord = titleWords[0];
  const remainingWords = titleWords.slice(1).join(' ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px]">
      {/* Text Content */}
      <div
        className={`bg-white p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-32 flex flex-col justify-center items-center ${
          isReverse ? 'md:order-2' : ''
        }`}
        style={{ containerType: 'inline-size' }}
      >
        <div 
          className="flex flex-col justify-start items-start"
          style={{
            maxWidth: 'min(90%, 700px)'
          }}
        >
          <h3 className={styles.featureTitlePrimary}>
            {firstWord}
          </h3>
                      {remainingWords ? (
            <h3 className={styles.featureTitleSecondary}>
              {remainingWords}
            </h3>
          ) : null}
          <p className="text-lg sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-500 leading-relaxed pt-4 sm:pt-6">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Image */}
      <div
        className={`bg-black relative overflow-hidden aspect-square ${
          isReverse ? 'md:order-1' : ''
        }`}
      >
        {feature.imageUrl ? (
          <Image
            alt={feature.imageAlt}
            className="object-cover"
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            src={feature.imageUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
            <span className="text-sm">
              Image not found: {feature.imageDescriptor || 'No image specified'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton loading component for product features
 * @param {number} count - Number of skeleton items to display
 * @returns {JSX.Element} A React component showing loading state
 */
export function ProductFeaturesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full bg-gray-50">
      <div className="w-full">
        {Array.from({ length: count }, (_, index) => (
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px]" key={index}>
            {/* Text Content Skeleton */}
            <div
              className={`bg-white p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-32 flex flex-col justify-center items-center ${
                index % 2 === 1 ? 'md:order-2' : ''
              }`}
            >
              <div 
                className="flex flex-col justify-start items-start"
                style={{
                  maxWidth: 'min(90%, 700px)'
                }}
              >
                <Skeleton.Root pending>
                  <div className="h-8 bg-gray-300 mb-2" style={{ width: '60%' }} />
                  <div className="h-8 bg-gray-300 mb-3" style={{ width: '80%' }} />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 w-full" />
                    <div className="h-4 bg-gray-300" style={{ width: '85%' }} />
                    <div className="h-4 bg-gray-300" style={{ width: '70%' }} />
                  </div>
                </Skeleton.Root>
              </div>
            </div>

            {/* Image Skeleton */}
            <div
              className={`bg-gray-300 relative overflow-hidden aspect-square ${
                index % 2 === 1 ? 'md:order-1' : ''
              }`}
            >
              <Skeleton.Root pending>
                <Skeleton.Box className="w-full h-full" />
              </Skeleton.Root>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main ProductFeatures component
 * 
 * Displays a series of product features in an alternating two-column layout.
 * Features are loaded from BigCommerce custom fields and rendered with the Stream pattern.
 * 
 * @param {Streamable<ProductFeaturesData | null>} features - Product features data from BigCommerce
 * @param {string} className - Optional additional CSS classes
 * @returns {JSX.Element} A React component displaying product features
 */
export function ProductFeatures({ features, className = '' }: ProductFeaturesProps) {
  return (
    <div className={`w-full bg-gray-50 ${className}`}>
      <div className="w-full">
        <Stream fallback={<ProductFeaturesSkeleton />} value={features}>
          {(featuresData) => {
            if (!featuresData?.features.length) {
              return null;
            }

            return (
              <>
                {featuresData.features.map((feature, index) => (
                  <ProductFeatureItem
                    feature={feature}
                    index={index}
                    key={`feature-${index}`}
                  />
                ))}
              </>
            );
          }}
        </Stream>
      </div>
    </div>
  );
}

export type { ProductFeaturesProps, ProductFeature, ProductFeaturesData };