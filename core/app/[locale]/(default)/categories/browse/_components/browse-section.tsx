'use client';

import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

import {
  Carousel,
  CarouselButtons,
  CarouselContent,
  CarouselDots,
} from '@/vibes/soul/primitives/carousel';
import { Link } from '~/components/link';

import { BrowseCardSkeleton } from './browse-card';

export interface BrowseSectionProps {
  title: string;
  highlightWord?: string;
  subtitle: string;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  seeAllHref?: string;
}

const sectionStyle: CSSProperties & { '--carousel-light-button'?: string } = {
  '--carousel-light-button': 'hsl(337 94% 58%)',
};

export const BrowseSection = forwardRef<HTMLDivElement, BrowseSectionProps>(
  function BrowseSection(
    { title, highlightWord, subtitle, loading = false, children, className, seeAllHref },
    ref,
  ) {
    return (
      <section
        className={clsx('scroll-mt-24 py-8 md:py-12', className)}
        ref={ref}
        style={sectionStyle}
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-6 text-center">
            <h2 className="font-body text-[2.3rem] font-extrabold text-black md:text-[3rem]">
              {highlightWord ? (
                <>
                  {title}{' '}
                  <span className="text-[hsl(var(--primary))]">
                    {highlightWord}
                  </span>
                </>
              ) : (
                title
              )}
            </h2>
            <p className="mt-2 font-body text-base font-normal text-black md:text-lg">
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
              <div className="flex items-center justify-between pb-3">
                <CarouselButtons />
                {seeAllHref ? (
                  <Link
                    className="group inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[hsl(var(--primary))] transition-colors hover:underline"
                    href={seeAllHref}
                  >
                    See All
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                ) : null}
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
