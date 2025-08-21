'use client';

import { PageHeader } from '@/vibes/soul/sections/page-header';

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
        {/* Map background - positioned relative to the expanding container */}
        <div aria-hidden="true" className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'url(/images/backgrounds/map-background.webp)',
          backgroundSize: '100% auto',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'top center'
        }}/>
        
        {/* Map Pins - positioned relative to background but with full opacity */}
        <div aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none">
          <ServiceMapPins />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="rounded-3xl bg-white/50 shadow-2xl ml-0 lg:mr-64 min-h-[600px] flex flex-col lg:flex-row">

            <ServiceSidebar />

            <div className="p-4 lg:p-8 flex-1">
              {children}
            </div>
          </div>
        </div>
        
      </section>
    </>
  );
} 