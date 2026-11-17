"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useRef, useState, type ReactNode } from "react";


import { HeroAreaCard } from "./hero-area-card";
import { HeroBubbles } from "./hero-bubbles";
import { HERO_HEADLINE, HERO_PRODUCTS_LINK } from "./hero-content";
import { HeroProductImage } from "./hero-product";
import { HeroSwitcher } from "./hero-switcher";
import { HeroTrustPanel } from "./hero-trust-panel";
import { EASE_OUT, HERO_TIMING } from "./motion";
import { SwapIn } from "./swap-in";
import type { HeroProduct } from "./types";

type HeroShowcaseProps = {
  products: HeroProduct[];
  /** Server-rendered header, placed inside the card on top of the background. */
  header: ReactNode;
  /** Server-rendered sky background (<picture>). */
  background: ReactNode;
  /** "Contact us" target: a wa.me link when a WhatsApp number is set, otherwise /contact. */
  contactHref: string;
};

export function HeroShowcase({ products, header, background, contactHref }: HeroShowcaseProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [hasSwitched, setHasSwitched] = useState(false);

  const cardRef = useRef<HTMLElement>(null);

  const product = products[activeIndex];
  const meta = [product.dosageForm, product.packSize].filter(Boolean).join(" · ");

  const contactIsWhatsApp = contactHref.startsWith("https://wa.me/");

  const select = useCallback((index: number) => {
    setActiveIndex(index);
    setHasSwitched(true);
  }, []);

  const advance = useCallback(() => {
    select((activeIndex + 1) % products.length);
  }, [activeIndex, products.length, select]);

  // Panels fade up after the product has appeared.
  const panelIn = (order: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: HERO_TIMING.panels + order * 0.08, ease: EASE_OUT },
  });

  return (
    // "user": transform animations (float, slides, scale) are skipped when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <div className="p-3 md:p-4">
        <motion.section
          ref={cardRef}
          aria-label="Featured products"
          className="relative flex min-h-[calc(100svh-1.5rem)] flex-col gap-5 overflow-hidden rounded-[32px] max-md:text-shadow-[0_1px_3px_rgba(0,0,0,0.25)] bg-hero-sky md:min-h-[calc(100svh-2rem)] lg:block lg:h-[calc(100svh-2rem)] lg:min-h-[720px]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onFocus={() => setHasFocusWithin(true)}
          onBlur={(event) => {
            if (!cardRef.current?.contains(event.relatedTarget as Node | null)) {
              setHasFocusWithin(false);
            }
          }}
        >
          {/* Sky background with a slow drift, plus a light top-left shade for the headline */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 motion-safe:animate-hero-drift">{background}</div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.14),transparent_55%)]" />
            {/* Mobile: soft scrim over the lower card so text stays readable over the clouds */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_35%,rgba(15,40,80,0.15))] md:hidden" />
          </div>
          <HeroBubbles />

          {/* Header: frosted bar inset 16px from the card edges */}
          <div className="relative z-30 p-3 md:p-4">{header}</div>

          {/* Headline + product info. Below lg this wrapper is `display: contents`, so its children
              join the card's flex column and `order-*` can place the bottle between trust and info. */}
          <div className="contents lg:absolute lg:top-[112px] lg:left-10 lg:z-10 lg:block">
            <h1 className="relative z-10 order-1 px-5 text-[40px] leading-none font-medium tracking-tight text-white uppercase md:px-10 md:text-[clamp(2.5rem,5vw,5rem)] md:leading-[0.95] lg:px-0">
              {HERO_HEADLINE.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: HERO_TIMING.headline + index * 0.12, ease: EASE_OUT }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Mobile: trust pill right under the headline (desktop shows it bottom-left) */}
            <motion.div className="relative z-10 order-2 px-5 md:hidden" {...panelIn(0)}>
              <HeroTrustPanel compact />
            </motion.div>

            <div className="relative z-10 order-4 px-5 md:px-10 lg:mt-6 lg:min-h-[92px] lg:max-w-[300px] lg:px-0 xl:max-w-[360px]">
              {/* Mobile: subtle glass card so the text stays readable over the sky and clouds */}
              <div className="max-md:rounded-2xl max-md:border max-md:border-white/30 max-md:bg-slate-900/25 max-md:p-4 max-md:backdrop-blur-md">
                <SwapIn key={product.id} animate={hasSwitched} className="flex flex-col items-start gap-1">
                  <p className="text-lg leading-snug font-medium text-white xl:text-xl">{product.composition}</p>
                  {meta && <p className="text-xs tracking-wide text-white/90 uppercase">{meta}</p>}
                  {product.keyUse && (
                    <p className="mt-1 rounded-full border border-white/50 bg-white/25 px-3 py-1 text-sm font-medium text-white backdrop-blur-md text-shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
                      {product.keyUse}
                    </p>
                  )}
                </SwapIn>
              </div>
            </div>

            {/* Actions: two equal columns on mobile (stacked under 360px), inline on desktop */}
            <div className="relative z-10 order-5 grid grid-cols-2 gap-3 px-5 max-[339px]:grid-cols-1 md:max-w-[440px] md:px-10 lg:mt-5 lg:flex lg:max-w-none lg:px-0">
              <Link
                href={HERO_PRODUCTS_LINK.href}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-[15px] font-medium whitespace-nowrap text-primary-foreground transition-colors outline-none hover:bg-brand-primary-light focus-visible:ring-2 focus-visible:ring-white lg:h-11 lg:w-auto lg:px-5 lg:text-sm"
              >
                {/* One centred group; shorter label on very narrow screens */}
                <span className="max-[379px]:hidden">View products</span>
                <span className="min-[380px]:hidden">Products</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
              <a
                href={contactHref}
                {...(contactIsWhatsApp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-[15px] font-medium whitespace-nowrap text-primary transition-colors outline-none text-shadow-none hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white lg:h-11 lg:w-auto lg:px-5 lg:text-sm"
              >
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                Contact us
              </a>
            </div>
          </div>

          {/* Bottle: after the trust pill on mobile; centred, base just above the cloud bed on desktop */}
          <div className="relative z-10 order-3 flex justify-center pb-3 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-[20%] lg:h-[56%] lg:pb-0">
            <motion.div
              className="lg:h-full"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: HERO_TIMING.product, ease: EASE_OUT }}
            >
              <HeroProductImage
                product={product}
                float={!reduceMotion}
                eager={activeIndex === 0}
                animateSwap={hasSwitched}
                className="aspect-[3/4] w-[min(64vw,300px)] lg:h-full lg:w-auto"
              />
            </motion.div>
          </div>

          {/* Right: therapeutic area card (desktop only) */}
          <motion.div
            className="absolute top-[60%] right-10 z-10 hidden -translate-y-1/2 lg:block xl:top-[40%]"
            {...panelIn(3)}
          >
            <HeroAreaCard product={product} animateSwap={hasSwitched} />
          </motion.div>

          {/* Thumbnails: after the bottle on mobile, bottom-right on desktop */}
          <motion.div
            className="relative z-10 order-6 px-5 pb-5 md:px-10 md:pb-0 lg:absolute lg:right-10 lg:bottom-6 lg:px-0"
            {...panelIn(2)}
          >
            <HeroSwitcher
              products={products}
              activeIndex={activeIndex}
              onSelect={select}
              autoRotate={products.length > 1 && !reduceMotion}
              paused={isHovered || hasFocusWithin}
              onAdvance={advance}
              className="w-fit max-w-full"
            />
          </motion.div>

          {/* Trust pill: bottom-left from md (mobile shows the compact one under the headline) */}
          <motion.div
            className="relative z-10 order-7 hidden px-10 pb-5 md:block lg:absolute lg:bottom-6 lg:left-10 lg:px-0 lg:pb-0"
            {...panelIn(0)}
          >
            <HeroTrustPanel />
          </motion.div>
        </motion.section>
      </div>
    </MotionConfig>
  );
}
