import { clsx } from 'clsx';
import { Info } from 'lucide-react';

import { Image } from '~/components/image';
import { imageManagerImageUrl } from '~/lib/store-assets';

interface CardContent {
  title: string;
  description?: string;
}

export interface BrandShowcaseProps {
  subtitle: string;
  sameDayDelivery: CardContent;
  adventureGuarantee: CardContent;
  tradeInUp: CardContent;
  certifiedPreOwned: CardContent;
  certifiedService: CardContent;
  imageUrl?: string;
  className?: string;
  'aria-labelledby'?: string;
}

interface BrandCardProps {
  title: string;
  description?: string;
  bgColor?: string;
  height?: string;
  showOpaqueBackground?: boolean;
  overlayImageUrl?: string;
  iconUrl?: string;
  className?: string;
  bottomPadding?: string;
  imagePosition?: string;
  imageOverflow?: string;
}

function BrandCard({
  title,
  description,
  bgColor = 'bg-white',
  height = 'h-80 md:h-96 lg:h-[28rem]',
  showOpaqueBackground = true,
  overlayImageUrl,
  iconUrl,
  className,
  bottomPadding = 'pb-12',
  imagePosition = 'center',
  imageOverflow,
}: BrandCardProps) {
  return (
    <div
      className={clsx(
        'group relative block rounded-[30px] bg-white p-1.5 transition-all hover:shadow-lg',
        imageOverflow ? 'overflow-visible' : 'overflow-hidden',
        className,
      )}
    >
      <div
        className={clsx(
          `relative flex flex-col items-center justify-end rounded-[28px] text-center ${bottomPadding}`,
          height,
          bgColor,
        )}
        style={
          imageOverflow
            ? { clipPath: 'inset(-100% 0 0 0 round 0 0 28px 28px)' }
            : { overflow: 'hidden' }
        }
      >
        {/* Overlay Image - positioned above background color */}
        {overlayImageUrl ? (
          <div
            className="absolute inset-0 z-0 overflow-hidden rounded-[28px]"
            style={imageOverflow ? { top: imageOverflow } : undefined}
          >
            <Image
              alt={title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              src={overlayImageUrl}
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
            />
          </div>
        ) : null}

        {/* Info Icon */}
        <div className="absolute right-4 top-4 z-10">
          <Info className="h-10 w-10 text-white opacity-80 transition-opacity hover:opacity-100" />
        </div>

        {/* Text content with opaque background - z-10 */}
        <div
          className={clsx(
            'relative z-10 w-full px-6 py-1 font-[family-name:var(--font-family-body)]',
            showOpaqueBackground && 'bg-white/50 backdrop-blur-sm',
          )}
        >
          {/* Icon badge on the left - absolutely positioned */}
          {iconUrl ? (
            <div className="absolute -left-48 top-[0%] h-[700px] w-[600px] -translate-y-1/2">
              <Image
                alt={`${title} icon`}
                className="object-contain brightness-0 invert"
                fill
                sizes="800px"
                src={iconUrl}
              />
            </div>
          ) : null}

          {/* Text content */}
          <h3 className="text-lg font-extrabold uppercase italic leading-tight text-black @lg:text-2xl">
            {title}
          </h3>
          {description ? (
            <p className="-mt-1 text-base font-light text-black @lg:text-lg">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line valid-jsdoc
/**
 * BrandShowcase component displays Ryddo's key brand values and services
 * in a visually appealing grid layout with static informational cards.
 *
 * This component supports various CSS variables for theming:
 *
 * ```css
 * :root {
 *   --brand-showcase-font-family: var(--font-family-body);
 *   --brand-showcase-title-font-family: var(--font-family-heading);
 *   --brand-showcase-title: hsl(var(--foreground));
 *   --brand-showcase-subtitle: hsl(var(--contrast-500));
 * }
 * ```
 */
export function BrandShowcase({
  'aria-labelledby': ariaLabelledBy = 'brand-showcase',
  subtitle,
  sameDayDelivery,
  adventureGuarantee,
  tradeInUp,
  certifiedPreOwned,
  certifiedService,
  imageUrl,
  className,
}: BrandShowcaseProps) {
  return (
    <div className="relative">
      {/* Background extension that extends downward */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-[calc(100%+3rem)] bg-gray-100 bg-cover bg-center md:h-[calc(100%+4rem)] lg:h-[calc(100%+5rem)]"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />

      <section
        aria-labelledby={ariaLabelledBy}
        className={clsx(
          'relative z-20 -mt-8 w-full font-[family-name:var(--brand-showcase-font-family,var(--font-family-body))] @container md:-mt-12 md:py-12 lg:-mt-16 lg:py-16',
          className,
        )}
      >
        <div className="mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4">
          {/* Header Section */}
          <header className="mb-8 pt-8 text-center md:mb-12 md:pt-12 lg:pt-16">
            <h2
              className="font-[family-name:var(--font-family-body)] text-5xl font-extrabold leading-tight text-black md:text-7xl lg:text-7xl xl:text-7xl"
              id={ariaLabelledBy}
            >
              Rethinking the <span className="text-white">Ride</span>
            </h2>
            <p className="-mt-2 font-[family-name:var(--font-family-body)] text-3xl font-normal text-white">
              <span className="bg-blue-500 px-2 py-1">Not just selling</span>{' '}
              {subtitle.replace('Not just selling', '').trim()}
            </p>
          </header>

          <div className="space-y-3">
            {/* Top Row - Middle card largest, side cards bigger, all same height */}
            <div className="grid grid-cols-1 gap-2 md:gap-3 lg:grid-cols-7">
              <div className="lg:col-span-2">
                <BrandCard
                  bgColor="bg-blue-500"
                  description={sameDayDelivery.description}
                  height="h-64 md:h-80 lg:h-96"
                  overlayImageUrl={imageManagerImageUrl('same-day-delivery-v1.png')}
                  title={sameDayDelivery.title}
                />
              </div>
              <div className="lg:col-span-3">
                <BrandCard
                  description={adventureGuarantee.description}
                  height="h-64 md:h-80 lg:h-96"
                  imageOverflow="-12%"
                  imagePosition="center"
                  overlayImageUrl={imageManagerImageUrl('adventure-guarantee-v2.png')}
                  title={adventureGuarantee.title}
                />
              </div>
              <div className="lg:col-span-2">
                <BrandCard
                  bgColor="bg-[rgb(255,229,252)]"
                  description={tradeInUp.description}
                  height="h-64 md:h-80 lg:h-96"
                  overlayImageUrl={imageManagerImageUrl('trade-in-v1.png')}
                  title={tradeInUp.title}
                />
              </div>
            </div>

            {/* Bottom Row - Two items, equal width (title only, no description) */}
            <div className="grid grid-cols-1 gap-2 md:gap-3 lg:grid-cols-2">
              <BrandCard
                bgColor="bg-[rgb(226,226,226)]"
                bottomPadding="pb-8"
                height="h-36 md:h-44 lg:h-52"
                overlayImageUrl={imageManagerImageUrl('certified-pre-owned.png')}
                title={certifiedPreOwned.title}
              />
              <BrandCard
                bgColor="bg-[rgb(226,226,226)]"
                bottomPadding="pb-8"
                height="h-36 md:h-44 lg:h-52"
                iconUrl={imageManagerImageUrl('cert-service-bg-badge.png')}
                overlayImageUrl={imageManagerImageUrl('cert-service-bg.png')}
                title={certifiedService.title}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
