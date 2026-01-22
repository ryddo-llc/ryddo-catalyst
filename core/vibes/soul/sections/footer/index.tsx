import { clsx } from 'clsx';

import { Streamable } from '@/vibes/soul/lib/streamable';

import { FooterContent, Section } from './footer-content';
import { FooterWrapper } from './footer-wrapper';

// Re-export components and types for external use
export { FooterContent } from './footer-content';
export type { FooterContentProps, Section } from './footer-content';
export { FooterWrapper } from './footer-wrapper';
export type { FooterWrapperProps } from './footer-wrapper';

export interface FooterProps {
  sections: Streamable<Section[]>;
  copyright?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  contentClassName?: string;
  backgroundExtensionHeight?: string;
  backgroundPositionY?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Footer - Composed component (maintains backward compatibility)
 *
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --footer-focus: hsl(var(--primary));
 *   --footer-background: hsl(var(--background));
 *   --footer-border-top: hsl(var(--contrast-100));
 *   --footer-border-bottom: hsl(var(--primary));
 *   --footer-contact-title: hsl(var(--contrast-500));
 *   --footer-contact-text: hsl(var(--foreground));
 *   --footer-social-icon: hsl(var(--contrast-400));
 *   --footer-social-icon-hover: hsl(var(--foreground));
 *   --footer-section-title: hsl(var(--foreground));
 *   --footer-link: hsl(var(--contrast-500));
 *   --footer-link-hover: hsl(var(--foreground));
 *   --footer-copyright: hsl(var(--contrast-500));
 * }
 * ```
 */
export const Footer = ({
  sections,
  copyright,
  className,
  wrapperClassName,
  contentClassName,
  backgroundExtensionHeight = '0px',
  backgroundPositionY = 'bottom',
}: FooterProps) => {
  return (
    <FooterWrapper
      backgroundExtensionHeight={backgroundExtensionHeight}
      backgroundPositionY={backgroundPositionY}
      className={clsx(className, wrapperClassName)}
    >
      <FooterContent className={clsx('mt-4', contentClassName)} copyright={copyright} sections={sections} />
    </FooterWrapper>
  );
};
