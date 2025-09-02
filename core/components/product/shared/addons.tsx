'use client';

import { useState } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { Image } from '~/components/image';
import { getFluidBackgroundTextSize } from '~/lib/dynamic-text-sizing';

import { ProductModal } from './product-modal';

interface AddonProps {
  addons: Streamable<Product[]>;
  name?: string;
}

export default function Addons({ addons, name = 'Super73-RX' }: AddonProps) {
  // Background text based on product type
  const backgroundText = name;
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className="relative w-full bg-white bg-gradient-to-br px-4 py-12 @sm:py-16 @lg:py-20 @container">
      {/* Background Text - positioned directly behind addon grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[calc(50%+2rem)] bottom-8 z-0 flex items-center justify-center overflow-hidden @sm:top-[calc(50%+1rem)] @sm:bottom-12 @md:top-[50%] @md:bottom-16"
      >
        <span 
          className={`select-none whitespace-nowrap font-black uppercase leading-loose tracking-widest text-gray-300 opacity-50 transition-opacity duration-300 max-w-[90vw] @sm:max-w-none @sm:opacity-60 @md:opacity-70 ${getFluidBackgroundTextSize(backgroundText)}`}
        >
          {backgroundText}
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        {/* Title */}
        <h2 className="mb-8 text-2xl font-black text-gray-900 @sm:mb-10 @sm:text-3xl @md:mb-12 @md:text-4xl @lg:text-5xl @xl:text-6xl">
          Add-Ons for your
          <br />
          <span className="-mt-4 block text-[#F92F7B] @sm:-mt-6 @md:-mt-8">new {name}.</span>
        </h2>

        {/* Add-Ons Grid */}
        <div className="relative z-20">
          <div className="grid grid-cols-1 gap-4 @xs:grid-cols-2 @xs:gap-6 @sm:grid-cols-3 @sm:gap-8 @md:grid-cols-4 @md:gap-10 @lg:grid-cols-5 @lg:gap-12 @xl:grid-cols-6">
            <Stream
              fallback={
                <div className="contents">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div className="group cursor-pointer" key={index}>
                      <div className="aspect-square animate-pulse rounded-2xl bg-gray-200 p-4 @sm:p-6 @md:p-8" />
                    </div>
                  ))}
                </div>
              }
              value={addons}
            >
              {(accessories) => {
                const displayAccessories = accessories;

                return displayAccessories.map((accessory) => (
                  <button
                    aria-label={`View ${accessory.title} details`}
                    className="group relative z-30 cursor-pointer overflow-hidden rounded-2xl bg-transparent border-none p-0 @container"
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
                    <div className="absolute bottom-2 left-1.5 right-1.5 z-40 transform translate-y-full opacity-0 bg-[#F92F7B] text-white px-2 py-1 text-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-105 rounded-lg shadow-lg @sm:bottom-3 @sm:left-2 @sm:right-2">
                      <p className="text-[9px] font-medium leading-tight truncate @sm:text-[10px]">
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
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          product={selectedProduct}
        />
      )}
    </section>
  );
}