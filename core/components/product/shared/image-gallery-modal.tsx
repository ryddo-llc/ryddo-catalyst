'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/vibes/soul/primitives/button';
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
  productTitle = 'Product Gallery'
}: ImageGalleryModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images.length) {
    return null;
  }

  const selectedImage = images[selectedImageIndex];

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <Modal
      className="max-w-6xl"
      hideHeader={true}
      isOpen={isOpen}
      setOpen={(open) => !open && onClose()}
      title={productTitle}
    >
      {/* Hidden description for accessibility */}
      <Dialog.Description className="sr-only">
        View product images for {productTitle}
      </Dialog.Description>

      {/* Custom Close Button */}
      <div className="mb-4 flex justify-end">
        <Dialog.Close asChild>
          <Button shape="circle" size="x-small" variant="ghost">
            <XIcon size={20} />
          </Button>
        </Dialog.Close>
      </div>

      <div className="flex flex-col gap-6">
        {/* Main Image Display */}
        <div className="relative">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 md:aspect-[4/3]">
            <Image
              alt={selectedImage.alt}
              className="h-full w-full object-contain"
              height={600}
              src={selectedImage.src}
              width={800}
            />
          </div>

          {/* Navigation Arrows (only show if more than 1 image) */}
          {images.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F92F7B] focus:ring-offset-2"
                onClick={handlePrevious}
                type="button"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
              </button>

              <button
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F92F7B] focus:ring-offset-2"
                onClick={handleNext}
                type="button"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Grid (only show if more than 1 image) */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {images.map((image, index) => (
              <button
                key={index}
                aria-label={`View ${image.alt}`}
                className={`aspect-square overflow-hidden rounded-md border-2 transition-all duration-200 hover:border-[#F92F7B] focus:outline-none focus:ring-2 focus:ring-[#F92F7B] focus:ring-offset-1 ${
                  index === selectedImageIndex
                    ? 'border-[#F92F7B] ring-2 ring-[#F92F7B] ring-offset-1'
                    : 'border-gray-200'
                }`}
                onClick={() => handleThumbnailClick(index)}
                type="button"
              >
                <Image
                  alt={image.alt}
                  className="h-full w-full object-cover"
                  height={100}
                  src={image.src}
                  width={100}
                />
              </button>
            ))}
          </div>
        )}

        {/* Gallery Info */}
        <div className="text-center text-sm text-gray-600">
          {images.length === 1 ? (
            <p>Product image</p>
          ) : (
            <p>Product gallery - {images.length} images</p>
          )}
        </div>
      </div>
    </Modal>
  );
}