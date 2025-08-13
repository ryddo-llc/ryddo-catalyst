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
    src: imageManagerImageUrl('newsletter-background.png')
  };

  return (
    <section className={clsx('relative w-full h-[30vh] md:h-[25vh] lg:h-[30vh] flex items-end overflow-hidden', className)}>
      {/* Background Image */}
      <Stream
        fallback={
          <div className="absolute inset-0 opacity-40">
            <Image
              alt={placeholderImage.alt}
              className="object-cover"
              fill
              priority
              sizes="100vw"
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
              priority
              sizes="100vw"
              src={image?.src || placeholderImage.src}
            />
          </div>
        )}
      </Stream>

      {/* Content */}
      <div className="relative text-left px-4 pb-8 md:px-8 md:pb-12">
        <Stream
          fallback={
            <Skeleton.Root>
              <Skeleton.Box className="h-12 w-64 bg-white/20 rounded" />
            </Skeleton.Root>
          }
          value={title}
        >
          {(pageTitle) => (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Nunito'] font-heading leading-tight text-black/70">
              {pageTitle.toLocaleLowerCase(locale)}
              <span className='text-[#F92F7B] text-5xl md:text-6xl lg:text-7xl font-["Inter"] leading-[67.20px]'>
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
    <section className={clsx('relative w-full h-[30vh] md:h-[25vh] lg:h-[30vh] flex items-center justify-center overflow-hidden bg-gray-200 animate-pulse', className)}>
      <div className="relative text-center px-4 max-w-4xl mx-auto">
        <Skeleton.Root className="mx-auto">
          <Skeleton.Box className="h-12 w-64 bg-white/20 rounded" />
        </Skeleton.Root>
      </div>
    </section>
  );
}; 