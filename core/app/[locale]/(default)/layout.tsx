import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { Subscribe } from '~/components/subscribe';
import PartnersContactBar from '~/components/partner-contact-banner';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="max-w-screen-8xl flex flex-col">
      <Header />

      <main className="flex-grow">{children}</main>

      <Subscribe />

      <Footer />

      {/* Partners Contact Bar - Fixed at bottom of viewport */}

      <PartnersContactBar />
    </div>
  );
}

export const experimental_ppr = true;
