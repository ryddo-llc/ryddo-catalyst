import { getFormatter } from 'next-intl/server';
import { cache } from 'react';

import { getSessionCustomerAccessToken } from '~/auth';
import { ordersTransformer } from '~/data-transformers/orders-transformer';

import { getCustomerAddresses } from '../addresses/page-data';
import { getCustomerOrders } from '../orders/page-data';
import { getCustomerSettingsQuery } from '../settings/page-data';
import { getCustomerWishlists } from '../wishlists/page-data';

export interface DashboardData {
  ordersSummary: {
    recent: Array<{
      id: string;
      orderNumber: string;
      date: string;
      total: string;
      status: string;
      statusType: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      trackingUrl?: string;
    }>;
    totalCount: number;
  };
  addressesSummary: {
    primary?: {
      fullName: string;
      addressLine1: string;
      city: string;
      state: string;
      zipCode: string;
    };
    totalCount: number;
  };
  wishlistsSummary: {
    recent: Array<{
      id: string;
      name: string;
      itemCount: number;
      isPublic: boolean;
      lastModified: string;
    }>;
    totalCount: number;
    totalItems: number;
  };
  accountStatus: {
    hasCompletedProfile: boolean;
    hasAddresses: boolean;
    hasOrders: boolean;
    completionPercentage: number;
  };
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const getDashboardData = cache(async (formatter: Awaited<ReturnType<typeof getFormatter>>): Promise<DashboardData> => {
  const customerAccessToken = await getSessionCustomerAccessToken();
  
  if (!customerAccessToken) {
    // Return empty dashboard for non-authenticated users
    return {
      ordersSummary: { recent: [], totalCount: 0 },
      addressesSummary: { totalCount: 0 },
      wishlistsSummary: { recent: [], totalCount: 0, totalItems: 0 },
      accountStatus: { hasCompletedProfile: false, hasAddresses: false, hasOrders: false, completionPercentage: 0 },
    };
  }

  try {
    // Fetch data in parallel for better performance
    const [ordersData, addressesData, wishlistsData, customerSettings] = await Promise.allSettled([
      getCustomerOrders({ limit: 5 }), // Get recent 5 orders
      getCustomerAddresses({ limit: 10 }), // Get addresses with proper pagination
      getCustomerWishlists({ limit: 3, before: null, after: null }), // Get recent 3 wishlists
      getCustomerSettingsQuery({}), // Get customer settings with empty props
    ]);

    // Process orders
    const ordersSummary: DashboardData['ordersSummary'] = {
      recent: [],
      totalCount: 0,
    };

    if (ordersData.status === 'fulfilled' && ordersData.value) {
      const transformedOrders = ordersTransformer(ordersData.value.orders, formatter);

      ordersSummary.recent = transformedOrders.slice(0, 5).map(order => ({
        id: order.id,
        orderNumber: order.id, // Use order id as order number since that's what's available
        date: new Date().toLocaleDateString(), // Would need to extract from order data
        total: order.totalPrice,
        status: order.status,
        statusType: getOrderStatusType(order.status),
        trackingUrl: undefined, // Would need to be extracted from order data
      }));
      ordersSummary.totalCount = transformedOrders.length; // Use array length as count
    }

    // Process addresses
    const addressesSummary: DashboardData['addressesSummary'] = {
      totalCount: 0,
      primary: undefined,
    };

    if (addressesData.status === 'fulfilled' && addressesData.value) {
      const addressData = addressesData.value;

      addressesSummary.totalCount = addressData.addresses.length;
      
      // Use first address as primary (defaultAddress property may not exist)
      const primaryAddress = addressData.addresses[0];
      if (primaryAddress) {
        addressesSummary.primary = {
          fullName: `${primaryAddress.firstName} ${primaryAddress.lastName}`,
          addressLine1: primaryAddress.address1,
          city: primaryAddress.city,
          state: primaryAddress.stateOrProvince || '',
          zipCode: primaryAddress.postalCode || '',
        };
      }
    }

    // Process wishlists
    const wishlistsSummary: DashboardData['wishlistsSummary'] = {
      recent: [],
      totalCount: 0,
      totalItems: 0,
    };

    if (wishlistsData.status === 'fulfilled' && wishlistsData.value) {
      const wishlistData = wishlistsData.value;
      const wishlists = wishlistData.edges?.map(edge => edge.node) || [];

      wishlistsSummary.totalCount = wishlists.length;
      wishlistsSummary.totalItems = wishlists.reduce((sum: number, w) => sum + (w.items.edges?.length || 0), 0);
      
      wishlistsSummary.recent = wishlists.slice(0, 3).map(wishlist => ({
        id: wishlist.entityId.toString(),
        name: wishlist.name,
        itemCount: wishlist.items.edges?.length || 0,
        isPublic: wishlist.isPublic,
        lastModified: new Date().toISOString(), // Placeholder - would need actual lastModified date
      }));
    }

    // Calculate account completion status
    const accountStatus = {
      hasCompletedProfile: !!(customerSettings.status === 'fulfilled' && customerSettings.value?.customerInfo),
      hasAddresses: addressesSummary.totalCount > 0,
      hasOrders: ordersSummary.totalCount > 0,
      completionPercentage: 0,
    };

    // Calculate completion percentage
    let completedSteps = 0;
    const totalSteps = 3;
    
    if (accountStatus.hasCompletedProfile) completedSteps += 1;
    if (accountStatus.hasAddresses) completedSteps += 1;
    if (accountStatus.hasOrders) completedSteps += 1;
    
    accountStatus.completionPercentage = Math.round((completedSteps / totalSteps) * 100);

    // Get customer info
    const customerInfo = customerSettings.status === 'fulfilled' && customerSettings.value?.customerInfo ? {
      firstName: customerSettings.value.customerInfo.firstName,
      lastName: customerSettings.value.customerInfo.lastName,
      email: customerSettings.value.customerInfo.email,
    } : undefined;

    return {
      ordersSummary,
      addressesSummary,
      wishlistsSummary,
      accountStatus,
      customerInfo,
    };
  } catch {
    // Return empty dashboard on error
    return {
      ordersSummary: { recent: [], totalCount: 0 },
      addressesSummary: { totalCount: 0 },
      wishlistsSummary: { recent: [], totalCount: 0, totalItems: 0 },
      accountStatus: { hasCompletedProfile: false, hasAddresses: false, hasOrders: false, completionPercentage: 0 },
    };
  }
});

function getOrderStatusType(status: string): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes('pending') || lowerStatus.includes('awaiting')) return 'pending';
  if (lowerStatus.includes('processing') || lowerStatus.includes('preparing')) return 'processing';
  if (lowerStatus.includes('shipped') || lowerStatus.includes('transit')) return 'shipped';
  if (lowerStatus.includes('delivered') || lowerStatus.includes('completed')) return 'delivered';
  if (lowerStatus.includes('cancelled') || lowerStatus.includes('refunded')) return 'cancelled';
  
  return 'pending';
}