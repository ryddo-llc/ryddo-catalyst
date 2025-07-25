'use client';

import React from 'react';

import { Image } from '~/components/image';

import SlideUpPopup from '../ui/slide-up-popup';

import ServiceCard from './service-card';

interface BookNowPopupProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function BookNowPopup({ isOpen, onClose }: BookNowPopupProps) {
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
      className="overflow-hidden transition-all duration-300 ease-out"
      isOpen={isOpen} 
      onClose={onClose}
    >
      <div className="relative h-full">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Ryddo background"
            className="object-cover"
            fill
            priority
            src="/images/backgrounds/default-background.webp"
          />
        </div>
        
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
