'use client';

import {
  FieldMetadata,
  FormProvider,
  FormStateInput,
  useForm,
  useInputControl,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { createSerializer, parseAsString, useQueryStates } from 'nuqs';
import React, { ReactNode, useCallback } from 'react';
import { z } from 'zod';

import { ButtonRadioGroup } from '@/vibes/soul/form/button-radio-group';
import { CardRadioGroup } from '@/vibes/soul/form/card-radio-group';
import { FormStatus } from '@/vibes/soul/form/form-status';
import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { usePathname, useRouter } from '~/i18n/routing';

import { Field, schema, SchemaRawShape } from './schema';

// Helper function to identify variant fields (color/size)
const isVariantField = (field: Field): boolean => {
  const variantTypes = ['swatch-radio-group', 'button-radio-group', 'card-radio-group'];
  const variantNames = ['color', 'colour', 'size', 'variant'];

  return (
    variantTypes.includes(field.type) ||
    variantNames.some((name) => field.name.toLowerCase().includes(name))
  );
};

export interface VariantSelectorProps {
  fields: Field[];
  productId: string;
  prefetch?: boolean;
  onVariantChange?: (fieldName: string, value: string) => void;
  children?: ReactNode;
}

export function VariantSelector({
  fields,
  productId,
  prefetch = false,
  onVariantChange,
  children,
}: VariantSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Filter to only variant fields
  const variantFields = fields.filter(isVariantField);

  const searchParams = variantFields.reduce<Record<string, typeof parseAsString>>((acc, field) => {
    return field.persist === true ? { ...acc, [field.name]: parseAsString } : acc;
  }, {});

  const [params] = useQueryStates(searchParams, { shallow: true });

  const onPrefetch = (fieldName: string, value: string) => {
    if (prefetch) {
      const serialize = createSerializer(searchParams);
      const newUrl = serialize(pathname, { ...params, [fieldName]: value });
      
      router.prefetch(newUrl);
    }
  };

  const defaultValue = variantFields.reduce<{
    [Key in keyof SchemaRawShape]?: z.infer<SchemaRawShape[Key]>;
  }>(
    (acc, field) => ({
      ...acc,
      [field.name]: params[field.name] ?? field.defaultValue,
    }),
    {},
  );

  const [form, formFields] = useForm({
    lastResult: null,
    constraint: getZodConstraint(schema(variantFields)),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schema(variantFields) });
    },
    // @ts-expect-error: `defaultValue` types are conflicting with `onValidate`.
    defaultValue,
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  if (variantFields.length === 0) {
    return null;
  }

  return (
    <FormProvider context={form.context}>
      <FormStateInput />
      <div className="space-y-6">
        <input name="id" type="hidden" value={productId} />

        {/* Variant fields */}
        {variantFields.map((field) => {
          const formField = formFields[field.name];

          if (!formField) return null;

          return (
            <div
              className="rounded-lg bg-white/90 p-6 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
              key={formField.id}
            >
              <VariantField
                field={field}
                formField={formField}
                onPrefetch={onPrefetch}
                onVariantChange={onVariantChange}
              />
            </div>
          );
        })}

        {/* Form Errors */}
        {form.errors?.map((error, index) => (
          <FormStatus className="rounded-lg bg-red-50 p-4" key={index} type="error">
            {error}
          </FormStatus>
        ))}
        
        {/* Variant Field Errors */}
        {variantFields
          .filter((field) => field.required)
          .map((field) => {
            const formField = formFields[field.name];
            
            if (!formField?.errors?.length) return null;
            
            return (
              <FormStatus className="rounded-lg bg-red-50 p-4" key={field.name} type="error">
                {field.label}: {formField.errors.join(', ')}
              </FormStatus>
            );
          })}

        {children}
      </div>
    </FormProvider>
  );
}

function VariantField({
  field,
  formField,
  onPrefetch,
  onVariantChange,
}: {
  field: Field;
  formField: FieldMetadata<string | number | boolean | Date | undefined>;
  onPrefetch: (fieldName: string, value: string) => void;
  onVariantChange?: (fieldName: string, value: string) => void;
}) {
  const controls = useInputControl(formField);

  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: true }) } : {},
  );

  const handleChange = useCallback(
    (value: string) => {
      const fieldValue = value || params[field.name];

      void setParams({ [field.name]: fieldValue || null });
      controls.change(fieldValue ?? '');

      // Notify parent component of variant change
      if (onVariantChange) {
        onVariantChange(field.name, fieldValue ?? '');
      }
    },
    [setParams, field, controls, params, onVariantChange],
  );

  const handleOnOptionMouseEnter = (value: string) => {
    if (field.persist === true) {
      onPrefetch(field.name, value);
    }
  };

  switch (field.type) {
    case 'swatch-radio-group':
      return (
        <SwatchRadioGroup
          className="variant-swatch-group"
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'card-radio-group':
      return (
        <CardRadioGroup
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'button-radio-group':
      return (
        <ButtonRadioGroup
          className="variant-button-group"
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    default:
      return null;
  }
}

// Export variant field utilities for other components
export { isVariantField };

// Inject styles for modern variant styling
const variantStyles = `
  /* Modern swatch radio group styling for colors and sizes */
  .variant-swatch-group [role="radiogroup"] > [role="radio"] {
    border-radius: 0.5rem !important;
    width: 3.5rem !important;
    height: 3.5rem !important;
    min-width: 3.5rem !important;
    border: 2px solid transparent !important;
    transition: all 0.2s ease-in-out !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  .variant-swatch-group [role="radiogroup"] > [role="radio"]:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  }
  
  .variant-swatch-group [role="radiogroup"] > [role="radio"][data-state="checked"] {
    border-color: #F92F7B !important;
    box-shadow: 0 0 0 3px rgba(249, 47, 123, 0.2) !important;
  }
  
  .variant-swatch-group [role="radiogroup"] > [role="radio"] > span {
    border-radius: 0.375rem !important;
  }
  
  .variant-swatch-group [role="radiogroup"] > [role="radio"] {
    width: auto !important;
    min-width: 3.5rem !important;
    max-width: 6rem !important;
  }
  
  .variant-swatch-group [role="radiogroup"] {
    gap: 0.75rem !important;
  }
  
  /* Modern button radio group styling */
  .variant-button-group [role="radiogroup"] > [role="radio"] {
    border-radius: 0.5rem !important;
    min-width: 3.5rem !important;
    width: auto !important;
    height: 3.5rem !important;
    padding: 0.5rem 1rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 0.875rem !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    white-space: nowrap !important;
    border: 2px solid transparent !important;
    transition: all 0.2s ease-in-out !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  .variant-button-group [role="radiogroup"] > [role="radio"]:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  }
  
  .variant-button-group [role="radiogroup"] > [role="radio"][data-state="checked"] {
    border-color: #F92F7B !important;
    background-color: #F92F7B !important;
    color: white !important;
    box-shadow: 0 0 0 3px rgba(249, 47, 123, 0.2) !important;
  }
  
  .variant-button-group [role="radiogroup"] > [role="radio"]:not([data-state="checked"]) {
    background-color: white !important;
    color: #374151 !important;
    border-color: #D1D5DB !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'variant-selector-styles';

  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');

    styleElement.id = styleId;
    styleElement.textContent = variantStyles;
    document.head.appendChild(styleElement);
  }
}