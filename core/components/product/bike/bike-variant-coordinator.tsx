'use client';

import { ReactNode } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/product-transformer';

import { BikeLeftSidebar } from './bike-left-sidebar';
import { BikeRightSidebar } from './bike-right-sidebar';
import { ProductPrice } from './types';

interface BikeVariantCoordinatorProps<F extends Field> {
  product: {
    id: string;
    subtitle?: string;
    description?: Streamable<string | ReactNode | null>;
    images: Streamable<Array<{ src: string; alt: string }>>;
    colors?: ColorOption[];
    title: string;
    href: string;
    price?: ProductPrice;
    warranty?: Streamable<string | null>;
    rating?: number | null;
    reviewCount?: number | null;
  };
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  additionalActions?: ReactNode;
  children?: ReactNode;
}

export function BikeVariantCoordinator<F extends Field>({
  product,
  action,
  fields,
  ctaLabel,
  ctaDisabled,
  additionalActions,
  children,
}: BikeVariantCoordinatorProps<F>) {
  return (
    <div className="relative -mt-1 mb-2 flex min-h-0 items-start justify-center sm:-mt-2 sm:mb-3 md:-mt-3 md:mb-4 lg:-mt-4 lg:mb-4 xl:-mt-6">
      {/* Left Sidebar - Brand Name, Description, and Variants - Absolutely positioned */}
      <BikeLeftSidebar
        brandName={product.subtitle}
        colors={product.colors}
        description={product.description}
        fields={fields}
        productId={product.id}
      />

      {/* Center - Bike Image - Large central image */}
      <div className="flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 -ml-6">
        {children}
      </div>

      {/* Right Sidebar - Price Card - Absolutely positioned */}
      <BikeRightSidebar
        action={action}
        additionalActions={additionalActions}
        ctaDisabled={ctaDisabled}
        ctaLabel={ctaLabel}
        fields={fields}
        product={{
          id: product.id,
          title: product.title,
          href: product.href,
          images: product.images,
          price: product.price,
          colors: product.colors,
          warranty: product.warranty,
          rating: product.rating,
          reviewCount: product.reviewCount,
        }}
      />
    </div>
  );
}