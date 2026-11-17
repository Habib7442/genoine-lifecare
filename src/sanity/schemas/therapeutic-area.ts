import { Activity as ActivityIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

/** Tile background colours for the home page "Browse by speciality" section. */
export const AREA_TINTS = [
  { title: "Blush", value: "#FBF3F7" },
  { title: "Pale yellow", value: "#FFF6D6" },
  { title: "Pale lilac", value: "#F3EEF8" },
  { title: "Light mint", value: "#EEF7F3" },
] as const;

export const therapeuticArea = defineType({
  name: "therapeuticArea",
  title: "Therapeutic area",
  type: "document",
  icon: ActivityIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "For example: Gastro, Diabetes, Cardiac.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used in the web address. Click “Generate”.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string",
      description:
        "One line shown on the home page, e.g. “Our range for digestive care.” Plain facts only, no promotional claims.",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "shortDescription",
      title: "Tile description",
      type: "string",
      description:
        "Optional. A few words shown on the home page speciality tile, e.g. “Acidity, reflux and digestion”. If empty, the short description above is used.",
      validation: (rule) => rule.max(50),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description:
        "Optional. A square 3D icon with a transparent background (PNG or WebP), shown on the home page tile.",
      options: { accept: "image/png,image/webp" },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Describe the icon, e.g. “Stomach illustration”.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "tint",
      title: "Tile colour",
      type: "string",
      description: "Optional. Background colour of the home page tile. If empty, colours rotate automatically.",
      options: {
        list: AREA_TINTS.map((tint) => ({ title: tint.title, value: tint.value })),
        layout: "radio",
      },
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
