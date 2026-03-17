# Quick Shop Modal — Ryddo Light Theme Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `quick-shop-drawer.tsx` from a dark Porsche-inspired aesthetic to Ryddo's default light theme (white background, pink accent, Nunito headings).

**Architecture:** Single-file change — swap hardcoded dark colors and Porsche-specific typography for Ryddo CSS variables and design tokens. Move `Dialog.Content` inside `Dialog.Overlay` to use the codebase's centered flex modal pattern. No new files, no new dependencies.

**Tech Stack:** React, Radix UI Dialog, TailwindCSS, Next.js (`Link`, `Image` components)

**Spec:** `docs/superpowers/specs/2026-03-17-quick-shop-modal-ryddo-theme-design.md`

---

### Task 1: Rewrite `quick-shop-drawer.tsx`

**Files:**
- Modify: `core/components/marketplace-showcase/quick-shop-drawer.tsx`

- [ ] **Step 1: Replace the file contents**

Open `core/components/marketplace-showcase/quick-shop-drawer.tsx` and replace with:

```tsx
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

interface MarketplaceProduct {
  entityId: number;
  name: string;
  path: string;
  defaultImage: {
    altText: string;
    url: string;
  } | null;
  brand?: {
    name: string;
  } | null;
}

interface QuickShopDrawerProps {
  product: MarketplaceProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickShopDrawer({ product, open, onOpenChange }: QuickShopDrawerProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 flex items-center justify-center bg-[hsl(var(--foreground)/50%)] @container">
          <Dialog.Content
            aria-describedby={undefined}
            className="mx-3 w-full max-w-[560px] overflow-hidden rounded-2xl bg-background transition ease-out focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-bottom-16 data-[state=open]:slide-in-from-bottom-16 data-[state=closed]:duration-200 data-[state=open]:duration-200"
          >
            {/* Pink accent bar */}
            <div className="h-1 w-full bg-primary" />

            {/* Split layout */}
            <div className="flex min-h-[280px]">
              {/* Left: Image 42% */}
              <div className="relative w-[42%] shrink-0 bg-contrast-100">
                {product.defaultImage ? (
                  <Image
                    alt={product.defaultImage.altText}
                    className="object-cover"
                    fill
                    sizes="240px"
                    src={product.defaultImage.url}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs text-contrast-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Right: Content */}
              <div className="flex flex-1 flex-col justify-between px-5 py-5">
                {/* Close button */}
                <div className="flex justify-end">
                  <Dialog.Close className="flex h-7 w-7 items-center justify-center rounded-full text-contrast-400 transition-colors hover:text-foreground">
                    <X className="h-4 w-4" strokeWidth={2} />
                    <span className="sr-only">Close</span>
                  </Dialog.Close>
                </div>

                {/* Brand & product name */}
                <div className="mt-4 flex flex-col gap-2">
                  {product.brand?.name ? (
                    <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-primary">
                      {product.brand.name}
                    </p>
                  ) : null}
                  <Dialog.Title className="font-heading text-xl font-bold leading-tight text-foreground">
                    {product.name}
                  </Dialog.Title>
                </div>

                {/* Divider */}
                <div className="my-4 h-px w-full bg-contrast-100" />

                {/* CTA */}
                <Link
                  className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 font-body text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                  href={product.path}
                  onClick={() => onOpenChange(false)}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

Key changes from the dark theme:
- `Dialog.Content` is now **inside** `Dialog.Overlay` (centered flex modal pattern)
- Overlay: `bg-[hsl(var(--foreground)/50%)]` replaces `bg-black/70 backdrop-blur-sm`
- Panel: `bg-background rounded-2xl` replaces `bg-[#0D0D0D]`; removed `fixed bottom-0` positioning and inline style hack
- Animation: full `animate-in/out slide-in/out-from-bottom-16` set
- Accent bar: `bg-primary h-1` replaces `bg-[#E00000] h-[3px]`
- Image panel: `bg-contrast-100` replaces `bg-[#1A1A1A]`
- Brand label: `text-primary` replaces `style={{ color: '#E00000' }}`
- Title: `font-heading font-bold text-foreground` replaces Kanit italic black white (`font-heading` is a configured Tailwind alias in `tailwind.config.js` that includes `fontFeatureSettings`/`fontVariationSettings`)
- Divider: `bg-contrast-100` replaces `bg-white/10`
- Close button: `text-contrast-400 hover:text-foreground` replaces `text-white/40 hover:text-white/80`
- CTA: `bg-primary rounded-full text-white` replaces `bg-[#E00000] rounded-md`

- [ ] **Step 2: Verify lint passes**

```bash
cd core && pnpm lint
```

Expected: no new errors related to `quick-shop-drawer.tsx`

- [ ] **Step 3: Start dev server and verify visually**

```bash
pnpm dev
```

Navigate to homepage → Marketplace Showcase section → click `+` on any card.

Verify:
- Modal appears **centered** on screen (not bottom-anchored)
- White background panel, semi-transparent dark overlay
- Pink accent bar at top (`h-1`)
- Light gray image panel on the left
- Dark text for product name (Nunito font)
- Pink brand label
- Light gray divider
- Pink pill-shaped "Shop Now" button
- Close button (X) visible in gray, darkens on hover
- Clicking overlay, pressing Escape, and clicking X all close the modal
- "Shop Now" navigates to product page

- [ ] **Step 4: Commit**

```bash
git add core/components/marketplace-showcase/quick-shop-drawer.tsx
git commit -m "fix: restyle quick shop modal to Ryddo light theme"
```
