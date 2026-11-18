# 08 — Contact page

## Goal
Build `/contact` matching the user's reference: one large white card, with contact information and a map on the left and a "Send us a message" form on the right. The form opens WhatsApp with the details prefilled; nothing is stored.

## Skills and docs read
- `AGENTS.md` (§3 UI, §7 WhatsApp decisions, §9, §11), `PRD.md` §8.7 (phone, WhatsApp, email, address, map, hours)
- The reference image supplied by the user (source of truth for layout)

## Existing code inspected
- `src/lib/whatsapp.ts` (`getWhatsAppLink`, `WHATSAPP_LINK_PROPS`), `getSiteSettings()` (phone, email, address, businessHours; `mapEmbedUrl` is in the schema but not yet queried)
- `PageHeader`, `FadeIn`, `src/lib/company.ts`, `site-footer.tsx` (contact fallback), shadcn `Input`, `sonner`
- `pageMetadata.contact`, `breadcrumbJsonLd`

## Decisions and assumptions
- **Support email:** `support@genoinelifecare.com` becomes the default email (`CONTACT_EMAIL` in `src/lib/company.ts`). `getSiteSettings()` returns it when Studio's email is empty, so the contact page, footer and Organization JSON-LD all use it, and Studio can still override it.
- **Address fallback:** "Karimganj, Assam, India" (already used in the footer) moves to `company.ts` as `FALLBACK_ADDRESS` and is used when Studio's address is empty. The footer's "Get in touch" link stays only while no phone or email is set. Because the email now always exists, that link disappears.
- **Phone and hours:** shown only when set in Studio (no invented numbers). A "WhatsApp" row (green icon, "Chat on WhatsApp") is shown when `NEXT_PUBLIC_WHATSAPP_NUMBER` is set.
- **Map:**
  - Uses `mapEmbedUrl` from Studio. Only `https://www.google.com/maps/embed…` or `https://maps.google.com/…` URLs are accepted.
  - Otherwise it falls back to a keyless Google embed of the address (`https://maps.google.com/maps?q=<address>&output=embed`).
  - The map is an `iframe` with `loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`, a `title` and `rounded-2xl`, plus a "View larger map" link to Google Maps.
- **Form fields:** adapted from the reference for a pharma B2B enquiry, keeping its 2-column grid:
  - First name* | Last name
  - Email | Phone*
  - Firm / company name | Subject (a `Select`: "Product enquiry", "Distributor / stockist", "General question"; default "General question")
  - Message* (textarea)

  `*` marks required fields, checked on the client; errors appear under the field (`aria-invalid` and `aria-describedby`). The phone number needs at least 10 digits.
- **Submit:**
  - The button reads **"Send on WhatsApp"** (with the WhatsApp icon), not "Send message", so visitors know what happens.
  - It builds the message with a new `contactEnquiryMessage()` in `whatsapp.ts` and opens `getWhatsAppLink(...)` in a new tab.
  - With no number configured, it opens a `mailto:` link to the email with the same text instead.
  - A toast confirms it ("Opening WhatsApp…").
  - The form is not cleared, so a visitor can retry.
- **Button colour:** the reference uses a dark button, so this uses `bg-foreground` (`brand-ink`) with white text and `hover:bg-primary`. It stays on-token. Say if you'd prefer magenta.
- **Intro copy (left):** "Questions about our products or partnering with us? Reach us by phone, WhatsApp or email, or visit our office."
- **Intro copy (right):** "Fill in the form and we'll reply on WhatsApp." The reference's "within 24 hours" is dropped, because it's a promise the client hasn't made.
- **Page structure:** `PageHeader` (breadcrumb Home > Contact, eyebrow "Contact us", h1 "Get in touch", same blush banner as About, no right visual) on top, then the card. The reference's blurred gradient backdrop is not used (no gradients); the card sits on white with a border and a soft shadow.
- **New shadcn components:** `textarea` and `label` (`pnpm dlx shadcn@latest add textarea label`).

## Files
**New**
- `src/app/(site)/(pages)/contact/page.tsx`
- `src/components/contact/contact-info.tsx` (server)
- `src/components/contact/contact-map.tsx` (server)
- `src/components/contact/contact-form.tsx` (client)
- `src/components/ui/textarea.tsx` and `src/components/ui/label.tsx` (generated)

**Changed**
- `src/lib/company.ts` (`CONTACT_EMAIL`, `FALLBACK_ADDRESS`)
- `src/lib/whatsapp.ts` (`contactEnquiryMessage`)
- `src/sanity/queries.ts` and `site-settings.ts` (`mapEmbedUrl`, email fallback)
- `site-footer.tsx` (shared fallbacks)

## Layout (reference)
- Section `py-12 md:py-16`, container `max-w-7xl px-5 md:px-10`.
- **Card:** `rounded-[32px] border bg-card p-6 shadow-[0_24px_60px_-30px_rgba(34,18,27,0.25)] md:p-10`, with `grid gap-10 lg:grid-cols-2 lg:gap-16`.
- **Left column:**
  - h2 "Contact information" (`font-heading text-[28px] md:text-[32px] font-semibold`), then the intro (`text-muted-foreground`, max-w-md).
  - The list (`mt-8 space-y-5`): each row has a 20px lucide icon in `text-foreground/70` (PhoneCall, Mail, MapPin, Clock, plus WhatsApp), then the text in `text-base font-medium`. Phone, email and WhatsApp are links.
  - The map below (`mt-8 aspect-[2/1] rounded-2xl overflow-hidden border`).
- **Right column:**
  - h2 "Send us a message", then the intro.
  - The form is `grid gap-5 sm:grid-cols-2`; Message and the button span both columns.
  - Each field: `Label` (`text-sm font-medium`) above an input `h-12 rounded-xl` with a leading 18px icon (User, User, Mail, Phone, Building2, BookOpen) at `pl-11`. Textarea `min-h-36 rounded-xl`.
  - The button is `h-12 rounded-xl px-6`.
- **360px:** one column; the info and map come first, then the form, and the fields stack.
- **768px:** the form fields go 2 per row; the card stays one column.
- **1280px+:** two columns, as in the reference.
- **States:**
  - Focus: the input shows `ring-ring`.
  - Error: a red `destructive` border and message.
  - Hover: links go `text-primary`.
  - There's no loading state, because nothing is submitted to a server.

## Security
- Client-only form; no API route, no storage. Input is only placed into the `wa.me`/`mailto:` text (URL-encoded by `getWhatsAppLink` / `encodeURIComponent`).
- The `iframe` src is allow-listed to Google Maps hosts. No secrets.

## SEO
- `pageMetadata.contact` and the Home → Contact breadcrumb JSON-LD.

## Acceptance criteria
- `/contact` matches the reference layout at 1280px+ and stacks cleanly at 360px and 768px.
- The email shows `support@genoinelifecare.com` until Studio sets another one. Phone and hours appear only when set.
- Required-field errors show on submit. A valid submit opens WhatsApp in a new tab with the formatted message (or a mailto link without a number).
- The map shows Studio's embed, else the Karimganj fallback.

## Checks
`pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Manual test
1. Run `pnpm dev`, open `/contact` at 360px, 768px and 1280px, and compare with the reference.
2. Submit the form empty, check the errors, fill it in and submit. WhatsApp should open with Name, Phone, Email, Firm, Subject and Message.
3. In Studio → Site settings, add a phone, hours and a map embed URL, then publish. Reload and check they appear.
4. Check the footer shows the support email.
