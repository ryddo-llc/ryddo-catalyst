'use client';

import { clsx } from 'clsx';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useId, useMemo, useState } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Carousel, CarouselContent, CarouselItem } from '@/vibes/soul/primitives/carousel';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';
import { generateClientBlurPlaceholder, getImageConfig } from '~/lib/image-optimization';
import { findShowcaseImages } from '~/lib/image-resolver';
import type { ProductImage } from '~/lib/types';

export type { ProductImage } from '~/lib/types';

// Utility function for alternating word styling
const getAlternatingWordClass = (wordIndex: number, baseSpacing = true) => {
  const colorClass = wordIndex % 2 === 0 ? 'text-white' : 'text-[#F92F7B]';
  const spacingClass = baseSpacing && wordIndex > 0 ? '-mt-2 sm:-mt-3 md:-mt-4' : '';

  return `block ${colorClass} ${spacingClass}`;
};

// Utility function for video MIME type detection
const getVideoMimeType = (src: string) => {
  if (/\.mp4$/i.test(src)) return 'video/mp4';
  if (/\.webm$/i.test(src)) return 'video/webm';
  if (/\.ogg$/i.test(src)) return 'video/ogg';

  return undefined;
};

export interface ProductShowcaseProps {
  images: Streamable<ProductImage[]>;
  className?: string;
  'aria-labelledby'?: string;
  previousLabel?: string;
  nextLabel?: string;
  productName?: string;
  showcaseDescription?: string;
}

