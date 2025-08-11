import { Streamable } from '@/vibes/soul/lib/streamable';

export type ProductPrice = Streamable<
  | {
      type?: 'sale' | 'range';
      currentValue?: string;
      previousValue?: string;
      minValue?: string;
      maxValue?: string;
    }
  | string
  | null
>;