import { getProduct } from '../page-data';

// Type for the translation function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationFunction = (key: any) => string;

interface CtaState {
  label: string;
  disabled: boolean;
}

/**
 * Calculate the CTA (Call-to-Action) button state based on product availability
 * @param product - The product data from BigCommerce
 * @param t - Translation function from next-intl
 * @returns CTA state with label and disabled status
 */
export function calculateCtaState(
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>,
  t: TranslationFunction,
): CtaState {
  if (product.availabilityV2.status === 'Unavailable') {
    return { label: t('ProductDetails.Submit.unavailable'), disabled: true };
  }

  if (product.availabilityV2.status === 'Preorder') {
    return { label: t('ProductDetails.Submit.preorder'), disabled: false };
  }

  if (!product.inventory.isInStock) {
    return { label: t('ProductDetails.Submit.outOfStock'), disabled: true };
  }

  return { label: t('ProductDetails.Submit.addToCart'), disabled: false };
}
