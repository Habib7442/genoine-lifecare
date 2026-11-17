import type { SchemaTypeDefinition } from "sanity";

import { category } from "./category";
import { product } from "./product";
import { therapeuticArea } from "./therapeutic-area";

export const schemaTypes: SchemaTypeDefinition[] = [
  product,
  category,
  therapeuticArea,
];
