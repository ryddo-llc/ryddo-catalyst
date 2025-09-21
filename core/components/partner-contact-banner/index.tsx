'use client';

import React, { useRef, useState } from 'react';

import { Streamable, useStreamable } from '@/vibes/soul/lib/streamable';

import { Link } from '../link';

import AdventuresPopup from './adventures-popup';
import BookNowPopup from './book-now-popup';

interface Banner {
  entityId: number;
  name: string;
  content: string;
  location: 'TOP' | 'BOTTOM';
}

interface BannersData {
  topBanners: Banner[];
  bottomBanners: Banner[];
}

interface PartnersContactBarProps {
  banners?: Streamable<BannersData>;
}

type PopupType = 'adventures' | 'booknow' | null;

export default function PartnersContactBar({ banners }: PartnersContactBarProps = {}) {
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use the streamable hook to get banner data
  const bannersData = useStreamable(banners);
  const bottomBanners = bannersData?.bottomBanners || [];

  const POPUP_TRANSITION_DURATION = 300;
  const ADVENTURES_DIALOG_ID = 'adventures-popup';
  const BOOKNOW_DIALOG_ID = 'booknow-popup';

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
    <section className="sticky bottom-0 left-0 right-0 z-50 flex w-full flex-col items-stretch bg-black pb-[env(safe-area-inset-bottom)] text-sm font-bold text-white [--partner-bar-h:3rem] md:flex-row md:[--partner-bar-h:3rem]">
      {/* Mobile Layout - Two buttons side by side */}
      <div className="flex w-full md:hidden">
        {/* Adventures Button - Mobile */}
        <button
          aria-controls={ADVENTURES_DIALOG_ID}
          aria-haspopup="dialog"
          className="group flex h-12 w-1/2 items-center justify-center border-r border-white px-3 transition-colors duration-200 hover:bg-[#F92F7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          data-state={activePopup === 'adventures' ? 'open' : 'closed'}
          onClick={() => openPopup('adventures')}
          type="button"
        >
          <div className="h-auto whitespace-nowrap p-0 text-center text-white">
            <span className="font-kanit font-black uppercase italic tracking-wider">
              Sign up for free ryddo
            </span>
            <span
              aria-hidden="true"
              className="ml-1 text-[#F92F7B] transition-transform group-data-[state=open]:rotate-180"
            >
              ^
            </span>
          </div>
        </button>

        {/* Book Now Button - Mobile */}
        <button
          aria-controls={BOOKNOW_DIALOG_ID}
          aria-haspopup="dialog"
          className="flex h-12 w-1/2 items-center justify-center bg-[#F92F7B] transition-colors duration-200 hover:bg-[#d41f63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          data-state={activePopup === 'booknow' ? 'open' : 'closed'}
          onClick={() => openPopup('booknow')}
          type="button"
        >
          <span className="font-kanit font-black uppercase italic tracking-wider">
            Book Test Ride
          </span>
        </button>
      </div>

      {/* Desktop/Tablet Layout */}
      {/* Newsletter Signup Section - Hidden on mobile */}
      <button
        aria-controls={ADVENTURES_DIALOG_ID}
        aria-haspopup="dialog"
        className="group hidden h-12 items-center justify-center border-b border-white px-2 transition-colors duration-200 hover:bg-[#F92F7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2 focus-visible:ring-offset-black md:flex md:border-b-0 md:border-r md:px-3 lg:px-6 xl:px-8"
        data-state={activePopup === 'adventures' ? 'open' : 'closed'}
        onClick={() => openPopup('adventures')}
        type="button"
      >
        <div className="h-auto whitespace-nowrap p-0 text-center text-white">
          <span className="hidden font-kanit font-black uppercase italic tracking-wider xl:inline">
            Sign up for Free ryddo adventures
          </span>
          <span className="hidden font-kanit font-black uppercase italic tracking-wider lg:inline xl:hidden">
            Free ryddo adventures
          </span>
          <span className="font-kanit font-black uppercase italic tracking-wider md:inline lg:hidden">
            Free adventures
          </span>
          <span
            aria-hidden="true"
            className="ml-1 text-[#F92F7B] transition-transform group-data-[state=open]:rotate-180"
          >
            ^
          </span>
        </div>
      </button>

      {/* Banner Text Section - Hidden on mobile */}
      <div className="hidden min-h-[48px] flex-1 items-center justify-center gap-x-4 px-2 py-2 md:flex md:gap-x-6 md:px-3 md:py-0 lg:px-4 xl:px-6 2xl:px-8">
        {bottomBanners.map((banner: Banner) => (
          <div
            className="text-md lg:text-md flex-shrink-0 font-kanit font-black italic tracking-wider text-white transition-opacity duration-200 hover:opacity-80 md:text-base"
            key={banner.entityId}
          >
            {banner.name.toLocaleUpperCase()} -{' '}
            <span className="font-inter font-light"> LEARN MORE</span>
          </div>
        ))}
      </div>

      {/* Contact Actions Section - Hidden on mobile */}
      <div className="hidden w-auto md:flex">
        {/* Phone Number */}
        <div className="hidden h-12 w-32 lg:flex lg:w-44 xl:w-48 2xl:w-52">
          <Link
            aria-label="Call ryddo at 323-676-7433"
            className="flex h-full w-full items-center justify-center border-l border-white px-2 text-xs font-bold transition-colors duration-200 hover:bg-[#F92F7B] hover:text-white md:text-sm"
            href="tel:+13236767433"
          >
            <span className="font-kanit font-black italic tracking-wider">323.676.7433</span>
          </Link>
        </div>

        {/* Book Now Button - Desktop/Tablet */}
        <button
          aria-controls={BOOKNOW_DIALOG_ID}
          aria-haspopup="dialog"
          className="flex h-12 w-32 items-center justify-center bg-[#F92F7B] px-2 text-xs transition-colors duration-200 hover:bg-[#d41f63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2 focus-visible:ring-offset-black md:w-40 md:border-l md:border-white md:text-sm lg:w-44 xl:w-48 2xl:w-52"
          data-state={activePopup === 'booknow' ? 'open' : 'closed'}
          onClick={() => openPopup('booknow')}
          type="button"
        >
          <span className="font-kanit font-black uppercase italic tracking-wider">
            Book Test Ride
          </span>
        </button>
      </div>

      {/* Adventures Popup */}
      <AdventuresPopup
        id={ADVENTURES_DIALOG_ID}
        isOpen={activePopup === 'adventures'}
        onClose={closePopup}
      />

      {/* Book Now Popup */}
      <BookNowPopup
        id={BOOKNOW_DIALOG_ID}
        isOpen={activePopup === 'booknow'}
        onClose={closePopup}
      />
    </section>
  );
}
