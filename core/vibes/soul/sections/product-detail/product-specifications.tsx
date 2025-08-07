import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';

import { Field } from './schema';
import { SpecificationColorSwatches, SpecificationSizeBadges } from './specification-islands';

// Helper function to identify variant fields (color/size)
const isVariantField = (field: Field): boolean => {
  const variantTypes = ['swatch-radio-group', 'button-radio-group', 'card-radio-group'];
  const variantNames = ['color', 'colour', 'size', 'variant'];

  return (
    variantTypes.includes(field.type) ||
    variantNames.some((name) => field.name.toLowerCase().includes(name))
  );
};

// Helper function to create specification item for horizontal layout
const createSpecificationItem = (title: string, content: ReactNode, index: number) => (
  <div className="min-w-[80px] text-center @md:min-w-[100px] @lg:min-w-[120px]" key={index}>
    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-900 @md:text-sm">{title}</div>
    <div className="text-xs font-medium text-gray-600 @md:text-sm">{content}</div>
  </div>
);

export interface ProductSpecificationsProps {
  fields?: Streamable<Field[]>;
  customSpecs?: Array<{
    title: string;
    content: ReactNode;
  }>;
  showVariantInteractions?: boolean;
}

export function ProductSpecifications({
  fields,
  customSpecs = [],
  showVariantInteractions = true,
}: ProductSpecificationsProps) {
  // Default specifications when no custom ones provided
  const allSpecs = [
    {
      title: 'Weight',
      content: '2.5 lbs',
    },
    {
      title: 'Construction',
      content: 'Aluminum Frame',
    },
    {
      title: 'Finish',
      content: 'Powder Coated',
    },
    {
      title: 'Certified',
      content: 'CE, UL Listed',
    },
    {
      title: 'Warranty',
      content: '2 Year Limited',
    },
    {
      title: 'Origin',
      content: 'Made in USA',
    },
  ];

  const defaultSpecs = allSpecs;

  const specsToShow = customSpecs.length > 0 ? customSpecs : defaultSpecs;

  return (
    <section className="w-full">
      <div className="@md:overflow-x-auto">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 @md:px-10 @md:py-8 @xl:px-6 @4xl:px-8">
          {/* Single line layout on tablets and up */}
          <div className="flex flex-wrap items-center justify-center gap-3 @md:flex-nowrap @md:gap-6 @md:justify-start @lg:gap-8">
            {/* Interactive variant sections - only show if fields provided and interactions enabled */}
            {fields && showVariantInteractions && (
              <Stream fallback={null} value={fields}>
                {(fieldsData) => {
                  const variantFields = fieldsData.filter(isVariantField);

                  // Find color and size fields
                  const colorField =
                    variantFields.find(
                      (field) =>
                        field.name.toLowerCase().includes('color') ||
                        field.name.toLowerCase().includes('colour'),
                    ) || variantFields[0];

                  const sizeField =
                    variantFields.find((field) => field.name.toLowerCase().includes('size')) ||
                    variantFields[1];

                  return (
                    <>
                      {/* Colors section - interactive client island */}
                      {colorField && (
                        <div className="flex-shrink-0 @md:min-w-fit">
                          <SpecificationColorSwatches field={colorField} title="Available Colors" />
                        </div>
                      )}

                      {/* Sizes section - interactive client island */}
                      {sizeField && (
                        <div className="flex-shrink-0 @md:min-w-fit">
                          <SpecificationSizeBadges field={sizeField} title="Available Sizes" />
                        </div>
                      )}
                    </>
                  );
                }}
              </Stream>
            )}

            {/* Static specifications - all in one line on tablets+ */}
            {specsToShow.map((spec, index) => (
              <div className="flex-shrink-0" key={index}>
                {createSpecificationItem(spec.title, spec.content, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
