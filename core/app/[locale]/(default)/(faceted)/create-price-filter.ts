import type { RangeFilter } from '@/vibes/soul/sections/products-list-section/filters-panel';

export const createPriceFilter = (label: string): RangeFilter => ({
  type: 'range',
  minParamName: 'minPrice',
  maxParamName: 'maxPrice',
  label,
  minPrepend: '$',
  maxPrepend: '$',
  minPlaceholder: 'Min',
  maxPlaceholder: 'Max',
});
