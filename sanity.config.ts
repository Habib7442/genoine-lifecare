"use client";

/**
 * Sanity Studio configuration, mounted at /studio
 * (see src/app/studio/[[...tool]]/page.tsx).
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Genoine Lifecare",
  basePath: "/studio",
  // The Studio page renders a setup message instead of the Studio when this is empty.
  projectId: projectId || "not-configured",
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool(),
    // GROQ playground inside the Studio
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
