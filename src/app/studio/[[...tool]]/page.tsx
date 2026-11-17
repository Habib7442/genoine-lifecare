/**
 * Embedded Sanity Studio at /studio.
 * This route sits outside the (site) route group, so it does not get the
 * site header/footer — only the bare root layout.
 */
import type { Metadata } from "next";
import { NextStudio, metadata as studioMetadata } from "next-sanity/studio";

import { isSanityConfigured } from "@/sanity/env";

import config from "../../../../sanity.config";

export { viewport } from "next-sanity/studio";

/** Never index the Studio (also disallowed in robots.txt). */
export const metadata: Metadata = {
  ...studioMetadata,
  title: "Studio",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function StudioPage() {
  if (!isSanityConfigured) return <StudioNotConfigured />;
  return <NextStudio config={config} />;
}

function StudioNotConfigured() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="flex max-w-lg flex-col gap-3">
        <h1 className="text-2xl font-semibold text-primary">Sanity is not configured</h1>
        <p className="text-muted-foreground">
          Missing environment variable <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>. Copy{" "}
          <code>.env.example</code> to <code>.env.local</code>, fill in your Sanity project ID,
          and restart the dev server.
        </p>
      </div>
    </main>
  );
}
