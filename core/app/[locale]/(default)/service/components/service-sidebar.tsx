import { Logo } from '@/vibes/soul/primitives/logo';

import { ServiceNavigation } from './service-navigation';

interface LogoConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  href: string;
  label: string;
}

const DEFAULT_LOGO_CONFIG: LogoConfig = {
  src: "/images/logos/ryddo-logo.webp",
  alt: "Ryddo Logo", 
  width: 80,
  height: 30,
  href: "/",
  label: "Ryddo Home"
};

interface ServiceSidebarProps {
  logoConfig?: LogoConfig;
}

export function ServiceSidebar({ 
  logoConfig = DEFAULT_LOGO_CONFIG
}: ServiceSidebarProps) {
  return (
    <aside className="border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/80 p-4 lg:p-6 w-full lg:w-64 rounded-t-3xl lg:rounded-t-none lg:rounded-l-3xl flex flex-col">
      <div className="space-y-6 lg:space-y-8 flex-1">
        <div className="flex justify-center lg:justify-start lg:pl-4">
          <Logo
            className="text-xl lg:text-2xl font-bold text-gray-900"
            height={logoConfig.height}
            href={logoConfig.href}
            label={logoConfig.label}
            logo={{ src: logoConfig.src, alt: logoConfig.alt }}
            width={logoConfig.width}
          />
        </div>

        <ServiceNavigation />
      </div>
    </aside>
  );
} 