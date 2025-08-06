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
import { ReactNode, startTransition, useActionState, useCallback, useEffect } from 'react';
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

// Helper function to identify variant fields (color/size)
const isVariantField = (field: Field): boolean => {
  const variantTypes = ['swatch-radio-group', 'button-radio-group', 'card-radio-group'];
  const variantNames = ['color', 'colour', 'size', 'variant'];

  return (
    variantTypes.includes(field.type) ||
    variantNames.some((name) => field.name.toLowerCase().includes(name))
  );
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
  // New prop to allow external rendering of variants
  renderVariantsExternally?: boolean;
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

  const [params] = useQueryStates(searchParams, { shallow: false });

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

  return (
    <FormProvider context={form.context}>
      <FormStateInput />
      <form {...getFormProps(form)} action={formAction} className="space-y-8">
        <input name="id" type="hidden" value={productId} />

        {/* Price Display */}
        {price ? (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Price
              </span>
              <span
                className="text-3xl font-black text-gray-900 @xl:text-4xl"
                style={{ fontFamily: 'Nunito' }}
              >
                {renderPrice(price)}
              </span>
            </div>
          </div>
        ) : null}

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

        {/* Variant fields - hidden inputs only for form submission */}
        {fields
          .filter((field) => isVariantField(field))
          .map((field) => (
            <input
              key={formFields[field.name]?.id}
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

        {/* Add to Cart Section */}
        <div className="rounded-lg bg-white/90 p-6 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm">
          {/* Hidden quantity input with default value of 1 */}
          <input name={formFields.quantity.name} type="hidden" value="1" />

          <div className="flex flex-col gap-4 @sm:flex-row @sm:items-center @sm:justify-between">
            <div className="flex items-center gap-4">
              <SubmitButton disabled={ctaDisabled}>{ctaLabel}</SubmitButton>
              {additionalActions}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function SubmitButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="flex-1 bg-[#F92F7B] text-white hover:bg-[#e01b5f] focus:ring-2 focus:ring-[#F92F7B] focus:ring-offset-2 disabled:bg-gray-300 @sm:min-w-[200px] @sm:flex-none"
      disabled={disabled}
      loading={pending}
      size="large"
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
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: false }) } : {},
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

// Standalone Variant Selector Component for Specifications Section
export interface ProductVariantSelectorProps {
  fields: Field[];
  formFields: Record<string, FieldMetadata<string | number | boolean | Date | undefined>>;
  onPrefetch: (fieldName: string, value: string) => void;
  emptySelectPlaceholder?: string;
}

export function ProductVariantSelector({
  fields,
  formFields,
  onPrefetch,
  emptySelectPlaceholder,
}: ProductVariantSelectorProps) {
  const variantFields = fields.filter((field) => isVariantField(field));

  if (variantFields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Available Options</h3>
      <div className="grid gap-6 @md:grid-cols-2">
        {variantFields.map((field) => {
          const formField = formFields[field.name];

          if (!formField) return null;

          return (
            <div className="space-y-3" key={formField.id}>
              <FormField
                emptySelectPlaceholder={emptySelectPlaceholder}
                field={field}
                formField={formField}
                isVariant={true}
                onPrefetch={onPrefetch}
              />
            </div>
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
