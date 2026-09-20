import type { Article, ArticleCategory } from "@/types";

export const articles: Article[] = [
  {
    slug: "combien-coute-recharge-voiture-electrique",
    title: "Combien coûte la recharge d'une voiture électrique ?",
    description:
      "Coût d'une recharge à domicile, sur borne publique et en recharge rapide : méthode de calcul et exemples concrets.",
    category: "Recharge",
    author: "La rédaction EVExpert",
    publishedAt: "2026-01-14",
    updatedAt: "2026-01-14",
    readingTime: 8,
    excerpt:
      "Le coût de recharge dépend du prix du kWh, de la capacité de la batterie et du rendement de charge. Décryptage avec des exemples.",
    intro:
      "Le coût de recharge d'une voiture électrique varie fortement selon le lieu et le tarif de l'électricité. Cet article explique comment le calculer précisément et compare les principaux scénarios.",
    sections: [
      {
        heading: "La formule de base",
        paragraphs: [
          "Le coût d'une recharge se calcule en multipliant l'énergie réellement tirée du réseau par le prix du kWh.",
          "L'énergie stockée dans la batterie correspond à la capacité multipliée par l'écart entre l'état de charge de départ et l'état de charge visé. Comme la recharge n'est pas parfaite, l'énergie tirée du réseau est légèrement supérieure : c'est le rendement de charge.",
        ],
      },
      {
        heading: "Recharge à domicile",
        paragraphs: [
          "À domicile, avec un tarif réglementé, la recharge est généralement le scénario le plus économique. Un plein d'énergie représente souvent quelques euros pour 300 km.",
          "Utiliser un contrat heures creuses peut réduire encore la facture.",
        ],
      },
      {
        heading: "Recharge publique et rapide",
        paragraphs: [
          "Sur borne publique AC, le tarif est plus élevé qu'à domicile. En recharge rapide DC sur autoroute, le prix au kWh peut être nettement supérieur.",
          "Pour les longs trajets, la recharge rapide reste néanmoins compétitive face au carburant.",
        ],
      },
    ],
    relatedTools: [
      "/outils/cout-recharge-voiture-electrique",
      "/outils/cout-100-km",
      "/outils/temps-recharge",
    ],
    relatedVehicleIds: ["tesla-model-3-propulsion", "renault-5-e-tech-comfort"],
    faq: [
      {
        question: "Est-il moins cher de recharger à domicile ?",
        answer:
          "Dans la grande majorité des cas, oui. La recharge à domicile, surtout en heures creuses, est nettement plus économique que la recharge rapide publique.",
      },
      {
        question: "Le rendement de charge, qu'est-ce que c'est ?",
        answer:
          "C'est le rapport entre l'énergie effectivement stockée dans la batterie et l'énergie tirée du réseau. Une partie est perdue en chaleur, généralement 8 à 15 %.",
      },
    ],
    sources: [
      {
        label: "Méthodologie de calcul EVExpert",
        url: "/sources",
        accessed: "2026-01-14",
      },
    ],
  },
  {
    slug: "autonomie-reelle-vs-wltp",
    title: "Autonomie réelle vs WLTP : à quoi s'attendre ?",
    description:
      "Pourquoi l'autonomie réelle diffère de la valeur WLTP et comment estimer une autonomie crédible.",
    category: "Batterie",
    author: "La rédaction EVExpert",
    publishedAt: "2026-01-13",
    updatedAt: "2026-01-13",
    readingTime: 7,
    excerpt:
      "L'autonomie WLTP est une valeur de laboratoire. Voici comment estimer l'autonomie que vous obtiendrez vraiment.",
    intro:
      "La différence entre autonomie WLTP et autonomie réelle est l'une des principales sources d'incompréhension. Cet article clarifie le sujet.",
    sections: [
      {
        heading: "Ce que mesure le cycle WLTP",
        paragraphs: [
          "Le cycle WLTP est un protocole normalisé réalisé en conditions contrôlées. Il permet de comparer les modèles entre eux mais ne reflète pas parfaitement un usage réel.",
        ],
      },
      {
        heading: "Les écarts en conditions réelles",
        paragraphs: [
          "Sur autoroute et par temps froid, l'autonomie réelle peut être inférieure de 20 à 35 % à la valeur WLTP.",
          "En ville, à l'inverse, l'autonomie peut approcher, voire dépasser, la valeur WLTP grâce au freinage régénératif.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique"],
    relatedVehicleIds: ["hyundai-kona-electric-64"],
    faq: [
      {
        question: "Peut-on se fier à l'autonomie WLTP ?",
        answer:
          "Comme outil de comparaison entre modèles, oui. Comme prévision d'autonomie réelle, il faut appliquer une marge selon l'usage.",
      },
    ],
  },
  {
    slug: "essence-vs-electrique-quel-cout-reel",
    title: "Essence vs électrique : quel coût réel sur 5 ans ?",
    description:
      "Comparaison méthodique des coûts d'usage entre une voiture électrique et une voiture essence.",
    category: "Comparatifs",
    author: "La rédaction EVExpert",
    publishedAt: "2026-01-11",
    updatedAt: "2026-01-11",
    readingTime: 9,
    excerpt:
      "Prix d'achat, énergie, entretien, dépréciation : comment comparer honnêtement électrique et essence.",
    intro:
      "Comparer une voiture électrique et une voiture essence demande de prendre en compte plusieurs postes de coûts, pas seulement le prix d'achat.",
    sections: [
      {
        heading: "Les postes à comparer",
        paragraphs: [
          "Prix d'achat, énergie, entretien, assurance et dépréciation forment le cœur du calcul.",
          "L'électrique part souvent avec un prix d'achat plus élevé mais un coût énergétique et d'entretien plus faible.",
        ],
      },
      {
        heading: "L'importance du kilométrage",
        paragraphs: [
          "Plus le kilométrage annuel est élevé, plus l'avantage énergétique de l'électrique se matérialise.",
        ],
      },
    ],
    relatedTools: [
      "/outils/essence-vs-electrique",
      "/outils/tco-voiture-electrique",
    ],
  },
  {
    slug: "recharge-a-domicile-guide-pratique",
    title: "Recharge à domicile : le guide pratique",
    description:
      "Wallbox, puissance, installation et coûts : tout comprendre sur la recharge à domicile.",
    category: "Recharge",
    author: "La rédaction EVExpert",
    publishedAt: "2026-01-09",
    updatedAt: "2026-01-09",
    readingTime: 6,
    excerpt:
      "La recharge à domicile est la solution la plus pratique et la plus économique. Voici comment bien s'équiper.",
    intro:
      "Recharger à domicile transforme l'usage quotidien d'une voiture électrique. Ce guide couvre l'essentiel.",
    sections: [
      {
        heading: "Prise renforcée ou wallbox ?",
        paragraphs: [
          "Une prise renforcée convient pour un petit kilométrage. Une wallbox de 7,4 kW ou 11 kW offre une recharge plus rapide et plus sûre.",
        ],
      },
    ],
    relatedTools: ["/outils/temps-recharge"],
  },
  {
    slug: "comprendre-courbe-de-charge",
    title: "Comprendre la courbe de charge d'une voiture électrique",
    description:
      "Pourquoi la puissance de recharge diminue au fil de la charge et comment en tenir compte.",
    category: "Technologie",
    author: "La rédaction EVExpert",
    publishedAt: "2026-01-07",
    updatedAt: "2026-01-07",
    readingTime: 6,
    excerpt:
      "La recharge rapide n'est pas linéaire. Comprendre la courbe de charge permet d'optimiser ses arrêts.",
    intro:
      "La courbe de charge décrit l'évolution de la puissance de recharge selon l'état de charge de la batterie.",
    sections: [
      {
        heading: "Une puissance qui varie",
        paragraphs: [
          "La puissance est généralement maximale à faible état de charge, puis diminue nettement après 60-80 % pour préserver la batterie.",
          "C'est pourquoi la recharge de 10 à 80 % est la plus efficace sur un long trajet.",
        ],
      },
    ],
    relatedTools: ["/outils/temps-recharge", "/outils/puissance-borne-recharge"],
  },
  {
    slug: "quelle-autonomie-pour-mes-besoins",
    title: "Quelle autonomie choisir selon vos besoins ?",
    description:
      "Trop d'autonomie coûte cher et alourdit la voiture. Comment trouver le bon équilibre.",
    category: "Guides",
    author: "La rédaction EVExpert",
    publishedAt: "2026-01-06",
    updatedAt: "2026-01-06",
    readingTime: 5,
    excerpt:
      "Choisir la bonne autonomie, c'est éviter de payer pour des kilomètres que l'on n'utilisera jamais.",
    intro:
      "L'autonomie idéale dépend de votre usage réel. Voici comment la déterminer.",
    sections: [
      {
        heading: "Partir de votre usage",
        paragraphs: [
          "Pour un usage urbain et périurbain, 300 km d'autonomie réelle suffisent largement.",
          "Pour de fréquents longs trajets, privilégier une bonne autonomie et surtout une recharge rapide performante.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique"],
  },
  {
    slug: "marche-voiture-electrique-france",
    title: "Le marché de la voiture électrique en France : où en est-on ?",
    description:
      "Panorama éditorial de la dynamique du marché électrique français et de ses tendances.",
    category: "Marché",
    author: "La rédaction EVExpert",
    publishedAt: "2026-01-04",
    updatedAt: "2026-01-04",
    readingTime: 6,
    excerpt:
      "Offre, prix, recharge : les grandes tendances qui structurent le marché de l'électrique en France.",
    intro:
      "Le marché de la voiture électrique évolue rapidement. Ce panorama éditorial en résume les grandes tendances, sans chiffres inventés.",
    sections: [
      {
        heading: "Une offre de plus en plus large",
        paragraphs: [
          "L'offre s'élargit sur tous les segments, de la micro-citadine au grand SUV, avec une baisse progressive des prix d'entrée de gamme.",
        ],
      },
      {
        heading: "Le réseau de recharge se densifie",
        paragraphs: [
          "Le déploiement des bornes rapides le long des axes majeurs facilite les longs trajets.",
        ],
      },
    ],
  },
  {
    slug: "batterie-duree-de-vie-idees-recues",
    title: "Durée de vie des batteries : les idées reçues",
    description:
      "Non, une batterie de voiture électrique ne se remplace pas tous les cinq ans. Le point sur les mythes.",
    category: "Batterie",
    author: "La rédaction EVExpert",
    publishedAt: "2026-01-02",
    updatedAt: "2026-01-02",
    readingTime: 6,
    excerpt:
      "La longévité des batteries est souvent sous-estimée. Décryptage des idées reçues les plus courantes.",
    intro:
      "La durée de vie des batteries fait l'objet de nombreuses idées reçues. Faisons le tri.",
    sections: [
      {
        heading: "Une dégradation progressive",
        paragraphs: [
          "Une batterie ne tombe pas en panne du jour au lendemain : sa capacité diminue lentement au fil des années.",
          "Les garanties batterie de 8 ans témoignent de la confiance des constructeurs dans leur longévité.",
        ],
      },
    ],
    relatedVehicleIds: ["kia-ev6-grande-autonomie"],
  },
  {
    slug: "type-2-ccs-chademo-connecteurs",
    title: "Type 2, CCS, CHAdeMO : quel connecteur pour quelle recharge ?",
    description:
      "Guide clair des principaux connecteurs de recharge et de leurs usages.",
    category: "Recharge",
    author: "La rédaction EVExpert",
    publishedAt: "2025-12-30",
    updatedAt: "2025-12-30",
    readingTime: 5,
    excerpt:
      "Chaque connecteur a son usage. Voici comment ne plus les confondre.",
    intro:
      "Les connecteurs de recharge peuvent prêter à confusion. Ce guide les remet en ordre.",
    sections: [
      {
        heading: "AC ou DC",
        paragraphs: [
          "Le Type 2 gère la recharge en courant alternatif ; le CCS ajoute la recharge rapide en courant continu.",
          "CHAdeMO, plus ancien, recule au profit du CCS en Europe.",
        ],
      },
    ],
    relatedTools: ["/outils/puissance-borne-recharge"],
  },
  {
    slug: "tco-pourquoi-le-prix-affiche-ne-suffit-pas",
    title: "TCO : pourquoi le prix affiché ne suffit pas",
    description:
      "Le coût total de possession révèle le vrai coût d'une voiture, bien au-delà du prix d'achat.",
    category: "Guides",
    author: "La rédaction EVExpert",
    publishedAt: "2025-12-28",
    updatedAt: "2025-12-28",
    readingTime: 7,
    excerpt:
      "Le TCO agrège tous les coûts d'un véhicule. C'est l'indicateur clé pour comparer honnêtement.",
    intro:
      "Le coût total de possession (TCO) est l'indicateur le plus complet pour comparer deux véhicules.",
    sections: [
      {
        heading: "Ce que le TCO intègre",
        paragraphs: [
          "Achat, dépréciation, énergie, entretien, assurance et pneus : le TCO agrège l'ensemble sur une durée donnée.",
          "La dépréciation est souvent le poste le plus important, devant l'énergie.",
        ],
      },
    ],
    relatedTools: ["/outils/tco-voiture-electrique"],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((a) => a.category === category);
}

export const articleCategories: ArticleCategory[] = [
  "Actualités",
  "Guides",
  "Comparatifs",
  "Recharge",
  "Batterie",
  "Technologie",
  "Marché",
];
