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
      className="flex justify-center items-center flex-1 self-stretch bg-[#F92F7B] shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.12)] px-4 sm:pl-4 sm:pr-[15.5px] py-2.5 sm:pt-[9px] sm:pb-2.5 rounded-[50px] min-h-[43px] text-base font-bold font-['Inter'] leading-normal tracking-wide text-white hover:bg-[#d41f63] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 overflow-hidden"
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

  // Helper function to get field value
  const getFieldValue = (field: F): string => {
    // Skip color field since it's handled by the SwatchRadioGroup
    if (field.name === 'color') {
      return ''; // Let the SwatchRadioGroup handle this
    }
    
    if ('defaultValue' in field && field.defaultValue) {
      return String(field.defaultValue);
    }
    
    if ('options' in field && field.options.length > 0) {
      return String(field.options[0]?.value ?? '');
    }
    
    return '';
  };

  return (
    <form action={formAction}>
      <input name="id" type="hidden" value={productId} />
      <input name="quantity" type="hidden" value="1" />
      
      {/* Handle product option fields with default/first option values */}
      {fields.map((field) => {
        // Skip color field completely - let SwatchRadioGroup handle it
        if (field.name === 'color') {
          return null;
        }
        
        return (
          <input
            key={field.name}
            name={field.name}
            type="hidden"
            value={getFieldValue(field)}
          />
        );
      })}
      
      {/* Show any form errors */}
      {state.lastResult?.status === 'error' && state.lastResult.error && (
        <div className="mb-2 text-xs text-red-600">
          {typeof state.lastResult.error === 'string' ? state.lastResult.error : 'An error occurred'}
        </div>
      )}

      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:gap-3 sm:justify-end sm:items-center">
        {compareProduct && (
          <Compare
            className="flex justify-center items-center px-4 sm:pl-[31px] sm:pr-[29.83px] py-3 rounded-[50px] border-2 border-solid border-[#757575] text-[#757575] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#757575] hover:text-white transition-colors min-h-[43px] whitespace-nowrap"
            label="Compare"
            product={compareProduct}
          />
        )}
        <SubmitButton disabled={disabled}>
          {ctaLabel}
        </SubmitButton>
      </div>

      {/* Color Selection - integrated into the form */}
      <div className="flex flex-col items-center mb-6 sm:items-end">
        <p className="mb-4 text-base font-bold tracking-wide text-gray-900 text-center sm:text-right">COLOR</p>
        {colors && colors.length > 0 ? (
          <SwatchRadioGroup
            className="justify-center sm:justify-end [&_label]:border-2 [&_label]:border-gray-300 [&_input:checked+label]:border-4 [&_input:checked+label]:border-[#F92F7B] [&_input:checked+label]:ring-2 [&_input:checked+label]:ring-pink-200 [&_label]:min-h-[44px] [&_label]:min-w-[44px] [&_label]:h-12 [&_label]:w-12 gap-4"
            defaultValue={colors.find(c => c.isSelected || c.isDefault)?.entityId.toString()}
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
                  }
            )}
          />
        ) : (
          <SwatchRadioGroup
            className="justify-center sm:justify-end [&_label]:min-h-[44px] [&_label]:min-w-[44px] [&_label]:h-12 [&_label]:w-12 gap-4"
            defaultValue="black"
            name="color"
            options={[
              { type: 'color' as const, value: 'black', label: 'Black', color: '#000000' },
              { type: 'color' as const, value: 'white', label: 'White', color: '#ffffff' },
              { type: 'color' as const, value: 'red', label: 'Red', color: '#ef4444' },
              { type: 'color' as const, value: 'blue', label: 'Blue', color: '#3b82f6' },
            ]}
          />
        )}
      </div>

      {/* Wishlist Button - positioned below color picker */}
      {additionalActions ? (
        <div className="flex justify-center sm:justify-end">
          {additionalActions}
        </div>
      ): null}
    </form>
  );
}