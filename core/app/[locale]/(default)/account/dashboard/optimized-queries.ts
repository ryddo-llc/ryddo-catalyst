import { unstable_cache } from 'next/cache';
import { cache } from 'react';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { TAGS } from '~/client/tags';

// Lightweight query for dashboard summary - only fetches counts and essential info
const DashboardSummaryQuery = graphql(`
  query DashboardSummaryQuery {
    customer {
      entityId
      firstName
      lastName
      email
      addresses {
        collectionInfo {
          totalItems
        }
        edges(first: 1) {
          node {
            firstName
            lastName
            address1
            city
            stateOrProvince
            postalCode
          }
        }
      }
      orders {
        collectionInfo {
          totalItems
        }
        edges(first: 3) {
          node {
            entityId
            orderedAt {
              utc
            }
            status {
              label
              value
            }
            totalIncTax {
              value
              currencyCode
            }
          }
        }
      }
      wishlists {
        collectionInfo {
          totalItems
        }
        edges(first: 3) {
          node {
            entityId
            name
            isPublic
            items {
              collectionInfo {
                totalItems
              }
            }
          }
        }
      }
    }
  }
`);

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

function getOrderStatusType(status: string): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes('pending') || lowerStatus.includes('awaiting')) return 'pending';
  if (lowerStatus.includes('processing') || lowerStatus.includes('preparing')) return 'processing';
  if (lowerStatus.includes('shipped') || lowerStatus.includes('transit')) return 'shipped';
  if (lowerStatus.includes('delivered') || lowerStatus.includes('completed')) return 'delivered';
  if (lowerStatus.includes('cancelled') || lowerStatus.includes('refunded')) return 'cancelled';
  
  return 'pending';
}

function formatCurrency(value: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

const fetchDashboardData = async (customerAccessToken: string): Promise<OptimizedDashboardData> => {
  try {
    const { data } = await client.fetch({
      document: DashboardSummaryQuery,
      customerAccessToken,
      fetchOptions: { 
        next: { 
          revalidate,
          tags: [TAGS.customer, 'account-dashboard']
        }
      },
    });

    if (!data.customer) {
      throw new Error('Customer data not found');
    }

    const customer = data.customer;

    // Process orders
    const ordersSummary = {
      totalCount: customer.orders?.collectionInfo ? ((customer.orders.collectionInfo as any)?.totalItems || 0) : 0,
      recent: customer.orders?.edges?.map(edge => ({
        id: edge.node.entityId.toString(),
        orderNumber: edge.node.entityId.toString(),
        date: new Date(edge.node.orderedAt.utc).toLocaleDateString(),
        total: formatCurrency(edge.node.totalIncTax.value, edge.node.totalIncTax.currencyCode),
        status: edge.node.status.label,
        statusType: getOrderStatusType(edge.node.status.label),
      })) ?? [],
    };

    // Process addresses
    const addressesData = customer.addresses;
    const addressesSummary = {
      totalCount: addressesData?.collectionInfo ? ((addressesData.collectionInfo as any)?.totalItems || 0) : 0,
      primary: addressesData?.edges?.[0] ? {
        fullName: `${addressesData.edges[0].node.firstName} ${addressesData.edges[0].node.lastName}`,
        addressLine1: addressesData.edges[0].node.address1,
        city: addressesData.edges[0].node.city,
        state: addressesData.edges[0].node.stateOrProvince || '',
        zipCode: addressesData.edges[0].node.postalCode || '',
      } : undefined,
    };

    // Process wishlists
    const wishlistsData = customer.wishlists;
    const wishlistsSummary = {
      totalCount: wishlistsData?.collectionInfo ? ((wishlistsData.collectionInfo as any)?.totalItems || 0) : 0,
      totalItems: wishlistsData?.edges?.reduce((sum, edge) => 
        sum + ((edge.node.items?.collectionInfo as any)?.totalItems ?? 0), 0
      ) ?? 0,
      recent: wishlistsData?.edges?.map(edge => ({
        id: edge.node.entityId.toString(),
        name: edge.node.name,
        itemCount: (edge.node.items?.collectionInfo as any)?.totalItems ?? 0,
        isPublic: edge.node.isPublic,
        lastModified: new Date().toISOString(), // Placeholder - would need actual date from API
      })) ?? [],
    };

    // Calculate account completion status
    const hasCompletedProfile = !!(customer.firstName && customer.lastName && customer.email);
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

    // Customer info
    const customerInfo = hasCompletedProfile ? {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    } : undefined;

    return {
      ordersSummary,
      addressesSummary,
      wishlistsSummary,
      accountStatus,
      customerInfo,
    };

  } catch (error) {
    console.error('Failed to fetch optimized dashboard data:', error);
    
    // Return empty dashboard on error
    return {
      ordersSummary: { recent: [], totalCount: 0 },
      addressesSummary: { totalCount: 0 },
      wishlistsSummary: { recent: [], totalCount: 0, totalItems: 0 },
      accountStatus: { hasCompletedProfile: false, hasAddresses: false, hasOrders: false, completionPercentage: 0 },
    };
  }
};

// Cached version with customer-specific key
const getCachedDashboardData = unstable_cache(
  fetchDashboardData,
  ['dashboard-data'],
  {
    tags: [TAGS.customer, 'account-dashboard'],
    revalidate: 300, // 5 minutes cache
  }
);

export const getOptimizedDashboardData = cache(async (): Promise<OptimizedDashboardData> => {
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

  return getCachedDashboardData(customerAccessToken);
});