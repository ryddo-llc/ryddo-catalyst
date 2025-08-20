import { Organization, WithContext } from 'schema-dts';

export const OrganizationSchema = () => {
  const organizationSchema: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ryddo',
    description: 'Premium electric bikes and sustainable transportation solutions. From commuter e-bikes to mountain e-bikes, find the perfect electric bicycle for your lifestyle.',
    url: '/',
    logo: '/images/logo.png',
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
    },
    category: 'Electric Vehicles',
    keywords: 'electric bikes, e-bikes, electric bicycles, sustainable transportation, commuter bikes, mountain bikes'
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      type="application/ld+json"
    />
  );
};