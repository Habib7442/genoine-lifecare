import { Toaster } from "@/components/ui/sonner";

/**
 * Main site layout (footer, toasts). Every public page lives in the (site)
 * route group; /studio is deliberately outside it.
 *
 * The header is not rendered here: the home page places <SiteHeader variant="overlay" />
 * inside its hero, and other pages will add <SiteHeader variant="solid" /> (Phase 5).
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <main className="flex-1">{children}</main>

      {/* TODO: replace with <SiteFooter /> from @/components/layout */}
      <footer className="border-t bg-brand-tint">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          © Genoine Lifecare Private Limited
        </div>
      </footer>

      <Toaster />
    </>
  );
}
