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
import { structure } from "./src/sanity/structure";

/** Singleton types: one fixed document, opened from the sidebar. */
const SINGLETON_TYPES = new Set(["siteSettings", "aboutPage"]);
/** Actions allowed on singletons (no duplicate, delete or unpublish). */
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: "Genoine Lifecare",
  basePath: "/studio",
  // The Studio page renders a setup message instead of the Studio when this is empty.
  projectId: projectId || "not-configured",
  dataset,
  schema: {
    types: schemaTypes,
    // Hide singletons from "Create new".
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    // GROQ playground inside the Studio
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
