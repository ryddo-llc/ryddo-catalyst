'use client';

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
    warranty?: Streamable<string | null>;
  };
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  additionalActions?: ReactNode;
  selectedVariants?: Record<string, string>;
}

export function BikeRightSidebar<F extends Field>({
  product,
  action,
  fields,
  ctaLabel,
  ctaDisabled,
  additionalActions,
  selectedVariants,
}: BikeRightSidebarProps<F>) {
  return (
    <div className="absolute right-0 top-[-10px] z-10 hidden w-56 md:top-[-15px] md:block md:w-64 lg:top-[-20px] lg:w-64 xl:right-1 xl:w-72 -mr-2 sm:-mr-3 md:-mr-8 lg:-mr-12 xl:-mr-16">
      <Stream
        fallback={<ProductDetailFormSkeleton />}
        value={Streamable.all([product.images, fields, ctaLabel, ctaDisabled, product.warranty || Streamable.from(() => Promise.resolve(null))])}
      >
        {([images, streamedFields, streamedCtaLabel, streamedCtaDisabled, streamedWarranty]) => (
          <AuthorizedDealerCard
            product={{
              id: product.id,
              title: product.title,
              href: product.href,
              images,
              price: product.price,
              colors: product.colors,
              warranty: streamedWarranty,
              action,
              fields: streamedFields,
              ctaLabel: streamedCtaLabel || undefined,
              ctaDisabled: streamedCtaDisabled || undefined,
              additionalActions,
              productType: 'bike',
              selectedVariants,
            }}
          />
        )}
      </Stream>
    </div>
  );
}
