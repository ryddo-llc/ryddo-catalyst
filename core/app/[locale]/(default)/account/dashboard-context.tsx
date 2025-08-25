'use client';

import { createContext, useContext } from 'react';

import { DashboardData } from './dashboard/page-data';

interface DashboardContextValue {
  data: DashboardData | null;
  isLoading: boolean;
  error?: Error;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function useDashboardData() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardProvider');
  }
  return context;
}

export function DashboardProvider({ 
  children, 
  value 
}: { 
  children: React.ReactNode; 
  value: DashboardContextValue;
}) {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}