'use client';

import { clsx } from 'clsx';
import { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { SlideItem } from './slide-item';
import { Slide } from './types';

interface Props {
  slides: Slide[];
  playOnInit?: boolean;
  interval?: number;
  className?: string;
}

interface UseProgressButtonType {
  selectedIndex: number;
  scrollSnaps: number[];
  onProgressButtonClick: (index: number) => void;
}

const useProgressButton = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void,
): UseProgressButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onProgressButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      if (onButtonClick) onButtonClick(emblaApi);
    },
    [emblaApi, onButtonClick],
  );

  const onInit = useCallback((emblaAPI: EmblaCarouselType) => {
    setScrollSnaps(emblaAPI.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaAPI: EmblaCarouselType) => {
    setSelectedIndex(emblaAPI.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onProgressButtonClick,
  };
};

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --slideshow-focus: hsl(var(--primary));
 *   --slideshow-mask: hsl(var(--foreground) / 80%);
 *   --slideshow-background: color-mix(in oklab, hsl(var(--primary)), black 75%);
 *   --slideshow-title: hsl(var(--background));
 *   --slideshow-title-font-family: var(--font-family-heading);
 *   --slideshow-description: hsl(var(--background) / 80%);
 *   --slideshow-description-font-family: var(--font-family-body);
 *   --slideshow-pagination: hsl(var(--background));
 *   --slideshow-play-border: hsl(var(--contrast-300) / 50%);
 *   --slideshow-play-border-hover: hsl(var(--contrast-300) / 80%);
 *   --slideshow-play-text: hsl(var(--background));
 *   --slideshow-number: hsl(var(--background));
 *   --slideshow-number-font-family: var(--font-family-mono);
 * }
 * ```
 */
export function Slideshow({ slides, playOnInit = true, interval = 5000, className }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 }, [
    Autoplay({ delay: interval, playOnInit }),
    Fade(),
  ]);
  const { selectedIndex, scrollSnaps, onProgressButtonClick } = useProgressButton(emblaApi);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;

    playOrStop();
  }, [emblaApi]);

  const resetAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    autoplay.reset();
  }, [emblaApi]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    emblaApi
      .on('autoplay:play', () => {
        setIsPlaying(true);
        setPlayCount(playCount + 1);
      })
      .on('autoplay:stop', () => {
        setIsPlaying(false);
      })
      .on('reInit', () => {
        setIsPlaying(autoplay.isPlaying());
      });
  }, [emblaApi, playCount]);

  return (
    <section
      aria-labelledby="hero-heading"
      className={clsx(
        'relative flex h-[45vh] w-full items-center @container md:h-[50vh] lg:h-[60vh]',
        className,
      )}
    >
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, idx) => (
            <SlideItem index={idx} key={idx} selectedIndex={selectedIndex} slide={slide} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 flex w-full max-w-screen-2xl -translate-x-1/2 flex-wrap items-center px-4 @xl:bottom-6 @xl:px-6 @4xl:px-8">
        {/* Progress Buttons */}
        {scrollSnaps.map((_: number, index: number) => {
          return (
            <button
              aria-label={`View image number ${index + 1}`}
              className="rounded-lg px-1.5 py-2 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-[var(--slideshow-focus,hsl(var(--primary)))]"
              key={index}
              onClick={() => {
                onProgressButtonClick(index);
                resetAutoplay();
              }}
            >
              <div className="relative overflow-hidden">
                {/* White Bar - Current Index Indicator / Progress Bar */}
                <div
                  className={clsx(
                    'absolute h-0.5 bg-[var(--slideshow-pagination,hsl(var(--background)))]',
                    'opacity-0 fill-mode-forwards',
                    isPlaying ? 'running' : 'paused',
                    index === selectedIndex
                      ? 'opacity-100 ease-linear animate-in slide-in-from-left'
                      : 'ease-out animate-out fade-out',
                  )}
                  key={`progress-${playCount}`} // Force the animation to restart when pressing "Play", to match animation with embla's autoplay timer
                  style={{
                    animationDuration: index === selectedIndex ? `${interval}ms` : '200ms',
                    width: `${150 / slides.length}px`,
                  }}
                />
                {/* Grey Bar BG */}
                <div
                  className="h-0.5 bg-[var(--slideshow-pagination,hsl(var(--background)))] opacity-30"
                  style={{ width: `${150 / slides.length}px` }}
                />
              </div>
            </button>
          );
        })}

        {/* Carousel Count - "01/03" */}
        <span className="ml-auto mr-3 mt-px font-[family-name:var(--slideshow-number-font-family,var(--font-family-mono))] text-sm text-[var(--slideshow-number,hsl(var(--background)))]">
          {selectedIndex + 1 < 10 ? `0${selectedIndex + 1}` : selectedIndex + 1}/
          {slides.length < 10 ? `0${slides.length}` : slides.length}
        </span>

        {/* Stop / Start Button */}
        <button
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--slideshow-play-border,hsl(var(--contrast-300)/50%))] text-[var(--slideshow-play-text,hsl(var(--background)))] ring-[var(--slideshow-focus)] transition-opacity duration-300 hover:border-[var(--slideshow-play-border-hover,hsl(var(--contrast-300)/80%))] focus-visible:outline-0 focus-visible:ring-2"
          onClick={toggleAutoplay}
          type="button"
        >
          {isPlaying ? (
            <Pause className="pointer-events-none" size={16} strokeWidth={1.5} />
          ) : (
            <Play className="pointer-events-none" size={16} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </section>
  );
}
