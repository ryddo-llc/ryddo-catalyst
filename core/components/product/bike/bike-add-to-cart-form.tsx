'use client';

import { ReactNode, startTransition, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Compare } from '@/vibes/soul/primitives/product-card/compare';
import { toast } from '@/vibes/soul/primitives/toaster';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';

import { ColorOption } from '../../../data-transformers/bike-product-transformer';
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
  colors?: ColorOption[];
  compareProduct?: CompareDrawerItem;
  ctaLabel?: string;
  disabled?: boolean;
  additionalActions?: ReactNode;
}

function SubmitButton({ children, disabled }: { children: string; disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-[43px] flex-1 items-center justify-center self-stretch whitespace-nowrap overflow-hidden rounded-[50px] bg-[#F92F7B] px-3 sm:px-4 md:px-6 py-2.5 font-['Inter'] text-sm sm:text-base font-bold leading-normal tracking-wide text-white shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.12)] transition-all hover:bg-[#d41f63] hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
  colors,
  compareProduct,
  ctaLabel = 'Add to cart',
  disabled = false,
  additionalActions,
}: BikeAddToCartFormProps<F>) {
  const [state, formAction] = useActionState(action, {
    fields,
    lastResult: null,
  });

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
          // Exclude interactive field types
          if (shouldRenderField(field)) return false;
          // Exclude color fields
          if (isColorField(field)) return false;

          return true;
        })
        .map((field) => {
          // Get field value
          let value = '';

          if ('defaultValue' in field && field.defaultValue) {
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

      <div className="mb-6 flex flex-col gap-3 items-stretch">
        <SubmitButton disabled={disabled}>{ctaLabel}</SubmitButton>
        {compareProduct && (
          <Compare
            className="flex min-h-[43px] items-center justify-center whitespace-nowrap rounded-[50px] border-2 border-solid border-[#757575] px-3 sm:px-4 md:px-6 py-2.5 text-sm sm:text-base font-semibold text-[#757575] transition-colors hover:bg-[#757575] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            label="Compare"
            product={compareProduct}
          />
        )}
      </div>

      {/* Render interactive fields */}
      {fields.filter(shouldRenderField).map((field) => {
        if (field.type === 'swatch-radio-group') {
          return (
            <div className="mb-6 flex flex-col items-center sm:items-end" key={field.name}>
              <p className="mb-4 text-center text-base font-bold tracking-wide text-gray-900 sm:text-right">
                {field.label || 'COLOR'}
              </p>
              <SwatchRadioGroup
                className="justify-center gap-4 sm:justify-end [&_input:checked+label]:border-4 [&_input:checked+label]:border-[#F92F7B] [&_input:checked+label]:ring-2 [&_input:checked+label]:ring-pink-200 [&_label]:h-12 [&_label]:min-h-[44px] [&_label]:w-12 [&_label]:min-w-[44px] [&_label]:border-2 [&_label]:border-gray-300"
                defaultValue={field.defaultValue}
                name={field.name}
                options={field.options}
              />
            </div>
          );
        }

        // Handle other interactive field types here if needed
        return null;
      })}

      {/* Fallback color selection if no swatch field */}
      {!fields.find((f) => f.type === 'swatch-radio-group') && colors && colors.length > 0 && (
        <div className="mb-6 flex flex-col items-center sm:items-end">
          <p className="mb-4 text-center text-base font-bold tracking-wide text-gray-900 sm:text-right">
            COLOR
          </p>
          <SwatchRadioGroup
            className="justify-center gap-4 sm:justify-end [&_input:checked+label]:border-4 [&_input:checked+label]:border-[#F92F7B] [&_input:checked+label]:ring-2 [&_input:checked+label]:ring-pink-200 [&_label]:h-12 [&_label]:min-h-[44px] [&_label]:w-12 [&_label]:min-w-[44px] [&_label]:border-2 [&_label]:border-gray-300"
            defaultValue={colors.find((c) => c.isSelected || c.isDefault)?.entityId.toString()}
            name="color"
            options={colors.slice(0, 4).map((color) =>
              color.imageUrl
                ? {
                    image: { alt: color.label, src: color.imageUrl },
                    label: color.label,
                    type: 'image' as const,
                    value: color.entityId.toString(),
                  }
                : {
                    color: color.hexColors?.[0] || '#6b7280',
                    label: color.label,
                    type: 'color' as const,
                    value: color.entityId.toString(),
                  },
            )}
          />
        </div>
      )}

      {/* Wishlist Button - positioned below color picker */}
      {additionalActions ? (
        <div className="flex justify-center sm:justify-end">{additionalActions}</div>
      ) : null}
    </form>
  );
}
