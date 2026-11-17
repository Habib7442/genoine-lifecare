# 02 — Home page hero

## Goal

Build the home page hero: a large inset rounded card with a background photo, an overlay header, a floating featured product with animated annotation callouts, frosted-glass trust/enquiry panels, and a featured-product switcher. Data comes from Sanity, with a static fallback.

Only the hero is built in this step. No other home sections.

## Skills and docs read

- `AGENTS.md` (sections 3 UI rules, 4 stack, 6 architecture, 7 decisions, 8 data model, 9 enquiry list, 11 compliance, 12 traps)
- `PRD.md` §6 brand, §8.1 home, §8.8 global layout, §9 enquiry list, §10 content model
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md` (`"use cache"` + `cacheLife` + `cacheTag`)
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` (`priority`/`preload`, `fill`, `sizes`; to re-check during implementation)
- `motion` package docs (`motion/react`: `AnimatePresence`, `useReducedMotion`), read during implementation

## Existing code inspected

- `src/app/(site)/layout.tsx`: placeholder header + footer + `<Toaster />`
- `src/app/(site)/page.tsx`: temporary theme preview page
- `src/app/globals.css`: `--brand-*` tokens, shadcn mapping, fonts
- `src/components/ui/*`: button (has `accent` variant), badge, card, sheet, separator, etc.
- `src/sanity/env.ts`: **throws on import when env vars are missing**
- `src/sanity/lib/client.ts`, `src/sanity/lib/image.ts`
- `src/sanity/schemas/index.ts`: **empty, no `product` schema exists yet**
- `src/store/`: **empty, no enquiry store exists yet**
- `public/`: **no hero images exist**; no `.env.local` yet (Sanity project not created)

## Decisions and assumptions (please review these)

1. **Schemas pulled forward from Phase 2 (minimal).** The hero needs a `product` schema, which needs `category` and `therapeuticArea` (required references). I will create those three schemas now, exactly as in AGENTS.md §8, plus the two new optional product fields:
   - `heroImage`: image, optional, with required `alt` text when set. Description: "Transparent PNG cut-out of the pack, used in the home page hero."
   - `heroTagline`: string, optional, max ~60 chars. Description: "Short line shown under the headline when this product is in the hero."
   `siteSettings`, the seed script and the webhook stay in Phase 2.
2. **The site works without Sanity configured.** Right now `env.ts` throws on import, so the home page would crash until `.env.local` exists. I will:
   - change `env.ts` to export the values plus an `isSanityConfigured` boolean, without throwing;
   - have `client.ts` and `image.ts` use those values;
   - keep the clear error in `sanity.config.ts`, so `/studio` still tells you exactly what's missing.
   The hero data function returns `[]` when Sanity isn't configured or the fetch fails, and the hero shows its fallback.
3. **The enquiry store is pulled forward from Phase 4 (store only).** I'll create `src/store/useEnquiryStore.ts` with Zustand `persist` (key `genoine-enquiry`) and actions `add`, `remove`, `update`, `clear`, `has`. Item shape:
   ```ts
   { id, slug, name, composition, packSize?, quantity: number, enquiryType: "box" | "bulk", note?: string }
   ```
   `quantity` and `enquiryType` are new compared with AGENTS.md §9, which only had a free "Qty/note". The WhatsApp line becomes `— Qty: 2 (strip/box)` or `— Bulk / distributor enquiry, Qty: 2`. I'll update AGENTS.md §9 to match. The floating button, sheet and message builder stay in Phase 4.
4. **The header is a shared component, not hero-only.** I'll build `src/components/layout/site-header.tsx` with a `variant="overlay"` (transparent, white text, used inside the hero) and a `variant="solid"` placeholder for other pages later. The mobile menu (`mobile-nav.tsx`, a `Sheet`) goes in `components/layout/` as well. All hero-specific parts go in `src/components/home/hero/` as requested.
5. **The home page uses the hero's header, not the layout header.** I'll remove the placeholder `<header>` from `(site)/layout.tsx`. Other pages (Phase 5) will get `<SiteHeader variant="solid" />` through their own layout. The footer stays in the site layout.
6. **Nav links point to pages that don't exist yet** (`/products`, `/about`, `/distributor`, `/contact`), so they will 404 until Phase 3/5. "Enquire now →" links to `/distributor` for now. Tell me if it should open the enquiry list instead (that needs Phase 4).
7. **Placeholder images.** None exist yet. I'll add clearly temporary placeholders you can replace by dropping files with the same names:
   - `public/hero/hero-bg.webp`: flat dark background (brand ink, slight noise), no stock photo
   - `public/hero/product-placeholder.png`: plain unbranded pack box cut-out, labelled "Sample product"
   - `public/hero/side-card.webp`: neutral placeholder for the doctor/pharmacist card

   **If you have real photos (or want me to generate them with an image tool), tell me now.**
