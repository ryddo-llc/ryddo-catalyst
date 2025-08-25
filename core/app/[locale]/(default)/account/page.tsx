import { getFormatter, setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';

import { AccountDashboard } from './dashboard/account-dashboard';
import { getDashboardData } from './dashboard/page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const format = await getFormatter();

  // Create streamable dashboard data
  const streamableDashboardData = Streamable.from(async () => {
    return getDashboardData(format);
  });

  return (
    <div className="h-full">
      {/* Dashboard Content */}
      <AccountDashboard
        accountStatusTitle="Account Status"
        addAddressLabel="Add Address"
        data={streamableDashboardData}
        editProfileLabel="Edit Profile"
        noOrdersMessage="You don't have any orders yet"
        noWishlistsMessage="You don't have any wishlists yet"
        orderDateLabel="Date"
        orderNumberLabel="Order #"
        orderStatusLabel="Status"
        orderTotalLabel="Total"
        quickActionsTitle="Quick Actions"
        recentOrdersTitle="Recent Orders"
        reorderLabel="Reorder"
        trackOrderLabel="Track Order"
        viewAllAddressesLabel="View All Addresses"
        viewAllOrdersLabel="View All Orders"
        viewAllWishlistsLabel="View All Wishlists"
        welcomeMessage="Welcome back"
        wishlistPreviewTitle="Wishlist Preview"
      />
    </div>
  );
}
