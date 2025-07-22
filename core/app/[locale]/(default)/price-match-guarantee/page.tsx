import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
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

export default async function PriceMatchPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const backgroundImage = {
    alt: 'Price match guarantee background',
    src: '/images/backgrounds/terms-background.webp',
  };

  return (
    <>
      <PageHeader 
        backgroundImage={Streamable.from(async () => Promise.resolve(backgroundImage))}
        locale={locale}
        title={Streamable.from(async () => Promise.resolve(priceMatchContent.pageTitle || priceMatchContent.title))}
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