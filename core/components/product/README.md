# Product Components

This directory contains all product detail page components organized by functionality and product type.

## 🏗️ Folder Structure

```
core/components/product/
├── index.ts                          # Main exports - use this for external imports
├── shared/                           # ♻️ Reusable components across product types
│   ├── product-badges.tsx           # Stock status and sale price badges
│   ├── product-detail-skeletons.tsx # Loading states for all components
│   └── product-side-cards.tsx       # Offers card and authorized dealer card
├── bike/                            # 🚲 Bike-specific components
│   ├── product-detail-bike.tsx      # Main bike product detail layout
│   └── bike-specifications.tsx      # Bike technical specifications icons
├── scooter/                         # 🛴 Scooter-specific components
│   └── product-detail-scooter.tsx   # Main scooter product detail layout
└── layout/                          # 🏗️ Base layout and routing components
    ├── product-detail-layout.tsx    # Base product detail layout template
    └── product-detail-router.tsx    # Routes to appropriate product type component
```

## 📋 Component Responsibilities

### `/shared` - Reusable Components

These components work across all product types and contain no product-specific logic:

- **`ProductBadges`** - Displays stock status ("In Stock", "Out of Stock") and sale indicators
- **`OffersCard`** & **`AuthorizedDealerCard`** - Side panel cards with offers and purchase options
- **Skeleton Components** - Loading states for consistent UX across product types

### `/bike` - Bike-Specific Components

Components tailored specifically for bicycle products:

- **`ProductDetailBike`** - Main bike layout with hero image, specifications, and side cards
- **`BikeSpecsIcons`** - Technical specifications displayed as icons (motor, battery, speed, etc.)

### `/scooter` - Scooter-Specific Components

Components tailored specifically for scooter products:

- **`ProductDetailScooter`** - Uses base layout with scooter-specific specifications

### `/layout` - Base Layout & Routing

Foundation components that handle routing and base layout structure:

- **`ProductDetailLayout`** - Base template that other product types extend
- **`product-detail-router.tsx`** - Routes to the appropriate product component based on categories

## 🔧 Usage

### External Imports

Always import from the main index file for clean imports:

```tsx
import {
  ProductDetailBike,
  ProductDetailScooter,
  getProductDetailVariant,
} from '~/components/product';
```

### Adding New Product Types

To add a new product type (e.g., helmets, accessories):

1. **Create product folder**: `mkdir accessories/`
2. **Create main component**: `accessories/product-detail-accessories.tsx`
3. **Add any specific components**: `accessories/accessory-specifications.tsx`
4. **Update router**: Add routing logic in `layout/product-detail-router.tsx`
5. **Update exports**: Add exports to main `index.ts`
6. **Update this README**: Document the new product type

### Component Development Guidelines

#### Import Order

Follow this import order in components:

```tsx
// 1. React imports
import { ReactNode } from 'react';

// 2. External library imports
import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Rating } from '@/vibes/soul/primitives/rating';

// 3. Internal imports (relative paths)
import { BikeSpecsIcons } from './bike-specifications';
import { ProductBadges } from '../shared/product-badges';
import { BaseProductDetailProduct } from '../layout/product-detail-layout';
```

#### Shared Component Usage

When creating product-specific components, reuse shared components:

```tsx
// ✅ Good - Reuse shared components
import { ProductBadges } from '../shared/product-badges';
import { OffersCard, AuthorizedDealerCard } from '../shared/product-side-cards';

// ❌ Avoid - Don't recreate similar functionality
const MyCustomBadge = () => {
  /* ... */
};
```

#### TypeScript Conventions

- Extend `BaseProductDetailProduct` for product-specific interfaces
- Use generic types for form field handling: `<F extends Field>`
- Keep interface definitions close to their usage

## 🎨 Design System Integration

All components use the **VIBES design system** components:

- **Badges**: Use `@/vibes/soul/primitives/badge` patterns
- **Buttons**: Use `@/vibes/soul/primitives/button`
- **Skeletons**: Use `@/vibes/soul/primitives/skeleton`
- **Layouts**: Follow `@/vibes/soul/sections/product-detail` patterns

## 🔄 Stream Pattern Usage

Components use the **Stream pattern** for data loading:

```tsx
<Stream fallback={<ProductBadgesSkeleton />} value={product.inventoryStatus}>
  {(status) => <ProductBadges inventoryStatus={status} price={product.price} />}
</Stream>
```

**Best Practices:**

- Always provide skeleton fallbacks
- Handle null/undefined states gracefully
- Use `Streamable.all()` for multiple dependencies
