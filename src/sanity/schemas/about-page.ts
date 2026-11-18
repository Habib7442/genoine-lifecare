import { Info } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

/** The one and only About page document has this fixed id (see structure.ts and sanity.config.ts). */
export const ABOUT_PAGE_ID = "aboutPage";

const EMPTY_HINT = "Leave empty to use the standard text.";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  icon: Info,
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "story", title: "Story" },
    { name: "mission", title: "Mission & vision" },
    { name: "values", title: "Values" },
    { name: "leadership", title: "Leadership" },
    { name: "company", title: "Company" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label above the heading",
      type: "string",
      group: "header",
      description: EMPTY_HINT,
    }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "header", description: EMPTY_HINT }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      group: "header",
      description: EMPTY_HINT,
    }),
    defineField({
      name: "storyHeading",
      title: "Story heading",
      type: "string",
      group: "story",
      description: EMPTY_HINT,
    }),
    defineField({
      name: "storyParagraphs",
      title: "Story paragraphs",
      type: "array",
      group: "story",
      description: `Up to 3 short paragraphs. ${EMPTY_HINT}`,
      of: [defineArrayMember({ type: "text", rows: 4 })],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "storyImage",
      title: "Story image",
      type: "image",
      group: "story",
      description: "Shown next to the story (portrait works best). Leave empty to use the standard photo.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Image description",
          type: "string",
          description: "Describe the image for screen readers.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({ name: "mission", title: "Mission", type: "text", rows: 2, group: "mission", description: EMPTY_HINT }),
    defineField({ name: "vision", title: "Vision", type: "text", rows: 2, group: "mission", description: EMPTY_HINT }),
    defineField({
      name: "valuesHeading",
      title: "Values heading",
      type: "string",
      group: "values",
      description: EMPTY_HINT,
    }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      group: "values",
      description: `Up to 4 cards. ${EMPTY_HINT}`,
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "value",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Shield (quality)", value: "quality" },
                  { title: "Handshake (integrity)", value: "integrity" },
                  { title: "People (partnership)", value: "partnership" },
                  { title: "Truck (reliability)", value: "reliability" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "text",
              title: "Text",
              type: "string",
              validation: (rule) => rule.required().max(90),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "leaders",
      title: "Leadership",
      type: "array",
      group: "leadership",
      description: "People shown under “Our leadership”. The section is hidden while this list is empty.",
      of: [
        defineArrayMember({
          type: "object",
          name: "leader",
          fields: [
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Photo description",
                  type: "string",
                  description: "Describe the photo for screen readers, e.g. “Portrait of the Managing Director”.",
                  validation: (rule) => rule.required(),
                }),
              ],
            }),
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "role", title: "Role", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "bio",
              title: "Short background",
              type: "text",
              rows: 2,
              description: "One or two lines.",
              validation: (rule) => rule.max(200),
            }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "photo" } },
        }),
      ],
    }),
    defineField({
      name: "incorporatedOn",
      title: "Date of incorporation",
      type: "date",
      group: "company",
      description: "From the certificate of incorporation. Leave empty to use 4 May 2026.",
    }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
