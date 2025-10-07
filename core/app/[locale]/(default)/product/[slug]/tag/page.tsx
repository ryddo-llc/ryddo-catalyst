import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getSessionCustomerAccessToken } from '~/auth';
import { DigitalTag } from '~/components/product/digital-tag/digital-tag';
import { transformProductToDigitalTag } from '~/data-transformers/digital-tag-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { getProduct, getProductPricingAndRelatedProducts } from '../page-data';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const customerAccessToken = await getSessionCustomerAccessToken();
  const productId = Number(slug);
  const currencyCode = await getPreferredCurrencyCode();

  const variables = {
    entityId: productId,
    optionValueIds: [],
    useDefaultOptionSelections: true,
    currencyCode,
  };

  const product = await getProduct(variables, customerAccessToken);

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
  const currencyCode = await getPreferredCurrencyCode();

  const variables = {
    entityId: productId,
    optionValueIds: [],
    useDefaultOptionSelections: true,
    currencyCode,
  };

  // Fetch product and pricing data in parallel
  const [product, pricingData] = await Promise.all([
    getProduct(variables, customerAccessToken),
    getProductPricingAndRelatedProducts(variables, customerAccessToken),
  ]);

  if (!product) {
    return notFound();
  }

  // Transform data for the tag
  const tagData = transformProductToDigitalTag(product, product, pricingData, slug);

  return <DigitalTag data={tagData} />;
}
