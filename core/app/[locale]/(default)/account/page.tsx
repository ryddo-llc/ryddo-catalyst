import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'MyAccount' });

  return {
    title: t('title'),
  };
}

export default async function MyAccountPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('MyAccount');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Account Access</h2>
          <p className="text-gray-700 mb-4">
            This is a placeholder page. To access your account features, please use the main account section.
          </p>
          <ButtonLink href="/account" variant="primary">
            Go to Account Dashboard
          </ButtonLink>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <ButtonLink href="/account/orders" variant="secondary" className="w-full justify-start">
                View Orders
              </ButtonLink>
              <ButtonLink href="/account/wishlists" variant="secondary" className="w-full justify-start">
                My Wishlists
              </ButtonLink>
              <ButtonLink href="/account/addresses" variant="secondary" className="w-full justify-start">
                Addresses
              </ButtonLink>
              <ButtonLink href="/account/settings" variant="secondary" className="w-full justify-start">
                Account Settings
              </ButtonLink>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Account Benefits</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-pink-500 mr-2">✓</span>
                Fast checkout process
              </li>
              <li className="flex items-center">
                <span className="text-pink-500 mr-2">✓</span>
                Save multiple addresses
              </li>
              <li className="flex items-center">
                <span className="text-pink-500 mr-2">✓</span>
                Order history tracking
              </li>
              <li className="flex items-center">
                <span className="text-pink-500 mr-2">✓</span>
                Wishlist management
              </li>
              <li className="flex items-center">
                <span className="text-pink-500 mr-2">✓</span>
                Exclusive member offers
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 