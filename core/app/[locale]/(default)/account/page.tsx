import { setRequestLocale } from 'next-intl/server';

import { OptimizedAccountDashboard } from './dashboard/optimized-account-dashboard';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="h-full">
    {/* Dashboard Content - now uses shared data from context */}
      <OptimizedAccountDashboard />
    </div>
  );
}
