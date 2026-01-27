import type { RangeFilter } from '@/vibes/soul/sections/products-list-section/filters-panel';

export const createPriceFilter = (): RangeFilter => ({
  type: 'range',
  minParamName: 'minPrice',
  maxParamName: 'maxPrice',
  label: 'Price',
  minPrepend: '$',
  maxPrepend: '$',
  minPlaceholder: 'Min',
  maxPlaceholder: 'Max',
});
