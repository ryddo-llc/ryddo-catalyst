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

import { ColorOption } from '../../../data-transformers/bike-product-transformer';
import { revalidateCart } from '../../../vibes/soul/sections/product-detail/actions/revalidate-cart';

import { CollapsibleSection } from './collapsible-section';

interface CompareDrawerItem {
  id: string;
  image?: { src: string; alt: string };
  href: string;
  title: string;
}

interface ScooterMobileCollapsibleFormProps<F extends Field> {
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
      className="w-full flex justify-center items-center bg-[#F92F7B] shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.12)] px-6 py-4 rounded-[50px] min-h-[50px] text-lg font-bold font-['Inter'] leading-normal tracking-wide text-white hover:bg-[#d41f63] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? 'Adding...' : children}
    </button>
  );
}

export function ScooterMobileCollapsibleForm<F extends Field>({
  productId,
  action,
  fields,
  colors,
  compareProduct,
  ctaLabel = 'Add to cart',
  disabled = false,
  additionalActions,
}: ScooterMobileCollapsibleFormProps<F>) {
  const [state, formAction] = useActionState(action, {
    fields,
    lastResult: null,
  });

  useEffect(() => {
    if (state.lastResult?.status === 'success') {
      if (state.successMessage) {
        toast.success(state.successMessage);
      }
      startTransition(() => {
        void revalidateCart();
      });
    }
  }, [state.lastResult, state.successMessage]);

  // Helper function to check if field should be rendered as interactive element
  const shouldRenderField = (field: F): boolean => {
    if (field.name === 'color') return false;
    
    return (
      field.type === 'button-radio-group' || 
      field.type === 'radio-group' ||
      field.type === 'select' ||
      field.type === 'card-radio-group' ||
      field.type === 'swatch-radio-group'
    );
  };

  // Get options fields for collapsible section
  const optionFields = fields.filter(shouldRenderField);

  return (
    <form action={formAction} className="space-y-6">
      <input name="id" type="hidden" value={productId} />
      <input name="quantity" type="hidden" value="1" />
      
      {/* Handle non-interactive product option fields as hidden inputs */}
      {fields.map((field) => {
        if (shouldRenderField(field) || field.name === 'color') {
          return null;
        }

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

      {/* Color Selection - Always visible */}
      {colors && colors.length > 0 && (
        <div>
          <span className="block text-base sm:text-lg font-semibold text-gray-700 mb-3">
            Color
          </span>
          <SwatchRadioGroup
            className="[&_input:checked+label]:!border-[#F92F7B] [&_input:checked+label]:!border-4 [&_input:checked+label]:!ring-2 [&_input:checked+label]:!ring-pink-200 [&_label]:!border-2 [&_label]:!border-gray-300 [&_label]:!min-h-[48px] [&_label]:!min-w-[48px] [&_label]:!h-12 [&_label]:!w-12 gap-4"
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

      {/* Primary Actions - Always visible */}
      <div className="space-y-4">
        <SubmitButton disabled={disabled}>{ctaLabel}</SubmitButton>
        
        {/* Secondary Actions */}
        <div className="flex items-center justify-center gap-4">
          {compareProduct && (
            <Compare
              className="flex justify-center items-center px-6 py-3 rounded-[50px] border-2 border-solid border-[#757575] text-[#757575] font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#757575] hover:text-white transition-colors min-h-[48px]"
              label="Compare"
              product={compareProduct}
            />
          )}
          {additionalActions}
        </div>
      </div>

      {/* Collapsible Options Section */}
      {optionFields.length > 0 && (
        <CollapsibleSection
          className="mt-6"
          title="Options"
          defaultExpanded={true}
        >
          <div className="space-y-6">
            {optionFields.map((field) => {
              if (field.type === 'radio-group') {
                const isOptions = field.label.toLowerCase() === 'options';
                
                return (
                  <div key={field.name} className="space-y-3">
                    <div className="font-['Inter'] text-base font-bold text-[#333] uppercase">
                      {field.label}
                    </div>
                    <div className={
                      isOptions 
                        ? "grid grid-cols-1 gap-3" // Stack options vertically on mobile
                        : "flex flex-col gap-3"   // Stack battery options vertically too
                    }>
                      <ButtonRadioGroup
                        className="[&_[role='radiogroup']]:flex [&_[role='radiogroup']]:flex-col [&_[role='radiogroup']]:gap-3 [&_[role='radio']]:!min-h-[48px] [&_[role='radio']]:!px-6 [&_[role='radio']]:!py-3 [&_[role='radio']]:!text-base [&_[role='radio']]:!font-semibold [&_[role='radio'][data-state='checked']]:!border-[#F92F7B] [&_[role='radio'][data-state='checked']]:!text-[#F92F7B] [&_[role='radio'][data-state='unchecked']]:!border-[#757575] [&_[role='radio'][data-state='unchecked']]:!text-[#757575] [&_[role='radio']]:!rounded-[50px] [&_[role='radio']]:!bg-transparent [&_[role='radio']]:!transition-colors"
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
                  <div key={field.name} className="space-y-3">
                    <span className="block text-base font-bold text-[#333] uppercase font-inter">
                      {field.label}
                    </span>
                    <SelectField
                      className="[&_select]:!min-h-[48px] [&_select]:!rounded-[50px] [&_select]:!border-2 [&_select]:!border-[#757575] [&_select]:!font-semibold [&_select]:!text-base [&_select]:!px-6 [&_select]:!py-3 [&_select]:!bg-white [&_select:focus]:!border-[#F92F7B] [&_select:focus]:!ring-0"
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
                  <div key={field.name} className="space-y-3">
                    <span className="block text-base font-bold text-[#333] uppercase font-inter">
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

              return null;
            })}
          </div>
        </CollapsibleSection>
      )}
    </form>
  );
}