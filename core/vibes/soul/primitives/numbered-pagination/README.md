# Numbered Pagination Component

A numbered pagination component that displays page numbers alongside navigation arrows, designed to work with both cursor-based and page-based navigation systems.

## Features

- **Visual Page Numbers**: Shows current page and surrounding page numbers
- **Hybrid Navigation**: Works with both cursor-based pagination and direct page navigation
- **Accessible**: Proper ARIA labels and semantic HTML
- **Responsive**: Adapts to different screen sizes
- **Customizable**: Configurable number of visible pages
- **Smart Display**: Handles single-item pages gracefully ("Showing X of Y" vs "Showing X-Y of Y")

## Usage

### Basic Usage

```tsx
import { NumberedPagination, NumberedPaginationInfo } from '@/vibes/soul/primitives/numbered-pagination';

const paginationInfo: NumberedPaginationInfo = {
  startCursorParamName: 'before',
  endCursorParamName: 'after',
  startCursor: 'cursor-123',
  endCursor: 'cursor-456',
  totalItems: 100,
  itemsPerPage: 9,
  currentPage: 2,
  totalPages: 12,
  pageParamName: 'page',
};

<NumberedPagination info={paginationInfo} />
```

### With ProductsListSection

```tsx
import { numberedPaginationTransformer } from '~/data-transformers/numbered-pagination-transformer';

// In page component
const streamableNumberedPagination = Streamable.from(async () => {
  const search = await streamableFacetedSearch;
  const searchParams = await props.searchParams;
  const totalItems = search.products.collectionInfo?.totalItems ?? 0;
  const itemsPerPage = 9;
  
  // Get current page from URL parameter
  let currentPage = 1;
  const { page } = searchParams;
  if (typeof page === 'string') {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum > 0) {
      currentPage = pageNum;
    }
  }

  return numberedPaginationTransformer(search.products.pageInfo, {
    totalItems,
    itemsPerPage,
    currentPage,
    pageParamName: 'page',
  });
});

<ProductsListSection
  numberedPaginationInfo={streamableNumberedPagination}
  useNumberedPagination={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `info` | `Streamable<NumberedPaginationInfo>` | Required | Pagination information |
| `label` | `Streamable<string \| null>` | `'pagination'` | ARIA label for the navigation |
| `previousLabel` | `Streamable<string \| null>` | `'Go to previous page'` | Label for previous button |
| `nextLabel` | `Streamable<string \| null>` | `'Go to next page'` | Label for next button |
| `scroll` | `boolean` | `false` | Whether to scroll to top on navigation |
| `maxVisiblePages` | `number` | `5` | Maximum number of page numbers to show |

## NumberedPaginationInfo Interface

```tsx
interface NumberedPaginationInfo {
  startCursorParamName?: string;
  startCursor?: string | null;
  endCursorParamName?: string;
  endCursor?: string | null;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  pageParamName?: string;
}
```

## Navigation Strategy

The component uses a hybrid approach:

1. **Page Numbers**: Direct navigation using the `page` URL parameter
2. **Arrow Buttons**: Cursor-based navigation with `before`/`after` parameters
3. **Synchronization**: Both approaches update the `page` parameter to keep UI in sync

### Data Fetching

For page-based navigation (pages 2+), the system:
- Fetches more products than needed (e.g., 18 products for page 2)
- Slices the results to show only the current page's products
- Maintains cursor-based navigation for arrow buttons

## Styling

The component uses Tailwind CSS classes and follows the design system. Key styling classes:

- **Container**: `py-10` for vertical padding
- **Page Numbers**: `h-10 w-10` for consistent sizing
- **Current Page**: Pink background with white text (`bg-pink-500 text-white`)
- **Navigation Arrows**: Pink text with hover effects
- **Borders**: Darker contrast for better visibility

## Accessibility

- Proper ARIA labels for all interactive elements
- Semantic HTML with `<nav>` and `<ul>` elements
- Keyboard navigation support
- Screen reader friendly
- `aria-current="page"` for current page indicator

## Example Output

The component renders pagination like this:

```
← 1 2 3 4 5 →
```

Where:
- `←` and `→` are clickable navigation arrows using cursor pagination
- Numbers are clickable and use direct page navigation
- The current page is highlighted with pink background
- Single-item pages show "Showing X of Y" instead of "Showing X-X of Y"

## Integration Notes

When using with `ProductsListSection`:

1. Set `useNumberedPagination={true}`
2. Provide `numberedPaginationInfo` streamable
3. The component automatically handles "Showing X-Y of Z results" text
4. Product slicing is handled automatically for page-based navigation
