import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">
            Welcome to Ryddo - your premier destination for electric vehicles and sustainable transportation solutions.
          </p>
          <p className="mb-6">
            At Ryddo, we're passionate about revolutionizing the way people move. Our mission is to make electric mobility 
            accessible, affordable, and enjoyable for everyone. We believe that the future of transportation is electric, 
            and we're here to help you be part of that future.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="mb-6">
            Founded with a vision to clean up the air one EV at a time, Ryddo has grown from a small passion project 
            into a trusted name in electric mobility. We're turning our hobbies and passions into a business, and we 
            hope you'll come along for the ride.
          </p>
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside mb-6">
            <li>Premium electric scooters and e-bikes</li>
            <li>Expert consultation and support</li>
            <li>Comprehensive warranty and service</li>
            <li>Sustainable transportation solutions</li>
          </ul>
          <p className="text-lg">
            Join us in building a cleaner, more sustainable future. Every ride counts!
          </p>
        </div>
      </div>
    </div>
  );
} 