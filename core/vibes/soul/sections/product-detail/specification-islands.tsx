'use client';

import { parseAsString, useQueryStates } from 'nuqs';
import React, { useCallback } from 'react';

import { Field } from './schema';

export interface SpecificationItemProps {
  field: Field;
}

export function SpecificationColorSwatches({ field }: SpecificationItemProps) {
  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: true }) } : {},
    { shallow: true } // Use shallow navigation for smooth transitions
  );

  const handleColorSelect = useCallback(
    async (value: string) => {
      try {
        await setParams({ [field.name]: value || null });
      } catch {
        // Silently handle navigation errors to maintain smooth UX
        // The UI will remain in its current state if update fails
      }
    },
    [setParams, field],
  );

  if (!('options' in field) || field.options.length === 0) return null;

  const currentValue = params[field.name];

  return (
    <div className="w-full @md:w-auto">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-900">
        Colors
      </div>
      <div className="flex flex-nowrap gap-1 @md:gap-2">
        {field.options.slice(0, 4).map((option, index) => {
          const label = typeof option === 'string' ? option : option.label;
          const value = typeof option === 'string' ? option : option.value;
          const isSelected = currentValue === value;

          return (
            <button
              aria-label={label}
              className={`group h-8 w-8 @md:h-9 @md:w-9 rounded-lg transition-all duration-200 ${
                isSelected ? 'bg-pink-50' : 'hover:bg-gray-50'
              }`}
              key={value || index}
              onClick={() => handleColorSelect(String(value))}
              type="button"
            >
              <div
                className={`h-full w-full rounded-md shadow-sm transition-all ${
                  isSelected ? 'ring-2 ring-[#F92F7B] ring-offset-1' : 'border border-gray-300'
                }`}
                style={{
                  backgroundColor:
                    field.type === 'swatch-radio-group' &&
                    typeof option === 'object' &&
                    'type' in option &&
                    option.type === 'color' &&
                    'color' in option
                      ? String(option.color)
                      : '#ccc',
                }}
                title={label}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SpecificationSizeBadges({ field }: SpecificationItemProps) {
  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: true }) } : {},
    { shallow: true } // Use shallow navigation for smooth transitions
  );

  const handleSizeSelect = useCallback(
    async (value: string) => {
      try {
        await setParams({ [field.name]: value || null });
      } catch {
        // Silently handle navigation errors to maintain smooth UX
        // The UI will remain in its current state if update fails
      }
    },
    [setParams, field],
  );

  if (!('options' in field) || field.options.length === 0) return null;

  const currentValue = params[field.name];

  return (
    <div className="w-full @md:w-auto">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-900">
        Sizes
      </div>
      <div className="flex flex-nowrap gap-1 @md:gap-2">
        {field.options.slice(0, 5).map((option, index) => {
          const label = typeof option === 'string' ? option : option.label;
          const value = typeof option === 'string' ? option : option.value;
          const isSelected = currentValue === value;

          return (
            <button
              aria-label={`Size ${label}`}
              className={`flex h-8 w-8 @md:h-9 @md:w-9 items-center justify-center rounded-md text-xs font-bold uppercase shadow-sm transition-all duration-200 ${
                isSelected
                  ? 'bg-[#F92F7B] text-white ring-2 ring-[#F92F7B] ring-offset-1'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              key={value || index}
              onClick={() => handleSizeSelect(String(value))}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Additional interactive specification components can be added here
export function SpecificationFeatureList({ features }: { features: string[] }) {
  return (
    <div className="text-left">
      <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">
        Key Features
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li className="flex items-center gap-2 text-sm text-gray-600" key={index}>
            <div className="h-1.5 w-1.5 rounded-full bg-[#F92F7B]" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpecificationTechDetails({
  details,
}: {
  details: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="text-left">
      <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">
        Technical Details
      </div>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div className="flex items-center justify-between text-sm" key={index}>
            <span className="text-gray-600">{detail.label}:</span>
            <span className="font-medium text-gray-900">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
