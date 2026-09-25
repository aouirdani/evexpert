import type { Vehicle } from "@/types";
import { formatNumber } from "@/lib/format";

/**
 * Contenu éditorial des pages marque (lot SEO 2), rédigé individuellement pour chacune des 16
 * marques à au moins 2 modèles — pas de gabarit de phrase commun. Chaque fait chiffré est lu
 * directement sur les véhicules passés en argument (jamais une valeur écrite en dur) : le texte
 * reste donc exact si le catalogue change, seule sa formulation est propre à la marque.
 *
 * `usage` remplace la FAQ par une section « Pour quel usage ? » : une orientation par cas d'usage
 * (ville, longs trajets, famille) avec les chiffres qui la justifient, jamais un classement ni une
 * « meilleure » version. Quand la gamme d'une marque ne permet pas de distinguer réellement les
 * usages (autonomies ou coffres trop proches), `note` l'indique en une phrase plutôt que de forcer
 * trois orientations artificielles.
 */

export interface BrandUsagePoint {
  usage: string;
  text: string;
}

export interface BrandUsage {
  points?: BrandUsagePoint[];
  note?: string;
}

export interface BrandContent {
  intro: (vs: Vehicle[]) => string;
  usage: (vs: Vehicle[]) => BrandUsage;
}

const driveLabel = { FWD: "traction avant", RWD: "propulsion arrière", AWD: "4 roues motrices" } as const;

function byModel(vs: Vehicle[], model: string): Vehicle {
  const v = vs.find((x) => x.model === model);
  if (!v) throw new Error(`brand-content: modèle "${model}" introuvable dans le catalogue`);
  return v;
}

const km = (n: number) => `${formatNumber(n)} km`;
const kwh = (n: number) => `${formatNumber(n, 1)} kWh`;
const L = (n: number | null) => (n === null ? "non disponible" : `${formatNumber(n)} L`);

