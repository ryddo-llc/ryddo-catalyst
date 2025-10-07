import type { StaticImageData } from 'next/image';

import { Image } from '~/components/image';
// Static imports for icons
import brakesIcon from '~/public/icons/brakes.png';
import powerIcon from '~/public/icons/power.png';
import rangeIcon from '~/public/icons/range.png';
import speedIcon from '~/public/icons/speed.png';
import tiresIcon from '~/public/icons/tires.png';
import weightIcon from '~/public/icons/weight.png';

interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductSpecsIconsProps {
  specs: ProductSpecification[];
}

interface SpecIconConfig {
  iconSrc: StaticImageData;
  alt: string;
  keywords: string[];
}

// Icon configuration map for products - using static imports
const SPEC_ICON_MAP: SpecIconConfig[] = [
  {
    iconSrc: powerIcon,
    alt: 'Motor power icon',
    keywords: ['motor', 'power'],
  },

  {
    iconSrc: speedIcon,
    alt: 'Max speed icon',
    keywords: ['speed', 'velocity', 'max speed'],
  },

  {
    iconSrc: rangeIcon,
    alt: 'Range icon',
    keywords: ['range', 'distance'],
  },

  {
    iconSrc: brakesIcon,
    alt: 'Brake system icon',
    keywords: ['brake', 'braking', 'brakes'],
  },

  {
    iconSrc: tiresIcon,
    alt: 'Tires icon',
    keywords: ['tire', 'tires', 'wheel'],
  },

  {
    iconSrc: weightIcon,
    alt: 'Weight icon',
    keywords: ['weight', 'mass'],
  },
];

// Default fallback configuration - using weight icon as fallback
const DEFAULT_SPEC_ICON: Omit<SpecIconConfig, 'keywords'> = {
  iconSrc: weightIcon,
  alt: 'Specification icon',
};

// Helper function to get icon configuration based on field name
function getSpecIcon(fieldName: string): Omit<SpecIconConfig, 'keywords'> {
  const name = fieldName.toLowerCase();

  // Find matching configuration based on keywords
  const config = SPEC_ICON_MAP.find((spec) =>
    spec.keywords.some((keyword) => name.includes(keyword)),
  );

  return config || DEFAULT_SPEC_ICON;
}

export function ProductSpecsIcons({ specs }: ProductSpecsIconsProps) {
  return (
    <div
      aria-label="Product specifications"
      className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-12"
      role="region"
    >
      {specs.slice(0, 6).map((spec) => {
        const { iconSrc, alt } = getSpecIcon(spec.name);

        return (
          <div
            aria-label={`${spec.name}: ${spec.value}`}
            className="group relative flex flex-col items-center"
            key={spec.name}
            role="img"
          >
            <div className="mb-1">
              <Image alt={alt} height={50} src={iconSrc} width={50} />
            </div>
            <span className="text-md font-kanit font-bold italic text-black">{spec.value}</span>

            {/* Tooltip that shows on hover */}
            <div className="absolute bottom-full mb-2 hidden w-max rounded-2xl border border-white/20 bg-white/75 px-4 py-2 font-kanit text-sm font-medium text-gray-900 shadow-sm backdrop-blur-md transition-all duration-200 ease-out group-hover:block">
              {spec.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Export types for reuse
export type { ProductSpecification };
