import { Stream, Streamable } from '@/vibes/soul/lib/streamable';

import { DashboardData } from './page-data';
import { DashboardWidgets } from './widgets/dashboard-widgets';

interface AccountDashboardProps {
  data: Streamable<DashboardData>;
  welcomeMessage: string;
  recentOrdersTitle: string;
  quickActionsTitle: string;
  accountStatusTitle: string;
  wishlistPreviewTitle: string;
  viewAllOrdersLabel: string;
  viewAllAddressesLabel: string;
  viewAllWishlistsLabel: string;
  editProfileLabel: string;
  addAddressLabel: string;
  noOrdersMessage: string;
  noWishlistsMessage: string;
  orderNumberLabel: string;
  orderDateLabel: string;
  orderTotalLabel: string;
  orderStatusLabel: string;
  trackOrderLabel: string;
  reorderLabel: string;
}

export function AccountDashboard({
  data,
  welcomeMessage,
  recentOrdersTitle,
  quickActionsTitle,
  accountStatusTitle,
  wishlistPreviewTitle,
  viewAllOrdersLabel,
  viewAllAddressesLabel,
  viewAllWishlistsLabel,
  editProfileLabel,
  addAddressLabel,
  noOrdersMessage,
  noWishlistsMessage,
  orderNumberLabel,
  orderDateLabel,
  orderTotalLabel,
  orderStatusLabel,
  trackOrderLabel,
  reorderLabel,
}: AccountDashboardProps) {
  return (
    <div className="@container">
      <Stream
        fallback={
          <div className="space-y-8">
            {/* Loading skeleton */}
            <div className="grid gap-4 @md:grid-cols-2 @xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-contrast-100" />
              ))}
            </div>
            <div className="grid gap-8 @xl:grid-cols-2">
              <div className="h-96 animate-pulse rounded-2xl bg-contrast-100" />
              <div className="h-96 animate-pulse rounded-2xl bg-contrast-100" />
            </div>
          </div>
        }
        value={data}
      >
        {(dashboardData) => (
          <DashboardWidgets
            data={dashboardData}
            labels={{
              welcomeMessage,
              recentOrdersTitle,
              quickActionsTitle,
              accountStatusTitle,
              wishlistPreviewTitle,
              viewAllOrdersLabel,
              viewAllAddressesLabel,
              viewAllWishlistsLabel,
              editProfileLabel,
              addAddressLabel,
              noOrdersMessage,
              noWishlistsMessage,
              orderNumberLabel,
              orderDateLabel,
              orderTotalLabel,
              orderStatusLabel,
              trackOrderLabel,
              reorderLabel,
            }}
          />
        )}
      </Stream>
    </div>
  );
}