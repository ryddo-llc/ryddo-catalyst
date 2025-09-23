import { clsx } from 'clsx';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

import * as Skeleton from '../skeleton';

export interface CategoryCardContent {
  href: string;
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
  icon?: React.ReactNode;
  count?: number;
  showPlusButton?: boolean;
  cardBackground?: 'default' | 'white';
  onPlusClick?: () => void;
}

export interface CategoryCardProps {
  href: string;
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
  icon?: React.ReactNode;
  count?: number;
  className?: string;
  aspectRatio?: '5:6' | '3:4' | '1:1' | '7:11';
  textColorScheme?: 'light' | 'dark';
  iconColorScheme?: 'light' | 'dark';
  showPlusButton?: boolean;
  cardBackground?: 'default' | 'white';
  onPlusClick?: () => void;
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --category-card-light-title: var(--foreground);
 *   --category-card-light-subtitle: var(--contrast-500);
 *   --category-card-light-background: var(--background);
 *   --category-card-light-overlay: rgba(0, 0, 0, 0.3);
 *   --category-card-dark-title: var(--background);
 *   --category-card-dark-subtitle: var(--contrast-100);
 *   --category-card-dark-background: var(--foreground);
 *   --category-card-dark-overlay: rgba(0, 0, 0, 0.5);
 * }
 * ```
 */

export function CategoryCard({
  href,
  title,
  subtitle,
  image,
  icon,
  count,
  className,
  aspectRatio = '5:6',
  textColorScheme = 'light',
  iconColorScheme = 'light',
  showPlusButton = false,
  cardBackground = 'default',
  onPlusClick,
}: CategoryCardProps) {
  return (
    <article className={clsx('@container', className)}>
      <Link
        className={clsx(
          'group relative block w-full overflow-hidden rounded-3xl',
          'transition-transform duration-300 hover:scale-[1.02]',
          'focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4',
          'focus-visible:outline-primary',
        )}
        href={href}
      >
        <div
          className={clsx(
            'relative w-full',
            {
              '5:6': 'aspect-[5/6]',
              '3:4': 'aspect-[3/4]',
              '1:1': 'aspect-square',
              '7:11': 'aspect-[7/11]',
            }[aspectRatio],
            cardBackground === 'white'
              ? 'bg-white'
              : {
                  light: 'bg-(--category-card-light-background,var(--background))',
                  dark: 'bg-(--category-card-dark-background,var(--foreground))',
                }[textColorScheme],
          )}
        >
          {image ? (
            <>
              <Image
                alt={image.alt}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                src={image.src}
              />
              {cardBackground !== 'white' && (
                <div
                  className={clsx(
                    'absolute inset-0',
                    {
                      light: 'bg-(--category-card-light-overlay,rgba(0,0,0,0.3))',
                      dark: 'bg-(--category-card-dark-overlay,rgba(0,0,0,0.5))',
                    }[textColorScheme],
                  )}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-contrast-100 to-contrast-200" />
          )}

          {/* Plus button in top-right corner */}
          {showPlusButton && (
            <button
              className="absolute right-3 top-3 z-20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPlusClick?.();
              }}
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-black transition-transform hover:scale-110">
                <span className="font-inter -translate-y-1 text-3xl leading-none text-white">
                  +
                </span>
              </div>
            </button>
          )}

          <div className="absolute inset-0 flex flex-col items-start justify-start p-6 pt-[25%] text-left">
            <div className="max-w-[80%]">
              {icon ? (
                <div
                  className={clsx(
                    'mb-4',
                    {
                      light: 'text-(--category-card-light-title,var(--foreground))',
                      dark: 'text-(--category-card-dark-title,var(--background))',
                    }[iconColorScheme],
                  )}
                >
                  {icon}
                </div>
              ) : null}

              <h3
                className={clsx(
                  'font-body text-xl font-light',
                  {
                    light: 'text-(--category-card-light-title,var(--foreground))',
                    dark: 'text-(--category-card-dark-title,var(--background))',
                  }[textColorScheme],
                )}
              >
                {title}
              </h3>

              {subtitle ? (
                <p
                  className={clsx(
                    'mt-2 h-[10.4rem] overflow-hidden break-words font-body text-2xl font-extrabold leading-relaxed',
                    {
                      light: 'text-(--category-card-light-subtitle,var(--contrast-500))',
                      dark: 'text-(--category-card-dark-subtitle,var(--contrast-100))',
                    }[textColorScheme],
                  )}
                >
                  {subtitle}
                </p>
              ) : null}

              {count !== undefined && (
                <span
                  className={clsx(
                    'mt-2 text-sm',
                    {
                      light: 'text-(--category-card-light-subtitle,var(--contrast-500))',
                      dark: 'text-(--category-card-dark-subtitle,var(--contrast-100))',
                    }[textColorScheme],
                  )}
                >
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function CategoryCardSkeleton({
  className,
  aspectRatio = '5:6',
}: {
  aspectRatio?: '5:6' | '3:4' | '1:1' | '7:11';
  className?: string;
}) {
  return (
    <div className={clsx('@container', className)}>
      <Skeleton.Box
        className={clsx(
          'rounded-2xl',
          {
            '5:6': 'aspect-[5/6]',
            '3:4': 'aspect-[3/4]',
            '1:1': 'aspect-square',
            '7:11': 'aspect-[7/11]',
          }[aspectRatio],
        )}
      />
    </div>
  );
}
