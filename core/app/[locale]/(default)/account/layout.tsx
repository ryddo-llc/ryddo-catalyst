import { PropsWithChildren } from 'react';

import { PageHeader } from '@/vibes/soul/sections/page-header';
import { imageManagerImageUrl } from '~/lib/store-assets';

import { AccountSidebar } from './account-sidebar';
import { MobileNavigation } from './components/responsive-navigation';


export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[var(--account-background,hsl(var(--background)))]">
      <PageHeader
        backgroundImage={{
          alt: 'My Account background',
          src: imageManagerImageUrl('account.png', 'original'),
        }}
        title="My Account"
      />
      
      <div className="mx-auto max-w-screen-2xl @container">

        {/* Sidebar + Content Layout */}
        <div className="flex min-h-[calc(100vh-200px)] border-t border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))]">
          {/* Sidebar - Hidden on mobile, visible on tablet and desktop */}
          <div className="hidden w-80 flex-shrink-0 border-r border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-sidebar-background,hsl(var(--background)))] md:flex">
            <AccountSidebar
              dashboardData={null}
              links={[
                {
                  href: '/account',
                  label: 'Dashboard',
                  description: 'Account overview',
                  icon: 'dashboard',
                },
                {
                  href: '/account/orders',
                  label: 'Orders',
                  description: 'View and track your orders',
                  icon: 'orders',
                },
                {
                  href: '/account/addresses',
                  label: 'Addresses',
                  description: 'Manage shipping addresses',
                  icon: 'addresses',
                },
                {
                  href: '/account/settings',
                  label: 'Settings',
                  description: 'Update account information',
                  icon: 'settings',
                },
                {
                  href: '/account/wishlists',
                  label: 'Wishlists',
                  description: 'Your saved items',
                  icon: 'wishlists',
                },
                {
                  href: '/logout',
                  label: 'Logout',
                  description: 'Sign out of your account',
                  icon: 'logout',
                  prefetch: 'none',
                },
              ]}
            />
          </div>

          {/* Mobile Navigation Bar - Optimized component */}
          <MobileNavigation
            labels={{
              orders: 'Orders',
              addresses: 'Addresses',
              settings: 'Settings',
              wishlists: 'Wishlists',
              logout: 'Logout',
            }}
          />

          {/* Content Panel */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-4 py-6 pb-24 md:px-8 md:pb-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
