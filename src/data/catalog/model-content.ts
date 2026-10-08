import type { Vehicle } from "@/types";
import { formatNumber } from "@/lib/format";

/**
 * Texte rédigé par modèle (lot SEO « enrichissement des fiches modèle »), 150 à 250 mots :
 * positionnement, ce qui distingue le modèle dans notre catalogue, pour quel usage, limites.
 *
 * Règles (retour du 2026-10-05, après la première passe de 5 modèles) :
 * - aucune mention de prix (le prix reste un sujet de /methodologie uniquement) ;
 * - les comparaisons se font avec UN concurrent direct désigné à l'avance (même carrosserie,
 *   taille de batterie comparable — voir COMPARATOR), jamais avec les extrêmes du catalogue ;
 *   chaque modèle comparateur n'est cité que dans 3 fiches au plus (vérifié par construction :
 *   COMPARATOR a été généré par un algorithme glouton plafonné à 3 réutilisations) ;
 * - un superlatif ou une position relative n'est écrit que si `rel()`/`isExtreme()` le confirme au
 *   moment du rendu ; sinon la phrase reste neutre (pas de superlatif en dur) ;
 * - pas de phrase de conclusion générique sur l'autonomie WLTP (« mesure de laboratoire ») ni de
 *   rappel systématique de la répartition du catalogue par carrosserie ;
 * - la source est toujours nommée « EV Database », jamais « la source » ;
 * - aucune généralisation d'usage non fondée sur nos données (pas de « une semaine de trajets ») :
 *   l'usage se déduit de la carrosserie, des places, du coffre et de la transmission, qui sont nos
 *   propres données.
 *
 * Chaque chiffre est lu sur les véhicules passés en argument, jamais écrit en dur.
 */
export interface ModelContent {
  text: (versions: Vehicle[], all: Vehicle[]) => string;
}

function find(all: Vehicle[], brandSlug: string, modelSlug: string): Vehicle {
  const v = all.find((x) => x.brandSlug === brandSlug && x.modelSlug === modelSlug);
  if (!v) throw new Error(`model-content: modèle "${brandSlug}/${modelSlug}" introuvable dans le catalogue`);
  return v;
}

function version(vs: Vehicle[], versionSlug: string): Vehicle {
  const v = vs.find((x) => x.versionSlug === versionSlug);
  if (!v) throw new Error(`model-content: version "${versionSlug}" introuvable`);
  return v;
}

/** Plus grande valeur d'un champ numérique parmi les versions d'un modèle (ex. autonomie, batterie). */
function maxOf(vs: Vehicle[], field: (v: Vehicle) => number): number {
  return Math.max(...vs.map(field));
}

/**
 * Relation comparative entre deux valeurs, calculée au moment du rendu (jamais écrite en dur) :
 * un écart de moins de 5 % est dit « proche », au-delà la valeur la plus haute est « supérieure ».
 */
function rel(a: number, b: number): "supérieure" | "proche" | "inférieure" {
  if (a === b) return "proche";
  const diff = Math.abs(a - b) / Math.max(a, b);
  if (diff < 0.05) return "proche";
  return a > b ? "supérieure" : "inférieure";
}

/** `true` seulement si `v` est strictement l'extremum du groupe sur ce champ (jamais affirmé sinon). */
function isMin(v: number, group: number[]): boolean {
  return v === Math.min(...group);
}
function isMax(v: number, group: number[]): boolean {
  return v === Math.max(...group);
}

/** Accorde au masculin le résultat de `rel()` (qui renvoie des formes féminines par défaut). */
function masc(word: string): string {
  return word === "supérieure" ? "supérieur" : word === "inférieure" ? "inférieur" : word;
}

/**
 * `rel()` suivi de sa préposition correcte avant « celle/celui/ce dernier » : « supérieure à »,
 * « inférieure à », mais « proche de » (jamais « proche à »). Variantes masculine et plurielle.
 */
function relTo(a: number, b: number): string {
  const r = rel(a, b);
  return r === "proche" ? "proche de" : `${r} à`;
}
function relToM(a: number, b: number): string {
  const r = masc(rel(a, b));
  return r === "proche" ? "proche de" : `${r} à`;
}
function relToPlural(a: number, b: number): string {
  const r = rel(a, b);
  return r === "proche" ? "proche des" : `${r} aux`;
}

const km = (n: number) => `${formatNumber(n)} km`;
const kwh = (n: number) => `${formatNumber(n, 1)} kWh`;
const kg = (n: number) => `${formatNumber(n)} kg`;
const kw = (n: number | null) => (n === null ? null : `${formatNumber(n, n < 10 ? 1 : 0)} kW`);

/**
 * Comparateur direct par modèle : même carrosserie, taille de batterie comparable. Choix éditorial
 * (algorithme glouton par proximité de batterie utile, plafonné à 3 réutilisations par modèle) ;
 * les chiffres de chaque côté restent lus en direct sur le catalogue au moment du rendu.
 */
export const COMPARATOR: Record<string, string> = {
  "tesla/model-3": "bmw/i4",
  "bmw/i4": "byd/seal",
  "byd/seal": "bmw/i4",
  "mercedes-benz/cla": "volkswagen/id-7",
  "volkswagen/id-7": "mercedes-benz/cla",
  "dacia/spring": "renault/twingo-e-tech",
  "renault/twingo-e-tech": "dacia/spring",
  "fiat/500e": "byd/dolphin-surf",
  "byd/dolphin-surf": "citroen/e-c3",
  "citroen/e-c3": "fiat/grande-panda",
  "fiat/grande-panda": "citroen/e-c3",
  "opel/corsa-electric": "peugeot/e-208",
  "peugeot/e-208": "renault/5-e-tech",
  "renault/5-e-tech": "peugeot/e-208",
  "mg/mg4": "renault/megane-e-tech",
  "renault/megane-e-tech": "mg/mg4",
  "nissan/leaf": "cupra/born",
  "cupra/born": "nissan/leaf",
  "ford/puma-gen-e": "hyundai/inster",
  "hyundai/inster": "ford/puma-gen-e",
  "peugeot/e-2008": "opel/mokka-electric",
  "opel/mokka-electric": "peugeot/e-2008",
  "renault/4-e-tech": "peugeot/e-2008",
  "citroen/e-c3-aircross": "renault/4-e-tech",
  "audi/q4-e-tron": "smart/smart-1",
  "smart/smart-1": "mg/mgs5",
  "mg/mgs5": "smart/smart-1",
  "volvo/ex30": "bmw/ix1",
  "bmw/ix1": "volvo/ex30",
  "hyundai/kona-electric": "bmw/ix1",
  "byd/atto-3-evo": "tesla/model-y",
  "tesla/model-y": "byd/atto-3-evo",
  "ford/explorer": "volkswagen/id-4",
  "volkswagen/id-4": "ford/explorer",
  "skoda/elroq": "ford/explorer",
  "skoda/enyaq": "ford/explorer",
  "kia/ev3": "volkswagen/id-4",
  "volvo/ex40": "kia/ev3",
  "hyundai/ioniq-5": "kia/ev6",
  "kia/ev6": "hyundai/ioniq-5",
  "bmw/ix3": "mercedes-benz/gla",
  "mercedes-benz/gla": "renault/scenic-e-tech",
  "renault/scenic-e-tech": "mercedes-benz/gla",
  "porsche/macan": "peugeot/e-3008",
  "peugeot/e-3008": "porsche/macan",
};

/** Texte rédigé du modèle `brandSlug/modelSlug`, ou `undefined` tant qu'il n'a pas été rédigé. */
export function modelText(brandSlug: string, modelSlug: string, versions: Vehicle[], all: Vehicle[]): string | undefined {
  return MODEL_CONTENT[`${brandSlug}/${modelSlug}`]?.text(versions, all);
}

