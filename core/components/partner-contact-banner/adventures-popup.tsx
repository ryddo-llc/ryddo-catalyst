'use client';

import React, { useState } from 'react';

import { Image } from '~/components/image';

import SlideUpPopup from '../ui/slide-up-popup';

interface AdventuresPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdventuresPopup({ isOpen, onClose }: AdventuresPopupProps) {
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
      isOpen={isOpen} 
      onClose={onClose}
    >
      <div className="relative h-full">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Ryddo adventure - person on electric bike"
            className="object-cover object-top object-right transition-all duration-300 ease-out"
            fill
            priority
            src="/images/backgrounds/super73-girl.webp"
          />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex h-full">
          <div className="flex-1 flex items-center xl:pl-12 transition-all duration-300 ease-out">
            <div className="max-w-sm md:max-w-md lg:max-w-lg w-full p-4 sm:p-6 md:p-8 lg:p-12 transition-all duration-300 ease-out">
              <h3 className="text-lg lg:text-xl font-bold mb-3 md:mb-4 transition-all duration-300 ease-out">
                <span className="text-[#F92F7B]">Interested in a free ryddo adventure?</span>
              </h3>
            
              <p className="text-gray-600 text-sm md:text-base font-medium mb-3 md:mb-4 lg:mb-5 leading-relaxed transition-all duration-300 ease-out">
                Get notified about upcoming free ryddo adventures and test out our favorite electric rides on incredible day journeys in L.A. and O.C. Trips include the Pasadena hills, the Westside, L.A. River bike path, Griffith park, and Newport Back bay.
              </p>

              <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
                <input
                  className="w-full px-4 md:px-5 py-2 md:py-3 border border-gray-300 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#F92F7B] focus:border-transparent transition-all duration-200"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  required
                  type="email"
                  value={email}
                />
                <button
                  className="w-full bg-[#F92F7B] text-white font-semibold py-2 md:py-3 px-4 md:px-5 rounded-full text-sm md:text-base hover:bg-[#e01a6a] transition-colors duration-200 h-10 md:h-11 disabled:opacity-50"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Submitting..." : "Register"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Section - Empty space that gets smaller as screen narrows */}
          <div className="w-0 md:w-1/4 lg:w-1/3 xl:w-2/5 transition-all duration-300 ease-out">
            {/* This section provides space for the background image on the right */}
          </div>
        </div>
      </div>
    </SlideUpPopup>
  );
} 