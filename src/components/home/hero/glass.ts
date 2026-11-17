/**
 * Shared frosted-glass surface for hero panels.
 * A dark slate tint plus a faint text shadow keeps white text readable where
 * the panels sit over the white cloud bed. (text-shadow is inherited by the
 * panel's text; elements with dark text opt out with `text-shadow-none`.)
 */
export const glass =
  "border border-white/40 bg-slate-900/20 md:bg-slate-900/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-lg text-shadow-[0_1px_2px_rgba(0,0,0,0.15)]";
