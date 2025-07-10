import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-lg mb-6">
              Have questions about our electric vehicles or need support? We're here to help!
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📞</span>
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600">(323) 676-7433</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✉️</span>
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600">info@ryddo.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📍</span>
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-600">
                    787 S Alameda St., Unit 120<br />
                    Los Angeles, CA 90021
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="https://instagram.com/ryddo" className="text-pink-500 hover:text-pink-600">
                Instagram
              </a>
              <a href="https://facebook.com/ryddo" className="text-pink-500 hover:text-pink-600">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 