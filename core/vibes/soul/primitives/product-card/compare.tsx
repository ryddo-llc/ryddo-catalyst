'use client';

import { useQueryState } from 'nuqs';
import { startTransition } from 'react';

import { useCompareDrawer } from '@/vibes/soul/primitives/compare-drawer';
import { compareParser } from '@/vibes/soul/primitives/compare-drawer/loader';

interface CompareDrawerItem {
  id: string;
  image?: { src: string; alt: string };
  href: string;
  title: string;
}

interface Props {
  colorScheme?: 'light' | 'dark';
  paramName?: string;
  label?: string;
  product: CompareDrawerItem;
}

export const Compare = function Compare({
  paramName = 'compare',
  label = 'Compare',
  product,
}: Props) {
  const [, setParam] = useQueryState(paramName, compareParser);

  const { optimisticItems, setOptimisticItems, maxItems } = useCompareDrawer();

  const isInCompare = !!optimisticItems.find((item) => item.id === product.id);
  const isDisabled = !isInCompare && maxItems !== undefined && optimisticItems.length >= maxItems;

  const handleCompare = () => {
    startTransition(async () => {
      setOptimisticItems({
        type: isInCompare ? 'remove' : 'add',
        item: product,
      });

      await setParam((prev) => {
        const next = isInCompare
          ? (prev ?? []).filter((v) => v !== product.id)
          : [...(prev ?? []), product.id];

        return next.length > 0 ? next : null;
      });
    });
  };

  return (
    <button
      className="w-full bg-black/[.62] px-2.5 py-[7px] text-white rounded-lg text-sm font-semibold tracking-wider leading-5 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isDisabled}
      onClick={handleCompare}
      type="button"
    >
      {isInCompare ? (
        <span className="flex items-center gap-1">
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
          {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
};
