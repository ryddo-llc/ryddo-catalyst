import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import type { ProductSpecification } from '~/components/product/shared/product-specifications';

import { BikeSpecsSkeleton } from '../shared/product-detail-skeletons';

import { ScooterSpecsIcons } from './scooter-specifications';

interface ScooterSpecialOffersProps {
  scooterSpecs?: Streamable<ProductSpecification[] | null>;
}

export function ScooterSpecialOffers({ scooterSpecs }: ScooterSpecialOffersProps) {
  return (
    <div className="absolute left-0 top-[-100px] z-10 hidden md:block -ml-8 sm:-ml-12 md:-ml-16 lg:-ml-20 xl:-ml-24">
      <div className="flex w-full max-w-sm flex-col items-start justify-start gap-3 rounded-lg bg-white/75 p-4 md:p-5 lg:p-6">
        <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
          <div className="justify-start font-['Inter'] text-xl font-black leading-normal text-zinc-800">
            Special Offers
          </div>
          <div className="justify-start font-['Inter'] text-base font-medium leading-snug text-stone-400">
            Receive 20% OFF on all of
            <br />
            your accessory purchases
            <br />
            at time of sale.
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[3px] self-stretch py-0.5">
          <div className="justify-start font-['Inter'] text-xl font-black leading-loose text-pink-600">
            5400 Watts of peak power
          </div>
          <div className="justify-start font-['Inter'] text-lg font-medium leading-relaxed text-zinc-800">
            Long Range Scooter - 80+ miles*
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          <div className="justify-start font-['Inter'] text-3xl font-black leading-10 text-zinc-800">
            Stability & Power
          </div>
          <div className="justify-start font-['Inter'] text-xl font-medium leading-loose text-neutral-500">
            Ultra large deck & tires
          </div>
        </div>

        {/* Gray separator line */}
        <div className="my-6 h-px w-full bg-gray-300" />

        {/* Scooter Specifications */}
        <div className="w-full">
          <Stream fallback={<BikeSpecsSkeleton />} value={scooterSpecs}>
            {(specs) => specs && <ScooterSpecsIcons specs={specs} />}
          </Stream>
        </div>
      </div>
    </div>
  );
}