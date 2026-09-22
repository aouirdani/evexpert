import { clsx, type ClassValue } from "clsx";

/**
 * Assemble des classes CSS sans résoudre les conflits Tailwind. À utiliser dans les composants
 * qui sont importés par un Client Component (explorateur, comparateur, calculateurs) : `cn()`
 * (lib/utils.ts) embarque `tailwind-merge`, ~9 Ko gzip de JavaScript envoyés au navigateur.
 * Ces composants n'écrasent jamais une classe par une autre ; sinon, utiliser `cn()` côté serveur.
 */
export const cx = (...inputs: ClassValue[]) => clsx(inputs);
