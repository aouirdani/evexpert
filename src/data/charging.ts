import type { ArticleSection, FaqItem } from "@/types";
import { SOURCES } from "@/data/sources";
import type { Source } from "@/types";

export interface ChargingTopic {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  sections: ArticleSection[];
  faq: FaqItem[];
  relatedGuides: string[];
  sources: Source[];
  updatedAt: string;
}

const UPDATED = "2026-09-21";

export const chargingTopics: ChargingTopic[] = [
  {
    slug: "type-2",
    title: "Prise Type 2 : le connecteur standard de la recharge en courant alternatif",
    shortTitle: "Type 2",
    description:
      "Le connecteur Type 2 (Mennekes) est le standard européen de la recharge en courant alternatif : où on le trouve, quelles puissances, quel câble.",
    intro:
      "Le connecteur Type 2 est le standard européen de la recharge en courant alternatif (AC). Il équipe les bornes publiques, les wallbox domestiques et la quasi-totalité des voitures électriques vendues récemment en Europe.",
    sections: [
      {
        heading: "À quoi sert le Type 2 ?",
        paragraphs: [
          "Il transporte du courant alternatif monophasé ou triphasé, ainsi que les signaux permettant à la borne et à la voiture de dialoguer avant que le courant soit établi. La voiture convertit ensuite ce courant en courant continu grâce à son chargeur embarqué.",
          "Dans la réglementation européenne sur les infrastructures de carburants alternatifs, le Type 2 est le connecteur de référence pour les points de recharge AC ouverts au public.",
        ],
      },
      {
        heading: "Quelles puissances ?",
        paragraphs: [
          "De 3,7 kW en monophasé à 22 kW en triphasé selon la borne, le câble et le chargeur embarqué du véhicule. La puissance utilisée est toujours la plus faible des trois maillons.",
        ],
        table: {
          headers: ["Puissance", "Courant", "Usage courant"],
          rows: [
            ["3,7 kW", "Monophasé 16 A", "Prise renforcée, recharge lente"],
            ["7,4 kW", "Monophasé 32 A", "Wallbox domestique"],
            ["11 kW", "Triphasé 16 A", "Wallbox triphasée, travail, voirie"],
            ["22 kW", "Triphasé 32 A", "Borne AC publique (si le véhicule l'accepte)"],
          ],
        },
      },
      {
        heading: "Câble ou prise attachée ?",
        paragraphs: [
          "Sur les bornes publiques AC, le câble est en général à apporter soi-même (câble Type 2 vers Type 2). Sur beaucoup de wallbox domestiques, le câble est fixe. Vérifiez la puissance et le type de courant que supporte votre câble.",
        ],
      },
    ],
    faq: [
      { question: "Toutes les voitures électriques récentes ont-elles une prise Type 2 ?", answer: "La très grande majorité des voitures électriques vendues récemment en Europe l'ont, soit seule en AC, soit comme partie du connecteur CCS Combo 2." },
      { question: "Type 2 et Mennekes, est-ce la même chose ?", answer: "Oui : « Mennekes » est le nom du fabricant qui a proposé le connecteur, devenu le standard européen Type 2." },
    ],
    relatedGuides: ["recharge-ac-ou-dc", "puissance-borne-7-11-22-kw"],
    sources: [SOURCES.avere],
    updatedAt: UPDATED,
  },
  {
    slug: "ccs",
    title: "CCS Combo 2 : le connecteur standard de la recharge rapide en Europe",
    shortTitle: "CCS Combo 2",
    description:
      "Le CCS Combo 2 ajoute deux contacts continus à la prise Type 2 : le standard européen de la recharge rapide DC.",
    intro:
      "Le CCS (Combined Charging System) Combo 2 est le connecteur européen de la recharge en courant continu. Il reprend la prise Type 2 et ajoute deux contacts de puissance en dessous, ce qui permet à un même port de recevoir de l'AC et du DC.",
    sections: [
      {
        heading: "Un port, deux modes",
        paragraphs: [
          "Sur la voiture, une seule trappe accueille le connecteur : la partie haute (Type 2) sert à la recharge AC, la partie basse s'ajoute pour la recharge rapide DC. Le même port sert donc à la maison et sur autoroute.",
        ],
      },
      {
        heading: "Des puissances très variées",
        paragraphs: [
          "Les bornes CCS vont d'environ 50 kW à plusieurs centaines de kW. Ce qui compte pour vous est la puissance maximale que votre voiture accepte, pas celle de la borne : voir le guide sur la puissance de recharge DC.",
        ],
      },
      {
        heading: "Compatibilité",
        paragraphs: [
          "Dans l'Union européenne, la réglementation sur les infrastructures de carburants alternatifs retient le CCS Combo 2 comme connecteur DC de référence pour les points de recharge publics. Les voitures récentes le proposent presque toutes ; les modèles plus anciens peuvent utiliser un autre standard.",
        ],
      },
    ],
    faq: [
      { question: "CCS et CCS2, est-ce la même chose ?", answer: "En Europe, « CCS » désigne pratiquement toujours le CCS Combo 2, basé sur la prise Type 2. Le Combo 1 existe surtout en Amérique du Nord." },
      { question: "Peut-on recharger en AC sur une voiture CCS ?", answer: "Oui : la partie haute du port est une prise Type 2 qui accepte les bornes AC." },
    ],
    relatedGuides: ["puissance-recharge-dc", "recharge-ac-ou-dc"],
    sources: [SOURCES.avere],
    updatedAt: UPDATED,
  },
  {
    slug: "chademo",
    title: "CHAdeMO : le standard japonais de recharge rapide, en recul en Europe",
    shortTitle: "CHAdeMO",
    description:
      "Le CHAdeMO est un standard de recharge rapide DC d'origine japonaise, présent sur certains modèles plus anciens : ce qu'il faut savoir avant d'acheter ou de recharger.",
    intro:
      "Le CHAdeMO est un standard de recharge rapide en courant continu d'origine japonaise. Il équipe certains modèles plus anciens, en particulier japonais, et perd du terrain en Europe au profit du CCS Combo 2.",
    sections: [
      {
        heading: "Un port séparé",
        paragraphs: [
          "Contrairement au CCS, le CHAdeMO nécessite une prise dédiée, distincte de la prise Type 2 utilisée en AC. Les voitures CHAdeMO ont donc souvent deux ports : un pour l'AC, un pour la recharge rapide.",
        ],
      },
      {
        heading: "Ce que cela implique aujourd'hui",
        paragraphs: [
          "Le nombre de bornes rapides équipées en CHAdeMO tend à diminuer et de nombreux nouveaux points de recharge ne le proposent pas. Si vous envisagez un véhicule d'occasion équipé de CHAdeMO, vérifiez que votre trajet habituel offre des bornes compatibles.",
        ],
      },
    ],
    faq: [
      { question: "Existe-t-il des adaptateurs ?", answer: "Il existe des adaptateurs de conversion, mais leur disponibilité, leur coût et leur compatibilité varient : renseignez-vous avant de vous y fier." },
      { question: "Le CHAdeMO disparaît-il ?", answer: "Il est en recul en Europe, mais le parc de véhicules équipés reste en circulation. Vérifiez la couverture de vos trajets habituels." },
    ],
    relatedGuides: ["recharge-ac-ou-dc", "choisir-premiere-voiture-electrique"],
    sources: [SOURCES.avere],
    updatedAt: UPDATED,
  },
];

export function getChargingTopic(slug: string): ChargingTopic | undefined {
  return chargingTopics.find((t) => t.slug === slug);
}
