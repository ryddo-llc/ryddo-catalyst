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
    <div className="absolute left-0 top-[-10px] z-10 hidden w-56 rounded-lg bg-white/75 p-3 md:top-[-15px] md:block md:w-64 md:p-4 lg:top-[-20px] lg:w-64 lg:p-5 xl:left-1 xl:w-72 xl:p-6 -ml-2 sm:-ml-3 md:-ml-6 lg:-ml-10 xl:-ml-14">
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
