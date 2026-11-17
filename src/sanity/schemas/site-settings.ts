import { Settings as SettingsIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

/** The one and only settings document has this fixed id (see structure.ts and sanity.config.ts). */
export const SITE_SETTINGS_ID = "siteSettings";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: SettingsIcon,
  groups: [
    { name: "company", title: "Company", default: true },
    { name: "contact", title: "Contact" },
    { name: "legal", title: "Legal" },
  ],
  fields: [
    defineField({
      name: "companyName",
      title: "Company name",
      type: "string",
      group: "company",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "company",
      description: "Short line used in the header and search results, e.g. “Quality medicines you can trust”.",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
      description: "As it should be shown, e.g. +91 98765 43210.",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description:
        "Digits only, with country code, no spaces or +. Example: 919876543210. All WhatsApp buttons on the site use this number.",
      validation: (rule) =>
        rule.regex(/^\d{10,15}$/, { name: "digits only" }).error("Use digits only, with country code (e.g. 919876543210)."),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "address",
      title: "Office address",
      type: "text",
      rows: 3,
      group: "contact",
    }),
    defineField({
      name: "businessHours",
      title: "Business hours",
      type: "string",
      group: "contact",
      description: "For example: Mon–Sat, 10:00 am – 6:00 pm",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
      group: "contact",
      description: "In Google Maps: Share → Embed a map → copy only the link inside src=\"…\".",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: { list: ["Facebook", "Instagram", "LinkedIn", "YouTube", "X (Twitter)"] },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Profile URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "cin",
      title: "CIN",
      type: "string",
      group: "legal",
      description: "Corporate Identification Number, shown in the footer.",
    }),
    defineField({
      name: "disclaimer",
      title: "Medical disclaimer",
      type: "text",
      rows: 3,
      group: "legal",
      description: "Shown in the footer and on product pages. Keep it plain and factual.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