8. **Fallback content is clearly fake** (AGENTS.md §8): product names "Sample Product A/B/C". The compositions are generic molecules from the PRD example ("Pantoprazole 40mg + Domperidone 30mg", "Glimepiride 2mg + Metformin 500mg") and the therapeutic-use labels are neutral ("Gastro care", "Diabetes care"). I avoid "relief" wording (no health claims).
9. **The trust claim "WHO-GMP certified manufacturing"** lives in one constant in `src/components/home/hero/hero-content.ts`, marked `// TODO: confirm with client`. It moves to `siteSettings` in Phase 2. It is not hard-coded in JSX.
10. **Callout content mapping:** left = `composition`; under it = `dosageForm · packSize`; right = therapeutic area title (Sanity has no "therapeutic use" field). The headline sub-line uses `heroTagline`, falling back to the product `name`.
11. **Product image:** `heroImage` if set, otherwise the first `images[]` item (shown with a white rounded backdrop, because it won't be transparent), otherwise the placeholder.
12. **New dependencies:** `motion` (for `motion/react`), and shadcn `radio-group`. I'll add `motion` to the AGENTS.md §4 stack table.
13. **Auto-rotate accessibility:** auto-rotate every 6s pauses on hover **and while keyboard focus is inside the hero**, and is **off entirely under `prefers-reduced-motion`**. Hover-only pausing fails WCAG 2.2.2 for keyboard users. It only runs when there are 2+ products.
14. **Text contrast on the photo:** a `bg-brand-ink/40` overlay sits over the background image so white text stays readable on any photo.

## Files to create or change

**Create**
- `src/sanity/schemas/product.ts`, `category.ts`, `therapeutic-area.ts`
- `src/sanity/lib/fetch.ts`: small `sanityFetch` helper (`"use cache"`, `cacheLife("max")`, `cacheTag(...)`; returns fallback on error or when unconfigured)
- `src/store/useEnquiryStore.ts`
- `src/lib/hydration.ts`: `useHydrated()` hook (avoids persisted-store hydration mismatches)
- `src/components/layout/site-header.tsx`, `mobile-nav.tsx`, `nav-links.ts`
- `src/components/home/hero/hero.tsx` (server: fetch + map data)
- `src/components/home/hero/hero-showcase.tsx` (client: state, rotation, AnimatePresence)
- `src/components/home/hero/hero-product.tsx` (floating product image)
- `src/components/home/hero/hero-callouts.tsx` (SVG lines + ring dots + labels)
- `src/components/home/hero/hero-trust-panel.tsx`
- `src/components/home/hero/hero-enquiry-panel.tsx`
- `src/components/home/hero/hero-switcher.tsx`
- `src/components/home/hero/hero-side-card.tsx`
- `src/components/home/hero/hero-content.ts` (headline, trust text, fallback products)
- `src/components/home/hero/types.ts` (`HeroProduct` type)
- `src/components/ui/radio-group.tsx` (shadcn)
- `public/hero/*` placeholders

**Change**
- `src/sanity/env.ts`, `src/sanity/lib/client.ts`, `src/sanity/lib/image.ts` (no throw; `isSanityConfigured`)
- `sanity.config.ts` (explicit missing-env error for Studio)
- `src/sanity/schemas/index.ts` (register schemas)
- `src/sanity/queries.ts` (`HERO_PRODUCTS_QUERY`)
- `src/app/(site)/layout.tsx` (remove placeholder header)
- `src/app/(site)/page.tsx` (replace theme preview with `<Hero />`)
- `AGENTS.md` (§4 add `motion`; §9 item shape and message format)
- `package.json` / `pnpm-lock.yaml` (`motion`, radio-group deps)

## Implementation requirements

### Data

```groq
*[_type == "product" && isFeatured == true && defined(slug.current)]
| order(coalesce(order, 999) asc, _createdAt desc)[0...4]{
  _id, name, "slug": slug.current, composition, dosageForm, packSize,
  heroTagline,
  "therapeuticArea": therapeuticArea->title,
  "heroImage": heroImage{ asset, alt, hotspot, crop },
  "image": images[0]{ asset, alt, hotspot, crop }
}
```

- `hero.tsx` is an async Server Component. It calls `getHeroProducts()` (cached, tag `product`), maps the results to `HeroProduct[]` (resolving image URLs with `urlFor(...).width(900).auto("format")`), and passes plain serialisable props to `<HeroShowcase products={...} />`.
- An empty result uses the fallback products from `hero-content.ts`.

### Layout (≥ md, 768px+)

- Outer: `p-3 md:p-4`. Card: `relative overflow-hidden rounded-[32px] h-[calc(100svh-2rem)] min-h-[640px]`, `bg-brand-ink` (behind the image).
- Background: `next/image` `fill`, `priority`, `sizes="100vw"`, `object-cover`, then a `bg-brand-ink/40` overlay.
- Header row (absolute top, `px-6 md:px-10 pt-6`):
  - left: "Genoine Lifecare" (`font-heading font-semibold text-white`)
  - centre: nav (`text-sm text-white/80 hover:text-white`, current page `text-white`)
  - right: white pill `rounded-full bg-white text-brand-ink px-5 h-10` "Enquire now" + `ArrowRight`
- Headline top-left below the header: `font-heading uppercase text-white font-light md:font-normal leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]`, two lines ("QUALITY YOU" / "CAN TRUST"). Below it, a small sub-line (`text-white/80 text-base`) showing the active product's tagline or name.
- Product: absolutely centred, `w-[min(38vw,460px)]`, `aspect-square`, `object-contain`, with a soft drop shadow (`drop-shadow-2xl`). Float: `y: [0, -12, 0]`, 6s, ease-in-out, infinite.
- Callouts (≥ lg; md shows the left one only): SVG overlay in the same box as the product (`viewBox` in %), with 1px white lines (`stroke-white/70`) from points on the product edge to label anchors, each ending in a ring dot (`r=4`, white stroke, transparent fill). Labels: `text-sm text-white`, with the dosage form · pack size line underneath in `text-xs text-white/70`.
- Bottom-left stack (`absolute bottom-6 left-6 md:left-10`, `w-[340px]`, `gap-3`):
  - trust panel: 3 round icon badges (`ShieldCheck`, `FlaskConical`, `BadgeCheck`, white on `bg-white/20`) + trust text
  - enquiry panel: two radio rows (`RadioGroup`, styled as glass rows with a white ring indicator), quantity stepper (`–` / value / `+`, min 1, max 999, `aria-label`s, value announced via `aria-live="polite"`), and the add button
- Glass style (shared class constant): `bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl text-white`.
- Add button: default `bg-brand-accent text-brand-accent-foreground` ("Add to enquiry list", `Plus` icon). Added state: `bg-primary text-primary-foreground` "Added ✓", with background and colour transitioned over 300ms and the label crossfaded. Clicking when the product is already added does nothing destructive (it stays added). Removing happens in the Phase 4 sheet. A sonner toast says "Added to enquiry list".
- Right side mid-height (`absolute right-6 md:right-10 top-1/2 -translate-y-1/2`, ≥ lg): side card `w-[200px] aspect-[4/5] rounded-2xl overflow-hidden` image + underlined link "View all products →" (`/products`, white, `underline-offset-4`).
- Bottom-right switcher (`absolute bottom-6 right-6 md:right-10`): row of up to 4 glass thumbnail buttons, `size-16 md:size-20`, image `object-contain p-2`. The active one gets `ring-2 ring-brand-accent`. `aria-label="Show <name>"`, `aria-pressed`, `focus-visible:ring-2 focus-visible:ring-white`.

### Mobile (< md)

- The card becomes `h-auto min-h-[calc(100svh-1.5rem)]` with flex-column flow instead of absolute positioning.
- Header: logo + menu button (`Menu` icon, `aria-label="Open menu"`) opening a `Sheet` with the nav links and "Enquire now".
- Headline on top (clamp starts at 40px), product centred below it (`w-[70vw] max-w-[320px]`), composition shown as plain text under the product. No SVG callouts.
- The trust panel, enquiry panel and switcher stack at the bottom, full width. Thumbnails scroll horizontally (`overflow-x-auto snap-x`).
- The side card is hidden.

### Interaction

- `activeIndex` state. Switching uses `AnimatePresence mode="wait"` keyed by product id: product, sub-line, callouts and enquiry panel crossfade with `opacity 0→1` + `scale 0.96→1` (~0.4s).
- The enquiry panel's type and quantity reset when the product changes. If the product is already in the store, it shows "Added ✓", with the stored quantity and type.
- Auto-rotate: `setInterval` 6s, paused while `isHovered || hasFocusWithin || prefersReducedMotion || products.length < 2`.

### Motion (on load, `motion/react`)

1. Card: `scale 0.96→1`, `opacity 0→1`, 0.6s
2. Headline: each line in an `overflow-hidden` mask, `y: 100%→0`, staggered 0.12s
3. Product: `y: -30→0`, `opacity 0→1`, starting ~0.4s
4. Callout lines: `pathLength 0→1` (stroke-dashoffset), ~0.8s after the product appears; dots and labels fade in after
5. Glass panels + switcher: fade up `y: 16→0`, staggered 0.08s
- `useReducedMotion()`: no float, no line draw (lines shown fully), no auto-rotate, and entrance animations become simple fades (or none).

## Security requirements

- No tokens are used. The hero reads published content through the public CDN client on the server only.
- No Sanity client is imported into Client Components; they receive plain props.
- No prices, MRP or health claims in fallback content or labels.

## Acceptance criteria

- [ ] `/` renders the hero with the overlay header; there is no duplicate header from the layout.
- [ ] Without `.env.local`, `/` renders the fallback hero with no errors; `/studio` shows a clear "missing NEXT_PUBLIC_SANITY_PROJECT_ID" message.
- [ ] With Sanity configured and ≥1 featured product, the hero shows real products (image, composition, dosage form · pack size, therapeutic area).
- [ ] `heroImage` and `heroTagline` appear as optional fields on the product in Studio, with client-friendly descriptions.
- [ ] Thumbnails switch the product, sub-line, callouts and enquiry panel with a crossfade; the active thumbnail has a yellow ring and `aria-pressed="true"`.
- [ ] Auto-rotates every 6s; pauses on hover and while focus is inside; off with reduced motion.
- [ ] "Add to enquiry list" adds to the persisted store (survives reload) and becomes "Added ✓" in magenta; already-added products show "Added ✓" on load with no hydration warning.
- [ ] Quantity stepper clamps 1–999 and is keyboard operable.
- [ ] Entrance sequence plays in order; with OS "reduce motion" on, there is no float, no line drawing and no auto-rotate.
- [ ] Layout is correct at 360px, 768px and 1280px+; no horizontal page scroll at 360px.
- [ ] Only theme tokens, plus `white`/transparent for glass, are used. No hex values in components.
- [ ] Yellow never carries white text.

## Checks to run

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build` (routes, schemas, caching and env handling change)

## Manual test steps

1. `pnpm dev`, open http://localhost:3000. With no `.env.local`, confirm the fallback hero renders and the browser console has no errors.
2. Resize to 360px, 768px and 1280px (DevTools device toolbar) and compare with the layout spec above.
3. Click each thumbnail. Watch the crossfade. Check that the active ring is yellow. Use Tab to reach the thumbnails and check the focus ring.
4. Wait 6s and check that it rotates. Hover over the hero (it pauses). Tab into the hero (it pauses).
5. Pick "Bulk / distributor enquiry", set the quantity to 3, and click "Add to enquiry list". Check the toast and "Added ✓". Reload: it still shows "Added ✓". In DevTools → Application → Local Storage, check that `genoine-enquiry` holds the item.
6. Turn on Windows Settings → Accessibility → Visual effects → Animation effects **off**, reload, and confirm there is no float, no line draw and no auto-rotate.
7. Open `/studio` without `.env.local` and confirm the clear missing-env message. After creating `.env.local` (see setup notes), create a category, a therapeutic area and a featured product with a `heroImage`. Publish, restart dev (until the Phase 2 webhook exists), and check that the hero shows it.
