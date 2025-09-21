'use client';

import { parseAsString, useQueryStates } from 'nuqs';
import { ReactNode, startTransition, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { Compare } from '@/vibes/soul/primitives/product-card/compare';
import { toast } from '@/vibes/soul/primitives/toaster';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';

import { revalidateCart } from '../../../vibes/soul/sections/product-detail/actions/revalidate-cart';

interface CompareDrawerItem {
  id: string;
  image?: { src: string; alt: string };
  href: string;
  title: string;
}

interface BikeAddToCartFormProps<F extends Field> {
  productId: string;
  action: ProductDetailFormAction<F>;
  fields: F[];
  compareProduct?: CompareDrawerItem;
  ctaLabel?: string;
  disabled?: boolean;
  additionalActions?: ReactNode;
}

function SubmitButton({ children, disabled }: { children: string; disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-[43px] flex-1 items-center justify-center self-stretch overflow-hidden whitespace-nowrap rounded-[50px] bg-[#F92F7B] px-3 py-2.5 font-kanit text-sm font-bold leading-normal tracking-wide text-white shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.12)] transition-all hover:bg-[#d41f63] hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-base md:px-6"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? 'Adding...' : children}
    </button>
  );
}

export function BikeAddToCartForm<F extends Field>({
  productId,
  action,
  fields,
  compareProduct,
  ctaLabel = 'Add to cart',
  disabled = false,
  additionalActions,
}: BikeAddToCartFormProps<F>) {
  const [state, formAction] = useActionState(action, {
    fields,
    lastResult: null,
  });

  // Read variant selections from URL parameters
  const variantFields = fields.filter(
    (field) =>
      field.type === 'swatch-radio-group' ||
      field.type === 'button-radio-group' ||
      field.type === 'radio-group' ||
      field.type === 'select' ||
      field.type === 'card-radio-group',
  );

  const urlParams = variantFields.reduce<Record<string, typeof parseAsString>>((acc, field) => {
    return { ...acc, [field.name]: parseAsString };
  }, {});

  const [selectedVariants] = useQueryStates(urlParams);

  // Handle success messages and cart revalidation
  useEffect(() => {
    if (state.lastResult?.status === 'success') {
      if (state.successMessage) {
        toast.success(state.successMessage);
      }

      // Revalidate cart after successful addition
      startTransition(() => {
        void revalidateCart();
      });
    }
  }, [state.lastResult, state.successMessage]);

  // Helper function to check if a field is a color field
  const isColorField = (field: F): boolean => {
    return field.name.toLowerCase() === 'color';
  };

  // Helper function to check if field should be rendered as interactive element
  const shouldRenderField = (field: F): boolean => {
    // Skip color field since it's handled by the SwatchRadioGroup
    if (isColorField(field)) {
      return false;
    }

    // Render all interactive field types (including swatch-radio-group)
    if (
      field.type === 'button-radio-group' ||
      field.type === 'radio-group' ||
      field.type === 'select' ||
      field.type === 'card-radio-group' ||
      field.type === 'swatch-radio-group'
    ) {
      return true;
    }

    return false;
  };

  return (
    <form action={formAction}>
      <input name="id" type="hidden" value={productId} />
      <input name="quantity" type="hidden" value="1" />

      {/* Handle non-interactive product option fields as hidden inputs */}
      {fields
        .filter((field) => {
          // Always include variant fields that have selected values
          if (shouldRenderField(field) && selectedVariants[field.name]) {
            return true;
          }
          // Always include color fields that have selected values

          if (isColorField(field) && selectedVariants[field.name]) {
            return true;
          }
          // Exclude interactive field types that don't have selections

          if (shouldRenderField(field)) return false;
          // Exclude color fields without selections
          if (isColorField(field)) return false;

          return true;
        })
        .map((field) => {
          // Get field value - prioritize external selections
          let value = '';

          // First check if there's a selected variant from left sidebar
          if (selectedVariants[field.name]) {
            value = String(selectedVariants[field.name]);
          } else if ('defaultValue' in field && field.defaultValue) {
            value = String(field.defaultValue);
          } else if ('options' in field && field.options.length > 0) {
            value = String(field.options[0]?.value ?? '');
          }

          // Only render if we have a value
          return value ? (
            <input key={field.name} name={field.name} type="hidden" value={value} />
          ) : null;
        })}

      {/* Show any form errors */}

      {state.lastResult?.status === 'error' && state.lastResult.error && (
        <div className="mb-2 text-xs text-red-600">
          {typeof state.lastResult.error === 'string'
            ? state.lastResult.error
            : 'An error occurred'}
        </div>
      )}

      <div className="mb-6 flex flex-col items-stretch gap-3">
        <SubmitButton disabled={disabled}>{ctaLabel}</SubmitButton>
        {compareProduct && (
          <Compare
            className="flex min-h-[43px] items-center justify-center whitespace-nowrap rounded-[50px] border-2 border-solid border-[#757575] bg-[#757575] px-3 py-2.5 text-sm font-kanit font-semibold text-white transition-colors hover:bg-[#606060] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-base md:px-6"
            label="Compare"
            product={compareProduct}
          />
        )}
      </div>

      {/* Compact Variant Selection - Mobile Only for e-commerce conversion - DISPLAY ONLY */}
      <div className="mb-4 space-y-3 md:hidden">
        {fields
          .filter(
            (field) =>
              field.type === 'swatch-radio-group' ||
              field.type === 'button-radio-group' ||
              field.type === 'radio-group' ||
              field.type === 'select',
          )
          .slice(0, 2) // Show max 2 most important variants (color + size)
          .map((field) => (
            <div className="space-y-2" key={field.name}>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                {field.label}: {(() => {
                  if (!selectedVariants[field.name]) return 'None selected';
                  if ('options' in field) {
                    return field.options.find(opt => opt.value === selectedVariants[field.name])?.label;
                  }
                  return selectedVariants[field.name];
                })()}
              </label>
              {field.type === 'swatch-radio-group' && 'options' in field && (
                <div className="flex flex-wrap gap-1">
                  {field.options.slice(0, 4).map((option) => (
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                        selectedVariants[field.name] === option.value
                          ? 'border-[#F92F7B] bg-[#F92F7B] text-white'
                          : 'border-gray-300'
                      }`}
                      key={option.value}
                    >
                      <span className="truncate">
                        {option.type === 'color' ? '' : option.label.slice(0, 2)}
                      </span>
                      {option.type === 'color' && (
                        <span
                          className="h-6 w-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Wishlist Button */}

      {additionalActions ? (
        <div className="flex justify-center sm:justify-end">{additionalActions}</div>
      ) : null}
    </form>
  );
}
