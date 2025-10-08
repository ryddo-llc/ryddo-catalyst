import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Image } from '~/components/image';
import { imageManagerImageUrl } from '~/lib/store-assets';

interface PageHeaderProps {
  backgroundImage?: Streamable<{ src: string; alt: string } | null>;
  className?: string;
  title: Streamable<string>;
  locale?: string;
}

export const PageHeader = ({ title, backgroundImage, className, locale }: PageHeaderProps) => {
  const placeholderImage = {
    alt: 'Page header background',
    src: imageManagerImageUrl('newsletter-background.png', '{:size}'),
  };

  return (
    <section
      className={clsx(
        'relative flex h-[30vh] w-full items-end overflow-hidden md:h-[25vh] lg:h-[30vh]',
        className,
      )}
    >
      {/* Background Image */}
      <Stream
        fallback={
          <div className="absolute inset-0 opacity-40">
            <Image
              alt={placeholderImage.alt}
              className="object-cover"
              fill
              loading="lazy"
              priority={false}
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
              src={placeholderImage.src}
            />
          </div>
        }
        value={backgroundImage}
      >
        {(image) => (
          <div className="absolute inset-0 opacity-40">
            <Image
              alt={image?.alt || placeholderImage.alt}
              className="object-cover"
              fill
              loading="lazy"
              priority={false}
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
              src={image?.src || placeholderImage.src}
            />
          </div>
        )}
      </Stream>

      {/* Content */}
      <div className="relative px-4 pb-12 text-left sm:px-8 md:px-12 lg:px-20">
        <Stream
          fallback={
            <Skeleton.Root>
              <Skeleton.Box className="h-12 w-64 rounded bg-white/20" />
            </Skeleton.Root>
          }
          value={title}
        >
          {(pageTitle) => (
            <h2 className="font-['Nunito'] font-heading text-3xl font-bold leading-tight text-black md:text-4xl lg:text-5xl">
              {pageTitle.toLocaleLowerCase(locale)}
              <span className='font-["Inter"] text-5xl leading-[67.20px] text-[#F92F7B] md:text-6xl lg:text-7xl'>
                .
              </span>
            </h2>
          )}
        </Stream>
      </div>
    </section>
  );
};

export const PageHeaderSkeleton = ({ className }: { className?: string }) => {
  return (
    <section
      className={clsx(
        'relative flex h-[30vh] w-full animate-pulse items-center justify-center overflow-hidden bg-gray-200 md:h-[25vh] lg:h-[30vh]',
        className,
      )}
    >
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <Skeleton.Root className="mx-auto">
          <Skeleton.Box className="h-12 w-64 rounded bg-white/20" />
        </Skeleton.Root>
      </div>
    </section>
  );
};
