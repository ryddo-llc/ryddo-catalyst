import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/vibes/soul/sections/page-header';
import { TermsPage } from '~/components/terms-page/terms-page';
import { TestRideWaiverForm } from '~/components/terms-page/test-ride-waiver-form';
import { termsNavigationItems } from '~/lib/data/terms-conditions';

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateMetadata(): Metadata {
  return {
    title: 'Test Ride Waiver - Ryddo',
  };
}

export default async function TestRideWaiverPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const backgroundImage = {
    alt: 'Test ride waiver background',
    src: '/images/backgrounds/terms-background.webp',
  };

  return (
    <>
      <PageHeader 
        backgroundImage={backgroundImage}
        locale={locale}
        title="Test Ride Waiver"
      />
      <TermsPage
        content={{
          accordionItems: [],
          description: 'Please complete the form below to participate in a test ride.',
          id: 'test-ride-waiver',
          pageTitle: 'Test Ride Waiver',
          title: 'Test Ride Waiver'
        }}
        currentPageId="test-ride-waiver"
        navigationItems={termsNavigationItems}
      >
        <TestRideWaiverForm />
      </TermsPage>
    </>
  );
} 