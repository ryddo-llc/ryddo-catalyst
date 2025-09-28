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
}

export function BikeLeftSidebar({
  brandName,
  description,
  fields,
  colors,
  productId,
}: BikeLeftSidebarProps) {
  return (
    <div className="absolute left-0 top-[-10px] z-10 hidden w-60 min-h-[400px] rounded-2xl bg-white/75 p-3 md:top-[-15px] md:block md:w-72 md:p-4 lg:top-[-20px] lg:w-72 lg:p-5 xl:left-1 xl:w-80 xl:p-6 -ml-6 sm:-ml-8 md:-ml-12 lg:-ml-16 xl:-ml-20">
      <Stream
        fallback={<BikeLeftSidebarContent brandName={brandName} colors={colors} productId={productId} />}
        value={Streamable.all([description || Streamable.from(() => Promise.resolve(null)), fields || Streamable.from(() => Promise.resolve([]))])}
      >
        {([descriptionContent, fieldsContent]) => (
          <BikeLeftSidebarContent
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
