import { ResultOf } from 'gql.tada';
import { getFormatter } from 'next-intl/server';

import { Product } from '@/vibes/soul/primitives/product-card';
import { ExistingResultType } from '~/client/util';
import { ProductCardFragment } from '~/components/product-card/fragment';

import { pricesTransformer } from './prices-transformer';

export const singleProductCardTransformer = (
  product: ResultOf<typeof ProductCardFragment>,
  format: ExistingResultType<typeof getFormatter>,
): Product => {
  const priceData = pricesTransformer(product.prices, format);
  
  return {
    id: product.entityId.toString(),
    title: product.name,
    name: product.name,
    href: product.path,
    type: 'product',
    image: product.defaultImage
      ? {
          src: product.defaultImage.url.includes('{:size}')
            ? product.defaultImage.url
            : product.defaultImage.url.replace(/\/(\d+w|original)\//, '/{:size}/'),
          alt: product.defaultImage.altText
        }
      : undefined,
    price: priceData,
    subtitle: product.brand?.name ?? undefined,
    rating: product.reviewSummary.averageRating,
    onSale: typeof priceData === 'object' && priceData.type === 'sale',
    outOfStock: !product.inventory.isInStock,
  };
};

export const productCardTransformer = (
  products: Array<ResultOf<typeof ProductCardFragment>>,
  format: ExistingResultType<typeof getFormatter>,
): Product[] => {
  return products.map((product) => singleProductCardTransformer(product, format));
};
