import { useForm } from '@conform-to/react';
import { clsx } from 'clsx';
import debounce from 'lodash.debounce';
import { ArrowRight, Clock, Loader2, SearchIcon, TrendingUp, X } from 'lucide-react';
import { useActionState, useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Button } from '@/vibes/soul/primitives/button';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import { Link } from '~/components/link';

import type { SearchAction, SearchResult } from './types';

interface SearchFormProps<S extends SearchResult> {
  searchAction: SearchAction<S>;
  searchParamName?: string;
  searchHref?: string;
  searchInputPlaceholder?: string;
  searchSubmitLabel?: string;
}

export function SearchForm<S extends SearchResult>({
  searchAction,
  searchParamName = 'query',
  searchHref = '/search',
  searchInputPlaceholder = 'Search Products',
  searchSubmitLabel = 'Submit',
}: SearchFormProps<S>) {
  const [query, setQuery] = useState('');
  const [isSearching, startSearching] = useTransition();
  const [{ searchResults, lastResult, emptyStateTitle, emptyStateSubtitle }, formAction] =
    useActionState(searchAction, {
      searchResults: null,
      lastResult: null,
    });
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const isPending = isSearching || isDebouncing || isSubmitting;
  const debouncedOnChange = useMemo(() => {
    const debounced = debounce((q: string) => {
      setIsDebouncing(false);

      const formData = new FormData();

      formData.append(searchParamName, q);

      startSearching(() => {
        formAction(formData);
      });
    }, 300);

    return (q: string) => {
      setIsDebouncing(true);

      debounced(q);
    };
  }, [formAction, searchParamName]);

  const [form] = useForm({ lastResult });

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    setHasSearched(true);

    if (query.trim()) {
      const searches = [...new Set([query, ...recentSearches])].slice(0, 5);

      setRecentSearches(searches);

      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(searches));
      }
    }
  }, [query, recentSearches]);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setIsDebouncing(false);
  }, []);

  const handleRecentSearchClick = useCallback((search: string) => {
    setQuery(search);
    setHasSearched(true);
    debouncedOnChange(search);
  }, [debouncedOnChange]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');

      if (stored) {
        const parsedSearches = JSON.parse(stored);

        if (Array.isArray(parsedSearches)) {
          setRecentSearches(parsedSearches);
          setHasSearched(parsedSearches.length > 0);
        }
      }
    }
  }, []);

  return (
    <>
      <form
        action={searchHref}
        className="flex items-center gap-3 px-3 py-3 @4xl:px-5 @4xl:py-4"
        onSubmit={handleSubmit}
      >
        <SearchIcon
          className="hidden shrink-0 text-[var(--nav-search-icon,hsl(var(--contrast-500)))] @xl:block"
          size={20}
          strokeWidth={1}
        />
        <input
          className="grow bg-transparent pl-2 text-lg font-medium outline-0 focus-visible:outline-none @xl:pl-0"
          name={searchParamName}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            debouncedOnChange(e.currentTarget.value);
          }}
          placeholder={searchInputPlaceholder}
          type="text"
          value={query}
        />
        {query ? (
          <button
            aria-label="Clear search"
            className="rounded-full p-1 text-gray-400 hover:text-gray-600"
            onClick={handleClearSearch}
            type="button"
          >
            <X size={16} strokeWidth={2} />
          </button>
        ) : null}
        <SubmitButton loading={isPending} submitLabel={searchSubmitLabel} />
      </form>

      {/* Recent & Trending Searches */}
      {query === '' && hasSearched && recentSearches.length > 0 && (
        <div aria-label="Recent searches" className="border-b border-[var(--search-popup-border,hsl(var(--contrast-100)))] p-3 @sm:p-4 @4xl:p-6" role="region">
          <div className="mb-2 flex items-center gap-2 @sm:mb-3">
            <Clock aria-hidden="true" className="text-[var(--search-section-title,hsl(var(--contrast-500)))] @sm:h-4 @sm:w-4" size={14} />
            <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--search-section-title,hsl(var(--contrast-500)))] @sm:text-sm">
              Recent Searches
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 @sm:gap-2" role="list">
            {recentSearches.map((search) => (
              <button
                aria-label={`Search for ${search}`}
                className="rounded-full bg-[var(--search-result-hover,hsl(var(--primary)/5%))] px-2.5 py-1 text-xs font-medium text-[var(--search-recent-text,hsl(var(--contrast-400)))] transition-all hover:bg-[var(--search-input-border-focus,hsl(var(--primary)))] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--search-input-border-focus,hsl(var(--primary)))] @sm:px-3 @sm:py-1.5 @sm:text-sm"
                key={search}
                onClick={() => handleRecentSearchClick(search)}
                tabIndex={0}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      <SearchResults
        emptySearchSubtitle={emptyStateSubtitle}
        emptySearchTitle={emptyStateTitle}
        errors={form.errors}
        query={query}
        searchHref={searchHref}
        searchParamName={searchParamName}
        searchResults={searchResults}
        stale={isPending}
      />
    </>
  );
}

interface SubmitButtonProps {
  loading: boolean;
  submitLabel: string;
}

function SubmitButton({ loading, submitLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      loading={pending || loading}
      shape="circle"
      size="small"
      type="submit"
      variant="primary"
    >
      <ArrowRight aria-label={submitLabel} size={20} strokeWidth={1.5} />
    </Button>
  );
}

interface SearchResultsProps {
  query: string;
  searchHref: string;
  searchParamName: string;
  emptySearchTitle?: string;
  emptySearchSubtitle?: string;
  searchResults: SearchResult[] | null;
  stale: boolean;
  errors?: string[];
}

function SearchResults({
  query,
  searchHref,
  searchResults,
  stale,
  emptySearchTitle = `No results were found for '${query}'`,
  emptySearchSubtitle = 'Please try another search.',
  errors,
}: SearchResultsProps) {
  if (query === '') return null;

  if (errors != null && errors.length > 0) {
    if (stale) return null;

    return (
      <div className="flex flex-col border-t border-[var(--nav-search-divider,hsl(var(--contrast-100)))] p-6">
        {errors.map((error) => (
          <FormStatus key={error} type="error">
            {error}
          </FormStatus>
        ))}
      </div>
    );
  }

  if (searchResults == null || searchResults.length === 0) {
    if (stale) return null;

    return (
      <div className="flex flex-col items-center justify-center p-6 text-center @sm:p-8">
        <div className="mb-3 rounded-full bg-[var(--search-result-hover,hsl(var(--primary)/5%))] p-3 @sm:mb-4 @sm:p-4">
          <SearchIcon className="text-[var(--search-input-placeholder,hsl(var(--contrast-400)))] @sm:h-8 @sm:w-8" size={24} strokeWidth={1.5} />
        </div>
        <p className="mb-2 text-lg font-medium text-[var(--nav-search-empty-title,hsl(var(--foreground)))] @sm:text-xl">
          {emptySearchTitle}
        </p>
        <p className="text-xs text-[var(--nav-search-empty-subtitle,hsl(var(--contrast-500)))] @sm:text-sm">
          {emptySearchSubtitle}
        </p>
      </div>
    );
  }

  return (
    <div
      aria-busy={stale}
      aria-label="Search results"
      aria-live="polite"
      className={clsx(
        'relative flex flex-1 flex-col overflow-y-auto @2xl:flex-row',
        stale && 'pointer-events-none opacity-40',
      )}
      role="region"
    >
      {stale && (
        <div aria-hidden="true" className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
          <span className="sr-only">Loading search results...</span>
          <Loader2 aria-hidden="true" className="animate-spin text-[var(--search-loader-color,hsl(var(--primary)))]" size={32} />
        </div>
      )}
      {searchResults.map((result, index) => {
        switch (result.type) {
          case 'links': {
            return (
              <section
                aria-label={result.title}
                className="flex w-full flex-col gap-1 border-b border-[var(--search-result-border,hsl(var(--contrast-100)))] bg-gradient-to-b from-transparent to-[var(--search-result-hover,hsl(var(--primary)/2%))] p-4 @sm:p-5 @2xl:max-w-80 @2xl:border-b-0 @2xl:border-r"
                key={`result-${index}`}
              >
                <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--search-section-title,hsl(var(--contrast-500)))]">
                  <span className="h-px flex-1 bg-[var(--search-result-border,hsl(var(--contrast-100)))]" />
                  {result.title}
                  <span className="h-px flex-1 bg-[var(--search-result-border,hsl(var(--contrast-100)))]" />
                </h3>
                <ul>
                  {result.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        aria-label={`Navigate to ${link.label}`}
                        className="group relative block rounded-lg bg-[var(--nav-search-result-link-background,transparent)] px-3 py-3 font-[family-name:var(--nav-search-result-link-font-family,var(--font-family-body))] font-medium text-[var(--nav-search-result-link-text,hsl(var(--contrast-500)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-all hover:bg-[var(--search-result-hover,hsl(var(--primary)/5%))] hover:pl-4 hover:text-[var(--nav-search-result-link-text-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
                        href={link.href}
                        tabIndex={0}
                      >
                        <span aria-hidden="true" className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 bg-[var(--search-input-border-focus,hsl(var(--primary)))] transition-all group-hover:h-full" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          case 'products': {
            return (
              <section
                aria-label={result.title}
                className="flex w-full flex-col gap-3 p-4 @sm:gap-5 @sm:p-5"
                key={`result-${index}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--search-section-title,hsl(var(--contrast-500)))]">
                    <TrendingUp size={14} />
                    {result.title}
                  </h3>
                  <Link 
                    className="text-sm font-medium text-[var(--search-input-border-focus,hsl(var(--primary)))] hover:underline" 
                    href={searchHref}
                  >
                    View all →
                  </Link>
                </div>
                <ul
                  aria-label="Product results"
                  className="grid w-full grid-cols-2 gap-5 @xl:grid-cols-4 @2xl:grid-cols-2 @4xl:grid-cols-4"
                                  >
                  {result.products.map((product) => (
                    <li key={product.id}>
                      <ProductCard
                        imageSizes="(min-width: 42rem) 25vw, 50vw"
                        product={{
                          id: product.id,
                          title: product.title,
                          href: product.href,
                          price: product.price,
                          image: product.image,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}