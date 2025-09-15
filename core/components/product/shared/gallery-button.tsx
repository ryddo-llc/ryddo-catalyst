'use client';

import { Plus } from 'lucide-react';

interface GalleryButtonProps {
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export function GalleryButton({
  className = '',
  ariaLabel = 'View More Images',
  onClick
}: GalleryButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-[#F92F7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 sm:h-8 sm:w-8 ${className}`}
      onClick={onClick}
      title={ariaLabel}
      type="button"
    >
      <Plus
        aria-hidden="true"
        className="h-4 w-4 sm:h-5 sm:w-5"
        strokeWidth={2}
      />
    </button>
  );
}