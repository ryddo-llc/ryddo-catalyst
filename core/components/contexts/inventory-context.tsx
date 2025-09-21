'use client';

import React, { createContext, type ReactNode, useContext, useState } from 'react';

interface InventoryStatus {
  isInStock: boolean;
  status: 'Available' | 'Unavailable' | 'Preorder';
}

interface InventoryContextValue {
  inventoryStatus: InventoryStatus | null;
  setInventoryStatus: (status: InventoryStatus | null) => void;
}

const InventoryContext = createContext<InventoryContextValue>({
  inventoryStatus: null,
  setInventoryStatus: () => {
    // Default implementation
  },
});

interface InventoryProviderProps {
  children: ReactNode;
}

export function InventoryProvider({ children }: InventoryProviderProps) {
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus | null>(null);
  console.log(inventoryStatus);
  return (
    <InventoryContext.Provider value={{ inventoryStatus, setInventoryStatus }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);

  return context;
}
