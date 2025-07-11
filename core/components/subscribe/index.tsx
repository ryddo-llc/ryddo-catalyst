import { useTranslations } from 'next-intl';

import { Subscribe as SubscribeSection } from '@/vibes/soul/sections/subscribe';

import { subscribe } from './_actions/subscribe';

export const Subscribe = () => {
  const t = useTranslations('Components.Subscribe');

  return (
    <SubscribeSection
      action={subscribe}
      description={t('description')}
      emailPlaceholder={t('emailPlaceholder')}
      image={{
        src: '/images/backgrounds/newsletter-background.svg',
        alt: 'Newsletter background with palm trees and mountains'
      }}
      namePlaceholder={t('namePlaceholder')}
      submitLabel={t('submitLabel')}
      title={t('title')}
    />
  );
};
