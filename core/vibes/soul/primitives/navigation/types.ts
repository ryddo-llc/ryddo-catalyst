import { SubmissionResult } from '@conform-to/react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { Price } from '@/vibes/soul/primitives/price-label';

export interface Link {
  label: string;
  href: string;
  groups?: Array<{
    label?: string;
    href?: string;
    image?: {
      url: string;
      altText: string;
    };
    links: Array<{
      label: string;
      href: string;
      image?: {
        url: string;
        altText: string;
      };
    }>;
  }>;
}

export interface Locale {
  id: string;
  label: string;
}

export interface Currency {
  id: string;
  label: string;
}

export type Action<State, Payload> = (
  state: Awaited<State>,
  payload: Awaited<Payload>,
) => State | Promise<State>;

export type SearchResult =
  | {
      type: 'products';
      title: string;
      products: Array<{
        id: string;
        title: string;
        href: string;
        price?: Price;
        image?: { src: string; alt: string };
      }>;
    }
  | {
      type: 'links';
      title: string;
      links: Array<{ label: string; href: string }>;
    };

export type CurrencyAction = Action<SubmissionResult | null, FormData>;
export type SearchAction<S extends SearchResult> = Action<
  {
    searchResults: S[] | null;
    lastResult: SubmissionResult | null;
    emptyStateTitle?: string;
    emptyStateSubtitle?: string;
  },
  FormData
>;

export interface NavigationProps<S extends SearchResult> {
  className?: string;
  isFloating?: boolean;
  accountHref: string;
  cartCount?: Streamable<number | null>;
  cartHref: string;
  links: Streamable<Link[]>;
  linksPosition?: 'center' | 'left' | 'right';
  locales?: Locale[];
  activeLocaleId?: string;
  currencies?: Currency[];
  activeCurrencyId?: Streamable<string | undefined>;
  currencyAction?: CurrencyAction;
  logo?: Streamable<string | { src: string; alt: string } | null>;
  logoWidth?: number;
  logoHeight?: number;
  logoHref?: string;
  logoLabel?: string;
  mobileLogo?: Streamable<string | { src: string; alt: string } | null>;
  mobileLogoWidth?: number;
  mobileLogoHeight?: number;
  searchHref: string;
  searchParamName?: string;
  searchAction?: SearchAction<S>;
  searchInputPlaceholder?: string;
  searchSubmitLabel?: string;
  cartLabel?: string;
  accountLabel?: string;
  openSearchPopupLabel?: string;
  searchLabel?: string;
  mobileMenuTriggerLabel?: string;
  switchCurrencyLabel?: string;
}