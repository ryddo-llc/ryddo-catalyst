import { clsx } from 'clsx';

import { Image } from '~/components/image';

import { HowItWorks, type Step } from './how-it-works';
import { TestimonialQuote } from './testimonial-quote';
import { type RolloutCard, TheRollout } from './the-rollout';

export interface ProcessSectionProps {
  // How It Works
  howItWorksTitle: string;
  steps: Step[];

  // The Rollout
  rolloutTitle: string;
  rolloutSubtitle: string;
  rolloutCards: RolloutCard[];

  imageUrl?: string;
  className?: string;
  'aria-labelledby'?: string;
}

// Re-export types for convenience
export type { Step, RolloutCard };

// eslint-disable-next-line valid-jsdoc
/**
 * ProcessSection component displays Ryddo's ordering process, testimonials,
 * and rollout timeline with interactive step navigation and informational cards.
 *
 * This component is composed of three sub-components:
 * - HowItWorks: Interactive step-by-step process guide
 * - TestimonialQuote: Customer testimonial display
 * - TheRollout: Timeline of service rollout with cards
 *
 * This component supports various CSS variables for theming:
 *
 * ```css
 * :root {
 *   --process-section-font-family: var(--font-family-body);
 *   --process-section-title-font-family: var(--font-family-heading);
 *   --process-section-title: hsl(var(--foreground));
 *   --process-section-description: hsl(var(--contrast-500));
 * }
 * ```
 */
export function ProcessSection({
  'aria-labelledby': ariaLabelledBy = 'process-section',
  howItWorksTitle,
  steps,
  rolloutTitle,
  rolloutSubtitle,
  rolloutCards,
  imageUrl,
  className,
}: ProcessSectionProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={clsx(
        'relative w-full bg-blue-100 pb-8 pt-16 font-[family-name:var(--process-section-font-family,var(--font-family-body))] @container md:pb-12 md:pt-24 lg:pb-16 lg:pt-32',
        className,
      )}
    >
      {/* Background Image - Below the fold, lazy loaded */}
      {imageUrl != null && imageUrl !== '' ? (
        <div className="absolute inset-0 left-1/2 w-screen -translate-x-1/2">
          <Image
            alt=""
            className="object-cover"
            fill
            loading="lazy"
            preload={false}
            quality={90}
            sizes="100vw"
            src={imageUrl}
          />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-8 @xl:px-12 @4xl:px-16">
        {/* HOW IT WORKS SECTION */}
        <HowItWorks aria-labelledby={ariaLabelledBy} steps={steps} title={howItWorksTitle} />

        {/* QUOTE SECTION */}
        <TestimonialQuote />

        {/* THE ROLLOUT SECTION */}
        <TheRollout cards={rolloutCards} subtitle={rolloutSubtitle} title={rolloutTitle} />
      </div>
    </section>
  );
}
