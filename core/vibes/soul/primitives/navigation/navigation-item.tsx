import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { forwardRef, memo, useRef } from 'react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { useRouter } from '~/i18n/routing';
import { getBase64BlurDataURL } from '~/lib/generate-blur-placeholder';

import type { Link as NavigationLink } from './types';

interface NavigationItemProps {
  item: NavigationLink;
  isActive: boolean;
  isFloating: boolean;
  index: number;
}

export const NavigationItem = memo(forwardRef<HTMLElement, NavigationItemProps>(({ item, isActive, isFloating, index }, ref) => {
  const router = useRouter();
  const prefetchedRefs = useRef<Set<string>>(new Set());

  const handlePrefetch = (href: string | undefined) => {
    if (href && !prefetchedRefs.current.has(href)) {
      router.prefetch(href);
      prefetchedRefs.current.add(href);
    }
  };

  return (
    <NavigationMenu.Item key={index} value={index.toString()} ref={ref as any}>
      <NavigationMenu.Trigger asChild>
        <Link
          className={clsx(
            'text-sm group relative hidden items-center whitespace-nowrap rounded-full px-4 py-2 font-[family-name:Inter,sans-serif] font-semibold ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors duration-200 ease-in-out focus-visible:outline-0 focus-visible:ring-2 @4xl:inline-flex z-10',
            {
              'text-[var(--nav-link-text-active,#F92F7B)]':
                isActive,
              'text-[var(--nav-link-text,hsl(var(--foreground)))] hover:text-[var(--nav-link-text-hover,hsl(var(--foreground)))]':
                !isActive,
            },
          )}
          href={item.href}
        >
          <span>{item.label}</span>
        </Link>
      </NavigationMenu.Trigger>
      {item.groups != null && item.groups.length > 0 && (
        <NavigationMenu.Content className="rounded-2xl bg-background/50 backdrop-blur-2xl backdrop-saturate-200 px-3 shadow-2xl ring-1 ring-contrast-100/15 border border-contrast-100/20 md:px-4 data-[state=open]:animate-dropdown-show data-[state=closed]:animate-dropdown-hide relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none">
          <div className="relative m-auto grid w-full max-w-5xl grid-cols-2 justify-center gap-3 pb-3 pt-3 md:max-w-4xl md:grid-cols-3 lg:grid-cols-4">
            {item.groups.map((group, columnIndex) => (
              <ul className="flex flex-col" key={columnIndex}>
                {/* Second Level Links */}
                {group.label != null && group.label !== '' && (
                  <li className="group/category">
                    {group.href != null && group.href !== '' ? (
                      <div className="relative block overflow-hidden p-0.5 font-[family-name:var(--nav-group-font-family,var(--font-family-body))] font-medium text-[var(--nav-group-text,hsl(var(--foreground)))]">
                        <div
                          className="flex flex-col items-center gap-0.5 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                          onClick={() => group.href && router.push(group.href)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (group.href) router.push(group.href);
                            }
                          }}
                          onMouseEnter={() => handlePrefetch(group.href)}
                          onTouchStart={() => handlePrefetch(group.href)}
                          role="link"
                          tabIndex={0}
                        >
                          {group.image && (
                            <div className="relative">
                              <Image
                                alt={group.image.altText}
                                blurDataURL={getBase64BlurDataURL()}
                                className="rounded-lg border-2 border-transparent object-cover transition-all duration-300 group-hover/category:border-[#F92F7B] group-hover/category:shadow-lg"
                                height={300}
                                loading="lazy"
                                placeholder="blur"
                                sizes="300px"
                                src={group.image.url}
                                width={300}
                              />
                              {/* Secondary links overlay - positioned relative to image */}
                              {group.links.length > 0 && (
                                <div className="absolute bottom-1 right-1 opacity-0 transition-opacity duration-200 group-hover/category:opacity-100 pointer-events-none">
                                  <div className="flex flex-col items-end gap-0.5 pointer-events-auto">
                                    {group.links.slice(0, 4).map((link, linkIdx) => (
                                      <Link
                                        className={clsx(
                                          "rounded-md border border-white/20 bg-white/10 backdrop-blur-xl backdrop-saturate-150 px-2 py-0.5 text-xs font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary/20 hover:text-white hover:scale-105 hover:shadow-lg hover:border-primary/40",
                                          "translate-y-2 scale-95 opacity-0 group-hover/category:translate-y-0 group-hover/category:scale-100 group-hover/category:opacity-100",
                                          "motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:translate-y-0 motion-reduce:scale-100",
                                          `group-hover/category:delay-[${linkIdx * 50}ms]`
                                        )}
                                        href={link.href}
                                        key={linkIdx}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ transitionDelay: `${linkIdx * 75}ms` }}
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {group.label}
                        </div>
                      </div>
                    ) : (
                      <div className="relative block overflow-hidden p-0.5 font-[family-name:var(--nav-group-font-family,var(--font-family-body))] font-medium text-[var(--nav-group-text,hsl(var(--foreground)))]">
                        <div className="flex flex-col items-center gap-0.5 transition-transform duration-200 hover:scale-[1.02]">
                          {group.image && (
                            <div className="relative">
                              <Image
                                alt={group.image.altText}
                                blurDataURL={getBase64BlurDataURL()}
                                className="rounded-lg border-2 border-transparent object-cover transition-all duration-300 group-hover/category:border-[#F92F7B] group-hover/category:shadow-lg"
                                height={300}
                                loading="lazy"
                                placeholder="blur"
                                sizes="300px"
                                src={group.image.url}
                                width={300}
                              />
                              {/* Secondary links overlay - positioned relative to image */}
                              {group.links.length > 0 && (
                                <div className="absolute bottom-1 right-1 opacity-0 transition-opacity duration-200 group-hover/category:opacity-100">
                                  <div className="flex flex-col items-end gap-0.5">
                                    {group.links.slice(0, 4).map((link, linkIdx) => (
                                      <Link
                                        className={clsx(
                                          "rounded-md border border-white/20 bg-white/10 backdrop-blur-xl backdrop-saturate-150 px-2 py-0.5 text-xs font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary/20 hover:text-white hover:scale-105 hover:shadow-lg hover:border-primary/40",
                                          "translate-y-2 scale-95 opacity-0 group-hover/category:translate-y-0 group-hover/category:scale-100 group-hover/category:opacity-100",
                                          "motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:translate-y-0 motion-reduce:scale-100",
                                          `group-hover/category:delay-[${linkIdx * 50}ms]`
                                        )}
                                        href={link.href}
                                        key={linkIdx}
                                        style={{ transitionDelay: `${linkIdx * 75}ms` }}
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {group.label}
                        </div>
                      </div>
                    )}
                  </li>
                )}
              </ul>
            ))}
          </div>
        </NavigationMenu.Content>
      )}
    </NavigationMenu.Item>
  );
}));

NavigationItem.displayName = 'NavigationItem';

