import { getFormatter } from 'next-intl/server';

export interface DashboardData {
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

function getOrderStatusType(status: string): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes('pending') || lowerStatus.includes('awaiting')) return 'pending';
  if (lowerStatus.includes('processing') || lowerStatus.includes('preparing')) return 'processing';
  if (lowerStatus.includes('shipped') || lowerStatus.includes('transit')) return 'shipped';
  if (lowerStatus.includes('delivered') || lowerStatus.includes('completed')) return 'delivered';
  if (lowerStatus.includes('cancelled') || lowerStatus.includes('refunded')) return 'cancelled';
  
  return 'pending';
}

export function dashboardTransformer(
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
    addresses: {
      edges: Array<{
        node: {
          firstName: string;
          lastName: string;
          address1: string;
          city: string;
          stateOrProvince?: string;
          postalCode?: string;
        };
      }>;
    };
    orders: {
      edges: Array<{
        node: {
          entityId: number;
          orderNumber: string;
          createdAt: {
            utc: string;
          };
          totalIncTax: {
            value: number;
            currencyCode: string;
          };
          status: {
            label: string;
          };
        };
      }>;
    };
    wishlists: {
      edges: Array<{
        node: {
          entityId: number;
          name: string;
          isPublic: boolean;
          items: {
            edges: unknown[];
          };
        };
      }>;
    };
  },
  formatter: Awaited<ReturnType<typeof getFormatter>>
): DashboardData {
  // Process orders
  const orders = customerData.orders.edges.map(edge => edge.node);
  const ordersSummary = {
    recent: orders.slice(0, 5).map(order => ({
      id: order.entityId.toString(),
      orderNumber: order.orderNumber,
      date: formatter.dateTime(new Date(order.createdAt.utc)),
      total: formatter.number(order.totalIncTax.value, {
        style: 'currency',
        currency: order.totalIncTax.currencyCode,
      }),
      status: order.status.label,
      statusType: getOrderStatusType(order.status.label),
    })),
    totalCount: orders.length,
  };

  // Process addresses
  const addresses = customerData.addresses.edges.map(edge => edge.node);
  const addressesSummary = {
    totalCount: addresses.length,
    primary: addresses.length > 0 ? {
      fullName: `${addresses[0]?.firstName || ''} ${addresses[0]?.lastName || ''}`,
      addressLine1: addresses[0]?.address1 || '',
      city: addresses[0]?.city || '',
      state: addresses[0]?.stateOrProvince || '',
      zipCode: addresses[0]?.postalCode || '',
    } : undefined,
  };

  // Process wishlists
  const wishlists = customerData.wishlists.edges.map(edge => edge.node);
  const wishlistsSummary = {
    recent: wishlists.slice(0, 3).map(wishlist => ({
      id: wishlist.entityId.toString(),
      name: wishlist.name,
      itemCount: wishlist.items.edges.length,
      isPublic: wishlist.isPublic,
      lastModified: new Date().toISOString(), // API doesn't provide lastModified
    })),
    totalCount: wishlists.length,
    totalItems: wishlists.reduce((sum, wishlist) => sum + wishlist.items.edges.length, 0),
  };

  // Calculate account status
  const hasCompletedProfile = !!(customerData.firstName && customerData.lastName && customerData.email);
  const hasAddresses = addresses.length > 0;
  const hasOrders = orders.length > 0;

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
    customerInfo: {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
    },
  };
}