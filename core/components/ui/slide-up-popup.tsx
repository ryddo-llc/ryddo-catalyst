'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SlideUpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export default function SlideUpPopup({
  isOpen,
  onClose,
  children,
  className = '',
  id,
  ariaLabel,
  ariaLabelledBy
}: SlideUpPopupProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevActiveEl = useRef<HTMLElement | null>(null);

  const ANIMATION_DURATION = 300;
  const DOM_UPDATE_DELAY = 5;

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      const activeElement = document.activeElement;

      if (activeElement instanceof HTMLElement) {
        prevActiveEl.current = activeElement;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // focus the dialog for SR/keyboard users
      dialogRef.current.focus();
    }

    if (!isOpen && prevActiveEl.current) {
      // restore focus to the trigger
      prevActiveEl.current.focus();
      prevActiveEl.current = null;
    }
  }, [isOpen]);

  // Handle popup opening/closing animations
  useEffect(() => {
    if (isOpen) {
      // Opening: render component first, then trigger animation
      setShouldRender(true);
      
      // Small delay to ensure DOM is updated before starting animation
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, DOM_UPDATE_DELAY);

      return () => clearTimeout(timer);
    }
    
    // Closing: trigger animation first, then remove from DOM
    setIsAnimating(false);

    // Wait for animation to complete before unmounting
    const closeTimer = setTimeout(() => {
      setShouldRender(false);
    }, ANIMATION_DURATION);

    return () => clearTimeout(closeTimer);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Container positioned above footer with overflow hidden to prevent visual overlap */}
      <div 
        className="fixed left-0 right-0 z-[60] pointer-events-none overflow-hidden" 
        style={{ bottom: 'calc(var(--partner-bar-h, 64px) + env(safe-area-inset-bottom))', top: '0' }}
      >
        {/* Slide-up popup wrapper */}
        <div 
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-modal="true"
          className={`
          absolute bottom-0 left-0 right-0
          bg-white text-black pointer-events-auto
          transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          ${className}
        `} 
          {...(id && { id })}
          ref={dialogRef}
          role="dialog"
          style={{ 
            overflow: 'visible',
            transformOrigin: 'bottom'
          }}
          tabIndex={-1}
        >
          <div className="relative">
            {/* Close button */}
            <button
              aria-label="Close popup"
              className={`absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 border border-primary text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 shadow-lg bg-white z-50 transform w-10 h-10 sm:w-12 sm:h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isAnimating ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
              onClick={onClose}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </button>

            {/* Popup content with mobile height constraints */}
            <div className={`
              transform transition-all duration-300 ease-in-out 
              ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              max-h-[85vh] sm:max-h-[90vh] md:max-h-none 
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