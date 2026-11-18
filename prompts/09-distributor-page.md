# 09 — Distributor page

## Goal
Build `/distributor`. It explains why to partner with Genoine and collects distributor or stockist details in a form that opens WhatsApp prefilled. Nothing is stored.

## Skills and docs read
- `AGENTS.md` (§1, §7: "The distributor form validates on the client, then opens WhatsApp with the details prefilled", §9, §11), `PRD.md` §8.6 (benefits; fields: name, firm name, city/district, state, phone, existing business type, message)

## Existing code inspected
- `PageHeader` (banner `background` or `aside`), `AboutHeaderVisual`, `FeatureCard`, `FadeIn`
- Contact page: `contact-form.tsx` (Field, validation, `isIndianMobile`, success note), `contact-info.tsx`
- `src/lib/whatsapp.ts`, `pageMetadata.distributor`, `breadcrumbJsonLd`, `getSiteSettings()`

## Decisions and assumptions
- **Copy lives in code** (`src/content/distributor.ts`), not Sanity, for v1. It's short and rarely changes. I can move it to a Studio singleton later, like the About page, if you want.
- **No PCD/franchise wording** (your earlier decision). The audience is distributors, stockists and retail chemists.
- **Benefits:** only claims the company already makes elsewhere on the site, with no numbers and no margins or offers (compliance). These need client confirmation:
  1. **Focused range:** "Medicines across key therapeutic areas, chosen for everyday prescriptions."
  2. **Quality-assured products:** "Made by certified manufacturing partners."
  3. **Direct communication:** "Talk to our team directly on WhatsApp or phone."
  4. **Regional focus:** "Based in Assam, working with partners across the Northeast."
- **How it works (3 steps):**
  1. "Send your details": the form below.
  2. "We get in touch": our team contacts you to discuss the range and your area.
  3. "Start working together". There's no timing promise in any step.
- **Form fields** (PRD §8.6). `*` = required.
  - Your name*
  - Firm name*
  - Phone* (same Indian mobile check as Contact)
  - City / district*
  - State* (a `Select`: Assam (default), Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura, Sikkim, West Bengal, Other)
  - Business type* (a `Select`: Distributor, Stockist, Retail chemist, Hospital / clinic supply, Other)
  - Message (optional)
- **WhatsApp message** (new `distributorEnquiryMessage()` in `whatsapp.ts`):
  ```
  Hello Genoine Lifecare, I'd like to become a partner.
  Name: …
  Firm: …
  Phone: …
  City / district: …
  State: …
  Business type: …
  Message: …            (left out when empty)
  ```
  It opens in a new tab and shows the same note as Contact: "WhatsApp opened — send the message to reach us." Without a number, it opens a `mailto:` to the site email.
- **Code reuse:**
  - `Field`, `isIndianMobile` and the field styles move out of `contact-form.tsx` into `src/components/forms/` (`form-field.tsx`, and `src/lib/validation.ts` for `isIndianMobile`).
  - Both forms then use them.
  - No behaviour change on Contact.
- **Header:**
  - `PageHeader` with breadcrumb Home > Distributor, eyebrow "Partner with us", h1 "Become a distributor", and the intro "Distributor and stockist enquiries are welcome across the Northeast. Share your details and our team will get in touch."
  - The visual on the right is the bottle group image (`AboutHeaderVisual`), shown from md up.
  - If you add `public/banners/distributor.webp` later, it switches to the banner style like Contact.
- **The "Become a distributor" CTA block is not shown on this page**, because the page itself is that CTA.

## Files
**New**
- `src/app/(site)/(pages)/distributor/page.tsx`
- `src/content/distributor.ts`
- `src/components/distributor/distributor-benefits.tsx`
- `src/components/distributor/distributor-steps.tsx`
- `src/components/distributor/distributor-form.tsx` (client)
- `src/components/forms/form-field.tsx`
- `src/lib/validation.ts`

**Changed**
- `src/lib/whatsapp.ts`
- `src/components/contact/contact-form.tsx` (imports the shared pieces)
- `AGENTS.md` (mark Phase 5 progress)

## Layout
Container `max-w-7xl px-5 md:px-10`. Sections use `py-12 md:py-16`.

**Main section** (`grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16`)

Left column:
- **"Why partner with us"**: eyebrow plus h2 (`text-[28px] md:text-[40px]`), then 4 `FeatureCard`s, `grid gap-4 sm:grid-cols-2`.
- **"How it works"**: h2 `text-2xl`, then an ordered list of 3 steps. Each step has a number in a `size-10 rounded-full bg-primary text-primary-foreground` circle, a title (`font-heading font-semibold`) and one muted line. The steps are joined by a thin vertical `border-l` line on mobile and laid out in a row on md.

Right column:
- The form card is the same style as Contact: `rounded-[32px] border bg-card p-6 md:p-10` with a soft shadow, and `lg:sticky lg:top-24` so it stays in view while reading the benefits.
- h2 "Send your details", a one-line intro, then the fields in a `grid gap-5 sm:grid-cols-2`. Message and the button span 2 columns.
- Below the form: "Prefer to talk? Chat on WhatsApp" (general link), plus the phone if set in Studio.

**Breakpoints**
- **360px:** one column, in the order: header (no image), benefits (1 column), steps (vertical), form (fields stacked, full-width magenta button).
- **768px:** benefits are 2×2, steps sit in a row, and form fields go 2 per row.
- **1280px+:** two columns, with the form sticky on the right.

**States**
- Inline errors with `aria-invalid` and `aria-describedby`; focus moves to the first error.
- Focus rings on all controls. The button hover is `brand-primary-light`.

## Security
- Client-only; no API route, nothing stored. Input only goes into URL-encoded `wa.me` / `mailto:` text. No secrets.

## SEO
- `pageMetadata.distributor` (already PCD-free) and the Home → Distributor breadcrumb JSON-LD. The page is already in the sitemap.

## Acceptance criteria
- `/distributor` renders the header, benefits, steps and form at 360px, 768px and 1280px+.
- Required fields show inline errors. A valid submit opens WhatsApp with the format above. Contact page behaviour is unchanged.
- No PCD, franchise, price or margin wording anywhere on the page.

## Checks
`pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Manual test
1. Run `pnpm dev`, open `/distributor` at 360px, 768px and 1280px, and scroll: the form stays visible on desktop.
2. Submit the form empty to see the errors, then fill it in and submit. Check the WhatsApp text.
3. Click "Become a distributor" on the About page and check it lands here.
4. Re-test the Contact form once to check it still works.
