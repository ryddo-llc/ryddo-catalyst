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
      {/* Dashboard Content Panel Header */}
      <div className="mb-6 border-b border-[var(--account-card-border,hsl(var(--contrast-200)))] pb-4">
        <h2 className="font-[family-name:var(--account-title-font-family,var(--font-family-heading))] text-2xl font-bold text-[var(--account-title,hsl(var(--foreground)))]">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-[var(--account-subtitle,hsl(var(--contrast-500)))]">
          Overview of your account activity and quick actions
        </p>
      </div>

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