'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import { Search, ShoppingBag, User } from 'lucide-react';
import { forwardRef, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Logo } from '@/vibes/soul/primitives/logo';
import { Link } from '~/components/link';
import { usePathname } from '~/i18n/routing';
import { useSearch } from '~/lib/search';

import { CurrencyForm, LocaleSwitcher } from './locale-currency';
import { MobileMenuButton } from './mobile-navigation';
import { NavigationItem } from './navigation-item';
import { SearchForm } from './search';
import type { Link as NavigationLink, NavigationProps, SearchResult } from './types';

// Extracted component to avoid useEffect inside callback
interface NavigationLinksProps {
  links: NavigationLink[];
  getIsActive: (href: string) => boolean;
  isFloating: boolean;
  navItemsRef: React.RefObject<Array<HTMLElement | null>>;
  setActivePillStyle: React.Dispatch<
    React.SetStateAction<{ left: number; width: number; opacity: number }>
  >;
}

function NavigationLinks({
  links,
  getIsActive,
  isFloating,
  navItemsRef,
  setActivePillStyle,
}: NavigationLinksProps) {
  const pathname = usePathname();

  // Update active pill position when links or pathname changes
  useEffect(() => {
    const activeIndex = links.findIndex((link) => getIsActive(link.href));

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (activeIndex !== -1 && navItemsRef.current?.[activeIndex]) {
      const activeElement = navItemsRef.current[activeIndex];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (activeElement != null) {
        const containerLeft = activeElement.offsetParent?.getBoundingClientRect().left ?? 0;
        const elementRect = activeElement.getBoundingClientRect();

        setActivePillStyle({
          left: elementRect.left - containerLeft,
          width: activeElement.offsetWidth,
          opacity: 1,
        });
      }
    } else {
      setActivePillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [links, pathname, getIsActive, navItemsRef, setActivePillStyle]);

  return (
    <>
      {links.map((item, i) => {
        const isActive = getIsActive(item.href);

        return (
          <NavigationItem
            index={i}
            isActive={isActive}
            isFloating={isFloating}
            item={item}
            key={i}
            ref={(el: HTMLElement | null) => {
              navItemsRef.current[i] = el;
            }}
          />
        );
      })}
    </>
  );
}

const navButtonClassName =
  'relative rounded-lg bg-[var(--nav-button-background,transparent)] p-1.5 text-[var(--nav-button-icon,hsl(var(--foreground)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-all duration-200 focus-visible:outline-0 focus-visible:ring-2 @4xl:hover:bg-[var(--nav-button-background-hover,hsl(var(--contrast-100)))] @4xl:hover:text-[var(--nav-button-icon-hover,hsl(var(--foreground)))]';

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --nav-focus: hsl(var(--primary));
 *   --nav-background: hsl(var(--background));
 *   --nav-floating-border: hsl(var(--foreground) / 10%);
 *   --nav-link-text: hsl(var(--foreground));
 *   --nav-link-text-hover: hsl(var(--foreground));
 *   --nav-link-background: transparent;
 *   --nav-link-background-hover: hsl(var(--contrast-100));
 *   --nav-link-font-family: var(--font-family-body);
 *   --nav-group-text: hsl(var(--foreground));
 *   --nav-group-text-hover: hsl(var(--foreground));
 *   --nav-group-background: transparent;
 *   --nav-group-background-hover: hsl(var(--contrast-100));
 *   --nav-group-font-family: var(--font-family-body);
 *   --nav-sub-link-text: hsl(var(--contrast-500));
 *   --nav-sub-link-text-hover: hsl(var(--foreground));
 *   --nav-sub-link-background: transparent;
 *   --nav-sub-link-background-hover: hsl(var(--contrast-100));
 *   --nav-sub-link-font-family: var(--font-family-body);
 *   --nav-button-icon: hsl(var(--foreground));
 *   --nav-button-icon-hover: hsl(var(--foreground));
 *   --nav-button-background: hsl(var(--background));
 *   --nav-button-background-hover: hsl(var(--contrast-100));
 *   --nav-menu-background: hsl(var(--background));
 *   --nav-menu-border: hsl(var(--foreground) / 5%);
 *   --nav-mobile-background: hsl(var(--background));
 *   --nav-mobile-divider: hsl(var(--contrast-100));
 *   --nav-mobile-button-icon: hsl(var(--foreground));
 *   --nav-mobile-link-text: hsl(var(--foreground));
 *   --nav-mobile-link-text-hover: hsl(var(--foreground));
 *   --nav-mobile-link-text-active: hsl(var(--foreground));
 *   --nav-mobile-link-background: transparent;
 *   --nav-mobile-link-background-hover: hsl(var(--contrast-100));
 *   --nav-mobile-link-font-family: var(--font-family-body);
 *   --nav-mobile-sub-link-text: hsl(var(--contrast-500));
 *   --nav-mobile-sub-link-text-hover: hsl(var(--foreground));
 *   --nav-mobile-sub-link-background: transparent;
 *   --nav-mobile-sub-link-background-hover: hsl(var(--contrast-100));
 *   --nav-mobile-sub-link-font-family: var(--font-family-body);
 *   --nav-search-background: hsl(var(--background));
 *   --nav-search-border: hsl(var(--foreground) / 5%);
 *   --nav-search-divider: hsl(var(--foreground) / 5%);
 *   --nav-search-icon: hsl(var(--contrast-500));
 *   --nav-search-empty-title: hsl(var(--foreground));
 *   --nav-search-empty-subtitle: hsl(var(--contrast-500));
 *   --nav-search-result-title: hsl(var(--foreground));
 *   --nav-search-result-title-font-family: var(--font-family-mono);
 *   --nav-search-result-link-text: hsl(var(--foreground));
 *   --nav-search-result-link-text-hover: hsl(var(--foreground));
 *   --nav-search-result-link-background: hsl(var(--background));
 *   --nav-search-result-link-background-hover: hsl(var(--contrast-100));
 *   --nav-search-result-link-font-family: var(--font-family-body);
 *   --nav-cart-count-text: hsl(var(--background));
 *   --nav-cart-count-background: hsl(var(--foreground));
 *   --nav-locale-background: hsl(var(--background));
 *   --nav-locale-link-text: hsl(var(--contrast-400));
 *   --nav-locale-link-text-hover: hsl(var(--foreground));
 *   --nav-locale-link-text-selected: hsl(var(--foreground));
 *   --nav-locale-link-background: transparent;
 *   --nav-locale-link-background-hover: hsl(var(--contrast-100));
 *   --nav-locale-link-font-family: var(--font-family-body);
 * }
 * ```
 */
export const Navigation = forwardRef(function Navigation<S extends SearchResult>(
  {
    className,
    isFloating = false,
    cartHref,
    cartCount: streamableCartCount,
    accountHref,
    links: streamableLinks,
    logo: streamableLogo,
    logoHref = '/',
    logoLabel = 'Home',
    logoWidth = 190,
    logoHeight = 38,
    mobileLogo: streamableMobileLogo,
    mobileLogoWidth = 95,
    mobileLogoHeight = 38,
    linksPosition = 'center',
    activeLocaleId,
    locales,
    currencies: streamableCurrencies,
    activeCurrencyId: streamableActiveCurrencyId,
    currencyAction,
    searchHref,
    searchParamName = 'query',
    searchAction,
    searchInputPlaceholder,
    searchSubmitLabel,
    cartLabel = 'Cart',
    accountLabel = 'Profile',
    openSearchPopupLabel = 'Open search popup',
    searchLabel = 'Search',
    mobileMenuTriggerLabel = 'Toggle navigation',
    switchCurrencyLabel,
  }: NavigationProps<S>,
  ref: Ref<HTMLDivElement>,
) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [expandedSubSections, setExpandedSubSections] = useState<Set<string>>(new Set());
  const [activePillStyle, setActivePillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navItemsRef = useRef<Array<HTMLElement | null>>([]);

  const pathname = usePathname();

  // Memoize path normalization to prevent repeated calculations
  const normalizedPathname = useMemo(
    () => (pathname.endsWith('/') ? pathname : `${pathname}/`),
    [pathname],
  );

  // Memoize active state calculation to prevent repeated string operations
  const getIsActive = useMemo(
    () => (href: string) => {
      const normalizedHref = href.endsWith('/') ? href : `${href}/`;

      return (
        normalizedPathname === normalizedHref ||
        (normalizedHref !== '/' && normalizedPathname.startsWith(normalizedHref))
      );
    },
    [normalizedPathname],
  );

  const handlePathChange = useCallback(() => {
    // Only close search, keep mobile menu open for better UX
    setIsSearchOpen(false);
  }, [setIsSearchOpen]);

  const handleScroll = useCallback(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [setIsSearchOpen]);

  // Add keyboard shortcut for search (Cmd/Ctrl + K) - memoized for efficiency
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    },
    [isSearchOpen, setIsSearchOpen],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Reset all accordion states whenever the menu becomes open
  useEffect(() => {
    if (isMobileMenuOpen) {
      setExpandedSections(new Set());
      setExpandedSubSections(new Set());
    }
  }, [isMobileMenuOpen]);

  const toggleSection = useCallback((index: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }

      return newSet;
    });
  }, []);

  const toggleSubSection = useCallback((sectionIndex: number, groupIndex: number) => {
    const key = `${sectionIndex}-${groupIndex}`;

    setExpandedSubSections((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }

      return newSet;
    });
  }, []);

  useEffect(() => {
    handlePathChange();
  }, [pathname, handlePathChange]);

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <NavigationMenu.Root
      className={clsx('relative mx-auto w-full max-w-[1400px] @container', className)}
      delayDuration={0}
      onValueChange={() => setIsSearchOpen(false)}
      ref={ref}
    >
      <div
        className={clsx(
          'flex items-center justify-between gap-4 bg-[var(--nav-background,hsl(var(--background)))] py-1.5 pl-16 pr-4 transition-shadow @4xl:rounded-2xl',
          isFloating
            ? 'shadow-xl ring-1 ring-[var(--nav-floating-border,hsl(var(--foreground)/10%))]'
            : 'shadow-none ring-0',
        )}
      >
        {/* Mobile Menu */}
        <Popover.Root onOpenChange={setIsMobileMenuOpen} open={isMobileMenuOpen}>
          <Popover.Anchor className="absolute left-0 top-full" />
          <Popover.Trigger asChild>
            <MobileMenuButton
              aria-label={mobileMenuTriggerLabel}
              className="mr-1 @4xl:hidden"
              onClick={handleMobileMenuToggle}
              open={isMobileMenuOpen}
            />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              className="relative z-[200] max-h-[70vh] w-72 max-w-[75vw] overflow-y-auto overscroll-contain rounded-2xl border border-contrast-100/20 bg-background/50 shadow-2xl ring-1 ring-contrast-100/15 backdrop-blur-2xl backdrop-saturate-200 @container before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/5 before:to-transparent data-[state=closed]:animate-menu-slide-up data-[state=open]:animate-menu-slide-down"
              sideOffset={4}
            >
              <div className="relative divide-y divide-contrast-100/15">
                <Stream
                  fallback={
                    <ul className="flex animate-pulse flex-col gap-4 p-5 @4xl:gap-2 @4xl:p-5">
                      <li>
                        <span className="lock·h-4·w-10·rounded-md·bg-contrast-100" />
                      </li>
                      <li>
                        <span className="lock·h-4·w-14·rounded-md·bg-contrast-100" />
                      </li>
                      <li>
                        <span className="lock·h-4·w-24·rounded-md·bg-contrast-100" />
                      </li>
                      <li>
                        <span className="lock·h-4·w-16·rounded-md·bg-contrast-100" />
                      </li>
                    </ul>
                  }
                  value={streamableLinks}
                >
                  {(links) =>
                    links.map((item, i) => {
                      // Use memoized active state calculation
                      const isActive = getIsActive(item.href);
                      const hasSubcategories = item.groups && item.groups.length > 0;
                      const hasLabel = item.label.trim() !== '';
                      const isExpanded = hasLabel ? expandedSections.has(i) : true;

                      return (
                        <div
                          className="border-b border-[var(--nav-mobile-divider,hsl(var(--contrast-100)))] last:border-b-0"
                          key={item.href}
                        >
                          {/* Main Category Link */}
                          {hasLabel && (
                            <div className="p-1.5 @4xl:p-3">
                              <div className="flex items-center justify-between">
                                <Link
                                  aria-current={isActive ? 'page' : undefined}
                                  className={clsx(
                                    'block flex-1 rounded-lg px-2.5 py-2.5 font-[family-name:var(--nav-mobile-link-font-family,var(--font-family-body))] text-lg font-medium ring-[var(--nav-focus,hsl(var(--primary)))] transition-all duration-300 focus-visible:outline-0 focus-visible:ring-2 @4xl:py-3',
                                    'text-[var(--nav-mobile-link-text,hsl(var(--foreground)))] hover:text-[var(--nav-mobile-link-text-hover,hsl(var(--foreground)))]',
                                    'border border-transparent bg-transparent hover:border-primary/20 hover:bg-primary/10 hover:backdrop-blur-sm',
                                    isActive &&
                                      'border-primary/25 bg-primary/15 text-primary backdrop-blur-sm',
                                  )}
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {item.label}
                                </Link>

                                {/* Expand/Collapse Button for categories with subcategories */}
                                {hasSubcategories && (
                                  <button
                                    aria-controls={`section-panel-${i}`}
                                    aria-expanded={isExpanded}
                                    aria-label={
                                      isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`
                                    }
                                    className="ml-1.5 rounded-lg p-1.5 transition-all duration-200 hover:bg-primary/5 hover:backdrop-blur-md focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-primary"
                                    onClick={() => toggleSection(i)}
                                    type="button"
                                  >
                                    <svg
                                      className={clsx(
                                        'h-4 w-4 transition-transform duration-300 ease-out',
                                        isExpanded ? 'rotate-180' : 'rotate-0',
                                      )}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        d="M19 9l-7 7-7-7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Sub-categories with accordion behavior */}
                          {hasSubcategories && (
                            <div
                              aria-hidden={!isExpanded}
                              className={clsx(
                                'overflow-hidden transition-all duration-300 ease-out',
                                isExpanded ? 'max-h-[65vh] opacity-100' : 'max-h-0 opacity-0',
                              )}
                              id={`section-panel-${i}`}
                            >
                              <div className="px-1.5 pb-1.5 @4xl:px-3 @4xl:pb-3">
                                {item.groups?.map((group, groupIndex) => (
                                  <div
                                    className="mb-2 last:mb-0"
                                    key={`${item.href}-${group.label ?? groupIndex}`}
                                  >
                                    {/* Group Header */}
                                    {group.label ? (
                                      <div className="flex items-center justify-between px-2 py-1.5">
                                        {group.href ? (
                                          <Link
                                            className="flex-1 text-base font-medium text-[var(--nav-mobile-sub-link-text,hsl(var(--contrast-500)))] transition-all duration-200 hover:text-[var(--nav-mobile-sub-link-text-hover,hsl(var(--foreground)))]"
                                            href={group.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                          >
                                            {group.label}
                                          </Link>
                                        ) : (
                                          <div className="text-base font-medium text-[var(--nav-mobile-sub-link-text,hsl(var(--contrast-500)))]">
                                            {group.label}
                                          </div>
                                        )}

                                        {/* Expand/Collapse Button for sub-subcategories */}
                                        {group.links.length > 0 && (
                                          <button
                                            aria-controls={`subsection-panel-${i}-${groupIndex}`}
                                            aria-expanded={expandedSubSections.has(
                                              `${i}-${groupIndex}`,
                                            )}
                                            aria-label={
                                              expandedSubSections.has(`${i}-${groupIndex}`)
                                                ? `Collapse ${group.label}`
                                                : `Expand ${group.label}`
                                            }
                                            className="rounded p-1 transition-all duration-200 hover:bg-primary/5 hover:backdrop-blur-md focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-[var(--nav-focus,hsl(var(--primary)))]"
                                            onClick={() => toggleSubSection(i, groupIndex)}
                                            type="button"
                                          >
                                            <svg
                                              className={clsx(
                                                'h-4 w-4 transition-transform duration-200',
                                                expandedSubSections.has(`${i}-${groupIndex}`)
                                                  ? 'rotate-180'
                                                  : 'rotate-0',
                                              )}
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                d="M19 9l-7 7-7-7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                              />
                                            </svg>
                                          </button>
                                        )}
                                      </div>
                                    ) : null}

                                    {/* Group Links with nested accordion */}
                                    {group.links.length > 0 &&
                                      (group.label ? (
                                        <div
                                          aria-hidden={
                                            !expandedSubSections.has(`${i}-${groupIndex}`)
                                          }
                                          className={clsx(
                                            'overflow-hidden transition-all duration-200 ease-in-out',
                                            expandedSubSections.has(`${i}-${groupIndex}`)
                                              ? 'max-h-[50vh] opacity-100'
                                              : 'max-h-0 opacity-0',
                                          )}
                                          id={`subsection-panel-${i}-${groupIndex}`}
                                        >
                                          <div className="ml-2 space-y-0.5">
                                            {group.links.map((link) => {
                                              const isLinkActive = getIsActive(link.href);

                                              return (
                                                <Link
                                                  aria-current={isLinkActive ? 'page' : undefined}
                                                  className="block rounded-lg bg-transparent px-2 py-1.5 font-[family-name:var(--nav-mobile-sub-link-font-family,var(--font-family-body))] text-base font-medium text-contrast-500 ring-primary transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:text-foreground hover:backdrop-blur-sm focus-visible:outline-0 focus-visible:ring-2 @4xl:py-2"
                                                  href={link.href}
                                                  key={link.href}
                                                  onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                  {link.label}
                                                </Link>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="ml-2 space-y-0.5">
                                          {group.links.map((link) => {
                                            const isLinkActive = getIsActive(link.href);

                                            return (
                                              <Link
                                                aria-current={isLinkActive ? 'page' : undefined}
                                                className="block rounded-lg bg-[var(--nav-mobile-sub-link-background,transparent)] px-2 py-1.5 font-[family-name:var(--nav-mobile-sub-link-font-family,var(--font-family-body))] text-base font-medium text-[var(--nav-mobile-sub-link-text,hsl(var(--contrast-500)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:text-[var(--nav-mobile-sub-link-text-hover,hsl(var(--foreground)))] hover:backdrop-blur-sm focus-visible:outline-0 focus-visible:ring-2 @4xl:py-2"
                                                href={link.href}
                                                key={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                              >
                                                {link.label}
                                              </Link>
                                            );
                                          })}
                                        </div>
                                      ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  }
                </Stream>
                {/* Mobile Locale / Currency Dropdown */}
                {locales && locales.length > 1 && streamableCurrencies && (
                  <div className="p-2 @4xl:p-5">
                    <div className="flex items-center px-3 py-1 @4xl:py-2">
                      {/* Locale / Language Dropdown */}
                      {locales.length > 1 ? (
                        <LocaleSwitcher
                          activeLocaleId={activeLocaleId}
                          locales={
                            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                            locales as [(typeof locales)[0], (typeof locales)[0], ...typeof locales]
                          }
                        />
                      ) : null}

                      {/* Currency Dropdown */}
                      <Stream
                        fallback={null}
                        value={Streamable.all([streamableCurrencies, streamableActiveCurrencyId])}
                      >
                        {([currencies, activeCurrencyId]) =>
                          currencies.length > 1 && currencyAction ? (
                            <CurrencyForm
                              action={currencyAction}
                              activeCurrencyId={activeCurrencyId}
                              currencies={
                                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                                currencies as [(typeof currencies)[0], ...typeof currencies]
                              }
                            />
                          ) : null
                        }
                      </Stream>
                    </div>
                  </div>
                )}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Logo */}
        <div
          className={clsx(
            'flex items-center justify-start self-stretch',
            linksPosition === 'center' ? 'flex-1' : 'flex-1 @4xl:flex-none',
          )}
        >
          <Logo
            className={clsx(streamableMobileLogo != null ? 'hidden @4xl:flex' : 'flex')}
            height={logoHeight}
            href={logoHref}
            label={logoLabel}
            logo={streamableLogo}
            width={logoWidth}
          />
          {streamableMobileLogo != null && (
            <Logo
              className="flex @4xl:hidden"
              height={mobileLogoHeight}
              href={logoHref}
              label={logoLabel}
              logo={streamableMobileLogo}
              width={mobileLogoWidth}
            />
          )}
        </div>

        {/* Top Level Nav Links */}
        <ul
          className={clsx(
            'relative hidden gap-1 rounded-full bg-[rgb(240,240,240)] px-2 py-0.5 @4xl:flex @4xl:flex-[0.9]',
            {
              left: '@4xl:justify-start',
              center: '@4xl:justify-center',
              right: '@4xl:justify-end',
            }[linksPosition],
          )}
        >
          {/* Animated sliding background pill */}
          <div
            className="pointer-events-none absolute rounded-full bg-white shadow-md transition-all duration-300 ease-out"
            style={{
              left: `${activePillStyle.left - 6}px`,
              width: `${activePillStyle.width + 12}px`,
              height: 'calc(100% - 4px)',
              top: '2px',
              opacity: activePillStyle.opacity,
            }}
          />

          <Stream
            fallback={
              <ul className="flex min-h-[41px] animate-pulse flex-row items-center @4xl:gap-6 @4xl:p-2.5">
                <li>
                  <span className="block h-4 w-10 rounded-md bg-contrast-100" />
                </li>
                <li>
                  <span className="block h-4 w-14 rounded-md bg-contrast-100" />
                </li>
                <li>
                  <span className="block h-4 w-24 rounded-md bg-contrast-100" />
                </li>
                <li>
                  <span className="block h-4 w-16 rounded-md bg-contrast-100" />
                </li>
              </ul>
            }
            value={streamableLinks}
          >
            {(links) => (
              <NavigationLinks
                getIsActive={getIsActive}
                isFloating={isFloating}
                links={links}
                navItemsRef={navItemsRef}
                setActivePillStyle={setActivePillStyle}
              />
            )}
          </Stream>
        </ul>

        {/* Icon Buttons */}
        <div
          className={clsx(
            'flex items-center justify-end gap-0.5 transition-colors duration-300',
            linksPosition === 'center' ? 'flex-1' : 'flex-1 @4xl:flex-none',
          )}
        >
          {searchAction ? (
            <Popover.Root onOpenChange={setIsSearchOpen} open={isSearchOpen}>
              <Popover.Anchor className="absolute left-0 right-0 top-full" />
              <Popover.Trigger asChild>
                <button
                  aria-label={openSearchPopupLabel}
                  className={navButtonClassName}
                  onPointerEnter={(e) => e.preventDefault()}
                  onPointerLeave={(e) => e.preventDefault()}
                  onPointerMove={(e) => e.preventDefault()}
                >
                  <Search size={20} strokeWidth={2} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="z-[200] max-h-[calc(var(--radix-popover-content-available-height)-16px)] w-[var(--radix-popper-anchor-width)] py-2 @container data-[state=closed]:animate-dropdown-hide data-[state=open]:animate-dropdown-show">
                  <div className="relative flex max-h-[inherit] flex-col rounded-2xl border border-contrast-100/20 bg-background/50 shadow-2xl ring-1 ring-contrast-100/15 backdrop-blur-2xl backdrop-saturate-200 transition-all duration-200 ease-in-out before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/5 before:to-transparent @4xl:inset-x-0">
                    <SearchForm
                      searchAction={searchAction}
                      searchHref={searchHref}
                      searchInputPlaceholder={searchInputPlaceholder}
                      searchParamName={searchParamName}
                      searchSubmitLabel={searchSubmitLabel}
                    />
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ) : (
            <Link aria-label={searchLabel} className={navButtonClassName} href={searchHref}>
              <Search size={30} strokeWidth={2} />
            </Link>
          )}

          <Stream
            fallback={
              <Link aria-label={accountLabel} className={navButtonClassName} href="/login">
                <User size={20} strokeWidth={2} />
              </Link>
            }
            value={accountHref}
          >
            {(href) => (
              <Link aria-label={accountLabel} className={navButtonClassName} href={href}>
                <User size={20} strokeWidth={2} />
              </Link>
            )}
          </Stream>
          <Link aria-label={cartLabel} className={navButtonClassName} href={cartHref}>
            <ShoppingBag size={20} strokeWidth={2} />
            <Stream
              fallback={
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-contrast-100 text-xs text-background" />
              }
              value={streamableCartCount}
            >
              {(cartCount) =>
                cartCount != null &&
                cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--nav-cart-count-background,hsl(var(--foreground)))] font-[family-name:var(--nav-cart-count-font-family,var(--font-family-body))] text-xs text-[var(--nav-cart-count-text,hsl(var(--background)))]">
                    {cartCount}
                  </span>
                )
              }
            </Stream>
          </Link>

          {/* Locale / Language Dropdown */}
          {locales && locales.length > 1 ? (
            <LocaleSwitcher
              activeLocaleId={activeLocaleId}
              className="hidden @4xl:block"
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              locales={locales as [(typeof locales)[0], (typeof locales)[0], ...typeof locales]}
            />
          ) : null}

          {/* Currency Dropdown */}
          <Stream
            fallback={null}
            value={Streamable.all([streamableCurrencies, streamableActiveCurrencyId])}
          >
            {([currencies, activeCurrencyId]) =>
              currencies && currencies.length > 1 && currencyAction ? (
                <CurrencyForm
                  action={currencyAction}
                  activeCurrencyId={activeCurrencyId}
                  className="hidden @4xl:block"
                  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                  currencies={currencies as [(typeof currencies)[0], ...typeof currencies]}
                  switchCurrencyLabel={switchCurrencyLabel}
                />
              ) : null
            }
          </Stream>
        </div>
      </div>

      <div className="perspective-[2000px] absolute left-0 right-0 top-full z-[110] flex w-full justify-center">
        <NavigationMenu.Viewport className="relative mx-auto mt-2 w-full max-w-4xl data-[state=closed]:animate-dropdown-hide data-[state=open]:animate-dropdown-show" />
      </div>
    </NavigationMenu.Root>
  );
});

Navigation.displayName = 'Navigation';

export type { SearchResult } from './types';
