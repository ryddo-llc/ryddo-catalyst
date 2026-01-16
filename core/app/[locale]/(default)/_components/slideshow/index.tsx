import { useTranslations } from 'next-intl';

import { imageManagerImageUrl } from '~/lib/store-assets';
import { Slideshow as SlideshowSection } from '~/vibes/soul/sections/slideshow';

export function Slideshow() {
  const t = useTranslations('Home.Slideshow');

  const slides = [
    {
      title: t('Slide01.title'),
      subtitle: 'starting at $1,499',
      image: {
        src: imageManagerImageUrl('slide-bg-01.jpeg'),
        alt: t('Slide01.alt'),
      },
      description: t('Slide01.description'),
      cta: {
        href: '/e-scooters',
        label: t('Slide01.cta'),
      },
    },
    {
      title: t('Slide02.title'),
      subtitle: 'starting at $1,499',
      image: {
        src: imageManagerImageUrl('slide-bg-02.jpeg'),
        alt: t('Slide02.alt'),
      },
      description: t('Slide02.description'),
      cta: {
        href: '/service',
        label: t('Slide02.cta'),
      },
    },
    {
      title: t('Slide03.title'),
      subtitle: 'starting at $1,499',
      image: {
        src: imageManagerImageUrl('slide-bg-03.jpeg'),
        alt: t('Slide03.alt'),
      },
      description: t('Slide03.description'),
      cta: {
        href: '/e-bikes',
        label: t('Slide03.cta'),
      },
      contentPosition: 'left' as const,
    },
  ];

  return <SlideshowSection slides={slides} />;
}
