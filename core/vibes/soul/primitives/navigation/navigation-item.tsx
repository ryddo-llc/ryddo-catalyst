import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { memo } from 'react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

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
            "text-md hidden items-center whitespace-nowrap rounded-xl p-2 font-[family-name:var(--nav-link-font-family,var(--font-family-body))] font-extrabold ring-[var(--nav-focus,hsl(var(--primary)))] ease-in-out focus-visible:outline-0 focus-visible:ring-2 @4xl:inline-flex group relative",
            {
              "bg-[var(--nav-link-background-active,transparent)] text-[var(--nav-link-text-active,#F92F7B)]": isActive,
              "bg-[var(--nav-link-background,transparent)] text-[var(--nav-link-text,hsl(var(--foreground)))] hover:text-[var(--nav-link-text-hover,hsl(var(--foreground)))]": !isActive
            }
          )}
          href={item.href}
        >
          <span>{item.label}</span>
          {item.groups != null && item.groups.length > 0 && (
            <ChevronDown 
              className={clsx(
                "absolute left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                isFloating ? "top-[calc(100%-8px)]" : "top-full"
              )}
              size={16}
            />
          )}
        </Link>
      </NavigationMenu.Trigger>
      {item.groups != null && item.groups.length > 0 && (
        <NavigationMenu.Content className="rounded-2xl bg-[var(--nav-menu-background,hsl(var(--background)))] px-3 md:px-4 shadow-xl ring-1 ring-[var(--nav-menu-border,hsl(var(--foreground)/5%))]">
          <div className="max-w-5xl md:max-w-4xl m-auto grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-3 pb-3 pt-3">
            {item.groups.map((group, columnIndex) => (
              <ul className="flex flex-col" key={columnIndex}>
                {/* Second Level Links */}
                {group.label != null && group.label !== '' && (
                  <li className="group/category">
                    {group.href != null && group.href !== '' ? (
                      <Link className="block relative overflow-hidden p-0.5 font-[family-name:var(--nav-group-font-family,var(--font-family-body))] font-medium text-[var(--nav-group-text,hsl(var(--foreground)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors focus-visible:outline-0 focus-visible:ring-2" href={group.href}>
                        <div className="flex flex-col items-center gap-0.5">
                          {group.image && (
                            <div className="relative">
                              <Image
                                alt={group.image.altText}
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                className="rounded object-cover border-2 border-transparent transition-all group-hover/category:border-[#F92F7B]"
                                height={300}
                                loading="lazy"
                                placeholder="blur"
                                sizes="300px"
                                src={group.image.url}
                                width={300}
                              />
                              {/* Secondary links overlay */}
                              {group.links.length > 0 && (
                                <div className="absolute bottom-1 right-1 opacity-0 group-hover/category:opacity-100 transition-opacity duration-200">
                                  <div className="flex flex-col gap-0.5 items-end">
                                    {group.links.slice(0, 4).map((link, linkIdx) => (
                                      <Link
                                        className="text-xs font-medium text-gray-800 bg-white/90 hover:bg-white hover:text-[#F92F7B] transition-colors px-2 py-0.5 rounded-md shadow-sm border border-gray-200"
                                        href={link.href}
                                        key={linkIdx}
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
                      </Link>
                    ) : (
                      <div className="block relative overflow-hidden p-0.5 font-[family-name:var(--nav-group-font-family,var(--font-family-body))] font-medium text-[var(--nav-group-text,hsl(var(--foreground)))]">
                        <div className="flex flex-col items-center gap-0.5">
                          {group.image && (
                            <div className="relative">
                              <Image
                                alt={group.image.altText}
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                className="rounded object-cover border-2 border-transparent transition-all group-hover/category:border-[#F92F7B]"
                                height={300}
                                loading="lazy"
                                placeholder="blur"
                                sizes="300px"
                                src={group.image.url}
                                width={300}
                              />
                              {/* Secondary links overlay */}
                              {group.links.length > 0 && (
                                <div className="absolute bottom-1 right-1 opacity-0 group-hover/category:opacity-100 transition-opacity duration-200">
                                  <div className="flex flex-col gap-0.5 items-end">
                                    {group.links.slice(0, 4).map((link, linkIdx) => (
                                      <Link
                                        className="text-xs font-medium text-gray-800 bg-white/90 hover:bg-white hover:text-[#F92F7B] transition-colors px-2 py-0.5 rounded-md shadow-sm border border-gray-200"
                                        href={link.href}
                                        key={linkIdx}
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
});

NavigationItem.displayName = 'NavigationItem';