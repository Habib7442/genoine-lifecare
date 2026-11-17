# 03 — Custom scrollbar

## Goal

Give the site's page scrollbar a slim, on-brand look (magenta thumb on the pink tint track), without affecting Sanity Studio or mobile.

## Read / inspected

- `AGENTS.md` §3 colour rules (tokens only, no hex in components)
- `src/app/globals.css` (brand tokens, base layer)
- `src/components/home/hero/hero-switcher.tsx` (already hides its own scrollbar; must stay hidden)

## Decisions

1. **Page scrollbar only.** Styles apply to the page (`html`) and to an opt-in `scrollbar-brand` utility for inner scroll areas (e.g. the future enquiry sheet). No global `*` selector: Sanity Studio (`/studio`) has its own scroll panes and must keep its native scrollbars.
2. **Look (light mode only):**
   - Width ~10px on desktop (slim, still easy to grab).
   - Track: `--brand-tint` (#FBF3F7).
   - Thumb: `--brand-primary` at ~55% opacity, fully opaque on hover (`--brand-primary-light`), rounded, with a 2px track-coloured border so it looks inset.
   - No arrow buttons.
3. **Browsers:** WebKit/Blink via `::-webkit-scrollbar*`; Firefox via `scrollbar-width: thin` + `scrollbar-color`. Chrome 121+ also reads `scrollbar-color`, so the WebKit rules are scoped with `@supports not (scrollbar-color: auto)`. That way Chrome doesn't mix both systems.
4. **Mobile:** phones use overlay scrollbars; nothing changes there.
5. The colours come from the existing tokens in `globals.css` (`color-mix` for the translucent thumb), so a palette change updates the scrollbar too.

## Files

- `src/app/globals.css`: scrollbar rules + `scrollbar-brand` utility.
- `AGENTS.md` §3: one line noting the utility.

## Acceptance criteria

- [ ] On desktop Chrome/Edge and Firefox, the page scrollbar is slim, magenta on pink tint, darker on hover.
- [ ] `/studio` keeps its default scrollbars.
- [ ] The hero thumbnail strip still has no visible scrollbar.
- [ ] No hex values outside the token block.

## Checks

`pnpm lint`, `pnpm typecheck`.

## Manual test

1. `pnpm dev` → http://localhost:3000 on desktop: scroll down; hover the scrollbar thumb.
2. Open in Firefox too.
3. Open http://localhost:3000/studio: scrollbars look native.
