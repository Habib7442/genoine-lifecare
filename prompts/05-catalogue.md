# 05 — Catalogue (Phase 3)

## Goal

Ship the product catalogue: a shared product card, `/products` with URL-driven filters and search, and `/products/[slug]` detail pages with enquiry actions and full SEO.

## Read / inspected

- `AGENTS.md` (§3 UI, §7 decisions, §8 data model, §9 enquiry, §11 compliance); `PRD.md` §8.2–8.4
- Next docs:
  - `page.md`: `params` / `searchParams` are Promises.
  - `generate-static-params.md`: with Cache Components it **must return ≥ 1 param** (an empty array fails the build).
  - `migrating-to-cache-components.md`: request-time data (`searchParams`) goes inside `<Suspense>`.
- Existing:
  - `sanityFetch` (tag cache), `urlFor`, `getSiteSettings`, `whatsappUrl`.
  - `src/lib/seo.ts`: `pageMetadata.products`, `productMetadata`, `therapeuticAreaMetadata`, `productJsonLd`, `breadcrumbJsonLd`.
  - `useEnquiryStore` + `useHydrated`, `SiteHeader` (`solid` variant), shadcn `sheet`, `badge`, `button`, `input`, `skeleton`.
- Seeded data: 4 sample products, 8 areas, 4 categories.

## Decisions

1. **Header on inner pages.** A nested layout `src/app/(site)/(pages)/layout.tsx` renders `<SiteHeader variant="solid" />` (sticky, white). Catalogue routes live inside it; the home page keeps its hero header. (About/Contact/Distributor join this group in Phase 5.)
2. **Filters are single-select per facet**, kept in the URL: `?area=<slug>&category=<slug>&form=<Tablet…>&q=<text>`. One value per facet keeps URLs short and shareable and matches the tiles (`/products?area=gastro`). Multi-select can come later if the client needs it.
3. **Filtering and search happen in GROQ on the server**:
   - `name match $q || composition match $q` (prefix match: "panto" finds Pantoprazole).
   - Results are sorted by `order`, then `name`.
   - Each filter combination is cached via `sanityFetch` (tags `product`, `category`, `therapeuticArea`).
4. **`/products` layout**:
   - **Desktop:** left sidebar with facet lists (area, category, dosage form, each with counts), a search box above the grid, a result count and a "Clear filters" link.
   - **Mobile:** search box + "Filters" button that opens a `Sheet` with the same facets; active filters show as removable chips.
   - The grid is 2 columns on mobile, 3 on tablet, 4 on desktop.
   - An empty state shows a message plus "Clear filters".
5. **Product card** (`src/components/product/product-card.tsx`, shared):
   - Image on white (`images[0]`, else `heroImage`), name, composition (muted, 2 lines), dosage-form badge.
   - Round "Add to enquiry" icon button (plus → check when added, toast on add). The whole card links to the detail page; the add button doesn't navigate.
6. **"Add to enquiry" works now** (it adds to the existing persisted store with a toast). The floating button and sheet that *show* the list are Phase 4.
7. **Product detail `/products/[slug]`**:
   - Breadcrumb (Home › Products › name).
   - Image gallery: main image + thumbnails; a client component, keyboard accessible.
   - Name, composition, strength, dosage form, pack size, then category and area badges (each links to the filtered list).
   - Short description, indications list, usage note.
   - Actions:
     - **"Add to enquiry list"**: magenta → "Added ✓".
     - **"Enquire on WhatsApp"**: a single-product message in the AGENTS §9 style, using the number from `siteSettings` (env fallback). Without a number it falls back to `/contact`.
   - The medical disclaimer from `siteSettings` (added to the settings query), with a fallback line if empty.
   - **Related products**: up to 4 from the same therapeutic area, excluding the current one.
   - SEO: `generateMetadata → productMetadata`, `productJsonLd` + `breadcrumbJsonLd`.
   - **Not found:** `notFound()` → a small branded `not-found.tsx` inside `(pages)`.
