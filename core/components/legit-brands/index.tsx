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
  description: string;
  linkText: {
    highlight: string;
    rest: string;
  };
  imageUrl: string;
  imageAlt: string;
  backgroundImageUrl?: string;
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
  backgroundImageUrl,
  className,
}: LegitBrandsProps) {
  return (
    <div className="relative w-full">
      {/* Background Image - Below the fold, lazy loaded */}
      {backgroundImageUrl != null && backgroundImageUrl !== '' ? (
        <div className="absolute inset-0 left-1/2 z-0 w-screen -translate-x-1/2">
          <Image
            alt=""
            className="object-cover"
            fill
            loading="lazy"
            preload={false}
            quality={60}
            sizes="100vw"
            src={backgroundImageUrl}
          />
        </div>
      ) : null}

      <section
        aria-labelledby={ariaLabelledBy}
        className={clsx(
          'relative z-30 w-full rounded-[30px] bg-white pb-4 pt-4 font-[family-name:var(--legit-brands-font-family,var(--font-family-body))]',
          className,
        )}
      >
        {/* Background color layer */}
        <div className="absolute inset-1 rounded-[26px] bg-[#EAF0FD]" />

        <div className="relative mx-auto w-full max-w-[1400px] px-4 @xl:px-6 @4xl:px-8">
          <div className="overflow-hidden rounded-[30px]">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Text Content (35%) */}
              <div className="flex flex-col justify-start pb-8 pl-8 pr-4 pt-8 md:pb-12 md:pl-12 md:pr-6 md:pt-12 lg:w-[35%] lg:pb-16 lg:pl-10 lg:pr-6 lg:pt-16">
                <h2
                  className="mb-6 font-[family-name:var(--font-family-body)] text-7xl font-extrabold leading-tight text-[var(--legit-brands-title,hsl(var(--foreground)))]"
                  id={ariaLabelledBy}
                >
                  <span className="block text-[rgb(128,128,128)]">{title.line1}</span>
                  <span className="block text-[rgb(128,128,128)]">
                    {title.line2}{' '}
                    <span className="text-[rgb(128,128,128)]">{title.line2Highlight}</span>
                  </span>
                  <span className="block text-[rgb(128,128,128)]">{title.line3}</span>
                  <span className="block text-[rgb(223,7,91)]">{title.line4}</span>
                  <span className="block text-[rgb(223,7,91)]">{title.line5}</span>
                </h2>
                <p className="mb-6 whitespace-pre-line font-body text-2xl font-semibold text-gray-600">
                  {description}
                </p>
                <p className="whitespace-pre-line font-[family-name:var(--font-family-body)] text-base italic text-gray-600 md:text-base">
                  <span className="font-bold text-[rgb(219,64,117)] underline">
                    {linkText.highlight}
                  </span>{' '}
                  {linkText.rest}
                </p>
              </div>

              {/* Right Side - Image (65%) */}
              <div className="relative overflow-hidden rounded-[30px] border-4 border-white lg:w-[65%]">
                <div className="relative aspect-[4/3] lg:h-full">
                  <Image
                    alt={imageAlt}
                    className="object-cover"
                    fill
                    loading="lazy"
                    preload={false}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    src={imageUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