function ProductShowcaseSkeleton() {
  return (
    <div className="max-w-8xl relative flex w-full items-center justify-center">
      <Skeleton.Root className="animate-pulse" pending>
        <div className="aspect-[5/3] h-auto max-h-[60vh] w-full overflow-hidden">
          <Skeleton.Box className="h-full w-full" />
        </div>
      </Skeleton.Root>

      {/* Navigation buttons skeleton */}
      <div className="absolute left-6 top-1/2 z-20 -translate-y-1/2">
        <Skeleton.Box className="h-12 w-12 rounded-lg" />
      </div>
      <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2">
        <Skeleton.Box className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductShowcase({
  images,
  className,
  'aria-labelledby': ariaLabelledBy,
  previousLabel = 'Previous image',
  nextLabel = 'Next image',
  productName,
  showcaseDescription,
}: ProductShowcaseProps) {
  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1]>();
  const headingId = useId();
  const sectionLabelId = ariaLabelledBy ?? (showcaseDescription ? headingId : undefined);

  // Debounced navigation functions to prevent rapid clicking issues
  const handlePrevious = useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollPrev();
  }, [carouselApi]);

  const handleNext = useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollNext();
  }, [carouselApi]);

  // Memoize text splitting to prevent re-computation on every render
  const textWords = useMemo(() => showcaseDescription?.split(' ') || [], [showcaseDescription]);

  return (
    <>
      {/* content/item spacing already controlled via utility classes */}
      <section
        aria-labelledby={sectionLabelId}
        className={clsx(
          'relative m-0 flex w-full items-center justify-center overflow-hidden bg-white p-0',
          className,
        )}
        style={{
          width: '100dvw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          maxWidth: 'none',
        }}
      >
        {/* Retro Orange Stripe Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-8 w-full bg-cover bg-center bg-no-repeat"
          role="presentation"
          style={{
            backgroundImage: 'url("/images/backgrounds/orange_retro_stripe.png")',
            backgroundSize: '100% 100%',
            width: '100dvw',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Main carousel content */}
        {showcaseDescription ? (
          <h2 className="sr-only" id={headingId}>
            {showcaseDescription}
          </h2>
        ) : null}
        <Stream fallback={<ProductShowcaseSkeleton />} value={images}>
          {(imagesData) => {
            if (imagesData.length === 0) {
              return (
                <div className="relative z-10 flex h-[50vh] items-center justify-center text-gray-500">
                  No images found
                </div>
              );
            }

            // Use smart image resolution for showcase images
            const showcaseImages = findShowcaseImages(imagesData);

            if (showcaseImages.length === 0) {
              return (
                <div className="relative z-10 flex h-[50vh] items-center justify-center text-gray-500">
                  No showcase images available. Available images:{' '}
                  {imagesData
                    .map((img) => img.alt)
                    .filter(Boolean)
                    .join(', ')}
                </div>
              );
            }

            return (
              <Carousel
                className="relative flex w-full items-center justify-center"
                opts={{
                  align: 'center',
                  loop: true,
                  dragFree: false,
                  containScroll: 'trimSnaps',
                }}
                setApi={setCarouselApi}
              >
                <CarouselContent
                  className="carousel-content ml-0 w-full"
                  style={{ marginInlineStart: 0, marginLeft: 0 }}
                >
                  {showcaseImages.map((image, index) => {
                    const imageConfig = getImageConfig('showcase', index, showcaseImages.length);
                    
                    return (
                    <CarouselItem
                      className="carousel-item relative flex w-full basis-full items-center justify-center p-0 pl-0"
                      key={image.src}
                      style={{
                        width: '100dvw',
                        paddingLeft: 0,
                        paddingRight: 0,
                        marginLeft: 0,
                        marginRight: 0,
                      }}
                    >
                      <div className="relative h-[100svh] max-h-[900px] w-full">
                        {/\.(mp4|webm|ogg)$/i.test(image.src) ? (
                          <video
                            aria-label={productName ? `${productName} video` : 'Product video'}
                            className="h-full w-full object-cover"
                            controls
                            muted
                            playsInline
                            preload="metadata"
                            style={{ width: '100%', height: '100%' }}
                          >
                            <source src={image.src} type={getVideoMimeType(image.src)} />
                            {/* <track kind="captions" src={image.captionsSrc} srcLang="en" label="English" default /> */}
                          </video>
                        ) : (
                          <Image
                            alt={`${productName} showcase image ${index + 1} of ${showcaseImages.length}${image.alt ? ` - ${image.alt}` : ''}`}
                            blurDataURL={generateClientBlurPlaceholder()}
                            className="h-full w-full object-cover"
                            fill
                            loading={imageConfig.loading}
                            placeholder="blur"
                            priority={imageConfig.priority}
                            quality={imageConfig.quality}
                            sizes="100vw"
                            src={image.src}
                          />
                        )}

                        {/* Showcase Description Text Overlay */}
                        {showcaseDescription ? (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-32 left-4 z-20 sm:left-8 md:left-16 lg:left-24 xl:left-32"
                          >
                            <div className="text-left">
                              <h2 className="font-kanit text-3xl font-black italic leading-none sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                                {textWords.map((word, wordIndex) => (
                                  <span
                                    className={getAlternatingWordClass(wordIndex)}
                                    key={wordIndex}
                                  >
                                    {word}
                                  </span>
                                ))}
                              </h2>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </CarouselItem>
                    );
                  })}
                </CarouselContent>

                {/* Left Button */}
                <div className="absolute left-2 top-[45%] z-30 -translate-y-1/2 sm:left-4 md:left-8 lg:left-12 xl:left-16">
                  <button
                    aria-disabled={!carouselApi || showcaseImages.length <= 1}
                    aria-label={previousLabel}
                    className="flex h-24 w-24 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 active:scale-95 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40"
                    disabled={!carouselApi || showcaseImages.length <= 1}
                    onClick={handlePrevious}
                    type="button"
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain"
                      height={200}
                      loading="lazy"
                      src="/images/backgrounds/arrow_3_left.png"
                      width={200}
                    />
                  </button>
                </div>

                {/* Right Button */}
                <div className="absolute right-2 top-[45%] z-30 -translate-y-1/2 sm:right-4 md:right-8 lg:right-12 xl:right-16">
                  <button
                    aria-disabled={!carouselApi || showcaseImages.length <= 1}
                    aria-label={nextLabel}
                    className="flex h-24 w-24 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 active:scale-95 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40"
                    disabled={!carouselApi || showcaseImages.length <= 1}
                    onClick={handleNext}
                    type="button"
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain"
                      height={200}
                      loading="lazy"
                      src="/images/backgrounds/arrow_3_right.png"
                      width={200}
                    />
                  </button>
                </div>
              </Carousel>
            );
          }}
        </Stream>
      </section>
    </>
  );
}
