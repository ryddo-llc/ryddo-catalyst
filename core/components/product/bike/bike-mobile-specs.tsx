'use client';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import type { ProductSpecification } from '~/components/product/shared/product-specifications';

import { BikeSpecsSkeleton } from '../shared/product-detail-skeletons';

interface BikeMobileSpecsProps {
  productSpecs?: Streamable<ProductSpecification[] | null>;
  className?: string;
}

export function BikeMobileSpecs({ productSpecs, className = "" }: BikeMobileSpecsProps) {
  return (
    <Accordion 
      className={`rounded-[50px] border-2 border-[#F92F7B]/20 bg-white p-4 ${className}`}
      type="multiple"
    >
      <AccordionItem 
        className="[&_[role='button']]:font-['Inter'] [&_[role='button']]:text-[#333] [&_[role='button']]:font-bold [&_[role='button']]:hover:text-[#F92F7B] [&_svg]:stroke-[#757575] [&_[role='button']:hover_svg]:stroke-[#F92F7B]"
        title="Key Specifications" 
        value="specifications"
      >
        <div className="space-y-3 pt-2">
        <Stream fallback={<BikeSpecsSkeleton />} value={productSpecs}>
          {(specs) => {
            if (!specs || specs.length === 0) {
              return (
                <div className="text-center text-gray-500 py-4">
                  No specifications available
                </div>
              );
            }

            // Show key specs in a mobile-friendly grid
            const keySpecs = specs.slice(0, 6); // Limit to most important specs

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {keySpecs.map((spec, index) => (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded" key={index}>
                    <span className="font-['Inter'] text-sm font-medium text-gray-700">
                      {spec.name}:
                    </span>
                    <span className="font-['Inter'] text-sm font-semibold text-zinc-800">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            );
          }}
        </Stream>
        
        </div>
      </AccordionItem>
    </Accordion>
  );
}