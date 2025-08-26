import { setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';

import { getOptimizedDashboardData } from './dashboard/optimized-queries';
import { StreamableDashboard } from './dashboard/streamable-dashboard';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  // Use Streamable to defer data loading with proper suspense boundaries
  const streamableDashboardData = Streamable.from(() => getOptimizedDashboardData());

  return (
    <div className="h-full">
      {/* StreamableDashboard handles loading states with Stream component */}
      <StreamableDashboard data={streamableDashboardData} />
    </div>
  );
}