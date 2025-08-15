import { ComponentPropsWithoutRef } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

type ButtonLinkProps = ComponentPropsWithoutRef<typeof ButtonLink>;

export interface Slide {
  title: string;
  subtitle?: string;
  description?: string;
  showDescription?: boolean;
  image?: { alt: string; blurDataUrl?: string; src: string };
  cta?: {
    label: string;
    href: string;
    variant?: ButtonLinkProps['variant'];
    size?: ButtonLinkProps['size'];
    shape?: ButtonLinkProps['shape'];
  };
  showCta?: boolean;
  contentPosition?: 'left' | 'right' | 'center';
}

export interface SlideItemProps {
  slide: Slide;
  index: number;
  selectedIndex: number;
}