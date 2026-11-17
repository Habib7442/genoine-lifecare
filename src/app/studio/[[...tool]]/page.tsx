/**
 * Embedded Sanity Studio at /studio.
 * This route sits outside the (site) route group, so it does not get the
 * site header/footer — only the bare root layout.
 */
import { NextStudio } from "next-sanity/studio";

import { isSanityConfigured } from "@/sanity/env";

import config from "../../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

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
