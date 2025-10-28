import { clsx } from 'clsx';

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
  className?: string;
  'aria-labelledby'?: string;
}

interface BrandCardProps {
  title: string;
  description?: string;
  bgColor?: string;
  height?: string;
  showOpaqueBackground?: boolean;
  className?: string;
}

function BrandCard({
  title,
  description,
  bgColor = 'bg-white',
  height = 'h-80 md:h-96 lg:h-[28rem]',
  showOpaqueBackground = true,
  className,
}: BrandCardProps) {
  return (
    <div
      className={clsx(
        'group relative block overflow-hidden rounded-[30px] bg-white p-1.5 transition-all hover:shadow-lg',
        className,
      )}
    >
      <div
        className={clsx(
          'relative flex flex-col items-center justify-end overflow-hidden rounded-[28px] pb-12 text-center',
          height,
          bgColor,
        )}
      >
        <div
          className={clsx(
            'w-full px-6 py-2 font-[family-name:var(--font-family-body)]',
            showOpaqueBackground && 'bg-white/80 backdrop-blur-sm',
          )}
        >
          <h3 className="text-lg font-bold uppercase text-black @lg:text-2xl">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-base font-light text-black @lg:text-lg">{description}</p>
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
  className,
}: BrandShowcaseProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={clsx(
        'w-full bg-gray-100 font-[family-name:var(--brand-showcase-font-family,var(--font-family-body))] @container md:py-12 lg:py-16',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-2 sm:px-3 lg:px-4">
        {/* Header Section */}
        <header className="mb-8 text-center md:mb-12">
          <h2
            className="font-[family-name:var(--font-family-body)] text-5xl font-extrabold text-[var(--brand-showcase-title,hsl(var(--foreground)))] md:text-6xl lg:text-7xl xl:text-8xl"
            id={ariaLabelledBy}
          >
            Rethinking the <span className="text-red-800">Ride</span>
          </h2>
          <p className="font-[family-name:var(--font-family-body)] text-3xl font-light text-gray-600">
            {subtitle}
          </p>
        </header>

        <div className="space-y-6">
          {/* Top Row - Middle card largest, side cards bigger, all same height */}
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-7">
            <div className="lg:col-span-2">
              <BrandCard
                bgColor="bg-blue-500"
                description={sameDayDelivery.description}
                height="h-64 md:h-80 lg:h-96"
                title={sameDayDelivery.title}
              />
            </div>
            <div className="lg:col-span-3">
              <BrandCard
                bgColor="bg-yellow-400"
                description={adventureGuarantee.description}
                height="h-64 md:h-80 lg:h-96"
                title={adventureGuarantee.title}
              />
            </div>
            <div className="lg:col-span-2">
              <BrandCard
                bgColor="bg-pink-500"
                description={tradeInUp.description}
                height="h-64 md:h-80 lg:h-96"
                title={tradeInUp.title}
              />
            </div>
          </div>

          {/* Bottom Row - Two items, equal width */}
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            <BrandCard
              bgColor="bg-gray-500"
              description={certifiedPreOwned.description}
              height="h-40 md:h-48 lg:h-56"
              showOpaqueBackground={false}
              title={certifiedPreOwned.title}
            />
            <BrandCard
              bgColor="bg-gray-500"
              description={certifiedService.description}
              height="h-40 md:h-48 lg:h-56"
              showOpaqueBackground={false}
              title={certifiedService.title}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
