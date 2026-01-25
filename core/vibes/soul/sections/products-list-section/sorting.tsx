'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useOptimistic, useState, useTransition } from 'react';

import { SelectField } from '@/vibes/soul/form/select-field';
import { Streamable, useStreamable } from '@/vibes/soul/lib/streamable';

export interface Option {
  label: string;
  value: string;
}

export function Sorting({
  label: streamableLabel,
  options: streamableOptions,
  paramName = 'sort',
  defaultValue = '',
  placeholder: streamablePlaceholder,
}: {
  label?: Streamable<string | null>;
  options: Streamable<Option[]>;
  paramName?: string;
  defaultValue?: string;
  placeholder?: Streamable<string | null>;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [param, setParam] = useQueryState(
    paramName,
    parseAsString.withDefault(defaultValue).withOptions({ shallow: false, history: 'push' }),
  );
  const [optimisticParam, setOptimisticParam] = useOptimistic(param);
  const [isPending, startTransition] = useTransition();
  const options = useStreamable(streamableOptions);
  const label = useStreamable(streamableLabel) ?? 'Sort';
  const placeholder = useStreamable(streamablePlaceholder) ?? 'Sort by';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <SortingSkeleton />;
  }

  return (
    <SelectField
      hideLabel
      label={label}
      name={paramName}
      onValueChange={(value) => {
        startTransition(async () => {
          setOptimisticParam(value);
          await setParam(value);
        });
      }}
      options={options}
      pending={isPending}
      placeholder={placeholder}
      value={optimisticParam}
      variant="finder"
    />
  );
}

export function SortingSkeleton() {
  return <div className="h-[50px] w-[12ch] animate-pulse rounded-full border border-contrast-200 bg-white" />;
}
