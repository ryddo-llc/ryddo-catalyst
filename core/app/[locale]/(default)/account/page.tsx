import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

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
        data={streamableDashboardData}
        welcomeMessage="Welcome back"
        recentOrdersTitle="Recent Orders"
        quickActionsTitle="Quick Actions"
        accountStatusTitle="Account Status"
        wishlistPreviewTitle="Wishlist Preview"
        viewAllOrdersLabel="View All Orders"
        viewAllAddressesLabel="View All Addresses"
        viewAllWishlistsLabel="View All Wishlists"
        editProfileLabel="Edit Profile"
        addAddressLabel="Add Address"
        noOrdersMessage="You don't have any orders yet"
        noWishlistsMessage="You don't have any wishlists yet"
        orderNumberLabel="Order #"
        orderDateLabel="Date"
        orderTotalLabel="Total"
        orderStatusLabel="Status"
        trackOrderLabel="Track Order"
        reorderLabel="Reorder"
      />
    </div>
  );
}