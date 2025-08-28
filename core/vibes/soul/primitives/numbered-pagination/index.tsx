'use client';

import cn from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { createSerializer, parseAsString } from 'nuqs';
import { Suspense, useMemo } from 'react';

import { Streamable, useStreamable } from '@/vibes/soul/lib/streamable';
import { Link } from '~/components/link';

export interface CursorPaginationInfo {
  startCursorParamName?: string;
  startCursor?: string | null;
  endCursorParamName?: string;
  endCursor?: string | null;
}

export interface NumberedPaginationInfo extends CursorPaginationInfo {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  pageParamName?: string;
}

interface Props {
  label?: Streamable<string | null>;
  info: Streamable<NumberedPaginationInfo>;
  previousLabel?: Streamable<string | null>;
  nextLabel?: Streamable<string | null>;
  scroll?: boolean;
  maxVisiblePages?: number;
}

export function NumberedPagination(props: Props) {
  return (
    <Suspense fallback={<NumberedPaginationSkeleton />}>
      <NumberedPaginationResolved {...props} />
    </Suspense>
  );
}

function NumberedPaginationResolved({
  label: streamableLabel,
  info,
  previousLabel: streamablePreviousLabel,
  nextLabel: streamableNextLabel,
  scroll,
  maxVisiblePages = 5,
}: Props) {
  const label = useStreamable(streamableLabel) ?? 'pagination';
  const {
    startCursorParamName = 'before',
    endCursorParamName = 'after',
    currentPage,
    totalPages,
    pageParamName = 'page',
  } = useStreamable(info);
  const searchParams = useSearchParams();
  const serialize = createSerializer({
    [startCursorParamName]: parseAsString,
    [endCursorParamName]: parseAsString,
    [pageParamName]: parseAsString,
  });
  const previousLabel = useStreamable(streamablePreviousLabel) ?? 'Go to previous page';
  const nextLabel = useStreamable(streamableNextLabel) ?? 'Go to next page';

  const visiblePages = useMemo(() => {
    const safeMax = Math.max(1, maxVisiblePages);
    
    if (totalPages <= safeMax) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const halfVisible = Math.floor(safeMax / 2);
    let start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, start + safeMax - 1);
    
    if (end === totalPages) {
      start = Math.max(1, end - safeMax + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, maxVisiblePages]);

  return (
    <nav aria-label={label} className="py-10">
      <ul className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        <li>
          {currentPage > 1 ? (
            <PaginationLink
              aria-label={previousLabel}
              href={serialize(searchParams, {
                [pageParamName]: (currentPage - 1).toString(),
                [startCursorParamName]: null,
                [endCursorParamName]: null,
              })}
              rel="prev"
              scroll={scroll}
            >
              <ArrowLeft aria-hidden size={20} strokeWidth={1} />
            </PaginationLink>
          ) : (
            <SkeletonLink>
              <ArrowLeft aria-hidden size={20} strokeWidth={1} />
            </SkeletonLink>
          )}
        </li>

        {/* Page Numbers */}
        {visiblePages.map((pageNumber) => (
          <li key={pageNumber}>
            {pageNumber === currentPage ? (
              <CurrentPageLink pageNumber={pageNumber} />
            ) : (
              <PageNumberLink
                href={serialize(searchParams, {
                  [pageParamName]: pageNumber.toString(),
                  [startCursorParamName]: null,
                  [endCursorParamName]: null,
                })}
                pageNumber={pageNumber}
                scroll={scroll}
              />
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          {currentPage < totalPages ? (
            <PaginationLink
              aria-label={nextLabel}
              href={serialize(searchParams, {
                [pageParamName]: (currentPage + 1).toString(),
                [startCursorParamName]: null,
                [endCursorParamName]: null,
              })}
              rel="next"
              scroll={scroll}
            >
              <ArrowRight aria-hidden size={20} strokeWidth={1} />
            </PaginationLink>
          ) : (
            <SkeletonLink>
              <ArrowRight aria-hidden size={20} strokeWidth={1} />
            </SkeletonLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

function PaginationLink({
  href,
  children,
  scroll,
  'aria-label': ariaLabel,
  rel,
}: {
  href: string;
  children: React.ReactNode;
  scroll?: boolean;
  ['aria-label']?: string;
  rel?: 'prev' | 'next';
}) {
      return (
      <Link
        aria-label={ariaLabel}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border border-contrast-300 text-pink-500 ring-primary transition-colors duration-300 hover:border-contrast-400 hover:bg-contrast-100 focus-visible:outline-0 focus-visible:ring-2',
        )}
        href={href}
        rel={rel}
        scroll={scroll}
      >
        {children}
      </Link>
    );
}

function PageNumberLink({
  pageNumber,
  href,
  scroll,
}: {
  pageNumber: number;
  href: string;
  scroll?: boolean;
}) {
  return (
    <Link
      aria-label={`Go to page ${pageNumber}`}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-contrast-300 text-pink-500 ring-primary transition-colors duration-300 hover:border-contrast-400 hover:bg-contrast-100 focus-visible:outline-0 focus-visible:ring-2"
      href={href}
      scroll={scroll}
    >
      {pageNumber}
    </Link>
  );
}

function CurrentPageLink({ pageNumber }: { pageNumber: number }) {
  return (
    <div
      aria-current="page"
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-pink-500 bg-pink-500 text-white"
    >
      {pageNumber}
    </div>
  );
}

function SkeletonLink({ children }: { children: React.ReactNode }) {
  return (
    <div aria-disabled="true" className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-contrast-300 text-pink-500 opacity-50 duration-300">
      {children}
    </div>
  );
}

export function NumberedPaginationSkeleton() {
  return (
    <div className="flex w-full justify-center bg-background py-10 text-xs">
      <div className="flex gap-2">
        <SkeletonLink>
          <ArrowLeft size={20} strokeWidth={1} />
        </SkeletonLink>
        <SkeletonLink>1</SkeletonLink>
        <SkeletonLink>2</SkeletonLink>
        <SkeletonLink>
          <ArrowRight size={20} strokeWidth={1} />
        </SkeletonLink>
      </div>
    </div>
  );
}