export const BRAND_CONTENT: Record<string, BrandContent> = {
  bmw: {
    intro: (vs) => {
      const ix1 = byModel(vs, "iX1");
      const i4 = byModel(vs, "i4");
      const ix3 = byModel(vs, "iX3");
      return `Chez BMW, l'offre électrique de notre base se répartit sur deux carrosseries : SUV (iX1, iX3) et berline (i4). L'iX1 (${driveLabel[ix1.drive]}) affiche ${km(ix1.rangeWltp)} d'autonomie WLTP pour ${kwh(ix1.batteryUsable)} utiles ; l'i4 (${driveLabel[i4.drive]}) monte à ${km(i4.rangeWltp)} ; l'iX3 (${driveLabel[ix3.drive]}) est la plus autonome à ${km(ix3.rangeWltp)}, avec la charge DC la plus rapide de la gamme (${formatNumber(ix3.chargingDC ?? 0)} kW, 10 → 80 % en ${formatNumber(ix3.chargingTime10to80 ?? 0)} min selon la source).`;
    },
    usage: (vs) => {
      const ix1 = byModel(vs, "iX1");
      const i4 = byModel(vs, "i4");
      const ix3 = byModel(vs, "iX3");
      return {
        points: [
          { usage: "Ville et trajets courts", text: `L'iX1 est le plus compact des trois (${formatNumber(ix1.dimensions.length)} mm), pour ${km(ix1.rangeWltp)} d'autonomie WLTP.` },
          { usage: "Longs trajets", text: `L'iX3 combine la plus grande autonomie (${km(ix3.rangeWltp)}) et la charge DC la plus rapide (${formatNumber(ix3.chargingDC ?? 0)} kW, 10 → 80 % en ${formatNumber(ix3.chargingTime10to80 ?? 0)} min).` },
          { usage: "Coffre et usage familial", text: `L'iX3 a aussi le plus grand coffre (${L(ix3.trunkVolume)}) ; l'i4, en berline, en propose ${L(i4.trunkVolume)}.` },
        ],
      };
    },
  },

  byd: {
    intro: (vs) => {
      const ds = byModel(vs, "Dolphin Surf");
      const atto3 = byModel(vs, "Atto 3 Evo");
      const seal = byModel(vs, "Seal");
      return `BYD est la seule marque de notre base à couvrir trois carrosseries différentes avec trois transmissions différentes : la citadine Dolphin Surf (${driveLabel[ds.drive]}, ${km(ds.rangeWltp)}), le SUV Atto 3 Evo (${driveLabel[atto3.drive]}, ${km(atto3.rangeWltp)}) et la berline Seal (${driveLabel[seal.drive]}, ${km(seal.rangeWltp)}) — cette dernière la plus autonome des trois selon la source.`;
    },
    usage: (vs) => {
      const ds = byModel(vs, "Dolphin Surf");
      const atto3 = byModel(vs, "Atto 3 Evo");
      const seal = byModel(vs, "Seal");
      return {
        points: [
          { usage: "Ville", text: `La Dolphin Surf est la plus courte (${formatNumber(ds.dimensions.length)} mm) et la moins chère à recharger, avec ${km(ds.rangeWltp)} d'autonomie.` },
          { usage: "Usage familial", text: `L'Atto 3 Evo, SUV, offre le plus grand coffre du trio (${L(atto3.trunkVolume)}).` },
          { usage: "Longs trajets", text: `La Seal, à 4 roues motrices, cumule l'autonomie la plus élevée (${km(seal.rangeWltp)}) — sa charge DC (${formatNumber(seal.chargingDC ?? 0)} kW) reste toutefois en retrait de l'Atto 3 Evo (${formatNumber(atto3.chargingDC ?? 0)} kW).` },
        ],
      };
    },
  },

  citroen: {
    intro: (vs) => {
      const c3 = byModel(vs, "ë-C3");
      const aircross = byModel(vs, "ë-C3 Aircross");
      return `Citroën décline sa citadine ë-C3 (${km(c3.rangeWltp)} d'autonomie WLTP, ${kwh(c3.batteryUsable)} utiles) en version SUV avec l'ë-C3 Aircross (${km(aircross.rangeWltp)}, ${kwh(aircross.batteryUsable)}) : les deux partagent la même transmission (${driveLabel[c3.drive]}) et un écart d'autonomie de ${formatNumber(aircross.rangeWltp - c3.rangeWltp)} km selon la source.`;
    },
    usage: (vs) => {
      const c3 = byModel(vs, "ë-C3");
      const aircross = byModel(vs, "ë-C3 Aircross");
      return {
        note: `Les deux carrosseries restent proches en autonomie (${km(c3.rangeWltp)} pour l'ë-C3, ${km(aircross.rangeWltp)} pour l'ë-C3 Aircross) et en puissance de charge DC (${formatNumber(c3.chargingDC ?? 0)}-${formatNumber(aircross.chargingDC ?? 0)} kW) : le choix tient surtout au coffre (${L(c3.trunkVolume)} contre ${L(aircross.trunkVolume)}) et à la carrosserie, pas à un usage longue distance qu'aucune des deux ne vise en particulier.`,
      };
    },
  },

  fiat: {
    intro: (vs) => {
      const panda = byModel(vs, "Grande Panda");
      const cinq = byModel(vs, "500e");
      return `Les deux citadines électriques de Fiat affichent une autonomie WLTP proche : ${km(panda.rangeWltp)} pour la Grande Panda (${kwh(panda.batteryUsable)} utiles), ${km(cinq.rangeWltp)} pour la 500e (${kwh(cinq.batteryUsable)}) — cette dernière nettement plus courte (${formatNumber(cinq.dimensions.length)} mm contre ${formatNumber(panda.dimensions.length)} mm) mais avec un coffre bien plus réduit.`;
    },
    usage: (vs) => {
      const panda = byModel(vs, "Grande Panda");
      const cinq = byModel(vs, "500e");
      return {
        note: `Les deux sont des citadines pensées pour la ville : ni l'une ni l'autre ne se distingue pour les longs trajets (autonomie sous ${km(Math.max(panda.rangeWltp, cinq.rangeWltp))}, charge DC limitée à ${formatNumber(panda.chargingDC ?? 0)}-${formatNumber(cinq.chargingDC ?? 0)} kW) ni pour un usage familial (coffres de ${L(cinq.trunkVolume)} et ${L(panda.trunkVolume)}). Le choix se fait sur le format et le style plus que sur l'usage.`,
      };
    },
  },

  ford: {
    intro: (vs) => {
      const puma = byModel(vs, "Puma Gen-E");
      const explorer = byModel(vs, "Explorer");
      return `Ford aligne deux SUV électriques dans notre base : le Puma Gen-E, compact (${formatNumber(puma.dimensions.length)} mm, ${km(puma.rangeWltp)}, ${driveLabel[puma.drive]}), et l'Explorer, plus grand et plus autonome (${formatNumber(explorer.dimensions.length)} mm, ${km(explorer.rangeWltp)}, ${driveLabel[explorer.drive]}).`;
    },
    usage: (vs) => {
      const puma = byModel(vs, "Puma Gen-E");
      const explorer = byModel(vs, "Explorer");
      return {
        points: [
          { usage: "Ville et trajets courts", text: `Le Puma Gen-E charge le plus vite du duo (10 → 80 % en ${formatNumber(puma.chargingTime10to80 ?? 0)} min) pour des recharges fréquentes en journée.` },
          { usage: "Longs trajets", text: `L'Explorer offre ${km(explorer.rangeWltp)} d'autonomie WLTP, contre ${km(puma.rangeWltp)} pour le Puma Gen-E.` },
          { usage: "Usage familial", text: `Les deux ont un coffre proche et généreux pour la catégorie (${L(puma.trunkVolume)} et ${L(explorer.trunkVolume)}).` },
        ],
      };
    },
  },

  hyundai: {
    intro: (vs) => {
      const inster = byModel(vs, "INSTER");
      const kona = byModel(vs, "Kona Electric");
      const ioniq5 = byModel(vs, "IONIQ 5");
      return `Trois SUV électriques chez Hyundai dans notre base, du plus compact au plus autonome : l'INSTER (${formatNumber(inster.dimensions.length)} mm, ${km(inster.rangeWltp)}), le Kona Electric (${km(kona.rangeWltp)}) et l'IONIQ 5 (${km(ioniq5.rangeWltp)}), ce dernier chargeant en DC jusqu'à ${formatNumber(ioniq5.chargingDC ?? 0)} kW selon la source — la puissance la plus élevée des trois.`;
    },
    usage: (vs) => {
      const inster = byModel(vs, "INSTER");
      const kona = byModel(vs, "Kona Electric");
      const ioniq5 = byModel(vs, "IONIQ 5");
      return {
        points: [
          { usage: "Ville", text: `L'INSTER est le plus court (${formatNumber(inster.dimensions.length)} mm) avec ${km(inster.rangeWltp)} d'autonomie, suffisants pour un usage quotidien.` },
          { usage: "Longs trajets", text: `L'IONIQ 5 associe la plus grande autonomie (${km(ioniq5.rangeWltp)}) et la charge la plus rapide (10 → 80 % en ${formatNumber(ioniq5.chargingTime10to80 ?? 0)} min).` },
          { usage: "Usage familial", text: `Le Kona Electric (${L(kona.trunkVolume)} de coffre) se situe entre les deux, pour un usage plus généraliste.` },
        ],
      };
    },
  },

  kia: {
    intro: (vs) => {
      const ev3 = byModel(vs, "EV3");
      const ev6 = byModel(vs, "EV6");
      return `Kia propose deux SUV électriques dans notre base : l'EV3 (${driveLabel[ev3.drive]}, ${km(ev3.rangeWltp)} d'autonomie WLTP) et l'EV6 (${driveLabel[ev6.drive]}, ${km(ev6.rangeWltp)}), ce dernier plus rapide à recharger malgré une autonomie plus courte : 10 → 80 % en ${formatNumber(ev6.chargingTime10to80 ?? 0)} min contre ${formatNumber(ev3.chargingTime10to80 ?? 0)} min pour l'EV3, selon la source.`;
    },
    usage: (vs) => {
      const ev3 = byModel(vs, "EV3");
      const ev6 = byModel(vs, "EV6");
      return {
        points: [
          { usage: "Longs trajets, peu d'arrêts", text: `L'EV3 offre la plus grande autonomie (${km(ev3.rangeWltp)}), pour espacer les recharges.` },
          { usage: "Longs trajets, arrêts courts", text: `L'EV6 recharge 10 → 80 % en ${formatNumber(ev6.chargingTime10to80 ?? 0)} min (contre ${formatNumber(ev3.chargingTime10to80 ?? 0)} pour l'EV3) : moins d'autonomie, mais des arrêts plus courts.` },
          { usage: "Usage familial", text: `Les deux sont des SUV 5 places avec un coffre proche (${L(ev3.trunkVolume)} et ${L(ev6.trunkVolume)}) ; l'EV6 ajoute les 4 roues motrices.` },
        ],
      };
    },
  },

  "mercedes-benz": {
    intro: (vs) => {
      const cla = byModel(vs, "CLA");
      const gla = byModel(vs, "GLA");
      return `La CLA (berline) et le GLA (SUV) partagent chez Mercedes-Benz la même transmission (${driveLabel[cla.drive]}) et la même puissance de charge DC (${formatNumber(cla.chargingDC ?? 0)} kW, 10 → 80 % en ${formatNumber(cla.chargingTime10to80 ?? 0)} min selon la source) ; seule l'autonomie WLTP les distingue nettement, ${km(cla.rangeWltp)} pour la CLA contre ${km(gla.rangeWltp)} pour le GLA.`;
    },
    usage: (vs) => {
      const cla = byModel(vs, "CLA");
      const gla = byModel(vs, "GLA");
      return {
        note: `Les deux visent déjà les longs trajets : autonomie WLTP élevée (${km(gla.rangeWltp)} et ${km(cla.rangeWltp)}) et charge DC identique et rapide (${formatNumber(cla.chargingDC ?? 0)} kW, ${formatNumber(cla.chargingTime10to80 ?? 0)} min). Aucune des deux ne se distingue particulièrement pour un usage urbain ; le choix entre la CLA (berline, ${L(cla.trunkVolume)}) et le GLA (SUV, ${L(gla.trunkVolume)}) tient à la carrosserie plus qu'à l'usage.`,
      };
    },
  },

  mg: {
    intro: (vs) => {
      const mg4 = byModel(vs, "MG4");
      const mgs5 = byModel(vs, "MGS5");
      return `La MG4 (compacte, ${driveLabel[mg4.drive]}) et la MGS5 (SUV, ${driveLabel[mgs5.drive]}) affichent respectivement ${km(mg4.rangeWltp)} et ${km(mgs5.rangeWltp)} d'autonomie WLTP ; la MG4, malgré son format plus compact, a le plus grand coffre des deux selon la source (${L(mg4.trunkVolume)} contre ${L(mgs5.trunkVolume)}).`;
    },
    usage: (vs) => {
      const mg4 = byModel(vs, "MG4");
      const mgs5 = byModel(vs, "MGS5");
      return {
        points: [
          { usage: "Usage quotidien et bagages", text: `La MG4 combine ${km(mg4.rangeWltp)} d'autonomie et un grand coffre (${L(mg4.trunkVolume)}) pour une compacte.` },
          { usage: "Trajets plus longs", text: `La MGS5 (${km(mgs5.rangeWltp)}, ${driveLabel[mgs5.drive]}) vise un usage SUV plus classique.` },
        ],
      };
    },
  },

  opel: {
    intro: (vs) => {
      const corsa = byModel(vs, "Corsa Electric");
      const mokka = byModel(vs, "Mokka Electric");
      return `La Corsa Electric (citadine) et le Mokka Electric (SUV) partagent chez Opel une autonomie WLTP quasi identique (${km(corsa.rangeWltp)} contre ${km(mokka.rangeWltp)}, un écart de ${formatNumber(Math.abs(mokka.rangeWltp - corsa.rangeWltp))} km) et la même transmission (${driveLabel[corsa.drive]}) ; seuls le coffre (${L(corsa.trunkVolume)} contre ${L(mokka.trunkVolume)}) et la carrosserie diffèrent vraiment.`;
    },
    usage: (vs) => {
      const corsa = byModel(vs, "Corsa Electric");
      const mokka = byModel(vs, "Mokka Electric");
      return {
        note: `L'autonomie WLTP (${km(corsa.rangeWltp)} et ${km(mokka.rangeWltp)}) et la charge DC (10 → 80 % en ${formatNumber(corsa.chargingTime10to80 ?? 0)} min pour les deux, selon la source) sont trop proches pour distinguer un usage ville/longs trajets : le choix entre Corsa Electric et Mokka Electric tient au format (citadine ou SUV) et au coffre, pas à l'autonomie.`,
      };
    },
  },

  peugeot: {
    intro: (vs) => {
      const e208 = byModel(vs, "e-208");
      const e2008 = byModel(vs, "e-2008");
      const e3008 = byModel(vs, "e-3008");
      return `Peugeot couvre trois gabarits électriques dans notre base : la citadine e-208 (${km(e208.rangeWltp)}), le SUV compact e-2008 (${km(e2008.rangeWltp)}) et le grand SUV e-3008 (${km(e3008.rangeWltp)}, ${kwh(e3008.batteryUsable)} utiles) — sa version « Long Range » explique l'écart d'autonomie de ${formatNumber(e3008.rangeWltp - e208.rangeWltp)} km avec l'e-208, selon la source.`;
    },
    usage: (vs) => {
      const e208 = byModel(vs, "e-208");
      const e2008 = byModel(vs, "e-2008");
      const e3008 = byModel(vs, "e-3008");
      return {
        points: [
          { usage: "Ville", text: `L'e-208 est la plus compacte (${formatNumber(e208.dimensions.length)} mm) pour ${km(e208.rangeWltp)} d'autonomie.` },
          { usage: "Usage familial courant", text: `L'e-2008, SUV, ajoute du coffre (${L(e2008.trunkVolume)}) pour une autonomie proche de l'e-208.` },
          { usage: "Longs trajets et grandes familles", text: `L'e-3008 « Long Range » cumule la plus grande autonomie (${km(e3008.rangeWltp)}) et le plus grand coffre (${L(e3008.trunkVolume)}).` },
        ],
      };
    },
  },

  renault: {
    intro: (vs) => {
      const twingo = byModel(vs, "Twingo E-Tech");
      const scenic = byModel(vs, "Scénic E-Tech");
      const citadines = vs.filter((v) => v.bodyType === "citadine").map((v) => v.model);
      const suvs = vs.filter((v) => v.bodyType === "SUV").map((v) => v.model);
      const compactes = vs.filter((v) => v.bodyType === "compacte").map((v) => v.model);
      return `Renault propose ${vs.length} modèles électriques dans notre base : des citadines (${citadines.join(", ")}), des SUV (${suvs.join(", ")}) et une compacte (${compactes.join(", ")}), tous à ${driveLabel.FWD}. L'autonomie WLTP s'étend de ${km(twingo.rangeWltp)} pour la Twingo E-Tech, la plus compacte (${formatNumber(twingo.dimensions.length)} mm), à ${km(scenic.rangeWltp)} pour le Scénic E-Tech, pour des batteries utiles de ${kwh(twingo.batteryUsable)} à ${kwh(scenic.batteryUsable)} selon la source.`;
    },
    usage: (vs) => {
      const twingo = byModel(vs, "Twingo E-Tech");
      const scenic = byModel(vs, "Scénic E-Tech");
      const cinq = byModel(vs, "5 E-Tech");
      return {
        points: [
          { usage: "Ville", text: `La Twingo E-Tech (${km(twingo.rangeWltp)}) est la plus compacte de la gamme (${formatNumber(twingo.dimensions.length)} mm) ; la 5 E-Tech (${km(cinq.rangeWltp)}) reste une citadine mais avec davantage d'autonomie.` },
          { usage: "Longs trajets et famille", text: `Le Scénic E-Tech cumule la plus grande autonomie (${km(scenic.rangeWltp)}) et le plus grand coffre de la gamme (${L(scenic.trunkVolume)}), avec la charge DC la plus puissante (${formatNumber(scenic.chargingDC ?? 0)} kW).` },
        ],
        note: "Le 4 E-Tech et le Mégane E-Tech couvrent l'intermédiaire, entre citadine et Scénic E-Tech.",
      };
    },
  },

  skoda: {
    intro: (vs) => {
      const elroq = byModel(vs, "Elroq");
      const enyaq = byModel(vs, "Enyaq");
      return `L'Elroq et l'Enyaq, les deux SUV électriques de Škoda dans notre base, affichent une autonomie WLTP très proche (${km(elroq.rangeWltp)} et ${km(enyaq.rangeWltp)}, un écart de ${formatNumber(enyaq.rangeWltp - elroq.rangeWltp)} km) et la même transmission (${driveLabel[elroq.drive]}) ; l'Enyaq, plus long (${formatNumber(enyaq.dimensions.length)} mm contre ${formatNumber(elroq.dimensions.length)} mm), a le plus grand coffre des deux (${L(enyaq.trunkVolume)}).`;
    },
    usage: (vs) => {
      const elroq = byModel(vs, "Elroq");
      const enyaq = byModel(vs, "Enyaq");
      return {
        note: `Avec des autonomies quasi identiques (${km(elroq.rangeWltp)} et ${km(enyaq.rangeWltp)}), le choix entre Elroq et Enyaq ne se fait pas sur la distance parcourue : l'Enyaq, avec ${L(enyaq.trunkVolume)} de coffre, convient mieux à un usage familial ; l'Elroq, plus compact, se prête davantage à un usage quotidien.`,
      };
    },
  },

  tesla: {
    intro: (vs) => {
      const m3rwd = vs.find((v) => v.model === "Model 3" && v.version === "RWD")!;
      const m3lr = vs.find((v) => v.model === "Model 3" && v.version === "Long Range RWD")!;
      const myrwd = vs.find((v) => v.model === "Model Y" && v.version === "RWD")!;
      return `Tesla est la seule marque de notre base à proposer deux versions par modèle : Model 3 (berline) et Model Y (SUV), chacun en propulsion « RWD » ou en version longue autonomie. Le Model 3 RWD affiche ${km(m3rwd.rangeWltp)}, sa version longue autonomie ${km(m3lr.rangeWltp)} — la plus élevée des quatre versions ; le Model Y RWD (${km(myrwd.rangeWltp)}) a lui le plus grand coffre, ${L(myrwd.trunkVolume)}, selon la source.`;
    },
    usage: (vs) => {
      const m3lr = vs.find((v) => v.model === "Model 3" && v.version === "Long Range RWD")!;
      const myrwd = vs.find((v) => v.model === "Model Y" && v.version === "RWD")!;
      const mylr = vs.find((v) => v.model === "Model Y" && v.version === "Long Range AWD")!;
      const m3rwd = vs.find((v) => v.model === "Model 3" && v.version === "RWD")!;
      return {
        points: [
          { usage: "Longs trajets", text: `Le Model 3 Long Range RWD a l'autonomie la plus élevée de la gamme (${km(m3lr.rangeWltp)}).` },
          { usage: "Usage familial", text: `Le Model Y, quelle que soit la version, a le plus grand coffre (${L(myrwd.trunkVolume)}) ; sa version Long Range AWD (${km(mylr.rangeWltp)}) ajoute la traction intégrale.` },
          { usage: "Usage quotidien", text: `Les versions RWD de base (Model 3 : ${km(m3rwd.rangeWltp)}, Model Y : ${km(myrwd.rangeWltp)}) rechargent 10 → 80 % en ${formatNumber(m3rwd.chargingTime10to80 ?? 0)} min, plus vite que les versions longue autonomie (${formatNumber(m3lr.chargingTime10to80 ?? 0)} min).` },
        ],
      };
    },
  },

  volkswagen: {
    intro: (vs) => {
      const id4 = byModel(vs, "ID.4");
      const id7 = byModel(vs, "ID.7");
      return `L'ID.4 (SUV, ${km(id4.rangeWltp)}) et l'ID.7 (berline, ${km(id7.rangeWltp)}) partagent la même transmission (${driveLabel[id4.drive]}) chez Volkswagen ; l'ID.7 a l'autonomie WLTP la plus élevée des deux, avec ${formatNumber(id7.rangeWltp - id4.rangeWltp)} km d'écart selon la source, pour une batterie utile plus grande (${kwh(id7.batteryUsable)} contre ${kwh(id4.batteryUsable)}).`;
    },
    usage: (vs) => {
      const id4 = byModel(vs, "ID.4");
      const id7 = byModel(vs, "ID.7");
      return {
        points: [
          { usage: "Usage quotidien et familial", text: `L'ID.4, SUV, offre ${L(id4.trunkVolume)} de coffre pour ${km(id4.rangeWltp)} d'autonomie.` },
          { usage: "Longs trajets", text: `L'ID.7, berline, atteint ${km(id7.rangeWltp)} d'autonomie WLTP, la plus élevée des deux.` },
        ],
      };
    },
  },

  volvo: {
    intro: (vs) => {
      const ex30 = byModel(vs, "EX30");
      const ex40 = byModel(vs, "EX40");
      return `L'EX30 (${formatNumber(ex30.dimensions.length)} mm, ${km(ex30.rangeWltp)}) est le plus compact des deux SUV électriques de Volvo dans notre base ; l'EX40 (${formatNumber(ex40.dimensions.length)} mm, ${km(ex40.rangeWltp)}) le dépasse en taille comme en autonomie, avec une batterie utile plus grande (${kwh(ex40.batteryUsable)} contre ${kwh(ex30.batteryUsable)}) et la même transmission (${driveLabel[ex30.drive]}).`;
    },
    usage: (vs) => {
      const ex30 = byModel(vs, "EX30");
      const ex40 = byModel(vs, "EX40");
      return {
        points: [
          { usage: "Ville", text: `L'EX30 est le plus compact (${formatNumber(ex30.dimensions.length)} mm) pour ${km(ex30.rangeWltp)} d'autonomie, déjà confortable au quotidien.` },
          { usage: "Longs trajets et famille", text: `L'EX40 ajoute de l'autonomie (${km(ex40.rangeWltp)}) et du coffre (${L(ex40.trunkVolume)} contre ${L(ex30.trunkVolume)}).` },
        ],
      };
    },
  },
};
