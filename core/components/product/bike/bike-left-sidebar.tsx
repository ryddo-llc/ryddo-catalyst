import { BikeSpecialOffers } from './bike-special-offers';

export function BikeLeftSidebar() {
  return (
    <div className="absolute left-0 top-[-20px] z-10 hidden w-64 rounded-lg bg-white/75 p-4 md:p-5 lg:p-6 md:block xl:left-1 xl:w-72 -ml-4 sm:-ml-6 md:-ml-10 lg:-ml-14 xl:-ml-18">
      <BikeSpecialOffers />
    </div>
  );
}
