import { clsx } from 'clsx';

import { Image } from '~/components/image';

export interface LegitBrandsProps {
  title: {
    line1: string;
    line2: string;
    line2Highlight: string;
    line3: string;
    line4: string;
    line5: string;
  };
  description: { line1: string; line2: string; line3: string };
  linkText: {
    highlight: string;
    rest: string;
  };
  imageUrl: string;
  imageAlt: string;
  className?: string;
  'aria-labelledby'?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * LegitBrands component showcases Ryddo's premium brand partnerships
 * with a split layout featuring text content and an image.
 *
 * This component supports various CSS variables for theming:
 *
 * ```css
 * :root {
 *   --legit-brands-font-family: var(--font-family-body);
 *   --legit-brands-title-font-family: var(--font-family-heading);
 *   --legit-brands-title: hsl(var(--foreground));
 *   --legit-brands-description: hsl(var(--contrast-500));
 * }
 * ```
 */
export function LegitBrands({
  'aria-labelledby': ariaLabelledBy = 'legit-brands',
  title,
  description,
  linkText,
  imageUrl,
  imageAlt,
  className,
}: LegitBrandsProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={clsx(
        'w-full bg-white pb-8 pt-0 font-[family-name:var(--legit-brands-font-family,var(--font-family-body))] @container md:pb-12 md:pt-0 lg:pb-16 lg:pt-0',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 @xl:px-6 @4xl:px-8">
        <div className="overflow-hidden rounded-[30px] border-y-[30px] border-white bg-white">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Text Content (40%) */}
            <div className="flex flex-col justify-start pb-8 pl-8 pr-4 pt-8 md:pb-12 md:pl-12 md:pr-6 md:pt-12 lg:w-2/5 lg:pb-16 lg:pl-16 lg:pr-8 lg:pt-16">
              <h2
                className="mb-6 font-[family-name:var(--font-family-body)] text-7xl font-extrabold leading-tight text-[var(--legit-brands-title,hsl(var(--foreground)))]"
                id={ariaLabelledBy}
              >
                <span className="block">{title.line1}</span>
                <span className="block">
                  {title.line2} <span className="text-yellow-400">{title.line2Highlight}</span>
                </span>
                <span className="block">{title.line3}</span>
                <span className="block">{title.line4}</span>
                <span className="block">{title.line5}</span>
              </h2>
              <p className="mb-6 font-[family-name:var(--font-family-body)] text-xl font-medium text-gray-400">
                <span className="block">{description.line1}</span>
                <span className="block">{description.line2}</span>
                <span className="block">{description.line3}</span>
              </p>
              <p className="font-[family-name:var(--font-family-body)] text-base text-gray-600 md:text-base">
                <span className="text-[rgb(219,64,117)] underline">{linkText.highlight}</span>{' '}
                {linkText.rest}
              </p>
            </div>

            {/* Right Side - Image (60%) */}
            <div className="relative rounded-[30px] bg-slate-400 lg:w-3/5">
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
                <Image
                  alt={imageAlt}
                  className="rounded-[30px] object-cover p-8 md:p-12 lg:p-16"
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={imageUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
