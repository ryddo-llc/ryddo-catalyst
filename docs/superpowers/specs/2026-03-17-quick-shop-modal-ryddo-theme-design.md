# Quick Shop Modal — Ryddo Light Theme

**Date:** 2026-03-17
**File:** `core/components/marketplace-showcase/quick-shop-drawer.tsx`
**Scope:** Single-file aesthetic redesign — no structural or behavioral changes.

---

## Problem

The Quick Shop modal was styled with a Porsche-inspired dark aesthetic: black background (`#0D0D0D`), Guards Red accent (`#E00000`), Kanit italic black typography, and white text. This is inconsistent with the Ryddo brand, which uses a light/white default theme with hot pink as the primary accent.

---

## Goal

Redesign the Quick Shop modal to match Ryddo's default light theme while preserving the centered modal structure, split layout, and behavioral functionality.

---

## Design

### 1. Modal container & overlay

- **Overlay:** `bg-foreground/50` (codebase standard), `fixed inset-0 z-30 flex items-center justify-center @container`
- **Panel:** `bg-background` (white), `rounded-2xl`, `max-w-[560px]`, `mx-3`, `overflow-hidden`
- **Animation:** `slide-in-from-bottom-16 duration-200 ease-out` — matches `vibes/soul/primitives/modal`
- `Dialog.Content` nested inside `Dialog.Overlay` (centered flex pattern)
- Remove `style={{ left: '50%', transform: 'translateX(-50%)' }}` hack

### 2. Accent bar & image panel

- **Accent bar:** `h-1 bg-primary` — hot pink, matches side-panel convention
- **Image panel (left 42%):** `bg-contrast-100` (`#EEEEEE`, light gray) — replaces dark `#1A1A1A`
- **"No Image" fallback text:** `text-contrast-400`
- Image component unchanged (`fill`, `object-cover`, `sizes="240px"`)

### 3. Typography & close button

- **Close button:** `Button` primitive from `@/vibes/soul/primitives/button`, `shape="circle" size="x-small" variant="ghost"` — no color override needed on white background
- **Brand label:** `text-primary` (pink CSS variable) — replaces hardcoded `#E00000`; keep `text-[10px] uppercase tracking-widest font-semibold`
- **Product title:** `font-heading` (Nunito), `text-xl font-bold text-foreground` — drop Kanit italic black weight (Porsche-specific); use `Dialog.Title` as before
- **Divider:** `bg-contrast-100` — replaces `bg-white/10`

### 4. CTA button

- Replace custom-styled `<Link>` with `Button` primitive using `asChild`:
  ```tsx
  <Button asChild variant="primary" size="medium" className="w-full">
    <Link href={product.path} onClick={() => onOpenChange(false)}>
      Shop Now
    </Link>
  </Button>
  ```
- `variant="primary"` renders pink background with white text — matches Ryddo primary buttons

---

## What Does Not Change

- Split layout: 42% image / 58% content
- `Dialog.Root`, `Dialog.Portal`, `Dialog.Close`, `Dialog.Title` usage
- `onOpenChange` / `open` controlled state
- "Shop Now" navigation behavior
- Accessibility: `aria-describedby={undefined}`, `sr-only` close label

---

## Key References

- Modal centering pattern: `core/vibes/soul/primitives/modal/index.tsx:47–54`
- Button primitive: `core/vibes/soul/primitives/button/index.tsx`
- Side-panel accent bar: `core/vibes/soul/primitives/side-panel/index.tsx`
- CSS variables: `core/globals.css` (`--primary`, `--background`, `--foreground`, `--contrast-*`)

---

## Verification

1. `pnpm dev` → homepage → Marketplace Showcase
2. Click `+` on any card — modal appears **centered** with white background
3. Pink accent bar at top, light gray image panel, dark text content
4. Close button (X), overlay click, Escape key all close modal
5. "Shop Now" navigates to product page
6. `cd core && pnpm lint` — no new errors
