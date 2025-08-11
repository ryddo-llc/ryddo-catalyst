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

interface ScooterAddToCartFormProps<F extends Field> {
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
      className="bg-[#F92F7B] text-white py-2 px-5 rounded-full font-semibold hover:bg-pink-600 transition-colors text-sm disabled:opacity-50 min-h-[44px] active:scale-95"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? 'Adding...' : children}
    </button>
  );
}

export function ScooterAddToCartForm<F extends Field>({
  productId,
  action,
  fields,
  colors,
  compareProduct,
  ctaLabel = 'Add to cart',
  disabled = false,
  additionalActions,
}: ScooterAddToCartFormProps<F>) {
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
        if (field.name === 'color') {
          return null; // Skip color field - handled below
        }
        const value = getFieldValue(field);
        if (value) {
          return <input key={field.name} name={field.name} type="hidden" value={value} />;
        }
        return null;
      })}

      <div className="space-y-4">
        {/* Color Selection */}
        {colors && colors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <SwatchRadioGroup
              defaultValue={colors[0]?.value}
              name="color"
              options={colors.map((color) => ({
                label: color.label,
                value: color.value,
                color: color.color,
              }))}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <SubmitButton disabled={disabled}>{ctaLabel}</SubmitButton>
          
          {/* Compare Button */}
          {compareProduct && (
            <Compare
              item={compareProduct}
              label="Compare"
            />
          )}
          
          {additionalActions}
        </div>
      </div>
    </form>
  );
}