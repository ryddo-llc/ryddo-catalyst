'use client';

import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/product-transformer';

import { ProductPrice } from './product-types';
import { ProductDetailFormSkeleton } from './shared/product-detail-skeletons';
import { AuthorizedDealerCard } from './shared/product-side-cards';

interface ProductRightSidebarProps<F extends Field> {
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

export function ProductRightSidebar<F extends Field>({
  product,
  action,
  fields,
  ctaLabel,
  ctaDisabled,
  additionalActions,
}: ProductRightSidebarProps<F>) {
  return (
    <div className="absolute right-0 top-[-10px] z-10 -mr-5 hidden min-h-[400px] w-60 sm:-mr-6 md:top-[-15px] md:-mr-8 md:block md:w-72 lg:top-[-20px] lg:-mr-11 lg:w-72 xl:right-1 xl:-mr-16 xl:w-80">
      <Stream
        fallback={<ProductDetailFormSkeleton />}
        value={Streamable.all([
          product.images,
          fields,
          ctaLabel || Streamable.from(() => Promise.resolve(null)),
          ctaDisabled || Streamable.from(() => Promise.resolve(null)),
          product.warranty || Streamable.from(() => Promise.resolve(null)),
        ])}
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
