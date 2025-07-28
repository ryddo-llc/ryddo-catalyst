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
}

function ProductShowcaseImage({ image }: { image: ProductImage }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--product-showcase-background,hsl(var(--contrast-100)))]">
      <Image
        alt={image.alt}
        className="h-full w-full object-cover"
        height={600}
        src={image.src}
        width={600}
      />
    </div>
  );
}

function ProductShowcaseSkeleton() {
  return (
    <div className="relative">
      <Skeleton.Root className="animate-pulse" pending>
        <div className="aspect-square overflow-hidden rounded-lg">
          <Skeleton.Box className="h-full w-full" />
        </div>
      </Skeleton.Root>

      {/* Navigation buttons skeleton */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Skeleton.Box className="h-10 w-10 rounded-full" />
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Skeleton.Box className="h-10 w-10 rounded-full" />
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
}: ProductShowcaseProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={clsx(
        'relative w-full font-[family-name:var(--product-showcase-font-family,var(--font-family-body))] @container',
        className,
      )}
    >
      <Stream fallback={<ProductShowcaseSkeleton />} value={images}>
        {(imagesData) => {
          if (imagesData.length === 0) {
            return <div style={{ color: 'red' }}>Debug: No images found</div>;
          }

          // If only one image, show it without carousel controls
          if (imagesData.length === 1 && imagesData[0]) {
            return <ProductShowcaseImage image={imagesData[0]} />;
          }

          return (
            <Carousel
              className="group/carousel"
              opts={{
                align: 'center',
                loop: true,
              }}
            >
              <CarouselContent>
                {imagesData.map((image, index) => (
                  <CarouselItem key={index}>
                    <ProductShowcaseImage image={image} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation buttons positioned over the image */}
              <div className="absolute inset-y-0 left-4 flex items-center">
                <CarouselButtons
                  className="[&>button:first-child]:bg-[var(--product-showcase-button-background,hsl(var(--background)/90))] [&>button:first-child]:text-[var(--product-showcase-button-text,hsl(var(--foreground)))] [&>button:first-child]:shadow-lg [&>button:first-child]:backdrop-blur-sm [&>button:first-child]:hover:bg-[var(--product-showcase-button-hover,hsl(var(--background)))] [&>button:last-child]:hidden"
                  colorScheme="light"
                  nextLabel={nextLabel}
                  previousLabel={previousLabel}
                />
              </div>

              <div className="absolute inset-y-0 right-4 flex items-center">
                <CarouselButtons
                  className="[&>button:first-child]:hidden [&>button:last-child]:bg-[var(--product-showcase-button-background,hsl(var(--background)/90))] [&>button:last-child]:text-[var(--product-showcase-button-text,hsl(var(--foreground)))] [&>button:last-child]:shadow-lg [&>button:last-child]:backdrop-blur-sm [&>button:last-child]:hover:bg-[var(--product-showcase-button-hover,hsl(var(--background)))]"
                  colorScheme="light"
                  nextLabel={nextLabel}
                  previousLabel={previousLabel}
                />
              </div>
            </Carousel>
          );
        }}
      </Stream>
    </section>
  );
}
