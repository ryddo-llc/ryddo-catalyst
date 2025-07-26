import { PricingTable } from './pricing-table';
import { ServiceAccordionItem } from './service-accordion-item';

export function ServiceContent() {
  const storagePricing = {
    leftColumn: [
      { label: 'Grace period', value: '7 days' },
      { label: 'Daily storage fee', value: '$5/day' },
      { label: 'Extended storage', value: 'By arrangement' }
    ],
    rightColumn: [
      { label: 'Service completion', value: 'Pickup required' },
      { label: 'Service on hold', value: 'Pickup required' },
      { label: 'Notification', value: "We'll contact you" }
    ],
    noteTitle: 'Storage Policy',
    noteText: 'Storage fees apply after 7-day grace period. Extended storage requires prior arrangement.'
  };

  const laborRatesPricing = {
    leftColumn: [
      { label: 'Hourly rate', value: '$120/hr' },
      { label: 'Minimum charge', value: '$35' },
      { label: 'Emergency service', value: '$150/hr' }
    ],
    rightColumn: [
      { label: 'Diagnostic fee', value: '$35' },
      { label: 'Weekend service', value: 'By appointment' },
      { label: 'Service hours', value: 'Mon-Fri 9AM-6PM' }
    ],
    noteTitle: 'Labor Rates',
    noteText: 'Rates are subject to change. Emergency and weekend service available at premium rates.'
  };

  const setRatesPricing = {
    leftColumn: [
      { label: 'Tire/Tube replacement', value: '$65/tire' },
      { label: 'Scooter suspension lowering', value: '$100' },
      { label: 'Install fingerprint sensor', value: '$35' },
      { label: 'Install new brake system', value: '$280' }
    ],
    rightColumn: [
      { label: 'Remove stripped screws', value: '$15ea.' },
      { label: 'Brake bleeding', value: '$60' },
      { label: 'General inspection', value: '$60' },
      { label: 'Tune-up', value: '$60' }
    ],
    noteTitle: 'Fixed Pricing',
    noteText: 'All prices are estimates and subject to change. We\'ll provide a detailed quote before starting work.'
  };

  return (
    <>
      <ServiceAccordionItem 
        title="Services Offered:"
        value="services" 
      >
        <div className="space-y-3">
          <p className="font-semibold text-md">We service all-electric rides including eScooters, eBikes, eUnicycles, eSkateboards, eMotorcycles and more.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-md font-semibold text-gray-600 uppercase tracking-wide">Service Types</p>
              <ul className="space-y-1 text-md text-gray-700">
                <li>• Diagnostics & Repairs</li>
                <li>• Tune-ups & Maintenance</li>
                <li>• Modifications & Upgrades</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-md font-semibold text-gray-600 uppercase tracking-wide">Modifications & Upgrades</p>
              <ul className="space-y-1 text-md text-gray-700">
                <li>• Lighting & Accessories</li>
                <li>• Suspension & Performance Parts</li>
                <li>• Battery & Electrical</li>
              </ul>
            </div>
          </div>
        </div>
      </ServiceAccordionItem>

      <hr className="border-gray-200 my-2" />

      <ServiceAccordionItem title="Service Duration:" value="duration">
        <div className="space-y-3">
          <p className="text-md font-semibold">Most services can be completed the same day but some make take 3-4 days or more. 
            Certain services, such as non-pneumatic tires, may take (1) day due to the installation process. 
            Our experience mechanic is in the store (5) days a week. It is best to schedule an appointment to ensure availability.
          </p>
        </div>
      </ServiceAccordionItem>

      <hr className="border-gray-200 my-2" />

      <ServiceAccordionItem title="Parts:" value="parts">
        <div className="space-y-3 text-md">
          <p>
            <strong>Ryddo only carries parts for the Dualtron scooters. </strong> 
            Repairs for products other than the Dualtron scooters must obtain the required parts for servicing. We are happy to assist with you which parts to be ordered.
          </p>
        </div>
      </ServiceAccordionItem>

      <hr className="border-gray-200 my-2" />

      <ServiceAccordionItem title="Storage Costs:" value="storage">
        <div className="space-y-3">
          <p>
            After completion of your service, or your service is placed on hold, you will be required to pickup your ride within 7 days. After 7 days you will be charged a storage fee of $5/day.
          </p>
          <PricingTable {...storagePricing} />
        </div>
      </ServiceAccordionItem>

      <hr className="border-gray-200 my-2" />

      <ServiceAccordionItem title="Service Labor Rates:" value="labor-rates">
        <PricingTable {...laborRatesPricing} />
      </ServiceAccordionItem>

      <hr className="border-gray-200 my-2" />
      
      <ServiceAccordionItem title="Set Labor Rates:" value="set-rates">
        <PricingTable {...setRatesPricing} />
      </ServiceAccordionItem>
    </>
  );
} 