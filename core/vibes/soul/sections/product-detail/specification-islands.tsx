'use client';

import { parseAsString, useQueryStates } from 'nuqs';
import React, { useCallback } from 'react';

import { Field } from './schema';

export interface SpecificationItemProps {
  title: string;
  field: Field;
}

export function SpecificationColorSwatches({ title, field }: SpecificationItemProps) {
  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: false }) } : {},
  );

  const handleColorSelect = useCallback(
    (value: string) => {
      void setParams({ [field.name]: value || null });
    },
    [setParams, field],
  );

  if (!('options' in field) || field.options.length === 0) return null;

  const currentValue = params[field.name];

  return (
    <div className="text-left">
      <div className="mb-2 @md:mb-3 text-xs @md:text-sm font-semibold uppercase tracking-wider text-gray-900">{title}</div>
      <div className="flex flex-wrap gap-2 @md:gap-3">
        {field.options.map((option, index) => {
          const label = typeof option === 'string' ? option : option.label;
          const value = typeof option === 'string' ? option : option.value;
          const isSelected = currentValue === value;

          return (
            <button
              className={`group flex flex-col items-center gap-1 @md:gap-2 rounded-lg p-2 @md:p-3 min-h-[44px] transition-all ${
                isSelected 
                  ? 'bg-pink-50 ring-2 ring-[#F92F7B]' 
                  : 'hover:bg-gray-50'
              }`}
              key={value || index}
              onClick={() => handleColorSelect(String(value))}
              type="button"
            >
              <div
                className={`h-6 w-6 @md:h-8 @md:w-8 rounded-md border shadow-sm transition-all ${
                  isSelected ? 'ring-2 ring-[#F92F7B] ring-offset-2' : 'border-gray-300'
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
              <span 
                className={`text-xs font-medium transition-colors ${
                  isSelected ? 'text-[#F92F7B]' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SpecificationSizeBadges({ title, field }: SpecificationItemProps) {
  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: false }) } : {},
  );

  const handleSizeSelect = useCallback(
    (value: string) => {
      void setParams({ [field.name]: value || null });
    },
    [setParams, field],
  );

  if (!('options' in field) || field.options.length === 0) return null;

  const currentValue = params[field.name];

  return (
    <div className="text-left">
      <div className="mb-2 @md:mb-3 text-xs @md:text-sm font-semibold uppercase tracking-wider text-gray-900">{title}</div>
      <div className="flex flex-wrap gap-2 @md:gap-3">
        {field.options.map((option, index) => {
          const label = typeof option === 'string' ? option : option.label;
          const value = typeof option === 'string' ? option : option.value;
          const isSelected = currentValue === value;

          return (
            <button
              className={`group flex flex-col items-center gap-1 @md:gap-2 rounded-lg p-2 @md:p-3 min-h-[44px] transition-all ${
                isSelected 
                  ? 'bg-pink-50 ring-2 ring-[#F92F7B]' 
                  : 'hover:bg-gray-50'
              }`}
              key={value || index}
              onClick={() => handleSizeSelect(String(value))}
              type="button"
            >
              <div
                className={`flex h-6 w-6 @md:h-8 @md:w-8 items-center justify-center rounded-md border shadow-sm transition-all ${
                  isSelected 
                    ? 'border-[#F92F7B] bg-[#F92F7B] text-white' 
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <span className="text-xs font-bold uppercase">{label}</span>
              </div>
              <span 
                className={`text-xs font-medium transition-colors ${
                  isSelected ? 'text-[#F92F7B]' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
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
      <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">Key Features</div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li 
            className="flex items-center gap-2 text-sm text-gray-600"
            key={index}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-[#F92F7B]" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpecificationTechDetails({ 
  details 
}: { 
  details: Array<{ label: string; value: string }> 
}) {
  return (
    <div className="text-left">
      <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">Technical Details</div>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div 
            className="flex justify-between items-center text-sm"
            key={index}
          >
            <span className="text-gray-600">{detail.label}:</span>
            <span className="font-medium text-gray-900">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}