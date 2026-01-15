import { type Dealer, DealerCard } from './dealer-card';

interface DealersGridProps {
  dealers: Dealer[];
}

export function DealersGrid({ dealers }: DealersGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dealers.map((dealer) => (
        <DealerCard dealer={dealer} key={dealer.id} />
      ))}
    </div>
  );
}
