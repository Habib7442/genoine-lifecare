import { SiteHeader } from "@/components/layout/site-header";

/**
 * Inner pages (products, and About/Distributor/Contact in Phase 5) get the solid,
 * sticky header. The home page is outside this group: its header sits inside the hero.
 */
export default function PagesLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <SiteHeader variant="solid" className="mx-auto w-full max-w-7xl px-5 md:px-10" />
      </div>
      {children}
    </>
  );
}
