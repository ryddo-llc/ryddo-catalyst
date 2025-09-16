'use client';

import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';

import { BikeLeftSidebarContent } from './bike-special-offers';

interface BikeLeftSidebarProps {
  brandName?: string;
  description?: Streamable<string | ReactNode | null>;
  fields?: Streamable<Field[]>;
  colors?: ColorOption[];
  productId?: string;
  onVariantChange?: (fieldName: string, value: string) => void;
}

export function BikeLeftSidebar({
  brandName,
  description,
  fields,
  colors,
  productId,
  onVariantChange
}: BikeLeftSidebarProps) {
  return (
    <div className="absolute left-0 top-[-20px] z-10 hidden w-64 rounded-lg bg-white/75 p-4 md:p-5 lg:p-6 md:block xl:left-1 xl:w-72 -ml-4 sm:-ml-6 md:-ml-10 lg:-ml-14 xl:-ml-18">
      <Stream
        fallback={<BikeLeftSidebarContent brandName={brandName} colors={colors} onVariantChange={onVariantChange} productId={productId} />}
        value={Streamable.all([description || Streamable.from(() => Promise.resolve(null)), fields || Streamable.from(() => Promise.resolve([]))])}
      >
        {([descriptionContent, fieldsContent]) => (
          <BikeLeftSidebarContent
            brandName={brandName}
            colors={colors}
            description={descriptionContent}
            fields={fieldsContent}
            onVariantChange={onVariantChange}
            productId={productId}
          />
        )}
      </Stream>
    </div>
  );
}
