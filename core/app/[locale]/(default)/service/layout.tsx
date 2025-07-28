'use client';

import { PageHeader } from '@/vibes/soul/sections/page-header';
import { Image } from '~/components/image';

import { ServiceMapPins } from './components/service-map-pins';
import { ServiceSidebar } from './components/service-sidebar';

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        backgroundImage={{
          alt: "Street background",
          src: "/images/backgrounds/street-background.webp"
        }}
        title="service"
      />

      <section className="relative bg-blue-50 py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            alt="Map background"
            className="h-full w-full object-cover"
            height={1080}
            src="/images/backgrounds/map-background.webp"
            width={1920}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="rounded-3xl bg-white/50 shadow-2xl ml-0 lg:mr-64 min-h-[600px] flex flex-col lg:flex-row">

            <ServiceSidebar />

            <div className="p-4 lg:p-8 flex-1">
              {children}
            </div>
          </div>
          
          {/* Map Pins - Desktop Only */}
          <div role="complementary" aria-label="Service location map pins" className="hidden lg:block">
            <ServiceMapPins />
          </div>
        </div>
      </section>
    </>
  );
} 