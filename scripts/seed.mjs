/**
 * Seed the Sanity dataset with clearly-fake sample content (AGENTS.md §8).
 *
 *   pnpm seed           create anything that doesn't exist yet (never overwrites edits)
 *   pnpm seed --force   replace the seeded documents with these defaults
 *
 * Needs SANITY_API_WRITE_TOKEN (Editor) in .env.local. Only touches the fixed _ids below.
 */
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";

import { createClient } from "@sanity/client";

process.loadEnvFile(".env.local");

const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, SANITY_API_WRITE_TOKEN: token } =
  process.env;
if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const force = process.argv.includes("--force");
const client = createClient({ projectId, dataset, token, apiVersion: "2024-10-01", useCdn: false });

/* ---------------------------------- data ---------------------------------- */

const AREAS = [
  { slug: "gastro", title: "Gastro", short: "Acidity, reflux and digestion", desc: "Our range for digestive care.", tint: "#FBF3F7" },
  { slug: "diabetes", title: "Diabetes", short: "Blood sugar management", desc: "Our range for diabetes management.", tint: "#FFF6D6" },
  { slug: "cardiac", title: "Cardiac", short: "Heart and blood pressure care", desc: "Our range for cardiac care.", tint: "#F3EEF8" },
  { slug: "pain-ortho", title: "Pain & Ortho", short: "Pain relief, joints and bones", desc: "Our range for pain and orthopaedics.", tint: "#EEF7F3" },
  { slug: "gynae", title: "Gynae", short: "Women's and reproductive health", desc: "Our range for women's health.", tint: "#FBF3F7" },
  { slug: "paediatric", title: "Paediatric", short: "Care for infants and children", desc: "Our range for children's health.", tint: "#FFF6D6" },
  { slug: "respiratory", title: "Respiratory", short: "Cough, cold and breathing", desc: "Our range for respiratory care.", tint: "#F3EEF8" },
  { slug: "nutraceuticals", title: "Nutraceuticals", short: "Vitamins and daily wellness", desc: "Our range for everyday wellness.", tint: "#EEF7F3" },
];

const CATEGORIES = [
  { slug: "tablets", title: "Tablets" },
  { slug: "capsules", title: "Capsules" },
  { slug: "softgels", title: "Softgels" },
  { slug: "syrups", title: "Syrups" },
];

/** Matches the hero bottles: each sample's form and pack match what is printed on its bottle. */
const PRODUCTS = [
  {
    key: "a", area: "gastro", category: "tablets", image: "public/hero/gastro-care-bottle.webp",
    composition: "Pantoprazole 40mg + Domperidone 10mg", dosageForm: "Tablet", packSize: "30 tablets", keyUse: "Acidity and reflux",
  },
  {
    key: "b", area: "gynae", category: "softgels", image: "public/hero/womens-care-bottle.webp",
    composition: "Omega-3 + Folic Acid + Vitamin D3", dosageForm: "Softgel", packSize: "30 softgels", keyUse: "Women's nutrition",
  },
  {
    key: "c", area: "paediatric", category: "syrups", image: "public/hero/kids-care-syrup.webp",
    composition: "Paracetamol 250mg / 5ml", dosageForm: "Syrup", packSize: "100 ml", keyUse: "Fever in children",
  },
  {
    key: "d", area: "nutraceuticals", category: "capsules", image: "public/hero/wellness-bottle.webp",
    composition: "Multivitamin + Multimineral", dosageForm: "Capsule", packSize: "30 capsules", keyUse: "Daily nutrition",
  },
];

/* --------------------------------- helpers -------------------------------- */

/** Upload a local image (Sanity de-duplicates identical files) and return an image field value. */
async function imageField(file, alt) {
  if (!existsSync(file)) {
    console.warn(`  ! missing ${file}, skipping image`);
    return undefined;
  }
  const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
}

const ref = (id) => ({ _type: "reference", _ref: id });
const slug = (current) => ({ _type: "slug", current });

/* ---------------------------------- build --------------------------------- */

async function buildDocuments() {
  const docs = [];

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: "Genoine Lifecare Private Limited",
    tagline: "Quality medicines you can trust",
    cin: "U21001AS2026PTC030380",
    disclaimer:
      "Products are for use under medical supervision. Consult a registered medical practitioner before use.",
    // Phone, email, WhatsApp, address and hours are left empty on purpose: never invent contact details.
  });

  for (const [index, area] of AREAS.entries()) {
    console.log(`  area: ${area.title}`);
    docs.push({
      _id: `therapeuticArea-${area.slug}`,
      _type: "therapeuticArea",
      title: area.title,
      slug: slug(area.slug),
      description: area.desc,
      shortDescription: area.short,
      tint: area.tint,
      order: index + 1,
      icon: await imageField(`public/specialities/${area.slug}.webp`, `${area.title} illustration`),
    });
  }

  for (const [index, category] of CATEGORIES.entries()) {
    docs.push({
      _id: `category-${category.slug}`,
      _type: "category",
      title: category.title,
      slug: slug(category.slug),
      order: index + 1,
    });
  }

  for (const [index, product] of PRODUCTS.entries()) {
    const name = `Sample Product ${product.key.toUpperCase()}`;
    console.log(`  product: ${name}`);
    const image = await imageField(product.image, `${name} bottle`);
    docs.push({
      _id: `product-sample-${product.key}`,
      _type: "product",
      name,
      slug: slug(`sample-product-${product.key}`),
      composition: product.composition,
      dosageForm: product.dosageForm,
      packSize: product.packSize,
      keyUse: product.keyUse,
      category: ref(`category-${product.category}`),
      therapeuticArea: ref(`therapeuticArea-${product.area}`),
      shortDescription: "Sample product for layout testing. Replace with real product details.",
      images: image ? [{ ...image, _key: "main" }] : [],
      heroImage: image,
      isFeatured: true,
      isNewLaunch: index < 2,
      order: index + 1,
    });
  }

  return docs;
}

/* ----------------------------------- run ---------------------------------- */

console.log(`Seeding ${projectId}/${dataset}${force ? " (--force: replacing)" : ""}…`);
const docs = await buildDocuments();
const tx = client.transaction();
for (const doc of docs) {
  if (force) tx.createOrReplace(doc);
  else tx.createIfNotExists(doc);
}
await tx.commit();
console.log(`Done: ${docs.length} documents ${force ? "written" : "ensured"} (existing ones ${force ? "replaced" : "left untouched"}).`);
