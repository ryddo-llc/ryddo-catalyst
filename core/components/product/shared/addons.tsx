'use client';

import React, { useCallback, useState } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { Image } from '~/components/image';

import { ProductModal } from './product-modal';

interface AddonProps {
  addons: Streamable<Product[]>;
  name?: string;
}

export default function Addons({ addons, name }: AddonProps) {
  // Background text based on product type
  const backgroundText = 'Accessories';
  const titleText = 'Ryddo Recs for your';
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get number of items to show based on screen size
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;

      if (width >= 768) return 6; // Medium and above: always 6

      if (width >= 480) return 3; // Small: 3

      return 2; // Mobile: 2
    }

    return 6; // Default to 6 for SSR
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prev) => {
      const itemsToShow = getItemsToShow();

      return (prev + itemsToShow) % Math.max(1, Math.ceil(20 / itemsToShow) * itemsToShow); // Estimate based on query size
    });
  }, []);

  const handlePrevClick = useCallback(() => {
    setCurrentIndex((prev) => {
      const itemsToShow = getItemsToShow();
      const totalItems = Math.max(1, Math.ceil(20 / itemsToShow) * itemsToShow); // Estimate based on query size
      const newIndex = prev - itemsToShow;

      return newIndex < 0 ? totalItems + newIndex : newIndex;
    });
  }, []);

  return (
    <section className="relative mb-16 w-full bg-white bg-gradient-to-br px-4 py-12 @container @sm:mb-20 @sm:py-16 @lg:mb-24 @lg:py-20">
      {/* Background Text - positioned directly behind addon grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 top-[calc(50%+2rem)] z-0 flex items-center justify-center overflow-hidden @sm:bottom-12 @sm:top-[calc(50%+1rem)] @md:bottom-16 @md:top-[50%]"
      >
        <span className="select-none whitespace-nowrap font-kanit text-[7rem] font-black uppercase leading-loose tracking-[0.08em] text-gray-300 opacity-40 transition-opacity duration-300 @xs:text-[6rem] @xs:opacity-45 @sm:text-[7rem] @sm:opacity-50 @md:text-[9vw] @md:opacity-60 @lg:text-[11vw] @lg:opacity-65 @xl:text-[13vw] @xl:opacity-70">
          {backgroundText}
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl text-center font-kanit">
        {/* Title */}
        <h2 className="mb-6 text-xl font-black text-gray-900 @xs:text-2xl @sm:mb-8 @sm:text-2xl @md:mb-10 @md:text-3xl @lg:mb-12 @lg:text-4xl @xl:text-5xl">
          {titleText}
          <br />
          <span className="-mt-2 block text-[#F92F7B] @xs:-mt-3 @sm:-mt-4 @md:-mt-6 @lg:-mt-8">
            new {name}
            <span className="text-black">.</span>
          </span>
        </h2>

        {/* Add-Ons Grid */}
        <div className="relative z-20">
          {/* Left Arrow */}
          <Image
            alt="Previous"
            className="absolute -left-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:-translate-x-1 hover:scale-110 @md:-left-8 @md:block @md:h-10 @md:w-10 @lg:-left-12 @lg:h-12 @lg:w-12 @xl:-left-16 @xl:h-14 @xl:w-14"
            height={60}
            onClick={handlePrevClick}
            src="/icons/arrow-left.svg"
            width={60}
          />

          {/* Right Arrow */}
          <Image
            alt="Next"
            className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:translate-x-1 hover:scale-110 @md:-right-8 @md:block @md:h-10 @md:w-10 @lg:-right-12 @lg:h-12 @lg:w-12 @xl:-right-16 @xl:h-14 @xl:w-14"
            height={60}
            onClick={handleNextClick}
            src="/icons/arrow-right.svg"
            width={60}
          />

          <div className="grid grid-cols-2 gap-3 @xs:gap-4 @sm:grid-cols-3 @sm:gap-6 @md:grid-cols-6 @md:gap-8 @lg:grid-cols-6 @lg:gap-10 @xl:grid-cols-6 @xl:gap-12">
            <Stream
              fallback={
                <div className="contents">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div className="group cursor-pointer" key={index}>
                      <div className="aspect-square animate-pulse rounded-2xl bg-gray-200 p-4 @sm:p-6 @md:p-8" />
                    </div>
                  ))}
                </div>
              }
              value={addons}
            >
              {(accessories) => {
                // Get items to show based on screen size
                const itemsToShow = getItemsToShow();

                // Calculate visible accessories with looping
                const getVisibleAccessories = () => {
                  if (accessories.length === 0) return [];

                  const visibleItems = [];

                  for (let i = 0; i < itemsToShow; i += 1) {
                    const index = (currentIndex + i) % accessories.length;
                    const accessory = accessories[index];

                    if (accessory) {
                      visibleItems.push(accessory);
                    }
                  }

                  return visibleItems;
                };

                const displayAccessories = getVisibleAccessories();

                return displayAccessories.map((accessory) => (
                  <button
                    aria-label={`View ${accessory.title} details`}
                    className="group relative z-30 min-h-[44px] cursor-pointer touch-manipulation overflow-hidden rounded-2xl border-none bg-transparent p-0 transition-transform @container active:scale-95"
                    key={accessory.id}
                    onClick={() => handleProductClick(accessory)}
                    type="button"
                  >
                    {/* Optimized ripple effect with responsive sizing */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      {/* Center pulse */}
                      <div className="absolute h-12 w-12 rounded-full bg-[#F92F7B] opacity-0 transition-all duration-200 ease-out group-hover:scale-125 group-hover:opacity-100 @sm:h-16 @sm:w-16" />

                      {/* Inner pulse circle */}
                      <div className="absolute h-16 w-16 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-100 duration-300 ease-out group-hover:scale-110 group-hover:opacity-80 @sm:h-20 @sm:w-20" />

                      {/* First wave of ripples */}
                      <div className="absolute h-24 w-24 scale-75 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-150 duration-500 ease-out group-hover:scale-150 group-hover:opacity-0 @sm:h-32 @sm:w-32" />
                      <div className="group-hover:scale-200 absolute h-20 w-20 scale-75 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-200 duration-700 ease-out group-hover:opacity-0 @sm:h-24 @sm:w-24" />
                      <div className="group-hover:scale-200 absolute h-24 w-24 scale-75 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-300 duration-700 ease-out group-hover:opacity-0 @sm:h-28 @sm:w-28" />

                      {/* Second wave of ripples */}
                      <div className="group-hover:scale-200 absolute h-28 w-28 scale-50 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-300 duration-1000 ease-out group-hover:opacity-0 @sm:h-32 @sm:w-32" />
                      <div className="group-hover:scale-200 absolute h-32 w-32 scale-50 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-500 duration-1000 ease-out group-hover:opacity-0 @sm:h-36 @sm:w-36" />
                      <div className="group-hover:scale-200 absolute h-36 w-36 scale-50 rounded-full bg-[#F92F7B] opacity-0 transition-all delay-700 duration-1000 ease-out group-hover:opacity-0 @sm:h-40 @sm:w-40" />
                    </div>

                    {/* Product Image */}
                    <Image
                      alt={accessory.title}
                      className="relative z-20 aspect-square rounded-2xl object-contain p-4 transition-transform duration-300 group-hover:scale-105 @sm:p-6 @md:p-8"
                      height={500}
                      src={accessory.image?.src || '/images/placeholder.png'}
                      width={500}
                    />

                    {/* Product Name Overlay (visible on hover) */}
                    <div className="absolute bottom-1.5 left-1 right-1 z-40 translate-y-full transform rounded-lg bg-[#F92F7B] px-1.5 py-1 text-center text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:scale-105 group-hover:opacity-100 @xs:bottom-2 @xs:left-1.5 @xs:right-1.5 @xs:px-2 @sm:bottom-3 @sm:left-2 @sm:right-2">
                      <p className="truncate text-[8px] font-medium leading-tight @xs:text-[9px] @sm:text-[10px]">
                        {accessory.title}
                      </p>
                    </div>
                  </button>
                ));
              }}
            </Stream>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal isOpen={isModalOpen} onClose={handleModalClose} product={selectedProduct} />
      )}
    </section>
  );
}
