import { BikeSpecialOffers } from './bike-special-offers';

export function BikeLeftSidebar() {
  return (
    <div className="hidden md:flex">
      <div className="sticky top-4">
        <BikeSpecialOffers />
      </div>
    </div>
  );
}