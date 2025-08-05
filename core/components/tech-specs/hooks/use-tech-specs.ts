'use client';

import { useState } from 'react';

import type { ProductSpecification } from '~/components/product/shared/product-specifications';

import type { SectionKey, TechSpecData, TechSpecsSection } from '../types';

export const useTechSpecs = () => {
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

  const getSections = (specs: TechSpecData | null | undefined): TechSpecsSection[] => [
    { key: 'power', title: 'Power', hasContent: (specs?.Power.length ?? 0) > 0 },
    { key: 'components', title: 'Components', hasContent: (specs?.Components.length ?? 0) > 0 },
    { key: 'safety', title: 'Safety / Security', hasContent: (specs?.Safety.length ?? 0) > 0 },
    { key: 'other', title: 'Other Specs', hasContent: (specs?.Other.length ?? 0) > 0 },
  ];

  const getSpecsForSection = (specs: TechSpecData, key: SectionKey): ProductSpecification[] => {
    switch (key) {
      case 'power':
        return specs.Power;

      case 'components':
        return specs.Components;

      case 'safety':
        return specs.Safety;

      case 'other':
        return specs.Other;

      default:
        return [];
    }
  };

  return {
    expandedSections,
    toggleSection,
    getSections,
    getSpecsForSection,
  };
};