import { getFormatter } from 'next-intl/server';
import { cache } from 'react';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { DashboardData } from '~/data-transformers/dashboard-transformer';
import { ordersTransformer } from '~/data-transformers/orders-transformer';

import { getCustomerAddresses } from '../addresses/page-data';
import { getCustomerOrders } from '../orders/page-data';
import { getCustomerSettingsQuery } from '../settings/page-data';
import { getCustomerWishlists } from '../wishlists/page-data';

// Simple customer query as backup if settings query fails
const CustomerInfoQuery = graphql(`
  query CustomerInfoQuery {
    customer {
      entityId
      firstName
      lastName
      email
    }
  }
`);

async function getDirectCustomerInfo() {
  const customerAccessToken = await getSessionCustomerAccessToken();
  
  if (!customerAccessToken) return null;
  
  try {
    const { data } = await client.fetch({
      document: CustomerInfoQuery,
      customerAccessToken,
      fetchOptions: { cache: 'no-store', next: { tags: [TAGS.customer] } },
    });

    return data.customer ? {
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      email: data.customer.email,
    } : null;
  } catch {
    return null;
  }
}

function getOrderStatusType(status: string): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes('pending') || lowerStatus.includes('awaiting')) return 'pending';
  if (lowerStatus.includes('processing') || lowerStatus.includes('preparing')) return 'processing';
  if (lowerStatus.includes('shipped') || lowerStatus.includes('transit')) return 'shipped';
  if (lowerStatus.includes('delivered') || lowerStatus.includes('completed')) return 'delivered';
  if (lowerStatus.includes('cancelled') || lowerStatus.includes('refunded')) return 'cancelled';
  
  return 'pending';
}

export const getDashboardData = cache(async (): Promise<DashboardData | null> => {
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
    // Fetch data in parallel using existing working functions
    const [ordersData, addressesData, wishlistsData, customerSettings] = await Promise.allSettled([
      getCustomerOrders({ limit: 5 }),
      getCustomerAddresses({ limit: 10 }),
      getCustomerWishlists({ limit: 3, before: null, after: null }),
      getCustomerSettingsQuery({}),
    ]);

    const formatter = await getFormatter();

    // Process orders
    
    const ordersSummary = ordersData.status === 'fulfilled' && ordersData.value ? (() => {
      const transformedOrders = ordersTransformer(ordersData.value.orders, formatter);
      
      return {
        recent: transformedOrders.slice(0, 5).map(order => ({
          id: order.id,
          orderNumber: order.id,
          date: formatter.dateTime(new Date()),
          total: order.totalPrice,
          status: order.status,
          statusType: getOrderStatusType(order.status),
        })),
        totalCount: transformedOrders.length,
      };
    })() : { recent: [], totalCount: 0 };

    // Process addresses
    
    const addressesSummary = addressesData.status === 'fulfilled' && addressesData.value ? (() => {
      const addresses = addressesData.value.addresses;
      
      return {
        totalCount: addresses.length,
        primary: addresses.length > 0 ? {
          fullName: `${addresses[0]?.firstName || ''} ${addresses[0]?.lastName || ''}`,
          addressLine1: addresses[0]?.address1 || '',
          city: addresses[0]?.city || '',
          state: addresses[0]?.stateOrProvince || '',
          zipCode: addresses[0]?.postalCode || '',
        } : undefined,
      };
    })() : { totalCount: 0 };

    // Process wishlists
    
    const wishlistsSummary = wishlistsData.status === 'fulfilled' && wishlistsData.value ? (() => {
      const wishlists = wishlistsData.value.edges?.map((edge) => edge.node) || [];
      
      return {
        recent: wishlists.slice(0, 3).map((wishlist) => ({
          id: wishlist.entityId.toString(),
          name: wishlist.name,
          itemCount: wishlist.items.edges?.length || 0,
          isPublic: wishlist.isPublic,
          lastModified: new Date().toISOString(),
        })),
        totalCount: wishlists.length,
        totalItems: wishlists.reduce((sum, wishlist) => sum + (wishlist.items.edges?.length || 0), 0),
      };
    })() : { recent: [], totalCount: 0, totalItems: 0 };

    // Get customer info
    let customerInfo = customerSettings.status === 'fulfilled' && customerSettings.value?.customerInfo ? {
      firstName: customerSettings.value.customerInfo.firstName,
      lastName: customerSettings.value.customerInfo.lastName,
      email: customerSettings.value.customerInfo.email,
    } : undefined;

    // If settings query didn't provide customer info, try direct customer query
    if (!customerInfo) {
      customerInfo = (await getDirectCustomerInfo()) || undefined;
    }

    // Calculate account status
    const hasCompletedProfile = !!(customerInfo);
    const hasAddresses = addressesSummary.totalCount > 0;
    const hasOrders = ordersSummary.totalCount > 0;

    let completedSteps = 0;
    const totalSteps = 3;
    
    if (hasCompletedProfile) completedSteps += 1;
    if (hasAddresses) completedSteps += 1;
    if (hasOrders) completedSteps += 1;

    const accountStatus = {
      hasCompletedProfile,
      hasAddresses,
      hasOrders,
      completionPercentage: Math.round((completedSteps / totalSteps) * 100),
    };

    return {
      ordersSummary,
      addressesSummary,
      wishlistsSummary,
      accountStatus,
      customerInfo,
    };
  } catch (error) {
    // Log error in development but return empty dashboard in production  
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Dashboard data fetch error:', error);
    }

    return {
      ordersSummary: { recent: [], totalCount: 0 },
      addressesSummary: { totalCount: 0 },
      wishlistsSummary: { recent: [], totalCount: 0, totalItems: 0 },
      accountStatus: { hasCompletedProfile: false, hasAddresses: false, hasOrders: false, completionPercentage: 0 },
    };
  }
});