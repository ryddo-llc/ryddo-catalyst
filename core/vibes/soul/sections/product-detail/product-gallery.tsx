'use client';

import { clsx } from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

import { Image } from '~/components/image';

export interface ProductGalleryProps {
  images: Array<{ alt: string; src: string }>;
  className?: string;
  thumbnailLabel?: string;
  productTitle?: string;
  aspectRatio?:
    | '1:1'
    | '4:5'
    | '5:4'
    | '3:4'
    | '4:3'
    | '2:3'
    | '3:2'
    | '16:9'
    | '9:16'
    | '5:6'
    | '6:5';
  fit?: 'contain' | 'cover';
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --product-gallery-focus: hsl(var(--primary));
 *   --product-gallery-image-background: hsl(var(--contrast-100));
 *   --product-gallery-image-border: hsl(var(--contrast-100));
 *   --product-gallery-image-border-active: hsl(var(--foreground));
 * }
 * ```
 */
export function ProductGallery({
  images,
  className,
  thumbnailLabel = 'View image number',
  productTitle,
  aspectRatio = '4:5',
  fit = 'contain',
}: ProductGalleryProps) {
  const [previewImage, setPreviewImage] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setPreviewImage(emblaApi.selectedScrollSnap());

    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const selectImage = (index: number) => {
    setPreviewImage(index);
    if (emblaApi) emblaApi.scrollTo(index);
  };

  // Get first word of product title
  const firstWord = productTitle?.split(' ')[0] || '';

  return (
    <div className={clsx('sticky top-0 flex flex-col gap-2 @2xl:flex-row @2xl:items-start', className)}>
      <div
        className="w-full overflow-hidden rounded-xl @xl:rounded-2xl @2xl:order-2 @2xl:-mt-24"
        ref={emblaRef}
      >
        <div className="flex">
          {images.map((image, idx) => (
            <div
              className={clsx(
                'relative w-full shrink-0 grow-0 basis-full',
                {
                  '5:6': 'aspect-[5/6]',
                  '3:4': 'aspect-[3/4]',
                  '4:5': 'aspect-[4/5]',
                  '3:2': 'aspect-[3/2]',
                  '2:3': 'aspect-[2/3]',
                  '16:9': 'aspect-[16/9]',
                  '9:16': 'aspect-[9/16]',
                  '6:5': 'aspect-[6/5]',
                  '5:4': 'aspect-[5/4]',
                  '4:3': 'aspect-[4/3]',
                  '1:1': 'aspect-square',
                }[aspectRatio],
              )}
              key={idx}
            >
              <Image
                alt={image.alt}
                className={clsx(
                  {
                    contain: 'object-contain',
                    cover: 'object-cover',
                  }[fit],
                )}
                fill
                priority={idx === 0}
                sizes="(min-width: 42rem) 50vw, 100vw"
                src={image.src}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex max-w-full shrink-0 flex-row gap-2 @2xl:order-1 @2xl:flex-col @2xl:overflow-visible">
        {/* Vertical text behind thumbnails */}
        {Boolean(firstWord) && (
          <div className="pointer-events-none absolute inset-0 hidden items-start justify-center pt-48 @2xl:flex">
            <span 
              className="select-none text-[12rem] font-black uppercase tracking-widest text-gray-300 opacity-50"
              style={{ 
                writingMode: 'vertical-rl', 
                textOrientation: 'mixed',
                transform: 'rotate(180deg) translateY(60%)'
              }}
            >
              {firstWord}
            </span>
          </div>
        )}
        {images.map((image, index) => (
          <button
            aria-label={`${thumbnailLabel} ${index + 1}`}
            className={clsx(
              'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border bg-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--product-gallery-focus,hsl(var(--primary)))] focus-visible:ring-offset-2 @md:h-20 @md:w-28',
              index === previewImage
                ? 'border-[var(--product-gallery-image-border-active,hsl(var(--foreground)))]'
                : 'border-transparent',
            )}
            key={index}
            onClick={() => selectImage(index)}
          >
            <div
              className={clsx(
                index === previewImage ? 'opacity-100' : 'opacity-50',
                'transition-all duration-300 hover:opacity-100',
              )}
            >
              <Image
                alt={image.alt}
                className="object-contain"
                fill
                sizes="(min-width: 28rem) 4rem, 3rem"
                src={image.src}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
