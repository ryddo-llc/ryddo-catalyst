import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ArrowButton } from '~/components/arrow-button';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { imageManagerImageUrl } from '~/lib/store-assets';

export interface Category {
  name: string;
  path: string;
  image?: {
    url: string;
    altText: string;
  } | null;
}

// Static Service category injected in
const SERVICE_CATEGORY: Category = {
  name: 'Service',
  path: '/service/',
  image: {
    url: '/images/backgrounds/street-background.webp',
    altText: 'Street background for service category',
  },
};

interface CategoryItemProps {
  category: Category;
  className?: string;
  layout?: 'default' | 'center' | 'bottom-right';
  index?: number;
}

function CategoryItem({ category, className, layout = 'default', index = 0 }: CategoryItemProps) {
  const backgroundImage = imageManagerImageUrl(`${category.name.toLowerCase()}.png`, '{:size}');

  return (
    <Link
      className={clsx(
        'group relative block overflow-hidden rounded-lg bg-[var(--category-item-background,hsl(var(--contrast-100)))] ring-[var(--category-item-focus,hsl(var(--primary)))] transition-all hover:shadow-lg focus-visible:outline-0 focus-visible:ring-2',
        className,
      )}
      href={category.path}
    >
      <div className="relative h-80 overflow-hidden md:h-96 lg:h-[28rem]">
        {category.image ? (
          <Image
            alt={category.image.altText || category.name}
            className="object-cover"
            fill
            loading={index < 2 ? 'eager' : 'lazy'}
            priority={index < 2}
            quality={80}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 600px"
            src={backgroundImage || category.image.url}
          />
        ) : null}
      </div>
      {layout === 'center' && (
        /* Center layout - button above text */
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <ArrowButton aria-hidden="true" className="text-[#FFFFFF]" tabIndex={-1}>
            Shop
          </ArrowButton>
          <h3 className="font-[family-name:var(--category-item-title-font-family,var(--font-family-heading))] text-4xl font-extrabold text-[#333333]">
            {category.name.toLowerCase()}
            <span className="ml-1 text-5xl text-[var(--category-item-dot,hsl(var(--primary)))]">
              .
            </span>
          </h3>
        </div>
      )}
      {layout === 'bottom-right' && (
        /* Bottom right layout - centered text with "Book now" button below */
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h3 className="mb-4 font-[family-name:var(--category-item-title-font-family,var(--font-family-heading))] text-4xl font-extrabold text-[#333333]">
            {category.name.toLowerCase()}
            <span className="ml-1 text-5xl text-[var(--category-item-dot,hsl(var(--primary)))]">
              .
            </span>
          </h3>
          <ArrowButton aria-hidden="true" className="text-[#FFFFFF]" tabIndex={-1}>
            Book now
          </ArrowButton>
        </div>
      )}
      {layout === 'default' && (
        /* Default layout - top left text, bottom left button */
        <>
          <div className="absolute left-4 top-6">
            <h3 className="font-[family-name:var(--category-item-title-font-family,var(--font-family-heading))] text-xl font-extrabold text-[#333333] @lg:text-2xl">
              {category.name.toLowerCase()}
              <span className="ml-1 text-5xl text-[var(--category-item-dot,hsl(var(--primary)))]">
                .
              </span>
            </h3>
          </div>
          <div className="absolute bottom-4 left-4">
            <ArrowButton aria-hidden="true" tabIndex={-1}>
              Shop
            </ArrowButton>
          </div>
        </>
      )}
    </Link>
  );
}

export interface CategoryShowcaseProps {
  categories: Streamable<Category[]>;
  className?: string;
  'aria-labelledby'?: string;
}

export function CategoryShowcase({
  'aria-labelledby': ariaLabelledBy = 'categories',
  categories,
  className,
}: CategoryShowcaseProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={clsx(
        'w-full py-2 font-[family-name:var(--category-showcase-font-family,var(--font-family-body))] @container md:py-4 lg:py-6',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <Stream
          fallback={
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
                <div className="h-80 animate-pulse rounded-lg bg-contrast-100 md:h-96 lg:col-span-2 lg:h-[28rem]" />
                <div className="h-80 animate-pulse rounded-lg bg-contrast-100 md:h-96 lg:col-span-1 lg:h-[28rem]" />
                <div className="h-80 animate-pulse rounded-lg bg-contrast-100 md:h-96 lg:col-span-1 lg:h-[28rem]" />
              </div>
            </div>
          }
          value={categories}
        >
          {(categoriesData) => {
            if (categoriesData.length === 0) return null;

            // Sort categories to prioritize e-scooters first, e-bikes second
            const sortedCategories = [...categoriesData].sort((a, b) => {
              const aName = a.name.toLowerCase();
              const bName = b.name.toLowerCase();
              
              // E-Scooters should be first
              if (aName.includes('scooter')) return -1;
              if (bName.includes('scooter')) return 1;
              
              // E-Bikes should be second
              if (aName.includes('bike')) return -1;
              if (bName.includes('bike')) return 1;
              
              // Keep original order for others
              return 0;
            });

            const allCategories = [...sortedCategories, SERVICE_CATEGORY];

            const topRowCategories = allCategories.slice(0, 3);
            const bottomRowCategories = allCategories.slice(3, 5);

            return (
              <div className="space-y-6">
                {/* Top Row - First item 50%, other two 25% each */}
                <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
                  {topRowCategories[0] ? (
                    <div className="lg:col-span-2">
                      <CategoryItem category={topRowCategories[0]} index={0} />
                    </div>
                  ) : null}
                  {topRowCategories[1] ? (
                    <div className="lg:col-span-1">
                      <CategoryItem category={topRowCategories[1]} index={1} />
                    </div>
                  ) : null}
                  {topRowCategories[2] ? (
                    <div className="lg:col-span-1">
                      <CategoryItem category={topRowCategories[2]} index={2} />
                    </div>
                  ) : null}
                </div>

                {/* Bottom Row - Two items, equal width */}
                {bottomRowCategories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
                    {bottomRowCategories.map((category, index) => (
                      <CategoryItem
                        category={category}
                        index={index}
                        key={`${category.name}-${index}`}
                        layout={index === 0 ? 'center' : 'bottom-right'}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }}
        </Stream>
      </div>
    </section>
  );
}
