import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { AccountSidebar } from './account-sidebar';
import { MobileNavigation } from './components/responsive-navigation';
import { getOptimizedDashboardData } from './dashboard/optimized-queries';
import { DashboardProvider } from './dashboard-context';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Account.Layout');

  // Dashboard data is now loaded lazily with Streamable in individual pages
  // This provides better loading states and streaming behavior

  return (
      <div className="@container min-h-screen bg-[var(--account-background,hsl(var(--background)))]">
        <div className="mx-auto max-w-screen-2xl">
          {/* Account Header */}
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--account-title-font-family,var(--font-family-heading))] text-4xl font-extrabold text-[var(--account-title,hsl(var(--foreground)))] @xl:text-5xl">
              My Account
              <span className="ml-2 text-5xl text-[#F92F7B] @xl:text-6xl">.</span>
            </h1>
            <p className="mt-2 text-[var(--account-subtitle,hsl(var(--contrast-500)))]">
              Manage your orders, addresses, and account settings
            </p>
          </div>

          {/* Sidebar + Content Layout */}
          <div className="flex min-h-[calc(100vh-200px)] bg-[var(--account-card-background,hsl(var(--background)))] border-t border-[var(--account-card-border,hsl(var(--contrast-200)))]">
            {/* Sidebar - Hidden on mobile, visible on tablet and desktop */}
            <div className="hidden md:flex w-80 flex-shrink-0 border-r border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-sidebar-background,hsl(var(--background)))]">
              <AccountSidebar
                dashboardData={dashboardData}
                links={[
                  { href: '/account', label: 'Dashboard', description: 'Account overview', icon: 'dashboard' },
                  { href: '/account/orders', label: t('orders'), description: 'View and track your orders', icon: 'orders' },
                  { href: '/account/addresses', label: t('addresses'), description: 'Manage shipping addresses', icon: 'addresses' },
                  { href: '/account/settings', label: t('settings'), description: 'Update account information', icon: 'settings' },
                  { href: '/account/wishlists', label: t('wishlists'), description: 'Your saved items', icon: 'wishlists' },
                  { href: '/logout', label: t('logout'), description: 'Sign out of your account', icon: 'logout', prefetch: 'none' },
                ]}
              />
            </div>

            {/* Mobile Navigation Bar - Optimized component */}
            <MobileNavigation 
              labels={{
                orders: t('orders'),
                addresses: t('addresses'),
                settings: t('settings'),
                wishlists: t('wishlists'),
                logout: t('logout'),
              }}
            />

            {/* Content Panel */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto px-4 py-6 md:px-8 pb-24 md:pb-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
