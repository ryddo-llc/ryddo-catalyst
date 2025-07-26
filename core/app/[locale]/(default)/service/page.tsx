'use client';

import { Accordion } from '@/vibes/soul/primitives/accordion';
import { Button } from '@/vibes/soul/primitives/button';

import { ServiceContent } from './components/service-content';

export default function ServicePage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">Areas of Service: LA & OC</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-5">
          <Accordion className="space-y-0" collapsible defaultValue="" type="single">
            <ServiceContent />
          </Accordion>
        </div>

        <div className="text-center mt-5">
          <Button 
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 text-base font-semibold rounded-full shadow-md"
            size="small" 
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
