'use client';

import { Heart, Home, MapPin, Package, Settings } from 'lucide-react';

import { Link } from '~/components/link';
import { usePathname } from '~/i18n/routing';

interface MobileNavigationProps {
  labels: {
    orders: string;
    addresses: string;
    settings: string;
    wishlists: string;
  };
}

// Mobile navigation component
export function MobileNavigation({ labels }: MobileNavigationProps) {
  const pathname = usePathname();

  const links = [
    { href: '/account', icon: Home, label: 'Dashboard' },
    { href: '/account/orders', icon: Package, label: labels.orders },
    { href: '/account/addresses', icon: MapPin, label: labels.addresses },
    { href: '/account/settings', icon: Settings, label: labels.settings },
    { href: '/account/wishlists', icon: Heart, label: labels.wishlists },
  ];

  return (
    <div className="fixed bottom-12 left-0 right-0 z-50 border-t border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-sidebar-background,hsl(var(--background)))] px-4 py-2 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {links.map((link) => {
          const IconComponent = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              className={`flex items-center justify-center p-3 transition-colors ${
                isActive
                  ? 'text-[#F92F7B]'
                  : 'text-[var(--account-card-description,hsl(var(--contrast-500)))] hover:text-[#F92F7B]'
              }`}
              href={link.href}
              key={link.href}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                <IconComponent className="h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
