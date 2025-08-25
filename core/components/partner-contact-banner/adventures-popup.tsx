'use client';

import React, { useState } from 'react';

import { Image } from '~/components/image';
import { blurDataURLs } from '~/lib/generate-blur-placeholder';

import SlideUpPopup from '../ui/slide-up-popup';

interface AdventuresPopupProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}

export default function AdventuresPopup({ isOpen, onClose, id }: AdventuresPopupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // TODO: Implement email subscription logic

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      onClose();
    }, 1000);
  };

  return (
    <SlideUpPopup
      className="overflow-hidden transition-all duration-300 ease-out"
      id={id}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="relative h-full">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Ryddo adventure - person on electric bike"
            blurDataURL={blurDataURLs['super73-girl']}
            className="object-cover object-top transition-all duration-300 ease-out"
            fill
            placeholder="blur"
            priority
            quality={80}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, (max-width: 1280px) 70vw, 60vw"
            src="/images/backgrounds/super73-girl.webp"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex h-full">
          <div className="flex flex-1 items-center transition-all duration-300 ease-out xl:pl-12">
            <div className="w-full max-w-sm p-4 transition-all duration-300 ease-out sm:p-6 md:max-w-md md:p-8 lg:max-w-lg lg:p-12">
              <h3 className="mb-3 text-lg font-bold transition-all duration-300 ease-out md:mb-4 lg:text-xl">
                <span className="text-[#F92F7B]">Interested in a free ryddo adventure?</span>
              </h3>

              <p className="mb-3 text-sm font-medium leading-relaxed text-gray-600 transition-all duration-300 ease-out md:mb-4 md:text-base lg:mb-5">
                Get notified about upcoming free ryddo adventures and test out our favorite electric
                rides on incredible day journeys in L.A. and O.C. Trips include the Pasadena hills,
                the Westside, L.A. River bike path, Griffith park, and Newport Back bay.
              </p>

              <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
                <input
                  className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F92F7B] md:px-5 md:py-3 md:text-base"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  required
                  type="email"
                  value={email}
                />
                <button
                  className="h-10 w-full rounded-full bg-[#F92F7B] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#e01a6a] disabled:opacity-50 md:h-11 md:px-5 md:py-3 md:text-base"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Submitting...' : 'Register'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Section - Empty space that gets smaller as screen narrows */}
          <div className="w-0 transition-all duration-300 ease-out md:w-1/4 lg:w-1/3 xl:w-2/5">
            {/* This section provides space for the background image on the right */}
          </div>
        </div>
      </div>
    </SlideUpPopup>
  );
}
