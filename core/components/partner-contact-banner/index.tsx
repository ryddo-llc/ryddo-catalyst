'use client';

import type { StaticImageData } from 'next/image';
import React, { useRef, useState } from 'react';

import { Image } from '../image';
import { Link } from '../link';

import AdventuresPopup from './adventures-popup';
import BookNowPopup from './book-now-popup';
import cake from './brand-logos/cake-logo.svg';
import minimotors from './brand-logos/Minimotors-logo1.svg';
import super73 from './brand-logos/super-73-logo.svg';

interface BrandProps {
  image: string | StaticImageData;
  name: string;
}

type PopupType = 'adventures' | 'booknow' | null;

export default function PartnersContactBar() {
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const brands: BrandProps[] = [
    { name: 'Super73', image: super73 },
    { name: 'Cake', image: cake },
    { name: 'MiniMotors', image: minimotors },
  ];

  const POPUP_TRANSITION_DURATION = 225;

  const openPopup = (popupType: PopupType) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    if (activePopup === popupType) {
      setActivePopup(null);
    } else if (activePopup && activePopup !== popupType) {
      setActivePopup(null);
      timeoutRef.current = setTimeout(() => {
        setActivePopup(popupType);
      }, POPUP_TRANSITION_DURATION);
    } else {
      setActivePopup(popupType);
    }
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <section className="sticky bottom-0 left-0 right-0 z-50 flex w-full flex-col items-stretch bg-black text-xs font-bold text-white sm:text-sm lg:flex-row">
      {/* Mobile Layout - Two buttons side by side */}
      <div className="flex w-full md:hidden">
        {/* Adventures Button - Mobile */}
        <button 
          className="flex h-12 w-1/2 items-center justify-center border-r border-white px-3 transition-colors duration-200 hover:bg-[#F92F7B]"
          onClick={() => openPopup('adventures')}
        >
          <div className="h-auto whitespace-nowrap p-0 text-center text-white">
            <span>Free adventures</span>
            <span className="ml-1 text-[#F92F7B]">^</span>
          </div>
        </button>

        {/* Book Now Button - Mobile */}
        <button
          className="flex h-12 w-1/2 items-center justify-center bg-[#F92F7B] transition-colors duration-200 hover:bg-[#d41f63]"
          onClick={() => openPopup('booknow')}
        >
          <span className="font-bold">Book Now</span>
        </button>
      </div>

      {/* Desktop/Tablet Layout */}
      {/* Newsletter Signup Section - Hidden on mobile */}
      <button 
        className="xl:px-18 hidden h-12 items-center justify-center border-b border-white px-3 transition-colors duration-200 hover:bg-[#F92F7B] md:flex md:h-16 md:border-b-0 md:border-r md:px-10 lg:px-12"
        onClick={() => openPopup('adventures')}
      >
        <div className="h-auto whitespace-nowrap p-0 text-center text-white">
          <span className="hidden lg:inline">Sign up for Free ryddo adventures</span>
          <span className="md:inline lg:hidden">Free adventures</span>
          <span className="ml-1 text-[#F92F7B]">^</span>
        </div>
      </button>

      {/* Partners/Brands Section - Hidden on mobile */}
      <div className="hidden min-h-[48px] flex-1 items-center justify-center gap-3 px-3 py-2 md:flex md:min-h-[64px] md:gap-8 md:px-8 md:py-0 lg:gap-12 lg:px-10 xl:gap-20 2xl:gap-32">
        {brands.map((brand: BrandProps) => (
          <Link
            className="h-auto flex-shrink-0 p-0 transition-opacity duration-200 hover:bg-transparent hover:opacity-80"
            href="/products"
            key={brand.name}
          >
            <Image
              alt={brand.name}
              className="h-auto w-16 max-w-[124px] md:w-24 lg:w-28 xl:w-32"
              height={20}
              src={brand.image}
              width={80}
            />
          </Link>
        ))}
      </div>

      {/* Contact Actions Section - Hidden on mobile */}
      <div className="hidden w-full md:flex lg:w-auto">
        {/* Phone Number */}
        <div className="flex h-12 w-1/2 items-center justify-center border-l border-white transition-colors duration-200 hover:bg-[#F92F7B] sm:h-14 md:h-16 lg:w-44 xl:w-52 2xl:w-60">
          <Link className="px-2 text-center" href="tel:3236767433">
            <span>323.676.7433</span>
          </Link>
        </div>

        {/* Book Now Button - Desktop/Tablet */}
        <button
          className="flex h-12 w-1/2 items-center justify-center bg-[#F92F7B] transition-colors duration-200 hover:bg-[#d41f63] sm:h-14 md:h-16 lg:w-44 xl:w-52 2xl:w-60"
          onClick={() => openPopup('booknow')}
        >
          <span className="font-bold">Book Now</span>
        </button>
      </div>
      
      {/* Adventures Popup */}
      <AdventuresPopup 
        isOpen={activePopup === 'adventures'} 
        onClose={closePopup} 
      />
      
      {/* Book Now Popup */}
      <BookNowPopup 
        isOpen={activePopup === 'booknow'} 
        onClose={closePopup} 
      />
    </section>
  );
}
