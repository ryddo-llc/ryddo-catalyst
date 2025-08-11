import { BikeSpecialOffers } from './bike-special-offers';

export function BikeLeftSidebar() {
  return (
    <div className="absolute left-2 top-[-20px] z-10 hidden w-48 md:block xl:left-4 xl:w-52">
      <BikeSpecialOffers />
    </div>
  );
}
