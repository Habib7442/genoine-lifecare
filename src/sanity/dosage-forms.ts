/** Fixed dosage form list (product schema + site). Plain module so app code needn't import the schema. */
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
