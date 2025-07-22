import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { PageHeader } from '@/vibes/soul/sections/page-header';
import { TermsContent } from '~/components/terms-page/terms-content';
import { TermsPage } from '~/components/terms-page/terms-page';
import { shippingReturnsContent, termsNavigationItems } from '~/lib/data/terms-conditions';

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateMetadata(): Metadata {
  return {
    title: 'Shipping, Returns & Exchanges - Ryddo',
  };
}

export default async function ShippingReturnsPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const backgroundImage = {
    alt: 'Shipping, returns and exchanges background',
    src: '/images/backgrounds/terms-background.webp',
  };

  return (
    <>
      <PageHeader 
        backgroundImage={Streamable.from(async () => Promise.resolve(backgroundImage))}
        locale={locale}
        title={Streamable.from(async () => Promise.resolve(shippingReturnsContent.pageTitle || shippingReturnsContent.title))}
      />
      <TermsPage
        content={shippingReturnsContent}
        currentPageId="shipping-returns"
        navigationItems={termsNavigationItems}
      >
        <TermsContent accordionItems={shippingReturnsContent.accordionItems} />
      </TermsPage>
    </>
  );
} 