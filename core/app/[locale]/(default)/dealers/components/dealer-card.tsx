import { Clock, MapPin, Phone } from 'lucide-react';

export interface Dealer {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface DealerCardProps {
  dealer: Dealer;
}

export function DealerCard({ dealer }: DealerCardProps) {
  const fullAddress = `${dealer.address}, ${dealer.city}, ${dealer.state} ${dealer.zip}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const phoneUrl = `tel:${dealer.phone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{dealer.name}</h3>

      <div className="space-y-3 flex-grow">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#F92F7B] flex-shrink-0 mt-0.5" />
          <div className="text-gray-600 text-sm">
            <p>{dealer.address}</p>
            <p>{dealer.city}, {dealer.state} {dealer.zip}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-[#F92F7B] flex-shrink-0" />
          <a
            className="text-gray-600 text-sm hover:text-[#F92F7B] transition-colors"
            href={phoneUrl}
          >
            {dealer.phone}
          </a>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#F92F7B] flex-shrink-0 mt-0.5" />
          <p className="text-gray-600 text-sm">{dealer.hours}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <a
          className="flex-1 inline-flex items-center justify-center bg-[#F92F7B] hover:bg-[#e0256d] text-white rounded-full text-sm font-semibold py-2.5 px-4 transition-colors"
          href={mapsUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Get Directions
        </a>
        <a
          className="flex-1 inline-flex items-center justify-center border-2 border-[#F92F7B] text-[#F92F7B] hover:bg-[#F92F7B] hover:text-white rounded-full text-sm font-semibold py-2.5 px-4 transition-colors"
          href={phoneUrl}
        >
          Contact
        </a>
      </div>
    </div>
  );
}
