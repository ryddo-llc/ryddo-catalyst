import { clsx } from 'clsx';

interface HighlightSegment {
  text: string;
  highlight?: boolean;
  lineBreakAfter?: boolean;
}

export interface Quote {
  segments: HighlightSegment[];
  author: string;
}

export interface TestimonialQuoteProps {
  quote: Quote;
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
  quote,
  className,
}: TestimonialQuoteProps) {
  return (
    <div
      className={clsx(
        'mb-8 px-8 py-8 text-center md:mb-10 md:px-12 md:py-12 lg:mb-12 lg:px-16 lg:py-16',
        className,
      )}
    >
      <blockquote className="mx-auto max-w-4xl">
        <p
          className="font-[family-name:var(--font-family-body)] text-2xl font-extrabold italic text-white md:text-3xl lg:text-4xl"
          id={ariaLabelledBy}
        >
          {quote.segments.map((segment, index) => {
            const node = segment.highlight ? (
              <span className="relative inline-block" key={index}>
                <span className="absolute bottom-[15%] left-[1%] right-[-2%] top-[15%] bg-[rgb(219,64,117)]" />
                <span className="relative px-1">{segment.text}</span>
              </span>
            ) : (
              <span key={index}>{segment.text}</span>
            );

            return segment.lineBreakAfter ? (
              <span key={index}>
                {node}
                <br />
              </span>
            ) : node;
          })}
        </p>
        <footer>
          <cite className="font-[family-name:var(--font-family-body)] text-3xl font-light italic text-white/80 md:text-2xl">
            {quote.author}
          </cite>
        </footer>
      </blockquote>
    </div>
  );
}
