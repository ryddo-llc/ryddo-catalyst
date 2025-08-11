import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import type { ProductSpecification } from '~/components/product/shared/product-specifications';

import { BikeSpecsSkeleton } from '../shared/product-detail-skeletons';

interface ScooterMobileSpecsProps {
  scooterSpecs?: Streamable<ProductSpecification[] | null>;
  className?: string;
}

export function ScooterMobileSpecs({ scooterSpecs, className = "" }: ScooterMobileSpecsProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-['Inter'] text-base sm:text-lg font-black text-zinc-800">
          Key Specifications
        </h3>
      </div>
      
      <div className="p-4">
        <Stream fallback={<BikeSpecsSkeleton />} value={scooterSpecs}>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {keySpecs.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
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
        
        {/* Show More Button for additional specs */}
        <Stream fallback={null} value={scooterSpecs}>
          {(specs) => {
            if (!specs || specs.length <= 6) return null;
            
            return (
              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                View All Specifications ({specs.length - 6} more)
              </button>
            );
          }}
        </Stream>
      </div>
    </div>
  );
}