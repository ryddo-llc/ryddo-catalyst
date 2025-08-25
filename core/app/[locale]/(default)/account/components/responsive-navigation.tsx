'use client';

import { Heart, Home, MapPin, Package, Settings } from 'lucide-react';

import { Link } from '~/components/link';
import { usePathname } from '~/i18n/routing';
import { memo } from 'react';

interface MobileNavigationProps {
  labels: {
    orders: string;
    addresses: string;
    settings: string;
    wishlists: string;
  };
}

// Memoized mobile navigation to prevent unnecessary re-renders
export const MobileNavigation = memo(function MobileNavigation({ labels }: MobileNavigationProps) {
  const pathname = usePathname();

  const links = [
    { href: '/account', icon: Home, label: 'Dashboard' },
    { href: '/account/orders', icon: Package, label: labels.orders },
    { href: '/account/addresses', icon: MapPin, label: labels.addresses },
    { href: '/account/settings', icon: Settings, label: labels.settings },
    { href: '/account/wishlists', icon: Heart, label: labels.wishlists },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-10 border-t border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-sidebar-background,hsl(var(--background)))] px-4 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {links.map((link) => {
          const IconComponent = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              className={`flex flex-col items-center gap-1 p-2 text-xs transition-colors ${
                isActive 
                  ? 'text-[#F92F7B]' 
                  : 'text-[var(--account-card-description,hsl(var(--contrast-500)))] hover:text-[#F92F7B]'
              }`}
              href={link.href}
              key={link.href}
            >
              <div className="h-6 w-6 flex items-center justify-center">
                <IconComponent className="h-4 w-4" />
              </div>
              <span className="truncate max-w-12">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
});