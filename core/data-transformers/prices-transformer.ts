import { ResultOf } from 'gql.tada';
import { getFormatter } from 'next-intl/server';

import { Price } from '@/vibes/soul/primitives/price-label';
import { PricingFragment } from '~/client/fragments/pricing';
import { ExistingResultType } from '~/client/util';

export const pricesTransformer = (
  prices: ResultOf<typeof PricingFragment>['prices'],
  format: ExistingResultType<typeof getFormatter>,
): Price | undefined => {
  if (!prices) {
    return undefined;
  }

  const isPriceRange = prices.priceRange.min.value !== prices.priceRange.max.value;
  const isSalePrice = prices.salePrice?.value !== prices.basePrice?.value;

  // Helper function to format price without .00 for whole numbers
  const formatPrice = (value: number, currencyCode: string) => {
    return format.number(value, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
  };

  if (isPriceRange) {
    return {
      type: 'range',
      minValue: formatPrice(prices.priceRange.min.value, prices.price.currencyCode),
      maxValue: formatPrice(prices.priceRange.max.value, prices.price.currencyCode),
    };
  }

  if (isSalePrice && prices.salePrice && prices.basePrice) {
    return {
      type: 'sale',
      previousValue: formatPrice(prices.basePrice.value, prices.price.currencyCode),
      currentValue: formatPrice(prices.price.value, prices.price.currencyCode),
    };
  }

  return formatPrice(prices.price.value, prices.price.currencyCode);
};
