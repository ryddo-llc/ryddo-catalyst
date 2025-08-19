import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { memo } from 'react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { getBase64BlurDataURL } from '~/lib/generate-blur-placeholder';

import type { Link as NavigationLink } from './types';

interface NavigationItemProps {
  item: NavigationLink;
  isActive: boolean;
  isFloating: boolean;
  index: number;
}

export const NavigationItem = memo<NavigationItemProps>(({ item, isActive, isFloating, index }) => {
  return (
    <NavigationMenu.Item key={index} value={index.toString()}>
      <NavigationMenu.Trigger asChild>
        <Link
          className={clsx(
            'text-md group relative hidden items-center whitespace-nowrap rounded-xl p-2 font-[family-name:var(--nav-link-font-family,var(--font-family-body))] font-extrabold ring-[var(--nav-focus,hsl(var(--primary)))] ease-in-out focus-visible:outline-0 focus-visible:ring-2 @4xl:inline-flex',
            {
              'bg-[var(--nav-link-background-active,transparent)] text-[var(--nav-link-text-active,#F92F7B)]':
                isActive,
              'bg-[var(--nav-link-background,transparent)] text-[var(--nav-link-text,hsl(var(--foreground)))] hover:text-[var(--nav-link-text-hover,hsl(var(--foreground)))]':
                !isActive,
            },
          )}
          href={item.href}
        >
          <span>{item.label}</span>
          {item.groups != null && item.groups.length > 0 && (
            <ChevronDown
              className={clsx(
                'absolute left-1/2 -translate-x-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100',
                isFloating ? 'top-[calc(100%-8px)]' : 'top-full',
              )}
              size={16}
            />
          )}
        </Link>
      </NavigationMenu.Trigger>
      {item.groups != null && item.groups.length > 0 && (
        <NavigationMenu.Content className="rounded-2xl bg-[var(--nav-menu-background,hsl(var(--background)))] px-3 shadow-xl ring-1 ring-[var(--nav-menu-border,hsl(var(--foreground)/5%))] md:px-4">
          <div className="m-auto grid w-full max-w-5xl grid-cols-2 justify-center gap-3 pb-3 pt-3 md:max-w-4xl md:grid-cols-3 lg:grid-cols-4">
            {item.groups.map((group, columnIndex) => (
              <ul className="flex flex-col" key={columnIndex}>
                {/* Second Level Links */}
                {group.label != null && group.label !== '' && (
                  <li className="group/category">
                    {group.href != null && group.href !== '' ? (
                      <div className="relative block overflow-hidden p-0.5 font-[family-name:var(--nav-group-font-family,var(--font-family-body))] font-medium text-[var(--nav-group-text,hsl(var(--foreground)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors focus-visible:outline-0 focus-visible:ring-2">
                        <Link
                          className="flex flex-col items-center gap-0.5"
                          href={group.href}
                        >
                          {group.image && (
                            <div className="relative">
                              <Image
                                alt={group.image.altText}
                                blurDataURL={getBase64BlurDataURL()}
                                className="rounded border-2 border-transparent object-cover transition-all group-hover/category:border-[#F92F7B]"
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
                                      <button
                                        className="rounded-md border border-gray-200 bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-800 shadow-sm transition-colors hover:bg-white hover:text-[#F92F7B]"
                                        key={linkIdx}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          window.location.href = link.href;
                                        }}
                                      >
                                        {link.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {group.label}
                        </Link>
                      </div>
                    ) : (
                      <div className="relative block overflow-hidden p-0.5 font-[family-name:var(--nav-group-font-family,var(--font-family-body))] font-medium text-[var(--nav-group-text,hsl(var(--foreground)))]">
                        <div className="flex flex-col items-center gap-0.5">
                          {group.image && (
                            <div className="relative">
                              <Image
                                alt={group.image.altText}
                                blurDataURL={getBase64BlurDataURL()}
                                className="rounded border-2 border-transparent object-cover transition-all group-hover/category:border-[#F92F7B]"
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
                                      <button
                                        className="rounded-md border border-gray-200 bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-800 shadow-sm transition-colors hover:bg-white hover:text-[#F92F7B]"
                                        key={linkIdx}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          window.location.href = link.href;
                                        }}
                                      >
                                        {link.label}
                                      </button>
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
});

NavigationItem.displayName = 'NavigationItem';

