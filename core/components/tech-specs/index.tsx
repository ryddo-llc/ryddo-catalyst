'use client';

import { Stream } from '@/vibes/soul/lib/streamable';

import { TechSpecsHeader } from './components/tech-specs-header';
import { TechSpecsSection } from './components/tech-specs-section';
import { TechSpecsSkeleton } from './components/tech-specs-skeleton';
import { useTechSpecs } from './hooks/use-tech-specs';
import type { TechSpecsProps } from './types';

const TechSpecs = ({ powerSpecs }: TechSpecsProps) => {
  const { expandedSections, toggleSection, getSections, getSpecsForSection } = useTechSpecs();

  return (
    <Stream fallback={<TechSpecsSkeleton />} value={powerSpecs}>
      {(finalSpecs) => {
        const allSections = getSections(finalSpecs);

        return (
          <div className="max-w-8xl mx-auto bg-[#F5F5F5] p-4 sm:p-6 md:p-10 lg:p-16">
            <TechSpecsHeader />
            
            <div className="space-y-0">
              {allSections.map((section) => (
                <TechSpecsSection
                  isExpanded={expandedSections[section.key]}
                  key={section.key}
                  onToggle={toggleSection}
                  section={section}
                  specs={finalSpecs ? getSpecsForSection(finalSpecs, section.key) : null}
                />
              ))}
            </div>
          </div>
        );
      }}
    </Stream>
  );
};

export default TechSpecs;