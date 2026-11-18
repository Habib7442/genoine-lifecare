/**
 * Remove leftover sample data from Sanity now that real products exist.
 *
 *   pnpm seed:clean
 *
 * Deletes:
 *  - sample product documents (ids `product-sample-*`, published and drafts)
 *  - uploaded images that no document references any more (e.g. old sample bottle images)
 * Never touches real products, therapeutic areas, categories or Site settings.
 * Needs SANITY_API_WRITE_TOKEN in .env.local.
 */
import { createClient } from "@sanity/client";

process.loadEnvFile(".env.local");

const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, SANITY_API_WRITE_TOKEN: token } =
  process.env;
if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-10-01", useCdn: false });

// 1. Sample product documents.
const sampleIds = await client.fetch(
  `*[_type == "product" && (_id match "product-sample-*" || _id match "drafts.product-sample-*")]._id`,
);
if (sampleIds.length) {
  const tx = client.transaction();
  for (const id of sampleIds) tx.delete(id);
  await tx.commit();
}
console.log(`Sample products deleted: ${sampleIds.length}`);

// 2. Images nothing references any more (run after step 1 so freed images are included).
const orphanAssets = await client.fetch(
  `*[_type == "sanity.imageAsset" && count(*[references(^._id)]) == 0]{ _id, originalFilename }`,
);
for (const asset of orphanAssets) {
  await client.delete(asset._id);
  console.log(`  deleted unused image: ${asset.originalFilename ?? asset._id}`);
}
console.log(`Unused images deleted: ${orphanAssets.length}`);

const remaining = await client.fetch(`*[_type == "product"] | order(order asc).name`);
console.log(`Products remaining: ${remaining.join(", ")}`);
