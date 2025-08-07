'use client';

import {
  FormProvider,
  FormStateInput,
  getFormProps,
  SubmissionResult,
  useForm,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { parseAsString, useQueryStates } from 'nuqs';
import React, { ReactNode, startTransition, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { Button } from '@/vibes/soul/primitives/button';
import { Price } from '@/vibes/soul/primitives/price-label';
import { toast } from '@/vibes/soul/primitives/toaster';
import { useEvents } from '~/components/analytics/events';
import { useRouter } from '~/i18n/routing';

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

// Helper function to check if required variant fields have values
const hasRequiredVariantFieldErrors = (
  fields: Field[],
  params: Record<string, string | null>
): boolean => {
  return fields
    .filter((field) => isVariantField(field) && field.required)
    .some((field) => {
      const value = params[field.name];

      return !value || value === '';
    });
};

type Action<S, P> = (state: Awaited<S>, payload: P) => S | Promise<S>;

interface State<F extends Field> {
  fields: F[];
  lastResult: SubmissionResult | null;
  successMessage?: ReactNode;
}

export type ProductDetailFormAction<F extends Field> = Action<State<F>, FormData>;

export interface PurchaseSectionProps<F extends Field> {
  fields: F[];
  action: ProductDetailFormAction<F>;
  productId: string;
  price?: Price | null;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  additionalActions?: ReactNode;
}

export function PurchaseSection<F extends Field>({
  fields,
  action,
  productId,
  price,
  ctaLabel = 'Add to cart',
  ctaDisabled = false,
  additionalActions,
}: PurchaseSectionProps<F>) {
  const router = useRouter();
  const events = useEvents();

  // Get search params for variant fields only
  const variantFields = fields.filter(isVariantField);
  const searchParams = variantFields.reduce<Record<string, typeof parseAsString>>((acc, field) => {
    return field.persist === true ? { ...acc, [field.name]: parseAsString } : acc;
  }, {});

  const [params] = useQueryStates(searchParams, { shallow: false });

  const defaultValue = variantFields.reduce<{
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
      <form {...getFormProps(form)} action={formAction}>
        <input name="id" type="hidden" value={productId} />

        {/* Hidden inputs for variant fields */}
        {variantFields.map((field) => (
          <input
            key={`${field.name}-hidden`}
            name={field.name}
            type="hidden"
            value={params[field.name] ?? field.defaultValue ?? ''}
          />
        ))}

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
            disabled={ctaDisabled || hasRequiredVariantFieldErrors(variantFields, params)}
          >
            {ctaLabel}
          </SubmitButton>
          {additionalActions}
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
      size="medium"
      type="submit"
    >
      {children}
    </Button>
  );
}