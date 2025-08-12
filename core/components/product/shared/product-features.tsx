import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';
import type { ProductFeature, ProductFeaturesData } from '~/data-transformers/product-features-transformer';

interface ProductFeaturesProps {
  features: Streamable<ProductFeaturesData | null>;
  className?: string;
  emptyStateMessage?: string;
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
  
  // Split title into parts for styling (first word gets primary color, second word too if first is "A")
  const titleWords = feature.title.split(' ');
  const firstWord = titleWords[0] || '';
  const secondWord = titleWords[1];
  const remainingWords = titleWords.slice(2).join(' ');
  
  // Determine which words should be pink
  const shouldSecondWordBePink = firstWord.toLowerCase() === 'a' && secondWord;
  const pinkWords = shouldSecondWordBePink ? `${firstWord} ${secondWord}` : firstWord;
  const grayWords = shouldSecondWordBePink ? remainingWords : titleWords.slice(1).join(' ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-1">
      {/* Text Content */}
      <div
        className={`bg-white p-10 xl:p-12 2xl:p-16 flex flex-col justify-center items-center md:h-full ${
          isReverse ? 'md:order-2' : ''
        }`}
      >
        <div className="flex flex-col justify-start items-start max-w-md mx-auto md:mx-0 w-full">
          <h3 className="font-extrabold leading-[0.9] text-[clamp(2rem,8vw,3rem)] xl:text-[clamp(2.5rem,10vw,4rem)]">
            <span className="block mb-1 sm:mb-2 text-[#F92F7B]">{pinkWords}</span>
            {grayWords ? (
              <span className="block text-gray-900 mb-2 sm:mb-3 -mt-1">{grayWords}</span>
            ) : null}
          </h3>
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
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-1">
      {/* Text Content Skeleton */}
      <div
        className={`bg-white p-10 xl:p-12 2xl:p-16 flex flex-col justify-center items-center md:h-full ${
          isReverse ? 'md:order-2' : ''
        }`}
      >
        <div className="flex flex-col justify-start items-start max-w-md mx-auto md:mx-0 w-full">
          <Skeleton.Root pending>
            <Skeleton.Box className="h-8 sm:h-10 w-3/5 mb-1 sm:mb-2" />
            <Skeleton.Box className="h-8 sm:h-10 w-4/5 mb-2 sm:mb-3" />
            <div className="space-y-2 w-full pt-2 sm:pt-4 md:pt-6">
              <Skeleton.Box className="h-4 sm:h-5 w-full" />
              <Skeleton.Box className="h-4 sm:h-5 w-[85%]" />
              <Skeleton.Box className="h-4 sm:h-5 w-[70%]" />
            </div>
          </Skeleton.Root>
        </div>
      </div>

      {/* Image Skeleton */}
      <div
        className={`bg-black relative overflow-hidden aspect-square ${
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
export function ProductFeatures({ features, className = '', emptyStateMessage = 'No features found' }: ProductFeaturesProps) {
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
            if (!featuresData) return null;
            
            if (featuresData.features.length === 0) {
              return (
                <div className="relative flex h-[50vh] items-center justify-center text-gray-500">
                  {emptyStateMessage}
                </div>
              );
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