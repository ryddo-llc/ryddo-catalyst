'use client';

import { clsx } from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { createSerializer, parseAsString } from 'nuqs';
import { Suspense } from 'react';

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
    startCursor,
    endCursor,
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

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label={label} className="py-10" role="navigation">
      <ul className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        <li>
          {startCursor != null ? (
            <PaginationLink
              aria-label={previousLabel}
              href={serialize(searchParams, {
                [startCursorParamName]: startCursor,
                [endCursorParamName]: null,
                [pageParamName]: currentPage > 1 ? (currentPage - 1).toString() : undefined,
              })}
              scroll={scroll}
            >
              <ArrowLeft size={20} strokeWidth={1} />
            </PaginationLink>
          ) : (
            <SkeletonLink>
              <ArrowLeft size={20} strokeWidth={1} />
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
          {endCursor != null ? (
            <PaginationLink
              aria-label={nextLabel}
              href={serialize(searchParams, {
                [endCursorParamName]: endCursor,
                [startCursorParamName]: null,
                [pageParamName]: currentPage < totalPages ? (currentPage + 1).toString() : undefined,
              })}
              scroll={scroll}
            >
              <ArrowRight size={20} strokeWidth={1} />
            </PaginationLink>
          ) : (
            <SkeletonLink>
              <ArrowRight size={20} strokeWidth={1} />
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
}: {
  href: string;
  children: React.ReactNode;
  scroll?: boolean;
  ['aria-label']?: string;
}) {
  return (
    <Link
      aria-label={ariaLabel}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-lg border border-contrast-300 text-pink-500 ring-primary transition-colors duration-300 hover:border-contrast-400 hover:bg-contrast-100 focus-visible:outline-0 focus-visible:ring-2',
      )}
      href={href}
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
    <div className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-contrast-300 text-pink-500 opacity-50 duration-300">
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
