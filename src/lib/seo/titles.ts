import type { Vehicle } from "@/types";

/**
 * Gabarits de titres des pages véhicule. Règle : le nom du véhicule et la requête principale
 * (« autonomie ») tiennent dans les 55 premiers caractères ; le reste (« recharge, fiche technique »,
 * puis le suffixe « | EVExpert ») peut dépasser sans perdre la requête. Le test `tests/unit/titles.test.ts`
 * vérifie cette limite pour toutes les versions du catalogue.
 */

/** Nom complet d'une version : « Renault 5 E-Tech 52 kWh 150 ch ». */
function fullName(v: Vehicle): string {
  return `${v.brand} ${v.model} ${v.version}`;
}

/** Titre d'une fiche version, ou d'une fiche modèle quand le modèle n'a qu'une version. */
export function vehicleTitleText(v: Vehicle): string {
  return `${fullName(v)} : autonomie, recharge, fiche technique`;
}

/** Titre d'une fiche modèle qui regroupe plusieurs versions. */
export function modelVersionsTitleText(v: Vehicle): string {
  return `${v.brand} ${v.model} : autonomie, recharge et versions`;
}

/** Longueur à partir de laquelle la requête principale doit être terminée. */
export const TITLE_QUERY_LIMIT = 55;

/** Position de fin de la requête principale (nom + « autonomie ») dans un titre de fiche. */
export function queryEnd(title: string): number {
  const i = title.indexOf("autonomie");
  return i === -1 ? Infinity : i + "autonomie".length;
}
