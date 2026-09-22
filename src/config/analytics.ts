import "server-only";

/**
 * Measurement ID GA4, lu depuis une variable serveur SANS préfixe `NEXT_PUBLIC_`.
 *
 * `GA_ID` n'est pas un secret au sens classique (un Measurement ID GA4 doit forcément
 * atteindre le navigateur pour que `gtag.js` fonctionne) : le préfixe `NEXT_PUBLIC_` a été
 * évité uniquement parce que Vercel refusait d'enregistrer une variable "publique" nommée
 * ainsi. `import "server-only"` fait échouer le build si ce module est un jour importé par un
 * Client Component : la valeur ne doit atteindre le client que via une prop transmise
 * explicitement par un Server Component (voir `app/layout.tsx` → `<Analytics ga4Id={...} />`),
 * jamais en la relisant depuis `process.env` dans un fichier "use client" — une variable serveur
 * sans préfixe `NEXT_PUBLIC_` y vaudrait toujours `undefined` (elle n'est pas inlinée dans le
 * bundle client par Next.js).
 */
function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getGa4MeasurementId(): string {
  return readEnv(process.env.GA_ID) ?? "";
}
