import type { Guide } from "@/types";

export const guides: Guide[] = [
  {
    slug: "achat",
    category: "achat",
    title: "Guide d'achat d'une voiture électrique",
    description:
      "Les critères essentiels pour bien choisir une voiture électrique : budget, autonomie, recharge et usage réel.",
    updatedAt: "2026-01-10",
    readingTime: 8,
    intro:
      "Acheter une voiture électrique demande d'évaluer son usage réel plutôt que de se focaliser uniquement sur l'autonomie annoncée. Ce guide passe en revue les critères qui comptent vraiment.",
    sections: [
      {
        heading: "Définir son usage réel",
        paragraphs: [
          "Commencez par estimer votre kilométrage quotidien et vos trajets longs occasionnels. La majorité des trajets quotidiens font moins de 60 km, ce qui rend l'autonomie moins critique qu'on ne le pense.",
          "Un véhicule avec 350 km d'autonomie réelle couvre confortablement un usage quotidien, à condition de pouvoir recharger à domicile ou au travail.",
        ],
      },
      {
        heading: "Autonomie WLTP vs autonomie réelle",
        paragraphs: [
          "L'autonomie WLTP est une valeur normalisée obtenue en laboratoire. L'autonomie réelle dépend de la vitesse, de la température et du style de conduite.",
          "Prévoyez une marge : sur autoroute et par temps froid, l'autonomie réelle peut être inférieure de 20 à 35 % à la valeur WLTP.",
        ],
      },
      {
        heading: "La recharge : le vrai critère de confort",
        paragraphs: [
          "La possibilité de recharger à domicile change complètement l'expérience. Sans solution à domicile, vérifiez la disponibilité de bornes près de chez vous.",
          "Pour les longs trajets, la puissance de recharge DC et la courbe de charge comptent davantage que l'autonomie brute.",
        ],
      },
    ],
    relatedTools: [
      "/outils/tco-voiture-electrique",
      "/outils/autonomie-voiture-electrique",
    ],
    faq: [
      {
        question: "Faut-il absolument recharger à domicile ?",
        answer:
          "Non, mais c'est le scénario le plus économique et le plus pratique. À défaut, une borne au travail ou un réseau public fiable à proximité suffit.",
      },
    ],
  },
  {
    slug: "recharge",
    category: "recharge",
    title: "Guide de la recharge d'une voiture électrique",
    description:
      "Comprendre les modes de recharge, les puissances et les connecteurs pour recharger sereinement.",
    updatedAt: "2026-01-12",
    readingTime: 7,
    intro:
      "La recharge est au cœur de l'usage d'une voiture électrique. Ce guide clarifie les standards, les puissances et les bons réflexes.",
    sections: [
      {
        heading: "Les trois grands lieux de recharge",
        paragraphs: [
          "À domicile : la solution la plus économique, idéalement avec une wallbox de 7,4 kW ou 11 kW.",
          "Sur la voie publique : bornes AC (jusqu'à 22 kW) pour la recharge d'appoint.",
          "Sur autoroute : bornes rapides DC (50 à 350 kW) pour les longs trajets.",
        ],
      },
      {
        heading: "Bien utiliser la recharge rapide",
        paragraphs: [
          "La courbe de charge n'est pas linéaire : la puissance est élevée entre 10 et 60 %, puis diminue nettement au-delà de 80 %.",
          "Sur un long trajet, il est souvent plus efficace de recharger de 10 à 80 % plutôt que d'attendre 100 %.",
        ],
      },
    ],
    relatedTools: [
      "/outils/cout-recharge-voiture-electrique",
      "/outils/temps-recharge",
    ],
  },
  {
    slug: "autonomie",
    category: "autonomie",
    title: "Comprendre l'autonomie d'une voiture électrique",
    description:
      "Pourquoi l'autonomie réelle diffère de l'autonomie WLTP et comment l'optimiser au quotidien.",
    updatedAt: "2026-01-08",
    readingTime: 6,
    intro:
      "L'autonomie d'une voiture électrique varie selon de nombreux facteurs. Comprendre ces facteurs permet de mieux planifier ses trajets.",
    sections: [
      {
        heading: "Les facteurs qui influencent l'autonomie",
        paragraphs: [
          "La vitesse est le premier facteur : la consommation augmente fortement au-delà de 110 km/h à cause de la résistance de l'air.",
          "La température joue un rôle majeur : par grand froid, l'autonomie peut chuter de 20 à 35 %.",
          "Le style de conduite, le relief et l'usage du chauffage influencent également la consommation.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique"],
  },
  {
    slug: "batterie",
    category: "batterie",
    title: "La batterie d'une voiture électrique : durée de vie et entretien",
    description:
      "Comment fonctionne une batterie, comment préserver sa santé et ce que couvre la garantie.",
    updatedAt: "2026-01-05",
    readingTime: 7,
    intro:
      "La batterie est l'élément le plus coûteux d'une voiture électrique. Bien la comprendre permet de la préserver dans le temps.",
    sections: [
      {
        heading: "Capacité totale et capacité utile",
        paragraphs: [
          "La capacité totale correspond à la taille brute de la batterie. La capacité utile, plus faible, est celle réellement exploitable.",
          "Cette marge protège la batterie en évitant les charges et décharges extrêmes.",
        ],
      },
      {
        heading: "Préserver la santé de la batterie",
        paragraphs: [
          "Éviter de laisser la batterie longtemps à 100 % ou proche de 0 % contribue à préserver sa durée de vie.",
          "Pour un usage quotidien, viser une charge entre 20 et 80 % est un bon compromis.",
        ],
      },
    ],
  },
  {
    slug: "entretien",
    category: "entretien",
    title: "Entretien d'une voiture électrique : ce qui change",
    description:
      "Une voiture électrique demande moins d'entretien mécanique. Voici les postes à surveiller.",
    updatedAt: "2026-01-03",
    readingTime: 5,
    intro:
      "Sans moteur thermique, une voiture électrique réduit fortement certains coûts d'entretien. Certains postes restent toutefois à surveiller.",
    sections: [
      {
        heading: "Moins d'entretien mécanique",
        paragraphs: [
          "Pas de vidange, pas de courroie de distribution, pas de filtres à huile : les coûts d'entretien courant sont généralement réduits.",
          "Le freinage régénératif limite l'usure des plaquettes et disques.",
        ],
      },
      {
        heading: "Les postes à surveiller",
        paragraphs: [
          "Les pneus s'usent parfois plus vite en raison du couple instantané et du poids.",
          "Le liquide de refroidissement de la batterie, le filtre d'habitacle et les éléments de freinage restent à contrôler.",
        ],
      },
    ],
    relatedTools: ["/outils/tco-voiture-electrique"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
