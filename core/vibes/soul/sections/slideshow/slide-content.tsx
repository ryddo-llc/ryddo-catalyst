import { ArrowRight } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

import { SlideItemProps } from './types';

export function SlideContent({ slide, index, selectedIndex }: SlideItemProps) {
  const { title, subtitle, description, showDescription = true, cta, showCta = true } = slide;

  return (
    <div
      className={`w-full max-w-xs transform rounded-xl bg-white/95 p-2 shadow-lg transition-all duration-700 ease-out sm:max-w-sm sm:p-6 md:max-w-md md:p-8 ${
        index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div
        className={`transition-all delay-100 duration-500 ease-out ${
          index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {subtitle ? <p className="text-sm font-semibold text-[#757575]">{subtitle}</p> : null}
      </div>

      <div
        className={`font-nunito transition-all delay-200 duration-500 ease-out ${
          index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <h1
          className="text-3xl font-extrabold leading-tight text-[#F92F7B] sm:text-4xl md:text-5xl lg:text-6xl"
          id={index === selectedIndex ? 'hero-heading' : undefined}
        >
          <span className="block">{title.split(' ')[0]}</span>
          <span className="inline-block text-zinc-800">{title.split(' ').slice(1).join(' ')}</span>
          <span className="text-[#F92F7B]">.</span>
        </h1>
      </div>

      {showDescription && (
        <div
          className={`transition-all delay-300 duration-500 ease-out ${
            index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <p className="mt-1 text-sm font-semibold text-[#757575]">{description}</p>
        </div>
      )}

      {showCta && (
        <div
          className={`delay-400 mt-4 transition-all duration-500 ease-out sm:mt-5 md:mt-7 ${
            index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <ButtonLink
            aria-label={`Shop ${title} - Premium electric bikes and scooters`}
            className="group min-h-10 text-sm text-white sm:min-h-14 sm:text-base"
            href={cta?.href ?? '#'}
            shape={cta?.shape ?? 'pill'}
            size={cta?.size ?? 'small'}
            variant={cta?.variant ?? 'primary'}
          >
            <span className="inline-flex items-center gap-0">
              <span>{cta?.label ?? 'Shop Now'}</span>
              <ArrowRight
                className="ml-0 w-0 flex-shrink-0 translate-y-[1px] opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:w-5 group-hover:opacity-100"
                size={18}
                strokeWidth={2}
              />
            </span>
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
