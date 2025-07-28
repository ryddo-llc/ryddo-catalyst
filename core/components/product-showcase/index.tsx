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
        'relative flex max-h-screen min-h-[40vh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-white font-[family-name:var(--product-showcase-font-family,var(--font-family-body))] md:min-h-[50vh] lg:min-h-[80vh]',
        className,
      )}
    >
      {/* Additional gradient overlay for more visible separation */}
      <div
        className="absolute inset-0 bg-blue-100"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        }}
      />

      {/* Background Product Name Text */}
      {productName ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none whitespace-nowrap text-6xl font-black uppercase leading-loose tracking-widest text-gray-300 opacity-30 md:text-8xl lg:text-9xl xl:text-[12rem]">
            {productName}
          </span>
        </div>
      ) : null}

      {/* Main Content */}
      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center">
        {/* Image Display - Perfectly centered */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative flex w-full max-w-4xl items-center justify-center">
            <Stream fallback={<ProductShowcaseSkeleton />} value={images}>
              {(imagesData) => {
                if (imagesData.length === 0) {
                  return <div className="text-center text-gray-500">No images found</div>;
                }

                return (
                  <Carousel
                    className="group/carousel w-full"
                    opts={{
                      align: 'center',
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {imagesData.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative">
                            <Image
                              alt={image.alt}
                              className="h-auto max-h-[60vh] w-full max-w-full object-contain"
                              height={600}
                              priority={index === 0}
                              src={image.src}
                              width={1000}
                            />
                            {/* Decorative elements */}
                            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-pink-500 opacity-10 blur-xl" />
                            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-pink-500 opacity-10 blur-xl" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Left Navigation Arrow */}
                    <div className="absolute left-0 top-1/2 z-20 -translate-y-1/2">
                      <CarouselButtons
                        className="[&>button:first-child]:flex [&>button:first-child]:h-[130px] [&>button:first-child]:w-[55px] [&>button:first-child]:items-center [&>button:first-child]:justify-center [&>button:first-child]:rounded-l-none [&>button:first-child]:rounded-r-2xl [&>button:first-child]:bg-[#F92F7B] [&>button:first-child]:text-white [&>button:first-child]:shadow-lg [&>button:first-child]:transition-all [&>button:first-child]:duration-300 [&>button:first-child]:hover:scale-105 [&>button:first-child]:hover:bg-[#e01b5f] [&>button:last-child]:hidden"
                        nextLabel={nextLabel}
                        previousLabel={previousLabel}
                      />
                    </div>

                    {/* Right Navigation Arrow */}
                    <div className="absolute right-0 top-1/2 z-20 -translate-y-1/2">
                      <CarouselButtons
                        className="[&>button:first-child]:hidden [&>button:last-child]:flex [&>button:last-child]:h-[130px] [&>button:last-child]:w-[55px] [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-l-2xl [&>button:last-child]:rounded-r-none [&>button:last-child]:bg-[#F92F7B] [&>button:last-child]:text-white [&>button:last-child]:shadow-lg [&>button:last-child]:transition-all [&>button:last-child]:duration-300 [&>button:last-child]:hover:scale-105 [&>button:last-child]:hover:bg-[#e01b5f]"
                        nextLabel={nextLabel}
                        previousLabel={previousLabel}
                      />
                    </div>
                  </Carousel>
                );
              }}
            </Stream>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 to-transparent" />
    </section>
  );
}
