import { getFormatter } from 'next-intl/server';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { ordersTransformer } from '~/data-transformers/orders-transformer';

import { getCustomerAddresses } from '../addresses/page-data';
import { getCustomerOrders } from '../orders/page-data';
import { getCustomerSettingsQuery } from '../settings/page-data';
import { getCustomerWishlists } from '../wishlists/page-data';

export interface OptimizedDashboardData {
  ordersSummary: {
    recent: Array<{
      id: string;
      orderNumber: string;
      date: string;
      total: string;
      status: string;
      statusType: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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

// Helper function to process orders data
function processOrdersData(
  ordersData: PromiseSettledResult<Awaited<ReturnType<typeof getCustomerOrders>>>,
  formatter: Awaited<ReturnType<typeof getFormatter>>
): OptimizedDashboardData['ordersSummary'] {
  const ordersSummary: OptimizedDashboardData['ordersSummary'] = {
    recent: [],
    totalCount: 0,
  };

  if (ordersData.status === 'fulfilled' && ordersData.value) {
    const transformedOrders = ordersTransformer(ordersData.value.orders, formatter);

    ordersSummary.recent = transformedOrders.slice(0, 5).map(order => ({
      id: order.id,
      orderNumber: order.id,
      date: new Date().toLocaleDateString(),
      total: order.totalPrice,
      status: order.status,
      statusType: getOrderStatusType(order.status),
    }));
    ordersSummary.totalCount = transformedOrders.length;
  }

  return ordersSummary;
}

// Helper function to process addresses data
function processAddressesData(
  addressesData: PromiseSettledResult<Awaited<ReturnType<typeof getCustomerAddresses>>>
): OptimizedDashboardData['addressesSummary'] {
  const addressesSummary: OptimizedDashboardData['addressesSummary'] = {
    totalCount: 0,
    primary: undefined,
  };

  if (addressesData.status === 'fulfilled' && addressesData.value) {
    const addressData = addressesData.value;

    addressesSummary.totalCount = addressData.addresses.length;

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

  return addressesSummary;
}

// Helper function to process wishlists data
function processWishlistsData(
  wishlistsData: PromiseSettledResult<Awaited<ReturnType<typeof getCustomerWishlists>>>
): OptimizedDashboardData['wishlistsSummary'] {
  const wishlistsSummary: OptimizedDashboardData['wishlistsSummary'] = {
    recent: [],
    totalCount: 0,
    totalItems: 0,
  };

  if (wishlistsData.status === 'fulfilled' && wishlistsData.value) {
    const wishlistData = wishlistsData.value;
    const wishlists = wishlistData.edges?.map((edge) => edge.node) || [];

    wishlistsSummary.totalCount = wishlists.length;
    wishlistsSummary.totalItems = wishlists.reduce(
      (sum, wishlist) => sum + (wishlist.items.edges?.length || 0), 
      0
    );
    
    wishlistsSummary.recent = wishlists.slice(0, 3).map((wishlist) => ({
      id: wishlist.entityId.toString(),
      name: wishlist.name,
      itemCount: wishlist.items.edges?.length || 0,
      isPublic: wishlist.isPublic,
      lastModified: new Date().toISOString(),
    }));
  }

  return wishlistsSummary;
}

// Helper function to calculate account status
function calculateAccountStatus(
  ordersSummary: OptimizedDashboardData['ordersSummary'],
  addressesSummary: OptimizedDashboardData['addressesSummary'],
  customerSettings: PromiseSettledResult<Awaited<ReturnType<typeof getCustomerSettingsQuery>>>
): OptimizedDashboardData['accountStatus'] {
  const hasCompletedProfile = !!(customerSettings.status === 'fulfilled' && customerSettings.value?.customerInfo);
  const hasAddresses = addressesSummary.totalCount > 0;
  const hasOrders = ordersSummary.totalCount > 0;

  let completedSteps = 0;
  const totalSteps = 3;
  
  if (hasCompletedProfile) completedSteps += 1;
  if (hasAddresses) completedSteps += 1;
  if (hasOrders) completedSteps += 1;

  return {
    hasCompletedProfile,
    hasAddresses,
    hasOrders,
    completionPercentage: Math.round((completedSteps / totalSteps) * 100),
  };
}

const fetchDashboardData = async (formatter: Awaited<ReturnType<typeof getFormatter>>): Promise<OptimizedDashboardData> => {
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
      getCustomerOrders({ limit: 5 }),
      getCustomerAddresses({ limit: 10 }),
      getCustomerWishlists({ limit: 3, before: null, after: null }),
      getCustomerSettingsQuery({}),
    ]);

    // Process data using helper functions
    const ordersSummary = processOrdersData(ordersData, formatter);
    const addressesSummary = processAddressesData(addressesData);
    const wishlistsSummary = processWishlistsData(wishlistsData);
    const accountStatus = calculateAccountStatus(ordersSummary, addressesSummary, customerSettings);

    // Get customer info from settings query
    let customerInfo = customerSettings.status === 'fulfilled' && customerSettings.value?.customerInfo ? {
      firstName: customerSettings.value.customerInfo.firstName,
      lastName: customerSettings.value.customerInfo.lastName,
      email: customerSettings.value.customerInfo.email,
    } : undefined;

    // If settings query didn't provide customer info, try direct customer query
    if (!customerInfo) {
      customerInfo = (await getDirectCustomerInfo()) || undefined;
    }

    return {
      ordersSummary,
      addressesSummary,
      wishlistsSummary,
      accountStatus,
      customerInfo,
    };
  } catch {
    // Silently handle errors and return empty dashboard
    
    // Return empty dashboard on error
    return {
      ordersSummary: { recent: [], totalCount: 0 },
      addressesSummary: { totalCount: 0 },
      wishlistsSummary: { recent: [], totalCount: 0, totalItems: 0 },
      accountStatus: { hasCompletedProfile: false, hasAddresses: false, hasOrders: false, completionPercentage: 0 },
    };
  }
};

// Temporarily removed caching for debugging customer info issue
export const getOptimizedDashboardData = async (): Promise<OptimizedDashboardData> => {
  const formatter = await getFormatter();
  
  return fetchDashboardData(formatter);
};