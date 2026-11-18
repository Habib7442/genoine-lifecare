/**
 * About page fallback copy (user-supplied). Every field can be overridden in
 * Studio → About page; empty Studio fields fall back to these.
 */
export type AboutValueIcon = "quality" | "integrity" | "partnership" | "reliability";

export type AboutValue = { icon: AboutValueIcon; title: string; text: string };

export const ABOUT_FALLBACK = {
  eyebrow: "About us",
  heading: "Committed to quality care",
  intro:
    "Genoine Lifecare is a pharmaceutical company based in Assam, bringing quality medicines to doctors, chemists and distributors across the region.",
  storyHeading: "Our story",
  storyParagraphs: [
    "Founded in 2026 in Karimganj, Assam, Genoine Lifecare was started with a simple aim: to make reliable, quality medicines easily available across the Northeast.",
    "We work with certified manufacturing partners and focus on key therapeutic areas, so healthcare professionals can trust every product that carries our name.",
  ],
  storyImage: {
    src: "/about/story.webp",
    alt: "Shelves of neatly stored medicine boxes in a bright, clean storeroom",
  },
  mission: "To deliver quality, affordable medicines that doctors and patients can rely on.",
  vision: "To become a trusted pharmaceutical name across the Northeast and beyond.",
  valuesHeading: "What we stand for",
  values: [
    { icon: "quality", title: "Quality first", text: "Every product meets strict quality standards." },
    { icon: "integrity", title: "Integrity", text: "Honest information, no exaggerated claims." },
    { icon: "partnership", title: "Partnership", text: "We grow together with our distributors and chemists." },
    { icon: "reliability", title: "Reliability", text: "Dependable supply you can plan around." },
  ] as AboutValue[],
};
