# 10 — Remaining home sections

## Goal
Finish the home page from PRD §8.1 by adding "Why Genoine", a New launches strip, a Browse by category row, a contact strip and the distributor banner below the existing Hero, Specialities and Featured products sections.

## Skills and docs read
- `AGENTS.md` (§3 UI and colours, §7, §8 `isNewLaunch`, §11 compliance), `PRD.md` §8.1
- Existing patterns only; no new framework APIs (Server Components + `sanityFetch`, `FadeIn`).

## Existing code inspected
- `src/app/(site)/page.tsx`: Hero → SpecialitiesSection → FeaturedProductsSection
- `components/home/featured/*` (section header pattern, `ProductCard`), `components/about/about-range.tsx` (product strip with mobile snap scroll, compact `ProductCard`)
- `components/shared/feature-card.tsx`, `distributor-cta.tsx`, `fade-in.tsx`
- `getSiteSettings()` (phone, email, address, hours), `src/lib/company.ts` fallbacks, `src/lib/whatsapp.ts`
- `src/sanity/lib/catalogue.ts` (`toCard`, `CATALOGUE_TAGS`), product schema (`isNewLaunch`, `category` reference)
- Live data right now: 4 products, **0 marked "New launch"**; categories: Tablets (3), Syrups (1), Capsules (0), Softgels (0)

## Decisions and assumptions
- **Order on the page:**
  1. Hero
  2. Specialities
  3. Featured products
  4. **Why Genoine** (pink tint band, to alternate with the white sections)
  5. **New launches** (white)
  6. **Browse by category** (white, compact; directly under New launches with a smaller gap)
  7. **Contact strip** (white)
  8. **Distributor banner** (the existing `DistributorCta`)
- **Why Genoine:**
  - 4 `FeatureCard`s with the PRD's trust points, in plain wording with no numbers. **Client to confirm** the wording.
  - The cards:
    - ShieldCheck "Quality-assured manufacturing": "Products made by certified manufacturing partners."
    - Pill "Wide range": "Medicines across key therapeutic areas and dosage forms."
    - Truck "Timely supply": "Dependable supply for distributors and chemists across the Northeast."
    - Handshake "Distributor support": "Direct contact with our team for product and order questions."
  - The copy lives in `src/content/home.ts` (code, like the Distributor page), so it can move to Studio later if wanted.
- **New launches:**
  - Products with `isNewLaunch == true`, newest first (`_createdAt desc`, then `order`), up to 8. Each card gets a yellow "New" badge (`Badge variant="accent"`; yellow is allowed for badges).
  - **The section is hidden while no product is ticked**, which is the case today. Tick "New launch" in Studio to show it.
- **Browse by category:**
  - Categories with at least one product, as pill links to `/products?category=<slug>`, each showing its product count (e.g. "Tablets 3").
  - Today that means only Tablets and Syrups. Zero-count categories are hidden, the same rule as the filters.
- **Contact strip:**
  - A single bordered white card. On desktop it's one row with 3–4 items: WhatsApp ("Chat on WhatsApp"), Phone (only when set), Email (always: the support email fallback) and Address (Karimganj fallback), plus a magenta "Contact us" button linking to `/contact`.
  - It reuses the same values as the footer and Contact page and shows no empty rows.
- **Distributor banner:** the existing `DistributorCta` as-is; its text is editable in Site settings.
- **No new Sanity fields** are needed (`isNewLaunch` and `category` already exist).

## Files
**New**
- `src/content/home.ts` (Why Genoine copy)
- `src/components/home/why-genoine-section.tsx`
- `src/components/home/new-launches-section.tsx`
- `src/components/home/category-chips.tsx`
- `src/components/home/contact-strip.tsx`

**Changed**
- `src/sanity/queries.ts` (`NEW_LAUNCHES_QUERY`, `CATEGORY_COUNTS_QUERY`)
- `src/sanity/lib/catalogue.ts` (`getNewLaunches()`, `getCategoriesWithCounts()`)
- `src/components/product/product-card.tsx` (optional `badge` prop for "New")
- `src/app/(site)/page.tsx`
- `AGENTS.md` (Phase 5 ✅)

## Layout
Container `max-w-7xl px-5 md:px-10`. Section spacing is `py-12 md:py-24` (like Specialities). The section header uses the existing eyebrow + h2 pattern (`text-[28px] md:text-[40px]`).

1. **Why Genoine** (`bg-brand-tint`)
   - Eyebrow "Why Genoine", h2 "A partner you can rely on", and one muted line.
   - The cards go 1 / 2 / 4 columns at 360 / 768 / 1280px, and fade up with a stagger.
2. **New launches**
   - Eyebrow "Just launched", h2 "New launches", and "View all →" on the right.
   - The cards are compact `ProductCard`s with the "New" badge.
   - Mobile: a snap row (cards ~70% wide, as on About). From md: a 3-column grid; from lg: 4 columns.
3. **Browse by category**
   - h3 "Browse by category" (`font-heading text-xl`), then wrapping pills.
   - Each pill is `rounded-full border px-4 py-2 text-sm`, with the count in `text-muted-foreground`. Hover: `bg-brand-tint` and `text-primary`.
4. **Contact strip**
   - A `rounded-3xl border` card, `p-6 md:p-8`, with h2 "Talk to our team" (`text-2xl`).
   - Items: icon (`size-5`, `text-primary`), label (`text-xs` muted) and value (`font-medium`, a link where it applies).
   - Layout:
     - **360px:** the items stack and the button is full width.
     - **768px:** a 2×2 grid.
     - **1280px+:** one row, with the button on the right.
5. **Distributor banner:** `DistributorCta`.

**States:** focus rings on every link and button; hidden sections take no space; no loading states (server-rendered and cached).

## Security
- Server Components only (plus the existing `FadeIn`). Queries project only the fields they need and exclude drafts. No secrets.
- Nothing is stored. All WhatsApp links come from `whatsapp.ts`.

## Compliance
- No prices, numbers or promotional health claims. The trust points are factual and flagged for client confirmation.

## Acceptance criteria
- The home page shows the new sections in the order above at 360px, 768px and 1280px+.
- New launches is hidden with 0 ticked products, and appears with the "New" badge once one is ticked and published.
- Category pills show only categories with products and filter `/products` correctly.
- The contact strip shows only real values (phone appears once set in Studio).

## Checks
`pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Manual test
1. Run `pnpm dev` and scroll `/` at 360px, 768px and 1280px.
2. In Studio, tick "New launch" on a product and publish. Reload: New launches appears, with a "New" badge on the card.
3. Click "Tablets" and check `/products?category=tablets` shows only tablets.
4. Click each contact strip link (WhatsApp in a new tab, email, phone if set), then "Contact us".
