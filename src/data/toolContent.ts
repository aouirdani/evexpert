import type { FaqItem } from "@/types";
import { ASSUMPTIONS } from "@/data/assumptions";
import {
  annualCost,
  computeChargingCost,
  computeChargingTime,
  computeRange,
  computeRunningCost,
  computeTco,
  computeTripPlan,
  costPer100km,
} from "@/lib/calculators";
import { formatEuro, formatNumber, minutesToHuman } from "@/lib/format";

/** Contenu éditorial d'une page outil (hors composant de calcul). */
export interface ToolContent {
  slug: string;
  intro: string[];
  formulas: { label: string; expr: string }[];
  /** Exemple chiffré : calculé à partir des fonctions réelles de l'outil. */
  example: () => { title: string; steps: string[] };
  limits: string[];
  faq: FaqItem[];
  relatedTools: string[];
  relatedGuides: string[];
  relatedVehicleIds: string[];
  updatedAt: string;
}

const UPDATED = "2026-09-21";
const eur = (v: number, d = 2) => formatEuro(v, d);

export const toolContent: Record<string, ToolContent> = {
  "cout-recharge-voiture-electrique": {
    slug: "cout-recharge-voiture-electrique",
    intro: [
      "Combien coûte une recharge, de 20 à 80 % ou de 0 à 100 % ? La réponse dépend de trois choses : l'énergie que la batterie doit recevoir, les pertes de charge, et le prix du kWh à l'endroit où vous vous branchez.",
      "Cet outil détaille chaque étape du calcul pour que vous puissiez vérifier le résultat, l'adapter à votre contrat d'électricité et l'utiliser pour comparer domicile, borne publique et recharge rapide.",
    ],
    formulas: [
      { label: "Énergie stockée", expr: "capacité utile × (état de charge visé − état de charge actuel) ÷ 100" },
      { label: "Énergie au compteur", expr: "énergie stockée ÷ rendement de charge" },
      { label: "Coût de la recharge", expr: "énergie au compteur × prix du kWh" },
      { label: "Autonomie ajoutée", expr: "énergie stockée ÷ consommation × 100" },
    ],
    example: () => {
      const r = computeChargingCost({ batteryCapacity: 60, currentSoc: 20, targetSoc: 80, electricityPrice: ASSUMPTIONS.homePrice, efficiency: ASSUMPTIONS.chargingEfficiency, consumption: 16 });
      return {
        title: "Exemple : batterie de 60 kWh utiles, de 20 à 80 %, à 0,25 €/kWh",
        steps: [
          `Énergie stockée : 60 × (80 − 20) ÷ 100 = ${formatNumber(r.energyStored, 1)} kWh`,
          `Énergie au compteur (rendement 90 %) : ${formatNumber(r.energyStored, 1)} ÷ 0,90 = ${formatNumber(r.gridEnergy, 1)} kWh`,
          `Coût : ${formatNumber(r.gridEnergy, 1)} × 0,25 = ${eur(r.cost)}`,
          `Autonomie ajoutée à 16 kWh/100 km : ${formatNumber(r.energyStored, 1)} ÷ 16 × 100 ≈ ${formatNumber(r.rangeAdded)} km, soit ${eur(r.costPer100km)} aux 100 km`,
        ],
      };
    },
    limits: [
      "Le prix du kWh est une valeur que vous saisissez : la valeur par défaut est une hypothèse EVExpert, pas un tarif officiel.",
      "Le rendement de charge varie (température, puissance, état de la batterie) ; 90 % est une valeur courante mais non universelle.",
      "En recharge rapide, certains opérateurs facturent à la minute ou avec un abonnement : le calcul au kWh ne les reflète pas.",
      "Les kilomètres ajoutés dépendent de votre consommation réelle, qui varie avec la vitesse et la température.",
    ],
    faq: [
      { question: "Quel prix du kWh faut-il saisir à domicile ?", answer: "Reprenez le prix TTC du kWh de votre contrat d'électricité (option de base ou heures creuses). Il figure sur votre facture ou dans votre espace client." },
      { question: "Pourquoi l'énergie au compteur est-elle supérieure à l'énergie stockée ?", answer: "Une partie de l'énergie est perdue en chaleur dans le chargeur, les câbles et la batterie. Le rendement de charge mesure la part réellement stockée." },
      { question: "Le calcul est-il valable en recharge rapide (DC) ?", answer: "Oui pour le coût au kWh, à condition de saisir le prix affiché à la borne. Les pertes y sont souvent moins bien connues : ajustez le rendement si besoin." },
      { question: "Comment estimer le coût d'un plein complet ?", answer: "Réglez l'état de charge actuel à 0 % et l'objectif à 100 %. Dans la pratique, on recharge rarement de 0 à 100 % : voir le guide sur la charge à 80 %." },
    ],
    relatedTools: ["/outils/cout-100-km", "/outils/temps-recharge", "/outils/autonomie-voiture-electrique"],
    relatedGuides: ["combien-coute-recharge-domicile", "recharge-domicile-ou-borne-publique", "recharger-a-80-pourcent"],
    relatedVehicleIds: ["renault-5-e-tech-52-kwh-150-ch", "tesla-model-y-rwd", "skoda-elroq-85"],
    updatedAt: UPDATED,
  },

  "autonomie-voiture-electrique": {
    slug: "autonomie-voiture-electrique",
    intro: [
      "L'autonomie WLTP affichée par les constructeurs est mesurée dans des conditions normalisées. Sur la route, la vitesse, la température et le type de trajet la font varier, parfois fortement.",
      "Cet outil applique des facteurs simples et visibles à la consommation de référence de votre voiture pour estimer l'autonomie dans vos conditions. Le résultat est une estimation EVExpert, jamais une valeur constructeur.",
    ],
    formulas: [
      { label: "Consommation ajustée", expr: "consommation de référence × facteur température × facteur trajet × facteur vitesse" },
      { label: "Énergie exploitable", expr: "capacité utile × (1 − réserve conservée)" },
      { label: "Autonomie estimée", expr: "énergie exploitable ÷ consommation ajustée × 100" },
      { label: "Consommation de référence", expr: "capacité utile ÷ autonomie WLTP × 100 (côté batterie)" },
    ],
    example: () => {
      const r = computeRange({ usableCapacity: 60, baseConsumption: 16, speed: 110, temperature: 15, drivingType: "mixte", reserve: 10 });
      return {
        title: "Exemple : 60 kWh utiles, 16 kWh/100 km de référence, mixte, 15 °C, 110 km/h, 10 % de réserve",
        steps: [
          "Facteurs appliqués : température 15 °C ×1,08 ; trajet mixte ×1,00 ; vitesse 110 km/h ×1,12 (0,6 % par km/h au-delà de 90)",
          `Consommation ajustée : 16 × 1,08 × 1,00 × 1,12 ≈ ${formatNumber(r.adjustedConsumption, 1)} kWh/100 km`,
          `Énergie exploitable : 60 × 0,90 = ${formatNumber(r.usableEnergy, 1)} kWh`,
          `Autonomie estimée : ${formatNumber(r.usableEnergy, 1)} ÷ ${formatNumber(r.adjustedConsumption, 1)} × 100 ≈ ${formatNumber(r.estimatedRange)} km`,
        ],
      };
    },
    limits: [
      "Les facteurs (température, vitesse, trajet) sont des approximations EVExpert, pas des mesures : voir la page Méthodologie.",
      "Le modèle ignore le dénivelé, le vent, les pneus, le chauffage de l'habitacle, la charge du véhicule et l'état de santé de la batterie.",
      "La consommation de référence dérive de l'autonomie WLTP : si la valeur WLTP de la source est différente de la vôtre, saisissez la vôtre.",
      "Une réserve de sécurité évite de rouler jusqu'à 0 % ; 10 % est un choix prudent, pas une règle.",
    ],
    faq: [
      { question: "Pourquoi mon autonomie réelle est-elle inférieure à l'autonomie WLTP ?", answer: "Le WLTP est mesuré en laboratoire, à température douce et avec une vitesse moyenne modérée. Vitesse élevée, froid, chauffage et relief augmentent la consommation." },
      { question: "L'estimation vaut-elle pour un trajet sur autoroute ?", answer: "Choisissez « Autoroute » et la vitesse réelle. C'est le cas où l'écart avec le WLTP est le plus fort, car la résistance de l'air croît avec le carré de la vitesse." },
      { question: "Comment obtenir une autonomie plus précise ?", answer: "Relevez la consommation moyenne affichée par votre voiture sur des trajets comparables et saisissez-la comme consommation de référence." },
      { question: "Le froid réduit-il la capacité de la batterie ?", answer: "Il réduit surtout l'efficacité globale : chauffage, batterie moins performante à basse température. Le résultat est une consommation plus élevée." },
    ],
    relatedTools: ["/outils/cout-recharge-voiture-electrique", "/outils/temps-recharge", "/outils/cout-100-km"],
    relatedGuides: ["calculer-autonomie-reelle", "autonomie-hiver", "autonomie-autoroute", "wltp-definition"],
    relatedVehicleIds: ["tesla-model-3-long-range-rwd", "volkswagen-id-7-86-kwh", "kia-ev3-long-range"],
    updatedAt: UPDATED,
  },

  "cout-100-km": {
    slug: "cout-100-km",
    intro: [
      "Le coût aux 100 km est la manière la plus directe de comparer l'énergie d'une électrique, d'une essence, d'un diesel et d'une hybride : une consommation multipliée par un prix.",
      "Saisissez vos propres consommations et vos prix. Cet outil ne compte que l'énergie ; pour intégrer achat, entretien et dépréciation, utilisez les outils essence vs électrique et TCO.",
    ],
    formulas: [
      { label: "Électrique", expr: "consommation (kWh/100 km) × prix du kWh" },
      { label: "Thermique", expr: "consommation (L/100 km) × prix du litre" },
      { label: "Coût annuel de l'énergie", expr: "coût aux 100 km × kilométrage annuel ÷ 100" },
    ],
    example: () => {
      const ev = costPer100km({ consumption: 16, price: ASSUMPTIONS.homePrice });
      const pe = costPer100km({ consumption: 6.5, price: ASSUMPTIONS.petrolPrice });
      return {
        title: "Exemple : électrique à 16 kWh/100 km et 0,25 €/kWh, essence à 6,5 L/100 km et 1,75 €/L",
        steps: [
          `Électrique : 16 × 0,25 = ${eur(ev)} aux 100 km`,
          `Essence : 6,5 × 1,75 = ${eur(pe)} aux 100 km`,
          `Sur ${formatNumber(ASSUMPTIONS.annualKm)} km/an : ${eur(annualCost(ev, ASSUMPTIONS.annualKm), 0)} contre ${eur(annualCost(pe, ASSUMPTIONS.annualKm), 0)} d'énergie`,
        ],
      };
    },
    limits: [
      "Les prix par défaut sont des hypothèses EVExpert : remplacez-les par vos prix réels (contrat, station).",
      "Le coût d'une recharge publique ou rapide est plus élevé qu'à domicile : si vous en dépendez beaucoup, saisissez un prix moyen pondéré.",
      "Seule l'énergie est comptée : ni achat, ni assurance, ni entretien, ni dépréciation.",
      "La consommation d'une électrique par kWh au compteur inclut les pertes de charge (voir l'exemple ci-dessous : consommation batterie ÷ rendement).",
    ],
    faq: [
      { question: "Quelle consommation saisir pour ma voiture électrique ?", answer: "La consommation au compteur relevée sur votre tableau de bord, majorée d'environ 10 % pour les pertes de charge, ou la valeur préremplie à partir d'une fiche du catalogue." },
      { question: "L'électrique est-elle toujours moins chère aux 100 km ?", answer: "Rechargée à domicile, en général oui. Sur une recharge rapide publique chère, l'écart avec un thermique sobre peut se réduire : le résultat dépend des prix saisis." },
      { question: "Comment inclure les recharges publiques ?", answer: "Calculez un prix moyen du kWh selon la part de chaque type de recharge (par exemple 80 % domicile, 20 % public) et saisissez-le comme prix de l'énergie." },
    ],
    relatedTools: ["/outils/essence-vs-electrique", "/outils/tco-voiture-electrique", "/outils/cout-recharge-voiture-electrique"],
    relatedGuides: ["cout-100-km-voiture-electrique", "voiture-electrique-vs-essence", "calculer-tco-voiture-electrique"],
    relatedVehicleIds: ["renault-5-e-tech-52-kwh-150-ch", "dacia-spring-electric-70", "tesla-model-3-rwd"],
    updatedAt: UPDATED,
  },

  "essence-vs-electrique": {
    slug: "essence-vs-electrique",
    intro: [
      "Comparer une électrique et une essence uniquement sur le prix d'achat ou sur le plein donne une image incomplète. Ce comparateur ajoute l'énergie, l'assurance, l'entretien et la dépréciation pour obtenir un coût annuel et un coût cumulé sur 3, 5 et 8 ans.",
      "Toutes les valeurs par défaut sont des hypothèses que vous pouvez modifier. Le résultat n'est utile que si vous les adaptez à votre situation.",
    ],
    formulas: [
      { label: "Énergie annuelle", expr: "consommation × prix de l'énergie × kilométrage annuel ÷ 100" },
      { label: "Dépréciation annuelle", expr: "prix d'achat × taux de dépréciation" },
      { label: "Coût annuel", expr: "énergie + assurance + entretien + dépréciation" },
      { label: "Coût cumulé", expr: "coût annuel × nombre d'années" },
    ],
    example: () => {
      const ev = computeRunningCost({ price: 40000, annualKm: 15000, consumption: 16, energyPrice: ASSUMPTIONS.homePrice, insurance: 700, maintenance: 250, depreciationRate: 12 });
      const pe = computeRunningCost({ price: 30000, annualKm: 15000, consumption: 6.5, energyPrice: ASSUMPTIONS.petrolPrice, insurance: 650, maintenance: 600, depreciationRate: 14 });
      return {
        title: "Exemple illustratif : électrique à 40 000 €, essence à 30 000 €, 15 000 km/an",
        steps: [
          `Électrique : énergie ${eur(ev.annualEnergy, 0)} + assurance 700 € + entretien 250 € + dépréciation ${eur(ev.annualDepreciation, 0)} = ${eur(ev.annualTotal, 0)}/an`,
          `Essence : énergie ${eur(pe.annualEnergy, 0)} + assurance 650 € + entretien 600 € + dépréciation ${eur(pe.annualDepreciation, 0)} = ${eur(pe.annualTotal, 0)}/an`,
          `Écart annuel : ${eur(Math.abs(ev.annualTotal - pe.annualTotal), 0)} (les prix d'achat et taux de dépréciation ci-dessus sont fictifs, à remplacer par les vôtres)`,
        ],
      };
    },
    limits: [
      "Les prix d'achat, assurances, entretiens et taux de dépréciation par défaut sont des hypothèses d'illustration, pas des données de marché.",
      "Les aides à l'achat, le coût d'une borne à domicile et la fiscalité ne sont pas inclus : ajoutez-les via le calculateur TCO.",
      "La dépréciation réelle dépend du modèle, du kilométrage et du marché de l'occasion : elle est difficile à prévoir.",
    ],
    faq: [
      { question: "Comment choisir le taux de dépréciation ?", answer: "Il est incertain. Testez plusieurs valeurs (par exemple 10, 12, 15 %) pour voir si la conclusion change : si oui, votre résultat dépend surtout de cette hypothèse." },
      { question: "Pourquoi comparer sur 3, 5 et 8 ans ?", answer: "L'électrique coûte souvent plus cher à l'achat mais moins en usage : l'écart évolue avec la durée de détention." },
      { question: "Ce comparateur remplace-t-il le TCO ?", answer: "Non : le TCO, plus détaillé, tient compte de la revente, des pneus, des taxes et de la part de recharge publique." },
    ],
    relatedTools: ["/outils/tco-voiture-electrique", "/outils/cout-100-km", "/outils/cout-recharge-voiture-electrique"],
    relatedGuides: ["voiture-electrique-vs-essence", "calculer-tco-voiture-electrique", "choisir-premiere-voiture-electrique"],
    relatedVehicleIds: ["renault-5-e-tech-52-kwh-150-ch", "peugeot-e-208-50-kwh", "citroen-e-c3-standard-range-44-kwh"],
    updatedAt: UPDATED,
  },

  "tco-voiture-electrique": {
    slug: "tco-voiture-electrique",
    intro: [
      "Le coût total de possession (TCO) additionne tout ce qu'une voiture coûte sur la durée où vous la gardez : perte de valeur, énergie, assurance, entretien, pneus et taxes, moins les aides éventuelles.",
      "Comparez deux véhicules côte à côte, électriques ou non. Distinguez bien ce que vous connaissez (prix, kilométrage, énergie) de ce que vous supposez (revente, entretien).",
    ],
    formulas: [
      { label: "Dépréciation", expr: "prix d'achat − aides − valeur de revente estimée" },
      { label: "Énergie", expr: "énergie totale × (part domicile × prix domicile + part publique × prix public)" },
      { label: "Autres postes", expr: "(assurance + entretien + pneus + taxes) × durée" },
      { label: "TCO", expr: "dépréciation + énergie + autres postes ; par mois = TCO ÷ (12 × durée)" },
    ],
    example: () => {
      const a = computeTco({ price: 40000, bonus: 0, resaleValue: 18000, years: 5, annualKm: 15000, consumption: 16, energyPrice: ASSUMPTIONS.homePrice, publicChargingShare: 20, publicChargingPrice: ASSUMPTIONS.publicAcPrice, insurance: 700, maintenance: 250, tires: 150, taxes: 0 });
      return {
        title: "Exemple illustratif : véhicule à 40 000 €, revendu 18 000 € après 5 ans, 15 000 km/an",
        steps: [
          `Dépréciation : 40 000 − 0 − 18 000 = ${eur(a.depreciation, 0)}`,
          `Énergie sur 75 000 km (16 kWh/100 km, 20 % en recharge publique) : ${eur(a.energy, 0)}`,
          `Assurance, entretien, pneus : ${eur(a.insurance + a.maintenance + a.tires, 0)}`,
          `TCO sur 5 ans : ${eur(a.total, 0)}, soit ${eur(a.perMonth, 0)}/mois et ${eur(a.perKm)}/km`,
        ],
      };
    },
    limits: [
      "La valeur de revente est l'hypothèse la plus sensible et la plus incertaine ; testez plusieurs scénarios.",
      "Les valeurs par défaut sont des exemples : elles ne représentent pas un modèle précis.",
      "Le calcul ne comprend ni le financement (intérêts), ni le coût d'une borne à domicile, ni le carburant de trajets exceptionnels.",
      "Les aides varient dans le temps et selon votre situation : saisissez uniquement celles auxquelles vous avez droit, vérifiées sur les sites officiels.",
    ],
    faq: [
      { question: "Que faut-il inclure dans les aides ?", answer: "Seulement les aides que vous pouvez effectivement percevoir, après vérification sur les sites officiels. Laissez 0 en cas de doute." },
      { question: "Pourquoi le TCO est-il utile pour une électrique ?", answer: "Une électrique coûte généralement plus cher à l'achat mais peut coûter moins cher en énergie et en entretien : seule une vision sur plusieurs années permet de le vérifier pour votre usage." },
      { question: "Sur quelle durée calculer ?", answer: "Sur la durée pendant laquelle vous comptez réellement garder la voiture (souvent 4 à 8 ans). Une durée trop courte accentue le poids de la dépréciation." },
    ],
    relatedTools: ["/outils/essence-vs-electrique", "/outils/cout-100-km", "/outils/cout-recharge-voiture-electrique"],
    relatedGuides: ["calculer-tco-voiture-electrique", "voiture-electrique-vs-essence", "cout-borne-recharge-domicile"],
    relatedVehicleIds: ["tesla-model-y-rwd", "renault-scenic-e-tech-ev87-220-ch", "byd-atto-3-evo-rwd-design"],
    updatedAt: UPDATED,
  },

  "temps-recharge": {
    slug: "temps-recharge",
    intro: [
      "Le temps de recharge dépend de l'énergie à ajouter et de la puissance réellement utilisée, qui est plafonnée à la fois par la borne et par la voiture.",
      "Cet outil donne un temps théorique à puissance constante. Il est fiable en courant alternatif (AC), moins en recharge rapide (DC), où la puissance baisse au fil du remplissage.",
    ],
    formulas: [
      { label: "Énergie à ajouter", expr: "capacité utile × (état de charge visé − état de charge actuel) ÷ 100" },
      { label: "Puissance effective", expr: "puissance de la borne × rendement (limitée par le chargeur du véhicule)" },
      { label: "Durée", expr: "énergie à ajouter ÷ puissance effective, en heures" },
    ],
    example: () => {
      const r = computeChargingTime({ batteryCapacity: 60, currentSoc: 20, targetSoc: 80, power: 11, efficiency: ASSUMPTIONS.chargingEfficiency });
      return {
        title: "Exemple : 60 kWh utiles, de 20 à 80 %, wallbox 11 kW",
        steps: [
          `Énergie à ajouter : 60 × 60 ÷ 100 = ${formatNumber(r.energyToAdd, 1)} kWh`,
          `Puissance effective : 11 × 0,90 = 9,9 kW`,
          `Durée : ${formatNumber(r.energyToAdd, 1)} ÷ 9,9 ≈ ${minutesToHuman(r.minutes)}`,
        ],
      };
    },
    limits: [
      "En DC, la courbe de charge n'est pas plate : la puissance diminue à mesure que la batterie se remplit, surtout au-delà de 80 %.",
      "La température de la batterie, l'état de santé et la borne elle-même peuvent limiter la puissance.",
      "Si la voiture n'accepte que 7,4 kW en AC, une borne 22 kW ne la chargera pas plus vite : saisissez la puissance que le véhicule accepte.",
    ],
    faq: [
      { question: "Combien de temps pour recharger de 10 à 80 % ?", answer: "Cela dépend du modèle et de la borne. Comparez dans le catalogue le temps 10-80 % en DC publié pour chaque fiche, et utilisez cet outil pour l'AC." },
      { question: "Pourquoi la fin de la charge est-elle plus lente ?", answer: "La puissance est réduite pour protéger la batterie quand elle est presque pleine ; c'est pourquoi on s'arrête souvent vers 80 % en recharge rapide." },
      { question: "Quelle puissance saisir à domicile ?", answer: "Celle de votre wallbox, ou du chargeur embarqué si celui-ci est plus faible. Une prise domestique classique délivre bien moins qu'une wallbox." },
    ],
    relatedTools: ["/outils/puissance-borne-recharge", "/outils/cout-recharge-voiture-electrique", "/outils/autonomie-voiture-electrique"],
    relatedGuides: ["temps-recharge-voiture-electrique", "recharge-ac-ou-dc", "recharger-a-80-pourcent"],
    relatedVehicleIds: ["hyundai-ioniq-5-84-kwh-rwd", "kia-ev6-long-range-awd", "renault-5-e-tech-52-kwh-150-ch"],
    updatedAt: UPDATED,
  },

  "trajet-longue-distance": {
    slug: "trajet-longue-distance",
    intro: [
      "Une voiture électrique passe-t-elle un trajet de 500 ou 800 km, et avec combien d'arrêts ? La réponse dépend de l'autonomie réelle à la vitesse choisie (pas de l'autonomie WLTP) et de la puissance de recharge rapide moyenne, pas du pic annoncé.",
      "C'est une simulation théorique, pas une navigation : elle ne connaît ni le relief, ni le vent, ni les bornes réellement disponibles sur votre itinéraire. Utilisez-la pour évaluer un ordre de grandeur avant de planifier le trajet avec une carte de bornes à jour.",
    ],
    formulas: [
      { label: "Autonomie réelle par trajet", expr: "même modèle que le calculateur d'autonomie (vitesse, température, réserve de sécurité)" },
      { label: "Nombre d'arrêts", expr: "arrondi supérieur(distance ÷ autonomie réelle) − 1" },
      { label: "Énergie par arrêt", expr: "énergie utilisable d'une pleine autonomie réelle (après réserve)" },
      { label: "Durée par arrêt", expr: "énergie par arrêt ÷ puissance DC moyenne réellement atteignable" },
    ],
    example: () => {
      const r = computeTripPlan({
        distanceKm: 500,
        avgSpeed: 130,
        temperature: 10,
        marginPct: 10,
        usableCapacityKwh: 60,
        baseConsumptionKwh100: 15,
        dcAveragePowerKw: 90,
        dcPricePerKwh: ASSUMPTIONS.fastDcPrice,
      });
      return {
        title: "Exemple : 500 km à 130 km/h, 10 °C, batterie de 60 kWh utiles",
        steps: [
          `Autonomie réelle estimée : ≈ ${formatNumber(r.legRangeKm)} km`,
          `Arrêts nécessaires : arrondi supérieur(500 ÷ ${formatNumber(r.legRangeKm)}) − 1 = ${r.stops}`,
          `Durée totale de recharge, à 90 kW en moyenne : ${minutesToHuman(r.totalChargingMinutes)}`,
          `Coût de recharge en route, à ${formatNumber(ASSUMPTIONS.fastDcPrice, 2)} €/kWh : ${formatEuro(r.totalCost, 2)}`,
        ],
      };
    },
    limits: [
      "La puissance DC « moyenne réellement atteignable » n'est pas le pic annoncé par le constructeur : c'est une simplification, à ajuster à la baisse pour un modèle dont la courbe de charge chute vite (voir sa fiche).",
      "Chaque arrêt est supposé recharger l'équivalent d'un plein trajet complet : dans la réalité, vous chargerez souvent moins (juste de quoi atteindre le prochain arrêt), ce qui répartit différemment le temps total mais ne le change pas beaucoup.",
      "Aucune donnée de trafic, relief, vent ou disponibilité réelle des bornes n'est prise en compte : ce n'est pas une navigation.",
    ],
    faq: [
      { question: "Pourquoi l'autonomie réelle est-elle plus basse que l'autonomie WLTP ?", answer: "Le WLTP est mesuré à vitesse modérée et température tempérée. À 130 km/h et 10 °C, la résistance de l'air et le chauffage augmentent la consommation : voir le calculateur d'autonomie réelle." },
      { question: "Pourquoi ne pas utiliser directement le temps 10-80 % publié sur la fiche ?", answer: "Ce temps correspond à une fenêtre de charge fixe (10 à 80 %) ; ce simulateur calcule l'énergie réellement nécessaire pour atteindre le prochain arrêt, qui peut être plus ou moins large." },
      { question: "Une puissance DC plus élevée réduit-elle toujours le temps de trajet ?", answer: "Elle réduit le temps de recharge par arrêt, mais seulement jusqu'à la puissance que la batterie du véhicule peut réellement encaisser : au-delà, augmenter la puissance de la borne ne change rien." },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique", "/outils/temps-recharge", "/outils/puissance-borne-recharge"],
    relatedGuides: ["autonomie-autoroute", "puissance-recharge-dc", "autonomie-hiver"],
    relatedVehicleIds: ["tesla-model-3-long-range-rwd", "hyundai-ioniq-5-84-kwh-rwd", "kia-ev6-long-range-awd"],
    updatedAt: UPDATED,
  },

  "puissance-borne-recharge": {
    slug: "puissance-borne-recharge",
    intro: [
      "Une borne de 22 kW est-elle toujours plus rapide qu'une borne de 7,4 kW ? Pas forcément : la vitesse de charge est celle du maillon le plus faible entre la borne et la voiture.",
      "Choisissez un modèle du catalogue (ou saisissez ses limites) pour voir, borne par borne, la puissance réellement utilisée et le temps théorique correspondant.",
    ],
    formulas: [
      { label: "Puissance utilisée", expr: "minimum(puissance de la borne ; limite du véhicule dans ce mode)" },
      { label: "Limite en AC", expr: "puissance du chargeur embarqué (par ex. 7,4 / 11 / 22 kW)" },
      { label: "Limite en DC", expr: "puissance maximale acceptée par la batterie (pic de la courbe de charge)" },
      { label: "Durée théorique", expr: "énergie à ajouter ÷ puissance utilisée (rendement 90 % en AC)" },
    ],
    example: () => {
      const energy = 60 * 0.7;
      const at22 = Math.min(22, 11);
      const t = (energy / (at22 * 0.9)) * 60;
      return {
        title: "Exemple : batterie de 60 kWh, limite AC du véhicule 11 kW, de 10 à 80 %",
        steps: [
          `Énergie à ajouter : 60 × 70 ÷ 100 = ${formatNumber(energy, 1)} kWh`,
          `Sur une borne 22 kW : puissance utilisée = min(22 ; 11) = ${at22} kW → ≈ ${minutesToHuman(t)}`,
          "Sur une borne 11 kW : puissance utilisée = 11 kW → même durée : passer à 22 kW ne change rien pour ce véhicule",
        ],
      };
    },
    limits: [
      "En DC, le tableau suppose une puissance constante égale au pic du véhicule : c'est une borne basse du temps réel.",
      "La puissance disponible à une borne dépend aussi du nombre de véhicules branchés et de l'installation électrique.",
      "Les limites AC/DC des modèles du catalogue viennent de la source citée sur leur fiche ; vérifiez-les sur la notice de votre voiture.",
    ],
    faq: [
      { question: "Ma voiture accepte 11 kW : une borne 22 kW est-elle utile ?", answer: "Elle ne la charge pas plus vite en AC, mais elle n'est pas dangereuse : la voiture limite la puissance." },
      { question: "Quelle puissance de wallbox choisir à domicile ?", answer: "Celle que votre voiture accepte et que votre installation électrique et votre contrat permettent. Voir le guide dédié pour choisir entre 7,4, 11 et 22 kW." },
      { question: "Pourquoi les bornes DC affichent-elles des temps théoriques optimistes ?", answer: "Parce que la voiture n'utilise sa puissance maximale que sur une partie de la charge : la courbe descend ensuite." },
    ],
    relatedTools: ["/outils/temps-recharge", "/outils/cout-recharge-voiture-electrique", "/outils/autonomie-voiture-electrique"],
    relatedGuides: ["puissance-borne-7-11-22-kw", "recharge-ac-ou-dc", "puissance-recharge-dc"],
    relatedVehicleIds: ["hyundai-ioniq-5-84-kwh-rwd", "mercedes-benz-cla-250", "renault-scenic-e-tech-ev87-220-ch"],
    updatedAt: UPDATED,
  },
};
