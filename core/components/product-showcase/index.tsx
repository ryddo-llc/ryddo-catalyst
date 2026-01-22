'use client';

import { clsx } from 'clsx';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useId, useMemo, useState } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Carousel, CarouselContent, CarouselItem } from '@/vibes/soul/primitives/carousel';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';
import { SectionContainer } from '~/components/section-container';
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
      {showcaseDescription ? (
        <h2 className="sr-only" id={headingId}>
          {showcaseDescription}
        </h2>
      ) : null}
      <Stream fallback={<ProductShowcaseSkeleton />} value={images}>
        {(imagesData) => {
          if (imagesData.length === 0) {
            return (
              <SectionContainer>
                <SectionContainer.Outer
                  aria-labelledby={sectionLabelId}
                  innerPadding="px-1 @xl:px-1 @4xl:px-2"
                  padding="py-6 md:py-10 lg:py-14"
                  radius={30}
                  rounded="all"
                >
                  <SectionContainer.Inner bgColor="bg-gray-100" radius={30}>
                    <div className="relative z-10 flex h-[50vh] items-center justify-center text-gray-500">
                      No images found
                    </div>
                  </SectionContainer.Inner>
                </SectionContainer.Outer>
              </SectionContainer>
            );
          }

          // Use smart image resolution for showcase images
          const showcaseImages = findShowcaseImages(imagesData);

          if (showcaseImages.length === 0) {
            return (
              <SectionContainer>
                <SectionContainer.Outer
                  aria-labelledby={sectionLabelId}
                  innerPadding="px-1 @xl:px-1 @4xl:px-2"
                  padding="py-6 md:py-10 lg:py-14"
                  radius={30}
                  rounded="all"
                >
                  <SectionContainer.Inner bgColor="bg-gray-100" radius={30}>
                    <div className="relative z-10 flex h-[50vh] items-center justify-center text-gray-500">
                      No showcase images available. Available images:{' '}
                      {imagesData
                        .map((img) => img.alt)
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </SectionContainer.Inner>
                </SectionContainer.Outer>
              </SectionContainer>
            );
          }

          return (
            <div
              className={clsx(
                'mx-auto flex max-w-[1600px] items-center justify-center gap-2 px-2 py-6 md:gap-4 md:px-4 md:py-10 lg:py-14',
                className,
              )}
            >
              {/* Left Button - Completely outside container */}
              <div className="z-30 hidden shrink-0 md:block">
                <button
                  aria-disabled={!carouselApi || showcaseImages.length <= 1}
                  aria-label={previousLabel}
                  className="flex h-20 w-20 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 active:scale-95 lg:h-28 lg:w-28 xl:h-32 xl:w-32"
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

              {/* Section Container with carousel */}
              <SectionContainer>
                <SectionContainer.Outer
                  aria-labelledby={sectionLabelId}
                  bgColor="bg-[rgb(255,205,82)]"
                  className="flex-1"
                  innerPadding="px-1 @xl:px-1 @4xl:px-2"
                  padding="pt-3 pb-8 md:pt-4 md:pb-12 lg:pt-5 lg:pb-16"
                  radius={30}
                  rounded="all"
                >
                  <SectionContainer.Inner bgColor="bg-black" className="relative" radius={26}>
                    {/* Retro Orange Stripe Background */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-8"
                      role="presentation"
                    >
                      <Image
                        alt=""
                        className="object-fill"
                        fill
                        src="/images/backgrounds/orange_retro_stripe.png"
                      />
                    </div>

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
                          const imageConfig = getImageConfig('showcase', index);

                          return (
                            <CarouselItem
                              className="carousel-item relative flex w-full basis-full items-center justify-center p-0 pl-0"
                              key={image.src}
                              style={{
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginLeft: 0,
                                marginRight: 0,
                              }}
                            >
                              <div className="relative aspect-[16/10] w-full">
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
                                  </video>
                                ) : (
                                  <Image
                                    alt={`${productName} showcase image ${index + 1} of ${showcaseImages.length}${image.alt ? ` - ${image.alt}` : ''}`}
                                    blurDataURL={generateClientBlurPlaceholder()}
                                    className="h-full w-full object-cover"
                                    fill
                                    loading={imageConfig.loading}
                                    placeholder="blur"
                                    preload={imageConfig.preload}
                                    quality={imageConfig.quality}
                                    sizes="(max-width: 768px) 100vw, 80vw"
                                    src={image.src}
                                  />
                                )}

                                {/* Showcase Description Text Overlay */}
                                {showcaseDescription ? (
                                  <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute bottom-16 left-4 z-20 sm:bottom-20 sm:left-8 md:bottom-24 md:left-12 lg:left-16"
                                  >
                                    <div className="text-left">
                                      <h2 className="font-kanit text-2xl font-black italic leading-none sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
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

                      {/* Mobile navigation buttons - inside carousel */}
                      <div className="absolute left-2 top-1/2 z-30 -translate-y-1/2 md:hidden">
                        <button
                          aria-disabled={!carouselApi || showcaseImages.length <= 1}
                          aria-label={previousLabel}
                          className="flex h-16 w-16 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 active:scale-95 sm:h-20 sm:w-20"
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

                      <div className="absolute right-2 top-1/2 z-30 -translate-y-1/2 md:hidden">
                        <button
                          aria-disabled={!carouselApi || showcaseImages.length <= 1}
                          aria-label={nextLabel}
                          className="flex h-16 w-16 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 active:scale-95 sm:h-20 sm:w-20"
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
                  </SectionContainer.Inner>
                </SectionContainer.Outer>
              </SectionContainer>

              {/* Right Button - Completely outside container */}
              <div className="z-30 hidden shrink-0 md:block">
                <button
                  aria-disabled={!carouselApi || showcaseImages.length <= 1}
                  aria-label={nextLabel}
                  className="flex h-20 w-20 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 active:scale-95 lg:h-28 lg:w-28 xl:h-32 xl:w-32"
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
            </div>
          );
        }}
      </Stream>
    </>
  );
}
