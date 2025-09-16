'use client';

import { ReactNode, useCallback, useState } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';

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
  // State to coordinate variant selections between left and right sidebars
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleVariantChange = useCallback((fieldName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  return (
    <div className="relative -mt-2 mb-4 flex min-h-0 flex-1 items-start justify-center md:-mt-4 lg:-mt-6">
      {/* Left Sidebar - Brand Name, Description, and Variants - Absolutely positioned */}
      <BikeLeftSidebar
        brandName={product.subtitle}
        colors={product.colors}
        description={product.description}
        fields={fields}
        onVariantChange={handleVariantChange}
        productId={product.id}
      />

      {/* Center - Bike Image - Large central image */}
      <div className="flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8">
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
        }}
        selectedVariants={selectedVariants}
      />
    </div>
  );
}