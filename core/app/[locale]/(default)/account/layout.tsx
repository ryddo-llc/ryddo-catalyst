import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { AccountNavigation } from './account-navigation';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Account.Layout');

  return (
    <div className="@container min-h-screen bg-[var(--account-background,hsl(var(--background)))]">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Account Header */}
        <div className="mb-12">
          <h1 className="font-[family-name:var(--account-title-font-family,var(--font-family-heading))] text-4xl font-extrabold text-[var(--account-title,hsl(var(--foreground)))] @xl:text-5xl">
            My Account
            <span className="ml-2 text-5xl text-[#F92F7B] @xl:text-6xl">.</span>
          </h1>
          <p className="mt-2 text-[var(--account-subtitle,hsl(var(--contrast-500)))]">
            Manage your orders, addresses, and account settings
          </p>
        </div>

        {/* Navigation Cards */}
        <AccountNavigation
          links={[
            { href: '/account/orders/', label: t('orders'), description: 'View and track your orders' },
            { href: '/account/addresses/', label: t('addresses'), description: 'Manage shipping addresses' },
            { href: '/account/settings/', label: t('settings'), description: 'Update account information' },
            { href: '/account/wishlists/', label: t('wishlists'), description: 'Your saved items' },
            { href: '/logout', label: t('logout'), description: 'Sign out of your account', prefetch: 'none' },
          ]}
        />

        {/* Page Content */}
        <div className="mt-12">
          {children}
        </div>
      </div>
    </div>
  );
}
