import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

import { Order, OrderList } from '@/vibes/soul/sections/order-list';
import { ordersTransformer } from '~/data-transformers/orders-transformer';
import { defaultPageInfo, pageInfoTransformer } from '~/data-transformers/page-info-transformer';

import { getCustomerOrders } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
    before?: string;
    after?: string;
  }>;
}

async function getOrders(after?: string, before?: string): Promise<Order[]> {
  const format = await getFormatter();
  const customerOrdersDetails = await getCustomerOrders({
    ...(after && { after }),
    ...(before && { before }),
  });

  if (!customerOrdersDetails) {
    return [];
  }

  const { orders } = customerOrdersDetails;

  return ordersTransformer(orders, format);
}

async function getPaginationInfo(after?: string, before?: string) {
  const customerOrdersDetails = await getCustomerOrders({
    ...(after && { after }),
    ...(before && { before }),
  });

  return pageInfoTransformer(customerOrdersDetails?.pageInfo ?? defaultPageInfo);
}

export default async function Orders({ params, searchParams }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const { before, after } = await searchParams;
  const t = await getTranslations('Account.Orders');

  return (
    <div className="h-full">
      {/* Content Panel Header */}
      <div className="mb-6 border-b border-[var(--account-card-border,hsl(var(--contrast-200)))] pb-4">
        <h2 className="font-[family-name:var(--account-title-font-family,var(--font-family-heading))] text-2xl font-bold text-[var(--account-title,hsl(var(--foreground)))]">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--account-subtitle,hsl(var(--contrast-500)))]">
          View and track all your orders
        </p>
      </div>

      {/* Orders Content */}
      <OrderList
        emptyStateActionLabel={t('EmptyState.cta')}
        emptyStateTitle={t('EmptyState.title')}
        orderNumberLabel={t('orderNumber')}
        orders={getOrders(after, before)}
        paginationInfo={getPaginationInfo(after, before)}
        title="" // Remove duplicate title since we have panel header
        totalLabel={t('totalPrice')}
        viewDetailsLabel={t('viewDetails')}
      />
    </div>
  );
}
