/**
 * Home "Why Genoine" trust points (PRD §8.1). Plain, factual wording; no numbers.
 * TODO: confirm wording with the client.
 */
export type WhyIcon = "quality" | "range" | "supply" | "support";

export const WHY_GENOINE: { icon: WhyIcon; title: string; text: string }[] = [
  { icon: "quality", title: "Quality assured", text: "Products made by certified manufacturing partners." },
  { icon: "range", title: "Wide range", text: "Medicines across key therapeutic areas and dosage forms." },
  {
    icon: "supply",
    title: "Timely supply",
    text: "Dependable supply for distributors and chemists across the Northeast.",
  },
  {
    icon: "support",
    title: "Distributor support",
    text: "Direct contact with our team for product and order questions.",
  },
];
