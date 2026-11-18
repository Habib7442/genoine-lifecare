/**
 * Shorten text to at most `max` characters, cutting at a word boundary (never mid-word),
 * and add "…" when anything was removed.
 */
export function truncateWords(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > 0 ? cut.slice(0, lastSpace) : clean.slice(0, max)).replace(/[\s,+&;:.-]+$/, "");
  return `${base}…`;
}
