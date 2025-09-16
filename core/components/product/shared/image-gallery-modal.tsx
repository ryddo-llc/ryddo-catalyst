'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { Modal } from '@/vibes/soul/primitives/modal';
import { Image } from '~/components/image';
import type { ProductImage } from '~/lib/types';

interface ImageGalleryModalProps {
  images: ProductImage[];
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
}

export function ImageGalleryModal({
  images,
  isOpen,
  onClose,
  productTitle = 'Product Gallery',
}: ImageGalleryModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrevious = useCallback(() => {
    startTransition(() => {
      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    });
  }, [images.length]);

  const handleNext = useCallback(() => {
    startTransition(() => {
      setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    });
  }, [images.length]);

  // Add keyboard navigation and body class management
  useEffect(() => {
    if (!isOpen) return;

    // Add modal-open class to body to disable nav hover states
    document.body.classList.add('modal-open');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Remove modal-open class when modal closes
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, handlePrevious, handleNext, onClose]);

  if (!images.length) {
    return null;
  }

  const selectedImage = images[selectedImageIndex];

  if (!selectedImage) {
    return null;
  }

  const handleThumbnailClick = (index: number) => {
    startTransition(() => {
      setSelectedImageIndex(index);
    });
  };

  // Handle touch/swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX || 0;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - go to next
        handleNext();
      } else {
        // Swiped right - go to previous
        handlePrevious();
      }
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <Modal
      className="max-w-6xl bg-white/95 backdrop-blur-sm"
      hideHeader={true}
      isOpen={isOpen}
      setOpen={(open) => !open && onClose()}
      title={productTitle}
    >
      {/* Hidden description for accessibility */}
      <Dialog.Description className="sr-only">
        View product images for {productTitle}
      </Dialog.Description>

      {/* Custom Close Button - Fixed position in modal */}
      <div className="absolute right-4 top-4 z-10">
        <Dialog.Close asChild>
          <button
            aria-label="Close gallery"
            className="group rounded-full bg-black/10 p-2 backdrop-blur-md transition-all duration-200 hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            type="button"
          >
            <XIcon className="h-5 w-5 text-gray-700 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </Dialog.Close>
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        {/* Main Image Display - Fixed Size Container */}
        <div className="relative mx-auto w-full">
          <div
            className="relative touch-pan-y"
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
          >
            {/* Fixed aspect ratio container to prevent shifting - wider image display */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 md:aspect-[16/9] md:rounded-xl">
              {/* Image wrapper with absolute positioning and fade effect */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}
              >
                <Image
                  alt={selectedImage.alt}
                  className="h-full w-full select-none object-contain"
                  draggable={false}
                  height={600}
                  src={selectedImage.src}
                  width={800}
                />
              </div>
            </div>

            {/* Navigation Arrows (only show if more than 1 image) */}
            {images.length > 1 && (
              <>
                <Image
                  alt="Previous image"
                  className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:-translate-x-1 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:left-3 md:h-10 md:w-10"
                  height={60}
                  onClick={handlePrevious}
                  src="/icons/arrow-left.svg"
                  width={60}
                />

                <Image
                  alt="Next image"
                  className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:translate-x-1 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:right-3 md:h-10 md:w-10"
                  height={60}
                  onClick={handleNext}
                  src="/icons/arrow-right.svg"
                  width={60}
                />
              </>
            )}

            {/* Modern Image Counter with dots indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                {images.map((_, index) => (
                  <button
                    aria-label={`Go to image ${index + 1}`}
                    className={`transition-all duration-300 ${
                      index === selectedImageIndex
                        ? 'h-2 w-7 rounded-full bg-primary'
                        : 'h-2 w-2 rounded-full bg-white/60 hover:bg-white/80'
                    }`}
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    type="button"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modernized Thumbnail Grid (only show if more than 1 image) */}
        {images.length > 1 && (
          <div className="relative">
            <div className="scrollbar-hide overflow-x-auto pb-1">
              <div className="flex gap-1.5 px-1">
                {images.map((image, index) => (
                  <button
                    aria-label={`View ${image.alt}`}
                    className={`group relative flex-shrink-0 overflow-hidden rounded-md transition-all duration-300 ${
                      index === selectedImageIndex
                        ? 'scale-105 ring-2 ring-primary ring-offset-1'
                        : 'opacity-60 hover:scale-105 hover:opacity-100'
                    }`}
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    type="button"
                  >
                    <div className="relative h-14 w-14 overflow-hidden rounded-md bg-gray-100 md:h-16 md:w-16">
                      <Image
                        alt={image.alt}
                        className="h-full w-full object-cover"
                        height={80}
                        src={image.src}
                        width={80}
                      />
                      {index === selectedImageIndex && (
                        <div className="pointer-events-none absolute inset-0 bg-primary/15" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll hint for many images - only on desktop */}
            {images.length > 6 && (
              <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-12 bg-gradient-to-l from-white/80 to-transparent md:block" />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
