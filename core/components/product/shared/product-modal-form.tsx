'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { startTransition, useActionState, useEffect, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { ButtonRadioGroup } from '@/vibes/soul/form/button-radio-group';
import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import type { Product } from '@/vibes/soul/primitives/product-card';
import { toast } from '@/vibes/soul/primitives/toaster';
import { ProductDetailFormAction } from '@/vibes/soul/sections/product-detail/product-detail-form';
import { Field } from '@/vibes/soul/sections/product-detail/schema';
import { Link } from '~/components/link';

import { revalidateCart } from '../../../vibes/soul/sections/product-detail/actions/revalidate-cart';

import { addToCart } from './_actions/add-to-cart';

interface ProductModalFormProps {
  product: Product;
  onClose: () => void;
}

// Client-safe transformer for modal - only handles swatch and button fields
const clientProductOptionsTransformer = (
  productOptions: Product['productOptions']
): Field[] => {
  if (!productOptions || !('edges' in productOptions)) {
    return [];
  }

  return removeEdgesAndNodes(productOptions)
    .map<Field | null>((option) => {
      if (option.__typename === 'MultipleChoiceOption') {
        const values = removeEdgesAndNodes(option.values);

        switch (option.displayStyle) {
          case 'Swatch': {
            return {
              persist: option.isVariantOption,
              type: 'swatch-radio-group',
              label: option.displayName,
              required: option.isRequired,
              name: option.entityId.toString(),
              defaultValue: values.find((value) => value.isDefault)?.entityId.toString(),
              options: values
                .filter(
                  (value) => '__typename' in value && value.__typename === 'SwatchOptionValue',
                )
                .map((value) => {
                  if (value.imageUrl) {
                    return {
                      type: 'image',
                      label: value.label,
                      value: value.entityId.toString(),
                      image: { src: value.imageUrl, alt: value.label },
                    };
                  }

                  return {
                    type: 'color',
                    label: value.label,
                    value: value.entityId.toString(),
                    color: value.hexColors[0] ?? '',
                  };
                }),
            };
          }

          case 'RectangleBoxes': {
            return {
              persist: option.isVariantOption,
              type: 'button-radio-group',
              label: option.displayName,
              required: option.isRequired,
              name: option.entityId.toString(),
              defaultValue: values.find((value) => value.isDefault)?.entityId.toString(),
              options: values.map((value) => ({
                label: value.label,
                value: value.entityId.toString(),
              })),
            };
          }

          default:
            return null;
        }
      }

      return null;
    })
    .filter((field): field is Field => field !== null);
};

