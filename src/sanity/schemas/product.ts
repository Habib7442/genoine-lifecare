import { Package as PackageIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const DOSAGE_FORMS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Suspension",
  "Ointment/Cream",
  "Drops",
  "Sachet/Powder",
  "Softgel",
] as const;

export type DosageForm = (typeof DOSAGE_FORMS)[number];

/** Image with required alt text. Reused for gallery and hero images. */
const altField = defineField({
  name: "alt",
  title: "Alternative text",
  type: "string",
  description:
    "Describe the image for screen readers, e.g. “Product A tablet strip pack”.",
  validation: (rule) => rule.required(),
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Images" },
    { name: "home", title: "Home page" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      description: "Used in the web address. Click “Generate”.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "composition",
      title: "Composition",
      type: "string",
      group: "details",
      description: "For example: Pantoprazole 40mg + Domperidone 30mg",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "strength",
      title: "Strength",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "dosageForm",
      title: "Dosage form",
      type: "string",
      group: "details",
      options: {
        list: DOSAGE_FORMS.map((form) => ({ title: form, value: form })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "packSize",
      title: "Pack size",
      type: "string",
      group: "details",
      description: "For example: 10x10 Alu-Alu",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "details",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "therapeuticArea",
      title: "Therapeutic area",
      type: "reference",
      group: "details",
      to: [{ type: "therapeuticArea" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      group: "details",
    }),
    defineField({
      name: "indications",
      title: "Indications",
      type: "array",
      group: "details",
      description: "One indication per line. Plain facts only, no promotional claims.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "usageNote",
      title: "Usage note",
      type: "text",
      rows: 3,
      group: "details",
    }),
    defineField({
      name: "images",
      title: "Product images",
      type: "array",
      group: "media",
      description: "The first image is used on product cards.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [altField],
        }),
      ],
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on home page",
      type: "boolean",
      group: "home",
      description: "Featured products appear in the home page hero and featured grid.",
      initialValue: false,
    }),
    defineField({
      name: "isNewLaunch",
      title: "New launch",
      type: "boolean",
      group: "home",
      description: "Shows the product in the “New launches” strip.",
      initialValue: false,
    }),
    defineField({
      name: "heroImage",
      title: "Hero image (cut-out)",
      type: "image",
      group: "home",
      description:
        "Optional. A transparent PNG cut-out of the pack, shown large in the home page hero. If empty, the first product image is used.",
      options: { accept: "image/png,image/webp" },
      fields: [altField],
    }),
    defineField({
      name: "keyUse",
      title: "Key use",
      type: "string",
      group: "home",
      description:
        "Optional. A short plain-language use shown with the product in the home page hero, e.g. “Nerve pain relief”. Plain facts only, no promotional claims.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "heroTagline",
      title: "Hero tagline",
      type: "string",
      group: "home",
      description:
        "Optional. Short line shown under the hero headline when this product is shown. If empty, the product name is used.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      group: "details",
      description: "Lower numbers appear first.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      description: "Optional. If empty, the product name and composition are used.",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.max(160),
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "composition",
      media: "images.0",
    },
  },
});
