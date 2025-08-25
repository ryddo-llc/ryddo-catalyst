'use client';

import { clsx } from 'clsx';
import { Heart, Home, LogOut, MapPin, Package, Settings } from 'lucide-react';

import { Link } from '~/components/link';
import { usePathname } from '~/i18n/routing';

import { OptimizedDashboardData } from './dashboard/optimized-queries';

interface SidebarLink {
  href: string;
  label: string;
  description: string;
  icon: string;
  prefetch?: 'none' | 'hover' | 'viewport';
}

interface AccountSidebarProps {
  links: SidebarLink[];
  dashboardData?: OptimizedDashboardData | null;
}

const getIconForType = (iconType: string) => {
  switch (iconType) {
    case 'dashboard':
      return Home;

    case 'orders':
      return Package;

    case 'addresses':
      return MapPin;

    case 'settings':
      return Settings;

    case 'wishlists':
      return Heart;

    case 'logout':
      return LogOut;

    default:
      return Package;
  }
};

const getBadgeData = (iconType: string, dashboardData?: OptimizedDashboardData | null) => {
  if (!dashboardData) return null;

  switch (iconType) {
    case 'orders':
      return {
        count: dashboardData.ordersSummary.totalCount,
        preview: dashboardData.ordersSummary.recent[0] 
          ? `Latest: #${dashboardData.ordersSummary.recent[0].orderNumber}`
          : null,
      };

    case 'addresses':
      return {
        count: dashboardData.addressesSummary.totalCount,
        preview: dashboardData.addressesSummary.primary 
          ? `Primary: ${dashboardData.addressesSummary.primary.city}`
          : null,
      };

    case 'wishlists':
      return {
        count: dashboardData.wishlistsSummary.totalCount,
        preview: dashboardData.wishlistsSummary.totalItems > 0 
          ? `${dashboardData.wishlistsSummary.totalItems} items`
          : null,
      };

    case 'settings':
      return {
        count: `${dashboardData.accountStatus.completionPercentage}%`,
        preview: dashboardData.customerInfo 
          ? `${dashboardData.customerInfo.firstName} ${dashboardData.customerInfo.lastName}`
          : 'Profile setup needed',
      };

    default:
      return null;
  }
};

export function AccountSidebar({ links, dashboardData }: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="border-b border-[var(--account-card-border,hsl(var(--contrast-200)))] p-6">
        <h2 className="font-[family-name:var(--account-card-title-font-family,var(--font-family-heading))] text-lg font-bold text-[var(--account-card-title,hsl(var(--foreground)))]">
          Navigation
        </h2>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = getIconForType(link.icon);
          const isActive = pathname === link.href || (link.href !== '/logout' && link.href !== '/account' && pathname.startsWith(link.href));
          const isLogout = link.icon === 'logout';
          const badgeData = getBadgeData(link.icon, dashboardData);

          return (
            <Link
              className={clsx(
                'group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#F92F7B]/10 text-[#F92F7B] border-r-2 border-[#F92F7B]'
                  : 'text-[var(--account-card-description,hsl(var(--contrast-600)))] hover:bg-[var(--account-card-hover,hsl(var(--contrast-50)))] hover:text-[var(--account-card-title,hsl(var(--foreground)))]',
                isLogout && 'mt-4 border-t border-[var(--account-card-border,hsl(var(--contrast-200)))] pt-4 hover:bg-red-50 hover:text-red-600'
              )}
              href={link.href}
              key={link.href}
              prefetch={link.prefetch}
            >
              <div className={clsx(
                'flex items-center justify-center rounded-md p-1',
                isActive 
                  ? 'bg-[#F92F7B] text-white'
                  : 'text-[var(--account-card-description,hsl(var(--contrast-500)))] group-hover:text-[var(--account-card-title,hsl(var(--foreground)))]',
                isLogout && 'group-hover:bg-red-100 group-hover:text-red-600'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{link.label}</span>
                  {badgeData && !isLogout && (
                    <span className={clsx(
                      'rounded-full px-2 py-0.5 text-xs font-bold',
                      isActive 
                        ? 'bg-[#F92F7B] text-white'
                        : 'bg-[var(--account-badge-background,hsl(var(--contrast-100)))] text-[var(--account-badge-text,hsl(var(--contrast-600)))]'
                    )}>
                      {badgeData.count}
                    </span>
                  )}
                </div>
                <div className="text-xs text-[var(--account-card-description,hsl(var(--contrast-500)))] group-hover:text-[var(--account-card-description,hsl(var(--contrast-400)))]">
                  {badgeData?.preview || link.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {dashboardData?.customerInfo && (
        <div className="border-t border-[var(--account-card-border,hsl(var(--contrast-200)))] p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[var(--account-card-hover,hsl(var(--contrast-50)))] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F92F7B] text-white">
              <span className="text-sm font-bold">
                {dashboardData.customerInfo.firstName[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--account-card-title,hsl(var(--foreground)))] truncate">
                {dashboardData.customerInfo.firstName} {dashboardData.customerInfo.lastName}
              </div>
              <div className="text-xs text-[var(--account-card-description,hsl(var(--contrast-500)))] truncate">
                {dashboardData.customerInfo.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}