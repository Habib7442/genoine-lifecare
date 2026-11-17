"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ProductEnquiryCtaProps = {
  /** The inline "Enquire on WhatsApp" button (server-rendered). */
  inline: ReactNode;
  /** The same button for the mobile sticky bar. */
  sticky: ReactNode;
  className?: string;
};

/**
 * Exactly one WhatsApp button visible at a time on mobile product pages:
 * the sticky bottom bar slides up only while the inline button is off-screen.
 * While the bar shows, the body gets bottom padding (globals.css) so it never covers the footer.
 */
export function ProductEnquiryCta({ inline, sticky, className }: ProductEnquiryCtaProps) {
  const inlineRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const el = inlineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showBar) document.body.dataset.stickyBar = "on";
    else delete document.body.dataset.stickyBar;
    return () => {
      delete document.body.dataset.stickyBar;
    };
  }, [showBar]);

  return (
    <>
      <div ref={inlineRef} className={className}>
        {inline}
      </div>

      <div
        aria-hidden={!showBar}
        inert={!showBar}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden",
          "transition-transform duration-200 ease-out",
          showBar ? "translate-y-0" : "translate-y-full",
        )}
      >
        {sticky}
      </div>
    </>
  );
}
