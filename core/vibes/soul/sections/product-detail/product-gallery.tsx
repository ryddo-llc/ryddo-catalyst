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
    <div className={clsx('flex flex-col gap-6', className)}>
      {/* Main Image */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl ring-1 ring-gray-200">
        <div
          className="w-full overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex">
            {images.map((image, idx) => (
              <div
                className={clsx(
                  'relative w-full shrink-0 grow-0 basis-full p-8',
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
                    'transition-transform duration-300 group-hover:scale-105',
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
      </div>

      {/* Thumbnail Gallery */}
      <div className="relative flex gap-3 overflow-x-auto pb-2">
        {/* Vertical text behind thumbnails - now more subtle */}
        {Boolean(firstWord) && (
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-start pl-2 @lg:flex">
            <span 
              className="select-none text-8xl font-black uppercase tracking-widest text-gray-100 opacity-30"
              style={{ 
                writingMode: 'vertical-rl', 
                textOrientation: 'mixed',
                transform: 'rotate(180deg)'
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
              'group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-md transition-all duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2 @md:h-24 @md:w-24',
              index === previewImage
                ? 'border-[#F92F7B] shadow-lg ring-2 ring-[#F92F7B]/20'
                : 'border-gray-200 hover:border-gray-300',
            )}
            key={index}
            onClick={() => selectImage(index)}
          >
            <div className="p-2">
              <div
                className={clsx(
                  'transition-all duration-300',
                  index === previewImage ? 'opacity-100 scale-100' : 'opacity-60 group-hover:opacity-100 group-hover:scale-105',
                )}
              >
                <Image
                  alt={image.alt}
                  className="object-contain"
                  fill
                  sizes="6rem"
                  src={image.src}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
