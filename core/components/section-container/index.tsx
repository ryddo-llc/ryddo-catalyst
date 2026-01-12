import { InnerContainer } from './inner-container';
import { OuterContainer } from './outer-container';
import type {
  InnerContainerProps,
  OuterContainerProps,
  SectionContainerProps,
  SectionVariant,
} from './types';

// Pre-configured variant settings
const VARIANTS: Record<
  SectionVariant,
  {
    outer: Partial<OuterContainerProps>;
    inner: Partial<InnerContainerProps>;
  }
> = {
  'product-detail': {
    outer: { radius: 30, rounded: 'bottom', padding: 'pb-4 md:pb-6' },
    inner: { radius: 30, minHeight: 'min-h-[70vh]' },
  },
  'marketplace-showcase': {
    outer: { radius: 30, rounded: 'bottom', padding: 'pb-6 md:pb-10 lg:pb-14' },
    inner: { radius: 30, bgColor: 'bg-blue-100' },
  },
  'brand-card': {
    outer: { radius: 30, rounded: 'all', padding: 'p-1.5' },
    inner: { radius: 28 },
  },
  'rollout-card': {
    outer: { radius: 40, rounded: 'all', padding: 'p-1.5' },
    inner: { radius: 40 },
  },
  'how-it-works': {
    outer: { radius: 25, rounded: 'all', padding: 'p-1' },
    inner: { radius: 25, bgColor: 'bg-[rgb(164,206,246)]' },
  },
  'legit-brands': {
    outer: { radius: 30, rounded: 'all', padding: 'pb-6 pt-6' },
    inner: { radius: 30, bgColor: 'bg-white' },
  },
};

/**
 * SectionContainer - Reusable component for white background containers with rounded corners
 *
 * @returns {JSX.Element | ReactNode} The rendered section container element
 * @example
 * // Using a pre-configured variant
 * <SectionContainer variant="product-detail" bgColor="bg-custom">
 *   {children}
 * </SectionContainer>
 *
 * @example
 * // Using compound pattern for full customization
 * <SectionContainer>
 *   <SectionContainer.Outer radius={30} rounded="bottom" padding="pb-6">
 *     <SectionContainer.Inner radius={30} bgColor="bg-blue-100" minHeight="min-h-[70vh]">
 *       {children}
 *     </SectionContainer.Inner>
 *   </SectionContainer.Outer>
 * </SectionContainer>
 */
export function SectionContainer({
  variant,
  bgColor,
  bgImage,
  className,
  children,
}: SectionContainerProps) {
  // If no variant provided, render children directly (for compound component pattern)
  if (!variant) {
    return children;
  }

  const config = VARIANTS[variant];

  return (
    <OuterContainer {...config.outer} className={className}>
      <InnerContainer {...config.inner} bgColor={bgColor || config.inner.bgColor} bgImage={bgImage}>
        {children}
      </InnerContainer>
    </OuterContainer>
  );
}

// Attach sub-components for compound pattern
SectionContainer.Outer = OuterContainer;
SectionContainer.Inner = InnerContainer;

// Re-export types for convenience
export type {
  OuterContainerProps,
  InnerContainerProps,
  SectionContainerProps,
  SectionVariant,
  BorderRadius,
  RoundedStyle,
} from './types';
