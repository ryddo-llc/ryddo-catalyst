import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { ReactNode } from 'react';

import { extractFeatureFields } from '~/lib/extract-feature-fields';

import { getProduct } from '../page-data';

// Type alias for translation function
type TranslationFunction = Awaited<ReturnType<typeof import('next-intl/server').getTranslations>>;

interface ProcessedCustomFields {
  features: ReturnType<typeof extractFeatureFields>;
  showcaseDescription: string | null;
  techSpecFields: {
    Power: Array<{ name: string; value: string }>;
    Components: Array<{ name: string; value: string }>;
    Safety: Array<{ name: string; value: string }>;
    Other: Array<{ name: string; value: string }>;
  };
  accordions: Array<{
    title: string;
    content: ReactNode;
  }>;
}

/**
 * Extract and process all custom field data in a single pass
 * @param product - The product data from BigCommerce
 * @param t - Translation function from next-intl
 * @returns Processed custom fields including features, descriptions, tech specs, and accordions
 */
export function processCustomFields(
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>,
  t: TranslationFunction,
): ProcessedCustomFields {
  const customFields = removeEdgesAndNodes(product.customFields);

  // Extract carousel features
  const features = extractFeatureFields(product.customFields);

  // Extract showcase description
  const showcaseDescField = customFields.find(
    (f) => f.name.trim().toLowerCase() === 'showcase_description',
  );
  const showcaseDescription = showcaseDescField?.value.trim() || null;

  // Process TechSpec fields
  const techSpecFieldNames = {
    Power: ['Battery', 'Charge Time', 'Class', 'Motor/s', 'Speed-Tech', 'Pedal Assist'],
    Components: ['Brakes', 'Class', 'Frame Material', 'Speed', 'Tires', 'Throttle'],
    Safety: [
      'Brake Lights',
      'Class',
      'Headlights',
      'Mobile App',
      'Speed',
      'Horn',
      'Tail Light',
      'Turn Signals',
    ],
    Other: ['Color', 'Class', 'Max Load', 'Model', 'Speed', 'Display', 'Seat Height'],
  };

  const techSpecFields = {
    Power: customFields.filter((field) => techSpecFieldNames.Power.includes(field.name)),
    Components: customFields.filter((field) => techSpecFieldNames.Components.includes(field.name)),
    Safety: customFields.filter((field) => techSpecFieldNames.Safety.includes(field.name)),
    Other: customFields.filter((field) => techSpecFieldNames.Other.includes(field.name)),
  };

  // Build accordions
  const specifications = [
    { name: t('ProductDetails.Accordions.sku'), value: product.sku },
    {
      name: t('ProductDetails.Accordions.weight'),
      value: `${product.weight?.value} ${product.weight?.unit}`,
    },
    { name: t('ProductDetails.Accordions.condition'), value: product.condition },
    ...customFields.map((field) => ({ name: field.name, value: field.value })),
  ];

  const accordions = [
    ...(specifications.length
      ? [
          {
            title: t('ProductDetails.Accordions.specifications'),
            content: (
              <div className="prose @container">
                <dl className="flex flex-col gap-4">
                  {specifications.map((field, index) => (
                    <div className="grid grid-cols-1 gap-2 @lg:grid-cols-2" key={index}>
                      <dt>
                        <strong>{field.name}</strong>
                      </dt>
                      <dd>{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ),
          },
        ]
      : []),
    ...(product.warranty
      ? [
          {
            title: t('ProductDetails.Accordions.warranty'),
            content: <div className="prose" dangerouslySetInnerHTML={{ __html: product.warranty }} />,
          },
        ]
      : []),
  ];

  return { features, showcaseDescription, techSpecFields, accordions };
}
