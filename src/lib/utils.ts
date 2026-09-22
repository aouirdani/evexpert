import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Les tailles typographiques du design system (text-display, text-h1…) doivent être
// reconnues comme des tailles, sinon twMerge les prendrait pour des couleurs et
// supprimerait une couleur de texte déclarée après elles.
const twMerge = /* @__PURE__ */ extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "h3", "dek", "caption", "data-xl", "data-lg", "data-md"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatage : voir lib/format.ts (sans tailwind-merge, importable depuis un Client Component).
export * from "./format";
