interface ScooterMobileSpecialOffersProps {
  className?: string;
}

export function ScooterMobileSpecialOffers({ className = "" }: ScooterMobileSpecialOffersProps) {
  return (
    <div className={`bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 space-y-4 ${className}`}>
      {/* Special Offers Header */}
      <div className="text-center">
        <h3 className="font-['Inter'] text-lg sm:text-xl font-black text-zinc-800 mb-2">
          Special Offers
        </h3>
        <p className="font-['Inter'] text-sm sm:text-base font-medium text-stone-600">
          Receive 20% OFF on all accessory purchases at time of sale.
        </p>
      </div>

      {/* Key Features - Mobile Optimized */}
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-3 border-l-4 border-pink-600">
          <div className="font-['Inter'] text-base sm:text-lg font-black text-pink-600">
            5400 Watts of peak power
          </div>
          <div className="font-['Inter'] text-sm sm:text-base font-medium text-zinc-700">
            Long Range Scooter - 80+ miles*
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border-l-4 border-zinc-800">
          <div className="font-['Inter'] text-base sm:text-lg font-black text-zinc-800">
            Stability & Power
          </div>
          <div className="font-['Inter'] text-sm sm:text-base font-medium text-neutral-600">
            Ultra large deck & tires
          </div>
        </div>
      </div>
    </div>
  );
}