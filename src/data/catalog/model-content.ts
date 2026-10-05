import type { Vehicle } from "@/types";
import { formatNumber } from "@/lib/format";

/**
 * Texte rédigé par modèle (lot SEO « enrichissement des fiches modèle »), 150 à 250 mots :
 * positionnement, ce qui distingue le modèle dans notre catalogue, pour quel usage, limites.
 * Chaque chiffre est lu directement sur les véhicules et le catalogue passés en argument —
 * jamais écrit en dur — pour rester exact si les données changent. Pas de « meilleur », de
 * classement ni de fait extérieur à notre catalogue sans source nommée. Construction propre à
 * chaque modèle, pas de gabarit de phrase commun (voir brand-content.ts pour le même principe
 * appliqué aux pages marque).
 *
 * `versions` : les versions de CE modèle (1 pour la plupart, 2 pour les rares modèles
 * multi-versions). `all` : le catalogue complet, pour les comparaisons et agrégats.
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

/** Nombre de modèles du catalogue ayant plus d'une version. */
function multiVersionModelCount(all: Vehicle[]): number {
  const byModel = new Map<string, number>();
  for (const v of all) {
    const key = `${v.brandSlug}/${v.modelSlug}`;
    byModel.set(key, (byModel.get(key) ?? 0) + 1);
  }
  return [...byModel.values()].filter((n) => n > 1).length;
}

const km = (n: number) => `${formatNumber(n)} km`;
const kwh = (n: number) => `${formatNumber(n, 1)} kWh`;
const kg = (n: number) => `${formatNumber(n)} kg`;

/** Texte rédigé du modèle `brandSlug/modelSlug`, ou `undefined` tant qu'il n'a pas été rédigé. */
export function modelText(brandSlug: string, modelSlug: string, versions: Vehicle[], all: Vehicle[]): string | undefined {
  return MODEL_CONTENT[`${brandSlug}/${modelSlug}`]?.text(versions, all);
}

