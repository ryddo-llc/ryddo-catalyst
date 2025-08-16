import { useTranslations } from 'next-intl';

import { Subscribe as SubscribeSection } from '@/vibes/soul/sections/subscribe';
import { imageManagerImageUrl } from '~/lib/store-assets';

import { subscribe } from './_actions/subscribe';

interface SubscribeProps {
  image?: {
    src: string;
    alt: string;
  };
}

export const Subscribe = ({ image }: SubscribeProps = {}) => {
  const t = useTranslations('Components.Subscribe');

  const imageSrc = image?.src || imageManagerImageUrl('newsletter-background.png', '1200w');

  return (
    <SubscribeSection
      action={subscribe}
      description={t('description')}
      emailPlaceholder={t('emailPlaceholder')}
      image={{
        src: imageSrc,
        alt: image?.alt || 'Newsletter background with palm trees and mountains',
      }}
      namePlaceholder={t('namePlaceholder')}
      submitLabel={t('submitLabel')}
      title={t('title')}
    />
  );
};
