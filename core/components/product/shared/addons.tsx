'use client';

import useEmblaCarousel from 'embla-carousel-react';
import React, { useCallback, useEffect, useState } from 'react';

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

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 480px)': { slidesToScroll: 2 },
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 4 },
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className="relative mb-16 w-full overflow-hidden bg-white bg-gradient-to-br py-12 @container @sm:mb-20 @sm:py-16 @lg:mb-24 @lg:py-20">
      {/* Background Text - positioned directly behind addon grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[calc(50%-4rem)] z-0 flex items-center justify-center overflow-hidden @sm:top-[calc(50%-5rem)] @md:top-[calc(50%-6rem)]"
      >
        <span className="select-none whitespace-nowrap font-kanit text-[296px] font-black uppercase italic tracking-[0.01em] text-gray-200 opacity-40 transition-opacity duration-300 @xs:text-[8rem] @xs:opacity-45 @sm:text-[9rem] @sm:opacity-50 @md:text-[12vw] @md:opacity-60 @lg:text-[14vw] @lg:opacity-65 @xl:text-[16vw] @xl:opacity-70">
          {backgroundText}
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center font-kanit @sm:px-6 @lg:px-8">
        {/* Title */}
        <h2 className="mb-3 text-xl font-extrabold text-gray-900 @xs:text-2xl @sm:mb-4 @sm:text-2xl @md:mb-5 @md:text-3xl @lg:mb-6 @lg:text-4xl @xl:text-5xl">
          {titleText}
          <br />
          <span className="-mt-2 block text-[#F92F7B] @xs:-mt-3 @sm:-mt-4 @md:-mt-6 @lg:-mt-8">
            new {name}
            <span className="text-black">.</span>
          </span>
        </h2>

        {/* Carousel Container with Desktop Navigation */}
        <div className="relative z-20">
          {/* Left Arrow */}
          <Image
            alt="Previous"
            className="absolute -left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:-translate-x-1 hover:scale-110 @md:block @md:h-10 @md:w-10 @lg:-left-4 @lg:h-12 @lg:w-12 @xl:-left-8 @xl:h-16 @xl:w-16 @2xl:-left-12 @2xl:h-20 @2xl:w-20"
            height={60}
            onClick={scrollPrev}
            src="/icons/arrow-left.svg"
            width={60}
          />

          {/* Right Arrow */}
          <Image
            alt="Next"
            className="absolute -right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:translate-x-1 hover:scale-110 @md:block @md:h-10 @md:w-10 @lg:-right-4 @lg:h-12 @lg:w-12 @xl:-right-8 @xl:h-16 @xl:w-16 @2xl:-right-12 @2xl:h-20 @2xl:w-20"
            height={60}
            onClick={scrollNext}
            src="/icons/arrow-right.svg"
            width={60}
          />

          {/* Embla Carousel Viewport */}
          <div className="embla overflow-hidden @lg:px-16 @xl:px-20" ref={emblaRef}>
            <Stream
              fallback={
                <div className="embla__container flex gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      className="embla__slide min-w-[calc(50%-0.5rem)] @xs:min-w-[calc(33.333%-0.667rem)] @sm:min-w-[calc(25%-0.75rem)] @md:min-w-[calc(20%-0.8rem)] @lg:min-w-[calc(16.667%-0.667rem)]"
                      key={index}
                    >
                      <div className="aspect-square animate-pulse rounded-2xl bg-gray-200" />
                    </div>
                  ))}
                </div>
              }
              value={addons}
            >
              {(accessories) => (
                <div className="embla__container flex gap-4">
                  {accessories.map((accessory) => (
                    <div
                      className="embla__slide min-w-[calc(50%-0.5rem)] @xs:min-w-[calc(33.333%-0.667rem)] @sm:min-w-[calc(25%-0.75rem)] @md:min-w-[calc(20%-0.8rem)] @lg:min-w-[calc(16.667%-0.667rem)]"
                      key={accessory.id}
                    >
                      <button
                        aria-label={`View ${accessory.title} details`}
                        className="group relative z-30 min-h-[44px] w-full cursor-pointer touch-manipulation overflow-hidden rounded-2xl border-none bg-transparent p-0 transition-transform @container active:scale-95"
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
                          className="relative z-20 aspect-square w-full rounded-2xl object-contain p-4 transition-transform duration-300 group-hover:scale-105 @sm:p-6 @md:p-8"
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
                    </div>
                  ))}
                </div>
              )}
            </Stream>
          </div>
        </div>

        {/* Mobile Pagination Dots */}
        <div className="mt-6 flex items-center justify-center gap-2 @lg:hidden">
          {scrollSnaps.map((_, index) => (
            <button
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === selectedIndex ? 'w-6 bg-[#F92F7B]' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              key={index}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>

        {/* Mobile Swipe Instruction */}
        <p className="mt-4 text-center text-sm text-gray-500 @lg:hidden">Swipe to see more</p>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal isOpen={isModalOpen} onClose={handleModalClose} product={selectedProduct} />
      )}
    </section>
  );
}
