# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BigCommerce Catalyst** - A composable, headless e-commerce storefront framework built on Next.js 15. This is a monorepo managed with pnpm workspaces and Turbo.

**Important:** As of January 6, 2025, the `main` branch is frozen. The default branch is now `canary`. Always work with and submit PRs to the `canary` branch.

## Requirements

- Node.js version 20 or 22
- pnpm 10.12.4 (enable with `corepack enable pnpm`)

## Essential Commands

```bash
# Development
pnpm dev                    # Start dev server (uses .env.local)
pnpm build                  # Build for production (uses .env.local)
pnpm lint                   # Run ESLint across all packages
pnpm typecheck              # Run TypeScript type checking

# Core package specific (from /core directory)
cd core
npm run dev                 # Generate GraphQL types + start Next.js dev
npm run generate            # Generate GraphQL types only
npm run build               # Generate types + build Next.js
npm run build:analyze       # Build with bundle analyzer
npm run typecheck           # Type check without building
npm run lint                # Lint the core package

# Testing
cd core && npx playwright test              # Run all Playwright tests
cd core && npx playwright test --ui         # Run tests in UI mode
cd core && npx playwright test <file>       # Run specific test file
```

## Monorepo Structure

```
/
├── core/                          # Main Next.js storefront application
│   ├── app/[locale]/             # Internationalized App Router
│   │   ├── (default)/            # Main storefront route group
│   │   │   ├── (auth)/          # Auth-related routes (login, register, etc.)
│   │   │   ├── product/[slug]/  # Product pages
│   │   │   ├── cart/            # Cart functionality
│   │   │   └── ...
│   │   └── layout.tsx           # Root locale layout
│   ├── client/                   # GraphQL client configuration
│   │   ├── index.ts             # Main client export
│   │   ├── graphql.ts           # gql.tada setup
│   │   └── fragments/           # Reusable GraphQL fragments
│   ├── components/               # Shared UI components
│   ├── lib/                      # Utility functions
│   ├── middlewares/              # Next.js middlewares (composed)
│   ├── messages/                 # i18n translation files
│   ├── tests/                    # Playwright tests
│   ├── vibes/                    # Design system/theme
│   ├── middleware.ts             # Middleware composition
│   ├── channels.config.ts        # Multi-channel locale mapping
│   └── next.config.ts            # Next.js config (async function)
├── packages/
│   ├── client/                   # @bigcommerce/catalyst-client
│   ├── cli/                      # CLI tools
│   ├── create-catalyst/          # Starter template generator
│   └── eslint-config-catalyst/   # Shared ESLint config
├── pnpm-workspace.yaml
└── turbo.json                    # Turbo build configuration
```

## Tech Stack

### Core
- **Next.js**: 15.4.0-canary.0 with App Router, PPR (incremental)
- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **pnpm**: 10.12.4 + Turborepo 2.5.4

### GraphQL & Data
- **gql.tada**: Type-safe GraphQL queries with full IDE support
- **@bigcommerce/catalyst-client**: Custom GraphQL client wrapper
- GraphQL introspection types auto-generated via `npm run generate`
- Client setup: `/core/client/index.ts` with `beforeRequest`, `onError` hooks

### Styling
- **TailwindCSS**: 3.4.17 + container queries, typography plugins
- **Radix UI**: Primitive components (accordion, dialog, dropdown, etc.)
- **Icons**: lucide-react (primary), react-icons, @icons-pack/react-simple-icons
- **Animations**: tailwindcss-animate, tailwindcss-radix, Embla Carousel
- **Fonts**: Inter (body), Nunito (headings), Kanit (special text, weights 100-900)

### Forms & Validation
- **Conform**: Form state management (`@conform-to/react`, `@conform-to/zod`)
- **Zod**: Schema validation

### Auth & i18n
- **NextAuth (Auth.js)**: 5.0.0-beta.25
- **next-intl**: 4.1.0 with locale-based routing

### Other
- **Caching**: @vercel/kv, @upstash/redis, lru-cache
- **Search**: Algolia (algoliasearch 5.40.0, react-instantsearch 7.16.3)
- **Analytics**: @vercel/analytics, @vercel/speed-insights
- **Notifications**: sonner (toast notifications)

## Architecture Patterns

### Middleware Composition
All middlewares are composed in `/core/middleware.ts`:
```typescript
export const middleware = composeMiddlewares(
  withAuth,
  withIntl,
  withAnalyticsCookies,
  withChannelId,
  withRoutes,
);
```
Each middleware is in `/core/middlewares/` and can be modified independently.

### Server Actions Pattern
Server actions are colocated with their routes in `_actions/` folders:
```
app/[locale]/(default)/(auth)/login/
  ├── page.tsx
  └── _actions/
      └── login.ts          # Server action for login
```
Always check for existing server actions before creating new ones.

### GraphQL Fragments
Reusable GraphQL fragments live in `/core/client/fragments/`:
- `pricing.ts` - Product pricing data
- `pagination.ts` - Pagination info
- More fragments for common data patterns

