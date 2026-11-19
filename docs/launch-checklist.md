# Launch checklist: genoinelifecare.com

Work through these in order. Each step says where to click and how to check it worked.
Never paste token or secret values into chat, commits or screenshots.

---

## 1. Content ready (Studio)

Open `http://localhost:3000/studio` (or `/studio` on the live site later).

- [ ] **Products:** every real product entered, using only facts printed on the pack (name, composition, dosage form, pack size, category, speciality). Each image has alt text.
- [ ] **Featured:** tick "Featured" on the products for the home page (up to 8).
- [ ] **Site settings:**
  - phone, email, office address, business hours
  - map location (address, or coordinates from Google Maps: right-click the office → click the numbers)
  - social links
  - medical disclaimer
- [ ] **About page:** check the text, and add leaders (with photos) if wanted.
- [ ] **Client sign-off** on wording that makes claims:
  - "WHO-GMP certified manufacturing" (hero pill: `src/components/home/hero/hero-content.ts`)
  - "certified manufacturing partners", "Timely supply" (`src/content/home.ts`, `src/content/distributor.ts`, About page)
  - Privacy policy, Terms of use and Disclaimer page text (currently placeholders, marked `noindex`)
- [ ] **Inbox:** `support@genoinelifecare.com` exists and someone reads it (it's the default email on Contact and in the footer).

## 2. Vercel project

1. Go to vercel.com → **Add New → Project** → import `Habib7442/genoine-lifecare` from GitHub.
2. Framework: Next.js (auto-detected). Leave the build settings at their defaults; Vercel detects pnpm from `pnpm-lock.yaml`.
3. **Environment variables** (Settings → Environment Variables), for **Production**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | same as `.env.local` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` |
| `SANITY_API_READ_TOKEN` | same as `.env.local` (optional for now) |
| `SANITY_REVALIDATE_SECRET` | a new long random string (step 5 uses the same value) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | the business WhatsApp number, digits only (e.g. `9198XXXXXXXX`) |
| `NEXT_PUBLIC_SITE_URL` | `https://genoinelifecare.com` (no trailing slash) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | leave empty until step 7 |

   - **Do not add `SANITY_API_WRITE_TOKEN` to Vercel.** It is only for local `pnpm seed` scripts.
   - To generate the secret, run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` locally.
4. Click **Deploy**. When it finishes, open the `*.vercel.app` link and check:
   - [ ] Home, Products, a product page, About, Distributor and Contact all load.
   - [ ] WhatsApp buttons open the right number with the prefilled message.
   - [ ] `/robots.txt` on the vercel.app link shows `Disallow: /`. That is expected: preview URLs are never indexed.

## 3. Domain

1. In Vercel: **Settings → Domains → Add** → `genoinelifecare.com`, then also add `www.genoinelifecare.com` and set it to **redirect to** `genoinelifecare.com`.
2. Vercel shows the DNS records to add. At your domain registrar's DNS settings, add:
   - an `A` record for `@` pointing to the IP Vercel shows
   - a `CNAME` record for `www` pointing to the value Vercel shows
3. Wait until Vercel shows **Valid Configuration** for both (minutes to a few hours). HTTPS is set up automatically.
4. If you changed `NEXT_PUBLIC_SITE_URL` after the first deploy, **redeploy** (Deployments → ⋯ → Redeploy). `NEXT_PUBLIC_*` values are built into the site.
5. Check:
   - [ ] `https://genoinelifecare.com` loads, and `www.` redirects to it.
   - [ ] `https://genoinelifecare.com/robots.txt` shows `Allow: /` and the sitemap line.
   - [ ] `https://genoinelifecare.com/sitemap.xml` lists the pages and every product with the real domain.

## 4. Sanity: allow the live Studio

sanity.io/manage → your project → **API → CORS origins → Add origin**:

- [ ] `https://genoinelifecare.com` with **Allow credentials** ticked
- [ ] (keep `http://localhost:3000` for local work)

Then check that `https://genoinelifecare.com/studio` lets you log in and edit.

## 5. Sanity webhook (site updates after publishing)

sanity.io/manage → your project → **API → Webhooks → Create webhook**:

| Field | Value |
|---|---|
| Name | `Revalidate site` |
| URL | `https://genoinelifecare.com/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["product", "category", "therapeuticArea", "siteSettings", "aboutPage"]` |
| Projection | `{_type}` |
| HTTP method | `POST` |
| Secret | the same value as `SANITY_REVALIDATE_SECRET` in Vercel |
| Drafts | off (only published changes) |

Check:

- [ ] Edit a product's pack size in Studio and publish. Within a few seconds, reload its page on the live site and confirm the change shows.
- [ ] In the webhook's **Attempts log**, the delivery shows status `200`. A `401` means the secrets don't match.

## 6. Final checks on the live site

- [ ] **Phone (360px wide), tablet and desktop:** home, products (filters and search), product page, About, Distributor and Contact all look right.
- [ ] **Every WhatsApp entry point opens the right number:** header "Enquire now", hero "Contact us", product cards, product page, floating bubble, Contact form and Distributor form.
- [ ] **Share preview:** share the home page link in WhatsApp and check the preview image and title appear.
- [ ] **No prices, offers or health claims** anywhere. The disclaimer shows in the footer and on product pages.

## 7. Google Search Console

1. Go to search.google.com/search-console → **Add property** → choose **Domain** and enter `genoinelifecare.com`.
2. Google gives a **TXT record**. Add it at your registrar's DNS, then click **Verify**. (Domain verification covers `www` and `https` in one go.)
   - Alternative: choose **URL prefix**, pick the **HTML tag** method, copy only the `content="…"` value into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel, redeploy, then click Verify.
3. **Sitemaps** → submit `https://genoinelifecare.com/sitemap.xml` and check that the status is **Success**.
4. **URL inspection** → enter the home page URL → **Request indexing**. Repeat for a couple of key product pages.
5. After a few days, check **Pages** and **Enhancements** for errors (product structured data).

## 8. Optional / decide later

- **Analytics:** not built yet. The simplest option is **Vercel Web Analytics** (Vercel → Analytics → Enable, plus a small `@vercel/analytics` component). Ask before adding it: it's a new dependency, and a privacy policy should mention it.
- **Google Business Profile** for the Sribhumi office (helps local search; uses the same address and phone).
- **Logo:** a simplified "GL" mark for the favicon and header.
- **Legal pages:** once the client approves the text, remove `noIndex` from `/privacy-policy`, `/terms` and `/disclaimer`.

---

### If something breaks

| Problem | Likely cause |
|---|---|
| Site shows no products | Sanity env vars missing in Vercel → add them and redeploy |
| Studio login loops or shows a CORS error | Domain not in Sanity CORS origins with credentials |
| Edits don't appear on the live site | Webhook URL, filter or secret wrong; check the webhook attempts log |
| WhatsApp buttons go to /contact | `NEXT_PUBLIC_WHATSAPP_NUMBER` not set → set it and redeploy |
| Google says "Blocked by robots.txt" | `NEXT_PUBLIC_SITE_URL` still a vercel.app or localhost URL → fix and redeploy |
