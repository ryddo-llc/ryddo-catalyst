'use client';

import { clsx } from 'clsx';

import type { TechSpecsSectionProps } from '../types';

import { ExpandableContent } from './expandable-content';
import { SpecItem } from './spec-item';

export const TechSpecsSection = ({
  section,
  isExpanded,
  onToggle,
  specs,
}: TechSpecsSectionProps) => {
  return (
    <div>
      <button
        className="flex w-full items-center justify-between pt-4 pb-2 text-left transition-colors duration-200 md:pt-6 md:pb-3"
        onClick={() => onToggle(section.key)}
      >
        <h2
          className={`font-kanit text-xl font-bold sm:text-2xl md:text-3xl ${
            isExpanded ? 'text-[#F92F7B]' : 'text-black'
          }`}
        >
          {section.title}
        </h2>
        <div className="mx-4 h-px flex-1 bg-gray-300 sm:mx-6" />
        <div className="flex items-center">
          <div className="relative">
            <span
              className={clsx(
                'font-kanit text-4xl font-normal transition-all duration-700 ease-in-out md:text-5xl',
                isExpanded
                  ? 'rotate-90 scale-90 text-[#F92F7B] opacity-0'
                  : 'rotate-0 scale-100 text-black opacity-100',
              )}
            >
              +
            </span>
            <span
              className={clsx(
                'absolute left-0 top-0 font-kanit text-4xl font-normal transition-all duration-700 ease-in-out md:text-5xl',
                isExpanded
                  ? 'rotate-0 scale-100 text-[#F92F7B] opacity-100'
                  : '-rotate-90 scale-90 text-black opacity-0',
              )}
            >
              −
            </span>
          </div>
        </div>
      </button>

      <div className="-mt-1">
        <ExpandableContent isExpanded={isExpanded}>
        <div>
          {!section.hasContent || !specs ? (
            <div className="rounded-lg p-2 md:p-4">
              <p className="text-base text-gray-600 md:text-lg">
                No {section.title.toLowerCase()} specifications available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-4">
              {specs.map((spec, specIndex) => (
                <SpecItem key={specIndex} spec={spec} />
              ))}
            </div>
          )}
        </div>
      </ExpandableContent>
      </div>
    </div>
  );
};
