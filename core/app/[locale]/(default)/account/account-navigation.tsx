'use client';

import { clsx } from 'clsx';
import { Heart, LogOut, MapPin, Package, Settings } from 'lucide-react';

import { ArrowButton } from '~/components/arrow-button';
import { Link } from '~/components/link';
import { usePathname } from '~/i18n/routing';

interface NavigationLink {
  href: string;
  label: string;
  description: string;
  prefetch?: 'none' | 'hover' | 'viewport';
}

interface AccountNavigationProps {
  links: NavigationLink[];
}

const getIconForLink = (href: string) => {
  if (href.includes('orders')) return Package;
  if (href.includes('addresses')) return MapPin;
  if (href.includes('settings')) return Settings;
  if (href.includes('wishlists')) return Heart;
  if (href.includes('logout')) return LogOut;

  return Package;
};

export function AccountNavigation({ links }: AccountNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-5">
      {links.map((link, index) => {
        const Icon = getIconForLink(link.href);
        const isActive = pathname === link.href || (link.href !== '/logout' && pathname.startsWith(link.href));
        const isLogout = link.href.includes('logout');

        return (
          <Link
            className={clsx(
              'group relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2',
              isActive
                ? 'border-[#F92F7B] bg-[#F92F7B]/5'
                : 'border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] hover:border-[#F92F7B]/50',
              isLogout && 'hover:border-red-300 hover:bg-red-50/50'
            )}
            href={link.href}
            key={`${link.href}-${index}`}
            prefetch={link.prefetch}
          >
            {/* Background pattern */}
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5 transition-all duration-300 group-hover:scale-110" />
            
            {/* Content */}
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={clsx(
                    'rounded-full p-3 transition-all duration-200',
                    isActive
                      ? 'bg-[#F92F7B] text-white'
                      : 'bg-[var(--account-icon-background,hsl(var(--contrast-100)))] text-[var(--account-icon-text,hsl(var(--contrast-500)))] group-hover:bg-[#F92F7B] group-hover:text-white',
                    isLogout && 'group-hover:bg-red-500'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Arrow indicator for active state */}
                {isActive && (
                  <div className="rounded-full bg-[#F92F7B] p-1">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              
              <h3 className="mb-2 font-[family-name:var(--account-card-title-font-family,var(--font-family-heading))] text-lg font-extrabold text-[var(--account-card-title,hsl(var(--foreground)))]">
                {link.label}
              </h3>
              
              <p className="text-sm text-[var(--account-card-description,hsl(var(--contrast-500)))] group-hover:text-[var(--account-card-description-hover,hsl(var(--contrast-400)))]">
                {link.description}
              </p>
              
              {/* Hover arrow */}
              <div className="mt-4 opacity-0 transition-all duration-200 group-hover:opacity-100">
                <ArrowButton
                  aria-hidden="true"
                  className={clsx(
                    'text-xs',
                    isLogout && 'bg-red-500 hover:bg-red-600'
                  )}
                  tabIndex={-1}
                >
                  {isLogout ? 'Sign out' : 'View'}
                </ArrowButton>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}