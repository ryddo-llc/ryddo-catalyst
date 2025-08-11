import { BikeSpecialOffers } from './bike-special-offers';

export function BikeLeftSidebar() {
  return (
    <div className="absolute left-0 top-[-100px] z-10 hidden md:block">
      <BikeSpecialOffers />
    </div>
  );
}