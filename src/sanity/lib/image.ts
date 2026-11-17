import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({
  projectId: projectId || "not-configured",
  dataset,
});

/**
 * Build a cdn.sanity.io URL for an image field.
 * @example urlFor(product.image).width(800).auto("format").url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
