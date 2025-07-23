import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/vibes/soul/sections/page-header';
import { PrivacyPolicyContent } from '~/components/terms-page/privacy-policy-content';
import { PrivacyPolicyPage } from '~/components/terms-page/privacy-policy-page';
import { privacyPolicyContent, termsNavigationItems } from '~/lib/data/terms-conditions';

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateMetadata(): Metadata {
  return {
    title: 'Privacy Policy - Ryddo',
  };
}

export default async function PrivacyPolicyPageComponent({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const backgroundImage = {
    alt: 'Privacy policy background',
    src: '/images/backgrounds/terms-background.webp',
  };

  return (
    <>
      <PageHeader 
        backgroundImage={backgroundImage}
        locale={locale}
        title={privacyPolicyContent.pageTitle || privacyPolicyContent.title}
      />
      <PrivacyPolicyPage
        content={privacyPolicyContent}
        currentPageId="privacy-policy"
        navigationItems={termsNavigationItems}
      >
        <PrivacyPolicyContent accordionItems={privacyPolicyContent.accordionItems} />
      </PrivacyPolicyPage>
    </>
  );
} 