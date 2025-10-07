'use client';

import { parseAsString, useQueryStates } from 'nuqs';
import { ReactNode, useCallback, useEffect, useMemo } from 'react';

import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/product-transformer';

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
const RenderVariantField = (field: Field, isColorField = false) => {
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

  // Memoize options calculation to avoid recreation on every render
  const options = useMemo(() => {
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
  }, [field, isColorField]);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2 font-['Inter'] text-xs font-black uppercase tracking-wider text-black">
        <span>{isColorField ? 'Color' : 'Size'}:</span>
      </div>
      <SwatchRadioGroup
        className="justify-start gap-2 [&_.swatch-text-option]:text-lg [&_.swatch-text-option]:font-extrabold [&_button[data-state=checked]]:border-4 [&_button[data-state=checked]]:border-[#F92F7B] [&_button[data-state=checked]]:p-0 [&_button[data-state=checked]>span]:border-0 [&_button>span]:border-black [&_button>span]:border [&_button]:h-10 [&_button]:w-10"
        name={field.name}
        onValueChange={handleVariantChange}
        options={options}
        value={params[field.name] || field.defaultValue || ''}
      />
    </div>
  );
};

// Other variant fields removed for performance - now using unified renderVariantField

interface ProductLeftSidebarContentProps {
  brandName?: string;
  description?: ReactNode;
  fields?: Field[];
  colors?: ColorOption[];
  productId?: string;
}

export function ProductLeftSidebarContent({
  brandName,
  description,
  fields = [],
}: ProductLeftSidebarContentProps) {
  // Filter variant fields (color, size, etc.)
  const variantFields = fields.filter(isVariantField);

  // Find color and size fields specifically
  const colorField = variantFields.find(
    (f) => f.label.toLowerCase().includes('color') || f.name.toLowerCase().includes('color'),
  );
  const sizeField = variantFields.find(
    (f) => f.label.toLowerCase().includes('size') || f.name.toLowerCase().includes('size'),
  );

  // Auto-select default values for size and color on mount
  const [params, setParams] = useQueryStates({
    ...(sizeField && { [sizeField.name]: parseAsString }),
    ...(colorField && { [colorField.name]: parseAsString }),
  });

  useEffect(() => {
    const updates: Record<string, string | null> = {};
    let hasUpdates = false;

    // Auto-select size if not already selected
    if (sizeField && !params[sizeField.name] && 'options' in sizeField && sizeField.options.length > 0) {
      const defaultValue = sizeField.defaultValue || sizeField.options[0]?.value;

      if (defaultValue) {
        updates[sizeField.name] = defaultValue;
        hasUpdates = true;
      }
    }

    // Auto-select color if not already selected
    if (colorField && !params[colorField.name] && 'options' in colorField && colorField.options.length > 0) {
      const defaultValue = colorField.defaultValue || colorField.options[0]?.value;

      if (defaultValue) {
        updates[colorField.name] = defaultValue;
        hasUpdates = true;
      }
    }

    // Only update if we have changes
    if (hasUpdates) {
      void setParams(updates);
    }
  }, [sizeField, colorField, params, setParams]);

  if (!brandName && !description && fields.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-2xl pb-4">
        {brandName ? (
          <h1 className="w-full pt-4 text-center font-kanit text-6xl font-black leading-normal text-black">
            {brandName.toUpperCase()}
          </h1>
        ) : null}

        {description ? (
          <div className="text-large -mt-10 font-extrabold text-black pl-3">{description}</div>
        ) : null}

        {/* Size Options - Interactive - Circular swatches with text */}
        {sizeField && 'options' in sizeField && sizeField.options.length
          ? <div className="pl-3">{RenderVariantField(sizeField, false)}</div>
          : null}

        {/* Color Options - Interactive - Circular swatches */}
        {colorField && 'options' in colorField && colorField.options.length
          ? <div className="pl-3">{RenderVariantField(colorField, true)}</div>
          : null}
      </div>
    </div>
  );
}