**Pattern**: Define fragments once, reuse across queries.
```typescript
import { PricingFragment } from '~/client/fragments/pricing';

const ProductQuery = graphql(`
  query Product($slug: String!) {
    product(slug: $slug) {
      ...PricingFragment
    }
  }
`, [PricingFragment]);
```

### Component Architecture
- **Default**: Server Components (data fetching on server)
- **Client**: Mark with `'use client'` directive only when needed
- **Fragments**: GraphQL fragments often colocated with components
- **Actions**: Server actions in `_actions/` folders for mutations

### Route Groups
Routes use Next.js route groups for organization:
- `(default)` - Main storefront routes
- `(auth)` - Authentication flows (login, register, change-password)

### Multi-Channel & i18n
- Channel ID determined by locale (see `channels.config.ts`)
- Override `localeToChannelsMappings` for locale-specific channels
- Middleware handles locale routing automatically

## Environment Variables

Required in `.env.local` (see `.env.example`):
```bash
BIGCOMMERCE_STORE_HASH=           # From store control panel URL
BIGCOMMERCE_STOREFRONT_TOKEN=     # JWT for Storefront API
BIGCOMMERCE_CHANNEL_ID=1          # Channel ID (1 = default, create new for production)
AUTH_SECRET=                      # Generate: openssl rand -hex 32
DEFAULT_REVALIDATE_TARGET=3600    # Cache revalidation (seconds)

# Optional
ENABLE_ADMIN_ROUTE=true           # Enable /admin redirect to control panel
TURBO_REMOTE_CACHE_SIGNATURE_KEY= # For signed Turborepo artifacts

# Algolia (optional)
ALGOLIA_APPLICATION_ID=
ALGOLIA_SEARCH_API_KEY=
ALGOLIA_INDEX_NAME=
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=
```

## Development Workflow

### 1. GraphQL Development
- Types are auto-generated on `npm run dev` and `npm run build`
- Use `graphql()` from `~/client/graphql` for type-safe queries
- IDE autocomplete works automatically with gql.tada
- Check existing fragments before writing new queries

### 2. Creating Components
**Before creating a new component:**
1. Check `/core/components/` for existing components
2. Check if Radix UI has a primitive component
3. Review similar components for patterns
4. Check if required data can use existing GraphQL fragments
5. Verify if server actions already exist for the use case

### 3. Styling
- Use Tailwind utility classes (configured in `tailwind.config.js`)
- Custom colors via CSS variables: `--primary`, `--accent`, `--success`, `--error`, `--warning`, `--info`, `--contrast-{100-500}`
- Font families: `font-heading` (Nunito), `font-body` (Inter), `font-kanit` (Kanit)
- Always use Next.js `<Image>` component for images
- Container queries enabled: use `@container` utilities

### 4. Testing
- E2E tests in `/core/tests/ui/e2e/`
- Visual regression tests in `/core/tests/visual-regression/`
- Tests use Playwright with custom environment configuration
- Worker count set to 1 (single-threaded for now)

## Key Files to Know

- `/core/client/index.ts` - GraphQL client with channel ID logic, auth error handling
- `/core/middleware.ts` - Middleware composition pipeline
- `/core/next.config.ts` - Async config that fetches store settings
- `/core/channels.config.ts` - Locale-to-channel mapping
- `/core/tailwind.config.js` - Tailwind customization
- `/core/app/[locale]/layout.tsx` - Root locale layout with fonts, providers

## Common Gotchas

1. **GraphQL Types**: Run `npm run generate` if you get GraphQL type errors
2. **Environment**: Commands use `.env.local` via dotenv-cli wrapper
3. **Route Matching**: Middleware excludes `/api`, `/admin`, `/_next`, static assets
4. **BigCommerce Auth**: Client automatically redirects to signout on auth errors
5. **Build Config**: `next.config.ts` is async and fetches store settings at build time
6. **Branches**: Always use `canary` branch, not `main`

## File Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities**: camelCase (`formatPrice.ts`)
- **Server Actions**: kebab-case (`update-cart.ts`)
- **Routes**: Lowercase with dashes (`forgot-password/`)

## Code Quality

- **TypeScript**: Strict mode enabled, avoid `any` types
- **ESLint**: `@bigcommerce/eslint-config` + `@bigcommerce/eslint-config-catalyst`
- **CI Behavior**: Builds ignore TS and ESLint errors when `CI=true`
- **Prettier**: Configured with `prettier-plugin-tailwindcss`

## DO NOT

- ❌ Create new documentation files unless explicitly requested
- ❌ Duplicate existing components
- ❌ Add new dependencies without checking `package.json`
- ❌ Build custom UI primitives if Radix UI has them
- ❌ Introduce new styling systems (always use TailwindCSS)
- ❌ Submit PRs to `main` branch (use `canary`)

## ALWAYS CHECK FIRST

- ✅ `/core/components/` for existing components
- ✅ `_actions/` folders for existing server actions
- ✅ `/core/client/fragments/` for GraphQL fragments
- ✅ Radix UI documentation for primitive components
- ✅ `/core/lib/` for utility functions
- ✅ Nearby files for import patterns and conventions
