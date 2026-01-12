import { ReactNode } from 'react';

export type BorderRadius = number;
export type RoundedStyle = 'all' | 'top' | 'bottom' | 'none';

export interface OuterContainerProps {
  /** Border radius in pixels (default: 30) */
  radius?: BorderRadius;

  /** Which corners to round (default: 'bottom') */
  rounded?: RoundedStyle;

  /** Background color Tailwind class (default: 'bg-white') */
  bgColor?: string;

  /** Padding Tailwind class or responsive values (default: 'pb-6') */
  padding?: string;

  /** Inner horizontal padding (gap between outer and inner) (default: 'px-4 @xl:px-6 @4xl:px-8') */
  innerPadding?: string;

  /** Maximum width constraint (default: 'max-w-[var(--section-max-width-2xl,1536px)]') */
  maxWidth?: string;

  /** Enable container queries (default: true) */
  containerQuery?: boolean;

  /** Additional CSS classes */
  className?: string;

  /** Content */
  children: ReactNode;

  /** Accessible label */
  'aria-labelledby'?: string;
}

export interface InnerContainerProps {
  /** Border radius in pixels (default: 30) */
  radius?: BorderRadius;

  /** Which corners to round (default: 'all') */
  rounded?: RoundedStyle;

  /** Background color Tailwind class */
  bgColor?: string;

  /** Background image URL */
  bgImage?: string;

  /** Background image opacity (0-100, default: 100) */
  bgImageOpacity?: number;

  /** Minimum height constraint */
  minHeight?: string;

  /** Maximum height constraint */
  maxHeight?: string;

  /** Padding Tailwind class */
  padding?: string;

  /** Additional CSS classes */
  className?: string;

  /** Content */
  children: ReactNode;

  /** Overflow behavior (default: 'hidden') */
  overflow?: 'hidden' | 'visible' | 'auto';
}

export type SectionVariant =
  | 'product-detail'
  | 'marketplace-showcase'
  | 'brand-card'
  | 'rollout-card'
  | 'how-it-works'
  | 'legit-brands';

export interface SectionContainerProps {
  /** Pre-configured variant */
  variant?: SectionVariant;

  /** Override background color */
  bgColor?: string;

  /** Override background image */
  bgImage?: string;

  /** Content */
  children: ReactNode;

  /** Additional CSS classes */
  className?: string;
}
