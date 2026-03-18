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

  // Derive the selected option's label for inline display
  const selectedLabel = useMemo(() => {
    const selectedValue = params[field.name] || field.defaultValue || '';

    if ('options' in field) {
      const label = field.options.find((opt) => opt.value === selectedValue)?.label ?? '';

      // Expand common size abbreviations to full names
      const sizeMap: Record<string, string> = {
        XS: 'X-Small',
        S: 'Small',
        M: 'Medium',
        L: 'Large',
        XL: 'X-Large',
        XXL: 'XX-Large',
      };

      return sizeMap[label.toUpperCase()] || label;
    }

    return '';
  }, [params, field]);

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
      <div className="mb-3 flex items-center gap-2 font-['Inter'] text-xs uppercase tracking-wider text-black">
        <span className="font-black">{isColorField ? 'Color' : 'Size'}:</span>
        {selectedLabel ? <span className="font-medium">{selectedLabel}</span> : null}
      </div>
      <SwatchRadioGroup
        className="justify-start gap-2 [&_.swatch-text-option]:font-kanit [&_.swatch-text-option]:text-xl [&_.swatch-text-option]:font-bold [&_button>span]:border [&_button>span]:border-black [&_button[data-state=checked]>span]:border-0 [&_button[data-state=checked]]:border-4 [&_button[data-state=checked]]:border-[#F92F7B] [&_button[data-state=checked]]:p-0 [&_button]:h-8 [&_button]:w-8"
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
    if (
      sizeField &&
      !params[sizeField.name] &&
      'options' in sizeField &&
      sizeField.options.length > 0
    ) {
      const defaultValue = sizeField.defaultValue || sizeField.options[0]?.value;

      if (defaultValue) {
        updates[sizeField.name] = defaultValue;
        hasUpdates = true;
      }
    }

    // Auto-select color if not already selected
    if (
      colorField &&
      !params[colorField.name] &&
      'options' in colorField &&
      colorField.options.length > 0
    ) {
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
          <div className="-mt-10 max-w-[14rem] pl-3 font-['Inter'] text-base font-normal uppercase leading-tight text-black [&>div>*:first-child]:mb-0 [&>div>*:first-child]:font-kanit [&>div>*:first-child]:text-xl [&>div>*:first-child]:font-medium [&>div>*:first-child]:leading-none">
            {description}
          </div>
        ) : null}

        {/* Size Options - Interactive - Circular swatches with text */}
        {sizeField && 'options' in sizeField && sizeField.options.length ? (
          <div className="mt-6 pl-3">{RenderVariantField(sizeField, false)}</div>
        ) : null}

        {/* Color Options - Interactive - Circular swatches */}
        {colorField && 'options' in colorField && colorField.options.length ? (
          <div className="pl-3">{RenderVariantField(colorField, true)}</div>
        ) : null}
      </div>
    </div>
  );
}
