import { Activity as ActivityIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

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
  ],
});
