'use client';

import { createSerializer, parseAsString, useQueryStates } from 'nuqs';
import { ReactNode, useCallback } from 'react';

import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import type { ColorOption } from '~/data-transformers/bike-product-transformer';
import { usePathname, useRouter } from '~/i18n/routing';

// Helper function to identify variant fields (color/size)
const isVariantField = (field: Field): boolean => {
  const variantTypes = ['swatch-radio-group', 'button-radio-group', 'card-radio-group'];
  const variantNames = ['color', 'colour', 'size', 'variant'];

  return (
    variantTypes.includes(field.type) ||
    variantNames.some((name) => field.name.toLowerCase().includes(name))
  );
};

interface BikeLeftSidebarContentProps {
  brandName?: string;
  description?: ReactNode;
  fields?: Field[];
  colors?: ColorOption[];
  productId?: string;
  onVariantChange?: (fieldName: string, value: string) => void;
}

export function BikeLeftSidebarContent({
  brandName,
  description,
  fields = [],
  onVariantChange,
}: BikeLeftSidebarContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Filter variant fields (color, size, etc.)
  const variantFields = fields.filter(isVariantField);

  const searchParams = variantFields.reduce<Record<string, typeof parseAsString>>((acc, field) => {
    return field.persist === true ? { ...acc, [field.name]: parseAsString } : acc;
  }, {});

  const [params, setParams] = useQueryStates(searchParams, { shallow: false });

  const onPrefetch = useCallback((fieldName: string, value: string) => {
    if (Object.keys(searchParams).length === 0) return;

    const serialize = createSerializer(searchParams);
    const newUrl = serialize(pathname, { ...params, [fieldName]: value });
    router.prefetch(newUrl);
  }, [router, pathname, params, searchParams]);

  const handleVariantChange = useCallback((fieldName: string, value: string) => {
    // Update URL params if field persists
    if (variantFields.find(f => f.name === fieldName)?.persist === true) {
      void setParams({ [fieldName]: value || null });
    }

    // Notify parent component
    if (onVariantChange) {
      onVariantChange(fieldName, value);
    }
  }, [variantFields, setParams, onVariantChange]);

  if (!brandName && !description && fields.length === 0) return null;

  // Find color and size fields specifically
  const colorField = variantFields.find(f =>
    f.label.toLowerCase().includes('color') ||
    f.name.toLowerCase().includes('color')
  );
  const sizeField = variantFields.find(f =>
    f.label.toLowerCase().includes('size') ||
    f.name.toLowerCase().includes('size')
  );

  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg">
        {brandName ? (
          <div className="font-kanit text-2xl font-black leading-normal text-zinc-800">
            {brandName}
          </div>
        ) : null}

        {description ? (
          <div className="text-sm leading-relaxed text-zinc-600">
            {description}
          </div>
        ) : null}

        {/* Size Options - Interactive - Circular swatches with text */}
        {sizeField && 'options' in sizeField && sizeField.options.length > 0 && (
          <div className="w-full">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
              <span>{sizeField.label}</span>
              {params[sizeField.name] && 'options' in sizeField && (
                <span className="text-[#F92F7B] font-bold">
                  {sizeField.options.find((opt: any) => opt.value === params[sizeField.name])?.label}
                </span>
              )}
            </div>
            <SwatchRadioGroup
              className="justify-start gap-2 [&_input:checked+label]:border-2 [&_input:checked+label]:border-[#F92F7B] [&_input:checked+label]:ring-4 [&_input:checked+label]:ring-[#F92F7B] [&_input:checked+label]:ring-offset-1 [&_label]:h-10 [&_label]:w-10 [&_label]:border-2 [&_label]:border-gray-300 [&_label]:rounded-full [&_label]:flex [&_label]:items-center [&_label]:justify-center [&_label]:text-xs [&_label]:font-bold [&_label]:bg-white"
              defaultValue={params[sizeField.name] ?? sizeField.defaultValue}
              name={sizeField.name}
              options={sizeField.options.map((option: any) => ({
                ...option,
                type: 'text' as const,
                label: option.label
              }))}
              onValueChange={(value) => handleVariantChange(sizeField.name, value)}
              onOptionMouseEnter={(value) => onPrefetch(sizeField.name, value)}
            />
          </div>
        )}

        {/* Color Options - Interactive */}
        {colorField && colorField.type === 'swatch-radio-group' && 'options' in colorField && colorField.options.length > 0 && (
          <div className="w-full">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
              <span>{colorField.label}</span>
              {params[colorField.name] && 'options' in colorField && (
                <span className="text-[#F92F7B] font-bold">
                  {colorField.options.find((opt: any) => opt.value === params[colorField.name])?.label}
                </span>
              )}
            </div>
            <SwatchRadioGroup
              className="justify-start gap-2 [&_input:checked+label]:border-2 [&_input:checked+label]:border-[#F92F7B] [&_input:checked+label]:ring-1 [&_input:checked+label]:ring-pink-200 [&_label]:h-8 [&_label]:min-h-[32px] [&_label]:w-8 [&_label]:min-w-[32px] [&_label]:border-2 [&_label]:border-gray-300"
              defaultValue={params[colorField.name] ?? colorField.defaultValue}
              name={colorField.name}
              options={colorField.options}
              onValueChange={(value) => handleVariantChange(colorField.name, value)}
              onOptionMouseEnter={(value) => onPrefetch(colorField.name, value)}
            />
          </div>
        )}

        {/* Other variant fields */}
        {variantFields.filter(field => field !== colorField && field !== sizeField).map((field) => {
          // Check if this field is likely a size/text variant (not color)
          const isTextVariant = field.name.toLowerCase().includes('size') ||
                               field.label.toLowerCase().includes('size') ||
                               field.name.toLowerCase().includes('variant');

          return (
            <div className="w-full" key={field.name}>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                <span>{field.label}</span>
                {params[field.name] && 'options' in field && (
                  <span className="text-[#F92F7B] font-bold">
                    {field.options.find((opt: any) => opt.value === params[field.name])?.label}
                  </span>
                )}
              </div>
              {/* Use circular SwatchRadioGroup for size-like fields, regular SwatchRadioGroup for color-like fields */}
              {field.type === 'swatch-radio-group' && 'options' in field && !isTextVariant && (
                <SwatchRadioGroup
                  className="justify-start gap-2 [&_input:checked+label]:border-2 [&_input:checked+label]:border-[#F92F7B] [&_input:checked+label]:ring-1 [&_input:checked+label]:ring-pink-200 [&_label]:h-8 [&_label]:min-h-[32px] [&_label]:w-8 [&_label]:min-w-[32px] [&_label]:border-2 [&_label]:border-gray-300"
                  defaultValue={params[field.name] ?? field.defaultValue}
                  name={field.name}
                  options={field.options}
                  onValueChange={(value) => handleVariantChange(field.name, value)}
                  onOptionMouseEnter={(value) => onPrefetch(field.name, value)}
                />
              )}
              {(field.type === 'button-radio-group' || (field.type === 'swatch-radio-group' && isTextVariant)) && 'options' in field && (
                <SwatchRadioGroup
                  className="justify-start gap-2 [&_input:checked+label]:border-2 [&_input:checked+label]:border-[#F92F7B] [&_input:checked+label]:ring-4 [&_input:checked+label]:ring-[#F92F7B] [&_input:checked+label]:ring-offset-1 [&_label]:h-10 [&_label]:w-10 [&_label]:border-2 [&_label]:border-gray-300 [&_label]:rounded-full [&_label]:flex [&_label]:items-center [&_label]:justify-center [&_label]:text-xs [&_label]:font-bold [&_label]:bg-white"
                  defaultValue={params[field.name] ?? field.defaultValue}
                  name={field.name}
                  options={field.options.map((option: any) => ({
                    ...option,
                    type: 'text' as const,
                    label: option.label
                  }))}
                  onValueChange={(value) => handleVariantChange(field.name, value)}
                  onOptionMouseEnter={(value) => onPrefetch(field.name, value)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}