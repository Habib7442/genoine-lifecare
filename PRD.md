# PRD — Genoine Lifecare Website

**Client:** Genoine Lifecare Private Limited (CIN: U21001AS2026PTC030380)
**Location:** Assam, India
**Built by:** Locallify
**Status:** Draft v1 — November 2026

---

## 1. Overview

Genoine Lifecare is a newly registered pharma marketing company. It has no website or online presence yet. This project builds a **product showcase website**. It presents the company's medicine range to doctors, chemists, stockists and distributors, and turns their interest into **WhatsApp enquiries**.

This is **not an e-commerce site**. There is no checkout, no online payment and no public pricing.

## 2. Goals

1. **Showcase every product clearly**: composition, strength, dosage form, pack size and indications on a clean, fast product page.
2. **Generate enquiries**: make it easy to enquire about one product or many products at once through WhatsApp.
3. **Build trust for a new company**: a professional look, company details (CIN, address) and a consistent brand.
4. **Let the client manage products themselves**: add, edit and remove products through a CMS without a developer.
5. **Recruit distributors**: give distributors and franchise partners a clear way to get in touch.

### Success metrics
- Number of WhatsApp enquiries per month (tracked through button click events)
- Number of distributor enquiry form submissions
- Product pages indexed on Google
- Lighthouse score of 90+ on mobile (performance, accessibility, SEO)

## 3. Target users

| User | What they need |
|---|---|
| **Distributors / stockists** | Browse the full range, shortlist many products, send one enquiry |
| **Chemists / retailers** | Find a specific product and check its composition and pack size |
| **Doctors** | Check composition, strength and indications quickly on a phone |
| **Prospective franchise (PCD) partners** | Understand the company and the range, and apply to partner |
| **Genoine team (admin)** | Add and update products, categories and contact details |

Most visitors will be on **mobile phones**, so the design is mobile-first.

## 4. Scope

### In scope (v1)
- Home page
- Products listing with filters and search
- Product detail pages
- Enquiry list (shortlist multiple products → one WhatsApp message)
- About, Contact and Distributor enquiry pages
- Sanity CMS for managing all content
- Basic SEO (metadata, sitemap, structured data)

### Out of scope (v1)
- Online ordering, cart checkout or payments
- Public product prices
- User accounts or login for visitors
- Downloadable PDF product catalogue (planned for v2)
- Logo design (the logo is created separately, later)
- Multi-language support

## 5. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| CMS | Sanity v3, Studio embedded at `/studio` |
| Client state | Zustand (enquiry list, persisted to localStorage) |
| Icons | lucide-react |
| Images | next/image + the Sanity image CDN |
| Hosting | Vercel |
| Content updates | Sanity webhook → tag-based revalidation |

## 6. Brand and design

### Colour palette (working palette; the logo will be designed to match)

| Role | Colour | Usage |
|---|---|---|
| Primary | Deep magenta `#8E1B5E` | Header, headings, key UI |
| Primary light | Magenta `#C2287F` | Badges, hover states, highlights |
| Accent | Yellow `#FFC93C` | CTA buttons and badges only, always with dark text |
| Tint | Light pink `#FBF3F7` | Section backgrounds |
| Text | Dark `#22121B` | Body text |
| Background | White `#FFFFFF` | Main background |

**Design rules**
- Mostly white layout, so the product images are the focus.
- Yellow is used sparingly, and never with white text on it.
- No gradients, no neon, no large magenta and yellow blocks side by side.
- All colours live in CSS variables, so the palette can change from one place after the logo is ready.

### Typography
- Headings: **Sora**
- Body: **DM Sans**

### Tone
Professional, clear and trustworthy. Copy is simple and avoids heavy marketing language.

## 7. Site map

```
/                         Home
/products                 All products (filters + search)
/products/[slug]          Product detail
/about                    About the company
/distributor              Distributor / franchise enquiry
/contact                  Contact details + map
/studio                   Sanity Studio (admin only)
```

## 8. Page requirements

### 8.1 Home
- **Hero:** a headline about quality medicines, with "View products" and "Become a distributor" buttons
- **Featured products:** a grid of products marked as featured in the CMS
- **Browse by category:** Tablets, Capsules, Syrups, Injections and so on
- **Browse by therapeutic area:** chips for Gastro, Diabetes, Cardiac and so on
- **New launches:** a strip of products marked as new launches
- **Why Genoine:** 3–4 short trust points (quality-assured manufacturing, wide range, timely supply, distributor support)
- **Contact strip:** phone, WhatsApp and address

### 8.2 Products listing (`/products`)
- Product grid with filters for **category**, **therapeutic area** and **dosage form**
- A search box that matches product name and composition
- Filters sync to the URL, so a filtered list can be shared
- Result count and an empty state
- On mobile, filters open in a slide-in sheet

### 8.3 Product detail (`/products/[slug]`)
- Image gallery
- Product name, composition and strength
- Dosage form, pack size, and category and therapeutic area badges
- Indications list and a usage note
- **"Add to enquiry list"** button
- **"Enquire on WhatsApp"** button (prefilled with the product name and composition)
- Related products from the same therapeutic area
- SEO metadata and Product structured data

### 8.4 Product card (shared component)
- Product image on a white background
- Name, and composition in smaller muted text
- Dosage form badge
- A quick "Add to enquiry" icon button

### 8.5 About
- Company introduction, mission, and approach to quality
- Company details, including the CIN

### 8.6 Distributor enquiry
- Benefits of partnering with Genoine
- Form fields: name, firm name, city/district, state, phone, existing business type, message
- On submit, the form opens WhatsApp with the details prefilled (v1). Email or CMS storage can come later.

