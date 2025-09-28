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
    rating?: number | null;
    reviewCount?: number | null;
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
    <div className="absolute right-0 top-[-10px] z-10 hidden w-60 min-h-[400px] md:top-[-15px] md:block md:w-72 lg:top-[-20px] lg:w-72 xl:right-1 xl:w-80 -mr-6 sm:-mr-8 md:-mr-12 lg:-mr-16 xl:-mr-20">
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
              rating: product.rating,
              reviewCount: product.reviewCount,
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
