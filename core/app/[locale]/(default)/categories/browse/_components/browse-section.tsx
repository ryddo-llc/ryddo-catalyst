'use client';

import { clsx } from 'clsx';
import { forwardRef, type ReactNode } from 'react';

import {
  Carousel,
  CarouselButtons,
  CarouselContent,
  CarouselDots,
} from '@/vibes/soul/primitives/carousel';

import { BrowseCardSkeleton } from './browse-card';

export interface BrowseSectionProps {
  title: string;
  highlightWord?: string;
  subtitle: string;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export const BrowseSection = forwardRef<HTMLDivElement, BrowseSectionProps>(
  function BrowseSection(
    { title, highlightWord, subtitle, loading = false, children, className },
    ref,
  ) {
    return (
      <section
        className={clsx('scroll-mt-24 py-8 md:py-12', className)}
        ref={ref}
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-6 text-center">
            <h2 className="font-[family-name:var(--font-family-heading)] text-3xl font-bold md:text-4xl">
              {highlightWord ? (
                <>
                  {title}{' '}
                  <span className="italic text-[hsl(var(--primary))]">
                    {highlightWord}
                  </span>
                </>
              ) : (
                title
              )}
            </h2>
            <p className="mt-2 font-[family-name:var(--font-family-body)] text-base text-[hsl(var(--contrast-400))] md:text-lg">
              {subtitle}
            </p>
          </div>

          {/* Carousel */}
          {loading ? (
            <div>
              <div className="flex justify-end pb-3">
                <div className="flex gap-2 opacity-30">
                  <div className="h-6 w-6 rounded bg-[hsl(var(--contrast-200))]" />
                  <div className="h-6 w-6 rounded bg-[hsl(var(--contrast-200))]" />
                </div>
              </div>
              <div className="-ml-4 flex">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    className="min-w-0 shrink-0 grow-0 basis-full pl-4 @sm:basis-1/2 @md:basis-1/3 @4xl:basis-1/4"
                    key={i}
                  >
                    <BrowseCardSkeleton />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    className="h-2.5 w-2.5 animate-pulse rounded-full bg-[hsl(var(--contrast-200))]"
                    key={i}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Carousel>
              <div className="flex justify-end pb-3">
                <CarouselButtons />
              </div>
              <CarouselContent>
                {children}
              </CarouselContent>
              <CarouselDots className="mt-6" />
            </Carousel>
          )}
        </div>
      </section>
    );
  },
);
