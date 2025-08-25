'use client';

import { createContext, useContext } from 'react';

import { OptimizedDashboardData } from './dashboard/optimized-queries';

interface DashboardContextValue {
  data: OptimizedDashboardData | null;
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