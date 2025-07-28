import { FaCircleDot } from "react-icons/fa6";
import { IoStar } from "react-icons/io5";

import { Button } from '@/vibes/soul/primitives/button';
import { Image } from '~/components/image';

const brandLogos = [
  { name: 'UBCO', src: '/images/logos/UBCO.webp' },
  { name: 'Gocycle', src: '/images/logos/Gocycle.webp' },
  { name: 'Jack Rabbit', src: '/images/logos/JackRabbit.webp' },
  { name: 'AVIONICS', src: '/images/logos/AVIONICS.webp' },
  { name: 'Troy Lee', src: '/images/logos/Troy-Lee.webp' },
  { name: 'DUALTRON', src: '/images/logos/DUALTRON.webp' },
];

export default function BrandsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start space-x-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0" />
        <div>
          <h2 className="text-2xl text-gray-900">Smith Bikes</h2>
          <p className="text-gray-600">Santa Monica, CA.</p>
          <span className="inline-block rounded-full text-sm text-pink-700">
            PREMIER PARTNER
          </span>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">In-Store Brands:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center md:justify-items-start">
          {brandLogos.map((logo) => (
            <div key={logo.name} className="h-16 w-24 md:h-20 md:w-32 xl:h-24 xl:w-40 flex items-center justify-center">
              <Image
                alt={logo.name}
                className="object-contain w-full h-full"
                height={80}
                src={logo.src}
                width={128}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-lg font-semibold text-gray-900">Schedule Appointments:</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-pink-100 p-3">
                <IoStar className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Service Appt.</h4>
                <p className="text-sm text-gray-600">Certified Techs</p>
              </div>
            </div>
            <Button
              className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white"
              size="medium"
              variant="primary"
            >
              Book Now
            </Button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-pink-100 p-3">
                <FaCircleDot className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Test Rides</h4>
                <p className="text-sm text-gray-600">In-store / Mobile</p>
              </div>
            </div>
            <Button
              className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white"
              size="medium"
              variant="primary"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 