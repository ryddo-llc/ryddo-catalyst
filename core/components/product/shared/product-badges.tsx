import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';

interface InventoryStatus {
  isInStock: boolean;
  status: 'Available' | 'Unavailable' | 'Preorder';
}

interface ProductPrice {
  type?: 'sale' | 'range';
  currentValue?: string;
  previousValue?: string;
}

interface ProductBadgesProps {
  inventoryStatus?: Streamable<InventoryStatus | null>;
  price?: Streamable<ProductPrice | string | null>;
}

// Stock Status Badge Component
function StockStatusBadge({
  inventoryStatus,
}: {
  inventoryStatus?: Streamable<InventoryStatus | null>;
}) {
  if (!inventoryStatus) return null;

  return (
    <Stream fallback={<StockStatusSkeleton />} value={inventoryStatus}>
      {(status) => {
        if (!status) {
          return (
            <div className="inline-flex items-center rounded border border-gray-300 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600">
              Status Unknown
            </div>
          );
        }

        const { isInStock, status: availabilityStatus } = status;

        let statusText: string;

        if (availabilityStatus === 'Unavailable') {
          statusText = 'Unavailable';
        } else if (availabilityStatus === 'Preorder') {
          statusText = 'Pre-Order';
        } else if (isInStock) {
          statusText = 'In Stock';
        } else {
          statusText = 'Out of Stock';
        }

        return (
          <div className="inline-flex items-center rounded border border-gray-300 bg-transparent px-5 py-1 text-sm font-medium text-gray-600">
            {statusText}
          </div>
        );
      }}
    </Stream>
  );
}

// Sale Badge Component
function SaleBadge({ price }: { price?: Streamable<ProductPrice | string | null> }) {
  if (!price) return null;

  return (
    <Stream fallback={null} value={price}>
      {(priceData) => {
        // Check if the price indicates a sale
        if (priceData && typeof priceData === 'object' && priceData.type === 'sale') {
          return (
            <div className="inline-flex items-center rounded border border-gray-300 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600">
              Sale Price
            </div>
          );
        }

        return null;
      }}
    </Stream>
  );
}

// Stock Status Skeleton
function StockStatusSkeleton() {
  return (
    <div className="inline-flex items-center rounded border border-gray-300 bg-gray-50 px-3 py-1">
      <Skeleton.Box className="h-4 w-16 rounded" />
    </div>
  );
}

// Main Product Badges Component
export function ProductBadges({ inventoryStatus, price }: ProductBadgesProps) {
  return (
    <div className="mb-4 flex justify-center gap-2">
      <StockStatusBadge inventoryStatus={inventoryStatus} />
      <SaleBadge price={price} />
    </div>
  );
}
