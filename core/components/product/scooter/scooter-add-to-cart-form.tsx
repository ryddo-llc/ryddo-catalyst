'use client';

import { ReactNode, startTransition, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { ButtonRadioGroup } from '@/vibes/soul/form/button-radio-group';
import { CardRadioGroup } from '@/vibes/soul/form/card-radio-group';
import { SelectField } from '@/vibes/soul/form/select-field';
import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Compare } from '@/vibes/soul/primitives/product-card/compare';
import { toast } from '@/vibes/soul/primitives/toaster';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';

import { ColorOption } from '../../../data-transformers/scooter-product-transformer';
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
      className="flex justify-center items-center flex-1 self-stretch bg-[#F92F7B] shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.12)] px-4 sm:pl-4 sm:pr-[15.5px] py-2.5 sm:pt-[9px] sm:pb-2.5 rounded-[50px] min-h-[43px] text-base font-bold font-['Inter'] leading-normal tracking-wide text-white hover:bg-[#d41f63] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 overflow-hidden"
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

  // Helper function to check if field should be rendered as interactive element
  const shouldRenderField = (field: F): boolean => {
    // Skip color field since it's handled by the SwatchRadioGroup
    if (field.name.toLowerCase() === 'color') {
      return false;
    }
    
    // Render all interactive field types
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
      {fields.map((field) => {
        if (shouldRenderField(field)) {
          return null; // Skip fields that will be rendered as interactive elements
        }

        if (field.name === 'color') {
          return null; // Skip color field - handled below
        }

        // For other fields, use default value or first option as hidden input
        let value = '';

        if ('defaultValue' in field && field.defaultValue) {
          value = String(field.defaultValue);
        } else if ('options' in field && field.options.length > 0) {
          value = String(field.options[0]?.value ?? '');
        }

        if (value) {
          return <input key={field.name} name={field.name} type="hidden" value={value} />;
        }

        return null;
      })}

      <div className="space-y-6">
        {/* Color Selection */}
        {colors && colors.length > 0 && (
          <div>
            <span className="block text-sm md:text-base font-medium text-gray-700 mb-2">Color</span>
            <SwatchRadioGroup
              defaultValue={colors[0]?.entityId.toString()}
              name="color"
              options={colors.map((color) => ({
                color: color.hexColors?.[0] || '#000000',
                label: color.label,
                type: 'color' as const,
                value: color.entityId.toString(),
              }))}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <SubmitButton disabled={disabled}>{ctaLabel}</SubmitButton>
          
          {/* Compare Button */}
          {compareProduct && (
            <Compare
              className="flex justify-center items-center px-4 sm:pl-[31px] sm:pr-[29.83px] py-3 rounded-[50px] border-2 border-solid border-[#757575] text-[#757575] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#757575] hover:text-white transition-colors min-h-[43px] whitespace-nowrap"
              label="Compare"
              product={compareProduct}
            />
          )}
          
          {additionalActions}
        </div>

        {/* Gray Separator Line */}
        <div className="border-t border-[#949494] mb-6" />

        {/* Variant Option Fields */}
        {fields.map((field) => {
          if (!shouldRenderField(field)) {
            return null;
          }

          // Custom styling for variant options to match Figma design
          const customClassName = `variant-option-buttons 
            [&_.button-radio-group_[role='radiogroup']]:flex 
            [&_.button-radio-group_[role='radiogroup']]:flex-wrap 
            [&_.button-radio-group_[role='radiogroup']]:gap-4
            [&_[role='radio'][data-state='checked']]:!border-[#F92F7B]
            [&_[role='radio'][data-state='checked']]:!border-2
            [&_[role='radio'][data-state='checked']]:!text-[#F92F7B]
            [&_[role='radio'][data-state='unchecked']]:!border-[#757575]
            [&_[role='radio'][data-state='unchecked']]:!border-2
            [&_[role='radio'][data-state='unchecked']]:!text-[#757575]
            [&_[role='radio']]:!rounded-[50px]
            [&_[role='radio']]:!font-bold
            [&_[role='radio']]:!text-[15.25px]
            [&_[role='radio']]:!leading-[19px]
            [&_[role='radio']]:!px-6
            [&_[role='radio']]:!py-3
            [&_[role='radio']]:!min-h-[43px]
            [&_[role='radio']]:!bg-white
            [&_[role='radio']]:!font-inter
            [&_[role='radio']]:!transition-colors
            [&_[role='radio']:hover[data-state='unchecked']]:!border-[#757575]
            [&_[role='radio']:hover[data-state='unchecked']]:!bg-gray-50`.replace(/\s+/g, ' ').trim();

          if (field.type === 'button-radio-group') {
            return (
              <div className={customClassName} key={field.name}>
                <div className="flex h-[32px] flex-col justify-center text-[#333] font-inter text-sm sm:text-base not-italic font-extrabold leading-4 uppercase mb-2 text-left">
                  {field.label}
                </div>
                <ButtonRadioGroup
                  defaultValue={field.defaultValue}
                  name={field.name}
                  options={field.options}
                  required={field.required}
                />
              </div>
            );
          }

          if (field.type === 'radio-group') {
            // Determine layout based on field name - Battery Size gets horizontal, Options gets 2x2 grid
            const isOptions = field.label.toLowerCase() === 'options';
            const radioGroupClassName = isOptions 
              ? `options-grid-layout
                [&_.button-radio-group_[role='radiogroup']]:grid 
                [&_.button-radio-group_[role='radiogroup']]:grid-cols-1 
                [&_.button-radio-group_[role='radiogroup']]:sm:grid-cols-2
                [&_.button-radio-group_[role='radiogroup']]:gap-x-3
                [&_.button-radio-group_[role='radiogroup']]:gap-y-4
                [&_.button-radio-group_[role='radiogroup']]:w-full 
                [&_.button-radio-group_[role='radiogroup']]:sm:w-[260px]
                [&_[role='radio'][data-state='checked']]:!border-[#F92F7B]
                [&_[role='radio'][data-state='checked']]:!border-2
                [&_[role='radio'][data-state='checked']]:!text-[#F92F7B]
                [&_[role='radio'][data-state='unchecked']]:!border-[#757575]
                [&_[role='radio'][data-state='unchecked']]:!border-2
                [&_[role='radio'][data-state='unchecked']]:!text-[#757575]
                [&_[role='radio']]:!rounded-[50px]
                [&_[role='radio']]:!font-bold
                [&_[role='radio']]:!text-[14px]
                [&_[role='radio']]:!leading-[17px]
                [&_[role='radio']]:!px-6 
                [&_[role='radio']]:!sm:px-4
                [&_[role='radio']]:!py-3 
                [&_[role='radio']]:!sm:py-2
                [&_[role='radio']]:!min-h-[44px] 
                [&_[role='radio']]:!sm:min-h-[36px]
                [&_[role='radio']]:!bg-transparent
                [&_[role='radio']]:!font-inter
                [&_[role='radio']]:!transition-colors
                [&_[role='radio']:hover[data-state='unchecked']]:!border-[#757575]
                [&_[role='radio']:hover[data-state='unchecked']]:!bg-gray-50`.replace(/\s+/g, ' ').trim()
              : `battery-size-layout
                [&_.button-radio-group_[role='radiogroup']]:flex 
                [&_.button-radio-group_[role='radiogroup']]:flex-col 
                [&_.button-radio-group_[role='radiogroup']]:sm:flex-row
                [&_.button-radio-group_[role='radiogroup']]:gap-3
                [&_.button-radio-group_[role='radiogroup']]:w-full 
                [&_.button-radio-group_[role='radiogroup']]:sm:w-[260px]
                [&_[role='radio'][data-state='checked']]:!border-[#F92F7B]
                [&_[role='radio'][data-state='checked']]:!border-2
                [&_[role='radio'][data-state='checked']]:!text-[#F92F7B]
                [&_[role='radio'][data-state='unchecked']]:!border-[#757575]
                [&_[role='radio'][data-state='unchecked']]:!border-2
                [&_[role='radio'][data-state='unchecked']]:!text-[#757575]
                [&_[role='radio']]:!rounded-[50px]
                [&_[role='radio']]:!font-bold
                [&_[role='radio']]:!text-[14px]
                [&_[role='radio']]:!leading-[17px]
                [&_[role='radio']]:!px-6 
                [&_[role='radio']]:!sm:px-4
                [&_[role='radio']]:!py-3 
                [&_[role='radio']]:!sm:py-2
                [&_[role='radio']]:!min-h-[44px] 
                [&_[role='radio']]:!sm:min-h-[36px]
                [&_[role='radio']]:!bg-transparent
                [&_[role='radio']]:!font-inter
                [&_[role='radio']]:!transition-colors
                [&_[role='radio']:hover[data-state='unchecked']]:!border-[#757575]
                [&_[role='radio']:hover[data-state='unchecked']]:!bg-gray-50`.replace(/\s+/g, ' ').trim();

            return (
              <div className="mb-6" key={field.name}>
                <div className="flex h-[32px] flex-col justify-center text-[#333] font-inter text-sm sm:text-base md:text-lg not-italic font-extrabold leading-4 uppercase mb-2 text-left">
                  {field.label}
                </div>
                <div className={radioGroupClassName}>
                  <ButtonRadioGroup
                    defaultValue={field.defaultValue}
                    name={field.name}
                    options={field.options}
                    required={field.required}
                  />
                </div>
              </div>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.name}>
                <span className="block text-base sm:text-lg md:text-xl font-[800] text-[#333333] mb-2 uppercase font-inter leading-[24px] tracking-wide">
                  {field.label}
                </span>
                <SelectField
                  className="[&_select]:!min-h-[43px] [&_select]:!rounded-[50px] [&_select]:!border-2 [&_select]:!border-[#757575] [&_select]:!font-bold [&_select]:!text-[15.25px] [&_select]:!px-6 [&_select]:!py-3 [&_select]:!bg-white [&_select:focus]:!border-[#F92F7B] [&_select:focus]:!ring-0"
                  hideLabel={true}
                  label={field.label}
                  name={field.name}
                  options={field.options}
                  value={field.defaultValue || field.options[0]?.value || ''}
                />
              </div>
            );
          }

          if (field.type === 'card-radio-group') {
            return (
              <div key={field.name}>
                <span className="block text-base sm:text-lg md:text-xl font-[800] text-[#333333] mb-2 uppercase font-inter leading-[24px] tracking-wide">
                  {field.label}
                </span>
                <CardRadioGroup
                  className="[&_[role='radio'][data-state='checked']]:!border-[#F92F7B] [&_[role='radio'][data-state='checked']]:!border-2 [&_[role='radio'][data-state='unchecked']]:!border-[#757575] [&_[role='radio'][data-state='unchecked']]:!border-2"
                  defaultValue={field.defaultValue}
                  name={field.name}
                  options={field.options}
                  required={field.required}
                />
              </div>
            );
          }

          if (field.type === 'swatch-radio-group') {
            return (
              <div key={field.name}>
                <span className="block text-base sm:text-lg md:text-xl font-[800] text-[#333333] mb-2 uppercase font-inter leading-[24px] tracking-wide">
                  {field.label}
                </span>
                <SwatchRadioGroup
                  className="[&_input:checked+label]:!border-[#F92F7B] [&_input:checked+label]:!border-4 [&_input:checked+label]:!ring-2 [&_input:checked+label]:!ring-pink-200 [&_label]:!border-2 [&_label]:!border-gray-300 [&_label]:!min-h-[44px] [&_label]:!min-w-[44px] [&_label]:!h-12 [&_label]:!w-12 gap-4"
                  defaultValue={field.defaultValue}
                  name={field.name}
                  options={field.options}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </form>
  );
}