import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/vibes/soul/sections/page-header';
import { imageManagerImageUrl } from '~/lib/store-assets';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function CartLayout({ children, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Cart' });

  return (
    <>
      <PageHeader
        backgroundImage={{
          alt: 'Shopping cart background',
          src: imageManagerImageUrl('cart.png', 'original'),
        }}
        locale={locale}
        title={t('title')}
      />
      {children}
    </>
  );
}