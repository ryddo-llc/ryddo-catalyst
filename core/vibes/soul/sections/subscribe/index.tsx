import { SubmissionResult } from '@conform-to/react';

import { NewsletterForm } from '@/vibes/soul/primitives/newsletter-form';
import { Image } from '~/components/image';
import { useIsDesktop } from '~/lib/use-is-desktop';

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
  const isDesktop = useIsDesktop();
  const sectionStyle = image
    ? {
        backgroundImage: `url(${image.src})`,
        ...(isDesktop ? { backgroundAttachment: 'fixed' } : {}),
      }
    : undefined;

  return (
    <section
      className={`w-full h-[60vh] overflow-hidden relative flex items-center bg-cover bg-center ${image ? '' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}
      style={sectionStyle}
    >
      {/* Content Container */}
      <div className="flex flex-col justify-center w-full max-w-lg min-h-[300px] max-h-[350px] pb-8 relative rounded-[10px] mx-4 sm:mx-auto overflow-hidden shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.30)]">
        {/* Form Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            alt="Newsletter form background"
            aria-hidden="true"
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
        <div aria-label="Newsletter subscription" className="relative z-1 flex flex-col items-center justify-center px-4 py-4 font-['Nunito']" role="region">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-[48px] text-gray-800 mb-2" id="newsletter-title">
              {title}
              <span className="text-[#F92F7B] w-5 h-24 text-6xl font-bold">
                .
              </span>
            </h2>
            <p className="pb-5 text-center justify-center text-neutral-500 text-sm font-semibold leading-loose">
              {description}
            </p>
          </div>

          <div className="w-full flex items-center justify-center">
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
