'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { clsx } from 'clsx';
import { useActionState } from 'react';

import { newsletterSchema } from './schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export function NewsletterForm({
  action,
  className,
  emailPlaceholder = 'Email',
  namePlaceholder = 'Name',
  submitLabel = 'Subscribe',
  successMessage = 'Thanks for subscribing! We\'ll be in touch soon.',
}: {
  action: Action<{ lastResult: SubmissionResult | null; successMessage?: string }, FormData>;
  className?: string;
  emailPlaceholder?: string;
  namePlaceholder?: string;
  submitLabel?: string;
  successMessage?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, { lastResult: null });

  const [form, fields] = useForm({
    lastResult: state.lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: newsletterSchema });
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur',
  });

  if (state.successMessage) {
    return (
      <div className={clsx('text-center py-6 text-green-600 font-medium', className)}>
        {successMessage}
      </div>
    );
  }

  return (
    <form
      {...getFormProps(form)}
      action={formAction}
      className={clsx(className)}
    >
      <div className="flex flex-col space-y-5 px-2 sm:px-8">
        <div className="flex flex-col justify-center sm:flex-row gap-4">
          {fields.name && (
            <input
              {...getInputProps(fields.name, { type: 'text' })}
              className={clsx(
                'w-full sm:w-80 h-11 pl-5 pr-5 relative bg-white rounded-[10px] border-gray-200 py-1 px-1 transition-all duration-200 ease-in-out',
                'text-neutral-500 text-sm font-semibold placeholder:text-neutral-400',
                'focus:outline-none focus:ring-2 focus:ring-pink-500',
                fields.name?.errors && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              )}
              placeholder={namePlaceholder}
            />
          )}
          
          {fields.email && (
            <input
              {...getInputProps(fields.email, { type: 'email' })}
              className={clsx(
                'w-full sm:w-80 h-11 pl-5 pr-5 relative bg-white rounded-[10px] border-gray-200 py-1 px-1 transition-all duration-200 ease-in-out',
                'text-neutral-500 text-sm font-semibold placeholder:text-neutral-400',
                'focus:outline-none focus:ring-2 focus:ring-pink-500',
                fields.email?.errors && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              )}
              placeholder={emailPlaceholder}
            />
          )}
        </div>

        <button
          className={clsx(
            'rounded-[10px] bg-[#F92F7B] hover:bg-pink-600 py-1 px-1 text-center text-white text-sm font-bold leading-7 tracking-wide transition duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          disabled={isPending}
          type="submit"
        >
          {isPending ? 'Subscribing...' : submitLabel}
        </button>

        {fields.name?.errors && (
          <p className="text-red-500 text-center">{fields.name.errors[0]}</p>
        )}
        {fields.email?.errors && (
          <p className="text-red-500 text-center">{fields.email.errors[0]}</p>
        )}
      </div>
    </form>
  );
} 