/** Plain, serialisable product data for cards (server → client safe). */
export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  composition: string;
  dosageForm?: string;
  packSize?: string;
  image?: { src: string; alt: string };
};

export type FacetOption = { label: string; value: string; count: number };

export type ProductFacets = {
  areas: FacetOption[];
  categories: FacetOption[];
  forms: FacetOption[];
};

export type GalleryImage = { key: string; src: string; thumb: string; alt: string };

export type ProductDetail = ProductCardData & {
  strength?: string;
  keyUse?: string;
  shortDescription?: string;
  indications: string[];
  usageNote?: string;
  category?: { title: string; slug: string };
  therapeuticArea?: { id: string; title: string; slug: string };
  gallery: GalleryImage[];
  seo?: { title?: string | null; description?: string | null } | null;
  /** First image as a Sanity source (for the 1200×630 share image). */
  imageSource?: { asset?: { _ref: string } } | null;
};
