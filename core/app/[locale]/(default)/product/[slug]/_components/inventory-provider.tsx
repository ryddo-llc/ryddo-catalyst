'use client';

import { useEffect } from 'react';

import { useStreamable } from '@/vibes/soul/lib/streamable';
import { Streamable } from '@/vibes/soul/lib/streamable';
import { useInventory } from '~/components/contexts/inventory-context';

interface InventoryStatus {
  isInStock: boolean;
  status: 'Available' | 'Unavailable' | 'Preorder';
}

interface ProductInventoryProviderProps {
  streamableInventoryStatus: Streamable<InventoryStatus>;
}

export function ProductInventoryProvider({ streamableInventoryStatus }: ProductInventoryProviderProps) {
  const { setInventoryStatus } = useInventory();
  const inventoryStatus = useStreamable(streamableInventoryStatus);

  console.log('Streamable inventory status:', inventoryStatus);

  useEffect(() => {
    if (inventoryStatus) {
      console.log('Setting inventory status:', inventoryStatus);
      setInventoryStatus(inventoryStatus);
    }

    // Cleanup when component unmounts
    return () => setInventoryStatus(null);
  }, [inventoryStatus, setInventoryStatus]);

  return null; // This component only manages state, no UI
}