'use client';

import {
  FieldMetadata,
  FormProvider,
  FormStateInput,
  getFormProps,
  SubmissionResult,
  useForm,
  useInputControl,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { createSerializer, parseAsString, useQueryStates } from 'nuqs';
import React, { createContext, ReactNode, startTransition, useActionState, useCallback, useContext, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { ButtonRadioGroup } from '@/vibes/soul/form/button-radio-group';
import { CardRadioGroup } from '@/vibes/soul/form/card-radio-group';
import { Checkbox } from '@/vibes/soul/form/checkbox';
import { DatePicker } from '@/vibes/soul/form/date-picker';
import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { NumberInput } from '@/vibes/soul/form/number-input';
import { RadioGroup } from '@/vibes/soul/form/radio-group';
import { SelectField } from '@/vibes/soul/form/select-field';
import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Textarea } from '@/vibes/soul/form/textarea';
import { Button } from '@/vibes/soul/primitives/button';
import { Price } from '@/vibes/soul/primitives/price-label';
import { toast } from '@/vibes/soul/primitives/toaster';
import { useEvents } from '~/components/analytics/events';
import { usePathname, useRouter } from '~/i18n/routing';

import { revalidateCart } from './actions/revalidate-cart';
import { Field, schema, SchemaRawShape } from './schema';

// Create context to share form state with external components
interface ProductFormContextType {
  fields: Field[];
  formFields: Record<string, FieldMetadata<string | number | boolean | Date | undefined>>;
  onPrefetch: (fieldName: string, value: string) => void;
  emptySelectPlaceholder?: string;
}

const ProductFormContext = createContext<ProductFormContextType | null>(null);

export const useProductFormContext = () => {
  const context = useContext(ProductFormContext);
  
  if (!context) {
    throw new Error('useProductFormContext must be used within ProductFormProvider');
  }
  
  return context;
};

// Helper function to identify variant fields (color/size)
const isVariantField = (field: Field): boolean => {
  const variantTypes = ['swatch-radio-group', 'button-radio-group', 'card-radio-group'];
  const variantNames = ['color', 'colour', 'size', 'variant'];

  return (
    variantTypes.includes(field.type) ||
    variantNames.some((name) => field.name.toLowerCase().includes(name))
  );
};

// Helper function to check if required variant fields have values
const hasRequiredVariantFieldErrors = (
  fields: Field[],
  formFields: Record<string, FieldMetadata<string | number | boolean | Date | undefined>>
): boolean => {
  return fields
    .filter((field) => isVariantField(field) && field.required)
    .some((field) => {
      const formField = formFields[field.name];
      
      return !formField?.value || formField.value === '';
    });
};

type Action<S, P> = (state: Awaited<S>, payload: P) => S | Promise<S>;

interface State<F extends Field> {
  fields: F[];
  lastResult: SubmissionResult | null;
  successMessage?: ReactNode;
}

export type ProductDetailFormAction<F extends Field> = Action<State<F>, FormData>;

export interface ProductDetailFormProps<F extends Field> {
  fields: F[];
  action: ProductDetailFormAction<F>;
  productId: string;
  ctaLabel?: string;
  quantityLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
  emptySelectPlaceholder?: string;
  ctaDisabled?: boolean;
  prefetch?: boolean;
  additionalActions?: ReactNode;
  price?: Price | null;
}

// Export form context for external variant usage
export interface ProductFormContext<F extends Field> {
  fields: F[];
  formFields: Record<string, FieldMetadata<string | number | boolean | Date | undefined>>;
  onPrefetch: (fieldName: string, value: string) => void;
  emptySelectPlaceholder?: string;
}

export function ProductDetailForm<F extends Field>({
  action,
  fields,
  productId,
  ctaLabel = 'Add to cart',
  emptySelectPlaceholder = 'Select an option',
  ctaDisabled = false,
  prefetch = false,
  additionalActions,
  price,
}: ProductDetailFormProps<F>) {
  const router = useRouter();
  const pathname = usePathname();
  const events = useEvents();

  const searchParams = fields.reduce<Record<string, typeof parseAsString>>((acc, field) => {
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

  const defaultValue = fields.reduce<{
    [Key in keyof SchemaRawShape]?: z.infer<SchemaRawShape[Key]>;
  }>(
    (acc, field) => ({
      ...acc,
      [field.name]: params[field.name] ?? field.defaultValue,
    }),
    { quantity: 1 },
  );

  const [{ lastResult, successMessage }, formAction] = useActionState(action, {
    fields,
    lastResult: null,
  });

  useEffect(() => {
    if (lastResult?.status === 'success') {
      toast.success(successMessage);

      startTransition(async () => {
        // This is needed to refresh the Data Cache after the product has been added to the cart.
        // The cart id is not picked up after the first time the cart is created/updated.
        await revalidateCart();
      });
    }
  }, [lastResult, successMessage, router]);

  const [form, formFields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema(fields)),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schema(fields) });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(() => {
        formAction(formData);

        events.onAddToCart?.(formData);
      });
    },
    // @ts-expect-error: `defaultValue` types are conflicting with `onValidate`.
    defaultValue,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  // Helper function to render price
  const renderPrice = (priceValue: Price) => {
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

  const contextValue: ProductFormContextType = {
    fields,
    formFields,
    onPrefetch,
    emptySelectPlaceholder,
  };

  return (
    <ProductFormContext.Provider value={contextValue}>
      <FormProvider context={form.context}>
        <FormStateInput />
        <form {...getFormProps(form)} action={formAction} className="space-y-8">
          <input name="id" type="hidden" value={productId} />

        {/* Regular fields (non-variant) */}
        <div className="space-y-6">
          {fields
            .filter((field) => !isVariantField(field))
            .map((field) => {
              return (
                <div
                  className="rounded-lg bg-white/90 p-6 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
                  key={formFields[field.name]?.id}
                >
                  <FormField
                    emptySelectPlaceholder={emptySelectPlaceholder}
                    field={field}
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    formField={formFields[field.name]!}
                    onPrefetch={onPrefetch}
                  />
                </div>
              );
            })}
        </div>


        {/* Variant fields - hidden inputs for form submission */}
        {fields
          .filter((field) => isVariantField(field))
          .map((field) => (
            <input
              key={`${formFields[field.name]?.id}-hidden`}
              name={formFields[field.name]?.name}
              type="hidden"
              value={formFields[field.name]?.value ?? ''}
            />
          ))}

        {/* Form Errors */}
        {form.errors?.map((error, index) => (
          <FormStatus className="rounded-lg bg-red-50 p-4" key={index} type="error">
            {error}
          </FormStatus>
        ))}
        
        {/* Variant Field Errors */}
        {fields
          .filter((field) => isVariantField(field) && field.required)
          .map((field) => {
            const formField = formFields[field.name];
            
            if (!formField?.errors?.length) return null;
            
            return (
              <FormStatus className="rounded-lg bg-red-50 p-4" key={field.name} type="error">
                {field.label}: {formField.errors.join(', ')}
              </FormStatus>
            );
          })}

        {/* Price and Add to Cart Section */}
        <div className="flex flex-col gap-4 @sm:flex-row @sm:items-center @sm:gap-6">
          {/* Hidden quantity input with default value of 1 */}
          <input name={formFields.quantity.name} type="hidden" value="1" />

          {/* Price Display */}
          {price ? (
            <span
              className="max-w-[288px] text-3xl font-black leading-normal text-[#333] @md:text-4xl @lg:text-5xl @xl:text-6xl"
              style={{ fontFamily: 'Nunito' }}
            >
              {renderPrice(price)}
            </span>
          ) : null}

          {/* Add to Cart Button */}
          <SubmitButton 
            disabled={ctaDisabled || hasRequiredVariantFieldErrors(fields, formFields)}
          >
            {ctaLabel}
          </SubmitButton>
          {additionalActions}
        </div>

      </form>

      {/* Interactive Specifications Section - Inside form context */}
      <div className="mt-16">
        <div className="w-full">
          <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 py-12 px-4 @xl:px-6 @4xl:px-8">
            <div className="mx-auto max-w-screen-2xl">
              <InteractiveSpecificationsSection 
                fields={fields}
                formFields={formFields}
                onPrefetch={onPrefetch}
              />
            </div>
          </div>
        </div>
      </div>

    </FormProvider>
    </ProductFormContext.Provider>
  );
}

// Client component for interactive specifications that can be used in server components
export function SpecificationsClient() {
  const { fields, formFields, onPrefetch } = useProductFormContext();
  
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 py-12 px-4 @xl:px-6 @4xl:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <InteractiveSpecificationsSection 
            fields={fields}
            formFields={formFields}
            onPrefetch={onPrefetch}
          />
        </div>
      </div>
    </div>
  );
}

