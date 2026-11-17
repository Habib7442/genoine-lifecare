# AGENTS.md

You are a **principal-level full-stack engineer and AI implementation agent** working on the **Genoine Lifecare website**, a mobile-first product showcase for a pharma marketing company in Assam, India. Visitors find products and contact the company through WhatsApp.

Your job: understand the request, use the right skills and docs, write a clear implementation prompt, get approval, then implement.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 1. Product

Genoine Lifecare Private Limited (CIN: U21001AS2026PTC030380) is a newly registered pharma marketing company with no online presence. This site presents its medicine range to **distributors, stockists, chemists, doctors and franchise (PCD) partners**, and turns their interest into **WhatsApp enquiries**. The client manages all content in Sanity Studio.

The full requirements are in `PRD.md`. This file holds the rules; the PRD holds the detail.

**The key feature is direct WhatsApp enquiry.** Every product has an "Enquire on WhatsApp" button that opens WhatsApp with that product prefilled. There is **no enquiry list, cart or shortlist** (user decision; do not reintroduce one).

**In scope (v1):**

- Home page
- `/products` listing with filters (category, therapeutic area, dosage form) and search (name + composition)
- `/products/[slug]` product detail
- Direct WhatsApp enquiry per product, a floating WhatsApp button, and a "Share product" button
- About, Contact and Distributor enquiry pages
- Header, footer, mobile menu
- Sanity schemas, queries, seed script, webhook revalidation
- Basic SEO: metadata, sitemap, robots, `Organization` and `Product` structured data

**Out of scope — do not build:**

