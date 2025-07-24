import React from 'react';

import { Button } from '~/vibes/soul/primitives/button';

interface ServiceCardProps {
  title: string;
  description: string;
  serviceType: string;
  selectedService: string;
  onSelect: (serviceType: string) => void;
}

export default function ServiceCard({ 
  title, 
  description, 
  serviceType, 
  selectedService, 
  onSelect 
}: ServiceCardProps) {
  return (
    <div className="bg-white bg-opacity-80 rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200 hover:border-[#F92F7B] transition-colors duration-200 text-center">
      <h3 className="text-[#F92F7B] font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 md:mb-4">{title}</h3>
      <p className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 leading-relaxed">
        {description}
      </p>
      <Button
        className={`px-6 sm:px-8 text-white transition-all duration-200 ${
          selectedService === serviceType 
            ? 'bg-[#F92F7B] ring-2 ring-[#F92F7B] ring-offset-2' 
            : ''
        }`}
        onClick={() => onSelect(serviceType)}
        shape="pill"
        size="small"
        style={{
          backgroundColor: '#F92F7B',
          borderColor: '#F92F7B'
        }}
        variant="primary"
      >
        Book
      </Button>
    </div>
  );
} 