// Export the context provider to be used at a higher level
export function ProductFormContextProvider({ 
  children, 
  fields, 
  formFields, 
  onPrefetch, 
  emptySelectPlaceholder 
}: { 
  children: ReactNode;
  fields: Field[];
  formFields: Record<string, FieldMetadata<string | number | boolean | Date | undefined>>;
  onPrefetch: (fieldName: string, value: string) => void;
  emptySelectPlaceholder?: string;
}) {
  const contextValue: ProductFormContextType = {
    fields,
    formFields,
    onPrefetch,
    emptySelectPlaceholder,
  };

  return (
    <ProductFormContext.Provider value={contextValue}>
      {children}
    </ProductFormContext.Provider>
  );
}

function SubmitButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="flex-1 bg-[#F92F7B] text-white hover:bg-[#e01b5f] focus:ring-2 focus:ring-[#F92F7B] focus:ring-offset-2 disabled:bg-gray-300 @sm:min-w-[200px] @sm:flex-none"
      disabled={disabled}
      loading={pending}
      size="medium"
      type="submit"
    >
      {children}
    </Button>
  );
}

// eslint-disable-next-line complexity
function FormField({
  field,
  formField,
  onPrefetch,
  emptySelectPlaceholder,
  isVariant = false,
}: {
  field: Field;
  formField: FieldMetadata<string | number | boolean | Date | undefined>;
  onPrefetch: (fieldName: string, value: string) => void;
  emptySelectPlaceholder?: string;
  isVariant?: boolean;
}) {
  const controls = useInputControl(formField);

  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: true }) } : {},
  );

  const handleChange = useCallback(
    (value: string) => {
      // Ensure that if page is reached without a full reload, we are still setting the selection properly based on query params.
      const fieldValue = value || params[field.name];

      void setParams({ [field.name]: fieldValue || null }); // Passing `null` to remove the value from the query params if fieldValue is falsy

      controls.change(fieldValue ?? ''); // If fieldValue is falsy, we set it to an empty string
    },
    [setParams, field, controls, params],
  );

  const handleOnOptionMouseEnter = (value: string) => {
    if (field.persist === true) {
      onPrefetch(field.name, value);
    }
  };

  switch (field.type) {
    case 'number':
      return (
        <NumberInput
          decrementLabel={field.decrementLabel}
          errors={formField.errors}
          incrementLabel={field.incrementLabel}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'text':
      return (
        <Input
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'date':
      return (
        <DatePicker
          defaultValue={controls.value}
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={controls.focus}
          required={formField.required}
        />
      );

    case 'textarea':
      return (
        <Textarea
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          maxLength={field.maxLength}
          minLength={field.minLength}
          name={formField.name}
          onBlur={controls.blur}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          checked={controls.value === 'true'}
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onCheckedChange={(value) => handleChange(value ? 'true' : '')}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'select':
      return (
        <SelectField
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          placeholder={emptySelectPlaceholder}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'radio-group':
      return (
        <RadioGroup
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

    case 'swatch-radio-group':
      return (
        <SwatchRadioGroup
          className={isVariant ? 'variant-swatch-group' : ''}
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
          className={isVariant ? 'variant-button-group' : ''}
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
  }
}

// Helper function to create specification item for horizontal layout
const createSpecificationItem = (title: string, content: React.ReactNode) => (
  <div className="text-center min-w-[80px]">
    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-900">{title}</div>
    {content}
  </div>
);

// Interactive Specifications Section Component
interface InteractiveSpecificationsSectionProps {
  fields: Field[];
  formFields?: Record<string, FieldMetadata<string | number | boolean | Date | undefined>>;
  onPrefetch?: (fieldName: string, value: string) => void;
}

// Interactive specifications component (with optional form context)
export function InteractiveSpecificationsSection({
  fields,
  formFields,
  onPrefetch,
}: InteractiveSpecificationsSectionProps) {
  const variantFields = fields.filter(isVariantField);

  // Find color and size fields
  const colorField =
    variantFields.find(
      (field) =>
        field.name.toLowerCase().includes('color') ||
        field.name.toLowerCase().includes('colour'),
    ) || variantFields[0]; // Fallback to first variant field

  const sizeField =
    variantFields.find((field) => field.name.toLowerCase().includes('size')) ||
    variantFields[1]; // Fallback to second variant field


  return (
    <div className="space-y-8">
      {/* Title for specifications section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Specifications</h2>
        <p className="text-gray-600">Select your options and view product details</p>
      </div>

      {/* Full-width horizontal layout for variants and specifications */}
      <div className="flex flex-wrap items-center justify-center gap-12 @lg:gap-16">
        {/* Colors section - interactive when form context available */}
        {colorField && formFields && (() => {
          const colorFormField = formFields[colorField.name];

          return colorFormField ? (
            <div className="flex-shrink-0">
              <InteractiveColorSwatches
                field={colorField}
                formField={colorFormField}
                onPrefetch={onPrefetch || (() => { /* no-op */ })}
                title="Available Colors"
              />
            </div>
          ) : null;
        })()}
        
        {/* Sizes section - interactive when form context available */}
        {sizeField && formFields && (() => {
          const sizeFormField = formFields[sizeField.name];

          return sizeFormField ? (
            <div className="flex-shrink-0">
              <InteractiveSizeBadges
                field={sizeField}
                formField={sizeFormField}
                onPrefetch={onPrefetch || (() => { /* no-op */ })}
                title="Available Sizes"
              />
            </div>
          ) : null;
        })()}

        {/* Static specifications - horizontal layout */}
        <div className="flex flex-wrap gap-8 justify-center">
          {createSpecificationItem(
            'Weight',
            <span className="text-sm font-medium text-gray-600">2.5 lbs</span>,
          )}
          {createSpecificationItem(
            'Construction',
            <span className="text-sm font-medium text-gray-600">
              Aluminum Frame
            </span>,
          )}
          {createSpecificationItem(
            'Finish',
            <span className="text-sm font-medium text-gray-600">
              Powder Coated
            </span>,
          )}
          {createSpecificationItem(
            'Certified',
            <span className="text-sm font-medium text-gray-600">
              CE, UL Listed
            </span>,
          )}
        </div>
      </div>
    </div>
  );
}

// Interactive Specifications Components for rendering within form context
export interface InteractiveSpecificationItemProps {
  title: string;
  field: Field;
  formField: FieldMetadata<string | number | boolean | Date | undefined>;
  onPrefetch: (fieldName: string, value: string) => void;
}

export function InteractiveColorSwatches({
  title,
  field,
  formField,
  onPrefetch,
}: InteractiveSpecificationItemProps) {
  const controls = useInputControl(formField);
  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: true }) } : {},
  );

  const handleColorSelect = useCallback(
    (value: string) => {
      const fieldValue = value || params[field.name];

      void setParams({ [field.name]: fieldValue || null });
      controls.change(fieldValue ?? '');

      if (field.persist === true) {
        onPrefetch(field.name, value);
      }
    },
    [setParams, field, controls, params, onPrefetch],
  );

  if (!('options' in field) || field.options.length === 0) return null;

  return (
    <div className="text-left">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900">{title}</div>
      <div className="flex flex-wrap gap-2">
        {field.options.map((option, index) => {
          const label = typeof option === 'string' ? option : option.label;
          const value = typeof option === 'string' ? option : option.value;
          const isSelected = controls.value === value;

          return (
            <button
              className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all ${
                isSelected 
                  ? 'bg-pink-50 ring-2 ring-[#F92F7B]' 
                  : 'hover:bg-gray-50'
              }`}
              key={value || index}
              onClick={() => handleColorSelect(String(value))}
              type="button"
            >
              <div
                className={`h-6 w-6 rounded border shadow-sm transition-all ${
                  isSelected ? 'ring-2 ring-[#F92F7B] ring-offset-2' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: 
                    field.type === 'swatch-radio-group' &&
                    typeof option === 'object' &&
                    'type' in option &&
                    option.type === 'color' &&
                    'color' in option
                      ? String(option.color)
                      : '#ccc',
                }}
                title={label}
              />
              <span className="text-xs text-gray-500">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InteractiveSizeBadges({
  title,
  field,
  formField,
  onPrefetch,
}: InteractiveSpecificationItemProps) {
  const controls = useInputControl(formField);
  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: true }) } : {},
  );

  const handleSizeSelect = useCallback(
    (value: string) => {
      const fieldValue = value || params[field.name];

      void setParams({ [field.name]: fieldValue || null });
      controls.change(fieldValue ?? '');

      if (field.persist === true) {
        onPrefetch(field.name, value);
      }
    },
    [setParams, field, controls, params, onPrefetch],
  );

  if (!('options' in field) || field.options.length === 0) return null;

  return (
    <div className="text-left">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900">{title}</div>
      <div className="flex flex-wrap gap-2">
        {field.options.map((option, index) => {
          const label = typeof option === 'string' ? option : option.label;
          const value = typeof option === 'string' ? option : option.value;
          const isSelected = controls.value === value;

          return (
            <button
              className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all ${
                isSelected 
                  ? 'bg-pink-50 ring-2 ring-[#F92F7B]' 
                  : 'hover:bg-gray-50'
              }`}
              key={value || index}
              onClick={() => handleSizeSelect(String(value))}
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
    </div>
  );
}



// Add custom styles for modern variant styling
const variantStyles = `
  /* Modern swatch radio group styling for colors and sizes */
  .variant-swatch-group [role="radiogroup"] > [role="radio"] {
    border-radius: 0.5rem !important; /* rounded-lg for modern look */
    width: 3.5rem !important; /* w-14 - slightly larger */
    height: 3.5rem !important; /* h-14 - slightly larger */
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
    border-radius: 0.375rem !important; /* rounded-md */
  }
  
  /* Special styling for text-based swatch options (sizes) */
  .variant-swatch-group [role="radiogroup"] > [role="radio"] .swatch-text-option {
    border-radius: 0.375rem !important;
    font-size: 0.875rem !important; /* text-sm for better readability */
    font-weight: 600 !important; /* font-semibold */
    line-height: 1.2 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    white-space: nowrap !important;
  }
  
  /* Allow text swatches to grow wider for longer size names */
  .variant-swatch-group [role="radiogroup"] > [role="radio"] {
    width: auto !important;
    min-width: 3.5rem !important;
    max-width: 6rem !important;
  }
  
  /* Modern spacing */
  .variant-swatch-group [role="radiogroup"] {
    gap: 0.75rem !important;
  }
  
  /* Modern button radio group styling */
  .variant-button-group [role="radiogroup"] > [role="radio"],
  .variant-button-group .button-radio-group [role="radiogroup"] > [role="radio"],
  .button-radio-group.variant-button-group [role="radiogroup"] > [role="radio"] {
    border-radius: 0.5rem !important; /* rounded-lg */
    min-width: 3.5rem !important;
    width: auto !important;
    height: 3.5rem !important;
    padding: 0.5rem 1rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 0.875rem !important; /* text-sm */
    font-weight: 600 !important; /* font-semibold */
    line-height: 1.2 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    white-space: nowrap !important;
    overflow: visible !important;
    text-align: center !important;
    border: 2px solid transparent !important;
    transition: all 0.2s ease-in-out !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  .variant-button-group [role="radiogroup"] > [role="radio"]:hover,
  .variant-button-group .button-radio-group [role="radiogroup"] > [role="radio"]:hover,
  .button-radio-group.variant-button-group [role="radiogroup"] > [role="radio"]:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  }
  
  /* Modern checked state styling */
  .variant-button-group [role="radiogroup"] > [role="radio"][data-state="checked"],
  .variant-button-group .button-radio-group [role="radiogroup"] > [role="radio"][data-state="checked"],
  .button-radio-group.variant-button-group [role="radiogroup"] > [role="radio"][data-state="checked"] {
    border-color: #F92F7B !important;
    background-color: #F92F7B !important;
    color: white !important;
    box-shadow: 0 0 0 3px rgba(249, 47, 123, 0.2) !important;
  }
  
  /* Unchecked state */
  .variant-button-group [role="radiogroup"] > [role="radio"]:not([data-state="checked"]),
  .variant-button-group .button-radio-group [role="radiogroup"] > [role="radio"]:not([data-state="checked"]),
  .button-radio-group.variant-button-group [role="radiogroup"] > [role="radio"]:not([data-state="checked"]) {
    background-color: white !important;
    color: #374151 !important;
    border-color: #D1D5DB !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'product-detail-form-variant-styles';

  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');

    styleElement.id = styleId;
    styleElement.textContent = variantStyles;
    document.head.appendChild(styleElement);
  }
}
