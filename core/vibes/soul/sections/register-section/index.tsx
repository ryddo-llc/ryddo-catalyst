'use client';

import {
  FieldMetadata,
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { ReactNode, startTransition, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { ButtonRadioGroup } from '@/vibes/soul/form/button-radio-group';
import { CardRadioGroup } from '@/vibes/soul/form/card-radio-group';
import { Checkbox } from '@/vibes/soul/form/checkbox';
import { CheckboxGroup } from '@/vibes/soul/form/checkbox-group';
import { DatePicker } from '@/vibes/soul/form/date-picker';
import { DynamicFormAction } from '@/vibes/soul/form/dynamic-form';
import { Field, FieldGroup, schema } from '@/vibes/soul/form/dynamic-form/schema';
import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { NumberInput } from '@/vibes/soul/form/number-input';
import { RadioGroup } from '@/vibes/soul/form/radio-group';
import { SelectField } from '@/vibes/soul/form/select-field';
import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Textarea } from '@/vibes/soul/form/textarea';
import { Link } from '~/components/link';

interface Props<F extends Field> {
  title?: string;
  subtitle?: string;
  action: DynamicFormAction<F>;
  fields: Array<F | FieldGroup<F>>;
  submitLabel?: string;
  className?: string;
  loginHref?: string;
  loginLabel?: string;
}

export function RegisterSection<F extends Field>({
  className,
  title = 'Create Account',
  subtitle,
  fields,
  submitLabel = 'Create Account',
  action,
  loginHref = '/login',
  loginLabel = 'Already have an account? Sign in',
}: Props<F>) {
  return (
    <div className={clsx('@container relative overflow-hidden', className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-[#F92F7B]" />
        <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-[#F92F7B]" />
        <div className="absolute top-1/2 right-1/3 h-16 w-16 rounded-full bg-[#F92F7B]" />
      </div>
      
      <div className="relative flex flex-col justify-center gap-y-12 px-3 py-10 @xl:flex-row @xl:gap-x-12 @xl:px-6 @4xl:py-20 @5xl:px-20">
        {/* Registration Form Card */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5 p-8 @xl:max-w-2xl">
          {/* Decorative elements */}
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#F92F7B]/20" />
          <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-[#F92F7B]/15" />
          
          <div className="relative">
            <h1 className="mb-2 font-[family-name:var(--register-title-font-family,var(--font-family-heading))] text-3xl font-extrabold leading-none text-[var(--register-title,hsl(var(--foreground)))] @xl:text-4xl">
              {title}
              <span className="ml-2 text-4xl text-[#F92F7B] @xl:text-5xl">.</span>
            </h1>
            
            {subtitle != null && subtitle !== '' && (
              <p className="mb-8 text-base font-light leading-none text-[var(--register-subtitle,hsl(var(--contrast-500)))] @xl:text-lg">
                {subtitle}
              </p>
            )}
            
            <RegisterForm action={action} fields={fields} submitLabel={submitLabel} />
            
            <div className="mt-6 text-center">
              <Link className="group/underline focus:outline-none" href={loginHref}>
                <span className="block w-fit text-sm font-semibold text-[var(--register-link,hsl(var(--contrast-500)))] hover:text-[#F92F7B] transition-colors">
                  {loginLabel}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="flex w-full flex-col @xl:max-w-md">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5 p-8">
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#F92F7B]/20" />
            <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-[#F92F7B]/15" />
            
            <h2 className="mb-6 font-[family-name:var(--register-benefits-title-font-family,var(--font-family-heading))] text-3xl font-extrabold leading-none text-[var(--register-benefits-title,hsl(var(--foreground)))] @xl:text-4xl">
              Join Ryddo
              <span className="ml-2 text-4xl text-[#F92F7B] @xl:text-5xl">.</span>
            </h2>
            <div className="text-[var(--register-benefits-description,hsl(var(--contrast-500)))]">
              <p className="mb-6 text-base font-medium">Unlock exclusive benefits when you create your account:</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Fast & secure checkout process</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Multiple shipping addresses</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Complete order history & tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Personalized wishlists</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Exclusive member offers & updates</span>
                </li>
              </ul>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--register-security-text,hsl(var(--contrast-400)))]">
                  🔒 Your information is secure and protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm<F extends Field>({
  action,
  fields: defaultFields,
  submitLabel = 'Create Account',
}: {
  action: DynamicFormAction<F>;
  fields: Array<F | FieldGroup<F>>;
  submitLabel?: string;
}) {
  const [{ lastResult, fields }, formAction] = useActionState(action, {
    fields: defaultFields,
    lastResult: null,
  });
  const dynamicSchema = schema(fields);
  const defaultValue = fields
    .flatMap((f) => (Array.isArray(f) ? f : [f]))
    .reduce<z.infer<typeof dynamicSchema>>(
      (acc, field) => ({
        ...acc,
        [field.name]: 'defaultValue' in field ? field.defaultValue : '',
      }),
      {},
    );
  const [form, formFields] = useForm({
    lastResult,
    constraint: getZodConstraint(dynamicSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: dynamicSchema });
    },
    defaultValue,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(() => {
        formAction(formData);
      });
    },
  });

  return (
    <FormProvider context={form.context}>
      <form {...getFormProps(form)} action={formAction}>
        <div className="space-y-6">
          {fields.map((field, index) => {
            if (Array.isArray(field)) {
              return (
                <div className="flex gap-4" key={index}>
                  {field.map((f) => {
                    const groupFormField = formFields[f.name];

                    if (!groupFormField) return null;

                    return (
                      <RegisterFormField
                        field={f}
                        formField={groupFormField}
                        key={groupFormField.id}
                      />
                    );
                  })}
                </div>
              );
            }

            const formField = formFields[field.name];

            if (formField == null) return null;

            return <RegisterFormField field={field} formField={formField} key={formField.id} />;
          })}
          <div className="pt-3">
            <ModernSubmitButton>{submitLabel}</ModernSubmitButton>
          </div>
          {form.errors?.map((error, index) => (
            <FormStatus key={index} type="error">
              {error}
            </FormStatus>
          ))}
        </div>
      </form>
    </FormProvider>
  );
}

function ModernSubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex w-full justify-center items-center bg-[#F92F7B] shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.12)] px-6 py-4 rounded-[50px] min-h-[48px] text-base font-bold font-['Inter'] leading-normal tracking-wide text-white hover:bg-[#d41f63] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Creating Account...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// eslint-disable-next-line complexity
function RegisterFormField({
  field,
  formField,
}: {
  field: Field;
  formField: FieldMetadata<string | string[] | number | boolean | Date | undefined>;
}) {
  const controls = useInputControl(formField);

  switch (field.type) {
    case 'number':
      return (
        <NumberInput
          {...getInputProps(formField, { type: 'number' })}
          decrementLabel={field.decrementLabel}
          errors={formField.errors}
          incrementLabel={field.incrementLabel}
          key={field.name}
          label={field.label}
        />
      );

    case 'text':
      return (
        <Input
          {...getInputProps(formField, { type: 'text' })}
          errors={formField.errors}
          key={field.name}
          label={field.label}
        />
      );

    case 'textarea':
      return (
        <Textarea
          {...getInputProps(formField, { type: 'text' })}
          errors={formField.errors}
          key={field.name}
          label={field.label}
        />
      );

    case 'password':
    case 'confirm-password':
      return (
        <Input
          {...getInputProps(formField, { type: 'password' })}
          errors={formField.errors}
          key={field.name}
          label={field.label}
        />
      );

    case 'email':
      return (
        <Input
          {...getInputProps(formField, { type: 'email' })}
          errors={formField.errors}
          key={field.name}
          label={field.label}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          errors={formField.errors}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onCheckedChange={(value) => controls.change(String(value))}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value}
        />
      );

    case 'checkbox-group':
      return (
        <CheckboxGroup
          errors={formField.errors}
          key={field.name}
          label={field.label}
          name={formField.name}
          onValueChange={controls.change}
          options={field.options}
          value={Array.isArray(controls.value) ? controls.value : []}
        />
      );

    case 'select':
      return (
        <SelectField
          errors={formField.errors}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'radio-group':
      return (
        <RadioGroup
          errors={formField.errors}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'swatch-radio-group':
      return (
        <SwatchRadioGroup
          errors={formField.errors}
          id={formField.id}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'card-radio-group':
      return (
        <CardRadioGroup
          errors={formField.errors}
          id={formField.id}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'button-radio-group':
      return (
        <ButtonRadioGroup
          errors={formField.errors}
          id={formField.id}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'date':
      return (
        <DatePicker
          disabledDays={
            field.minDate != null && field.maxDate != null
              ? {
                  before: new Date(field.minDate),
                  after: new Date(field.maxDate),
                }
              : undefined
          }
          errors={formField.errors}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onSelect={(date) =>
            controls.change(date ? Intl.DateTimeFormat().format(date) : undefined)
          }
          required={formField.required}
          selected={typeof controls.value === 'string' ? new Date(controls.value) : undefined}
        />
      );
  }
}