'use client';

import { useEffect } from 'react';

import { Streamable, useStreamable } from '@/vibes/soul/lib/streamable';
import { useInventory } from '~/components/contexts/inventory-context';

interface InventoryStatus {
  isInStock: boolean;
  status: 'Available' | 'Unavailable' | 'Preorder';
}

interface ProductInventoryProviderProps {
  streamableInventoryStatus: Streamable<InventoryStatus>;
}

export function ProductInventoryProvider({
  streamableInventoryStatus,
}: ProductInventoryProviderProps) {
  const { setInventoryStatus } = useInventory();
  const inventoryStatus = useStreamable(streamableInventoryStatus);

  useEffect(() => {
    setInventoryStatus(inventoryStatus);

    // Cleanup when component unmounts
    return () => setInventoryStatus(null);
  }, [inventoryStatus, setInventoryStatus]);

  return null; // This component only manages state, no UI
}
