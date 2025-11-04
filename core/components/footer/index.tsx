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

import Copyright from './copyright';
import { FooterFragment, FooterSectionsFragment } from './fragment';

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

    // Get Instagram link from social media
    const instagramLink = socialMediaLinks?.find((link) =>
      link.icon?.props?.title === 'Instagram'
    )?.href || 'https://instagram.com/ryddousa';

    return [
      {
        title: t('products'),
        links: sectionsData.categoryTree
          .map((category) => ({
            label: category.name,
            href: category.path,
          })),
      },
      {
        title: t('company'),
        links: [
          { label: t('aboutUs'), href: '/about/' },
          { label: t('theTeam'), href: '/team/' },
          { label: t('contactUs'), href: '/contact/' },
          { label: t('privacyPolicy'), href: '/privacy-policy/' },
        ],
      },
      {
        title: t('support'),
        links: [
          { label: t('emailUs'), href: '/contact/' },
          { label: t('suggestions'), href: '/suggestions/' },
          { label: t('chatLive'), href: '/chat/' },
          { label: t('returns'), href: '/returns/' },
          { label: t('exchanges'), href: '/exchanges/' },
        ],
      },
      {
        title: t('partnerWithRyddo'),
        links: [
          { label: t('dealerPrograms'), href: '/dealer-programs/' },
          { label: t('brandPrograms'), href: '/brand-programs/' },
        ],
        contact: {
          phone: '(323) 676-7433',
          email: 'hey@ryddo.com',
          instagram: instagramLink,
        },
      },
    ];
  });

  return (
    <FooterSection
      copyright={<Copyright />}
      sections={streamableSections}
    />
  );
};
