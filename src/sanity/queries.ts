import { defineQuery } from "next-sanity";

/** Up to 4 featured products for the home page hero. */
export const HERO_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && isFeatured == true && defined(slug.current)]
  | order(coalesce(order, 999) asc, _createdAt desc)[0...4]{
    _id,
    name,
    "slug": slug.current,
    composition,
    dosageForm,
    packSize,
    keyUse,
    heroTagline,
    "therapeuticArea": therapeuticArea->title,
    "therapeuticAreaDescription": therapeuticArea->description,
    "heroImage": heroImage{ asset, alt, hotspot, crop },
    "image": images[0]{ asset, alt, hotspot, crop }
  }
`);