8. **Static params:** `generateStaticParams` returns all slugs from Sanity. If none exist (e.g. Sanity not configured), it returns one placeholder slug that resolves to `notFound()`, because an empty array breaks the build under Cache Components.
9. **`/products` metadata:** `generateMetadata` uses `therapeuticAreaMetadata(area)` when `?area=` matches an area, else `pageMetadata.products`. The canonical is always `/products`.
10. **Compliance:** no prices anywhere; indications are shown exactly as entered (plain facts); the disclaimer is on every product page.

## Files

- **Create:**
  - `src/app/(site)/(pages)/layout.tsx`, `src/app/(site)/(pages)/not-found.tsx`
  - `src/app/(site)/(pages)/products/page.tsx`
  - `src/app/(site)/(pages)/products/[slug]/page.tsx`
  - `src/components/product/`:
    - `product-card.tsx`, `add-to-enquiry-button.tsx`, `product-grid.tsx`
    - `product-filters.tsx` (desktop), `filters-sheet.tsx` (mobile), `search-box.tsx`, `active-filters.tsx`
    - `product-gallery.tsx`, `enquire-whatsapp-button.tsx`, `types.ts`
  - `src/lib/product-filters.ts` (parse/serialise URL params; pure, testable)
  - `src/lib/enquiry-message.ts` (single-product WhatsApp message builder; pure, reused in Phase 4)
- **Change:** `src/sanity/queries.ts` (list, facets, detail, related, slugs; settings `disclaimer`), `src/sanity/lib/site-settings.ts`, `AGENTS.md` (§7 filters single-select; §15 Phase 3 ✅).

## UI spec

- **Container:** `max-w-7xl px-5 md:px-10` (same as the speciality section).
- **Card:**
  - `rounded-2xl` with a border (`border`) on white; image area `aspect-square bg-white p-4 object-contain`.
  - Name `font-heading text-base`, composition `text-sm text-muted-foreground line-clamp-2`, badge `variant="secondary"`.
  - Hover: border `primary/30` + soft shadow. The add button is `size-9 rounded-full`: `bg-primary` when added, otherwise `bg-white` with a border.
- **Filters:** facet headings `text-xs uppercase tracking-widest text-muted-foreground`. Options are links/buttons with counts; the active one is `bg-secondary text-primary font-medium`.
- **Detail:** 2 columns from `lg` (gallery left, info right); stacked on mobile with the gallery first. Primary button magenta, WhatsApp button outlined.
- **States:** visible focus rings; `Skeleton` grid as the Suspense fallback; empty state; not-found page.
- **Breakpoints checked:** 360, 768, 1280+.

## Security

- Read-only public client; no tokens in client code.
- Search text is passed as a GROQ **parameter** (never string-built into the query).
- WhatsApp links are built on the server with `encodeURIComponent`.

## Acceptance criteria

- [ ] `/products` lists the 4 sample products; each filter narrows the results and updates the URL; a copied URL restores the same view; "Clear filters" resets.
- [ ] `/products?area=gastro` (from a speciality tile) shows only gastro products; the metadata title is "Gastro medicines | Genoine Lifecare" with canonical `/products`.
- [ ] Searching "panto" finds Sample Product A; a nonsense search shows the empty state.
- [ ] Mobile: filters open in a sheet; chips remove single filters.
- [ ] Card and detail "Add to enquiry" persist across reload with no hydration warning.
- [ ] `/products/sample-product-a` shows all fields, gallery, badges, disclaimer and related products; WhatsApp opens with the prefilled single-product message (or goes to `/contact` without a number).
- [ ] Page source of a product page has the canonical, OG/Twitter tags and Product + Breadcrumb JSON-LD with no price/rating fields.
- [ ] `/products/does-not-exist` → branded 404.
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm build` pass (including with an empty dataset, thanks to the placeholder param).

## Manual test

1. `pnpm dev` → open `/products`. Try each facet, the search box, and Clear filters. Copy the URL into a new tab and check the same view loads.
2. From the home page, click the Gastro tile; you should land on the filtered list.
3. Open a product; add it to the enquiry list; reload. Try "Enquire on WhatsApp" with and without a number in Site settings.
4. Check DevTools at 360 / 768 / 1280.
5. View the page source of a product page and check the meta tags and JSON-LD.
