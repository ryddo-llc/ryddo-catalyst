import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BrandShowcase } from '~/components/brand-showcase';
import { Image } from '~/components/image';
import { LegitBrands } from '~/components/legit-brands';
import { MarketplaceShowcase } from '~/components/marketplace-showcase';
import { ProcessSection } from '~/components/process-section';
import { imageManagerImageUrl } from '~/lib/store-assets';

import { OrganizationSchema } from './_components/organization-schema';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');

  const pageDescription =
    'Discover premium electric bikes at Ryddo. From commuter e-bikes to mountain e-bikes, find the perfect electric bicycle for your lifestyle. Free shipping, expert support, and financing available.';

  return {
    title: t('title'),
    description: pageDescription,
    keywords: [
      'electric bikes',
      'e-bikes',
      'electric bicycles',
      'commuter bikes',
      'mountain bikes',
      'sustainable transportation',
    ],
    openGraph: {
      type: 'website',
      title: t('title'),
      description: pageDescription,
      siteName: 'Ryddo',
      url: '/',
      images: [
        {
          url: imageManagerImageUrl('og-home.png', 'original'),
          width: 1200,
          height: 630,
          alt: 'Ryddo - Premium Electric Bikes',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: pageDescription,
      images: [imageManagerImageUrl('og-home.png', 'original')],
    },
    alternates: {
      canonical: '/',
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');

  return (
    <div className="pb-20">
      {/* OpenClaw Integration Test Badge */}
      <div className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center py-3 px-4 text-lg font-bold shadow-lg">
        🤖 OpenClaw is LIVE! - Test Badge Working ✅
      </div>
      <div className="absolute left-1/2 top-0 -z-10 h-[270vh] w-screen -translate-x-1/2">
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover object-top"
          fill
          preload
          sizes="100vw"
          src={imageManagerImageUrl('home-page-bg.png', 'original')}
        />
      </div>
      <OrganizationSchema />
      <MarketplaceShowcase imageUrl={imageManagerImageUrl('hero-bg-v2.png', 'original')} />
      <BrandShowcase
        adventureGuarantee={{
          title: t('BrandShowcase.adventureGuarantee.title'),
          description: t('BrandShowcase.adventureGuarantee.description'),
        }}
        certifiedPreOwned={{
          title: t('BrandShowcase.certifiedPreOwned.title'),
          description: t('BrandShowcase.certifiedPreOwned.description'),
        }}
        certifiedService={{
          title: t('BrandShowcase.certifiedService.title'),
          description: t('BrandShowcase.certifiedService.description'),
        }}
        heading={{
          prefix: t('BrandShowcase.heading.prefix'),
          highlight: t('BrandShowcase.heading.highlight'),
        }}
        imageUrl={imageManagerImageUrl('rethink-the-ride-bg.png', 'original')}
        sameDayDelivery={{
          title: t('BrandShowcase.sameDayDelivery.title'),
          description: t('BrandShowcase.sameDayDelivery.description'),
        }}
        subtitle={{
          highlight: t('BrandShowcase.subtitle.highlight'),
          rest: t('BrandShowcase.subtitle.rest'),
        }}
        tradeInUp={{
          title: t('BrandShowcase.tradeInUp.title'),
          description: t('BrandShowcase.tradeInUp.description'),
        }}
      />

      <LegitBrands
        className="mb-12"
        description={t('LegitBrands.description')}
        imageAlt={t('LegitBrands.imageAlt')}
        imageUrl={imageManagerImageUrl('legit-brands-image1.png', 'original')}
        linkText={{
          highlight: t('LegitBrands.linkText.highlight'),
          rest: t('LegitBrands.linkText.rest'),
        }}
        title={{
          line1: t('LegitBrands.title.line1'),
          line2: t('LegitBrands.title.line2'),
          line2Highlight: t('LegitBrands.title.line2Highlight'),
          line3: t('LegitBrands.title.line3'),
          line4: t('LegitBrands.title.line4'),
          line5: t('LegitBrands.title.line5'),
        }}
      />

      <ProcessSection
        howItWorksTitle={t('ProcessSection.howItWorks.title')}
        imageUrl={imageManagerImageUrl('process-bg.png', 'original')}
        quote={{
          segments: [
            { text: '\u201CRyddo is', highlight: true },
            { text: ' doing what the ' },
            { text: 'industry', highlight: true },
            { text: ' has', lineBreakAfter: true },
            { text: 'needed ' },
            { text: 'for years.\u201D', highlight: true },
          ],
          author: t('ProcessSection.quote.author'),
        }}
        rolloutCards={[
          {
            badge: t('ProcessSection.rollout.cards.online.badge'),
            imageUrl: imageManagerImageUrl('rollout-online-image.png', 'original'),
            title: t('ProcessSection.rollout.cards.online.title'),
            subtitle: t('ProcessSection.rollout.cards.online.subtitle'),
            description: t('ProcessSection.rollout.cards.online.description'),
          },
          {
            badge: t('ProcessSection.rollout.cards.kiosk.badge'),
            imageUrl: imageManagerImageUrl('rollout-kisok-image.png', 'original'),
            title: t('ProcessSection.rollout.cards.kiosk.title'),
            subtitle: t('ProcessSection.rollout.cards.kiosk.subtitle'),
            description: t('ProcessSection.rollout.cards.kiosk.description'),
          },
          {
            badge: t('ProcessSection.rollout.cards.inStore.badge'),
            imageUrl: imageManagerImageUrl('rollout-in-store-image.png', 'original'),
            title: t('ProcessSection.rollout.cards.inStore.title'),
            subtitle: t('ProcessSection.rollout.cards.inStore.subtitle'),
            description: t('ProcessSection.rollout.cards.inStore.description'),
          },
        ]}
        rolloutSubtitle={t('ProcessSection.rollout.subtitle')}
        rolloutTitle={t('ProcessSection.rollout.title')}
        steps={[
          {
            number: t('ProcessSection.howItWorks.steps.step01.number'),
            description: t('ProcessSection.howItWorks.steps.step01.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step02.number'),
            description: t('ProcessSection.howItWorks.steps.step02.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step03.number'),
            description: t('ProcessSection.howItWorks.steps.step03.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step04.number'),
            description: t('ProcessSection.howItWorks.steps.step04.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step05.number'),
            description: t('ProcessSection.howItWorks.steps.step05.description'),
          },
          {
            number: t('ProcessSection.howItWorks.steps.step06.number'),
            description: t('ProcessSection.howItWorks.steps.step06.description'),
          },
        ]}
      />
    </div>
  );
}
