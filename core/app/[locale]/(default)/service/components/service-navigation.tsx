'use client';

import { BsFillGrid1X2Fill } from "react-icons/bs";
import { FaCircleDot } from "react-icons/fa6";
import { IoStar, IoTriangle } from "react-icons/io5";
import { RiBarChart2Fill } from "react-icons/ri";

import { Link } from '~/components/link';
import { usePathname } from '~/i18n/routing';

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/service/contact',
    icon: IoTriangle,
    label: 'Contact'
  },
  {
    href: '/service/brands',
    icon: RiBarChart2Fill,
    label: 'Brands'
  },
  {
    href: '/service',
    icon: IoStar,
    label: 'Service'
  },
  {
    href: '/service/specials',
    icon: BsFillGrid1X2Fill,
    label: 'Specials'
  },
  {
    href: '/service/test-rides',
    icon: FaCircleDot,
    label: 'Test Rides'
  }
];

export function ServiceNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/service' && pathname === '/service') return true;
    if (path !== '/service' && pathname.startsWith(path)) return true;
    
    return false;
  };

  return (
    <nav className="space-y-2 lg:space-y-4 flex-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        
        return (
          <Link
            className={`flex w-full items-center justify-center lg:justify-start space-x-2 lg:space-x-3 rounded-lg px-3 lg:px-4 py-2 lg:py-3 transition-colors text-sm lg:text-base ${
              isActive(item.href)
                ? 'bg-pink-600 text-white'
                : 'text-gray-500 hover:bg-pink-100 hover:text-pink-700'
            }`}
            href={item.href}
            key={item.href}
          >
            <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
} 