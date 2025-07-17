import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/vibes/soul/sections/page-header';

import { AboutHero } from './components/about-hero';
import { AboutStats } from './components/about-stats';
import { AboutValuesGrid } from './components/about-values-grid';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'About' });

  return {
    title: t('title'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('About');

  const backgroundImage = {
    alt: 'Artist wall background',
    src: '/images/backgrounds/artist-wall.webp',
  };

  return (
    <>
      <PageHeader backgroundImage={backgroundImage} locale={locale} title={t('title')} />
      <AboutHero />
      <AboutValuesGrid />
      <AboutStats />
    </>
  );
} 