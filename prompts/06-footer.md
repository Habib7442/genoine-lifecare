# 06 — Site footer

## Goal
Replace the placeholder footer with a real `SiteFooter` that shows company details, CIN, quick links, speciality links, contact details, social links and the medical disclaimer, all from Sanity `siteSettings`.

## Skills and docs read
- `AGENTS.md` (sections 3, 7, 8, 11), `PRD.md` §8 ("Footer with company details, CIN, quick links and social links")
- Existing patterns only. No new framework APIs are needed (plain Server Component + `sanityFetch`).

## Existing code inspected
- `src/app/(site)/layout.tsx`: placeholder `<footer>` with a TODO and `getSiteSettings()` already called
- `src/sanity/lib/site-settings.ts` + `SITE_SETTINGS_QUERY`: only `phone`, `email`, `disclaimer`, `socialLinks[].url` projected today
- `src/sanity/schemas/site-settings.ts`: also has `companyName`, `tagline`, `address`, `businessHours`, `cin`, `socialLinks[] { platform, url }` (platform list: Facebook, Instagram, LinkedIn, YouTube, X (Twitter))
- `src/components/layout/nav-links.ts` (`NAV_LINKS`), `src/lib/seo.ts` (`siteConfig.legalName`, `siteConfig.cin`, `siteConfig.tagline`)
- `src/lib/whatsapp.ts`, `WhatsAppIcon`
- `THERAPEUTIC_AREAS_QUERY` / specialities section (area list with slugs)
- Product page `FALLBACK_DISCLAIMER`
- lucide-react 1.73 has **no brand icons** (Facebook, Instagram etc. are removed)

## Decisions and assumptions
- **Background: `bg-primary` (magenta) with white text.** It closes the page with the brand colour. There is no yellow in the footer, so the "no magenta and yellow blocks side by side" rule holds. Text uses `text-primary-foreground` and `/80` or `/70` opacity for secondary text. Body text contrast on `#8E1B5E` is fine (white at 80% opacity is still above 4.5:1 for 14px text).
- **Social icons:** add one small inline-SVG component `src/components/icons/social-icon.tsx` (`SocialIcon({ platform })`), the same approach as `WhatsAppIcon`. No new icon package. Unknown platform → a generic lucide `Globe`.
- **Missing data hides its row.** No phone, email, address, hours or social links are invented. If none are set, the contact column shows only the WhatsApp link.
- CIN falls back to `siteConfig.cin` and the company name to `siteConfig.legalName`, because both are public registration facts already in the code.
- Disclaimer: move `FALLBACK_DISCLAIMER` into `src/lib/seo.ts`-adjacent shared spot (`src/lib/disclaimer.ts`) so the footer and product page share one fallback.
- Speciality links: up to 6 therapeutic areas that have products (from the existing areas query), linking to `/products?area=<slug>`. If the list is empty, the column is hidden.
- `getSiteSettings()` gets the extra fields (`companyName`, `tagline`, `address`, `businessHours`, `cin`, and `socialProfiles: {platform, url}[]`). The existing `socialLinks: string[]` stays, for JSON-LD `sameAs`.
- The footer sits **above** the mobile sticky enquiry bar. Existing `body[data-sticky-bar="on"]` padding already handles the product page.

## Files to create or change
- `src/components/layout/site-footer.tsx` (new, Server Component)
- `src/components/icons/social-icon.tsx` (new)
- `src/lib/disclaimer.ts` (new: `FALLBACK_DISCLAIMER`)
- `src/sanity/queries.ts`: extend `SITE_SETTINGS_QUERY`
- `src/sanity/lib/site-settings.ts`: extend the type and mapping
- `src/app/(site)/layout.tsx`: render `<SiteFooter settings={settings} />`, remove the placeholder
- `src/app/(site)/(pages)/products/[slug]/page.tsx`: import the shared fallback

## Layout
Container `mx-auto max-w-7xl px-5 md:px-10`, `pt-12 pb-6 md:pt-16`.

**Top grid**
- **360px:** one column, `gap-10`.
- **768px:** 2 columns.
- **1280px+:** 4 columns `lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]`.

The four columns:
1. **Brand.**
   - "Genoine Lifecare" in `font-heading text-xl font-semibold`.
   - The tagline below it (`text-sm text-primary-foreground/80`, max-w-xs).
   - A WhatsApp pill underneath: `bg-white text-primary`, `WhatsAppIcon`, label "Chat on WhatsApp". It uses `WHATSAPP_LINK_PROPS` and falls back to `/contact`.
2. **Quick links** (h2 `text-sm font-semibold uppercase tracking-wide`): `NAV_LINKS`, each `text-sm text-primary-foreground/80 hover:text-primary-foreground hover:underline`.
3. **Specialities**: area links (hidden if none).
4. **Contact:** rows with lucide `MapPin`, `Phone` (`tel:`), `Mail` (`mailto:`) and `Clock` icons (`size-4`, `/70`). Social icon buttons go below: `size-9 rounded-full bg-white/10 hover:bg-white/20`, each with `aria-label="<Platform> (opens in a new tab)"`, `target="_blank" rel="noopener noreferrer"`.

**Disclaimer band**
- Sits below the grid, `mt-10 border-t border-white/15 pt-6`.
- The disclaimer is `text-xs leading-relaxed text-primary-foreground/70`, max-w-3xl.

**Bottom row**
- Layout: `mt-4 flex flex-col gap-1 md:flex-row md:justify-between text-xs text-primary-foreground/70`.
- Left: "© {year} Genoine Lifecare Private Limited".
- Right: "CIN: U21001AS2026PTC030380".
- The year is a static string from `siteConfig`/build: `new Date()` is not allowed during prerender, so use a `COPYRIGHT_YEAR = 2026` constant in the footer. I'll note this in the report.

**Spacing for the floating WhatsApp bubble:** the bottom row gets `pb-16 md:pb-0` on mobile, so the bubble doesn't cover the CIN.

**States:** every link has a visible focus ring (`focus-visible:ring-2 focus-visible:ring-white`) with `rounded-sm` and `outline-none`. There is no loading state, because the footer is server-rendered and cached.

## Security requirements
- Server Component only. No secrets; `siteSettings` is public data.
- External social links use `rel="noopener noreferrer"`. Only `https:` URLs are rendered (others are skipped).
- No prices, offers or health claims.

## Acceptance criteria
- The footer appears on every public page (home, products, product detail), and not in `/studio`.
- It shows the CIN, company name, quick links and disclaimer even with an empty `siteSettings`.
- Phone, email, address, hours and social links appear only when set in Studio. Editing them in Studio updates the footer after publishing (`siteSettings` tag).
- The layout works at 360px, 768px and 1280px+, with no horizontal scroll.
- The product page still shows its disclaimer, using the shared fallback.

## Checks to run
`pnpm typecheck`, `pnpm lint`, `pnpm build`

## Manual test steps
1. Run `pnpm dev` and scroll to the footer on `/`, `/products` and a product page, at 360px, 768px and 1280px.
2. In Studio → Site settings, add a phone, email, address, hours and an Instagram link, then publish. Reload; the rows appear, and the phone and email links open the dialler and mail app.
3. Tab through the footer and check that every link shows a focus ring.
4. Click "Chat on WhatsApp" and check it opens the general message in a new tab.
