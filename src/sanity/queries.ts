import { defineQuery } from "next-sanity";

/** Site-wide settings (singleton). Contact details, WhatsApp number, social links for SEO. */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    phone,
    email,
    whatsappNumber,
    "socialLinks": socialLinks[].url
  }
`);

/** Product slugs + last update, for sitemap.xml. */
export const PRODUCT_SITEMAP_QUERY = defineQuery(`
  *[_type == "product" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`);

/** Therapeutic areas for the home page "Browse by speciality" section, with product counts. */
export const THERAPEUTIC_AREAS_QUERY = defineQuery(`
  *[_type == "therapeuticArea" && defined(slug.current)]
  | order(coalesce(order, 999) asc, title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    shortDescription,
    tint,
    "icon": icon{ asset },
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`);

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
