import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Terms' });

  return {
    title: t('title'),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Terms');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
          <p className="mb-6">
            By accessing and using the Ryddo website, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Products and Services</h2>
          <p className="mb-6">
            Ryddo provides electric vehicles, accessories, and related services. All products are 
            subject to availability and may be discontinued at any time.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <p className="mb-6">
            Your privacy is important to us. Please review our Privacy Policy to understand how we 
            collect, use, and protect your information.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Warranty</h2>
          <p className="mb-6">
            All products come with manufacturer warranties. Extended warranty options may be available 
            for purchase. Please refer to product documentation for specific warranty terms.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="mb-6">
            Ryddo shall not be liable for any damages arising from the use of our products or services, 
            except as required by law.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-6">
            If you have any questions about these Terms & Conditions, please contact us at 
            info@ryddo.com or (323) 676-7433.
          </p>
          
        </div>
      </div>
    </div>
  );
} 