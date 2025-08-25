'use client';

import React from 'react';

import { Image } from '~/components/image';
import { blurDataURLs } from '~/lib/generate-blur-placeholder';

import SlideUpPopup from '../ui/slide-up-popup';

import ServiceCard from './service-card';

interface BookNowPopupProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}

const serviceOptions = [
  {
    title: 'Test Rides',
    description: 'Try out one of our premium rides at our downtown store located in the Arts District.',
    serviceType: 'test-ride'
  },
  {
    title: 'Retail Appointments',
    description: 'Appointments only on Tues, Thurs, & Fri from 1-4pm and Walk-ins open Wed. - Sat. from 12pm - 5pm and Sun. 11am - 4pm',
    serviceType: 'retail'
  },
  {
    title: 'Service Appointments',
    description: 'Offering servicing on all e-Bikes, e-Scooters, and more with select same-day turnaround.',
    serviceType: 'service'
  }
];

export default function BookNowPopup({ isOpen, onClose, id }: BookNowPopupProps) {
  const handleServiceSelect = (serviceType: string) => {
    // TODO: Implement Calendly integration
    
    // Placeholder alert for development
    // eslint-disable-next-line no-alert
    alert(`Calendly integration coming soon for ${serviceType}!\n\nThis will redirect to the appropriate booking calendar.`);
    
    // Close the popup after selection
    onClose();
  };

  return (
    <SlideUpPopup 
      ariaLabelledBy="booknow-dialog-title"
      className="overflow-hidden transition-all duration-300 ease-out"
      id={id}
      isOpen={isOpen} 
      onClose={onClose}
    >
      <div className="relative h-full">
        <h2 className="sr-only" id="booknow-dialog-title">Book a service</h2>
        {/* Background Image */}
        <Image
          alt=""
          blurDataURL={blurDataURLs['default-background']}
          className="object-cover"
          fill
          placeholder="blur"
          priority
          quality={80}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, (max-width: 1280px) 70vw, 60vw"
          src="/images/backgrounds/default-background.webp"
        />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="w-full max-w-6xl p-6 sm:p-8 lg:p-12">
            
            {/* Three Service Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 xl:gap-16">
              {serviceOptions.map((service) =>
                <ServiceCard
                  description={service.description}
                  key={service.serviceType}
                  onSelect={handleServiceSelect}
                  serviceType={service.serviceType}
                  title={service.title}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SlideUpPopup>
  );
}
