import { clsx } from 'clsx';

export interface Quote {
  text: string;
  author: string;
}

export interface TestimonialQuoteProps {
  className?: string;
  'aria-labelledby'?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * TestimonialQuote component displays a customer testimonial or quote
 * with attribution in an attractive overlay design.
 *
 * This component supports various CSS variables for theming:
 *
 * ```css
 * :root {
 *   --font-family-body: Inter, sans-serif;
 * }
 * ```
 */
export function TestimonialQuote({
  'aria-labelledby': ariaLabelledBy = 'testimonial-quote',
  className,
}: TestimonialQuoteProps) {
  return (
    <div
      className={clsx(
        'mb-8 px-8 py-12 text-center md:mb-10 md:px-12 md:py-16 lg:mb-12 lg:px-16 lg:py-20',
        className,
      )}
    >
      <blockquote className="mx-auto max-w-4xl">
        <p
          className="font-[family-name:var(--font-family-body)] text-2xl font-extrabold italic text-white md:text-3xl lg:text-4xl"
          id={ariaLabelledBy}
        >
          <span className="bg-[rgb(219,64,117)] px-2 py-1">&ldquo;Ryddo is</span>
          {' doing what the '}
          <span className="bg-[rgb(219,64,117)] px-2 py-1">industry</span>
          {' has'}
          <br />
          {'needed '}
          <span className="bg-[rgb(219,64,117)] px-2 py-1">for years.&rdquo;</span>
        </p>
        <footer className="mt-3">
          <cite className="font-[family-name:var(--font-family-body)] text-3xl font-light italic text-white/80 md:text-2xl">
            Cargocycle
          </cite>
        </footer>
      </blockquote>
    </div>
  );
}
