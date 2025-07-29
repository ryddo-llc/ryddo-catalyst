'use client';

import { clsx } from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import type { ProductSpecification } from '~/components/product/shared/product-specifications';

type SectionKey = 'power' | 'components' | 'safety' | 'other';

interface TechSpecsSection {
  key: SectionKey;
  title: string;
  hasContent: boolean;
}

interface TechSpecsProps {
  powerSpecs?: Streamable<ProductSpecification[] | null>;
}

interface ExpandableContentProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

// Skeleton components
const TechSpecsSkeleton = () => {
  return (
    <div className="max-w-8xl mx-auto bg-[#F5F5F5] p-4 sm:p-6 md:p-10 lg:p-16">
      {/* Header Skeleton */}
      <div className="mb-8 md:mb-12">
        <Skeleton.Root pending>
          <Skeleton.Box className="mb-2 h-12 w-32 md:h-16 md:w-40" />
          <Skeleton.Box className="h-12 w-36 md:h-16 md:w-44" />
        </Skeleton.Root>
      </div>

      {/* Sections Skeleton */}
      <div className="space-y-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton.Root pending>
              <div className="flex w-full items-center justify-between py-4 md:py-6">
                <Skeleton.Box className="h-6 w-24 md:h-8 md:w-32" />
                <div className="mx-6 flex-1">
                  <Skeleton.Box className="h-px w-full" />
                </div>
                <Skeleton.Box className="h-6 w-6 md:h-8 md:w-8" />
              </div>
            </Skeleton.Root>

            {index === 0 && (
              <Skeleton.Root pending>
                <div className="pb-6 md:pb-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((__, specIndex) => (
                      <div className="space-y-2 md:space-y-3" key={specIndex}>
                        <Skeleton.Box className="h-4 w-20 md:h-5 md:w-24" />
                        <Skeleton.Box className="h-3 w-full" />
                        <Skeleton.Box className="h-3 w-4/5" />
                        <Skeleton.Box className="h-3 w-3/4" />
                      </div>
                    ))}
                  </div>
                </div>
              </Skeleton.Root>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ExpandableContent = ({ isExpanded, children }: ExpandableContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          setHeight(entry.contentRect.height);
        });
      });

      resizeObserver.observe(contentRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div
      className="duration-800 overflow-hidden transition-all ease-in-out"
      style={{
        height: isExpanded ? height : 0,
        opacity: isExpanded ? 1 : 0,
      }}
    >
      <div
        className={clsx(
          'duration-600 transition-transform ease-in-out',
          isExpanded ? 'translate-y-0' : '-translate-y-2',
        )}
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};

const TechSpecs = ({ powerSpecs }: TechSpecsProps) => {
  // Enhancement mapping for adding contextual information inline
  const SPEC_ENHANCEMENTS: Record<string, (value: string) => string> = {
    Range: (value: string) => `${value} (Varies by user and condition)`,
    'Max Speed': (value: string) => `${value} under optimal conditions`,
    Speed: (value: string) => `${value} under optimal conditions`,
    'Motor Power': (value: string) => `${value} peak output`,
    Power: (value: string) => `${value} peak output`,
    'Battery Capacity': (value: string) => `${value} lithium-ion`,
    'Charging Time': (value: string) => `${value} with standard charger`,
  };

  // Helper function to get enhanced value
  const getEnhancedValue = (name: string, value: string): string => {
    const enhancer = SPEC_ENHANCEMENTS[name];

    return enhancer ? enhancer(value) : value;
  };

  const streamablePowerSpecs = powerSpecs;
  const [expandedSections, setExpandedSections] = useState({
    power: true,
    components: false,
    safety: false,
    other: false,
  });

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const allSections: TechSpecsSection[] = [
    { key: 'power', title: 'Power', hasContent: true },
    { key: 'components', title: 'Components', hasContent: false },
    { key: 'safety', title: 'Safety / Security', hasContent: false },
    { key: 'other', title: 'Other Specs', hasContent: false },
  ];

  return (
    <Stream fallback={<TechSpecsSkeleton />} value={streamablePowerSpecs}>
      {(finalPowerSpecs) => {
        // Use default data if finalPowerSpecs is null
        const specsToRender = finalPowerSpecs;

        return (
          <div className="max-w-8xl mx-auto bg-[#F5F5F5] p-4 sm:p-6 md:p-10 lg:p-16">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-[#F92F7B]">Tech</span>
                <span className="-mt-3 block text-black md:-mt-4 lg:-mt-6">Specs.</span>
              </h1>
            </div>
            {/* All Sections */}
            <div className="space-y-0">
              {allSections.map((section) => (
                <div key={section.key}>
                  <button
                    className="flex w-full items-center justify-between py-4 text-left transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 md:py-6"
                    onClick={() => toggleSection(section.key)}
                  >
                    <h2
                      className={`text-xl font-bold sm:text-2xl md:text-3xl ${
                        expandedSections[section.key] ? 'text-[#F92F7B]' : 'text-black'
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
                            expandedSections[section.key]
                              ? 'rotate-90 scale-90 text-[#F92F7B] opacity-0'
                              : 'rotate-0 scale-100 text-black opacity-100',
                          )}
                        />
                        <AiOutlineMinus
                          className={clsx(
                            'duration-400 absolute left-0 top-0 h-6 w-6 transition-all ease-in-out md:h-8 md:w-8',
                            expandedSections[section.key]
                              ? 'rotate-0 scale-100 text-[#F92F7B] opacity-100'
                              : '-rotate-90 scale-90 text-black opacity-0',
                          )}
                        />
                      </div>
                    </div>
                  </button>

                  <ExpandableContent isExpanded={expandedSections[section.key]}>
                    <div className="pb-6 md:pb-8">
                      {section.key === 'power' ? (
                        /* Power Grid */
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-4">
                          {specsToRender?.map((spec, specIndex) => (
                            <div className="space-y-3 md:space-y-4" key={specIndex}>
                              <h3 className="text-sm font-bold text-black md:text-base">
                                {spec.name}
                              </h3>
                              <p className="text-base leading-relaxed text-gray-600 md:text-lg">
                                {getEnhancedValue(spec.name, spec.value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Other sections placeholder content */
                        <div className="rounded-lg p-4 md:p-6">
                          <p className="text-base text-gray-600 md:text-lg">
                            Content for {section.title} would go here. This is where you would add
                            the specific details for each section.
                          </p>
                        </div>
                      )}
                    </div>
                  </ExpandableContent>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Stream>
  );
};

export default TechSpecs;
