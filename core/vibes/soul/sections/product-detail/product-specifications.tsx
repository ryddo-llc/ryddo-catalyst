'use client';

import { ReactNode, useState } from 'react';

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
  <div className="flex-1 text-center" key={index}>
    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-900">{title}</div>
    <div className="text-xs font-medium text-gray-600">{content}</div>
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
  const [isExpanded, setIsExpanded] = useState(false);
  
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
  // Show fewer specs on tablet to fit in one line
  const desktopSpecs = specsToShow.slice(0, 4);
  
  // Show only key specs on mobile when collapsed
  const mobileSpecs = specsToShow.slice(0, 3);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-screen-2xl px-4 py-4 @md:px-10 @md:py-8 @xl:px-6 @4xl:px-8">
        {/* Mobile Layout - Stacked */}
        <div className="space-y-4 @md:hidden">
          {/* Variant sections for mobile */}
          {fields && showVariantInteractions && (
            <Stream fallback={null} value={fields}>
              {(fieldsData) => {
                const variantFields = fieldsData.filter(isVariantField);
                const colorField = variantFields.find(
                  (field) =>
                    field.name.toLowerCase().includes('color') ||
                    field.name.toLowerCase().includes('colour'),
                ) || variantFields[0];
                const sizeField = variantFields.find((field) => 
                  field.name.toLowerCase().includes('size')
                ) || variantFields[1];

                return (
                  <div className="space-y-4">
                    {colorField && (
                      <SpecificationColorSwatches field={colorField} />
                    )}
                    {sizeField && (
                      <SpecificationSizeBadges field={sizeField} />
                    )}
                  </div>
                );
              }}
            </Stream>
          )}
          
          {/* Collapsible specifications for mobile */}
          <div className="border-t border-gray-200 pt-4">
            <button
              aria-expanded={isExpanded}
              className="flex w-full items-center justify-between text-left"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Product Details
              </span>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </button>
            
            {/* Specs content */}
            <div className={`mt-3 grid grid-cols-2 gap-3 ${isExpanded ? 'block' : 'hidden'}`}>
              {specsToShow.map((spec, index) => (
                <div className="text-left" key={index}>
                  <div className="text-xs font-medium text-gray-500">{spec.title}</div>
                  <div className="text-sm font-semibold text-gray-900">{spec.content}</div>
                </div>
              ))}
            </div>
            
            {/* Show preview when collapsed */}
            {!isExpanded && (
              <div className="mt-3 flex gap-4 text-xs text-gray-600">
                {mobileSpecs.map((spec, index) => (
                  <span key={index}>
                    <span className="font-medium">{spec.title}:</span> {spec.content}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop/Tablet Layout - Single row */}
        <div className="hidden @md:block">
          <div className="flex items-start justify-between gap-3">
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
                        <div className="flex-shrink-0">
                          <SpecificationColorSwatches field={colorField} />
                        </div>
                      )}

                      {/* Sizes section - interactive client island */}
                      {sizeField && (
                        <div className="flex-shrink-0">
                          <SpecificationSizeBadges field={sizeField} />
                        </div>
                      )}
                    </>
                  );
                }}
              </Stream>
            )}

            {/* Static specifications - single row, limited items */}
            {desktopSpecs.map((spec, index) => (
              <div className="flex-1 min-w-0" key={index}>
                {createSpecificationItem(spec.title, spec.content, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
