import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { getBannersData } from '~/app/[locale]/(default)/page-data';
import { getSessionCustomerAccessToken } from '~/auth';
import { InventoryProvider } from '~/components/contexts/inventory-context';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import PartnersContactBar from '~/components/partner-contact-banner';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const streamableBanners = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const data = await getBannersData(customerAccessToken);

    // Flatten edges/nodes structure
    const homePageBanners = data.site.content.banners?.homePage
      ? removeEdgesAndNodes(data.site.content.banners.homePage)
      : [];

    // Filter banners by location and return both
    const topBanners = homePageBanners.filter((banner) => banner.location === 'TOP');
    const bottomBanners = homePageBanners.filter((banner) => banner.location === 'BOTTOM');

    return {
      topBanners,
      bottomBanners,
    };
  });

  return (
    <InventoryProvider>
      <div className="flex min-h-screen flex-col">
        {/* Header wrapper */}
        <div className="w-full pt-2">
          <div className="mx-auto max-w-[1400px] rounded-t-[30px] bg-white">
            <Header banners={streamableBanners} />
          </div>
        </div>

        <main className="flex-grow">
          <div className="w-full">
            <div className="mx-auto max-w-[1400px]">{children}</div>
          </div>

          <div className="mt-20">
            <Footer backgroundExtensionHeight="400px" backgroundPositionY="0%" />
          </div>
        </main>

        {/* Partners Contact Bar - Fixed at bottom of viewport */}

        <PartnersContactBar banners={streamableBanners} />
      </div>
    </InventoryProvider>
  );
}

// export const experimental_ppr = true; // Temporarily disabled to test account routing
