import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getSessionCustomerAccessToken } from '~/auth';
import { DigitalTag } from '~/components/product/digital-tag/digital-tag';
import { getPreferredCurrencyCode } from '~/lib/currency';

import {
  getProduct,
  getProductPricingAndRelatedProducts,
  getStreamableProduct,
} from '../page-data';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const customerAccessToken = await getSessionCustomerAccessToken();
  const productId = Number(slug);

  const product = await getProduct(productId, customerAccessToken);

  if (!product) {
    return notFound();
  }

  return {
    title: `${product.name} - Digital Tag`,
    description: `View the digital product tag for ${product.name}`,
  };
}

export default async function ProductTagPage({ params }: Props) {
  const { locale, slug } = await params;
  const customerAccessToken = await getSessionCustomerAccessToken();

  setRequestLocale(locale);

  const productId = Number(slug);

  // Get base product data
  const baseProduct = await getProduct(productId, customerAccessToken);

  if (!baseProduct) {
    return notFound();
  }

  // Get detailed product data
  const currencyCode = await getPreferredCurrencyCode();
  const variables = {
    entityId: productId,
    optionValueIds: [],
    useDefaultOptionSelections: true,
    currencyCode,
  };

  // Fetch detailed product and pricing data
  const [detailedProduct, pricingData] = await Promise.all([
    getStreamableProduct(variables, customerAccessToken),
    getProductPricingAndRelatedProducts(variables, customerAccessToken),
  ]);

  if (!detailedProduct) {
    return notFound();
  }

  // Extract custom fields
  const customFields = removeEdgesAndNodes(detailedProduct.customFields);

  // Transform data for the tag
  const tagData = {
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

  return <DigitalTag data={tagData} />;
}
