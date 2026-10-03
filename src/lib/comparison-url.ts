/**
 * Lecture du paramètre `?v=id1,id2,id3` du comparateur (lien partagé, « Ma sélection »).
 * Pur : testable sans navigateur. La page est statique, la lecture se fait côté client.
 */
export const MAX_COMPARED = 3;

/** Dédoublonné (un id répété ne compare pas un véhicule avec lui-même) et plafonné à 3. */
export function parseRequestedIds(v: string | null | undefined): string[] {
  return v ? [...new Set(v.split(",").filter(Boolean))].slice(0, MAX_COMPARED) : [];
}

/**
 * Identifiants de départ. Les inconnus (lien copié après une refonte du catalogue) sont ignorés.
 * Un seul identifiant valide est repris tel quel (le formulaire invite à en choisir un second) ;
 * aucun identifiant valide → paire par défaut.
 */
export function resolveInitialIds(v: string | null | undefined, knownIds: Iterable<string>, defaultIds: string[]): string[] {
  const known = new Set(knownIds);
  const valid = parseRequestedIds(v).filter((id) => known.has(id));
  return valid.length > 0 ? valid : defaultIds;
}