export const MODEL_CONTENT: Record<string, ModelContent> = {
  /* ---------------------------------- Berlines ---------------------------------- */

  "tesla/model-3": {
    text: (vs, all) => {
      const rwd = version(vs, "rwd");
      const lr = version(vs, "long-range-rwd");
      const cmp = find(all, "bmw", "i4");
      const berlines = all.filter((v) => v.bodyType === "berline").length;
      return `Le Tesla Model 3 est l'un des rares modèles de notre catalogue proposés en plusieurs versions : RWD (${km(rwd.rangeWltp)} WLTP, batterie ${rwd.chemistry}) et Long Range RWD (${km(lr.rangeWltp)} WLTP, batterie ${lr.chemistry}), soit ${km(lr.rangeWltp - rwd.rangeWltp)} d'écart pour une même carrosserie. C'est une berline, carrosserie minoritaire dans notre base (${formatNumber(berlines)} modèles sur 45) : son comparateur le plus proche par taille de batterie, le BMW i4 eDrive40 (${kwh(cmp.batteryUsable)} utiles), affiche une autonomie WLTP ${relTo(cmp.rangeWltp, lr.rangeWltp)} celle de la Long Range RWD.

Les deux versions se rechargent vite en courant continu selon EV Database : ${formatNumber(rwd.chargingTime10to80 ?? 0)} et ${formatNumber(lr.chargingTime10to80 ?? 0)} minutes de 10 à 80 %, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour le BMW i4.

Pour un usage essentiellement urbain et périurbain, la RWD couvre une large part des besoins quotidiens ; pour des trajets autoroutiers fréquents, la Long Range RWD laisse davantage de marge avant une recharge. Les scénarios détaillés plus haut sur cette page ajustent l'autonomie à la vitesse, à la température et au type de trajet.`;
    },
  },

  "bmw/i4": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "byd", "seal");
      return `La BMW i4 eDrive40 est une berline à propulsion (arrière), seule version de ce modèle dans notre base : ${km(v.rangeWltp)} d'autonomie WLTP pour ${kwh(v.batteryUsable)} utiles selon EV Database. Face au BYD Seal 82,5 kWh AWD Excellence, son comparateur le plus proche par taille de batterie parmi les berlines du catalogue, l'écart de batterie reste modéré (${kwh(Math.abs(v.batteryUsable - cmp.batteryUsable))}) mais la transmission diffère : propulsion simple contre quatre roues motrices pour le Seal, qui affiche une accélération 0 à 100 km/h ${rel(v.acceleration0to100 ?? 0, cmp.acceleration0to100 ?? 0) === "supérieure" ? "plus longue" : "plus courte"} (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s contre ${formatNumber(v.acceleration0to100 ?? 0, 1)} s).

Sa charge rapide DC, ${kw(v.chargingDC)}, ramène la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database — une donnée à comparer à la puissance de votre borne, pas seulement au chiffre maximal publié.

Le coffre de ${formatNumber(v.trunkVolume ?? 0)} L et les ${formatNumber(v.seats)} places en font une berline orientée vers un usage routier régulier, trajets professionnels ou longues distances, plutôt que vers un usage exclusivement urbain où son encombrement n'apporte pas d'avantage particulier face à une carrosserie plus compacte de notre catalogue.`;
    },
  },

  "byd/seal": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "bmw", "i4");
      return `Le BYD Seal, en version 82,5 kWh AWD Excellence, associe une transmission intégrale à une batterie LFP de ${kwh(v.batteryUsable)} utiles, pour ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database. Parmi les berlines de notre catalogue, son comparateur le plus proche par taille de batterie est la BMW i4 eDrive40 (${kwh(cmp.batteryUsable)} utiles, propulsion simple) : l'écart de puissance est net, ${formatNumber(v.powerKw)} kW contre ${formatNumber(cmp.powerKw)} kW, ce qui se traduit par une accélération 0 à 100 km/h ${relTo(cmp.acceleration0to100 ?? 0, v.acceleration0to100 ?? 0)} celle du i4 (${formatNumber(v.acceleration0to100 ?? 0, 1)} s contre ${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s).

Sa puissance de charge DC, ${kw(v.chargingDC)}, est ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle du i4, pour une charge de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — le plus petit des deux berlines comparées —, le Seal s'adresse d'abord à un usage routier et sportif plutôt qu'au transport de bagages volumineux ; pour un usage familial avec davantage de coffre, une carrosserie SUV de notre catalogue conviendrait mieux.`;
    },
  },

  "mercedes-benz/cla": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "volkswagen", "id-7");
      const ranges = all.map((x) => x.rangeWltp);
      return `La Mercedes-Benz CLA 250+ affiche ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database${isMax(v.rangeWltp, ranges) ? ", la valeur la plus élevée de tout notre catalogue" : ""}, pour une batterie de ${kwh(v.batteryUsable)} utiles et une puissance de ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch). Sa consommation calculée (${formatNumber((v.batteryUsable / v.rangeWltp) * 100, 1)} kWh/100 km) est ${rel(cmp.batteryUsable / cmp.rangeWltp, v.batteryUsable / v.rangeWltp) === "supérieure" ? "inférieure" : "proche"} à celle de son comparateur le plus proche par taille de batterie parmi les berlines, la Volkswagen ID.7 86 kWh (${formatNumber((cmp.batteryUsable / cmp.rangeWltp) * 100, 1)} kWh/100 km).

Sa charge rapide DC, ${kw(v.chargingDC)}, est nettement ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle de l'ID.7 (${kw(cmp.chargingDC)}) : de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour l'ID.7. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, reste typique d'une berline électrique de cette puissance.

Avec un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, ${rel(v.trunkVolume ?? 0, cmp.trunkVolume ?? 0) === "inférieure" ? "plus compact que celui de l'ID.7" : "comparable à celui de l'ID.7"}, la CLA vise un usage routier et longue distance avec ${formatNumber(v.seats)} places, plutôt qu'un usage familial avec beaucoup de bagages, pour lequel une carrosserie SUV de notre catalogue offre davantage de volume.`;
    },
  },

  "volkswagen/id-7": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "mercedes-benz", "cla");
      return `La Volkswagen ID.7 86 kWh est une grande berline à propulsion (arrière), avec ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database pour ${kwh(v.batteryUsable)} utiles. Son comparateur le plus proche par taille de batterie parmi les berlines de notre catalogue, la Mercedes-Benz CLA 250+, affiche une autonomie WLTP ${rel(cmp.rangeWltp, v.rangeWltp)} (${km(cmp.rangeWltp)}) pour une batterie à peine plus grande (${kwh(cmp.batteryUsable)} utiles) : l'écart tient surtout à l'aérodynamisme et à l'efficience plutôt qu'à la capacité embarquée.

La recharge rapide DC de l'ID.7, ${kw(v.chargingDC)}, ramène la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database — une durée à mettre en regard de celle de la CLA, ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes.

Son coffre de ${formatNumber(v.trunkVolume ?? 0)} L, supérieur à celui de la CLA, en fait une berline orientée vers de longs trajets avec bagages, pour un conducteur ou une petite famille plutôt que pour un usage urbain quotidien où son gabarit n'apporte pas d'avantage particulier face à une citadine de notre catalogue.`;
    },
  },

  /* ---------------------------------- Citadines ---------------------------------- */

  "dacia/spring": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "renault", "twingo-e-tech");
      const ranges = all.map((x) => x.rangeWltp);
      return `La Dacia Spring Electric 70 embarque une batterie LFP de ${kwh(v.batteryUsable)} utiles, pour ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database${isMin(v.rangeWltp, ranges) ? " — la valeur la plus basse de tout notre catalogue" : ""}. Son comparateur le plus proche par taille de batterie parmi les citadines, la Renault Twingo E-Tech 27,5 kWh, affiche une autonomie WLTP ${rel(cmp.rangeWltp, v.rangeWltp)} (${km(cmp.rangeWltp)}) pour une batterie elle aussi modeste (${kwh(cmp.batteryUsable)} utiles).

Sa puissance AC maximale, ${kw(v.chargingAC)}, est identique à celle de la Twingo E-Tech : une charge sur une borne domestique triphasée y est plafonnée bien en deçà des 11 kW courants chez la plupart des autres versions de notre base.

Avec ${formatNumber(v.seats)} places, un poids à vide de ${kg(v.weight ?? 0)} et sa puissance de ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch), elle s'adresse d'abord à un usage urbain et périurbain court : trajets quotidiens, stationnement facilité par son faible encombrement. Pour des trajets autoroutiers longs ou réguliers, son autonomie et sa puissance de charge AC demandent une organisation plus stricte des recharges qu'avec une version à plus grande capacité de notre catalogue.`;
    },
  },

  "renault/twingo-e-tech": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "dacia", "spring");
      return `La Renault Twingo E-Tech 27,5 kWh est, avec la Dacia Spring, l'une des deux citadines à la plus petite batterie de notre catalogue : ${kwh(v.batteryUsable)} utiles pour ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database, avec une puissance de ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch). Face à la Spring (${km(cmp.rangeWltp)}, ${kwh(cmp.batteryUsable)} utiles), son comparateur le plus proche par taille de batterie, l'écart d'autonomie reste ${masc(rel(v.rangeWltp, cmp.rangeWltp))} — les deux citadines visent un usage comparable.

Sa charge rapide DC, ${kw(v.chargingDC)}, ramène la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour la Spring. Son poids à vide, ${kg(v.weight ?? 0)}, reste proche de celui de la Spring (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, elle convient à un usage urbain quotidien, trajets courts et stationnement en ville. Sa puissance AC, ${kw(v.chargingAC)}, limite la vitesse de charge sur borne publique AC par rapport aux versions acceptant 11 kW de notre catalogue, un point à anticiper pour qui ne recharge pas uniquement à domicile.`;
    },
  },

  "fiat/500e": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "byd", "dolphin-surf");
      return `La Fiat 500e Hatchback 42 kWh est la citadine la plus ancienne de notre catalogue encore commercialisée (${v.years}), avec ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database pour ${kwh(v.batteryUsable)} utiles et une puissance de ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch). Comparée au BYD Dolphin Surf 43,2 kWh Comfort, comparateur le plus proche par taille de batterie parmi les citadines, l'autonomie de la 500e est ${rel(v.rangeWltp, cmp.rangeWltp)} malgré une batterie de taille voisine, un écart qui tient à la chimie (${v.chemistry} contre ${cmp.chemistry}) et à l'aérodynamisme.

Son coffre, ${formatNumber(v.trunkVolume ?? 0)} L, est nettement ${relToM(v.trunkVolume ?? 0, cmp.trunkVolume ?? 0)} celui du Dolphin Surf (${formatNumber(cmp.trunkVolume ?? 0)} L) : un point à vérifier selon l'usage prévu, par exemple pour des bagages volumineux ou un poste de conduite partagé.

Avec ${formatNumber(v.seats)} places et un poids à vide de ${kg(v.weight ?? 0)}, elle reste une citadine pensée pour la ville et les trajets courts. Sa charge DC, ${kw(v.chargingDC)}, limite l'intérêt des longs trajets autoroutiers par rapport aux versions à puissance de charge plus élevée de notre catalogue.`;
    },
  },

  "byd/dolphin-surf": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "citroen", "e-c3");
      return `Le BYD Dolphin Surf 43,2 kWh Comfort est une citadine à batterie LFP, ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database pour ${kwh(v.batteryUsable)} utiles. Face à la Citroën ë-C3 Standard Range 44 kWh, son comparateur le plus proche par taille de batterie, l'autonomie est ${rel(v.rangeWltp, cmp.rangeWltp)} (${km(cmp.rangeWltp)} pour la ë-C3) pour une capacité quasi identique — l'écart se joue surtout sur la puissance, ${formatNumber(v.powerKw)} kW contre ${formatNumber(cmp.powerKw)} kW pour la ë-C3.

Sa recharge DC, ${kw(v.chargingDC)}, descend la charge de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, un temps ${rel(v.chargingTime10to80 ?? 0, cmp.chargingTime10to80 ?? 0) === "supérieure" ? "plus long" : "proche de celui"} de la ë-C3 (${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes). Son poids à vide, ${kg(v.weight ?? 0)}, est également proche de celui de la ë-C3 (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, elle s'adresse à un usage urbain et périurbain ; sa puissance AC de ${kw(v.chargingAC)} permet une recharge à pleine puissance sur la plupart des bornes triphasées, contrairement à des citadines limitées à ${kw(cmp.chargingAC)} dans notre base.`;
    },
  },

  "citroen/e-c3": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "fiat", "grande-panda");
      return `La Citroën ë-C3 Standard Range 44 kWh partage sa plateforme avec la Fiat Grande Panda 44 kWh, son comparateur le plus proche par taille de batterie parmi les citadines : même capacité utile (${kwh(v.batteryUsable)}), une autonomie WLTP ${rel(v.rangeWltp, cmp.rangeWltp)} (${km(v.rangeWltp)} contre ${km(cmp.rangeWltp)}) et une puissance identique de ${formatNumber(v.powerKw)} kW selon EV Database.

Les deux versions se distinguent surtout par le coffre : ${formatNumber(v.trunkVolume ?? 0)} L pour la ë-C3, ${relTo(v.trunkVolume ?? 0, cmp.trunkVolume ?? 0)} celui de la Grande Panda (${formatNumber(cmp.trunkVolume ?? 0)} L), et par la charge AC, ${kw(v.chargingAC)} dans les deux cas, inférieure aux 11 kW de la plupart des autres citadines de notre base.

Avec ${formatNumber(v.seats)} places et une charge rapide DC de ${kw(v.chargingDC)} (10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database), elle convient à un usage urbain et périurbain régulier ; sa puissance AC limitée allonge la recharge sur borne publique par rapport aux versions acceptant 11 kW.`;
    },
  },

  "fiat/grande-panda": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "citroen", "e-c3");
      return `La Fiat Grande Panda 44 kWh et son comparateur le plus proche par taille de batterie parmi les citadines, la Citroën ë-C3 Standard Range 44 kWh, partagent la même plateforme et la même capacité utile (${kwh(v.batteryUsable)}) : seules l'autonomie WLTP (${km(v.rangeWltp)}, ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de la ë-C3) et la carrosserie distinguent vraiment les deux fiches selon EV Database.

Son coffre de ${formatNumber(v.trunkVolume ?? 0)} L est ${relTo(v.trunkVolume ?? 0, cmp.trunkVolume ?? 0)} celui de la ë-C3 (${formatNumber(cmp.trunkVolume ?? 0)} L), un critère à vérifier selon l'usage prévu plutôt qu'un simple choix de style.

Sa charge rapide DC, ${kw(v.chargingDC)}, ramène la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database. Avec ${formatNumber(v.seats)} places et un poids à vide de ${kg(v.weight ?? 0)}, elle reste une citadine tournée vers l'usage urbain et périurbain ; sa puissance AC de ${kw(v.chargingAC)}, inférieure aux 11 kW de la plupart des autres citadines de notre base, rallonge la recharge sur borne publique.`;
    },
  },

  "opel/corsa-electric": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "peugeot", "e-208");
      return `L'Opel Corsa Electric 51 kWh partage sa plateforme avec la Peugeot e-208 50 kWh, son comparateur le plus proche par taille de batterie parmi les citadines : capacités utiles quasi identiques (${kwh(v.batteryUsable)} contre ${kwh(cmp.batteryUsable)}), mêmes puissance et couple selon EV Database. L'écart se joue sur l'autonomie WLTP, ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'e-208 (${km(v.rangeWltp)} contre ${km(cmp.rangeWltp)}), et sur la charge AC : ${kw(v.chargingAC)} pour la Corsa contre ${kw(cmp.chargingAC)} pour l'e-208.

Sa recharge rapide DC, ${kw(v.chargingDC)}, descend la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, un temps identique à celui de l'e-208 malgré la différence de puissance AC.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — ${relToM(v.trunkVolume ?? 0, cmp.trunkVolume ?? 0)} celui de l'e-208 —, elle s'adresse à un usage urbain et périurbain courant. Sa puissance AC plus limitée allonge la recharge sur une borne publique triphasée par rapport aux versions acceptant 11 kW de notre catalogue, un point à vérifier si vous ne rechargez pas uniquement à domicile.`;
    },
  },

  "peugeot/e-208": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "renault", "5-e-tech");
      const d = formatNumber(Math.abs(v.rangeWltp - cmp.rangeWltp));
      return `Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, la Peugeot e-208 50 kWh reste une citadine compacte au quotidien. Elle affiche ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database pour ${kwh(v.batteryUsable)} utiles, soit ${d} km de différence avec la Renault 5 E-Tech 52 kWh 150 ch, son comparateur le plus proche par taille de batterie parmi les citadines — un écart qui tient surtout à l'aérodynamisme, la puissance des deux versions étant proche (${formatNumber(v.powerKw)} kW contre ${formatNumber(cmp.powerKw)} kW).

Sa charge rapide DC, ${kw(v.chargingDC)}, ramène la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, un temps ${rel(v.chargingTime10to80 ?? 0, cmp.chargingTime10to80 ?? 0) === "proche" ? "proche de celui" : rel(v.chargingTime10to80 ?? 0, cmp.chargingTime10to80 ?? 0) === "supérieure" ? "plus long que celui" : "plus court que celui"} de la 5 E-Tech (${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes). Son poids à vide, ${kg(v.weight ?? 0)}, reste dans la moyenne des citadines de notre base.

Elle convient avant tout à un usage urbain et périurbain : stationnement facilité, recharge quotidienne sur une puissance AC de ${kw(v.chargingAC)}. Son petit coffre limite en revanche les longs séjours à plusieurs bagages, un point où une carrosserie SUV de notre catalogue offre davantage de marge.`;
    },
  },

  "renault/5-e-tech": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "peugeot", "e-208");
      const consCalc = (v.batteryUsable / v.rangeWltp) * 100;
      return `La silhouette rétro de la Renault 5 E-Tech 52 kWh 150 ch cache une mécanique assez classique pour une citadine de notre catalogue : ${kwh(v.batteryUsable)} utiles, ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database, soit une consommation calculée d'environ ${formatNumber(consCalc, 1)} kWh/100 km. Son comparateur le plus proche par taille de batterie parmi les citadines, la Peugeot e-208 50 kWh, est un peu plus puissante (${formatNumber(cmp.powerKw)} kW contre ${formatNumber(v.powerKw)} kW) pour une autonomie ${rel(cmp.rangeWltp, v.rangeWltp)}.

Sa puissance de charge DC, ${kw(v.chargingDC)}, permet de passer de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database — quelques minutes de plus que l'e-208. En AC, elle accepte jusqu'à ${kw(v.chargingAC)}, la pleine puissance d'une borne triphasée standard.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, elle couvre l'essentiel d'un usage urbain et périurbain quotidien. Son poids modéré (${kg(v.weight ?? 0)}) joue en sa faveur en ville, mais n'empêche pas l'autonomie réelle de redescendre sous la valeur WLTP sur autoroute, à vitesse élevée.`;
    },
  },

  /* ---------------------------------- Compactes ---------------------------------- */

  "mg/mg4": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "renault", "megane-e-tech");
      return `Le coffre de la MG4 Urban Comfort Long Range, ${formatNumber(v.trunkVolume ?? 0)} L, dépasse celui de son comparateur le plus proche par taille de batterie parmi les compactes, la Renault Mégane E-Tech EV60 220 ch (${formatNumber(cmp.trunkVolume ?? 0)} L) — un écart notable pour une batterie ${rel(v.batteryUsable, cmp.batteryUsable)} (${kwh(v.batteryUsable)} contre ${kwh(cmp.batteryUsable)} utiles). Son autonomie WLTP, ${km(v.rangeWltp)} selon EV Database, reste ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de la Mégane (${km(cmp.rangeWltp)}).

Sa charge rapide DC, ${kw(v.chargingDC)}, est ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle de la Mégane (${kw(cmp.chargingDC)}), pour une charge de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes selon EV Database. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, reste proche de celle de la Mégane (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s) malgré l'écart de couple (${formatNumber(v.torque ?? 0)} Nm contre ${formatNumber(cmp.torque ?? 0)} Nm).

Avec ${formatNumber(v.seats)} places, une puissance de ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch) et une chimie ${v.chemistry}, elle s'adresse à un usage polyvalent, entre trajets urbains et sorties plus longues, porté par un volume de coffre supérieur à la plupart des compactes de notre catalogue. Son poids à vide, ${kg(v.weight ?? 0)}, reste inférieur à celui de la Mégane (${kg(cmp.weight ?? 0)}).`;
    },
  },

  "renault/megane-e-tech": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "mg", "mg4");
      return `Commercialisée de ${v.years}, la Renault Mégane E-Tech EV60 220 ch affiche ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database pour ${kwh(v.batteryUsable)} utiles. Sa puissance AC maximale, ${kw(v.chargingAC)}, dépasse nettement celle de son comparateur le plus proche par taille de batterie parmi les compactes, la MG4 Urban Comfort Long Range (${kw(cmp.chargingAC)}) : un atout sur les bornes publiques triphasées à forte puissance, plus rare qu'un atout à domicile.

Sa charge rapide DC, ${kw(v.chargingDC)}, ramène la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, un temps ${relToM(v.chargingTime10to80 ?? 0, cmp.chargingTime10to80 ?? 0)} celui de la MG4 (${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes). Son poids à vide, ${kg(v.weight ?? 0)}, dépasse celui de la MG4 (${kg(cmp.weight ?? 0)}), cohérent avec une batterie plus grande.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — ${relToM(v.trunkVolume ?? 0, cmp.trunkVolume ?? 0)} celui de la MG4 —, elle convient à un usage quotidien mixte, ville et routes secondaires, sans viser le volume de chargement d'un grand SUV familial de notre catalogue. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, suffit largement à un usage routier courant.`;
    },
  },

  "nissan/leaf": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "cupra", "born");
      return `La Nissan Leaf Extended Range 75 kWh cumule la plus grande batterie des compactes de notre catalogue, ${kwh(v.batteryUsable)} utiles, pour ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database. Face à la Cupra Born 170 kW 79 kWh, son comparateur le plus proche par taille de batterie, l'autonomie est ${rel(v.rangeWltp, cmp.rangeWltp)} (${km(cmp.rangeWltp)}) malgré une capacité quasi identique — la Born compense par une puissance supérieure (${formatNumber(cmp.powerKw)} kW contre ${formatNumber(v.powerKw)} kW).

Sa charge rapide DC, ${kw(v.chargingDC)}, est ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle de la Born (${kw(cmp.chargingDC)}) : de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes selon EV Database. Son poids à vide, ${kg(v.weight ?? 0)}, est ${relToM(v.weight ?? 0, cmp.weight ?? 0)} celui de la Born (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, elle convient à un usage polyvalent, y compris des trajets longs grâce à sa grande batterie, à condition d'anticiper des arrêts de recharge plus longs que la Born sur autoroute. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, reste dans la moyenne des compactes de notre base.`;
    },
  },

  "cupra/born": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "nissan", "leaf");
      return `Avec ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch) et une transmission à propulsion, la Cupra Born 170 kW 79 kWh est la plus sportive des compactes de notre catalogue : 0 à 100 km/h en ${formatNumber(v.acceleration0to100 ?? 0, 1)} s selon EV Database, contre ${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s pour la Nissan Leaf Extended Range 75 kWh, son comparateur le plus proche par taille de batterie. Son autonomie WLTP, ${km(v.rangeWltp)}, est ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de la Leaf (${km(cmp.rangeWltp)}) pour une batterie légèrement plus petite (${kwh(v.batteryUsable)} contre ${kwh(cmp.batteryUsable)} utiles).

Sa charge rapide DC, ${kw(v.chargingDC)}, descend la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, nettement plus vite que la Leaf (${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes). Son couple, ${formatNumber(v.torque ?? 0)} Nm, reste inférieur à celui de la Leaf (${formatNumber(cmp.torque ?? 0)} Nm) malgré sa puissance supérieure.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — plus petit que celui de la Leaf —, elle s'adresse à un usage routier dynamique plutôt qu'au transport de bagages volumineux. Son poids à vide, ${kg(v.weight ?? 0)}, reste proche de celui de la Leaf (${kg(cmp.weight ?? 0)}).`;
    },
  },

  /* ---------------------------------- SUV ---------------------------------- */

  "ford/puma-gen-e": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "hyundai", "inster");
      return `Le Ford Puma Gen-E affiche le plus grand coffre des SUV comparables de notre catalogue à cette taille de batterie : ${formatNumber(v.trunkVolume ?? 0)} L, contre ${formatNumber(cmp.trunkVolume ?? 0)} L pour son comparateur le plus proche, le Hyundai Inster Long Range. Sa batterie, ${kwh(v.batteryUsable)} utiles, est ${relTo(v.batteryUsable, cmp.batteryUsable)} celle de l'Inster (${kwh(cmp.batteryUsable)}) pour une autonomie WLTP de ${km(v.rangeWltp)} selon EV Database.

Sa charge rapide DC, ${kw(v.chargingDC)}, descend la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database — plus rapide que l'Inster (${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes). Sa puissance, ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch), dépasse celle de l'Inster (${formatNumber(cmp.powerKw)} kW).

Avec ${formatNumber(v.seats)} places et un poids à vide de ${kg(v.weight ?? 0)}, il convient à un usage familial au quotidien : son grand coffre absorbe des bagages volumineux malgré un gabarit de SUV compact, un compromis que l'Inster, plus petit, ne propose pas. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, reste dans la moyenne des SUV de notre catalogue.`;
    },
  },

  "hyundai/inster": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "ford", "puma-gen-e");
      return `Avec ${formatNumber(v.seats)} places, le Hyundai Inster Long Range est l'un des rares SUV à 4 places de notre catalogue, contre ${formatNumber(cmp.seats)} pour son comparateur le plus proche par taille de batterie, le Ford Puma Gen-E. Sa batterie, ${kwh(v.batteryUsable)} utiles, est ${relTo(v.batteryUsable, cmp.batteryUsable)} celle du Puma Gen-E, pour une autonomie WLTP de ${km(v.rangeWltp)} selon EV Database.

Sa charge rapide DC, ${kw(v.chargingDC)}, ramène la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, quelques minutes de plus que le Puma Gen-E (${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes). Sa puissance, ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch), reste ${relTo(v.powerKw, cmp.powerKw)} celle du Puma Gen-E (${formatNumber(cmp.powerKw)} kW).

Avec un coffre de ${formatNumber(v.trunkVolume ?? 0)} L et un poids à vide de ${kg(v.weight ?? 0)} — parmi les plus légers SUV de notre base —, il s'adresse à un usage urbain et périurbain, pour de petits foyers ou un second véhicule, plutôt qu'à une famille nombreuse avec beaucoup de bagages. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, reste modeste.`;
    },
  },

  "peugeot/e-2008": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "opel", "mokka-electric");
      return `Le Peugeot e-2008 54 kWh partage sa plateforme avec l'Opel Mokka Electric 54 kWh, son comparateur le plus proche par taille de batterie parmi les SUV : même capacité utile (${kwh(v.batteryUsable)}), mêmes puissance et couple selon EV Database. L'écart se joue sur l'autonomie WLTP, ${relTo(v.rangeWltp, cmp.rangeWltp)} celle du Mokka (${km(v.rangeWltp)} contre ${km(cmp.rangeWltp)}), et surtout sur le coffre : ${formatNumber(v.trunkVolume ?? 0)} L contre ${formatNumber(cmp.trunkVolume ?? 0)} L pour le Mokka.

Sa charge rapide DC, ${kw(v.chargingDC)}, ramène la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, un temps identique à celui du Mokka. Son poids à vide, ${kg(v.weight ?? 0)}, est ${relToM(v.weight ?? 0, cmp.weight ?? 0)} celui du Mokka (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places et une puissance AC de seulement ${kw(v.chargingAC)} — commune aux deux modèles —, il convient à un usage familial urbain et périurbain, la recharge publique AC rapide restant un point faible partagé par les deux SUV. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, reste typique de ce segment.`;
    },
  },

  "opel/mokka-electric": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "peugeot", "e-2008");
      return `L'Opel Mokka Electric 54 kWh et son comparateur le plus proche par taille de batterie parmi les SUV, le Peugeot e-2008 54 kWh, partagent la même plateforme, la même capacité utile (${kwh(v.batteryUsable)}) et la même puissance selon EV Database. Le coffre les distingue nettement : ${formatNumber(v.trunkVolume ?? 0)} L pour le Mokka, ${relToPlural(v.trunkVolume ?? 0, cmp.trunkVolume ?? 0)} ${formatNumber(cmp.trunkVolume ?? 0)} L de l'e-2008.

Son autonomie WLTP, ${km(v.rangeWltp)} selon EV Database, est ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'e-2008 (${km(cmp.rangeWltp)}), un écart lié au style de carrosserie plus qu'à la mécanique, strictement identique par ailleurs. Son poids à vide, ${kg(v.weight ?? 0)}, est ${relToM(v.weight ?? 0, cmp.weight ?? 0)} celui de l'e-2008 (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places et une charge rapide DC de ${kw(v.chargingDC)} (10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database), il s'adresse à un usage urbain et périurbain familial, avec une recharge publique AC plafonnée à ${kw(v.chargingAC)}, un point commun aux deux modèles à anticiper hors domicile. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, reste comparable à celle de l'e-2008.`;
    },
  },

  "renault/4-e-tech": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "peugeot", "e-2008");
      return `Le Renault 4 E-Tech 52 kWh 150 ch partage sa batterie et sa puissance avec la Renault 5 E-Tech, mais dans une carrosserie SUV : ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database pour ${kwh(v.batteryUsable)} utiles. Face au Peugeot e-2008 54 kWh, son comparateur le plus proche par taille de batterie parmi les SUV, l'autonomie est ${rel(v.rangeWltp, cmp.rangeWltp)} (${km(cmp.rangeWltp)}) pour une batterie à peine plus petite.

Sa charge rapide DC, ${kw(v.chargingDC)}, est ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle de l'e-2008 (${kw(cmp.chargingDC)}) : 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour l'e-2008. Sa puissance AC, ${kw(v.chargingAC)}, dépasse nettement celle de l'e-2008 (${kw(cmp.chargingAC)}). Son poids à vide, ${kg(v.weight ?? 0)}, reste ${relToM(v.weight ?? 0, cmp.weight ?? 0)} celui de l'e-2008 (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, il convient à un usage familial polyvalent, entre ville et sorties de week-end, avec l'avantage d'une recharge AC publique plus rapide que son comparateur. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, suffit à un usage routier courant.`;
    },
  },

  "citroen/e-c3-aircross": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "renault", "4-e-tech");
      return `Le Citroën ë-C3 Aircross Extended Range 54 kWh affiche la charge 10 à 80 % la plus longue des SUV de notre catalogue à cette taille de batterie selon EV Database : ${formatNumber(v.chargingTime10to80 ?? 0)} minutes, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour son comparateur le plus proche, le Renault 4 E-Tech 52 kWh 150 ch. Son autonomie WLTP, ${km(v.rangeWltp)}, reste ${relTo(v.rangeWltp, cmp.rangeWltp)} celle du 4 E-Tech (${km(cmp.rangeWltp)}) pour une batterie de taille comparable (${kwh(v.batteryUsable)} utiles).

Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, et sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, restent modestes comparées au 4 E-Tech (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s, ${formatNumber(cmp.topSpeed ?? 0)} km/h), cohérentes avec sa puissance plus faible (${formatNumber(v.powerKw)} kW contre ${formatNumber(cmp.powerKw)} kW). Son poids à vide, ${kg(v.weight ?? 0)}, est pourtant ${relToM(v.weight ?? 0, cmp.weight ?? 0)} celui du 4 E-Tech (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, il convient à un usage familial urbain et périurbain plutôt qu'à des trajets autoroutiers fréquents, où son temps de charge plus long se fait sentir.`;
    },
  },

  "audi/q4-e-tron": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "smart", "smart-1");
      return `À taille de batterie comparable (${kwh(v.batteryUsable)} contre ${kwh(cmp.batteryUsable)} utiles pour le Smart #1 Pro+, le SUV le plus proche sur ce critère dans notre base), l'Audi Q4 e-tron 40 mise sur l'efficience plutôt que sur la puissance : ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch) contre ${formatNumber(cmp.powerKw)} kW pour le Smart #1, pour une autonomie WLTP de ${km(v.rangeWltp)} selon EV Database, ${relTo(v.rangeWltp, cmp.rangeWltp)} celle du Smart #1 (${km(cmp.rangeWltp)}).

Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, reste logiquement plus longue que celle du Smart #1 (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s). Sa charge rapide DC, ${kw(v.chargingDC)}, est ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle du Smart #1 (${kw(cmp.chargingDC)}) : 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, nettement supérieur à celui du Smart #1 (${formatNumber(cmp.trunkVolume ?? 0)} L), il convient à un usage familial large, y compris des trajets longs, plutôt qu'à un usage exclusivement urbain où son gabarit n'apporte pas d'avantage particulier.`;
    },
  },

  "smart/smart-1": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "mg", "mgs5");
      return `Le Smart #1 Pro+ se distingue par sa puissance AC, ${kw(v.chargingAC)}, la plus élevée des SUV de notre catalogue à cette taille de batterie selon EV Database — de quoi tirer parti d'une borne publique triphasée à forte puissance, plus rare qu'une prise domestique. Sa puissance totale, ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch), dépasse largement celle du MG S5 EV 64 kWh, le SUV dont la batterie se rapproche le plus de la sienne dans notre base (${formatNumber(cmp.powerKw)} kW), pour une autonomie WLTP ${rel(v.rangeWltp, cmp.rangeWltp)} (${km(v.rangeWltp)} contre ${km(cmp.rangeWltp)}).

Sa charge rapide DC, ${kw(v.chargingDC)}, est ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle du S5 (${kw(cmp.chargingDC)}), pour une charge de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, devance nettement celle du S5 (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — le plus petit des deux comparés —, il s'adresse à un usage urbain et périurbain plutôt qu'au transport de bagages volumineux, pour lequel le S5 offre davantage de marge.`;
    },
  },

  "mg/mgs5": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "smart", "smart-1");
      return `Le MG S5 EV 64 kWh est une propulsion (arrière) de ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch), pour ${km(v.rangeWltp)} d'autonomie WLTP selon EV Database et ${kwh(v.batteryUsable)} utiles — une capacité quasi identique à celle du Smart #1 Pro+, le SUV le plus proche par cette mesure dans notre catalogue, dont l'autonomie reste ${rel(cmp.rangeWltp, v.rangeWltp)} (${km(cmp.rangeWltp)}).

Sa puissance AC maximale, ${kw(v.chargingAC)}, reste nettement inférieure à celle du Smart #1 (${kw(cmp.chargingAC)}), un écart qui pèse surtout sur la recharge publique, la recharge à domicile restant comparable pour les deux véhicules. Sa charge rapide DC, ${kw(v.chargingDC)}, descend la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour le Smart #1.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, nettement supérieur à celui du Smart #1 (${formatNumber(cmp.trunkVolume ?? 0)} L), il convient à un usage familial avec davantage de bagages, au prix d'une recharge publique AC plus lente.`;
    },
  },

  "volvo/ex30": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "bmw", "ix1");
      return `0 à 100 km/h en ${formatNumber(v.acceleration0to100 ?? 0, 1)} s selon EV Database : le Volvo EX30 Single Motor Extended Range est l'un des SUV les plus vifs de notre catalogue, loin devant le BMW iX1 eDrive20 (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s), dont la batterie (${kwh(cmp.batteryUsable)} utiles) est la plus proche de la sienne (${kwh(v.batteryUsable)} utiles) parmi les SUV de notre base.

Cette orientation sportive se paie en coffre : ${formatNumber(v.trunkVolume ?? 0)} L contre ${formatNumber(cmp.trunkVolume ?? 0)} L pour l'iX1. Son autonomie WLTP, ${km(v.rangeWltp)}, reste ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'iX1 (${km(cmp.rangeWltp)}), et sa charge rapide DC, ${kw(v.chargingDC)}, descend la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour l'iX1.

Avec ${formatNumber(v.seats)} places, il convient à un usage urbain et périurbain dynamique plutôt qu'au transport de bagages volumineux, pour lequel l'iX1 offre davantage de marge. Son poids à vide, ${kg(v.weight ?? 0)}, reste inférieur à celui de l'iX1 (${kg(cmp.weight ?? 0)}), cohérent avec sa vivacité.`;
    },
  },

  "bmw/ix1": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "volvo", "ex30");
      return `À la différence du Volvo EX30 Single Motor Extended Range, à propulsion, le BMW iX1 eDrive20 roule en traction (avant) selon EV Database — un choix technique plus qu'un signe de puissance, la sienne (${formatNumber(v.powerKw)} kW, ${formatNumber(v.powerPs)} ch) restant nettement inférieure à celle de l'EX30 (${formatNumber(cmp.powerKw)} kW), la batterie la plus proche de la sienne parmi les SUV de notre base.

Son coffre, ${formatNumber(v.trunkVolume ?? 0)} L, dépasse largement celui de l'EX30 (${formatNumber(cmp.trunkVolume ?? 0)} L), pour un poids à vide ${masc(rel(v.weight ?? 0, cmp.weight ?? 0))} (${kg(v.weight ?? 0)} contre ${kg(cmp.weight ?? 0)}). Son autonomie WLTP, ${km(v.rangeWltp)}, est ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'EX30 (${km(cmp.rangeWltp)}), pour une charge rapide DC de ${kw(v.chargingDC)} contre ${kw(cmp.chargingDC)}.

Avec ${formatNumber(v.seats)} places, il s'adresse à un usage familial avec davantage de bagages, plutôt qu'à un usage sportif où l'EX30, plus vif, a l'avantage. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, reste dans la moyenne des SUV de notre catalogue, tout comme sa consommation calculée (${formatNumber((v.batteryUsable / v.rangeWltp) * 100, 1)} kWh/100 km).`;
    },
  },

  "hyundai/kona-electric": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "bmw", "ix1");
      const cmpBatt = cmp.batteryUsable;
      return `${formatNumber(v.chargingTime10to80 ?? 0)} minutes : c'est le temps de charge 10 à 80 % du Hyundai Kona Electric 65 kWh selon EV Database, le plus long des SUV à taille de batterie comparable (${kwh(v.batteryUsable)} utiles) dans notre catalogue — contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour le BMW iX1 eDrive20, dont la batterie (${kwh(cmpBatt)} utiles) est la plus proche de la sienne.

Son autonomie WLTP, ${km(v.rangeWltp)}, reste ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'iX1 (${km(cmp.rangeWltp)}), et sa puissance, ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch), la dépasse (${formatNumber(cmp.powerKw)} kW pour l'iX1), pour une accélération 0 à 100 km/h de ${formatNumber(v.acceleration0to100 ?? 0, 1)} s.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, il convient à un usage familial urbain et périurbain ; son temps de charge DC plus long demande d'anticiper davantage les arrêts sur de longs trajets autoroutiers. Son poids à vide, ${kg(v.weight ?? 0)}, reste inférieur à celui de l'iX1 (${kg(cmp.weight ?? 0)}), et sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, légèrement supérieure.`;
    },
  },

  "byd/atto-3-evo": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "tesla", "model-y");
      const cmpRwd = version(all.filter((x) => x.brandSlug === "tesla" && x.modelSlug === "model-y"), "rwd");
      return `Même chimie LFP, batterie quasi identique (${kwh(v.batteryUsable)} contre ${kwh(cmpRwd.batteryUsable)} utiles) : le BYD Atto 3 Evo RWD Design et la Tesla Model Y RWD partagent une base technique proche selon EV Database, pour une autonomie WLTP ${rel(v.rangeWltp, cmpRwd.rangeWltp)} côté Atto 3 Evo (${km(v.rangeWltp)} contre ${km(cmpRwd.rangeWltp)}).

Sa charge rapide DC, ${kw(v.chargingDC)}, est ${relTo(v.chargingDC ?? 0, cmpRwd.chargingDC ?? 0)} celle de la Model Y RWD (${kw(cmpRwd.chargingDC)}) : 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, contre ${formatNumber(cmpRwd.chargingTime10to80 ?? 0)} minutes. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, reste proche de celle de la Model Y RWD (${formatNumber(cmpRwd.acceleration0to100 ?? 0, 1)} s).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — nettement inférieur au coffre modulable de la Model Y (${formatNumber(cmp.trunkVolume ?? 0)} L) —, il convient à un usage familial courant plutôt qu'au transport de volumes importants. Son poids à vide, ${kg(v.weight ?? 0)}, reste inférieur à celui de la Model Y RWD (${kg(cmpRwd.weight ?? 0)}).`;
    },
  },

  "tesla/model-y": {
    text: (vs, all) => {
      const rwd = version(vs, "rwd");
      const awd = version(vs, "long-range-awd");
      const cmp = find(all, "byd", "atto-3-evo");
      return `Le Tesla Model Y est l'un des rares modèles de notre catalogue proposés en plusieurs versions : RWD (${km(rwd.rangeWltp)} WLTP, batterie ${rwd.chemistry}) et Long Range AWD (${km(awd.rangeWltp)} WLTP, batterie ${awd.chemistry}, transmission intégrale) selon EV Database. La seconde ajoute une motricité sur les quatre roues que la RWD ne propose pas, utile par faible adhérence.

Son comparateur le plus proche par taille de batterie parmi les SUV, le BYD Atto 3 Evo RWD Design, partage la même chimie LFP que la version RWD pour une autonomie ${rel(cmp.rangeWltp, rwd.rangeWltp)} (${km(cmp.rangeWltp)}). Les deux versions du Model Y se rechargent vite en courant continu : ${formatNumber(rwd.chargingTime10to80 ?? 0)} et ${formatNumber(awd.chargingTime10to80 ?? 0)} minutes de 10 à 80 % selon EV Database, un temps ${relTo(cmp.chargingTime10to80 ?? 0, rwd.chargingTime10to80 ?? 0)} celui de l'Atto 3 Evo (${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes).

Avec un coffre de ${formatNumber(rwd.trunkVolume ?? 0)} L, la RWD convient à un usage quotidien avec des pointes autoroutières occasionnelles ; l'AWD apporte une marge supplémentaire pour qui roule davantage par mauvais temps ou en montagne.`;
    },
  },

  "ford/explorer": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "volkswagen", "id-4");
      return `Le Ford Explorer Extended Range RWD partage sa plateforme avec le Volkswagen ID.4 Pro, le SUV dont la batterie est la plus proche de la sienne dans notre catalogue : même capacité utile (${kwh(v.batteryUsable)}), même puissance et même couple selon EV Database (${formatNumber(v.powerKw)} kW, ${formatNumber(v.torque ?? 0)} Nm). L'écart se joue sur l'autonomie WLTP, ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'ID.4 (${km(v.rangeWltp)} contre ${km(cmp.rangeWltp)}), et sur la charge DC, nettement ${rel(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} (${kw(v.chargingDC)} contre ${kw(cmp.chargingDC)}).

Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, devance celle de l'ID.4 (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s) malgré une mécanique identique par ailleurs — l'écart tient au poids, ${kg(v.weight ?? 0)} contre ${kg(cmp.weight ?? 0)} pour l'ID.4. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, est identique à celle de l'ID.4.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, il convient à un usage familial avec de longs trajets occasionnels, sa charge DC plus rapide limitant le temps d'arrêt sur autoroute par rapport à l'ID.4.`;
    },
  },

  "volkswagen/id-4": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "ford", "explorer");
      return `Le Volkswagen ID.4 Pro et le Ford Explorer Extended Range RWD, la version la plus proche par taille de batterie dans notre catalogue, partagent la même plateforme, la même batterie (${kwh(v.batteryUsable)} utiles) et la même puissance selon EV Database (${formatNumber(v.powerKw)} kW). L'autonomie WLTP les distingue : ${km(v.rangeWltp)} pour l'ID.4, ${relToPlural(v.rangeWltp, cmp.rangeWltp)} ${km(cmp.rangeWltp)} de l'Explorer, un écart lié à l'aérodynamisme plutôt qu'à la mécanique.

Sa charge rapide DC, ${kw(v.chargingDC)}, est ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle de l'Explorer (${kw(cmp.chargingDC)}) : 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes selon EV Database. Son poids à vide, ${kg(v.weight ?? 0)}, est ${relToM(v.weight ?? 0, cmp.weight ?? 0)} celui de l'Explorer (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — proche de celui de l'Explorer —, il convient à un usage familial polyvalent ; sa charge DC plus lente demande d'anticiper des arrêts plus longs sur de grands trajets. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, reste identique à celle de l'Explorer.`;
    },
  },

  "skoda/elroq": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "ford", "explorer");
      return `Même batterie, même puissance, même couple (${kwh(v.batteryUsable)} utiles, ${formatNumber(v.powerKw)} kW, ${formatNumber(v.torque ?? 0)} Nm) : le Škoda Elroq 85 et le Ford Explorer Extended Range RWD, bâtis sur la même plateforme, ne se distinguent presque que par la carrosserie selon EV Database. L'écart d'autonomie WLTP est minime (${km(v.rangeWltp)} pour l'Elroq contre ${km(cmp.rangeWltp)} pour l'Explorer), tout comme celui du temps de charge 10 à 80 %, ${formatNumber(v.chargingTime10to80 ?? 0)} minutes contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour une charge DC identique (${kw(v.chargingDC)}).

Le coffre, en revanche, les distingue davantage : ${formatNumber(v.trunkVolume ?? 0)} L pour l'Elroq, à comparer aux ${formatNumber(cmp.trunkVolume ?? 0)} L de l'Explorer. Son poids à vide, ${kg(v.weight ?? 0)}, reste proche de celui de l'Explorer (${kg(cmp.weight ?? 0)}).

Avec ${formatNumber(v.seats)} places, il convient à un usage familial avec des trajets longs occasionnels, la différence avec l'Explorer tenant surtout à la finition plutôt qu'à la mécanique, strictement partagée. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, reste elle aussi identique.`;
    },
  },

  "skoda/enyaq": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "ford", "explorer");
      return `Le coffre du Škoda Enyaq 85, ${formatNumber(v.trunkVolume ?? 0)} L, dépasse celui de son cousin de plateforme le Škoda Elroq et celui du Ford Explorer Extended Range RWD (${formatNumber(cmp.trunkVolume ?? 0)} L), le SUV le plus proche par taille de batterie dans notre base — même batterie (${kwh(v.batteryUsable)} utiles), même puissance selon EV Database.

Son autonomie WLTP, ${km(v.rangeWltp)}, est ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'Explorer (${km(cmp.rangeWltp)}). Sa charge rapide DC, ${kw(v.chargingDC)}, descend la batterie de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour l'Explorer.

Avec ${formatNumber(v.seats)} places et un poids à vide de ${kg(v.weight ?? 0)}, il convient à un usage familial exigeant en volume : longs trajets avec bagages nombreux, grâce à un coffre parmi les plus grands SUV de notre catalogue à cette taille de batterie. Sa puissance AC, ${kw(v.chargingAC)}, reste identique à celle de l'Explorer, et son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, tout autant.`;
    },
  },

  "kia/ev3": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "volkswagen", "id-4");
      return `Malgré une puissance nettement inférieure à celle du Volkswagen ID.4 Pro (${formatNumber(v.powerKw)} kW contre ${formatNumber(cmp.powerKw)} kW), le Kia EV3 Long Range affiche une autonomie WLTP ${rel(v.rangeWltp, cmp.rangeWltp)} selon EV Database (${km(v.rangeWltp)} contre ${km(cmp.rangeWltp)}) — l'ID.4 étant, dans notre catalogue, le SUV dont la batterie s'approche le plus de la sienne (${kwh(cmp.batteryUsable)} utiles contre ${kwh(v.batteryUsable)}).

Ce gain d'efficience se paie en vitesse de charge : ${formatNumber(v.chargingTime10to80 ?? 0)} minutes de 10 à 80 % pour l'EV3 selon EV Database, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour l'ID.4. Son poids à vide, ${kg(v.weight ?? 0)}, reste inférieur à celui de l'ID.4 (${kg(cmp.weight ?? 0)}), cohérent avec sa puissance plus faible.

Son coffre, ${formatNumber(v.trunkVolume ?? 0)} L, et sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, restent tous deux inférieurs à ceux de l'ID.4 (${formatNumber(cmp.trunkVolume ?? 0)} L, ${formatNumber(cmp.topSpeed ?? 0)} km/h). Avec ${formatNumber(v.seats)} places, il reste taillé pour un usage familial urbain et périurbain plutôt que pour la vitesse pure, son temps de charge DC plus long demandant d'anticiper les arrêts sur autoroute.`;
    },
  },

  "volvo/ex40": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "kia", "ev3");
      return `Le Volvo EX40 P5 Long Range affiche une puissance de charge DC, ${kw(v.chargingDC)}, nettement supérieure à celle de son comparateur le plus proche par taille de batterie parmi les SUV, le Kia EV3 Long Range (${kw(cmp.chargingDC)}) — pourtant la charge de 10 à 80 % selon EV Database reste ${masc(rel(v.chargingTime10to80 ?? 0, cmp.chargingTime10to80 ?? 0))} (${formatNumber(v.chargingTime10to80 ?? 0)} minutes contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes), la puissance maximale n'étant tenue que sur une partie de la charge.

Son autonomie WLTP, ${km(v.rangeWltp)}, est ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'EV3 (${km(cmp.rangeWltp)}) pour une batterie quasi identique (${kwh(v.batteryUsable)} utiles).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — inférieur à celui de l'EV3 (${formatNumber(cmp.trunkVolume ?? 0)} L) —, il convient à un usage routier régulier plutôt qu'au transport de bagages volumineux. Son poids à vide, ${kg(v.weight ?? 0)}, dépasse celui de l'EV3 (${kg(cmp.weight ?? 0)}), et sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, lui reste supérieure. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, devance nettement celle de l'EV3 (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s).`;
    },
  },

  "hyundai/ioniq-5": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "kia", "ev6");
      return `Le Hyundai Ioniq 5 84 kWh RWD partage sa plateforme (et sa batterie, ${kwh(v.batteryUsable)} utiles) avec le Kia EV6 Long Range AWD, le SUV le plus proche techniquement dans notre catalogue : même capacité, même charge rapide DC selon EV Database (${kw(v.chargingDC)}), parmi les plus élevées de notre base. Leur temps de charge 10 à 80 % diffère à peine : ${formatNumber(v.chargingTime10to80 ?? 0)} minutes pour l'Ioniq 5, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour l'EV6.

L'écart se joue sur la transmission et la puissance : propulsion simple et ${formatNumber(v.powerKw)} kW pour l'Ioniq 5, contre transmission intégrale et ${formatNumber(cmp.powerKw)} kW pour l'EV6, soit une accélération 0 à 100 km/h ${rel(cmp.acceleration0to100 ?? 0, v.acceleration0to100 ?? 0) === "supérieure" ? "plus longue" : "plus courte"} pour ce dernier.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, il convient à un usage familial polyvalent, sans la motricité supplémentaire de l'EV6 par mauvais temps. Son poids à vide, ${kg(v.weight ?? 0)}, reste inférieur à celui de l'EV6 (${kg(cmp.weight ?? 0)}), et sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, légèrement aussi.`;
    },
  },

  "kia/ev6": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "hyundai", "ioniq-5");
      return `Avec ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch) et une transmission intégrale, le Kia EV6 Long Range AWD est, avec le Hyundai Ioniq 5 84 kWh RWD, l'un des SUV à la charge rapide DC la plus élevée de notre catalogue : ${kw(v.chargingDC)} selon EV Database, pour une charge de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour l'Ioniq 5, à batterie identique (${kwh(v.batteryUsable)} utiles).

Son autonomie WLTP, ${km(v.rangeWltp)}, est ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de l'Ioniq 5 (${km(cmp.rangeWltp)}) : la transmission intégrale et la puissance supplémentaire pèsent sur la consommation.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, il convient à un usage routier dynamique ou par faible adhérence, là où l'Ioniq 5, plus sobre, suffit pour un usage familial courant. Son poids à vide, ${kg(v.weight ?? 0)}, dépasse légèrement celui de l'Ioniq 5 (${kg(cmp.weight ?? 0)}), et sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, lui est également supérieure.`;
    },
  },

  "bmw/ix3": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "mercedes-benz", "gla");
      return `Le BMW iX3 40 affiche la puissance de charge DC la plus élevée des SUV à propulsion de notre catalogue à cette taille de batterie selon EV Database : ${kw(v.chargingDC)}, pour une charge de 10 à 80 % en seulement ${formatNumber(v.chargingTime10to80 ?? 0)} minutes. Face à la Mercedes-Benz GLA 250+, le SUV le plus proche par taille de batterie (${kwh(cmp.batteryUsable)} utiles contre ${kwh(v.batteryUsable)}), la GLA met ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes malgré une charge DC elle aussi élevée (${kw(cmp.chargingDC)}).

Son autonomie WLTP, ${km(v.rangeWltp)}, reste ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de la GLA (${km(cmp.rangeWltp)}) pour une puissance supérieure (${formatNumber(v.powerKw)} kW contre ${formatNumber(cmp.powerKw)} kW).

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L, il convient à un usage routier régulier et aux longs trajets, sa charge rapide limitant le temps d'arrêt par rapport à la plupart des SUV de notre catalogue. Son poids à vide, ${kg(v.weight ?? 0)}, reste inférieur à celui de la GLA (${kg(cmp.weight ?? 0)}).`;
    },
  },

  "mercedes-benz/gla": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "renault", "scenic-e-tech");
      const cons = (v.batteryUsable / v.rangeWltp) * 100;
      const consCmp = (cmp.batteryUsable / cmp.rangeWltp) * 100;
      return `Consommation calculée d'environ ${formatNumber(cons, 1)} kWh/100 km, charge 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database : la Mercedes-Benz GLA 250+ mise sur l'efficience et la vitesse de charge plutôt que sur le volume. Le Renault Scénic E-Tech EV87 220 ch, le SUV dont la batterie se rapproche le plus de la sienne dans notre base (${kwh(cmp.batteryUsable)} utiles contre ${kwh(v.batteryUsable)}), consomme davantage (${formatNumber(consCmp, 1)} kWh/100 km) et met ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour la même charge.

Son autonomie WLTP, ${km(v.rangeWltp)}, reste ${relTo(v.rangeWltp, cmp.rangeWltp)} celle du Scénic (${km(cmp.rangeWltp)}) malgré une batterie légèrement plus petite. Sa puissance, ${formatNumber(v.powerKw)} kW, dépasse nettement celle du Scénic (${formatNumber(cmp.powerKw)} kW).

Le coffre du Scénic (${formatNumber(cmp.trunkVolume ?? 0)} L) dépasse largement celui de la GLA (${formatNumber(v.trunkVolume ?? 0)} L) : avec ${formatNumber(v.seats)} places, la GLA convient surtout à un usage routier et longue distance, pas au transport familial de bagages volumineux. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, devance nettement celle du Scénic (${formatNumber(cmp.topSpeed ?? 0)} km/h).`;
    },
  },

  "renault/scenic-e-tech": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "mercedes-benz", "gla");
      return `Le Renault Scénic E-Tech EV87 220 ch affiche le temps de charge 10 à 80 % le plus long des SUV comparés à cette taille de batterie dans notre catalogue selon EV Database : ${formatNumber(v.chargingTime10to80 ?? 0)} minutes, contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes pour la Mercedes-Benz GLA 250+, le SUV le plus proche par taille de batterie. Son autonomie WLTP, ${km(v.rangeWltp)}, reste ${relTo(v.rangeWltp, cmp.rangeWltp)} celle de la GLA (${km(cmp.rangeWltp)}).

Son coffre, ${formatNumber(v.trunkVolume ?? 0)} L, dépasse nettement celui de la GLA (${formatNumber(cmp.trunkVolume ?? 0)} L), pour un poids à vide ${masc(rel(v.weight ?? 0, cmp.weight ?? 0))} (${kg(v.weight ?? 0)} contre ${kg(cmp.weight ?? 0)}). Sa puissance AC, ${kw(v.chargingAC)}, dépasse nettement les ${kw(cmp.chargingAC)} de la GLA.

Avec ${formatNumber(v.seats)} places, il convient à un usage familial avec des bagages volumineux ; son temps de charge DC plus long demande d'anticiper davantage les arrêts sur de longs trajets autoroutiers que la GLA. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, reste nettement inférieure à celle de la GLA (${formatNumber(cmp.topSpeed ?? 0)} km/h).`;
    },
  },

  "porsche/macan": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "peugeot", "e-3008");
      return `Avec ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch) et une transmission intégrale, le Porsche Macan 4 Electric est le SUV le plus puissant de notre catalogue : 0 à 100 km/h en ${formatNumber(v.acceleration0to100 ?? 0, 1)} s selon EV Database, loin devant le Peugeot e-3008 97 kWh Long Range (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s), le SUV dont la batterie se rapproche le plus de la sienne (${kwh(cmp.batteryUsable)} utiles contre ${kwh(v.batteryUsable)}).

Sa charge rapide DC, ${kw(v.chargingDC)}, est nettement ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle de l'e-3008 (${kw(cmp.chargingDC)}) : 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes contre ${formatNumber(cmp.chargingTime10to80 ?? 0)} minutes selon EV Database.

Avec ${formatNumber(v.seats)} places et un coffre de ${formatNumber(v.trunkVolume ?? 0)} L — inférieur à celui de l'e-3008 (${formatNumber(cmp.trunkVolume ?? 0)} L) —, il convient à un usage routier dynamique plutôt qu'au transport familial de bagages volumineux, pour lequel l'e-3008 offre davantage de marge. Son poids à vide, ${kg(v.weight ?? 0)}, dépasse nettement celui de l'e-3008 (${kg(cmp.weight ?? 0)}), malgré sa vocation plus sportive.`;
    },
  },

  "peugeot/e-3008": {
    text: (vs, all) => {
      const v = vs[0];
      const cmp = find(all, "porsche", "macan");
      return `Le coffre du Peugeot e-3008 97 kWh Long Range, ${formatNumber(v.trunkVolume ?? 0)} L, dépasse celui du Porsche Macan 4 Electric (${formatNumber(cmp.trunkVolume ?? 0)} L), le SUV dont la batterie se rapproche le plus de la sienne dans notre catalogue (${kwh(cmp.batteryUsable)} utiles contre ${kwh(v.batteryUsable)}) — un écart qui tient à la vocation familiale de l'e-3008 plutôt qu'à sa mécanique, bien moins puissante (${formatNumber(v.powerKw)} kW contre ${formatNumber(cmp.powerKw)} kW pour le Macan).

Son autonomie WLTP, ${km(v.rangeWltp)} selon EV Database, est ${relTo(v.rangeWltp, cmp.rangeWltp)} celle du Macan (${km(cmp.rangeWltp)}). Sa charge rapide DC, ${kw(v.chargingDC)}, reste ${relTo(v.chargingDC ?? 0, cmp.chargingDC ?? 0)} celle du Macan (${kw(cmp.chargingDC)}), pour une charge de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon EV Database. Son accélération 0 à 100 km/h, ${formatNumber(v.acceleration0to100 ?? 0, 1)} s, reste nettement plus longue que celle du Macan (${formatNumber(cmp.acceleration0to100 ?? 0, 1)} s).

Avec ${formatNumber(v.seats)} places et un poids à vide de ${kg(v.weight ?? 0)}, il convient à un usage familial avec de longs trajets occasionnels, portés par son grand coffre, plutôt qu'à un usage sportif où le Macan a l'avantage. Sa vitesse maximale, ${formatNumber(v.topSpeed ?? 0)} km/h, reste nettement inférieure à celle du Macan (${formatNumber(cmp.topSpeed ?? 0)} km/h).`;
    },
  },
};
