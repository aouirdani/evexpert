import type { Article, ArticleCategory, Vehicle } from "@/types";
import { SOURCES } from "@/data/sources";
import { averageDcPower, batteryConsumption100 } from "@/lib/vehicle-calcs";
import { formatNumber } from "@/lib/utils";

export function buildArticles(vehicles: Vehicle[]): Article[] {

  /**
   * Articles du blog. Politique éditoriale : pas d'actualité non vérifiée. Les
   * analyses reposent sur le catalogue EVExpert et sont recalculées à chaque
   * build : chaque chiffre publié peut être retrouvé dans les fiches véhicules.
   */

  const DATE = "2026-09-21";
  const N = vehicles.length;
  const name = (v: Vehicle) => `${v.brand} ${v.model} ${v.version}`;
  const median = (a: number[]) => {
    const s = [...a].sort((x, y) => x - y);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };

  const byCons = [...vehicles].sort((a, b) => batteryConsumption100(a) - batteryConsumption100(b));
  const withDc = vehicles.filter((v): v is Vehicle & { chargingTime10to80: number; chargingDC: number } => v.chargingTime10to80 !== null && v.chargingDC !== null);
  const byTime = [...withDc].sort((a, b) => a.chargingTime10to80 - b.chargingTime10to80 || b.chargingDC - a.chargingDC);
  const lfp = vehicles.filter((v) => v.chemistry === "LFP");
  const nmc = vehicles.filter((v) => v.chemistry === "NMC");
  const avg = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;

  const bodyTypes = ["citadine", "compacte", "berline", "SUV"] as const;
  const bodyStats = bodyTypes.map((b) => {
    const l = vehicles.filter((v) => v.bodyType === b);
    return { b, n: l.length, cons: avg(l.map(batteryConsumption100)), range: avg(l.map((v) => v.rangeWltp)) };
  });

  const rangeBuckets: [string, (r: number) => boolean][] = [
    ["Moins de 350 km", (r) => r < 350],
    ["350 à 449 km", (r) => r >= 350 && r < 450],
    ["450 à 549 km", (r) => r >= 450 && r < 550],
    ["550 à 649 km", (r) => r >= 550 && r < 650],
    ["650 km et plus", (r) => r >= 650],
  ];

  const acValues = Array.from(new Set(vehicles.map((v) => v.chargingAC))).sort((a, b) => a - b);

  return [
  {
    slug: "voitures-electriques-les-plus-sobres",
    title: "Les voitures électriques les plus sobres de notre catalogue",
    description:
      `Consommation calculée de ${N} versions : quelles voitures électriques consomment le moins d'énergie aux 100 km, et ce que cela change pour le coût d'usage.`,
    category: "Marché électrique",
    author: "La rédaction EVExpert",
    publishedAt: DATE,
    updatedAt: DATE,
    readingTime: 5,
    excerpt: `Classement objectif de ${N} versions par consommation calculée (capacité utile ÷ autonomie WLTP), et lecture par type de carrosserie.`,
    intro: `La consommation détermine votre coût d'énergie et l'autonomie que vous tirez de la batterie. Nous avons calculé, pour chacune des ${N} versions du catalogue, la consommation côté batterie à partir de la capacité utile et de l'autonomie WLTP publiées par la source.`,
    sections: [
      {
        heading: "Les dix consommations calculées les plus basses",
        paragraphs: [
          "Consommation calculée = capacité utile ÷ autonomie WLTP × 100 (côté batterie, avant pertes de charge). C'est une valeur d'homologation, qui ne reflète ni l'autoroute ni l'hiver.",
        ],
        table: {
          headers: ["Modèle", "Consommation calculée", "Batterie utile", "Autonomie WLTP", "Poids"],
          rows: byCons.slice(0, 10).map((v) => [
            name(v),
            `${formatNumber(batteryConsumption100(v), 1)} kWh/100 km`,
            `${formatNumber(v.batteryUsable, 1)} kWh`,
            `${formatNumber(v.rangeWltp)} km`,
            v.weight ? `${formatNumber(v.weight)} kg` : "Non disponible",
          ]),
        },
      },
      {
        heading: "Par type de carrosserie",
        paragraphs: [
          "La moyenne des consommations calculées par type de carrosserie montre l'effet de la taille, du poids et de l'aérodynamique. Ces moyennes portent sur des échantillons de tailles différentes : elles décrivent le catalogue, pas le marché.",
        ],
        table: {
          headers: ["Carrosserie", "Versions", "Consommation moyenne calculée", "Autonomie WLTP moyenne"],
          rows: bodyStats.map((s) => [s.b, String(s.n), `${formatNumber(s.cons, 1)} kWh/100 km`, `${formatNumber(s.range)} km`]),
        },
      },
      {
        heading: `Écart entre la plus sobre et la plus gourmande`,
        paragraphs: [
          `Dans le catalogue, la consommation calculée va de ${formatNumber(batteryConsumption100(byCons[0]), 1)} kWh/100 km (${name(byCons[0])}) à ${formatNumber(batteryConsumption100(byCons[N - 1]), 1)} kWh/100 km (${name(byCons[N - 1])}). À un même prix du kWh, l'écart de coût d'énergie aux 100 km suit exactement ce rapport de ${formatNumber(batteryConsumption100(byCons[N - 1]) / batteryConsumption100(byCons[0]), 2)}.`,
        ],
      },
      {
        heading: "Comment utiliser ces chiffres",
        paragraphs: [
          "Une consommation plus basse réduit le coût d'énergie, mais ce n'est qu'un critère : la taille, le confort, l'autonomie et la recharge comptent autant. Convertissez la consommation en euros avec le calculateur de coût aux 100 km, en saisissant votre tarif.",
        ],
      },
    ],
    relatedTools: ["/outils/cout-100-km", "/outils/autonomie-voiture-electrique"],
    relatedGuides: ["cout-100-km-voiture-electrique", "wltp-definition", "calculer-autonomie-reelle"],
    relatedVehicleIds: [byCons[0].id, byCons[1].id, byCons[2].id],
    faq: [
      { question: "Cette consommation est-elle celle que je verrai au tableau de bord ?", answer: "Non : elle est calculée sur les valeurs d'homologation, côté batterie. Votre consommation réelle dépend de la vitesse, de la température et du trajet." },
      { question: "Pourquoi certaines grosses voitures consomment-elles peu ?", answer: "Une bonne aérodynamique, un rendement de groupe motopropulseur élevé et une charge de batterie bien exploitée peuvent compenser la taille." },
    ],
    sources: [SOURCES.evdb, SOURCES.wltp],
  },
  {
    slug: "recharge-rapide-temps-10-80",
    title: "Recharge rapide : ce que disent les temps 10-80 % de notre catalogue",
    description:
      `Temps de charge 10-80 %, puissance maximale et puissance moyenne : ce que les données de ${N} versions révèlent sur la recharge rapide, et comment les lire.`,
    category: "Recharge",
    author: "La rédaction EVExpert",
    publishedAt: DATE,
    updatedAt: DATE,
    readingTime: 5,
    excerpt: "La puissance maximale ne dit pas tout : nous comparons les temps de charge 10-80 % et les puissances moyennes déduites.",
    intro: `Sur ${withDc.length} versions du catalogue, la source publie une puissance DC maximale et un temps de charge de 10 à 80 %. Rapprocher les deux montre pourquoi le pic de puissance est un mauvais critère à lui seul.`,
    sections: [
      {
        heading: "Les charges 10-80 % les plus courtes",
        paragraphs: [
          "Puissance moyenne = énergie de la fenêtre 10-80 % (70 % de la capacité utile) ÷ durée. C'est un calcul EVExpert sur des données publiées.",
        ],
        table: {
          headers: ["Modèle", "DC max.", "10-80 %", "Puissance moyenne"],
          rows: byTime.slice(0, 10).map((v) => [name(v), `${formatNumber(v.chargingDC)} kW`, `${v.chargingTime10to80} min`, `${formatNumber(averageDcPower(v) ?? 0)} kW`]),
        },
      },
      {
        heading: "Un temps médian autour de la demi-heure",
        paragraphs: [
          `Le temps de charge 10-80 % médian du catalogue est de ${formatNumber(median(withDc.map((v) => v.chargingTime10to80)))} minutes, avec des valeurs comprises entre ${byTime[0].chargingTime10to80} et ${byTime[byTime.length - 1].chargingTime10to80} minutes. Une charge dont la durée est proche de la médiane suffit pour une pause sur autoroute.`,
        ],
      },
      {
        heading: "Un pic élevé n'est pas un temps court",
        paragraphs: [
          "La puissance moyenne représente en général une fraction du pic. Une petite batterie peut afficher un temps très court avec une puissance modeste, alors qu'une grande batterie a besoin d'une puissance plus élevée pour un temps équivalent. C'est pourquoi le temps 10-80 % est le meilleur indicateur, à condition de le rapporter à la capacité de la batterie.",
        ],
      },
      {
        heading: "En pratique",
        paragraphs: [
          "Sur un long trajet, le temps d'arrêt dépend aussi de la borne, de la température de la batterie et de l'état de charge à l'arrivée. Voir le guide sur la puissance de recharge DC pour comprendre ces limites.",
        ],
      },
    ],
    relatedTools: ["/outils/temps-recharge", "/outils/puissance-borne-recharge"],
    relatedGuides: ["puissance-recharge-dc", "temps-recharge-voiture-electrique", "recharger-a-80-pourcent"],
    relatedVehicleIds: [byTime[0].id, byTime[1].id, byTime[2].id],
    faq: [
      { question: "Ces temps sont-ils garantis ?", answer: "Non : ce sont des valeurs publiées par la source dans de bonnes conditions (borne assez puissante, batterie à température adaptée)." },
    ],
    sources: [SOURCES.evdb],
  },
  {
    slug: "autonomie-wltp-repartition-catalogue",
    title: "Autonomie WLTP : comment se répartissent les modèles du catalogue ?",
    description:
      `Répartition des autonomies WLTP de ${N} versions par tranche, autonomie médiane et lien avec la taille de la batterie : un panorama chiffré et sourcé.`,
    category: "Batteries",
    author: "La rédaction EVExpert",
    publishedAt: DATE,
    updatedAt: DATE,
    readingTime: 4,
    excerpt: "Quelle est l'autonomie WLTP typique d'une voiture électrique du catalogue ? Répartition par tranche et rapport avec la capacité de batterie.",
    intro: `L'autonomie WLTP est le chiffre le plus cité pour comparer les voitures électriques. Voici comment elle se répartit sur les ${N} versions du catalogue, et ce qu'elle doit à la taille de la batterie.`,
    sections: [
      {
        heading: "Répartition par tranche d'autonomie",
        paragraphs: [`L'autonomie WLTP médiane du catalogue est de ${formatNumber(median(vehicles.map((v) => v.rangeWltp)))} km.`],
        table: {
          headers: ["Tranche d'autonomie WLTP", "Nombre de versions"],
          rows: rangeBuckets.map(([label, f]) => [label, String(vehicles.filter((v) => f(v.rangeWltp)).length)]),
        },
      },
      {
        heading: "La batterie n'explique pas tout",
        paragraphs: [
          "Une batterie plus grande donne plus d'autonomie, mais deux modèles à capacité égale peuvent afficher des autonomies très différentes selon leur consommation. Voici trois versions de capacité utile proche, mais d'autonomie WLTP différente :",
        ],
        table: {
          headers: ["Modèle", "Batterie utile", "Autonomie WLTP", "Consommation calculée"],
          rows: [...vehicles]
            .filter((v) => v.batteryUsable >= 74 && v.batteryUsable <= 80)
            .sort((a, b) => b.rangeWltp - a.rangeWltp)
            .filter((_, i, arr) => i === 0 || i === Math.floor(arr.length / 2) || i === arr.length - 1)
            .map((v) => [name(v), `${formatNumber(v.batteryUsable, 1)} kWh`, `${formatNumber(v.rangeWltp)} km`, `${formatNumber(batteryConsumption100(v), 1)} kWh/100 km`]),
        },
      },
      {
        heading: "Ce qu'il faut en retenir",
        paragraphs: [
          "Comparez toujours l'autonomie et la consommation ensemble, et convertissez l'autonomie WLTP en autonomie dans vos conditions avec le calculateur d'autonomie réelle.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique"],
    relatedGuides: ["wltp-definition", "calculer-autonomie-reelle", "batterie-brute-batterie-utile"],
    relatedVehicleIds: [],
    faq: [{ question: "Le catalogue représente-t-il tout le marché ?", answer: `Non : il compte ${N} versions choisies parmi les modèles pertinents en France, pas l'ensemble des véhicules vendus.` }],
    sources: [SOURCES.evdb, SOURCES.wltp],
  },
  {
    slug: "lfp-ou-nmc-ce-que-montrent-les-donnees",
    title: "Batteries LFP ou NMC : ce que montrent les données du catalogue",
    description:
      "LFP contre NMC : différences de chimie, et comparaison chiffrée des versions du catalogue équipées de l'une ou l'autre, avec les limites de l'exercice.",
    category: "Technologie",
    author: "La rédaction EVExpert",
    publishedAt: DATE,
    updatedAt: DATE,
    readingTime: 5,
    excerpt: `${lfp.length} versions LFP et ${nmc.length} NMC dans le catalogue : ce que la chimie change en pratique, et ce que les chiffres ne permettent pas de conclure.`,
    intro: `Les batteries lithium-fer-phosphate (LFP) et lithium nickel-manganèse-cobalt (NMC) se partagent le marché. Dans le catalogue, la source indique la chimie pour ${lfp.length + nmc.length} versions : ${lfp.length} en LFP et ${nmc.length} en NMC.`,
    sections: [
      {
        heading: "Deux chimies, deux compromis",
        paragraphs: [
          "Les cellules LFP n'utilisent ni nickel ni cobalt. Elles supportent bien les charges répétées à 100 % et sont réputées robustes, mais elles stockent moins d'énergie à poids égal. Les cellules NMC ont une densité énergétique plus élevée, ce qui favorise les grandes autonomies, et sont plus sensibles à un stockage prolongé à un niveau de charge élevé.",
        ],
      },
      {
        heading: "Ce que montrent nos données",
        paragraphs: [
          "Moyennes calculées sur les versions dont la chimie est indiquée. Les échantillons sont petits et de segments différents : ce sont des constats sur le catalogue, non des lois générales.",
        ],
        table: {
          headers: ["Chimie", "Versions", "Batterie utile moyenne", "Autonomie WLTP moyenne", "Consommation moyenne calculée"],
          rows: [
            ["LFP", String(lfp.length), `${formatNumber(avg(lfp.map((v) => v.batteryUsable)), 1)} kWh`, `${formatNumber(avg(lfp.map((v) => v.rangeWltp)))} km`, `${formatNumber(avg(lfp.map(batteryConsumption100)), 1)} kWh/100 km`],
            ["NMC", String(nmc.length), `${formatNumber(avg(nmc.map((v) => v.batteryUsable)), 1)} kWh`, `${formatNumber(avg(nmc.map((v) => v.rangeWltp)))} km`, `${formatNumber(avg(nmc.map(batteryConsumption100)), 1)} kWh/100 km`],
          ],
        },
      },
      {
        heading: "Les versions LFP du catalogue",
        paragraphs: [],
        list: lfp.map((v) => `${name(v)} : ${formatNumber(v.batteryUsable, 1)} kWh utiles, ${formatNumber(v.rangeWltp)} km WLTP`),
      },
      {
        heading: "Que conclure ?",
        paragraphs: [
          "Le choix de chimie compte pour la façon de charger au quotidien (voir le guide sur la charge à 80 %) et pour le coût de fabrication, mais il ne détermine pas seul l'autonomie ni la qualité d'un modèle. Consultez la notice du constructeur pour la recommandation de charge de votre version.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique"],
    relatedGuides: ["recharger-a-80-pourcent", "preserver-batterie-voiture-electrique", "batterie-brute-batterie-utile"],
    relatedVehicleIds: lfp.slice(0, 3).map((v) => v.id),
    faq: [{ question: "Comment savoir si ma voiture est LFP ou NMC ?", answer: "La notice ou la fiche constructeur l'indique ; la chimie peut varier selon la version et l'année de production." }],
    sources: [SOURCES.evdb, SOURCES.avere],
  },
  {
    slug: "recharge-ac-puissances-acceptees",
    title: "Recharge AC : quelles puissances acceptent les voitures du catalogue ?",
    description:
      "Répartition des puissances AC maximales (6,6 à 22 kW) des voitures du catalogue et conséquences pour choisir une borne à domicile.",
    category: "Recharge",
    author: "La rédaction EVExpert",
    publishedAt: DATE,
    updatedAt: DATE,
    readingTime: 4,
    excerpt: "Une wallbox 22 kW ne sert à rien si la voiture accepte 11 kW : voici la répartition des puissances AC acceptées dans le catalogue.",
    intro: `Avant d'acheter une borne à domicile, il faut savoir ce que la voiture accepte en courant alternatif. Voici les puissances AC maximales relevées sur les ${N} versions du catalogue.`,
    sections: [
      {
        heading: "Répartition des puissances AC maximales",
        paragraphs: [],
        table: {
          headers: ["Puissance AC maximale", "Nombre de versions", "Exemples"],
          rows: acValues.map((kw) => {
            const l = vehicles.filter((v) => v.chargingAC === kw);
            return [`${formatNumber(kw, 1)} kW`, String(l.length), l.slice(0, 3).map((v) => `${v.brand} ${v.model}`).join(", ")];
          }),
        },
      },
      {
        heading: "Ce que cela implique",
        paragraphs: [
          `${formatNumber((vehicles.filter((v) => v.chargingAC === 11).length / N) * 100)} % des versions du catalogue acceptent 11 kW en AC : c'est la valeur la plus répandue. Une borne triphasée 11 kW est donc adaptée à la plupart d'entre elles, alors qu'une borne 22 kW ne profite qu'aux modèles qui l'acceptent.`,
          "Pour les petites citadines, 7,4 kW peut suffire, voire moins pour un usage occasionnel.",
        ],
      },
      {
        heading: "Avant de commander une borne",
        paragraphs: [
          "Vérifiez la limite AC de votre modèle exact (elle peut varier selon la version ou l'option) et votre puissance souscrite. Simulez ensuite le temps de recharge avec l'outil sur la puissance de borne.",
        ],
      },
    ],
    relatedTools: ["/outils/puissance-borne-recharge", "/outils/temps-recharge"],
    relatedGuides: ["puissance-borne-7-11-22-kw", "cout-borne-recharge-domicile", "recharge-ac-ou-dc"],
    relatedVehicleIds: [],
    faq: [{ question: "Ces limites peuvent-elles changer avec une option ?", answer: "Oui : certains modèles proposent un chargeur plus puissant en option. Vérifiez la configuration exacte." }],
    sources: [SOURCES.evdb],
  },
  {
    slug: "comment-evexpert-construit-sa-base",
    title: "Comment EVExpert construit sa base de données véhicules (et ce qu'elle ne contient pas encore)",
    description:
      "Sources, contrôles de cohérence, champs volontairement vides et prochaines étapes : la transparence sur la base de véhicules d'EVExpert.",
    category: "Nouveautés",
    author: "La rédaction EVExpert",
    publishedAt: DATE,
    updatedAt: DATE,
    readingTime: 4,
    excerpt: "D'où viennent nos données, comment elles sont contrôlées, et pourquoi le prix en France n'y figure pas encore.",
    intro: `La base de véhicules d'EVExpert compte aujourd'hui ${N} versions issues de ${new Set(vehicles.map((v) => v.brandSlug)).size} marques. Voici comment elle est construite, et ce qu'elle ne fait pas encore.`,
    sections: [
      {
        heading: "D'où viennent les données",
        paragraphs: [
          "Les caractéristiques techniques proviennent de la base spécialisée EV Database, relevées le 21 septembre 2026. Ce n'est pas une source constructeur : chaque fiche l'indique par la mention « Source spécialisée » et renvoie vers la fiche d'origine.",
        ],
      },
      {
        heading: "Contrôles de cohérence",
        paragraphs: [
          "Un script contrôle chaque ligne du catalogue avant publication : batterie utile inférieure ou égale à la brute, puissances en kW et en chevaux concordantes, consommation cohérente avec la capacité et l'autonomie, temps de charge et vitesses dans des plages plausibles. Une donnée jugée incohérente est mise à vide plutôt que corrigée à la main.",
        ],
      },
      {
        heading: "Ce qui manque volontairement",
        paragraphs: [],
        list: [
          "Le prix en France : les prix publiés par la source concernent d'autres marchés et ne sont pas transposables. Tant qu'une source française n'est pas intégrée, le prix reste « Non disponible ».",
          "La garantie véhicule : non collectée à ce stade.",
          "Certaines consommations WLTP, absentes ou incohérentes dans la source.",
        ],
      },
      {
        heading: "Et ensuite ?",
        paragraphs: [
          "Les prochaines étapes sont l'ajout de sources constructeur pour les points importants, d'un prix France sourcé et daté, et de nouveaux modèles. Chaque évolution sera documentée sur la page Méthodologie.",
        ],
      },
    ],
    relatedTools: ["/outils/cout-100-km"],
    relatedGuides: ["wltp-definition", "batterie-brute-batterie-utile"],
    relatedVehicleIds: [],
    faq: [{ question: "Puis-je signaler une erreur ?", answer: "Oui : utilisez la page Contact en précisant le modèle, la donnée concernée et la source à l'appui." }],
    sources: [SOURCES.evdb],
  },
  ];
}

export const articleCategories: ArticleCategory[] = [
  "Nouveautés",
  "Marché électrique",
  "Recharge",
  "Batteries",
  "Prix",
  "Technologie",
  "Guides pratiques",
];
