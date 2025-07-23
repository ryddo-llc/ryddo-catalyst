import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { PageHeader } from '@/vibes/soul/sections/page-header';
import { TermsAccordion } from '~/components/terms-page/terms-accordion';
import { TermsPage } from '~/components/terms-page/terms-page';
import { termsNavigationItems, termsOfUseContent } from '~/lib/data/terms-conditions';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Terms' });

  return {
    title: t('title'),
  };
}

export default async function TermsConditionsPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const backgroundImage = {
    alt: 'Terms and conditions background',
    src: '/images/backgrounds/terms-background.webp',
  };

  return (
    <>
      <PageHeader 
        backgroundImage={backgroundImage}
        locale={locale}
        title={termsOfUseContent.pageTitle || termsOfUseContent.title}
      />
      <TermsPage
        content={termsOfUseContent}
        currentPageId="terms-of-use"
        navigationItems={termsNavigationItems}
      >
        <TermsAccordion accordionItems={termsOfUseContent.accordionItems} />
      </TermsPage>
    </>
  );
} 