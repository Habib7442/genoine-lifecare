import { Info, Settings as SettingsIcon } from "lucide-react";
import type { StructureResolver } from "sanity/structure";

import { ABOUT_PAGE_ID } from "./schemas/about-page";
import { SITE_SETTINGS_ID } from "./schemas/site-settings";

/**
 * Studio sidebar: Site settings opens the single settings document directly,
 * followed by the content lists in the order the client uses them.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id(SITE_SETTINGS_ID)
        .icon(SettingsIcon)
        .child(S.document().schemaType("siteSettings").documentId(SITE_SETTINGS_ID).title("Site settings")),
      S.listItem()
        .title("About page")
        .id(ABOUT_PAGE_ID)
        .icon(Info)
        .child(S.document().schemaType("aboutPage").documentId(ABOUT_PAGE_ID).title("About page")),
      S.divider(),
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("therapeuticArea").title("Therapeutic areas"),
    ]);
