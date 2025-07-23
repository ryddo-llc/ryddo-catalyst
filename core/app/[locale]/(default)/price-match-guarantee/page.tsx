import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/vibes/soul/sections/page-header';
import { PriceMatchContent } from '~/components/terms-page/price-match-content';
import { TermsPage } from '~/components/terms-page/terms-page';
import { priceMatchContent, termsNavigationItems } from '~/lib/data/terms-conditions';

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateMetadata(): Metadata {
  return {
    title: 'Price Match Guarantee - Ryddo',
  };
}

const TERMS_BACKGROUND_IMAGE = {
  alt: 'Terms and policies background',
  src: '/images/backgrounds/terms-background.webp',
};

export default async function PriceMatchPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      <PageHeader 
        backgroundImage={TERMS_BACKGROUND_IMAGE}
        locale={locale}
        title={priceMatchContent.pageTitle || priceMatchContent.title}
      />
      <TermsPage
        content={priceMatchContent}
        currentPageId="price-match"
        navigationItems={termsNavigationItems}
      >
        <PriceMatchContent />
      </TermsPage>
    </>
  );
} 