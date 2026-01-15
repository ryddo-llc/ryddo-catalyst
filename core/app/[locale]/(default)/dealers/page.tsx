import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/vibes/soul/sections/page-header';

import { type Dealer } from './components/dealer-card';
import { DealersGrid } from './components/dealers-grid';
import { DealersMap } from './components/dealers-map';

interface Props {
  params: Promise<{ locale: string }>;
}

// Placeholder dealer data - replace with actual data source
const placeholderDealers: Dealer[] = [
  {
    id: '1',
    name: 'Ryddo LA Showroom',
    address: '1234 Electric Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    phone: '(323) 555-0100',
    hours: 'Mon-Sat: 10am-7pm, Sun: 11am-5pm',
    coordinates: { lat: 34.0522, lng: -118.2437 },
  },
  {
    id: '2',
    name: 'Ryddo Orange County',
    address: '5678 Coast Hwy',
    city: 'Costa Mesa',
    state: 'CA',
    zip: '92626',
    phone: '(714) 555-0200',
    hours: 'Mon-Sat: 10am-7pm, Sun: 11am-5pm',
    coordinates: { lat: 33.6846, lng: -117.9087 },
  },
  {
    id: '3',
    name: 'Ryddo Santa Monica',
    address: '910 Ocean Blvd',
    city: 'Santa Monica',
    state: 'CA',
    zip: '90401',
    phone: '(310) 555-0300',
    hours: 'Mon-Sat: 10am-8pm, Sun: 11am-6pm',
    coordinates: { lat: 34.0195, lng: -118.4912 },
  },
  {
    id: '4',
    name: 'Ryddo Pasadena',
    address: '234 Colorado Blvd',
    city: 'Pasadena',
    state: 'CA',
    zip: '91101',
    phone: '(626) 555-0400',
    hours: 'Mon-Sat: 10am-7pm, Sun: 12pm-5pm',
    coordinates: { lat: 34.1478, lng: -118.1445 },
  },
  {
    id: '5',
    name: 'Ryddo Long Beach',
    address: '567 Shoreline Dr',
    city: 'Long Beach',
    state: 'CA',
    zip: '90802',
    phone: '(562) 555-0500',
    hours: 'Mon-Sat: 10am-7pm, Sun: 11am-5pm',
    coordinates: { lat: 33.7701, lng: -118.1937 },
  },
  {
    id: '6',
    name: 'Ryddo Irvine',
    address: '890 Spectrum Center',
    city: 'Irvine',
    state: 'CA',
    zip: '92618',
    phone: '(949) 555-0600',
    hours: 'Mon-Sat: 10am-8pm, Sun: 11am-6pm',
    coordinates: { lat: 33.6846, lng: -117.8265 },
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Dealers' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function DealersPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Dealers');

  const backgroundImage = {
    alt: 'Dealers background',
    src: '/images/backgrounds/contact-background.webp',
  };

  return (
    <>
      <PageHeader backgroundImage={backgroundImage} locale={locale} title={t('title')} />

      <section className="w-full py-16 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Your <span className="text-[#F92F7B]">Local Dealer</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <DealersMap dealers={placeholderDealers} />

          <div className="mt-12">
            <DealersGrid dealers={placeholderDealers} />
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Interested in Becoming a Dealer?
              </h3>
              <p className="text-gray-600 mb-6">
                Join the Ryddo dealer network and bring premium e-rides to your community.
              </p>
              <a
                className="inline-block bg-[#F92F7B] hover:bg-[#e0256d] text-white px-8 py-3 rounded-full font-semibold transition-colors"
                href="/contact/"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
