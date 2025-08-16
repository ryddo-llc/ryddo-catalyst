'use client';

import { SubmissionResult } from '@conform-to/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { NewsletterForm } from '@/vibes/soul/primitives/newsletter-form';
import { Image } from '~/components/image';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export function Subscribe({
  action,
  description,
  emailPlaceholder,
  image,
  namePlaceholder,
  submitLabel,
  title,
}: {
  action: Action<{ lastResult: SubmissionResult | null; successMessage?: string }, FormData>;
  description?: string;
  emailPlaceholder?: string;
  image?: { src: string; alt: string };
  namePlaceholder?: string;
  submitLabel?: string;
  title: string;
}) {
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check screen size
  useEffect(() => {
    const checkScreen = () => setIsTabletOrLarger(window.innerWidth >= 768);
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Parallax effect
  const handleScroll = useCallback(() => {
    if (!isTabletOrLarger || !image || !isImageLoaded) return;

    // Cancel previous animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Set scrolling state for will-change optimization
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      
      // Calculate offset from center of viewport
      const distanceFromCenter = elementCenter - windowCenter;
      const speed = 0.3; // Reduced speed for smoother effect
      const maxOffset = 100; // Maximum offset to prevent excessive movement
      
      // Calculate parallax with clamping
      const yPos = Math.max(-maxOffset, Math.min(maxOffset, distanceFromCenter * speed));
      
      setParallaxOffset(yPos);
    });

    // Remove will-change after scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [isTabletOrLarger, image, isImageLoaded]);

  useEffect(() => {
    if (!isTabletOrLarger || !image || !isImageLoaded) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [handleScroll, isTabletOrLarger, image, isImageLoaded]);

  // Lazy load background image
  useEffect(() => {
    if (!image) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isImageLoaded) {
            // Preload image before setting loaded state
            const img = new window.Image();
            
            img.onload = () => setIsImageLoaded(true);
            img.src = image.src;
          }
        });
      },
      { rootMargin: '200px' }
    );

    const currentSection = sectionRef.current;
    
    if (currentSection) {
      observer.observe(currentSection);
      
      return () => {
        observer.unobserve(currentSection);
      };
    }
  }, [image, isImageLoaded]);

  return (
    <section
      className={`w-full h-[60vh] overflow-hidden relative flex items-center justify-center ${!image ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : ''}`}
      ref={sectionRef}
    >
      {/* Parallax Background Layer */}
      {image && (
        <div className="absolute inset-0 w-full h-full">
          {isImageLoaded ? (
            <div
              className="absolute w-full bg-cover bg-center"
              style={{
                transform: isTabletOrLarger 
                  ? `translate3d(0, ${parallaxOffset}px, 0)` 
                  : 'none',
                willChange: isScrolling ? 'transform' : 'auto',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                height: '120%',
                top: '-10%',
                backgroundImage: `url(${image.src})`,
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
        </div>
      )}

      {/* Content Container - Static position */}
      <div className="relative z-10 flex flex-col justify-center w-full max-w-lg min-h-[300px] max-h-[350px] pb-8 rounded-[10px] mx-4 sm:mx-auto overflow-hidden shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.30)]">
        {/* Form Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            alt="Newsletter form background"
            aria-hidden="true"
            className="object-cover"
            fill
            loading="lazy"
            priority={false}
            sizes="(max-width: 768px) 100vw, 768px"
            src="/images/backgrounds/newsletter-form.webp"
            style={{
              objectPosition: 'center',
            }}
          />
        </div>

        {/* Content */}
        <div 
          aria-label="Newsletter subscription" 
          className="relative z-[1] flex flex-col items-center justify-center px-4 py-4 font-['Nunito']" 
          role="region"
        >
          <div className="text-center mb-6">
            <h2 
              className="text-3xl md:text-4xl font-extrabold leading-[48px] text-gray-800 mb-2" 
              id="newsletter-title"
            >
              {title}
              <span className="text-[#F92F7B] w-5 h-24 text-6xl font-bold">
                .
              </span>
            </h2>
            <p className="pb-5 text-center justify-center text-neutral-500 text-sm font-semibold leading-loose">
              {description}
            </p>
          </div>

          <div className="w-full flex items-center justify-center">
            <NewsletterForm 
              action={action} 
              className="w-full" 
              emailPlaceholder={emailPlaceholder}
              namePlaceholder={namePlaceholder}
              submitLabel={submitLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}