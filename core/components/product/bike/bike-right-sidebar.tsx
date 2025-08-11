import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';

import { ProductDetailFormSkeleton } from '../shared/product-detail-skeletons';
import { AuthorizedDealerCard } from '../shared/product-side-cards';

import { ProductPrice } from './types';

interface BikeRightSidebarProps<F extends Field> {
  product: {
    id: string;
    title: string;
    href: string;
    images: Streamable<Array<{ src: string; alt: string }>>;
    price?: ProductPrice;
    colors?: ColorOption[];
  };
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  additionalActions?: ReactNode;
}

export function BikeRightSidebar<F extends Field>({
  product,
  action,
  fields,
  ctaLabel,
  ctaDisabled,
  additionalActions,
}: BikeRightSidebarProps<F>) {
  return (
    <div className="absolute right-2 top-[-20px] z-10 hidden w-64 md:block lg:right-4 lg:w-72 xl:right-6 xl:w-80 2xl:right-8 2xl:w-84">
      <Stream
        fallback={<ProductDetailFormSkeleton />}
        value={Streamable.all([product.images, fields, ctaLabel, ctaDisabled])}
      >
        {([images, streamedFields, streamedCtaLabel, streamedCtaDisabled]) => (
          <AuthorizedDealerCard
            product={{
              id: product.id,
              title: product.title,
              href: product.href,
              images,
              price: product.price,
              colors: product.colors,
              action,
              fields: streamedFields,
              ctaLabel: streamedCtaLabel || undefined,
              ctaDisabled: streamedCtaDisabled || undefined,
              additionalActions,
              productType: 'bike',
            }}
          />
        )}
      </Stream>
    </div>
  );
}
