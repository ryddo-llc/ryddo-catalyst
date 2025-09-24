# Category Card Carousel

A responsive carousel component for displaying category cards with images, titles, and optional subtitles.

## Usage

```tsx
import { CategoryCardCarousel } from '~/vibes/soul/sections/category-card-carousel';

const categories = [
  {
    href: '/category/e-bikes',
    title: 'E-Bikes',
    subtitle: 'Electric powered bikes',
    image: { src: '/images/ebikes.jpg', alt: 'E-Bikes' },
    count: 25
  },
  // ... more categories
];

<CategoryCardCarousel
  cards={categories}
  aspectRatio="3:4"
  textColorScheme="dark"
  carouselColorScheme="light"
  showButtons={true}
  showScrollbar={true}
/>
```

## Props

- `cards`: Array of category card content (href, title, subtitle, image, icon, count)
- `aspectRatio`: Image aspect ratio - '5:6' | '3:4' | '1:1' (default: '5:6')
- `textColorScheme`: Text color scheme - 'light' | 'dark'
- `iconColorScheme`: Icon color scheme - 'light' | 'dark'
- `carouselColorScheme`: Carousel controls color scheme - 'light' | 'dark' (default: 'light')
- `showButtons`: Show navigation buttons (default: true)
- `showScrollbar`: Show scrollbar (default: true)
- `hideOverflow`: Hide overflow content (default: false)

## Dependencies

- `clsx`: For conditional class names
- `lucide-react`: For arrow icons
- `embla-carousel-react`: For carousel functionality

## Component Structure

- **CategoryCardCarousel**: Main carousel component
- **CategoryCard**: Individual category card component
- **CategoryCardSkeleton**: Loading skeleton for cards
- **CategoryCardCarouselEmptyState**: Empty state display