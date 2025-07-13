import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ArrowButton } from '~/components/arrow-button';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

export interface Category {
  name: string;
  path: string;
  image?: {
    url: string;
    altText: string;
  } | null;
}

interface CategoryItemProps {
  category: Category;
  className?: string;
  layout?: 'default' | 'center' | 'bottom-right';
  index?: number;
}

function CategoryItem({ category, className, layout = 'default', index = 0 }: CategoryItemProps) {
  return (
    <Link
      className={clsx(
        'group relative block overflow-hidden rounded-lg bg-[var(--category-item-background,hsl(var(--contrast-100)))] ring-[var(--category-item-focus,hsl(var(--primary)))] transition-all hover:shadow-lg focus-visible:outline-0 focus-visible:ring-2',
        className,
      )}
      href={category.path}
    >
      <div className="h-80 overflow-hidden md:h-96 lg:h-[28rem]">
        {category.image ? (
          <Image
            alt={category.image.altText || category.name}
            className="h-full w-full object-cover"
            height={300}
            src={category.image.url}
            width={400}
          />
        ) : null}
      </div>
      {layout === 'center' ? (
        /* Center layout - button above text */
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <ArrowButton className="text-[#FFFFFF]" size="small" variant="primary">
            Shop
          </ArrowButton>
          <h3 className="font-[family-name:var(--category-item-title-font-family,var(--font-family-heading))] text-4xl font-extrabold text-[#333333]">
            {category.name}
            <span className="ml-1 text-5xl text-[var(--category-item-dot,hsl(var(--primary)))]">
              .
            </span>
          </h3>
        </div>
      ) : layout === 'bottom-right' ? (
        /* Bottom right layout - centered text with "Book now" button below */
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h3 className="mb-4 font-[family-name:var(--category-item-title-font-family,var(--font-family-heading))] text-4xl font-extrabold text-[#333333]">
            {category.name}
            <span className="ml-1 text-5xl text-[var(--category-item-dot,hsl(var(--primary)))]">
              .
            </span>
          </h3>
          <ArrowButton className="text-[#FFFFFF]" size="small" variant="primary">
            Book now
          </ArrowButton>
        </div>
      ) : (
        /* Default layout - top left text, bottom left button */
        <>
          <div className="absolute left-4 top-6">
            <h3 className="font-[family-name:var(--category-item-title-font-family,var(--font-family-heading))] text-8xl font-extrabold text-[#333333] @lg:text-xl">
              {category.name}
              <span className="ml-1 text-5xl text-[var(--category-item-dot,hsl(var(--primary)))]">
                .
              </span>
            </h3>
          </div>
          <div className="absolute bottom-4 left-4">
            <ArrowButton className="text-[#FFFFFF]" size="small" variant="primary">
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

            const topRowCategories = categoriesData.slice(0, 3);
            const bottomRowCategories = categoriesData.slice(3, 5);

            return (
              <div className="space-y-6">
                {/* Top Row - First item 50%, other two 25% each */}
                <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
                  {topRowCategories[0] ? (
                    <div className="lg:col-span-2">
                      <CategoryItem category={topRowCategories[0]} />
                    </div>
                  ) : null}
                  {topRowCategories[1] ? (
                    <div className="lg:col-span-1">
                      <CategoryItem category={topRowCategories[1]} />
                    </div>
                  ) : null}
                  {topRowCategories[2] ? (
                    <div className="lg:col-span-1">
                      <CategoryItem category={topRowCategories[2]} />
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
