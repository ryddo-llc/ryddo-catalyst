'use client';

import { clsx } from 'clsx';
import { Heart, LogOut, MapPin, Package, Settings } from 'lucide-react';

import { ArrowButton } from '~/components/arrow-button';
import { Link } from '~/components/link';
import { usePathname } from '~/i18n/routing';

import { DashboardData } from './dashboard/page-data';

interface NavigationLink {
  href: string;
  label: string;
  description: string;
  prefetch?: 'none' | 'hover' | 'viewport';
}

interface AccountNavigationProps {
  links: NavigationLink[];
  dashboardData?: DashboardData | null;
}

const getIconForLink = (href: string) => {
  if (href.includes('orders')) return Package;
  if (href.includes('addresses')) return MapPin;
  if (href.includes('settings')) return Settings;
  if (href.includes('wishlists')) return Heart;
  if (href.includes('logout')) return LogOut;

  return Package;
};

const getBadgeData = (href: string, dashboardData?: DashboardData | null) => {
  if (!dashboardData) return null;

  if (href.includes('orders')) {
    return {
      count: dashboardData.ordersSummary.totalCount,
      label: dashboardData.ordersSummary.totalCount === 1 ? 'Order' : 'Orders',
      preview: dashboardData.ordersSummary.recent[0] ? `Latest: #${dashboardData.ordersSummary.recent[0].orderNumber}` : null,
    };
  }
  
  if (href.includes('addresses')) {
    return {
      count: dashboardData.addressesSummary.totalCount,
      label: dashboardData.addressesSummary.totalCount === 1 ? 'Address' : 'Addresses',
      preview: dashboardData.addressesSummary.primary 
        ? `Primary: ${dashboardData.addressesSummary.primary.city}, ${dashboardData.addressesSummary.primary.state}` 
        : null,
    };
  }
  
  if (href.includes('wishlists')) {
    return {
      count: dashboardData.wishlistsSummary.totalCount,
      label: dashboardData.wishlistsSummary.totalCount === 1 ? 'Wishlist' : 'Wishlists',
      preview: dashboardData.wishlistsSummary.totalItems > 0 
        ? `${dashboardData.wishlistsSummary.totalItems} total items` 
        : null,
    };
  }
  
  if (href.includes('settings')) {
    return {
      count: `${dashboardData.accountStatus.completionPercentage}%`,
      label: 'Complete',
      preview: dashboardData.customerInfo 
        ? `${dashboardData.customerInfo.firstName} ${dashboardData.customerInfo.lastName}` 
        : 'Profile setup needed',
    };
  }

  return null;
};

export function AccountNavigation({ links, dashboardData }: AccountNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-5">
      {links.map((link, index) => {
        const Icon = getIconForLink(link.href);
        const isActive = pathname === link.href || (link.href !== '/logout' && pathname.startsWith(link.href));
        const isLogout = link.href.includes('logout');
        const badgeData = getBadgeData(link.href, dashboardData);

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
                
                {/* Data badge or active indicator */}
                {(() => {
                  if (badgeData && !isLogout) {
                    return (
                      <div className="flex flex-col items-end">
                        <div className={clsx(
                          'rounded-full px-2 py-1 text-xs font-bold',
                          isActive 
                            ? 'bg-[#F92F7B] text-white' 
                            : 'bg-[var(--account-badge-background,hsl(var(--contrast-100)))] text-[var(--account-badge-text,hsl(var(--contrast-600)))]'
                        )}>
                          {badgeData.count}
                        </div>
                        <div className="mt-1 text-xs text-[var(--account-card-description,hsl(var(--contrast-500)))]">
                          {badgeData.label}
                        </div>
                      </div>
                    );
                  }
                  
                  if (isActive && !isLogout) {
                    return (
                      <div className="rounded-full bg-[#F92F7B] p-1">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    );
                  }
                  
                  return null;
                })()}
              </div>
              
              <h3 className="mb-2 font-[family-name:var(--account-card-title-font-family,var(--font-family-heading))] text-lg font-extrabold text-[var(--account-card-title,hsl(var(--foreground)))]">
                {link.label}
              </h3>
              
              <p className="text-sm text-[var(--account-card-description,hsl(var(--contrast-500)))] group-hover:text-[var(--account-card-description-hover,hsl(var(--contrast-400)))]">
                {link.description}
              </p>
              
              {/* Data preview */}
              {badgeData?.preview && !isLogout && (
                <div className="mt-2 rounded-lg bg-[var(--account-preview-background,hsl(var(--contrast-50)))] px-3 py-2">
                  <p className="text-xs text-[var(--account-preview-text,hsl(var(--contrast-600)))]">
                    {badgeData.preview}
                  </p>
                </div>
              )}
              
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