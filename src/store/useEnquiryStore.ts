"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type EnquiryType = "box" | "bulk";

export type EnquiryItem = {
  /** Sanity document `_id` (or a fallback id for placeholder products). */
  id: string;
  slug: string;
  name: string;
  composition: string;
  packSize?: string;
  enquiryType: EnquiryType;
  /** Free text from the enquiry sheet's "Qty / note" field, e.g. "20 boxes". */
  note?: string;
};

type EnquiryState = {
  items: EnquiryItem[];
  /** Adds the item, or replaces it if a product with the same id is already listed. */
  add: (item: EnquiryItem) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Omit<EnquiryItem, "id">>) => void;
  clear: () => void;
};

/**
 * The visitor's enquiry list, persisted to localStorage.
 * The server always sees an empty list: read it only after hydration
 * (see `useHydrated` in `@/lib/use-hydrated`).
 */
export const useEnquiryStore = create<EnquiryState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          return {
            items: exists
              ? state.items.map((i) => (i.id === item.id ? item : i))
              : [...state.items, item],
          };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "genoine-enquiry",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // v1 stored a numeric `quantity`; it now lives in the free-text `note`.
      migrate: (persisted, version) => {
        const state = persisted as { items?: (EnquiryItem & { quantity?: number })[] };
        if (version < 2 && state.items) {
          state.items = state.items.map(({ quantity, ...item }) => ({
            ...item,
            note: item.note ?? (quantity && quantity > 1 ? String(quantity) : undefined),
          }));
        }
        return state as EnquiryState;
      },
    },
  ),
);

/** Selector: the listed item for a product id, if any. */
export const selectItem = (id: string) => (state: EnquiryState) =>
  state.items.find((i) => i.id === id);
