'use client';

import { parseAsString, useQueryStates } from 'nuqs';
import { ReactNode, useCallback } from 'react';

import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';

// Helper function to identify variant fields (color/size)
const isVariantField = (field: Field): boolean => {
  const variantTypes = ['swatch-radio-group', 'button-radio-group', 'card-radio-group'];
  // Note: 'colour' is British English spelling, both spellings supported
  const variantNames = ['color', 'colour', 'size', 'variant'];

  return (
    variantTypes.includes(field.type) ||
    variantNames.some((name) => field.name.toLowerCase().includes(name))
  );
};

// Note: Selected value display removed for performance - variants now use pure state coordination

// Unified helper function to render variant fields (size and color)
const RenderVariantField = (field: Field, onPrefetch: () => void, isColorField = false) => {
  // Use URL query states for this field
  const [params, setParams] = useQueryStates({
    [field.name]: parseAsString,
  });

  const handleVariantChange = useCallback(
    (value: string) => {
      void setParams({ [field.name]: value || null });
    },
    [setParams, field.name],
  );
  // Prepare options based on field type
  const getOptions = () => {
    if (!('options' in field)) return [];

    // For size fields, always add text type to show labels
    const isSizeField =
      field.label.toLowerCase().includes('size') || field.name.toLowerCase().includes('size');

    if (isSizeField) {
      return field.options.map((option) => ({
        ...option,
        type: 'text' as const,
        label: option.label,
      }));
    }

    // For color fields, preserve the original type (color/image) or add text as fallback
    if (isColorField && field.type === 'swatch-radio-group' && 'options' in field) {
      return field.options.map((option) => {
        // SwatchRadioFieldOption can only be objects with type 'color' or 'image'
        // If it already has a type and it's color, keep it
        if (option.type === 'color') {
          return option;
        }

        // For image type, convert to text for display
        return {
          value: option.value,
          label: option.label,
          type: 'text' as const,
        };
      });
    }

    return field.options;
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
        <span>{isColorField ? 'Color' : 'Size'}:</span>
      </div>
      <SwatchRadioGroup
        className="justify-start gap-2 [&_.swatch-text-option]:text-sm [&_.swatch-text-option]:font-extrabold [&_button[data-state=checked]]:border-2 [&_button[data-state=checked]]:border-[#F92F7B] [&_button[data-state=checked]]:ring-2 [&_button[data-state=checked]]:ring-[#F92F7B] [&_label]:flex [&_label]:h-10 [&_label]:w-10 [&_label]:items-center [&_label]:justify-center [&_label]:rounded-full [&_label]:border-2 [&_label]:border-gray-300 [&_label]:text-xs [&_label]:font-bold [&_label]:transition-transform [&_label]:hover:scale-105"
        name={field.name}
        onOptionMouseEnter={onPrefetch}
        onValueChange={handleVariantChange}
        options={getOptions()}
        value={params[field.name] || field.defaultValue || ''}
      />
    </div>
  );
};

// Other variant fields removed for performance - now using unified renderVariantField

interface BikeLeftSidebarContentProps {
  brandName?: string;
  description?: ReactNode;
  fields?: Field[];
  colors?: ColorOption[];
  productId?: string;
}

export function BikeLeftSidebarContent({
  brandName,
  description,
  fields = [],
}: BikeLeftSidebarContentProps) {
  // Filter variant fields (color, size, etc.)
  const variantFields = fields.filter(isVariantField);

  const onPrefetch = useCallback(() => {
    // Prefetch can be implemented later if needed
  }, []);

  if (!brandName && !description && fields.length === 0) return null;

  // Find color and size fields specifically
  const colorField = variantFields.find(
    (f) => f.label.toLowerCase().includes('color') || f.name.toLowerCase().includes('color'),
  );
  const sizeField = variantFields.find(
    (f) => f.label.toLowerCase().includes('size') || f.name.toLowerCase().includes('size'),
  );

  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg">
        {brandName ? (
          <h1 className="font-kanit text-5xl font-black leading-normal text-zinc-800">
            {brandName.toUpperCase()}
          </h1>
        ) : null}

        {description ? (
          <div className="text-large font-extrabold text-zinc-600">{description}</div>
        ) : null}

        {/* Size Options - Interactive - Circular swatches with text */}
        {sizeField && 'options' in sizeField && sizeField.options.length
          ? RenderVariantField(sizeField, onPrefetch, false)
          : null}

        {/* Color Options - Interactive - Circular swatches */}
        {colorField && 'options' in colorField && colorField.options.length
          ? RenderVariantField(colorField, onPrefetch, true)
          : null}
      </div>
    </div>
  );
}
