'use client';

import { clsx } from 'clsx';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

export interface BrowseCardProps {
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string } | null;
  onClick?: () => void;
  href?: string;
  isSelected?: boolean;
  className?: string;
}

export function BrowseCard({
  title,
  subtitle,
  image,
  onClick,
  href,
  isSelected = false,
  className,
}: BrowseCardProps) {
  const content = (
    <div
      className={clsx(
        'relative w-full overflow-hidden rounded-3xl',
        'aspect-[5/6]',
        'transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-lg',
        isSelected
          ? 'ring-3 ring-[hsl(var(--primary))] ring-offset-2'
          : 'ring-1 ring-transparent',
      )}
    >
      {image ? (
        <>
          <Image
            alt={image.alt}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
            src={image.src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--contrast-100))] to-[hsl(var(--contrast-200))]" />
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-[family-name:var(--font-family-heading)] text-lg font-bold text-white drop-shadow-sm">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 font-[family-name:var(--font-family-body)] text-sm text-white/80">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );

  if (href && !onClick) {
    return (
      <Link
        className={clsx(
          'group block focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--primary))]',
          className,
        )}
        href={href}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={clsx(
        'group block w-full text-left focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--primary))]',
        className,
      )}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

export function BrowseCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('w-full', className)}>
      <div className="aspect-[5/6] animate-pulse rounded-3xl bg-[hsl(var(--contrast-100))]" />
    </div>
  );
}
