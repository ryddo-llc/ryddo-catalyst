'use client';

import { SubmissionResult } from '@conform-to/react';

import { NewsletterForm } from '@/vibes/soul/primitives/newsletter-form';
import { Image } from '~/components/image';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export function Subscribe({
  action,
  description,
  emailPlaceholder,
  image,
  namePlaceholder,
  submitLabel,
  title,
}: {
  action: Action<{ lastResult: SubmissionResult | null; successMessage?: string }, FormData>;
  description?: string;
  emailPlaceholder?: string;
  image?: { src: string; alt: string };
  namePlaceholder?: string;
  submitLabel?: string;
  title: string;
}) {
  return (
    <section
      className={`relative flex h-[60vh] w-full items-center justify-center overflow-hidden ${!image ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : ''}`}
    >
      {/* Optimized Parallax Background */}
      {image && (
        <div className="absolute inset-0 h-full w-full">
          <Image
            alt={image.alt}
            aria-hidden="true"
            className="object-cover"
            fill
            loading="lazy"
            priority={false}
            quality={80}
            sizes="100vw"
            src={image.src}
            style={{
              objectPosition: 'center',
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 mx-4 flex max-h-[350px] min-h-[300px] w-full max-w-lg flex-col justify-center overflow-hidden rounded-[10px] pb-8 shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.30)] sm:mx-auto">
        {/* Form Background Image */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            alt="Newsletter form background"
            aria-hidden="true"
            className="object-cover"
            fill
            loading="lazy"
            priority={false}
            sizes="(max-width: 768px) 100vw, 768px"
            src="/images/backgrounds/newsletter-form.webp"
            style={{
              objectPosition: 'center',
            }}
          />
        </div>

        {/* Content */}
        <div
          aria-label="Newsletter subscription"
          className="relative z-[1] flex flex-col items-center justify-center px-4 py-4 font-['Nunito']"
          role="region"
        >
          <div className="mb-6 text-center">
            <h2
              className="mb-2 text-3xl font-extrabold leading-[48px] text-gray-800 md:text-4xl"
              id="newsletter-title"
            >
              {title}
              <span className="h-24 w-5 text-6xl font-bold text-[#F92F7B]">.</span>
            </h2>
            <p className="justify-center pb-5 text-center text-sm font-semibold leading-loose text-neutral-500">
              {description}
            </p>
          </div>

          <div className="flex w-full items-center justify-center">
            <NewsletterForm
              action={action}
              className="w-full"
              emailPlaceholder={emailPlaceholder}
              namePlaceholder={namePlaceholder}
              submitLabel={submitLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
