'use client';

import { clsx } from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import {
  Carousel,
  CarouselButtons,
  CarouselContent,
  CarouselItem,
} from '@/vibes/soul/primitives/carousel';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';
import { textSizePresets } from '~/lib/dynamic-text-sizing';
import { findShowcaseImages } from '~/lib/image-resolver';
import type { ProductImage } from '~/lib/types';

export type { ProductImage } from '~/lib/types';

export interface ProductShowcaseProps {
  images: Streamable<ProductImage[]>;
  className?: string;
  'aria-labelledby'?: string;
  previousLabel?: string;
  nextLabel?: string;
  productName?: string;
  description?: string | null;
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

// Color palette for cycling through carousel slides
const colorPalette = [
  '#E5F3F9', // light blue-teal
  '#F3E8FF', // light purple
  '#ECFDF5', // light green
  '#FEF3C7', // light yellow
  '#FCE7F3', // light pink
  '#F1F5F9', // light gray-blue
];

export function ProductShowcase({
  images,
  className,
  'aria-labelledby': ariaLabelledBy,
  previousLabel = 'Previous image',
  nextLabel = 'Next image',
  productName,
  description,
}: ProductShowcaseProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<ReturnType<typeof useEmblaCarousel>[1]>();

  // Set up carousel API to track slide changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);

    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  // Get current color
  const currentColor = colorPalette[currentSlide % colorPalette.length] || colorPalette[0];

  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={clsx(
        'relative flex max-h-screen min-h-[50vh] w-full items-center justify-center overflow-hidden bg-white font-[family-name:var(--product-showcase-font-family,var(--font-family-body))] sm:min-h-[40vh] md:min-h-[60vh] lg:min-h-[80vh]',
        className,
      )}
    >
      {/* Top colored section */}
      <div
        className="absolute inset-0 z-0"
        style={{ clipPath: 'polygon(0 0, 160% 0, 0 60%)', backgroundColor: currentColor }}
      />
      {productName ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span
            className={clsx(
              'mt-32 select-none whitespace-nowrap font-black uppercase leading-loose tracking-widest text-gray-500 opacity-30 sm:mt-60',
              textSizePresets.watermark(productName || ''),
            )}
          >
            {productName}
          </span>
        </div>
      ) : null}

      {/* Description Section - Responsive */}
      {description ? (
        <div className="z-5 absolute left-1/2 top-6 max-w-xs -translate-x-1/2 transform px-4 sm:left-auto sm:right-10 sm:top-12 sm:max-w-md sm:translate-x-0 sm:px-0">
          <h2 className="text-center text-xl font-black leading-tight sm:text-left sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            <span className="block text-[#F92F7B]">
              {description
                .split(' ')
                .slice(0, Math.ceil(description.split(' ').length / 2))
                .join(' ')}
            </span>
            <span className="-mt-3 block text-gray-900 sm:-mt-6">
              {description
                .split(' ')
                .slice(Math.ceil(description.split(' ').length / 2))
                .join(' ')
                .toLowerCase()}
            </span>
          </h2>
        </div>
      ) : null}

      {/* Main carousel content */}
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
                {imagesData.map((img) => img.alt).join(', ')}
              </div>
            );
          }

          return (
            <Carousel
              className="z-5 relative flex h-full w-full items-center justify-center"
              opts={{
                align: 'center',
                loop: true,
                dragFree: true,
                containScroll: 'trimSnaps',
              }}
              setApi={setCarouselApi}
            >
              <CarouselContent className="h-full w-full">
                {showcaseImages.map((image, index) => (
                  <CarouselItem
                    className="relative flex h-full w-full items-center justify-center px-8 py-4"
                    key={index}
                  >
                    <div className="xs:h-[380px] xs:w-[505px] relative aspect-[4/3] h-[340px] w-[450px] sm:h-[420px] sm:w-[560px] md:h-[480px] md:w-[640px] lg:h-[520px] lg:w-[695px] xl:h-[560px] xl:w-[745px] 2xl:h-[600px] 2xl:w-[800px]">
                      <Image
                        alt={`${productName} ${image.alt} image`}
                        className="object-contain"
                        fill
                        loading="lazy"
                        sizes="(max-width: 480px) 450px, (max-width: 640px) 505px, (max-width: 768px) 560px, (max-width: 1024px) 640px, (max-width: 1280px) 695px, (max-width: 1536px) 745px, 800px"
                        src={image.src}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Left Button */}
              <CarouselButtons
                className="z-5 absolute left-0 top-1/2 -translate-y-1/2 [&>button:first-child]:flex [&>button:first-child]:h-[80px] [&>button:first-child]:w-[40px] [&>button:first-child]:items-center [&>button:first-child]:justify-center [&>button:first-child]:rounded-l-none [&>button:first-child]:rounded-r-2xl [&>button:first-child]:bg-[#F92F7B] [&>button:first-child]:text-white [&>button:first-child]:shadow-lg [&>button:first-child]:transition-all [&>button:first-child]:duration-300 [&>button:first-child]:hover:scale-105 [&>button:first-child]:hover:bg-[#e01b5f] [&>button:first-child]:active:scale-95 sm:[&>button:first-child]:h-[130px] sm:[&>button:first-child]:w-[55px] [&>button:last-child]:hidden"
                nextLabel={nextLabel}
                previousLabel={previousLabel}
              />

              {/* Right Button */}
              <CarouselButtons
                className="z-5 absolute right-0 top-1/2 -translate-y-1/2 [&>button:first-child]:hidden [&>button:last-child]:flex [&>button:last-child]:h-[80px] [&>button:last-child]:w-[40px] [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-l-2xl [&>button:last-child]:rounded-r-none [&>button:last-child]:bg-[#F92F7B] [&>button:last-child]:text-white [&>button:last-child]:shadow-lg [&>button:last-child]:transition-all [&>button:last-child]:duration-300 [&>button:last-child]:hover:scale-105 [&>button:last-child]:hover:bg-[#e01b5f] [&>button:last-child]:active:scale-95 sm:[&>button:last-child]:h-[130px] sm:[&>button:last-child]:w-[55px]"
                nextLabel={nextLabel}
                previousLabel={previousLabel}
              />
            </Carousel>
          );
        }}
      </Stream>
    </section>
  );
}
