'use client';

import { clsx } from 'clsx';
import { Heart, MapPin, Package, Settings, TrendingUp } from 'lucide-react';

import { ArrowButton } from '~/components/arrow-button';
import { Link } from '~/components/link';

import { OptimizedDashboardData } from '../optimized-queries';

// Stat card component (memoization temporarily removed for debugging)
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  href, 
  color 
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  href: string;
  color: 'blue' | 'green' | 'pink' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    pink: 'bg-pink-100 text-pink-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <Link
      className="group relative overflow-hidden rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-3 transition-all duration-300 hover:border-[#F92F7B]/50 hover:shadow-md"
      href={href}
    >
      <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5 transition-all duration-300 group-hover:scale-110" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className={clsx('rounded-full p-1.5', colorClasses[color])}>
            <Icon className="h-3 w-3" />
          </div>
        </div>
        
        <div className="mt-2">
          <div className="text-lg font-bold text-[var(--account-card-title,hsl(var(--foreground)))]">
            {value}
          </div>
          <div className="text-xs text-[var(--account-card-description,hsl(var(--contrast-500)))]">
            {label}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Status item component (memoization temporarily removed for debugging)  
function StatusItem({ 
  label, 
  completed 
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={clsx(
        'h-2 w-2 rounded-full',
        completed ? 'bg-[#F92F7B]' : 'bg-[var(--account-card-border,hsl(var(--contrast-200)))]'
      )} />
      <span className={clsx(
        'text-sm',
        completed 
          ? 'text-[var(--account-card-title,hsl(var(--foreground)))]' 
          : 'text-[var(--account-card-description,hsl(var(--contrast-500)))]'
      )}>
        {label}
      </span>
    </div>
  );
}

// Order item component (memoization temporarily removed for debugging)
function OrderItem({
  order
}: {
  order: OptimizedDashboardData['ordersSummary']['recent'][0];
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] p-4" key={order.id}>
      <div className="flex-1">
        <div className="font-semibold text-[var(--account-card-title,hsl(var(--foreground)))]">
          #{order.orderNumber}
        </div>
        <div className="text-sm text-[var(--account-card-description,hsl(var(--contrast-500)))]">
          {order.date} • {order.total}
        </div>
      </div>
      <div className="text-right">
        <span className={clsx(
          'inline-flex rounded-full px-2 py-1 text-xs font-medium',
          {
            'bg-yellow-100 text-yellow-800': order.statusType === 'pending',
            'bg-blue-100 text-blue-800': order.statusType === 'processing',
            'bg-purple-100 text-purple-800': order.statusType === 'shipped',
            'bg-green-100 text-green-800': order.statusType === 'delivered',
            'bg-red-100 text-red-800': order.statusType === 'cancelled',
          }
        )}>
          {order.status}
        </span>
      </div>
    </div>
  );
}

