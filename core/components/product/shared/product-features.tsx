import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';
import type { ProductFeature, ProductFeaturesData } from '~/data-transformers/product-features-transformer';

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
function ProductFeatureItem({ feature }: ProductFeatureItemProps) {
  const isReverse = feature.layout === 'reverse';
  
  // Split title into two parts for styling (first word gets primary color)
  const titleWords = feature.title.split(' ');
  const firstWord = titleWords[0];
  const remainingWords = titleWords.slice(1).join(' ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-1">
      {/* Text Content */}
      <div
        className={`bg-white p-10 xl:p-12 2xl:p-16 flex flex-col justify-center items-center md:aspect-square ${
          isReverse ? 'md:order-2' : ''
        }`}
      >
        <div className="flex flex-col justify-start items-start max-w-md mx-auto md:mx-0 w-full">
          <h3 className="font-extrabold mb-1 sm:mb-2 text-[#F92F7B] leading-[0.9] text-[clamp(2rem,8vw,3rem)] xl:text-[clamp(2.5rem,10vw,4rem)]">
            {firstWord}
          </h3>
          {remainingWords ? (
            <h3 className="font-extrabold text-gray-900 mb-2 sm:mb-3 -mt-1 leading-[0.9] text-[clamp(2rem,8vw,3rem)] xl:text-[clamp(2.5rem,10vw,4rem)]">
              {remainingWords}
            </h3>
          ) : null}
          <p className="text-lg lg:text-xl xl:text-2xl text-gray-500 leading-relaxed pt-2 sm:pt-4 md:pt-6">
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
            className="object-cover object-center"
            fill
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
 * @returns {JSX.Element} A React component showing loading state
 */
function ProductFeatureItemSkeleton({ isReverse = false }: { isReverse?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Text Content Skeleton */}
      <div
        className={`bg-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 flex flex-col justify-center items-center md:aspect-square ${
          isReverse ? 'md:order-2' : ''
        }`}
      >
        <div className="flex flex-col justify-start items-start max-w-[min(90%,700px)] w-full">
          <Skeleton.Root pending>
            <Skeleton.Box className="h-6 sm:h-8 w-3/5 mb-1 sm:mb-2" />
            <Skeleton.Box className="h-6 sm:h-8 w-4/5 mb-2 sm:mb-3" />
            <div className="space-y-2 w-full pt-2 sm:pt-4 md:pt-6">
              <Skeleton.Box className="h-3 sm:h-4 w-full" />
              <Skeleton.Box className="h-3 sm:h-4 w-[85%]" />
              <Skeleton.Box className="h-3 sm:h-4 w-[70%]" />
            </div>
          </Skeleton.Root>
        </div>
      </div>

      {/* Image Skeleton */}
      <div
        className={`relative overflow-hidden md:aspect-square ${
          isReverse ? 'md:order-1' : ''
        }`}
      >
        <Skeleton.Root className="animate-pulse" pending>
          <Skeleton.Box className="w-full h-full bg-gray-300" />
        </Skeleton.Root>
      </div>
    </div>
  );
}

/**
 * Skeleton loading component for product features section
 * @returns {JSX.Element} A React component showing loading state
 */
export function ProductFeaturesSkeleton() {
  return (
    <div className="w-full bg-gray-50">
      <div className="w-full">
        <ProductFeatureItemSkeleton />
        <ProductFeatureItemSkeleton isReverse />
        <ProductFeatureItemSkeleton />
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
    <section
      className={`w-full bg-gray-50 font-[family-name:var(--product-features-font-family,var(--font-family-body))] ${className}`}
    >
      <div className="w-full">
        <Stream
          fallback={<ProductFeaturesSkeleton />}
          value={features}
        >
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
    </section>
  );
}

export type { ProductFeaturesProps, ProductFeature, ProductFeaturesData };