import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { ResultOf } from 'gql.tada';

import { PricingFragment } from '~/client/fragments/pricing';
import { FeaturedProductsCarouselFragment } from '~/components/featured-products-carousel/fragment';
import { DigitalTagData } from '~/components/product/digital-tag/digital-tag';

interface ProductBase {
  brand?: {
    name: string;
  } | null;
  name: string;
}

interface ProductDetailed {
  weight?: {
    value: number;
    unit: string;
  } | null;
  customFields: {
    edges: Array<{
      node: {
        entityId: number;
        name: string;
        value: string;
      };
    }> | null;
  };
}

type PricingData = ResultOf<typeof PricingFragment> & {
  categories: {
    edges: Array<{
      node: {
        entityId: number;
      };
    }> | null;
  };
  relatedProducts: {
    edges: Array<{
      node: ResultOf<typeof FeaturedProductsCarouselFragment>;
    }> | null;
  };
};

export function transformProductToDigitalTag(
  baseProduct: ProductBase,
  detailedProduct: ProductDetailed,
  pricingData: PricingData | null,
  slug: string,
): DigitalTagData {
  const customFields = removeEdgesAndNodes(detailedProduct.customFields);

  return {
    brand: baseProduct.brand?.name || 'Unknown Brand',
    model: baseProduct.name,
    slug,
    range: customFields.find(
      (f) => f.name === 'performance_range' || f.name.toLowerCase().includes('range'),
    )?.value,
    speed: customFields.find(
      (f) => f.name === 'Speed' || f.name === 'Speed-Tech' || f.name === 'Top Speed',
    )?.value,
    weight: detailedProduct.weight
      ? `${detailedProduct.weight.value} ${detailedProduct.weight.unit === 'Pounds' ? 'lbs' : detailedProduct.weight.unit}`
      : undefined,
    price: pricingData?.prices?.price.value,
    currencyCode: pricingData?.prices?.price.currencyCode || 'USD',
    certClass: customFields.find((f) => f.name === 'Class')?.value,
    battery: customFields.find((f) => f.name === 'Battery')?.value,
    motor: customFields.find((f) => f.name === 'Motor/s' || f.name === 'Motor')?.value,
    chargeTime: customFields.find((f) => f.name === 'Charge Time')?.value,
    maxLoad: customFields.find((f) => f.name === 'Max Load')?.value,
  };
}
