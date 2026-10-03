/**
 * Bahasa Indonesia for the interface: the chrome (nav, footer, tool-page
 * furniture) and every string scripts build at runtime. Same contract as the
 * Portuguese tables in ui.ts and ui-runtime-pt.ts — the English string is the
 * key, {0}, {1}… are filled after lookup, and a missing entry degrades to
 * English rather than to a raw key.
 *
 * Register: `Anda` and the plain imperative ("Pilih file", "Unduh"), as
 * iLovePDF, Google and the Indonesian government portals write it. Product
 * words Indonesians use as-is stay English: file, PDF, Word, Excel, online.
 */
export const idUi: Record<string, string> = {};
export const idRuntime: Record<string, string> = {};
