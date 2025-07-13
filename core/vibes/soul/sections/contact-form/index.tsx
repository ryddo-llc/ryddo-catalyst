'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { clsx } from 'clsx';
import { useActionState } from 'react';
import { FiPhoneCall } from "react-icons/fi";
import { LuMailOpen } from "react-icons/lu";

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { SelectField } from '@/vibes/soul/form/select-field';
import { Button } from '@/vibes/soul/primitives/button';

import { contactFormSchema } from './schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

interface ContactFormProps {
  action: Action<{ lastResult: SubmissionResult | null; successMessage?: string }, FormData>;
  className?: string;
  contactPhone?: string;
  contactEmail?: string;
  emailLabel?: string;
  howDidYouFindUsLabel?: string;
  nameLabel?: string;
  phoneLabel?: string;
  submitLabel?: string;
  successMessage?: string;
}

export function ContactForm({
  action,
  className,
  contactPhone = '(323) 676-7433',
  contactEmail = 'info@ryddo.com',
  nameLabel = 'Name *',
  emailLabel = 'Email *',
  phoneLabel = 'Phone Number',
  howDidYouFindUsLabel = 'How did you find us?',
  submitLabel = 'Send',
  successMessage = 'Thanks! We\'ve received your information and will be in touch soon.',
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(action, { lastResult: null });

  const [form, fields] = useForm({
    lastResult: state.lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: contactFormSchema });
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur',
  });

  const howDidYouFindUsOptions = [
    { label: 'Google Search', value: 'google' },
    { label: 'Social Media', value: 'social' },
    { label: 'Friend/Referral', value: 'referral' },
    { label: 'Advertisement', value: 'advertisement' },
    { label: 'Other', value: 'other' },
  ];

  if (state.successMessage) {
    return (
      <div className={clsx('text-center py-8 text-green-600 font-medium', className)}>
        {state.successMessage}
      </div>
    );
  }

  return (
    <form
      {...getFormProps(form)}
      action={formAction}
      className={clsx('space-y-6', className)}
    >
      <Input
        {...getInputProps(fields.name, { type: 'text' })}
        errors={fields.name.errors}
        key={fields.name.id}
        placeholder={nameLabel}
        required
      />
      
      <Input
        {...getInputProps(fields.email, { type: 'email' })}
        errors={fields.email.errors}
        key={fields.email.id}
        placeholder={emailLabel}
        required
      />
      
      <Input
        {...getInputProps(fields.phone, { type: 'tel' })}
        errors={fields.phone.errors}
        key={fields.phone.id}
        placeholder={phoneLabel}
      />
      
      <SelectField
        errors={fields.howDidYouFindUs.errors}
        label=""
        name={fields.howDidYouFindUs.name}
        options={howDidYouFindUsOptions}
        placeholder={howDidYouFindUsLabel}
        value=""
      />

      <Button
        className="w-full bg-[#F92F7B] hover:bg-pink-600 text-white after:hidden"
        disabled={isPending}
        shape="rounded"
        size="large"
        type="submit"
      >
        {isPending ? 'Sending...' : submitLabel}
      </Button>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center h-12">
            <FiPhoneCall className="w-7 h-7 text-gray-700"/>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700 text-sm">PHONE</span>
            <span className="text-pink-500 font-medium text-base">{contactPhone}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center h-12">
            <LuMailOpen className="w-7 h-7 text-gray-700"/>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700 text-sm">EMAIL</span>
            <span className="text-pink-500 font-medium text-base">{contactEmail}</span>
          </div>
        </div>
      </div>

      {form.errors?.map((error, index) => (
        <FormStatus key={index} type="error">
          {error}
        </FormStatus>
      ))}
    </form>
  );
} 