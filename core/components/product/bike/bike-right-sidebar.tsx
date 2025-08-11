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
    <div className="hidden md:flex md:justify-end">
      <div className="sticky top-4">
        <Stream
          fallback={<ProductDetailFormSkeleton />}
          value={Streamable.all([
            product.images,
            fields,
            ctaLabel,
            ctaDisabled,
          ])}
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
    </div>
  );
}