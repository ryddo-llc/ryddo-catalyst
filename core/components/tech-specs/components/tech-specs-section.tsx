'use client';

import { clsx } from 'clsx';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

import type { TechSpecsSectionProps } from '../types';

import { ExpandableContent } from './expandable-content';
import { SpecItem } from './spec-item';

export const TechSpecsSection = ({ section, isExpanded, onToggle, specs }: TechSpecsSectionProps) => {
  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-4 text-left transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 md:py-6"
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
            <AiOutlinePlus
              className={clsx(
                'duration-400 h-6 w-6 transition-all ease-in-out md:h-8 md:w-8',
                isExpanded
                  ? 'rotate-90 scale-90 text-[#F92F7B] opacity-0'
                  : 'rotate-0 scale-100 text-black opacity-100',
              )}
            />
            <AiOutlineMinus
              className={clsx(
                'duration-400 absolute left-0 top-0 h-6 w-6 transition-all ease-in-out md:h-8 md:w-8',
                isExpanded
                  ? 'rotate-0 scale-100 text-[#F92F7B] opacity-100'
                  : '-rotate-90 scale-90 text-black opacity-0',
              )}
            />
          </div>
        </div>
      </button>

      <ExpandableContent isExpanded={isExpanded}>
        <div className="pb-6 md:pb-8">
          {!section.hasContent || !specs ? (
            <div className="rounded-lg p-4 md:p-6">
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
  );
};