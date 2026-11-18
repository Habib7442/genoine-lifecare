import { defineQuery } from "next-sanity";

/** Site-wide settings (singleton). Contact details, WhatsApp number, social links for SEO. */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    companyName,
    tagline,
    phone,
    email,
    address,
    businessHours,
    mapQuery,
    cin,
    disclaimer,
    distributorCtaText,
    "socialLinks": socialLinks[]{ platform, url }
  }
`);

/** About page singleton (all fields optional; the page falls back to src/content/about.ts). */
export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    eyebrow,
    heading,
    intro,
    storyHeading,
    storyParagraphs,
    "storyImage": select(defined(storyImage.asset) => storyImage{ asset, hotspot, crop, alt }),
    mission,
    vision,
    valuesHeading,
    values[]{ icon, title, text },
    leaders[defined(name)]{
      _key,
      name,
      role,
      bio,
      "photo": select(defined(photo.asset) => photo{ asset, hotspot, crop, alt })
    },
    incorporatedOn
  }
`);

/** About page facts: real counts only. */
export const ABOUT_STATS_QUERY = defineQuery(`{
  "areaCount": count(*[_type == "therapeuticArea" && count(*[_type == "product" && references(^._id)]) > 0]),
  "productCount": count(*[_type == "product"]),
  "forms": array::unique(*[_type == "product" && defined(dosageForm)].dosageForm)
}`);

/** Footer: specialities that have at least one product. */
export const FOOTER_AREAS_QUERY = defineQuery(`
  *[_type == "therapeuticArea" && defined(slug.current) && count(*[_type == "product" && references(^._id)]) > 0]
  | order(coalesce(order, 999) asc, title asc){
    title,
    "slug": slug.current
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

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

/** Fields every product card needs. */
const PRODUCT_CARD_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  composition,
  dosageForm,
  packSize,
  "image": images[0]{ asset, alt },
  "heroImage": heroImage{ asset, alt }
`;

/**
 * Product list for /products. Every filter is optional: pass null to skip it.
 * $q is a GROQ match pattern (e.g. "panto*"), always passed as a parameter.
 */
export const PRODUCT_LIST_QUERY = defineQuery(`
  *[_type == "product" && defined(slug.current)
    && (!defined($area) || therapeuticArea->slug.current == $area)
    && (!defined($category) || category->slug.current == $category)
    && (!defined($form) || dosageForm == $form)
    && (!defined($q) || name match $q || composition match $q)
  ] | order(coalesce(order, 999) asc, name asc){
    ${PRODUCT_CARD_FIELDS}
  }
`);

/** Facet options with product counts for the filter sidebar/sheet. */
export const PRODUCT_FACETS_QUERY = defineQuery(`{
  "areas": *[_type == "therapeuticArea" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc){
    title, "slug": slug.current, "count": count(*[_type == "product" && references(^._id)])
  },
  "categories": *[_type == "category" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc){
    title, "slug": slug.current, "count": count(*[_type == "product" && references(^._id)])
  },
  "forms": *[_type == "product" && defined(dosageForm)].dosageForm
}`);

/** One product for /products/[slug]. */
export const PRODUCT_DETAIL_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    composition,
    strength,
    dosageForm,
    packSize,
    keyUse,
    shortDescription,
    indications,
    usageNote,
    seo,
    "category": category->{ title, "slug": slug.current },
    "therapeuticArea": therapeuticArea->{ _id, title, "slug": slug.current },
    "images": images[]{ _key, asset, alt, hotspot, crop },
    "heroImage": heroImage{ asset, alt }
  }
`);

/** Up to 4 other products from the same therapeutic area. */
export const RELATED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && defined(slug.current) && therapeuticArea._ref == $areaId && _id != $id]
  | order(coalesce(order, 999) asc, name asc)[0...4]{
    ${PRODUCT_CARD_FIELDS}
  }
`);

/** A therapeutic area by slug (heading + metadata for /products?area=). */
export const AREA_BY_SLUG_QUERY = defineQuery(`
  *[_type == "therapeuticArea" && slug.current == $slug][0]{ title, "slug": slug.current, description }
`);

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

/** Home "Featured products": up to 8 featured products with their therapeutic area (for the tabs). */
/** About page products strip: featured first, then the rest (max 8). */
export const SHOWCASE_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && defined(slug.current)]
  | order(coalesce(isFeatured, false) desc, coalesce(order, 999) asc, name asc)[0...8]{
    ${PRODUCT_CARD_FIELDS}
  }
`);

export const FEATURED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && isFeatured == true && defined(slug.current)]
  | order(coalesce(order, 999) asc, name asc)[0...8]{
    ${PRODUCT_CARD_FIELDS},
    "area": therapeuticArea->{ title, "slug": slug.current, "order": coalesce(order, 999) }
  }
`);

/** Product counts for the hero's speciality bottles (by therapeutic area slug). */
export const AREA_PRODUCT_COUNTS_QUERY = defineQuery(`
  *[_type == "therapeuticArea" && slug.current in $slugs]{
    "slug": slug.current,
    "count": count(*[_type == "product" && references(^._id)])
  }
`);
