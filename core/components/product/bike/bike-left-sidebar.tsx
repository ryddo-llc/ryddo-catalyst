import { BikeSpecialOffers } from './bike-special-offers';

export function BikeLeftSidebar() {
  return (
    <div className="absolute left-0 top-[-20px] z-10 hidden md:block">
      <BikeSpecialOffers />
    </div>
  );
}
