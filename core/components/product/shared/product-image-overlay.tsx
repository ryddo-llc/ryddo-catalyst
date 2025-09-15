'use client';

import { ReactNode } from 'react';

interface ProductImageOverlayProps {
  wishlistButton?: ReactNode;
  digitalTagLink?: ReactNode;
  className?: string;
}

export function ProductImageOverlay({
  wishlistButton,
  digitalTagLink,
  className = '',
}: ProductImageOverlayProps) {
  // Don't render if no buttons provided
  if (!wishlistButton && !digitalTagLink) {
    return null;
  }

  return (
    <div
      aria-label="Product actions"
      className={`absolute right-4 top-[-20px] z-10 hidden transform sm:right-8 md:right-12 md:flex lg:right-16 ${className}`}
      role="group"
    >
      {/* Floating Actions Container - Horizontal Layout */}
      <div className="flex flex-row items-center gap-1 rounded-lg bg-white/30 px-2 py-1 shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 hover:bg-white/90 hover:shadow-md">
        {/* Wishlist Button */}
        {wishlistButton ? (
          <div className="flex items-center justify-center">{wishlistButton}</div>
        ) : null}

        {/* Digital Tag Link */}
        {digitalTagLink ? (
          <div className="flex items-center justify-center">{digitalTagLink}</div>
        ) : null}
      </div>

      {/* Subtle backdrop glow effect */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-white/20 to-transparent blur-lg" />
    </div>
  );
}

// Enhanced version with tooltips and accessibility
export function ProductImageOverlayEnhanced({
  wishlistButton,
  digitalTagLink,
  className = '',
}: ProductImageOverlayProps) {
  // Don't render if no buttons provided
  if (!wishlistButton && !digitalTagLink) {
    return null;
  }

  return (
    <div
      aria-label="Product actions"
      className={`absolute right-4 top-[-20px] z-10 hidden transform sm:right-8 md:right-12 md:flex lg:right-16 ${className}`}
      role="group"
    >
      {/* Floating Actions Container with enhanced glassmorphism - Horizontal Layout */}
      <div className="group relative flex flex-row items-center gap-1 rounded-lg bg-gradient-to-r from-white/90 to-white/80 px-2 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-white/20 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        {/* Animated border gradient on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#F92F7B]/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Wishlist Button */}
        {wishlistButton ? (
          <div className="relative flex items-center justify-center">{wishlistButton}</div>
        ) : null}

        {/* Digital Tag Link */}
        {digitalTagLink ? (
          <div className="relative flex items-center justify-center">{digitalTagLink}</div>
        ) : null}

        {/* Subtle inner glow */}
        <div className="pointer-events-none absolute inset-[1px] rounded-[11px] bg-gradient-to-r from-white/40 to-transparent" />
      </div>

      {/* Backdrop glow effect */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-white/30 to-transparent blur-lg transition-opacity duration-500 group-hover:opacity-80" />
    </div>
  );
}
