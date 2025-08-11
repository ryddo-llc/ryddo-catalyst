import { BikeSpecialOffers } from './bike-special-offers';

export function BikeLeftSidebar() {
  return (
    <div className="absolute left-2 top-[-20px] z-10 hidden w-48 md:block lg:left-4 lg:w-52 xl:left-6 xl:w-56 2xl:left-8 2xl:w-60">
      <BikeSpecialOffers />
    </div>
  );
}
