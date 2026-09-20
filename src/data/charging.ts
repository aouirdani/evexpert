import type { ChargingStation, FaqItem } from "@/types";

export interface ChargingTopic {
  slug: string;
  title: string;
  shortTitle: string;
  category: "standard" | "puissance" | "usage";
  description: string;
  intro: string;
  sections: { heading?: string; paragraphs: string[] }[];
  faq?: FaqItem[];
}

export const chargingTopics: ChargingTopic[] = [
  {
    slug: "type-2",
    title: "Prise Type 2 : le standard de la recharge en courant alternatif",
    shortTitle: "Type 2",
    category: "standard",
    description:
      "Le connecteur Type 2 (Mennekes) est la norme européenne pour la recharge en courant alternatif (AC).",
    intro:
      "Le connecteur Type 2 est aujourd'hui le standard européen pour la recharge en courant alternatif, à domicile comme sur la voie publique.",
    sections: [
      {
        heading: "À quoi sert le Type 2 ?",
        paragraphs: [
          "Le Type 2 gère la recharge en courant alternatif (AC). Il équipe la quasi-totalité des voitures électriques vendues en Europe.",
          "Selon le chargeur embarqué du véhicule, la puissance AC peut aller de 3,7 kW à 22 kW.",
        ],
      },
      {
        heading: "Où le trouve-t-on ?",
        paragraphs: [
          "On le retrouve sur les bornes publiques AC, les bornes en entreprise et la plupart des wallbox domestiques.",
        ],
      },
    ],
  },
  {
    slug: "ccs",
    title: "CCS Combo : la norme de recharge rapide en Europe",
    shortTitle: "CCS Combo",
    category: "standard",
    description:
      "Le connecteur CCS Combo ajoute deux broches de puissance au Type 2 pour la recharge rapide en courant continu (DC).",
    intro:
      "Le CCS Combo (Combined Charging System) est le standard de recharge rapide en courant continu en Europe.",
    sections: [
      {
        heading: "Principe",
        paragraphs: [
          "Le CCS combine le connecteur Type 2 et deux broches supplémentaires dédiées au courant continu (DC).",
          "Il permet des puissances élevées, de 50 kW à plus de 350 kW selon la borne et le véhicule.",
        ],
      },
    ],
  },
  {
    slug: "chademo",
    title: "CHAdeMO : un standard de recharge rapide en déclin",
    shortTitle: "CHAdeMO",
    category: "standard",
    description:
      "Le connecteur CHAdeMO, d'origine japonaise, reste présent sur certains modèles mais recule face au CCS.",
    intro:
      "CHAdeMO est un standard de recharge rapide en courant continu, historiquement porté par des constructeurs japonais.",
    sections: [
      {
        heading: "Situation actuelle",
        paragraphs: [
          "En Europe, le CCS s'est imposé comme standard de recharge rapide. CHAdeMO se raréfie sur les nouveaux modèles et sur les nouvelles bornes.",
        ],
      },
    ],
  },
  {
    slug: "recharge-ac-dc",
    title: "Recharge AC et DC : quelle différence ?",
    shortTitle: "AC vs DC",
    category: "puissance",
    description:
      "La recharge AC passe par le chargeur embarqué du véhicule ; la recharge DC alimente directement la batterie.",
    intro:
      "Comprendre la différence entre courant alternatif (AC) et courant continu (DC) est essentiel pour bien recharger.",
    sections: [
      {
        heading: "Recharge AC",
        paragraphs: [
          "En AC, le courant est converti par le chargeur embarqué du véhicule. La puissance est donc limitée par ce chargeur (souvent 7,4 kW, 11 kW ou 22 kW).",
        ],
      },
      {
        heading: "Recharge DC",
        paragraphs: [
          "En DC, la conversion est réalisée par la borne. Le courant continu alimente directement la batterie, ce qui permet des puissances bien plus élevées.",
        ],
      },
    ],
  },
  {
    slug: "puissances-de-recharge",
    title: "7,4 / 11 / 22 / 50 / 150 / 300+ kW : comprendre les puissances",
    shortTitle: "Puissances de recharge",
    category: "puissance",
    description:
      "Panorama des principales puissances de recharge et de leur usage : domicile, voirie, autoroute.",
    intro:
      "Les puissances de recharge s'échelonnent de quelques kilowatts à domicile à plusieurs centaines de kilowatts sur autoroute.",
    sections: [
      {
        heading: "Recharge lente et normale (AC)",
        paragraphs: [
          "7,4 kW : wallbox monophasée domestique typique. 11 kW : wallbox triphasée. 22 kW : bornes AC de voirie (selon chargeur embarqué).",
        ],
      },
      {
        heading: "Recharge rapide (DC)",
        paragraphs: [
          "50 kW : recharge rapide d'entrée de gamme. 150 kW : recharge rapide courante. 300+ kW : recharge ultra-rapide, réservée aux véhicules compatibles.",
        ],
      },
    ],
  },
];

export function getChargingTopic(slug: string): ChargingTopic | undefined {
  return chargingTopics.find((t) => t.slug === slug);
}

/**
 * DONNÉES D'EXEMPLE — bornes de recharge (isDemo: true).
 * À remplacer par une source ouverte (ex. data.gouv.fr — IRVE) avec sourceUrl.
 */
export const chargingStations: ChargingStation[] = [
  {
    id: "demo-station-1",
    operator: "Réseau exemple A",
    network: "Exemple Charge",
    location: "Aire de démonstration",
    city: "Lyon",
    department: "Rhône (69)",
    latitude: 45.75,
    longitude: 4.85,
    power: 150,
    connector: "CCS",
    price: "0,45 €/kWh (exemple)",
    access: "Public",
    openingHours: "24h/24",
    source: "Données d'exemple EVExpert",
    lastUpdated: "2026-01-15",
    isDemo: true,
  },
  {
    id: "demo-station-2",
    operator: "Réseau exemple B",
    network: "Exemple Power",
    location: "Parking centre-ville",
    city: "Paris",
    department: "Paris (75)",
    latitude: 48.8566,
    longitude: 2.3522,
    power: 22,
    connector: "Type 2",
    price: "0,30 €/kWh (exemple)",
    access: "Public",
    openingHours: "7h - 22h",
    source: "Données d'exemple EVExpert",
    lastUpdated: "2026-01-15",
    isDemo: true,
  },
];
