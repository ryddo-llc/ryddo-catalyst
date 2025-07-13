import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ContactForm } from '@/vibes/soul/sections/contact-form';
import { PageHeader } from '@/vibes/soul/sections/page-header';

// Mock action, will replace with actual server action later
async function contactAction(_state: unknown, _formData: unknown) {
  'use server';

  void _state;
  void _formData;
  
  // Dummy await to satisfy linter
  await new Promise((resolve) => setTimeout(resolve, 0));
  
  // Contact form submission logic
  return {
    lastResult: null,
    successMessage: "Thank you! We've received your information and will be in touch soon.",
  };
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Contact' });

  return {
    title: t('title'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Contact');

  return (
    <>
      <PageHeader
        backgroundImage={{
          src: '/images/backgrounds/contact-background.webp',
          alt: 'Contact us background'
        }}
        title={t('title')}
      />
      
      <div 
        className="relative py-16 bg-cover bg-top"
        style={{
          backgroundImage: 'url(/images/backgrounds/map-background.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-blue-50 bg-opacity-70"/>
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-lg">
              <h2 className="text-5xl font-bold mb-4 text-gray-800 text-left">
                Get in<span className='text-pink-500'> Touch</span>
              </h2>
              <p className="text-md font-bold mb-6 text-gray-600">
                Have questions about our electric vehicles or need support? We're here to help!
              </p>
              <ContactForm action={contactAction} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 