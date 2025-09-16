# CLAUDE.md - Codebase Reference Guide

## Project Overview
This is a **BigCommerce Catalyst** storefront - a composable, headless e-commerce platform built on Next.js 15. It's a monorepo managed with pnpm workspaces and Turbo.

## Critical Commands
```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm lint       # Run ESLint
pnpm typecheck  # Run TypeScript type checking
```

## Project Structure
```
/core                    # Main Next.js application
  /app                   # App Router pages and layouts
    /[locale]           # Internationalized routes
      /(default)        # Main storefront routes
      /(auth)           # Authentication routes
    /api                # API routes
  /components           # Shared UI components
    /ui                 # Base UI components
    /product            # Product-related components
    /header             # Header components
    /footer             # Footer components
  /client               # GraphQL client setup
    /fragments          # GraphQL fragments
  /lib                  # Utility functions
  /messages             # i18n translation files
  /tests                # Playwright tests
    /ui                 # UI tests
    /visual-regression  # Visual regression tests
/packages               # Shared packages
  /catalyst-client      # BigCommerce client
/components             # Global components
  /arrow-button         # Shared arrow button component
```

## Tech Stack

### Core Technologies
- **Framework**: Next.js 15.4.0 (App Router)
- **Language**: TypeScript 5.8.3
- **Runtime**: React 19.1.0
- **Package Manager**: pnpm 10.12.4

### Styling & UI
- **CSS Framework**: TailwindCSS 3.4.17
- **Component Library**: Radix UI
- **Icons**: Lucide React (primary), React Icons
- **Animations**: tailwindcss-animate, Embla Carousel
- **Fonts**: 
  - Inter (body text)
  - Nunito (headings)
  - Kanit (special text, weights 100-900)

### Data & State
- **GraphQL**: gql.tada (type-safe queries)
- **Forms**: Conform + Zod validation
- **Authentication**: NextAuth v5 (Auth.js)
- **Cache**: Vercel KV, Upstash Redis

### Internationalization
- **i18n**: next-intl with locale support

### Analytics & Monitoring
- **Analytics**: Vercel Analytics
- **Speed Insights**: Vercel Speed Insights

## Component Patterns

### Server Actions
- Located in `_actions` folders
- Used for mutations and form submissions
- Example: `/cart/_actions/update-quantity.ts`

### GraphQL Queries
- Use `gql.tada` for type safety
- Fragments defined in component folders
- Client located at `/core/client/`

### Form Handling
```typescript
// Use Conform with Zod schemas
import { conform } from '@conform-to/react';
import { z } from 'zod';
```

### Component Structure
- Server Components by default
- Client Components marked with 'use client'
- Shared components in `/core/components/`

## Styling Guidelines

### TailwindCSS Configuration
- Custom colors: primary, accent, success, error, warning, info
- Contrast levels: 100-500
- Shadow utilities: sm, base, md, lg, xl
- Container queries enabled

### CSS Variables
```css
--primary: 337 94% 58%    /* Ryddo pink */
--accent: 96 100% 88%
--background: 0 0% 100%
--foreground: 0 100% 0%
```

### Responsive Design
- Mobile-first approach
- Container queries for component-level responsiveness
- Breakpoints: sm, md, lg, xl, 2xl

## Important Conventions

### File Naming
- Components: PascalCase (e.g., `ProductCard.tsx`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Server Actions: kebab-case (e.g., `update-cart.ts`)

### Data Fetching
1. **Always check for existing GraphQL fragments** before creating new queries
2. **Use server components** for data fetching when possible
3. **Implement proper error boundaries** for data loading states

### Component Creation Checklist
Before creating a new component:
1. ✅ Check `/core/components/` for existing similar components
2. ✅ Check Radix UI for primitive components
3. ✅ Review nearby components for patterns and conventions
4. ✅ Check if server actions already exist for your use case
5. ✅ Verify dependencies in `package.json`

## Environment Variables
Required variables (see `.env.example`):
- `BIGCOMMERCE_STORE_HASH`
- `BIGCOMMERCE_STOREFRONT_TOKEN`
- `BIGCOMMERCE_CHANNEL_ID`
- `AUTH_SECRET`
- `DEFAULT_REVALIDATE_TARGET`

## Testing

### Test Structure
- **Location**: `/core/tests/`
- **E2E Tests**: `/core/tests/ui/e2e/`
- **Visual Tests**: `/core/tests/visual-regression/`
- **Test Files**: `*.spec.ts`

### Running Tests
```bash
# Run Playwright tests
cd core && npx playwright test
```

## Available Components

### Core UI Components
- `/core/components/ui/` - Base UI components
- `/core/components/product/` - Product displays, galleries, forms
- `/core/components/header/` - Navigation, search, account
- `/core/components/footer/` - Footer sections
- `/core/components/breadcrumbs/` - Navigation breadcrumbs

### Feature Components
- `/core/components/featured-products-carousel/`
- `/core/components/featured-products-list/`
- `/core/components/category-showcase/`
- `/core/components/product-showcase/`
- `/core/components/popular-products/`

### Utility Components
- `/core/components/analytics/` - Analytics providers
- `/core/components/force-refresh/` - Page refresh utilities
- `/core/components/modal/` - Modal dialogs
- `/core/components/wishlist/` - Wishlist functionality

## DO NOT CREATE
❌ New documentation files unless explicitly requested
❌ Duplicate components that already exist
❌ New dependencies without checking package.json first
❌ Custom UI primitives if Radix UI has them
❌ New styling systems (use TailwindCSS)

## ALWAYS CHECK BEFORE CODING
✅ Existing components in `/core/components/`
✅ Server actions in `_actions` folders
✅ GraphQL fragments for data patterns
✅ Radix UI for UI primitives
✅ Existing utilities in `/core/lib/`
✅ Current imports and patterns in nearby files

## Code Quality Standards
- TypeScript strict mode enabled
- ESLint configuration from `@bigcommerce/eslint-config`
- Prettier with TailwindCSS plugin
- No `any` types without justification
- Proper error handling in server actions
- Accessibility standards (WCAG 2.1 AA)

## Performance Guidelines
- Use Next.js Image component for images
- Implement proper loading states
- Use Suspense boundaries for async components
- Minimize client-side JavaScript
- Leverage ISR/SSG where appropriate

## Security
- Never expose API keys in client code
- Validate all user inputs with Zod
- Use server actions for mutations
- Implement proper CSRF protection
- Follow CSP guidelines in `next.config.ts`