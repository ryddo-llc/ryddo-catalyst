import type { DashboardData } from '~/data-transformers/dashboard-transformer';

import { OptimizedDashboardWidgets } from './widgets/optimized-widgets';

interface DashboardProps {
  data: DashboardData | null;
}

export function StreamableDashboard({ data }: DashboardProps) {
  if (!data) {
    return (
      <div className="rounded-lg border border-contrast-200 p-8 text-center">
        <p className="text-contrast-500">Unable to load dashboard data. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <OptimizedDashboardWidgets data={data} />
    </div>
  );
}