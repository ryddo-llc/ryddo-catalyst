'use client';

import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/product-transformer';

import { ProductLeftSidebarContent } from './product-special-offers';

interface ProductLeftSidebarProps {
  brandName?: string;
  description?: Streamable<string | ReactNode | null>;
  fields?: Streamable<Field[]>;
  colors?: ColorOption[];
  productId?: string;
}

export function ProductLeftSidebar({
  brandName,
  description,
  fields,
  colors,
  productId,
}: ProductLeftSidebarProps) {
  return (
    <div className="absolute left-0 top-[-10px] z-10 hidden w-60 min-h-[400px] rounded-2xl bg-white/75 p-3 md:top-[-15px] md:block md:w-72 md:p-4 lg:top-[-20px] lg:w-72 lg:p-5 xl:left-1 xl:w-80 xl:p-6 -ml-4 sm:-ml-6 md:-ml-8 lg:-ml-12 xl:-ml-16">
      <Stream
        fallback={<ProductLeftSidebarContent brandName={brandName} colors={colors} productId={productId} />}
        value={Streamable.all([description || Streamable.from(() => Promise.resolve(null)), fields || Streamable.from(() => Promise.resolve([]))])}
      >
        {([descriptionContent, fieldsContent]) => (
          <ProductLeftSidebarContent
            brandName={brandName}
            colors={colors}
            description={descriptionContent}
            fields={fieldsContent}
            productId={productId}
          />
        )}
      </Stream>
    </div>
  );
}