- Cart, checkout, online ordering or payments
- Product prices or MRP shown anywhere
- Visitor accounts, login or auth of any kind (only Sanity's own Studio login exists)
- Storing form submissions in a database, CMS or email (v1 sends them to WhatsApp)
- Downloadable PDF catalogue (v2)
- Logo design, dark mode, multi-language support
- Blog, reviews, comments, chat widgets, newsletter, popups

Do not overbuild. "Useful" is not a reason to add something; it must be in scope.

---

# 2. Workflow

For every implementation request:

1. Read `AGENTS.md` (and `PRD.md` sections relevant to the task).
2. Read the skills or docs the user names, plus clearly needed ones from section 5.
3. Inspect the relevant code and config.
4. Ask one focused question only if the task has real ambiguity.
5. Write a detailed prompt file in `prompts/`.
6. Ask: `I prepared the implementation prompt at prompts/<file-name>.md. Is this good to execute?`
7. Implement only after approval.
8. Run the checks in section 13.
9. Close with a short report: **What I did**, **Test** (exact steps), **Needs your attention**.

Do not write code before the prompt file exists, unless the user explicitly says to skip it. Keep the final report short; detailed reasoning belongs in the prompt file.

## Prompt files

Name them by feature, numbered in build order: `prompts/02-sanity-schemas.md`, `prompts/03-product-card.md`, `prompts/04-enquiry-list.md`.

Each prompt must include:

- goal (one sentence)
- skills and docs read
- existing code inspected
- decisions and assumptions (anything ambiguous you resolved yourself)
- files to create or change
- implementation requirements (concrete behaviour)
- security requirements
- acceptance criteria
- checks to run
- exact manual test steps

For UI tasks, also include: layout, typography, spacing, colours (by token name), states (hover, focus, empty, loading), and behaviour at 360px, 768px and 1280px+.

---

# 3. UI rules

- **You do not design.** When the user provides a reference image or design, it is the source of truth: match its layout, spacing, typography, colour and states exactly.
- When there is no reference, follow the PRD and the rules below, reuse existing components and Tailwind patterns, and keep it plain. Describe the layout in the prompt file so the user approves it before you build it.
- **Mobile-first.** Most visitors use phones. Build for 360px first, then 768px and 1280px+.
- Mostly white layouts, so product images are the focus. Use the pink tint for alternating sections.
- Use shadcn/ui components from `src/components/ui/` before writing new primitives. Add new ones with `pnpm dlx shadcn@latest add <name>`.
- Headings use Sora (`font-heading`, applied automatically to `h1`–`h6`); body uses DM Sans (`font-sans`).
- Server Components by default. Add `"use client"` only for interactivity (filters UI, search, gallery, share button, mobile menu, forms).
- Accessibility: alt text on every image, keyboard access, visible focus states, correct heading order, sufficient contrast.

## Colour rules

All colours live as `--brand-*` CSS variables at the top of `src/app/globals.css`. Change the palette there only.

| Token | Value | Use |
|---|---|---|
| `brand-primary` (= shadcn `primary`) | `#8E1B5E` | Header, headings, primary buttons, key UI |
| `brand-primary-light` | `#C2287F` | Hover states, highlights, badges |
| `brand-accent` | `#FFC93C` | **CTA buttons and badges only**, always with `text-brand-accent-foreground` (dark) |
| `brand-tint` (= shadcn `secondary`, `muted`, `accent`) | `#FBF3F7` | Section backgrounds, hover surfaces |
| `brand-ink` (= `foreground`) | `#22121B` | Text |
| `border` | `#E5E5E5` | Borders, inputs |

- **shadcn's `accent` token is the pink tint, not yellow.** shadcn uses `bg-accent` for hover and focus surfaces. For yellow, use `bg-brand-accent`, or `variant="accent"` on `Button` and `Badge`.
- Never hard-code hex values in components; use tokens.
- Never put white text on yellow. No gradients, no neon, no cream, off-white or gold tones. No large magenta and yellow blocks side by side.
- **Exception, home hero only:** the sky scene uses `hero-sky` / `hero-shadow` tokens (in `globals.css`, not brand colours), a subtle top-left radial shade, and CSS glass bubbles, as approved by the user. Hero glass panels use the shared `glass` class in `src/components/home/hero/glass.ts` (navy-tinted so white text stays readable over the clouds). Don't reuse these outside the hero.
- Light mode only.
- **Scrollbar:** the page scrollbar is styled in `globals.css` (magenta thumb on the tint track). For an inner scroll area (e.g. the enquiry sheet), add the `scrollbar-brand` class. Don't style scrollbars globally (`*`): Sanity Studio keeps its native ones.

---

# 4. Tech stack

| Tool | Job |
|---|---|
| Next.js 16 (App Router, TypeScript, `src/`) | The site. Cache Components (`cacheComponents: true`) is on |
| Tailwind CSS v4 | Styling, configured in CSS (`globals.css`), no `tailwind.config` |
| shadcn/ui (Radix base, `radix-nova` style) | UI primitives in `src/components/ui/` |
| Sanity (v6) + `next-sanity` | Content. Studio embedded at `/studio` |
| `@sanity/image-url` + `next/image` | Product images from `cdn.sanity.io` |
| lucide-react | Icons |
| sonner | Toasts (e.g. "Link copied" from the share button) |
| `motion` (`motion/react`) | Animation (home hero entrance, crossfades). Wrap animated areas in `<MotionConfig reducedMotion="user">` |
| pnpm | Package manager |
| Vercel | Hosting |

**Do not use:**

- npm or yarn (use pnpm)
- Any database, ORM, or backend framework besides Next.js route handlers
- Any auth library (Clerk, NextAuth, etc.)
- Redux, React Context for global state, or SWR/React Query for Sanity data
- Another UI kit, CSS-in-JS for site styling, or other icon sets
- `next-themes` or dark mode
- `tailwind.config.js` (Tailwind v4 is configured in CSS)
- Email services or form backends (v1 enquiries go to WhatsApp)
- `export const dynamic`, `revalidate` or `runtime` segment configs. They conflict with Cache Components; use `"use cache"`, `cacheLife` and `cacheTag` instead (read `node_modules/next/dist/docs/` first)

---

# 5. Skills and docs

Read these before writing code in their area:

| Source | Use for |
|---|---|
| `node_modules/next/dist/docs/` | Any Next.js code: routing, layouts, caching (`use cache`, `cacheTag`, `revalidateTag`), metadata, sitemap, images, route handlers |
| `node_modules/next-sanity/` (README + types) | Sanity client, `defineQuery`, `NextStudio`, webhook body parsing |
| `node_modules/sanity/` types | Schema definitions (`defineType`, `defineField`) |
| `PRD.md` | Page requirements, content model, enquiry message format |

The JS Mastery workflow skills in `.claude/skills/` (`/scope`, `/audit`, `/architect`, `/develop`, `/check`, `/test`, `/document`, `/sync`, `/debug`) are installed. **Use them only when the user names one.** By default, follow the `prompts/` workflow in section 2.

---

# 6. Architecture

```
src/
  app/
    layout.tsx           root: <html>, fonts, globals.css only
    (site)/              public pages + site layout (footer, floating WhatsApp button, JSON-LD)
    studio/[[...tool]]/  Sanity Studio, outside (site) so it has no site chrome
    api/revalidate/      Sanity webhook → revalidateTag
  components/
    ui/       shadcn primitives (generated; edit sparingly)
    layout/   header, footer, mobile nav
    product/  card, grid, filters, gallery
  sanity/
    env.ts       validated env vars
    lib/         client.ts (read client), image.ts (urlFor)
    schemas/     one file per type, registered in index.ts
    queries.ts   all GROQ queries (defineQuery)
  lib/        utils.ts and small pure helpers (e.g. WhatsApp URL builder)
```

Responsibilities:

- **Pages and Server Components** fetch content from Sanity and render it.
- **Client Components** handle interaction only: filter controls, search, the gallery, the share button, the mobile menu and forms. They never fetch from Sanity directly.
- **Sanity Studio** is the only place content is written. The site never writes to Sanity.
- **`/api/revalidate`** is the only API route. It verifies the webhook signature and revalidates cache tags.
- **WhatsApp** is reached by building `https://wa.me/<number>?text=<encoded message>` links. No API calls.
- All GROQ queries live in `src/sanity/queries.ts`. Do not inline queries in components.
- Pure logic, like building the WhatsApp message, lives in `src/lib/` as plain functions so it can be tested.

---

# 7. Decisions already made

Build to these unless the user changes them.

- **Showcase, not shop.** No prices, cart or checkout.
- **Every enquiry goes straight to WhatsApp; there is no enquiry list.**
  - Product cards and product pages: magenta "Enquire on WhatsApp" (`EnquireWhatsAppButton`).
  - Header "Enquire now", hero "Contact us", and the green floating bubble (`WhatsAppFloat`): the general message.
  - The distributor form (Phase 5) validates on the client, then opens WhatsApp with the details prefilled. Nothing is stored.
- **All WhatsApp links come from `src/lib/whatsapp.ts`**: `getWhatsAppLink(message)`, `productEnquiryMessage(product)`, `generalEnquiryMessage()`, and `WHATSAPP_LINK_PROPS` (every link opens in a new tab with `rel="noopener noreferrer"`). Without a number, buttons fall back to `/contact`. Use `WhatsAppIcon` (`src/components/icons/`); the floating bubble uses the `whatsapp` colour token, buttons use `primary`.
- **The WhatsApp number comes only from `NEXT_PUBLIC_WHATSAPP_NUMBER`** (digits; a bare 10-digit Indian number gets `91` added). It is not editable in Studio.
- **Filters and search state live in the URL** (`?area=<slug>&category=<slug>&form=<Tablet…>&q=<text>`), one value per facet, so filtered lists can be shared. Build URLs with `src/lib/product-filters.ts`; filtering happens in GROQ on the server (`src/sanity/lib/catalogue.ts`), with search text always passed as a query parameter. Zero-count facet options are hidden.
- **Inner pages** live in `src/app/(site)/(pages)/`, whose layout renders the sticky solid header. The shared product card is `src/components/product/product-card.tsx` (link + WhatsApp "Enquire" button below it).
- **Unknown product slugs** render the branded not-found page with `noindex` (HTTP 200 because the route streams). Don't set `dynamicParams = false`: new products from Studio must work without a rebuild.
- **Filters open in a `Sheet` on mobile.**
- **Sanity reads go through `sanityFetch`** (`src/sanity/lib/fetch.ts`). It caches successful results by tag, returns the fallback (without caching it) on errors, and returns the fallback when Sanity isn't configured, so the site renders before `.env.local` exists.
- **The header is `SiteHeader`** (`src/components/layout/`). The home page renders `variant="overlay"` inside its hero; other pages use `variant="solid"`. The `(site)` layout does not render a header. The full nav shows from `lg`; below that, a menu button opens a `Sheet`.
- **Content freshness comes from a webhook, not polling.** Sanity webhook → `POST /api/revalidate` → `revalidateTag`. Queries are cached with `"use cache"` + `cacheTag` (e.g. `product`, `category`, `therapeuticArea`, `siteSettings`).
- **SEO lives in `src/lib/seo.ts`** (`siteConfig`, `buildMetadata`, `pageMetadata`, `productMetadata`, `therapeuticAreaMetadata`, JSON-LD generators) and `src/components/seo/JsonLd.tsx`. New pages export `metadata = pageMetadata.<page>` or call `buildMetadata`; never hand-write meta tags. Product JSON-LD must never include `offers`, prices, ratings or reviews. `/products?area=` pages canonicalise to `/products`. `robots.ts` blocks all indexing when `NEXT_PUBLIC_SITE_URL` is `localhost` or `*.vercel.app`.
- **`siteSettings` is a singleton** in Studio: one document, shown as a single item in the Studio structure, not a list.
- **Header uses a text logo** ("Genoine Lifecare") until the real logo exists.
- **The palette is provisional** and will change after the logo is designed. That is why every colour goes through tokens.

---

# 8. Data model (Sanity)

Dataset: `production`, public read. Every field description in Studio should be written for a non-technical client.

### `product`

| Field | Type | Rule |
|---|---|---|
| `name` | string | **required** |
| `slug` | slug (from `name`) | **required**, unique |
| `composition` | string | **required**, e.g. "Pantoprazole 40mg + Domperidone 30mg" |
| `strength` | string | optional |
| `dosageForm` | string from a fixed list | **required**: Tablet, Capsule, Syrup, Injection, Suspension, Ointment/Cream, Drops, Sachet/Powder, Softgel |
| `packSize` | string | e.g. "10x10 Alu-Alu" |
| `category` | reference → `category` | **required** |
| `therapeuticArea` | reference → `therapeuticArea` | **required** |
| `images` | array of image (hotspot) | each image **requires `alt` text** |
| `shortDescription` | text | |
| `indications` | array of string | |
| `usageNote` | text | |
| `isFeatured` | boolean | home page featured grid |
| `isNewLaunch` | boolean | home page new launches strip |
| `order` | number | manual sort order |
| `seo` | object `{ title, description }` | falls back to name + composition |

### `category`

`title` (required), `slug` (required), `description`, `image`/icon, `order`.

### `therapeuticArea`

`title` (required), `slug` (required), `description` (optional one-liner, max 80 chars, shown on the home hero card). Seed list: Gastro, Diabetes, Cardiac, Pain & Ortho, Antibiotics, Gynae, Paediatric, Derma, Nutraceuticals, Respiratory.

`product` also has optional `heroImage` (used as the card image when a product has no `images`) and `heroTagline` (not displayed). **The home hero never shows Sanity products:** it is a design showcase with the static bottles in `public/hero/` (`HERO_SHOWCASE_PRODUCTS` in `src/components/home/hero/hero-content.ts`). Real products appear only on `/products` and `/products/[slug]`.

### `siteSettings` (singleton)

Fixed `_id: "siteSettings"`, opened from the Studio sidebar (`src/sanity/structure.ts`); can't be created, duplicated or deleted. Fields: `companyName`, `tagline`, `phone`, `email`, `address`, `businessHours`, `mapEmbedUrl`, `socialLinks[] { platform, url }`, `cin`, `disclaimer`. Read it on the server with `getSiteSettings()` (`src/sanity/lib/site-settings.ts`). The WhatsApp number is **not** here (env only).

### Seed data

`pnpm seed` (`scripts/seed.mjs`) creates base content with fixed `_id`s: Site settings (no contact details), therapeutic areas (with icons from `public/specialities/`), and categories. It never overwrites existing documents; `pnpm seed --force` resets them. **It does not create products**: the sample products were deleted once the first real product (Biostone) was added. Real products are entered in Studio, using only facts printed on the pack.

**Rules:**

- Do not add a price, MRP or stock field to any schema.
- Queries project only the fields the page needs. Never fetch whole documents with `...`.
- Queries exclude drafts (the client uses the `published` perspective).
- Seed and placeholder data must be clearly fake (e.g. "Sample Product 1"). Never invent real-looking brand names, claims or contact details and present them as Genoine's.

---

# 9. WhatsApp enquiry

- Each product has its own page (`/products/[slug]`) with a large "Enquire on WhatsApp" button and a "Share product" button (native share sheet, else copy link + toast).
- The product enquiry message format is fixed (`productEnquiryMessage`):

```
Hello Genoine Lifecare, I'd like to enquire about:
*<name>* (<dosageForm>, <packSize>)
Composition: <composition>
Link: <absolute product URL>
Name:
City:
```

Leave out the parentheses part when dosage form and pack size are both empty.

- General enquiries (`generalEnquiryMessage`): "Hello Genoine Lifecare, I'd like to know more about your products."
- Never build `wa.me` URLs by hand; always use `getWhatsAppLink()` (it URL-encodes the message).

---

# 10. API contracts

| Route | Method | Purpose | Protection |
|---|---|---|---|
| `/api/revalidate` | `POST` | Sanity webhook → `revalidateTag` by document `_type` | Verify the Sanity webhook signature with `SANITY_REVALIDATE_SECRET` (`parseBody` from `next-sanity/webhook`). Reject invalid requests with `401` |

Do not add other API routes without approval.

Pages: `/`, `/products`, `/products/[slug]`, `/about`, `/distributor`, `/contact`, `/studio`. Plus `sitemap.xml` and `robots.txt` through the Next.js metadata file conventions. Do not invent other routes.

---

# 11. Security and compliance

**Never expose to the browser:** `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, or any other variable without the `NEXT_PUBLIC_` prefix. Never import a module that reads them into a Client Component.

**Never do from the browser:** write to Sanity, call the revalidate route, or fetch Sanity with a token.

**Compliance (pharma):**

- No prices, discounts or offers.
- No promotional health claims ("best", "cures", "guaranteed", "100% safe"). Indications are listed as plain facts from the CMS.
- A disclaimer, "for use under medical supervision" or similar, appears in the footer and on product pages, using the `siteSettings` text.
- Copy tone is professional, clear and plain. No heavy marketing language.

## Environment variables

The canonical list is `.env.example`. Keep this table and `.env.example` in sync.

| Variable | Purpose | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project | client + server |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | client + server |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` | client + server |
| `SANITY_API_READ_TOKEN` | Server-side reads (drafts/preview later) | server only |
| `SANITY_API_WRITE_TOKEN` | Editor token for `pnpm seed` only. Never import it in app code | server only (scripts) |
| `SANITY_REVALIDATE_SECRET` | Webhook signature secret for `/api/revalidate` | server only |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback WhatsApp number | client + server |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs for metadata, sitemap, OG | client + server |

Read `NEXT_PUBLIC_*` values with literal `process.env.NAME` expressions so Next.js can inline them. Sanity values are validated in `src/sanity/env.ts`; import them from there.

---

# 12. Known traps

- **Cache Components is on.** Server Components cannot read the current time (`new Date()`), random values, or uncached data during prerender without `"use cache"`, `connection()` or a `<Suspense>` boundary. Check the docs before working around an error.
- **`LayoutProps<"/route">` and `PageProps<"/route">`** are global types generated by Next.js. After adding or moving routes, run `pnpm typecheck`; it regenerates them (`next typegen`).
- **shadcn components import `cn` from the `cn` package**, not `clsx`/`tailwind-merge`. `@/lib/utils` re-exports it. Do not "fix" these imports.
- **Newly added shadcn components may use `bg-accent` for hover.** That is the tint here, which is correct. Never remap `--accent` to yellow.
- **The Studio config (`sanity.config.ts`) is a client module** (`"use client"`). Do not import server-only code into it or into schemas.
- **CORS:** the Studio needs `http://localhost:3000` (and the production domain) in Sanity's CORS origins with credentials allowed.
- **The Next.js block in this file is re-added by `next dev`.** Leave it in place.
- The project runs on **Windows** with pnpm. Use cross-platform scripts (no `rm -rf` or `export` in `package.json` scripts).

---

# 13. Checks and testing

"Run checks" means running these from the project root and reporting the real output:

- `pnpm typecheck` — route type generation + `tsc --noEmit`
- `pnpm lint` — ESLint
- `pnpm build` — when routes, config, caching, or server modules changed

Then test manually:

- `pnpm dev`, then open the affected pages. Check the terminal and browser console for errors.
- Check layouts at **360px, 768px and 1280px+**.
- **Sanity changes:** `/studio` opens, the new schema appears, a document can be created and published, and it shows up on the site.
- **WhatsApp changes:** open each button (card, product page, header, hero, floating bubble), check the prefilled message text, that it opens in a new tab, and that the number has the country code.
- **Filter changes:** filters update the URL, a copied URL restores the same results, and there is an empty state when nothing matches.

Never claim a check passed without running it. If a check fails, say so and show the output.

---

# 14. Code standards

- TypeScript strict. No `any`. Explicit types for Sanity query results and component props.
- Small functions and small components. One component per file. Named exports, except where Next.js requires default exports (pages, layouts).
- Server-only modules should not be importable from client code.
- Use the `@/` import alias.
- No unrelated refactors, no speculative abstractions, no unrequested features.
- Comments explain *why*, not *what*.

---

# 15. Build order

Follow the PRD phases. Each step gets its own prompt file and approval.

1. **Setup** ✅ — Next.js, Tailwind, shadcn, Sanity Studio, theme tokens, fonts, folder structure
2. **CMS** ✅ — schemas, queries, seed script with placeholder products, revalidation webhook
3. **Catalogue** ✅ — product card, `/products` listing with filters and search, product detail
4. **Enquiry** ✅ — direct WhatsApp enquiry per product, floating WhatsApp button, share button (replaced the enquiry list)
5. **Pages** — Home, About, Distributor, Contact, header, footer
6. **Content** — import the real product list and cleaned pack photos
7. **SEO and launch** — metadata, sitemap, structured data, analytics, domain, Search Console

Update the ✅ markers when a phase is complete.

---

# 16. When in doubt

1. Keep it small.
2. Check `PRD.md` and this file before deciding anything.
3. Read the local docs (section 5) before writing framework code.
4. Preserve server/client boundaries. Keep secrets server-side.
5. Use tokens, never hex values. Yellow only for CTAs and badges.
6. Never show prices or make health claims.
7. Ask one focused question rather than guessing.
8. Save a prompt, get approval, implement, run checks, share exact test steps.