### 8.7 Contact
- Phone, WhatsApp, email and address
- Embedded Google Map
- Business hours

### 8.8 Global layout
- Sticky header with a text logo ("Genoine Lifecare") until the real logo is ready
- Navigation: Home, Products, About, Distributor, Contact
- A mobile menu
- Footer with company details, CIN, quick links and social links
- A floating enquiry list button showing how many products are selected

## 9. Enquiry list (key feature)

Distributors usually ask about many products at once, so visitors can build a shortlist before contacting the company.

**Requirements**
- Add or remove products from any product card or product page
- The list persists in localStorage (Zustand `persist`) and survives page reloads
- A floating button shows the count of selected products
- A slide-in sheet lists the selected products, each with an optional quantity or note field
- **"Send enquiry on WhatsApp"** builds one `wa.me` message listing every product (name, composition, pack size, note)
- A "Clear list" action
- No hydration mismatch: the count renders only after the client has loaded

**Example WhatsApp message**
```
Hello Genoine Lifecare, I'd like to enquire about:
1. Pantozen-DSR — Pantoprazole 40mg + Domperidone 30mg (10x10) — Qty: 20 boxes
2. Glimzen-M2 — Glimepiride 2mg + Metformin 500mg (10x15)
Name:
City:
```

## 10. CMS (Sanity) content model

### `product`
| Field | Type | Notes |
|---|---|---|
| name | string | required |
| slug | slug | from the name |
| composition | string | e.g. "Pantoprazole 40mg + Domperidone 30mg" |
| strength | string | optional |
| dosageForm | string (list) | Tablet, Capsule, Syrup, Injection, Suspension, Ointment/Cream, Drops, Sachet/Powder, Softgel |
| packSize | string | e.g. "10x10 Alu-Alu" |
| category | reference → category | required |
| therapeuticArea | reference → therapeuticArea | required |
| images | array of images | hotspot, alt text required |
| shortDescription | text | |
| indications | array of strings | |
| usageNote | text | |
| isFeatured | boolean | shown on the home page |
| isNewLaunch | boolean | shown in the new launches strip |
| order | number | manual sorting |
| seo | object | title, description |

### `category`
title, slug, description, icon/image, order

### `therapeuticArea`
title, slug. Initial list: Gastro, Diabetes, Cardiac, Pain & Ortho, Antibiotics, Gynae, Paediatric, Derma, Nutraceuticals, Respiratory.

### `siteSettings` (singleton)
company name, tagline, phone, WhatsApp number, email, address, CIN, social links, business hours

## 11. Product content workflow

1. The client sends raw photos of the product packs plus the product list (Excel sheet, price list photo or WhatsApp text).
2. Pack photos are cleaned up with consistent white-background product photography.
3. Product data is turned into the Sanity schema format and imported.
4. After launch, the client adds new products directly in `/studio`.

## 12. SEO

- Unique title and meta description for every page (product SEO fields fall back to the name and composition)
- Open Graph images
- `sitemap.xml` and `robots.txt`
- Structured data: `Organization` (site-wide) and `Product` (product pages)
- Clean URLs (`/products/pantozen-dsr`)
- Google Search Console setup at launch
- Google Business Profile (separate task)

## 13. Non-functional requirements

- **Performance:** server components by default, client components only where needed. Optimised images. LCP under 2.5s on 4G.
- **Accessibility:** alt text, keyboard navigation, visible focus states, proper heading order, enough colour contrast.
- **Responsive:** mobile-first, tested at 360px, 768px and 1280px+.
- **Content freshness:** CMS changes appear on the site within a minute through webhook revalidation.
- **Security:** read token kept server-side, `/studio` protected by Sanity login.
- **Compliance:** no prescription-drug advertising claims or pricing, and a disclaimer that products are for use under medical supervision.

## 14. Project structure

```
src/
  app/
    (site)/            → public pages + layout
    studio/[[...tool]] → Sanity Studio
    api/revalidate     → Sanity webhook
  components/
    ui/                → shadcn
    layout/            → header, footer, mobile nav
    product/           → card, grid, filters, gallery
    enquiry/           → floating button, sheet, WhatsApp builder
  sanity/
    lib/               → client, image builder
    schemas/
    queries.ts
  store/               → Zustand enquiry store
  lib/
```

## 15. Build phases

| Phase | Work |
|---|---|
| **1. Setup** | Next.js, Tailwind, shadcn, Sanity Studio, Zustand, theme tokens, fonts, folder structure |
| **2. CMS** | Schemas, queries, seed script with placeholder products, revalidation webhook |
| **3. Catalogue** | Product card, products listing with filters and search, product detail page |
| **4. Enquiry** | Zustand enquiry list, floating button, sheet, WhatsApp message builder |
| **5. Pages** | Home, About, Distributor, Contact, header, footer |
| **6. Content** | Import the real product list and cleaned pack photos |
| **7. SEO and launch** | Metadata, sitemap, structured data, analytics, domain, Search Console |
| **v2** | Downloadable PDF catalogue, final logo and palette update, distributor form stored in the CMS |

## 16. Dependencies and open questions

- [ ] Full product list from the client
- [ ] Product pack photos
- [ ] WhatsApp number, phone, email, office address
- [ ] Domain name
- [ ] Logo (to be designed later; the palette may be adjusted to match it)
- [ ] Confirm the product range's main therapeutic areas (this affects how dark the magenta should be)
- [ ] Do they offer PCD franchise / monopoly rights? (This changes the copy on the Distributor page.)
- [ ] Does the client want product prices or MRP visible to anyone? (Currently no.)