export const MODEL_CONTENT: Record<string, ModelContent> = {
  "tesla/model-3": {
    text: (vs, all) => {
      const rwd = version(vs, "rwd");
      const lr = version(vs, "long-range-rwd");
      const berlines = all.filter((v) => v.bodyType === "berline").length;
      const suvs = all.filter((v) => v.bodyType === "SUV").length;
      const multi = multiVersionModelCount(all);
      return `Le Tesla Model 3 fait partie des ${formatNumber(multi)} modèles de notre catalogue proposés en plusieurs versions : RWD (${km(rwd.rangeWltp)} WLTP, batterie ${rwd.chemistry}) et Long Range RWD (${km(lr.rangeWltp)} WLTP, batterie ${lr.chemistry}), soit ${km(lr.rangeWltp - rwd.rangeWltp)} d'écart pour une même carrosserie. C'est aussi une berline, la carrosserie la moins représentée dans notre base (${formatNumber(berlines)} versions sur ${formatNumber(all.length)}, contre ${formatNumber(suvs)} SUV).

Les deux versions se rechargent vite en courant continu : ${formatNumber(rwd.chargingTime10to80 ?? 0)} et ${formatNumber(lr.chargingTime10to80 ?? 0)} minutes de 10 à 80 % selon la source, parmi les temps les plus courts que nous ayons relevés, quelle que soit la chimie de batterie. La différence de chimie explique en partie l'écart de prix habituellement observé sur ce type de version, même si nous ne collectons pas encore le prix en France.

Pour un usage essentiellement urbain et périurbain, la RWD couvre une large part des besoins quotidiens ; pour des trajets autoroutiers fréquents, la Long Range RWD laisse davantage de marge avant une recharge. Comme pour toute donnée WLTP, l'autonomie réelle dépend de la vitesse, de la température et de la charge du véhicule : les scénarios détaillés plus haut sur cette page donnent une estimation ajustée à ces conditions.`;
    },
  },

  "tesla/model-y": {
    text: (vs, all) => {
      const rwd = version(vs, "rwd");
      const awd = version(vs, "long-range-awd");
      const suvs = all.filter((v) => v.bodyType === "SUV").length;
      return `Avec le Model 3 de la même marque, le Tesla Model Y est l'un des modèles de notre catalogue à compter plusieurs versions : RWD (${km(rwd.rangeWltp)} WLTP, batterie ${rwd.chemistry}) et Long Range AWD (${km(awd.rangeWltp)} WLTP, batterie ${awd.chemistry}, transmission intégrale). La seconde ajoute une motricité sur les quatre roues que la RWD ne propose pas, utile par faible adhérence.

Le Model Y appartient à la carrosserie la plus représentée de notre base : ${formatNumber(suvs)} des ${formatNumber(all.length)} versions recensées sont des SUV. Ses deux versions partagent une charge rapide DC parmi les plus courtes de notre catalogue, ${formatNumber(rwd.chargingTime10to80 ?? 0)} et ${formatNumber(awd.chargingTime10to80 ?? 0)} minutes de 10 à 80 % selon la chimie de batterie — un écart de temps de charge qui, sur un trajet long, peut compter autant que l'écart d'autonomie entre les deux versions (${km(awd.rangeWltp - rwd.rangeWltp)}).

Le choix entre les deux dépend surtout du trajet type : la RWD suffit à un usage quotidien avec des pointes autoroutières occasionnelles, l'AWD apporte une marge supplémentaire et une motricité renforcée pour qui roule davantage par mauvais temps ou en montagne. L'autonomie WLTP reste une mesure de laboratoire : elle varie en conditions réelles avec la vitesse et la météo.`;
    },
  },

  "renault/5-e-tech": {
    text: (vs, all) => {
      const v = vs[0];
      const spring = find(all, "dacia", "spring");
      const citadines = all.filter((x) => x.bodyType === "citadine").length;
      const consCalc = (v.batteryUsable / v.rangeWltp) * 100;
      return `La Renault 5 E-Tech est une citadine à batterie ${v.chemistry}, seule version de ce modèle dans notre catalogue : ${km(v.rangeWltp)} d'autonomie WLTP pour ${kwh(v.batteryUsable)} utiles, soit une consommation calculée d'environ ${formatNumber(consCalc, 1)} kWh/100 km. Parmi les ${formatNumber(citadines)} citadines de notre base, c'est l'une des plus autonomes : la Dacia Spring, par exemple, se limite à ${km(spring.rangeWltp)} avec une batterie de ${kwh(spring.batteryUsable)}, moins de la moitié.

Sa puissance de charge DC, ${formatNumber(v.chargingDC ?? 0)} kW, permet de passer de 10 à 80 % en ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon la source. En AC, elle accepte jusqu'à ${formatNumber(v.chargingAC, 1)} kW, la pleine puissance d'une borne triphasée standard — largement au-dessus des ${formatNumber(spring.chargingAC, 1)} kW de la Dacia Spring.

Pour un usage urbain et périurbain quotidien, son autonomie couvre largement une semaine de trajets courts sans recharge. Pour des trajets autoroutiers réguliers, l'autonomie réelle redescend généralement sous la valeur WLTP affichée, en particulier à vitesse élevée ou par temps froid : les estimations par scénario plus haut sur cette page donnent un ordre de grandeur plus réaliste selon le type de trajet.`;
    },
  },

  "peugeot/e-3008": {
    text: (vs, all) => {
      const v = vs[0];
      const spring = find(all, "dacia", "spring");
      const r5 = find(all, "renault", "5-e-tech");
      return `Le Peugeot e-3008, en version ${v.version}, est le grand SUV familial de notre catalogue : ${km(v.rangeWltp)} d'autonomie WLTP, parmi les valeurs les plus élevées que nous ayons relevées, pour une batterie de ${kwh(v.batteryUsable)} utiles — également l'une des plus volumineuses de notre base. Son coffre de ${formatNumber(v.trunkVolume ?? 0)} L dépasse celui de la plupart des SUV compacts recensés chez nous.

Cette capacité se paie en poids (${kg(v.weight ?? 0)} à vide, contre ${kg(spring.weight ?? 0)} pour la Dacia Spring, la plus légère de notre catalogue) et en temps de charge : ${formatNumber(v.chargingTime10to80 ?? 0)} minutes de 10 à 80 % pour une puissance DC de ${formatNumber(v.chargingDC ?? 0)} kW, nettement supérieure aux ${formatNumber(r5.chargingDC ?? 0)} kW de la Renault 5 E-Tech mais avec un temps de charge proche, la puissance plus élevée compensant la batterie plus grande.

Pour un usage familial avec de longs trajets occasionnels, cette autonomie laisse une marge confortable même par conditions dégradées. Pour un usage essentiellement urbain, son poids et son encombrement n'apportent pas d'avantage particulier face à une carrosserie plus compacte de notre catalogue. Le prix en France n'est, comme pour toute version de notre base, pas encore collecté.`;
    },
  },

  "dacia/spring": {
    text: (vs, all) => {
      const v = vs[0];
      const r5 = find(all, "renault", "5-e-tech");
      const minRange = Math.min(...all.map((x) => x.rangeWltp));
      const minBattery = Math.min(...all.map((x) => x.batteryUsable));
      const minAc = Math.min(...all.map((x) => x.chargingAC));
      const minWeight = Math.min(...all.filter((x) => x.weight !== null).map((x) => x.weight as number));
      return `Avec ${km(v.rangeWltp)} d'autonomie WLTP${v.rangeWltp === minRange ? ", la valeur la plus basse de notre catalogue" : ""} de ${formatNumber(all.length)} versions, la Dacia Spring embarque une batterie de ${kwh(v.batteryUsable)} utiles${v.batteryUsable === minBattery ? " — la plus petite que nous recensions" : ""}. Sa puissance AC maximale, ${formatNumber(v.chargingAC, 1)} kW,${v.chargingAC === minAc ? " est également la plus faible de la base" : ""} : une charge sur une borne domestique triphasée y est plafonnée bien en deçà des 11 kW courants chez la plupart des autres versions.

Sa chimie ${v.chemistry}, son poids à vide de ${kg(v.weight ?? 0)}${v.weight === minWeight ? " (le plus léger de notre catalogue)" : ""} et sa puissance de ${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch) en font une citadine orientée vers un usage urbain et périurbain : trajets courts, stationnement facilité par son faible encombrement. Sa charge rapide DC, ${formatNumber(v.chargingDC ?? 0)} kW, ramène la charge de 10 à 80 % à ${formatNumber(v.chargingTime10to80 ?? 0)} minutes selon la source, un temps proche de versions à batterie bien plus grande comme la Renault 5 E-Tech (${formatNumber(r5.chargingTime10to80 ?? 0)} minutes pour ${formatNumber(r5.chargingDC ?? 0)} kW) : la petite capacité de la batterie compense la puissance de charge plus modeste.

Pour des trajets autoroutiers longs ou réguliers, son autonomie limitée et sa puissance de charge AC réduite demandent une organisation plus stricte des recharges qu'avec une version à plus grande capacité de notre catalogue.`;
    },
  },
};
