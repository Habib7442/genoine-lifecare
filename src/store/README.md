# src/store

Client-side state with [Zustand](https://zustand.docs.pmnd.rs/).

Use this folder for small, UI-level stores that several client components share,
for example the enquiry list (products a visitor wants to ask about) and UI state
such as an open enquiry sheet.

Guidelines:
- One store per file, named `use<Name>Store.ts` (e.g. `useEnquiryStore.ts`).
- Stores are client-only: import them only from `"use client"` components.
- Content from Sanity is not stored here; fetch it in Server Components.
- Use the `persist` middleware only for data that should survive a reload.
