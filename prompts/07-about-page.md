# 07 — About page

## Goal
Build `/about` from the user's brief (8 sections). All text is editable in a new Sanity singleton `aboutPage`, with the brief's copy as code fallbacks.

## Skills and docs read
- `AGENTS.md`, `PRD.md` §8.5 (About: intro, mission, quality approach, company details incl. CIN)
- Next docs: metadata (`buildMetadata` already wraps it), Cache Components rules (no `new Date()` in render)

## Existing code inspected
- `src/app/(site)/(pages)/layout.tsx` (sticky solid header), `products/page.tsx` (container `max-w-7xl px-5 md:px-10`, eyebrow + h1 sizes `text-[28px] md:text-[40px]`)
- `src/components/home/specialities/*` (`SpecialityTile`, `SpecialityArea`, `THERAPEUTIC_AREAS_QUERY` with `productCount`, local icon fallback)
- `src/sanity/schemas/site-settings.ts` + `sanity.config.ts` singleton handling + `structure.ts`
- `src/lib/seo.ts` (`buildMetadata`, `breadcrumbJsonLd`, `siteConfig.legalName/cin`), `JsonLd`
- `src/content/heroShowcase.ts` (bottle images), `src/components/layout/site-footer.tsx` (`REGISTRAR`)
- Tokens: `brand-tint` (#FBF3F7), `--tint-yellow` (#FFF6D6) already exist

## Decisions and assumptions
- **Things the brief references that don't exist yet:**
  - The `/products` header is not a blush banner, and there is no "Why Genoine" card or Distributor CTA on the home page yet.
  - So I'll build three reusable pieces: `PageHeader` (blush banner + breadcrumb), `FeatureCard` (icon + title + text) and `DistributorCta`.
  - Contact, Distributor and the home "Why Genoine" section can reuse them later.
  - The `/products` header itself is **not** changed in this task.
- **DistributorCta:**
  - A `bg-primary` rounded-[32px] block with a white heading, "Become a distributor", and one line: "Distributor, stockist and PCD franchise enquiries are welcome across the Northeast."
  - Two buttons: a yellow `variant="accent"` "Become a distributor" linking to `/distributor` (yellow on magenta is allowed for a CTA button), and a white outline "Chat on WhatsApp".
  - `/distributor` doesn't exist yet and will 404 until it is built next.
- **Hex colours in the brief map to tokens:** `#FBF3F7` → `bg-brand-tint`, `#FFF6D6` → `bg-[var(--tint-yellow)]`.
- **Counts come only from Sanity:**
  - areas = therapeutic areas with ≥1 product; products = all published products.
  - If a count is 0 (or Sanity is down), that fact item is hidden. Nothing is invented.
- **"Est. 2026"** comes from the year of the `incorporatedOn` date, whose fallback is `2026-05-04` (user-supplied). It is displayed as "4 May 2026", formatted with a fixed `en-IN` formatter. This is static data, not the clock.
- **Header bottles:** Wellness, Gastro care and Women's care, from `HERO_SHOWCASE` (the static design assets). They are shown from `md` up; on mobile the banner is text only, to keep it short.
- **Range tiles:**
  - Reuse `SpecialityTile` with a new `size="compact"` prop: `min-h-[140px]` and a 72px icon.
  - Shows only areas with ≥1 product, with horizontal snap-scroll on mobile and a 4-column grid on `lg`.
- **Dosage form chips:**
  - Built from the forms that exist on published products, each linking to `/products?form=<Form>`.
  - Labels are plural ("Tablets", "Capsules", "Syrups", "Softgels", …).
- **Leadership:** `leaders[] { photo (alt required), name, role, bio }`. The section is hidden when the list is empty.
- **Registered office:** comes from the `siteSettings.address` row; the row is hidden if empty. `REGISTRAR` moves to `src/lib/company.ts`, shared with the footer, together with `INCORPORATED_ON`.
- **Fade-up:** a small client `FadeIn` wrapper (`motion` `whileInView`, once, 16px rise, `MotionConfig reducedMotion="user"`). The header is not animated (it's above the fold).
- **Copy:** the brief's text is used as-is; it's user-supplied company facts. Values copy has no health claims.

## Sanity: `aboutPage` singleton (`_id: "aboutPage"`)
Groups: Header, Story, Mission & vision, Values, Leadership, Company.

Fields, all optional (the code falls back to the brief's text):
- **Header:** `eyebrow`, `heading`, `intro`
- **Story:** `storyHeading`, `storyParagraphs` (array of text, max 3)
- **Mission & vision:** `mission`, `vision`
- **Values:** `valuesHeading`, `values[] { icon (list: Quality, Integrity, Partnership, Reliability → ShieldCheck, HeartHandshake, Users, Truck), title, text }`
- **Leadership:** `leaders[] { photo (image, hotspot, alt required), name (required), role (required), bio (text, max 200) }`
- **Company:** `incorporatedOn` (date)

Plumbing:
- Registered in `schemas/index.ts`, shown in the Studio sidebar as "About page" under Site settings, and added to the singleton lists in `sanity.config.ts`.
- `/api/revalidate` already revalidates by `_type`, so the `aboutPage` tag works without changes.

## Files
**New**
- `src/sanity/schemas/about-page.ts`
- `src/sanity/lib/about.ts` (`getAboutPage()`, `getAboutStats()`)
- `src/content/about.ts` (fallback copy)
- `src/lib/company.ts`
- `src/app/(site)/(pages)/about/page.tsx`
- `src/components/layout/page-header.tsx`
- `src/components/shared/feature-card.tsx`
- `src/components/shared/distributor-cta.tsx`
- `src/components/shared/fade-in.tsx`
- `src/components/about/`:
  - `about-story.tsx`
  - `about-mission.tsx`
  - `about-values.tsx`
  - `about-range.tsx`
  - `about-leaders.tsx`
  - `company-details.tsx`

**Changed**
- `schemas/index.ts`, `structure.ts`, `sanity.config.ts`
- `queries.ts` (`ABOUT_PAGE_QUERY`, `ABOUT_STATS_QUERY`)
- `speciality-tile.tsx` (`size` prop)
- `site-footer.tsx` (imports `REGISTRAR`)

## Layout (container `mx-auto max-w-7xl px-5 md:px-10`; section spacing `py-12 md:py-24`, like Home)
1. **Header**
   - Container: `mt-6 md:mt-8 rounded-[32px] bg-brand-tint px-6 py-10 md:px-12 md:py-16`, in 2 columns on `md`.
   - Left column:
     - Breadcrumb (`nav aria-label="Breadcrumb"`, `ol`, current page `aria-current="page"`).
     - Eyebrow (`text-xs font-semibold tracking-widest text-primary uppercase`).
     - h1 `text-[32px] md:text-[48px]`.
     - Paragraph `text-muted-foreground max-w-xl`.
   - Right column: 3 bottles overlapping, at different heights, with a `drop-shadow` and a gentle `animate-icon-bob` stagger.
2. **Story:**
   - The heading and paragraphs sit 2 columns on `lg` (`lg:grid-cols-[1fr_1.4fr]`).
   - The fact strip below is a 3-column grid (1 column on mobile, divided by borders). Each fact has a value in `font-heading text-2xl font-semibold text-primary` and a label in `text-sm text-muted-foreground`.
3. **Mission and vision:**
   - 2 cards on `md` (stacked on mobile), each `rounded-3xl p-6 md:p-8`.
   - The card backgrounds are the tint and the yellow tint.
   - Each card shows its icon in a white circle (`size-12`, `text-primary`), the title in an h3, and the text.
4. **Values:**
   - The `FeatureCard`s go 1 / 2 / 4 columns at 360 / 768 / 1280px.
   - Card style: white, `border rounded-3xl p-6`, with an icon in a `bg-brand-tint` circle; hover lifts the shadow.
5. **Range:** heading, compact tiles, form chips (`rounded-full border px-4 py-2 text-sm hover:bg-brand-tint`), and a primary "View all products →" button.
6. **Leaders:**
   - Cards in a 1 / 2 / 3-column grid.
   - Each card has a square photo (`rounded-2xl`, Sanity image via `urlFor`), the name in an h3, the role in `text-primary text-sm`, and the bio in `text-muted-foreground`.
7. **Company details:**
   - A white card, `border rounded-3xl p-6 md:p-8`, with an h2 "Company information".
   - The `dl` is 1 column on mobile and 2 columns from `md` (`dt` muted `text-sm`, `dd` `font-medium`).
8. **CTA:** `DistributorCta`.

**States:**
- Focus rings use `focus-visible:ring-2 ring-ring` on all links and chips.
- Empty sections are hidden: no leaders, no forms, no areas.

**Headings:** one h1, an h2 per section, and h3 for cards.

## SEO
- Use `pageMetadata.about`, with the description updated to the brief's text.
- Add `<JsonLd data={breadcrumbJsonLd([{name:"Home",path:"/"},{name:"About",path:"/about"}])} />`.

## Security
- Server Components fetch; only `FadeIn` is a client component and it receives no secrets.
- Queries project only the needed fields, in the published perspective.
- No prices, no inflated numbers, no health claims.

## Acceptance criteria
- `/about` renders all 8 sections with fallback copy before anything is entered in Studio. Leadership stays hidden while the list is empty.
- "About page" appears in Studio as a singleton. Editing and publishing it updates the page via the webhook.
- Counts match Sanity, and a 0 count hides its fact.
- The layout works at 360px, 768px and 1280px+, with no horizontal page scroll (only the tile row scrolls).
- Motion is reduced when the OS setting asks for it.

## Checks
`pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Manual test
1. `pnpm dev` → open `/about` at 360px, 768px and 1280px, and scroll through it: sections fade up.
2. In Studio: About page → change the heading and add a leader with a photo → publish. Reload; the changes appear and the Leadership section shows.
3. Click a tile, a form chip and "View all products" to check the links and filters.
4. Turn on reduced motion in the OS and check that the fade animations stop.
