# 04 — Sanity CMS (Phase 2)

## Goal

Finish the CMS: a `siteSettings` singleton, a client-friendly Studio structure, a seed script that fills the dataset with clearly-fake sample content, and webhook revalidation so published changes appear on the site within seconds.

## Prerequisite (user)

A real Sanity project with a `production` dataset, its ID in `.env.local`, and `http://localhost:3000` in CORS origins with credentials. Seeding uses your Sanity login (`sanity exec --with-user-token`), so no write token is needed.

## Read / inspected

- `AGENTS.md` §7, §8, §10, §11; `PRD.md` §10
- `node_modules/next/dist/docs/.../revalidateTag.md`: **two-argument form** `revalidateTag(tag, "max")`; one-arg is deprecated
- Existing schemas: `product`, `category`, `therapeuticArea`; `src/sanity/queries.ts`; `src/sanity/lib/fetch.ts` (tags); `src/sanity/lib/site-settings.ts` (already queries `siteSettings` for SEO); `src/lib/whatsapp.ts` (env number, TODO for siteSettings)

## Decisions

1. **`siteSettings` singleton** (fixed `_id: "siteSettings"`). Fields:
   - company name, tagline
   - phone, WhatsApp number (digits only, with country code), email
   - address (text), CIN (prefilled), business hours (text)
   - social links (array of `{ platform, url }`), Google Maps embed URL
   - medical disclaimer (text, prefilled with a plain "for use under medical supervision" line)
2. **Studio structure:** "Site settings" opens the single document directly, followed by Products, Categories and Therapeutic areas. `siteSettings` is hidden from "Create new" and can't be deleted or duplicated.
3. **WhatsApp number source:** `siteSettings.whatsappNumber`, falling back to `NEXT_PUBLIC_WHATSAPP_NUMBER` (AGENTS §7). The hero's "Contact us" reads it on the server.
4. **SEO:** `getSiteSettings()` reads `socialLinks[].url` as today; the field shape above matches it.
5. **Seed script** `scripts/seed.ts`, run with `pnpm seed` (= `sanity exec scripts/seed.ts --with-user-token`). Idempotent: fixed `_id`s + `createOrReplace`, so re-running updates rather than duplicates. Creates:
   - `siteSettings` with name, tagline, CIN and disclaimer. Phone, email, WhatsApp and address stay **empty** (never invent contact details).
   - 8 therapeutic areas (Gastro, Diabetes, Cardiac, Pain & Ortho, Gynae, Paediatric, Respiratory, Nutraceuticals) with tile text, tint, order, and the icons uploaded from `public/specialities/`.
   - Categories matching the dosage forms in use: Tablets, Capsules, Softgels, Syrups.
   - 4 **"Sample Product A–D"** featured products matching the hero bottles (same compositions, forms and pack sizes as the hero fallback), with `heroImage` uploaded from `public/hero/`, linked to their area and category.
   - It does **not** touch any document it didn't create.
6. **Webhook** `POST /api/revalidate`:
   - Verifies the signature with `parseBody` from `next-sanity/webhook` and `SANITY_REVALIDATE_SECRET`; returns 401 if invalid, 400 if `_type` is missing.
   - Calls `revalidateTag(_type, "max")`; for `product` it also revalidates `therapeuticArea` (product counts).
   - Adds `SANITY_REVALIDATE_SECRET=` to `.env.example` and the AGENTS.md env table.
   - Webhook setup steps in the report (Sanity manage → API → Webhooks, projection `{_type}`, POST, secret).
7. **Not in this step:** product pages, filters, footer contact block (Phase 3/5), and real content (Phase 6).

## Files

- Create:
  - `src/sanity/schemas/site-settings.ts`
  - `src/sanity/structure.ts`
  - `scripts/seed.ts`
  - `src/app/api/revalidate/route.ts`
- Change:
  - `src/sanity/schemas/index.ts`
  - `sanity.config.ts` (structure + singleton actions/templates)
  - `src/sanity/queries.ts` (WhatsApp number in settings query)
  - `src/sanity/lib/site-settings.ts`
  - `src/lib/whatsapp.ts`
  - hero (Contact us href from server)
  - `package.json` (`seed` script)
  - `.env.example`, `AGENTS.md` (§8 siteSettings fields, §11 env table, §15 mark Phase 2)

## Security

- Seeding uses the developer's own login token via the Sanity CLI; nothing is stored in env or code.
- `SANITY_REVALIDATE_SECRET` is server-only; the route never echoes it. No new client-side env.

## Acceptance criteria

- [ ] `/studio` shows Site settings (single doc), Products, Categories, Therapeutic areas; Site settings can't be duplicated or deleted.
- [ ] `pnpm seed` runs twice without creating duplicates; Studio shows 8 areas with icons, 4 categories, 4 sample products with hero images.
- [ ] Home page shows the seeded products in the hero and the seeded areas with real product counts.
- [ ] Filling `whatsappNumber` in Site settings changes the hero "Contact us" link (after revalidation).
- [ ] `POST /api/revalidate` without a valid signature → 401; with a valid one → 200 and the change appears on refresh.
- [ ] `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

## Manual test steps

1. `pnpm seed`, then open `/studio` and check the content listed above.
2. `pnpm dev` and open `/`: the hero and speciality tiles come from Sanity (edit a product's composition, publish, refresh).
3. Run `curl -X POST http://localhost:3000/api/revalidate` and expect 401.
4. After deploying: add the webhook in Sanity manage, publish an edit, and check it appears on the live site within seconds.
