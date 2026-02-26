import { Organization, WithContext } from 'schema-dts';

import { buildConfig } from '~/build-config/reader';

export const OrganizationSchema = () => {
  const baseUrl = buildConfig.get('urls').vanityUrl;

  const organizationSchema: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ryddo',
    description: 'Premium electric bikes and sustainable transportation solutions. From commuter e-bikes to mountain e-bikes, find the perfect electric bicycle for your lifestyle.',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English'
    },
    sameAs: [
      // Add social media URLs when available
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    brand: {
      '@type': 'Brand',
      name: 'Ryddo'
    }
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      type="application/ld+json"
    />
  );
};