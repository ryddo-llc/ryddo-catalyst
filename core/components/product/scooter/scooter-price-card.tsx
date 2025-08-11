import { ReactNode } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';

import { AuthorizedDealerCard } from '../shared/product-side-cards';

interface ScooterPriceCardProps<F extends Field> {
  product: {
    id: string;
    title: string;
    href: string;
    images: Array<{ src: string; alt: string }>;
    price?: Streamable<
      | {
          type?: 'sale' | 'range';
          currentValue?: string;
          previousValue?: string;
          minValue?: string;
          maxValue?: string;
        }
      | string
      | null
    >;
    colors?: ColorOption[];
  };
  action: ProductDetailFormAction<F>;
  fields: F[];
  ctaLabel?: string;
  ctaDisabled?: boolean;
  additionalActions?: ReactNode;
}

export function ScooterPriceCard<F extends Field>({
  product,
  action,
  fields,
  ctaLabel,
  ctaDisabled,
  additionalActions,
}: ScooterPriceCardProps<F>) {
  return (
    <div className="absolute right-0 top-[-100px] z-10 hidden md:block">
      <AuthorizedDealerCard
        product={{
          id: product.id,
          title: product.title,
          href: product.href,
          images: product.images,
          price: product.price,
          colors: product.colors,
          action,
          fields,
          ctaLabel: ctaLabel || undefined,
          ctaDisabled: ctaDisabled || undefined,
          additionalActions,
          productType: 'scooter',
        }}
      />
    </div>
  );
}