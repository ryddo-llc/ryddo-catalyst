// import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client'; // Commented out as not currently used
import {
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons';
import { getTranslations } from 'next-intl/server';
import { cache, JSX } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { Footer as FooterSection } from '@/vibes/soul/sections/footer';
import { GetLinksAndSectionsQuery, LayoutQuery } from '~/app/[locale]/(default)/page-data';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { readFragment } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

import ContactSection from './contact-section';
import Copyright from './copyright';
import { FooterFragment, FooterSectionsFragment } from './fragment';
import InfoSection from './info-section';

const socialIcons: Record<string, { icon: JSX.Element }> = {
  Facebook: { icon: <SiFacebook title="Facebook" /> },
  Twitter: { icon: <SiX title="Twitter" /> },
  X: { icon: <SiX title="X" /> },
  Pinterest: { icon: <SiPinterest title="Pinterest" /> },
  Instagram: { icon: <SiInstagram title="Instagram" /> },
  YouTube: { icon: <SiYoutube title="YouTube" /> },
};

const getFooterSections = cache(async (customerAccessToken?: string) => {
  const { data: response } = await client.fetch({
    document: GetLinksAndSectionsQuery,
    customerAccessToken,
    // Since this query is needed on every page, it's a good idea not to validate the customer access token.
    // The 'cache' function also caches errors, so we might get caught in a redirect loop if the cache saves an invalid token error response.
    validateCustomerAccessToken: false,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });

  return readFragment(FooterSectionsFragment, response).site;
});

const getFooterData = cache(async () => {
  const { data: response } = await client.fetch({
    document: LayoutQuery,
    fetchOptions: { next: { revalidate } },
  });

  return readFragment(FooterFragment, response).site;
});

export const Footer = async () => {
  const t = await getTranslations('Components.Footer');

  const data = await getFooterData();

  const socialMediaLinks = data.settings?.socialMediaLinks
    .filter((socialMediaLink) => Boolean(socialIcons[socialMediaLink.name]))
    .map((socialMediaLink) => ({
      href: socialMediaLink.url,
      icon: socialIcons[socialMediaLink.name]?.icon,
    }));

  const streamableSections = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();

    const sectionsData = await getFooterSections(customerAccessToken);

    return [
      {
        title: t('shop'),
        links: sectionsData.categoryTree
          // filter out service category in footer
          .filter((category) => category.name.toLowerCase() !== 'service')
          .map((category) => ({
            label: category.name,
            href: category.path,
          })),
      },
      {
        title: t('explore'),
        links: [
          { label: 'About', href: '/about' },
          { label: 'Terms & Conditions', href: '/terms&conditions' },
          { label: 'My Account', href: '/account' },
          { label: 'Contact Us', href: '/contact' },
        ],
      },
    ];
  });

  return (
    <FooterSection
      contactSection={<ContactSection />}
      copyright={<Copyright />}
      infoSection={<InfoSection />}
      sections={streamableSections}
      socialMediaLinks={socialMediaLinks}
    />
  );
};
