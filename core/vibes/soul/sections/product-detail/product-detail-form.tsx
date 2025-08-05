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
    variantNames.some(name => field.name.toLowerCase().includes(name))
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
}

export function ProductDetailForm<F extends Field>({
  action,
  fields,
  productId,
  ctaLabel = 'Add to cart',
  quantityLabel = 'Quantity', // eslint-disable-line @typescript-eslint/no-unused-vars
  incrementLabel = 'Increase quantity', // eslint-disable-line @typescript-eslint/no-unused-vars
  decrementLabel = 'Decrease quantity', // eslint-disable-line @typescript-eslint/no-unused-vars
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
      <form {...getFormProps(form)} action={formAction} className="py-8">
        <input name="id" type="hidden" value={productId} />
        <div className="space-y-6">
          {/* Regular fields (non-variant) */}
          {fields
            .filter((field) => !isVariantField(field))
            .map((field) => {
              return (
                <FormField
                  emptySelectPlaceholder={emptySelectPlaceholder}
                  field={field}
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  formField={formFields[field.name]!}
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  key={formFields[field.name]!.id}
                  onPrefetch={onPrefetch}
                />
              );
            })}
          
          {/* Variant fields at the bottom */}
          {fields.filter((field) => isVariantField(field)).length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {fields
                .filter((field) => isVariantField(field))
                .map((field) => {
                  return (
                    <FormField
                      emptySelectPlaceholder={emptySelectPlaceholder}
                      field={field}
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      formField={formFields[field.name]!}
                      isVariant={true}
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      key={formFields[field.name]!.id}
                      onPrefetch={onPrefetch}
                    />
                  );
                })}
            </div>
          )}
          {form.errors?.map((error, index) => (
            <FormStatus className="pt-3" key={index} type="error">
              {error}
            </FormStatus>
          ))}
          <div className="flex items-center gap-x-6 pt-3">
            {/* Hidden quantity input with default value of 1 */}
            <input
              name={formFields.quantity.name}
              type="hidden"
              value="1"
            />
            {price ? (
              <span className="text-4xl font-black text-gray-900 @xl:text-5xl" style={{ fontFamily: 'Nunito' }}>
                {renderPrice(price)}
              </span>
            ) : null}
            <SubmitButton disabled={ctaDisabled}>{ctaLabel}</SubmitButton>
            {additionalActions}
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
      className="w-auto text-white @xl:w-32"
      disabled={disabled}
      loading={pending}
      size="small"
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

      void setParams({ [field.name]: fieldValue || null }); // Passing `null` to remove the value from the query params if fieldValue is falsey

      controls.change(fieldValue ?? ''); // If fieldValue is falsey, we set it to an empty string
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

// Add custom styles for square variant styling
const variantStyles = `
  /* Swatch radio group styling for colors and sizes */
  .variant-swatch-group [role="radiogroup"] > [role="radio"] {
    border-radius: 0.375rem !important; /* rounded-md instead of rounded-full */
    width: 3rem !important; /* w-12 */
    height: 3rem !important; /* h-12 */
    min-width: 3rem !important; /* Minimum width */
  }
  
  .variant-swatch-group [role="radiogroup"] > [role="radio"] > span {
    border-radius: 0.25rem !important; /* rounded instead of rounded-full */
  }
  
  /* Special styling for text-based swatch options (sizes) */
  .variant-swatch-group [role="radiogroup"] > [role="radio"] .swatch-text-option {
    border-radius: 0.25rem !important; /* rounded instead of rounded-full */
    font-size: 0.75rem !important; /* text-xs */
    font-weight: 700 !important; /* font-bold */
    line-height: 1.1 !important; /* tight line height */
    text-transform: uppercase !important;
    letter-spacing: 0.025em !important;
    white-space: nowrap !important;
  }
  
  /* Allow text swatches to grow wider for longer size names while keeping consistent height */
  .variant-swatch-group [role="radiogroup"] > [role="radio"] {
    width: auto !important;
    min-width: 3rem !important;
    max-width: 5rem !important; /* Limit maximum width for text options */
  }
  
  /* Ensure proper spacing and alignment */
  .variant-swatch-group [role="radiogroup"] {
    gap: 0.5rem !important; /* Add some spacing between swatches */
  }
  
  /* Button radio group styling for sizes - multiple selector patterns to ensure coverage */
  .variant-button-group [role="radiogroup"] > [role="radio"],
  .variant-button-group .button-radio-group [role="radiogroup"] > [role="radio"],
  .button-radio-group.variant-button-group [role="radiogroup"] > [role="radio"] {
    border-radius: 0.375rem !important; /* rounded-md instead of rounded-full */
    min-width: 3rem !important; /* Minimum width for small sizes */
    width: auto !important; /* Allow width to grow for longer text */
    height: 3rem !important; /* h-12 */
    padding: 0.25rem 0.5rem !important; /* Horizontal padding for text */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 0.875rem !important; /* text-sm for better readability */
    font-weight: 600 !important; /* font-semibold for better visibility */
    line-height: 1.2 !important; /* Better line height for readability */
    text-transform: uppercase !important; /* Uppercase for better visibility */
    letter-spacing: 0.025em !important; /* Slight letter spacing */
    white-space: nowrap !important; /* Prevent text wrapping */
    overflow: visible !important; /* Ensure text is not cut off */
    color: inherit !important; /* Ensure text color is inherited properly */
    text-align: center !important; /* Center the text */
  }
  
  /* Ensure text is visible in both checked and unchecked states */
  .variant-button-group [role="radiogroup"] > [role="radio"]:not([data-state="checked"]),
  .variant-button-group .button-radio-group [role="radiogroup"] > [role="radio"]:not([data-state="checked"]),
  .button-radio-group.variant-button-group [role="radiogroup"] > [role="radio"]:not([data-state="checked"]) {
    color: var(--button-radio-group-light-unchecked-text, hsl(var(--foreground))) !important;
  }
  
  .variant-button-group [role="radiogroup"] > [role="radio"][data-state="checked"],
  .variant-button-group .button-radio-group [role="radiogroup"] > [role="radio"][data-state="checked"],
  .button-radio-group.variant-button-group [role="radiogroup"] > [role="radio"][data-state="checked"] {
    color: var(--button-radio-group-light-checked-text, hsl(var(--background))) !important;
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
