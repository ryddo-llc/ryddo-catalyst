import { Streamable } from '@/vibes/soul/lib/streamable';
import type { ProductSpecification } from '~/components/product/shared/product-specifications';

export type SectionKey = 'power' | 'components' | 'safety' | 'other';

export interface TechSpecsSection {
  key: SectionKey;
  title: string;
  hasContent: boolean;
}

export interface TechSpecData {
  Power: ProductSpecification[];
  Components: ProductSpecification[];
  Safety: ProductSpecification[];
  Other: ProductSpecification[];
}

export interface TechSpecsProps {
  powerSpecs?: Streamable<TechSpecData | null>;
}

export interface ExpandableContentProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

export interface SpecItemProps {
  spec: ProductSpecification;
}

export interface TechSpecsSectionProps {
  section: TechSpecsSection;
  isExpanded: boolean;
  onToggle: (key: SectionKey) => void;
  specs: ProductSpecification[] | null;
}