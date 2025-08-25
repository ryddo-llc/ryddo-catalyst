import { Heart, Home, MapPin, Package, Settings } from 'lucide-react';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { AccountSidebar } from './account-sidebar';
import { getDashboardData } from './dashboard/page-data';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Account.Layout');
  const format = await getFormatter();

  // Fetch dashboard data for sidebar badges
  let dashboardData = null;

  try {
    dashboardData = await getDashboardData(format);
  } catch {
    // Handle errors gracefully
  }

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
          {/* Sidebar - Hidden on mobile/tablet, visible on desktop */}
          <div className="hidden lg:flex w-80 flex-shrink-0 border-r border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-sidebar-background,hsl(var(--background)))]">
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

          {/* Mobile/Tablet Navigation Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-10 border-t border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-sidebar-background,hsl(var(--background)))] px-4 py-2">
            <div className="flex items-center justify-around max-w-md mx-auto">
              {[
                { href: '/account', icon: Home, label: 'Dashboard' },
                { href: '/account/orders', icon: Package, label: t('orders') },
                { href: '/account/addresses', icon: MapPin, label: t('addresses') },
                { href: '/account/settings', icon: Settings, label: t('settings') },
                { href: '/account/wishlists', icon: Heart, label: t('wishlists') },
              ].map((link) => {
                const IconComponent = link.icon;

                return (
                  <a
                    className="flex flex-col items-center gap-1 p-2 text-xs text-[var(--account-card-description,hsl(var(--contrast-500)))] hover:text-[#F92F7B]"
                    href={link.href}
                    key={link.href}
                  >
                    <div className="h-6 w-6 flex items-center justify-center">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="truncate max-w-12">{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Content Panel */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-4 py-6 lg:px-8 pb-20 lg:pb-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
