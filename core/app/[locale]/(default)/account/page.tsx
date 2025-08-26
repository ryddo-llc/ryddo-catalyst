import { Stream, Streamable } from '~/vibes/soul/lib/streamable';

import { getDashboardData } from './dashboard/page-data';
import { StreamableDashboard } from './dashboard/streamable-dashboard';
import Loading from './loading';

export default function AccountPage() {
  const dashboardData = Streamable.from(() => getDashboardData());

  return (
    <div className="h-full">
      <Stream fallback={<Loading />} value={dashboardData}>
        {(data) => <StreamableDashboard data={data} />}
      </Stream>
    </div>
  );
}
