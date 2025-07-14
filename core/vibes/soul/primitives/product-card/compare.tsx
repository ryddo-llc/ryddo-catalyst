'use client';

import { useQueryState } from 'nuqs';
import { startTransition } from 'react';

import { Button } from '@/vibes/soul/primitives/button';
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
    <Button
      variant={isInCompare ? 'primary' : 'secondary'}
      size="small"
      shape="rounded"
      disabled={isDisabled}
      onClick={handleCompare}
      className="min-w-24 bg-[#0000009e] px-4 text-white hover:bg-[#000000b3]"
    >
      {isInCompare ? (
        <span className="flex items-center gap-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
          {label}
        </span>
      ) : (
        label
      )}
    </Button>
  );
};
