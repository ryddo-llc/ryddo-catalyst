'use client';

import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import {
  Carousel,
  CarouselButtons,
  CarouselContent,
  CarouselItem,
} from '@/vibes/soul/primitives/carousel';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductShowcaseProps {
  images: Streamable<ProductImage[]>;
  className?: string;
  'aria-labelledby'?: string;
  previousLabel?: string;
  nextLabel?: string;
  productName?: string;
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
}: ProductShowcaseProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={clsx(
        'relative flex max-h-screen min-h-[40vh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-white font-[family-name:var(--product-showcase-font-family,var(--font-family-body))] md:min-h-[60vh] lg:min-h-[80vh]',
        className,
      )}
    >
      {/* Background gradients & text */}
      <div
        className="absolute inset-0 z-0 bg-blue-100"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      {productName ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="mt-80 select-none whitespace-nowrap text-6xl font-black uppercase leading-loose tracking-widest text-gray-600 opacity-30 md:text-8xl lg:text-9xl xl:text-[12rem]">
            {productName}
          </span>
        </div>
      ) : null}
      <div className="absolute bottom-0 left-0 right-0 z-0 h-32 bg-gradient-to-t from-blue-50 to-transparent" />

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

          return (
            <Carousel
              className="relative z-10 flex h-full w-full items-center justify-center"
              opts={{ align: 'center', loop: true }}
            >
              <CarouselContent className="h-full w-full">
                {imagesData.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <Image
                      alt={image.alt}
                      src={image.src}
                      width={1000}
                      height={600}
                      priority={index === 0}
                      className="h-auto max-h-[60vh] w-full object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Left Button */}
              <CarouselButtons
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 [&>button:first-child]:flex [&>button:first-child]:h-[130px] [&>button:first-child]:w-[55px] [&>button:first-child]:items-center [&>button:first-child]:justify-center [&>button:first-child]:rounded-l-none [&>button:first-child]:rounded-r-2xl [&>button:first-child]:bg-[#F92F7B] [&>button:first-child]:text-white [&>button:first-child]:shadow-lg [&>button:first-child]:transition-all [&>button:first-child]:duration-300 [&>button:first-child]:hover:scale-105 [&>button:first-child]:hover:bg-[#e01b5f] [&>button:last-child]:hidden"
                previousLabel={previousLabel}
                nextLabel={nextLabel}
              />

              {/* Right Button */}
              <CarouselButtons
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 [&>button:first-child]:hidden [&>button:last-child]:flex [&>button:last-child]:h-[130px] [&>button:last-child]:w-[55px] [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-l-2xl [&>button:last-child]:rounded-r-none [&>button:last-child]:bg-[#F92F7B] [&>button:last-child]:text-white [&>button:last-child]:shadow-lg [&>button:last-child]:transition-all [&>button:last-child]:duration-300 [&>button:last-child]:hover:scale-105 [&>button:last-child]:hover:bg-[#e01b5f]"
                previousLabel={previousLabel}
                nextLabel={nextLabel}
              />
            </Carousel>
          );
        }}
      </Stream>
    </section>
  );
}
