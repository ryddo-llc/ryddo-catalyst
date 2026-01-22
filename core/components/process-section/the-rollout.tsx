import { clsx } from 'clsx';

import { Image } from '~/components/image';

export interface RolloutCard {
  badge: string;
  imageUrl?: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface TheRolloutProps {
  title: string;
  subtitle: string;
  cards: RolloutCard[];
  className?: string;
  'aria-labelledby'?: string;
}

interface RolloutCardComponentProps {
  badge: string;
  imageUrl?: string;
  title: string;
  subtitle: string;
  description: string;
  className?: string;
}

function RolloutCardComponent({
  badge,
  imageUrl,
  title,
  subtitle,
  description,
  className,
}: RolloutCardComponentProps) {
  return (
    <div
      className={clsx(
        'group relative block overflow-hidden rounded-[40px] bg-white p-1.5 transition-all hover:shadow-lg',
        className,
      )}
    >
      <div className="relative flex h-[30rem] flex-col overflow-hidden rounded-[40px] md:h-[30rem] lg:h-[30rem]">
        {/* Image Area - takes up 65% of card height */}
        <div className="relative h-[60%] w-full overflow-hidden rounded-[40px]">
          {imageUrl ? (
            <Image
              alt=""
              className="object-cover object-center"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={imageUrl}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400" />
          )}

          {/* Badge - Ryddo pink */}
          <div className="absolute left-4 top-4 z-10">
            <span className="rounded-full bg-[rgb(219,64,117)] px-3 py-1 text-sm font-black uppercase text-white md:px-4 md:py-1.5">
              {badge}
            </span>
          </div>
        </div>

        {/* Content - takes up 40% of card height */}
        <div className="relative h-[40%] w-full rounded-b-[40px] bg-white px-6 pb-10 pt-6 font-[family-name:var(--font-family-body)]">
          <h3 className="-mb-1 text-3xl font-black uppercase italic text-black @lg:text-4xl">
            {title}
          </h3>
          <p className="text-md @lg:text-md truncate font-bold italic text-black">{subtitle}</p>
          <p className="mt-2 text-base font-medium italic text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line valid-jsdoc
/**
 * TheRollout component displays Ryddo's rollout timeline with
 * informational cards showing different service options.
 *
 * This component supports various CSS variables for theming:
 *
 * ```css
 * :root {
 *   --font-family-body: Inter, sans-serif;
 *   --process-section-title: hsl(var(--foreground));
 * }
 * ```
 */
export function TheRollout({
  'aria-labelledby': ariaLabelledBy = 'the-rollout',
  title,
  subtitle,
  cards,
  className,
}: TheRolloutProps) {
  return (
    <div
      className={clsx(
        'rounded-[30px] border-[4px] border-white px-6 py-3 md:px-8 md:py-4 lg:px-12 lg:py-5',
        className,
      )}
    >
      <header className="mb-8 text-center md:mb-12">
        <h2
          className="-mb-4 font-[family-name:var(--font-family-body)] text-5xl font-extrabold text-[var(--process-section-title,hsl(var(--foreground)))] text-white md:-mb-5 md:text-6xl lg:-mb-6 lg:text-7xl"
          id={ariaLabelledBy}
        >
          {title}
        </h2>
        <p className="font-[family-name:var(--font-family-body)] text-2xl font-light text-white md:text-2xl">
          {subtitle}
        </p>
      </header>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-4">
        {cards.map((card, index) => (
          <RolloutCardComponent
            badge={card.badge}
            description={card.description}
            imageUrl={card.imageUrl}
            key={index}
            subtitle={card.subtitle}
            title={card.title}
          />
        ))}
      </div>
    </div>
  );
}
