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
    <section className="w-full min-h-[70vh] md:min-h-[50vh] overflow-hidden relative flex items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background Image Container */}
      {image && (
        <div className="absolute inset-0 w-full h-full">
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes="100vw"
            src={image.src}
            style={{
              objectPosition: 'center 40%',
            }}
            priority
          />
        </div>
      )}

      {/* Content Container */}
      <div className="w-full max-w-3xl pb-8 relative rounded-[10px] mx-4 md:mx-auto overflow-hidden shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.30)]">
        {/* Form Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            alt="Newsletter form background"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            src="/images/backgrounds/newsletterform.png"
            style={{
              objectPosition: 'center',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-4 pt-12 pb-12 md:p-10 md:pt-14 md:pb-14">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-[48px] text-gray-800 mb-2">
              {title}
              <span className="text-[#F92F7B] w-5 h-24 text-7xl font-bold">
                .
              </span>
            </h2>
            <p className="pb-5 text-center justify-center text-neutral-500 text-base font-semibold leading-loose">
              {description}
            </p>
          </div>

          <div className="w-full flex items-center justify-center">
            <NewsletterForm 
              action={action} 
              className="w-full" 
              namePlaceholder={namePlaceholder}
              emailPlaceholder={emailPlaceholder}
              submitLabel={submitLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
