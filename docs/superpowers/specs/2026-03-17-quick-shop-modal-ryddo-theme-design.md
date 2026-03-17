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

- **Overlay:** `fixed inset-0 z-30 flex items-center justify-center bg-[hsl(var(--foreground)/50%)] @container`
  - `bg-foreground/50` Tailwind shorthand does NOT work here because `foreground` is registered as `hsl(var(...))` (full wrapper), not raw channels, so the opacity modifier cannot compose correctly; use the inline CSS-variable form instead
- **Panel:** `bg-background rounded-2xl mx-3 w-full max-w-[560px] overflow-hidden`
  - z-index is inherited from the overlay (`z-30`); do not add a separate z-index to `Dialog.Content`
- **Animation** (full set, applied to `Dialog.Content`):
  ```
  transition ease-out
  data-[state=open]:animate-in data-[state=closed]:animate-out
  data-[state=open]:slide-in-from-bottom-16 data-[state=closed]:slide-out-to-bottom-16
  data-[state=open]:duration-200 data-[state=closed]:duration-200
  focus:outline-none
  ```
- `Dialog.Content` nested **inside** `Dialog.Overlay` (centered flex pattern from `modal/index.tsx`)
- Remove `style={{ left: '50%', transform: 'translateX(-50%)' }}` hack
- Remove `fixed bottom-0 left-0 right-0 md:bottom-8 md:w-[560px]` from `Dialog.Content`

### 2. Accent bar & image panel

- **Accent bar:** `h-1 bg-primary` — hot pink (`--primary`), matches side-panel convention (`h-1` = 4px, intentionally changed from `h-[3px]`)
- **Image panel (left 42%):** `bg-contrast-100` (`#EEEEEE`, light gray) — replaces dark `#1A1A1A`
- **"No Image" fallback text:** `text-contrast-400`
- Image component unchanged (`fill`, `object-cover`, `sizes="240px"`)

### 3. Typography & close button

- **Close button:** Keep the existing `<Dialog.Close>` pattern directly (the `Button` primitive does not use `forwardRef`, so `Dialog.Close asChild` + `Button` is unreliable). Update styling for light theme:
  ```tsx
  <Dialog.Close className="flex h-7 w-7 items-center justify-center rounded-full text-contrast-400 transition-colors hover:text-foreground">
    <X className="h-4 w-4" strokeWidth={2} />
    <span className="sr-only">Close</span>
  </Dialog.Close>
  ```
  - `text-contrast-400` (medium gray) on white background replaces `text-white/40` on dark
- **Brand label:** `text-primary` (pink CSS variable) — replaces hardcoded `#E00000`; keep `text-[10px] uppercase tracking-widest font-semibold`
- **Product title:** `font-heading` (Nunito), `text-xl font-bold text-foreground` — drop Kanit italic black weight (Porsche-specific); use `Dialog.Title` as before
- **Divider:** `bg-contrast-100` — replaces `bg-white/10`

### 4. CTA button

- The `Button` primitive does not support `asChild` — apply primary button Tailwind classes directly to the `<Link>`:
  ```tsx
  <Link
    className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
    href={product.path}
    onClick={() => onOpenChange(false)}
  >
    Shop Now
  </Link>
  ```
- `bg-primary` = hot pink (`--primary`); `text-white` is explicit and safe — `--background` resolves to pure white (`0 0% 100%`)
- `rounded-full` matches Ryddo's pill-shaped primary button convention (replaces `rounded-md`)

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
