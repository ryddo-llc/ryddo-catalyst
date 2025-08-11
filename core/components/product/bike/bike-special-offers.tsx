export function BikeSpecialOffers() {
  return (
    <div className="absolute left-0 top-[-100px] z-10 hidden md:block">
      <div className="flex w-full max-w-md flex-col items-start justify-start gap-3">
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
            Long Range Bike - 80+ miles*
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
      </div>
    </div>
  );
}