// Wishlist item component (memoization temporarily removed for debugging)
function WishlistItem({
  wishlist
}: {
  wishlist: OptimizedDashboardData['wishlistsSummary']['recent'][0];
}) {
  return (
    <Link
      className="group rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] p-4 transition-all hover:border-[#F92F7B]/50 hover:shadow-md"
      href={`/account/wishlists/${wishlist.id}`}
      key={wishlist.id}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-[var(--account-card-title,hsl(var(--foreground)))] group-hover:text-[#F92F7B]">
            {wishlist.name}
          </h4>
          <p className="text-sm text-[var(--account-card-description,hsl(var(--contrast-500)))]">
            {wishlist.itemCount} items
          </p>
        </div>
        <div className={clsx(
          'rounded-full px-2 py-1 text-xs font-medium',
          wishlist.isPublic 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        )}>
          {wishlist.isPublic ? 'Public' : 'Private'}
        </div>
      </div>
    </Link>
  );
}

interface OptimizedDashboardWidgetsProps {
  data: OptimizedDashboardData;
}

export function OptimizedDashboardWidgets({ 
  data 
}: OptimizedDashboardWidgetsProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-left">
        <h3 className="font-[family-name:var(--account-title-font-family,var(--font-family-heading))] text-lg font-bold text-[var(--account-title,hsl(var(--foreground)))]">
          Welcome back{data.customerInfo?.firstName ? `, ${data.customerInfo.firstName}` : ''}<span className="ml-1 text-[#F92F7B]">!</span>
        </h3>
        <p className="mt-1 text-sm text-[var(--account-subtitle,hsl(var(--contrast-500)))]">
          Here's an overview of your account activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-2">
        <StatCard
          color="blue"
          href="/account/orders"
          icon={Package}
          label="Orders"
          value={data.ordersSummary.totalCount}
        />
        <StatCard
          color="green"
          href="/account/addresses"
          icon={MapPin}
          label="Addresses"
          value={data.addressesSummary.totalCount}
        />
        <StatCard
          color="pink"
          href="/account/wishlists"
          icon={Heart}
          label="Wishlists"
          value={data.wishlistsSummary.totalCount}
        />
        <StatCard
          color="purple"
          href="/account/settings"
          icon={TrendingUp}
          label="Profile Complete"
          value={`${data.accountStatus.completionPercentage}%`}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="space-y-6">
        {/* Recent Orders */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-4">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
          
          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-[family-name:var(--account-card-title-font-family,var(--font-family-heading))] text-xl font-extrabold text-[var(--account-card-title,hsl(var(--foreground)))]">
                Recent Orders
              </h3>
              <Link href="/account/orders">
                <ArrowButton className="text-xs">
                  View All Orders
                </ArrowButton>
              </Link>
            </div>

            {data.ordersSummary.recent.length > 0 ? (
              <div className="space-y-4">
                {data.ordersSummary.recent.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-[var(--account-card-description,hsl(var(--contrast-500)))]" />
                <p className="mt-4 text-[var(--account-card-description,hsl(var(--contrast-500)))]">
                  You don't have any orders yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-4">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
          
          <div className="relative">
            <h3 className="mb-6 font-[family-name:var(--account-card-title-font-family,var(--font-family-heading))] text-xl font-extrabold text-[var(--account-card-title,hsl(var(--foreground)))]">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <Link
                className="flex items-center gap-3 rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] p-3 transition-colors hover:bg-[var(--account-card-hover,hsl(var(--contrast-50)))]"
                href="/account/settings"
              >
                <Settings className="h-4 w-4 text-[#F92F7B]" />
                <span className="text-sm font-medium">Edit Profile</span>
              </Link>
              
              <Link
                className="flex items-center gap-3 rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] p-3 transition-colors hover:bg-[var(--account-card-hover,hsl(var(--contrast-50)))]"
                href="/account/addresses"
              >
                <MapPin className="h-4 w-4 text-[#F92F7B]" />
                <span className="text-sm font-medium">Add Address</span>
              </Link>
              
              <Link
                className="flex items-center gap-3 rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] p-3 transition-colors hover:bg-[var(--account-card-hover,hsl(var(--contrast-50)))]"
                href="/account/wishlists"
              >
                <Heart className="h-4 w-4 text-[#F92F7B]" />
                <span className="text-sm font-medium">View All Wishlists</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-4">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
          
          <div className="relative">
            <h3 className="mb-6 font-[family-name:var(--account-card-title-font-family,var(--font-family-heading))] text-xl font-extrabold text-[var(--account-card-title,hsl(var(--foreground)))]">
              Account Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--account-card-title,hsl(var(--foreground)))]">
                  Profile Completion
                </span>
                <span className="text-sm font-bold text-[#F92F7B]">
                  {data.accountStatus.completionPercentage}%
                </span>
              </div>
              
              <div className="h-2 w-full rounded-full bg-[var(--account-card-border,hsl(var(--contrast-200)))]">
                <div
                  className="h-2 rounded-full bg-[#F92F7B] transition-all duration-300"
                  style={{ width: `${data.accountStatus.completionPercentage}%` }}
                />
              </div>

              <div className="space-y-2">
                <StatusItem
                  completed={data.accountStatus.hasCompletedProfile}
                  label="Profile Information"
                />
                <StatusItem
                  completed={data.accountStatus.hasAddresses}
                  label="Shipping Address"
                />
                <StatusItem
                  completed={data.accountStatus.hasOrders}
                  label="First Order"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Preview */}
      {data.wishlistsSummary.recent.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-4">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
          
          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-[family-name:var(--account-card-title-font-family,var(--font-family-heading))] text-xl font-extrabold text-[var(--account-card-title,hsl(var(--foreground)))]">
                Wishlist Preview
              </h3>
              <Link href="/account/wishlists">
                <ArrowButton className="text-xs">
                  View All Wishlists
                </ArrowButton>
              </Link>
            </div>

            <div className="space-y-3">
              {data.wishlistsSummary.recent.map((wishlist) => (
                <WishlistItem key={wishlist.id} wishlist={wishlist} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}