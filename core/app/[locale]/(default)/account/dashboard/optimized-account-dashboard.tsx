'use client';

import { useDashboardData } from '../dashboard-context';

import { OptimizedDashboardWidgets } from './widgets/optimized-widgets';

export function OptimizedAccountDashboard() {
  const { data, isLoading, error } = useDashboardData();

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Unable to load dashboard data
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Please refresh the page or try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-8">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="h-32 animate-pulse rounded-2xl bg-contrast-100" key={i} />
          ))}
        </div>
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-contrast-100" />
          <div className="h-96 animate-pulse rounded-2xl bg-contrast-100" />
        </div>
      </div>
    );
  }

  return <OptimizedDashboardWidgets data={data} />;
}