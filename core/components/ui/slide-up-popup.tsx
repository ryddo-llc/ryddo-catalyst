'use client';

import React, { useEffect, useState } from 'react';

interface SlideUpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function SlideUpPopup({ 
  isOpen, 
  onClose, 
  children, 
  className = '' 
}: SlideUpPopupProps) {
  const [shouldRender, setShouldRender] = useState(false);  
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle popup opening/closing animations
  useEffect(() => {
    if (isOpen) {
      // Opening: render component first, then trigger animation
      setShouldRender(true);
      
      // Small delay to ensure DOM is updated before starting animation
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 5);

      return () => clearTimeout(timer);
    }
    
    // Closing: trigger animation first, then remove from DOM
    setIsAnimating(false);

    // Wait for animation to complete before unmounting
    const closeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 200);

    return () => clearTimeout(closeTimer);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Container positioned above footer with overflow hidden to prevent visual overlap */}
      <div 
        className="fixed left-0 right-0 z-40 pointer-events-none overflow-hidden" 
        style={{ bottom: '64px', top: '0' }}
      >
        {/* Slide-up popup wrapper */}
        <div className={`
        absolute bottom-0 left-0 right-0
        bg-white text-black pointer-events-auto
        transform transition-all duration-250 ease-in-out
        ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        ${className}
      `} style={{ 
          overflow: 'visible',
          transformOrigin: 'bottom'
        }}>
          <div className="relative">
            {/* Close button */}
            <button
              aria-label="Close popup"
              className={`absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 border border-[#F92F7B] text-[#F92F7B] rounded-full flex items-center justify-center hover:bg-[#F92F7B] hover:text-white transition-all duration-200 shadow-lg bg-white z-50 transform w-10 h-10 sm:w-12 sm:h-12 ${isAnimating ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
              onClick={onClose}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </button>

            {/* Popup content with mobile height constraints */}
            <div className={`
              transform transition-all duration-200 ease-in-out 
              ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              max-h-[70vh] sm:max-h-[80vh] md:max-h-none 
              overflow-y-auto md:overflow-y-visible
            `}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 