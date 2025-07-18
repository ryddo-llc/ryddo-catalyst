import { useTranslations } from 'next-intl';

import { Slideshow as SlideshowSection } from '~/vibes/soul/sections/slideshow';

import SlideBg01 from './slide-bg-01.jpeg';
import SlideBg02 from './slide-bg-02.jpeg';
import SlideBg03 from './slide-bg-03.jpeg';

export function Slideshow() {
  const t = useTranslations('Home.Slideshow');

  const slides = [
    {
      title: t('Slide01.title'),
      subtitle: 'starting at $1,499',
      image: {
        src: SlideBg01.src,
        alt: t('Slide01.alt'),
        blurDataUrl: SlideBg01.blurDataURL,
      },
      description: t('Slide01.description'),
      cta: {
        href: '/shop-all',
        label: t('Slide01.cta'),
      },
    },
    {
      title: t('Slide02.title'),
      subtitle: 'starting at $1,499',
      image: {
        src: SlideBg02.src,
        alt: t('Slide02.alt'),
        blurDataUrl: SlideBg02.blurDataURL,
      },
      description: t('Slide02.description'),
      cta: {
        href: '/shop-all',
        label: t('Slide02.cta'),
      },
    },
    {
      title: t('Slide03.title'),
      subtitle: 'starting at $1,499',
      image: {
        src: SlideBg03.src,
        alt: t('Slide03.alt'),
        blurDataUrl: SlideBg03.blurDataURL,
      },
      description: t('Slide03.description'),
      cta: {
        href: '/shop-all',
        label: t('Slide03.cta'),
      },
    },
  ];

  return <SlideshowSection slides={slides} />;
}
