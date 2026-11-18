import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./about-page";
import { category } from "./category";
import { product } from "./product";
import { siteSettings } from "./site-settings";
import { therapeuticArea } from "./therapeutic-area";

export const schemaTypes: SchemaTypeDefinition[] = [
  product,
  category,
  therapeuticArea,
  siteSettings,
  aboutPage,
];
