import { PropsWithChildren } from 'react';

import { getOptimizedDashboardData } from './dashboard/optimized-queries';
import { DashboardProvider } from './dashboard-context';

export async function DashboardDataProvider({ children }: PropsWithChildren) {
  // Fetch optimized dashboard data
  let dashboardData = null;
  let dataError;

  try {
    dashboardData = await getOptimizedDashboardData();
  } catch (error) {
    dataError = error instanceof Error ? error : new Error('Failed to load dashboard data');
  }

  return (
    <DashboardProvider 
      value={{ 
        data: dashboardData, 
        isLoading: false, 
        error: dataError 
      }}
    >
      {children}
    </DashboardProvider>
  );
}