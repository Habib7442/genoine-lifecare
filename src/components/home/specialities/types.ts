/** Plain, serialisable therapeutic area data for the specialities grid. */
export type SpecialityArea = {
  id: string;
  title: string;
  slug: string;
  /** Short line under the name on the tile. */
  description?: string;
  /** Hex colour from Sanity; when missing, tiles rotate through the tint tokens. */
  tint?: string;
  iconSrc?: string;
  /** Undefined for fallback content (no Sanity data yet). */
  productCount?: number;
};
