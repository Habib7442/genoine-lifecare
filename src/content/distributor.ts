/**
 * Distributor page copy. Plain, factual claims only (no margins, offers or numbers).
 * TODO: confirm benefit wording with the client.
 */
export type DistributorBenefitIcon = "range" | "quality" | "communication" | "region";

export const DISTRIBUTOR_BENEFITS: { icon: DistributorBenefitIcon; title: string; text: string }[] = [
  {
    icon: "range",
    title: "Focused range",
    text: "Medicines across key therapeutic areas, chosen for everyday prescriptions.",
  },
  { icon: "quality", title: "Quality-assured products", text: "Made by certified manufacturing partners." },
  {
    icon: "communication",
    title: "Direct communication",
    text: "Talk to our team directly on WhatsApp or phone.",
  },
  {
    icon: "region",
    title: "Regional focus",
    text: "Based in Assam, working with partners across the Northeast.",
  },
];

export const DISTRIBUTOR_STEPS: { title: string; text: string }[] = [
  { title: "Send your details", text: "Fill in the short form on this page." },
  { title: "We get in touch", text: "Our team contacts you to discuss the range and your area." },
  { title: "Start working together", text: "Agree the products and supply that suit your business." },
];

export const DISTRIBUTOR_STATES = [
  "Assam",
  "Arunachal Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim",
  "West Bengal",
  "Other",
] as const;

export const BUSINESS_TYPES = [
  "Distributor",
  "Stockist",
  "Retail chemist",
  "Hospital / clinic supply",
  "Other",
] as const;
