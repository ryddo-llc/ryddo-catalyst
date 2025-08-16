import { Image } from '~/components/image';

import { SlideContent } from './slide-content';
import { SlideItemProps } from './types';

export function SlideItem({ slide, index, selectedIndex }: SlideItemProps) {
  const { image } = slide;

  const defaultPosition = index % 2 === 0 ? 'sm:justify-end' : 'sm:justify-start';
  
  let desktopPosition = defaultPosition;

  if (slide.contentPosition === 'left') {

    desktopPosition = 'sm:justify-start';

  } else if (slide.contentPosition === 'right') {

    desktopPosition = 'sm:justify-end';

  } else if (slide.contentPosition === 'center') {

    desktopPosition = 'sm:justify-center';
  }

  return (
    <div className="relative h-full w-full min-w-0 shrink-0 grow-0 basis-full">
      <div className="absolute inset-0 h-full w-full opacity-80">
        {image?.src != null && image.src !== '' && (
          <Image
            alt={image.alt}
            blurDataURL={image.blurDataUrl}
            className="object-cover"
            fill
            loading={index === 0 ? 'eager' : 'lazy'}
            placeholder={image.blurDataUrl != null && image.blurDataUrl !== '' ? 'blur' : 'empty'}
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
            src={image.src}
            style={{
              objectPosition: 'center 60%',
            }}
          />
        )}
      </div>

      <div className="container relative z-10 mx-auto flex h-full items-center px-4 opacity-90 sm:px-6">
        <div
          className={`flex w-full justify-center transition-all duration-700 ease-out ${desktopPosition}`}
        >
          <SlideContent index={index} selectedIndex={selectedIndex} slide={slide} />
        </div>
      </div>
    </div>
  );
}