function SubmitButton({ children, disabled }: { children: string; disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-[50px] w-full items-center justify-center whitespace-nowrap rounded-[50px] bg-[#F92F7B] px-4 sm:px-6 py-3 sm:py-4 font-['Inter'] text-base sm:text-lg font-bold leading-normal tracking-wide text-white shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.12)] transition-all hover:bg-[#d41f63] hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? 'Adding...' : children}
    </button>
  );
}

function ModalForm<F extends Field>({
  fields,
  action,
  productId,
  price,
}: {
  fields: F[];
  action: ProductDetailFormAction<F>;
  productId: string;
  price: Product['price'];
}) {
  const [state, formAction] = useActionState(action, {
    fields,
    lastResult: null,
  });
  
  // State for tracking selected sizes for each field
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.name.toLowerCase().includes('size') && field.defaultValue) {
        initial[field.name] = String(field.defaultValue);
      }
    });
    
    return initial;
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
    return (
      field.type === 'button-radio-group' ||
      field.type === 'radio-group' ||
      field.type === 'select' ||
      field.type === 'card-radio-group' ||
      field.type === 'swatch-radio-group'
    );
  };

  // Get options fields for interactive section  
  const interactiveFields = fields.filter(shouldRenderField);

  // Helper function to identify size fields (matches main product form logic)
  const isSizeField = (field: Field): boolean => {
    return field.name.toLowerCase().includes('size');
  };

  // Custom size badge component that exactly matches InteractiveSizeBadges styling
  const renderSizeBadges = (field: Field) => {
    if (!('options' in field) || field.options.length === 0) {
      return null;
    }

    const handleSizeSelect = (fieldName: string, value: string) => {
      setSelectedSizes(prev => ({ ...prev, [fieldName]: value }));
    };

    const selectedValue = selectedSizes[field.name] || field.defaultValue;

    return (
      <div key={field.name}>
        <span className="mb-3 block text-base font-semibold text-gray-700">{field.label}</span>
        <div className="flex flex-wrap gap-2">
          {field.options.map((option, index) => {
            const label = typeof option === 'string' ? option : option.label;
            const value = typeof option === 'string' ? option : option.value;
            const isSelected = selectedValue === value;

            return (
              <button
                className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all ${
                  isSelected 
                    ? 'bg-pink-50 ring-2 ring-[#F92F7B]' 
                    : 'hover:bg-gray-50'
                }`}
                key={value || index}
                onClick={() => handleSizeSelect(field.name, String(value))}
                type="button"
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded border shadow-sm transition-all ${
                    isSelected 
                      ? 'border-[#F92F7B] bg-[#F92F7B] text-white' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{label}</span>
                </div>
              </button>
            );
          })}
        </div>
        {/* Hidden input for form submission */}
        <input
          name={field.name}
          required={field.required}
          type="hidden"
          value={selectedValue || ''}
        />
      </div>
    );
  };

  // Helper function to render price
  const renderPrice = (priceValue: Product['price']) => {
    if (!priceValue) return null;
    
    if (typeof priceValue === 'string') {
      return priceValue;
    }

    switch (priceValue.type) {
      case 'range':
        return `${priceValue.minValue} – ${priceValue.maxValue}`;

      case 'sale':
        return priceValue.currentValue;

      default:
        return '';
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <input name="id" type="hidden" value={productId} />
      <input name="quantity" type="hidden" value="1" />

      {/* Handle non-interactive product option fields as hidden inputs */}
      {fields.map((field) => {
        if (shouldRenderField(field)) {
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

      {/* Price Display */}
      {(() => {
        if (!price) return null;
        
        const renderedPrice = renderPrice(price);
        
        if (!renderedPrice) return null;
        
        return (
          <div className="text-3xl font-black text-[#333]">
            <span>{renderedPrice}</span>
          </div>
        );
      })()}

      {/* Interactive Fields - Colors and Sizes */}
      {interactiveFields.map((field) => {
        if (!('options' in field) || field.options.length === 0) {
          return null;
        }

        // Handle Size fields with custom badge styling
        if (isSizeField(field) && field.type === 'button-radio-group') {
          return renderSizeBadges(field);
        }

        // Handle Color fields with swatch styling
        if (field.type === 'swatch-radio-group') {
          return (
            <div key={field.name}>
              <span className="mb-3 block text-base font-semibold text-gray-700">{field.label}</span>
              <SwatchRadioGroup
                className="gap-4 [&_input:checked+label]:!border-4 [&_input:checked+label]:!border-[#F92F7B] [&_input:checked+label]:!ring-2 [&_input:checked+label]:!ring-pink-200 [&_label]:!h-12 [&_label]:!min-h-[48px] [&_label]:!w-12 [&_label]:!min-w-[48px] [&_label]:!border-2 [&_label]:!border-gray-300"
                defaultValue={field.defaultValue}
                name={field.name}
                options={field.options}
                required={field.required}
              />
            </div>
          );
        }

        // Handle other button-radio-group fields (fallback)
        if (field.type === 'button-radio-group') {
          return (
            <div key={field.name}>
              <span className="mb-3 block text-base font-semibold text-gray-700">{field.label}</span>
              <ButtonRadioGroup
                className="[&_[role='radio'][data-state='checked']]:!border-[#F92F7B] [&_[role='radio'][data-state='checked']]:!text-[#F92F7B] [&_[role='radio'][data-state='unchecked']]:!border-[#757575] [&_[role='radio'][data-state='unchecked']]:!text-[#757575] [&_[role='radio']]:!min-h-[48px] [&_[role='radio']]:!rounded-[50px] [&_[role='radio']]:!bg-transparent [&_[role='radio']]:!px-6 [&_[role='radio']]:!py-3 [&_[role='radio']]:!text-base [&_[role='radio']]:!font-semibold [&_[role='radio']]:!transition-colors [&_[role='radiogroup']]:flex [&_[role='radiogroup']]:flex-wrap [&_[role='radiogroup']]:gap-3"
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

      {/* Add to Cart Button */}
      <SubmitButton disabled={false}>
        Add to Cart
      </SubmitButton>
    </form>
  );
}

export function ProductModalForm({ product, onClose }: ProductModalFormProps) {
  // Create Streamable for product options transformation (client-safe version)
  const streamableFields = useMemo(() => {
    if (!product.productOptions) {
      return Streamable.from(() => Promise.resolve([]));
    }
    
    // Use client-safe transformer that doesn't need getTranslations
    const fields = clientProductOptionsTransformer(product.productOptions);
    
    return Streamable.from(() => Promise.resolve(fields));
  }, [product.productOptions]);

  return (
    <div className="flex flex-col gap-6">
      {/* Modal Form with Color/Size Only */}
      <Stream
        fallback={
          <div className="flex items-center justify-center py-4">
            <div className="text-sm text-gray-500">Loading options...</div>
          </div>
        }
        value={streamableFields}
      >
        {(fields) => (
          <ModalForm
            action={addToCart}
            fields={fields}
            price={product.price}
            productId={product.id}
          />
        )}
      </Stream>

      {/* View Full Product Details Link */}
      <div className="text-center">
        <Link
          className="inline-flex items-center text-[#F92F7B] hover:text-[#d41f63] font-medium text-sm transition-colors underline"
          href={product.href}
          onClick={onClose}
        >
          View Full Product Details →
        </Link>
      </div>
    </div>
  );
}