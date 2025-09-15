'use client';

import { useState } from 'react';

import type { ProductImage } from '~/lib/types';

import { GalleryButton } from './gallery-button';
import { ImageGalleryModal } from './image-gallery-modal';

interface GalleryButtonWithModalProps {
  images: ProductImage[];
  productTitle?: string;
  className?: string;
  ariaLabel?: string;
}

export function GalleryButtonWithModal({
  images,
  productTitle,
  className,
  ariaLabel = 'View More Images'
}: GalleryButtonWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Don't render if no images
  if (!images.length) {
    return null;
  }

  return (
    <>
      <GalleryButton
        ariaLabel={ariaLabel}
        className={className}
        onClick={handleOpenModal}
      />

      <ImageGalleryModal
        images={images}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productTitle={productTitle}
      />
    </>
  );
}