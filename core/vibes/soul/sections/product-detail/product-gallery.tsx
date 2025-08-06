'use client';

import { clsx } from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState, useRef } from 'react';

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
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

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

  const checkScrollButtons = () => {
    if (!thumbnailContainerRef.current) return;

    const container = thumbnailContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
  };

  const scrollThumbnails = (direction: 'up' | 'down') => {
    if (!thumbnailContainerRef.current) return;

    const container = thumbnailContainerRef.current;
    const scrollAmount = container.clientHeight * 0.7; // Scroll 70% of container height

    container.scrollBy({
      top: direction === 'down' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    checkScrollButtons();
    const container = thumbnailContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);

      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [images]);

  // Get first word of product title
  const firstWord = productTitle?.split(' ')[0] || '';

  return (
    <div
      className={clsx('relative flex flex-col items-start gap-4 @md:flex-row @md:gap-6', className)}
    >
      {/* Brand name background text - behind thumbnails only */}
      {Boolean(firstWord) && (
        <div
          className="pointer-events-none absolute left-0 top-[-12px] hidden items-center justify-center @md:ml-2 @md:flex @md:min-h-[300px] @md:w-24 @lg:ml-3 @lg:w-28 @xl:ml-4 @xl:w-32"
          style={{ zIndex: 1 }}
        >
          <span
            className="select-none text-[8rem] font-black uppercase tracking-widest text-gray-400 opacity-15 @md:text-[6rem] @lg:text-[8rem] @xl:text-[10rem] @2xl:text-[12rem]"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
            }}
          >
            {firstWord}
          </span>
        </div>
      )}

      {/* Thumbnail Gallery with Natural Arrow Flow */}
      <div className="flex w-full flex-row @md:ml-4 @md:w-24 @md:flex-col @md:items-center @lg:ml-6 @lg:w-28 @xl:ml-8 @xl:w-32">
        {/* Up Arrow */}
        <button
          onClick={() => selectImage(Math.max(0, previewImage - 1))}
          className="hidden items-center justify-center @md:flex @md:pb-2"
          aria-label="Previous image"
        >
          <svg className="h-6 w-6" fill="none" stroke="#F92F7B" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Thumbnails Container */}
        <div
          ref={thumbnailContainerRef}
          className="flex flex-row gap-3 overflow-x-auto pb-2 @md:flex-col @md:overflow-y-auto @md:pb-0 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {images.map((image, index) => (
            <button
              aria-label={`${thumbnailLabel} ${index + 1}`}
              className={clsx(
                '@lg:h-22 group relative z-10 h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-md transition-all duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2 @md:h-20 @md:w-24 @lg:w-28 @xl:h-24 @xl:w-32',
                index === previewImage
                  ? 'border-gray-400'
                  : 'border-gray-200 hover:border-gray-300',
              )}
              key={index}
              onClick={() => selectImage(index)}
            >
              <div className="p-3">
                <div
                  className={clsx(
                    'h-full w-full transition-opacity duration-300',
                    index === previewImage ? 'opacity-100' : 'opacity-60 group-hover:opacity-90',
                  )}
                >
                  <Image
                    alt={image.alt}
                    className="object-contain"
                    fill
                    sizes="(max-width: 768px) 6rem, (max-width: 1280px) 8rem, 9rem"
                    src={image.src}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Down Arrow */}
        <button
          onClick={() => selectImage(Math.min(images.length - 1, previewImage + 1))}
          className="hidden items-center justify-center @md:flex @md:pt-2"
          aria-label="Next image"
        >
          <svg className="h-6 w-6" fill="none" stroke="#F92F7B" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main Image */}
      <div className="group relative -mt-16 overflow-hidden @md:-mt-12 @md:w-[calc(100%-7rem)] @md:pt-[2rem] @lg:w-[calc(100%-8rem)] @xl:w-[calc(100%-9rem)]">
        <div className="w-full overflow-hidden" ref={emblaRef}>
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
                    'transition-transform duration-300',
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
    </div>
  );
}
