import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useActionState, useCallback, useEffect, useTransition } from 'react';

import { usePathname, useRouter } from '~/i18n/routing';

import type { Currency, CurrencyAction, Locale } from './types';

const navButtonClassName =
  'relative rounded-lg bg-[var(--nav-button-background,transparent)] p-1.5 text-[var(--nav-button-icon,hsl(var(--foreground)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors focus-visible:outline-0 focus-visible:ring-2 @4xl:hover:bg-[var(--nav-button-background-hover,hsl(var(--contrast-100)))] @4xl:hover:text-[var(--nav-button-icon-hover,hsl(var(--foreground)))]';

const useSwitchLocale = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  return useCallback(
    (locale: string) =>
      router.push(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params, query: Object.fromEntries(searchParams.entries()) },
        { locale },
      ),
    [pathname, params, router, searchParams],
  );
};

interface LocaleSwitcherProps {
  activeLocaleId?: string;
  locales: [Locale, ...Locale[]];
  className?: string;
}

export function LocaleSwitcher({
  locales,
  activeLocaleId,
  className,
}: LocaleSwitcherProps) {
  const activeLocale = locales.find((locale) => locale.id === activeLocaleId);
  const [isPending, startTransition] = useTransition();
  const switchLocale = useSwitchLocale();

  return (
    <div className={className}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={clsx(
            'flex items-center gap-1 text-xs uppercase transition-opacity disabled:opacity-30',
            navButtonClassName,
          )}
          disabled={isPending}
        >
          {activeLocale?.id ?? locales[0].id}
          <ChevronDown size={16} strokeWidth={1.5} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="z-[110] max-h-80 overflow-y-scroll rounded-xl bg-[var(--nav-locale-background,hsl(var(--background)))] p-2 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 @4xl:w-32 @4xl:rounded-2xl @4xl:p-2"
            sideOffset={16}
          >
            {locales.map(({ id, label }) => (
              <DropdownMenu.Item
                className={clsx(
                  'cursor-default rounded-lg bg-[var(--nav-locale-link-background,transparent)] px-2.5 py-2 font-[family-name:var(--nav-locale-link-font-family,var(--font-family-body))] text-sm font-medium text-[var(--nav-locale-link-text,hsl(var(--contrast-400)))] outline-none ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors hover:bg-[var(--nav-locale-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-locale-link-text-hover,hsl(var(--foreground)))]',
                  {
                    'text-[var(--nav-locale-link-text-selected,hsl(var(--foreground)))]':
                      id === activeLocaleId,
                  },
                )}
                key={id}
                onSelect={() => startTransition(() => switchLocale(id))}
              >
                {label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

interface CurrencyFormProps {
  activeCurrencyId?: string;
  action: CurrencyAction;
  currencies: [Currency, ...Currency[]];
  switchCurrencyLabel?: string;
  className?: string;
}

export function CurrencyForm({
  action,
  currencies,
  activeCurrencyId,
  switchCurrencyLabel = 'Switch currency',
  className,
}: CurrencyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastResult, formAction] = useActionState(action, null);
  const activeCurrency = currencies.find((currency) => currency.id === activeCurrencyId);

  useEffect(() => {
    // eslint-disable-next-line no-console
    if (lastResult?.error) console.log(lastResult.error);
  }, [lastResult?.error]);

  return (
    <div className={className}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={clsx(
            'flex items-center gap-1 text-xs uppercase transition-opacity disabled:opacity-30',
            navButtonClassName,
          )}
          disabled={isPending}
        >
          {activeCurrency?.label ?? currencies[0].label}
          <ChevronDown size={16} strokeWidth={1.5}>
            <title>{switchCurrencyLabel}</title>
          </ChevronDown>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="z-[110] max-h-80 overflow-y-scroll rounded-xl bg-[var(--nav-locale-background,hsl(var(--background)))] p-2 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 @4xl:w-32 @4xl:rounded-2xl @4xl:p-2"
            sideOffset={16}
          >
            {currencies.map((currency) => (
              <DropdownMenu.Item
                className={clsx(
                  'cursor-default rounded-lg bg-[var(--nav-locale-link-background,transparent)] px-2.5 py-2 font-[family-name:var(--nav-locale-link-font-family,var(--font-family-body))] text-sm font-medium text-[var(--nav-locale-link-text,hsl(var(--contrast-400)))] outline-none ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors hover:bg-[var(--nav-locale-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-locale-link-text-hover,hsl(var(--foreground)))]',
                  {
                    'text-[var(--nav-locale-link-text-selected,hsl(var(--foreground)))]':
                      currency.id === activeCurrencyId,
                  },
                )}
                key={currency.id}
                onSelect={() => {
                  // eslint-disable-next-line @typescript-eslint/require-await
                  startTransition(async () => {
                    const formData = new FormData();

                    formData.append('id', currency.id);
                    formAction(formData);

                    // This is needed to refresh the Data Cache after the product has been added to the cart.
                    // The cart id is not picked up after the first time the cart is created/updated.
                    router.refresh();
                  });
                }}
              >
                {currency.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}