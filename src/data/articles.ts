import type { Article, ArticleCategory, Vehicle } from "@/types";
import { SOURCES } from "@/data/sources";
import { acChargeMinutes, averageDcPower, batteryConsumption100 } from "@/lib/vehicle-calcs";
import { formatNumber, minutesToHuman } from "@/lib/format";

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

  const filled = (f: (v: Vehicle) => unknown) => vehicles.filter((v) => f(v) !== null && f(v) !== undefined).length;
  const coverage = [
    { label: "Capacité brute de la batterie", filled: filled((v) => v.batteryGross) },
    { label: "Chimie de la batterie (LFP ou NMC)", filled: filled((v) => v.chemistry) },
    { label: "Consommation WLTP publiée", filled: filled((v) => v.consumptionWltp) },
    { label: "Puissance DC et temps de charge 10-80 %", filled: vehicles.filter((v) => v.chargingDC !== null && v.chargingTime10to80 !== null).length },
    { label: "Couple", filled: filled((v) => v.torque) },
    { label: "Coffre, banquette rabattue", filled: filled((v) => v.trunkVolumeMax) },
    { label: "Garantie batterie", filled: filled((v) => v.batteryWarranty) },
    { label: "Garantie du véhicule", filled: filled((v) => v.warranty) },
  ];

  // Garantie batterie : la source publie du texte libre (« 8 ans / 160 000 km », « 8 ans », « 100 000 miles »…).
  const warranty = vehicles.map((v) => {
    const t = (v.batteryWarranty ?? "").replace(/[\u00a0\u202f]/g, " ").replace(/\s+/g, " ").trim();
    const years = /(\d+)\s*ans?/i.exec(t);
    return { v, label: t, years: years ? Number(years[1]) : null, miles: /miles/i.test(t), km: /km/i.test(t) };
  });
  const warrantyGroups = [...new Set(warranty.map((w) => w.label))]
    .map((label) => ({ label, list: warranty.filter((w) => w.label === label) }))
    .sort((a, b) => b.list.length - a.list.length);

  return [
  {
    slug: "voitures-electriques-les-plus-sobres",
    title: "Les voitures électriques les plus sobres de notre catalogue",
    description:
      `Consommation calculée de ${N} versions : quelles voitures électriques consomment le moins d'énergie aux 100 km, et ce que cela change pour le coût d'usage.`,
    category: "Marché électrique",
    author: "La rédaction EVExpert",
    publishedAt: DATE,
    updatedAt: "2026-09-24",
    readingTime: 5,
    excerpt: `Classement objectif de ${N} versions par consommation calculée (capacité utile ÷ autonomie WLTP), et lecture par type de carrosserie.`,
    intro: `La consommation détermine votre coût d'énergie et l'autonomie que vous tirez de la batterie. Nous avons calculé, pour chacune des ${N} versions du catalogue, la consommation côté batterie à partir de la capacité utile et de l'autonomie WLTP publiées par la source.`,
    sections: [
      {
        heading: "Les dix consommations calculées les plus basses",
        chart: {
          title: "Consommation calculée : les dix versions les plus sobres",
          unit: "kWh/100 km",
          bars: byCons.slice(0, 10).map((v) => ({ label: name(v), value: batteryConsumption100(v), display: formatNumber(batteryConsumption100(v), 1) })),
          caption: "Calcul EVExpert : capacité utile ÷ autonomie WLTP × 100 (côté batterie, valeurs d'homologation).",
        },
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
          "Pour la méthode complète — la différence entre consommation côté batterie et à la prise, et la conversion kWh/km, kWh/100 km, km/kWh — voir le [guide sur la consommation d'une voiture électrique](/guides/consommation-voiture-electrique-kwh-100-km).",
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
    updatedAt: "2026-09-24",
    readingTime: 5,
    excerpt: "La puissance maximale ne dit pas tout : nous comparons les temps de charge 10-80 % et les puissances moyennes déduites.",
    intro: `Sur ${withDc.length} versions du catalogue, la source publie une puissance DC maximale et un temps de charge de 10 à 80 %. Rapprocher les deux montre pourquoi le pic de puissance est un mauvais critère à lui seul.`,
    sections: [
      {
        heading: "Les charges 10-80 % les plus courtes",
        chart: {
          title: "Temps de charge 10-80 % : les dix versions les plus rapides",
          unit: "min",
          bars: byTime.slice(0, 10).map((v) => ({ label: name(v), value: v.chargingTime10to80 })),
          caption: "Temps publiés par la source spécialisée, en conditions favorables (borne assez puissante, batterie à bonne température).",
        },
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
          "Pour les temps de charge de l'ensemble des versions du catalogue, pas seulement les dix plus rapides, voir le [guide sur le temps de recharge d'une voiture électrique](/guides/temps-recharge-voiture-electrique).",
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
    updatedAt: "2026-09-24",
    readingTime: 4,
    excerpt: "Quelle est l'autonomie WLTP typique d'une voiture électrique du catalogue ? Répartition par tranche et rapport avec la capacité de batterie.",
    intro: `L'autonomie WLTP est le chiffre le plus cité pour comparer les voitures électriques. Voici comment elle se répartit sur les ${N} versions du catalogue, et ce qu'elle doit à la taille de la batterie.`,
    sections: [
      {
        heading: "Répartition par tranche d'autonomie",
        chart: {
          title: "Nombre de versions par tranche d'autonomie WLTP",
          unit: "versions",
          bars: rangeBuckets.map(([label, f]) => ({ label, value: vehicles.filter((v) => f(v.rangeWltp)).length })),
          caption: `Sur les ${N} versions du catalogue ; autonomie WLTP mixte publiée par la source.`,
        },
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
        heading: "Par type de carrosserie",
        paragraphs: [
          "L'autonomie médiane varie avec le format de la voiture, mais les échantillons sont inégaux (quatre types seulement dans le catalogue) : lisez ce tableau comme un aperçu du catalogue.",
        ],
        table: {
          caption: "Autonomie WLTP par carrosserie",
          headers: ["Carrosserie", "Versions", "Autonomie médiane", "Plus faible", "Plus élevée"],
          rows: bodyTypes.map((b) => {
            const r = vehicles.filter((v) => v.bodyType === b).map((v) => v.rangeWltp);
            return [b, String(r.length), `${formatNumber(median(r))} km`, `${formatNumber(Math.min(...r))} km`, `${formatNumber(Math.max(...r))} km`];
          }),
        },
      },
      {
        heading: "Ce qu'il faut en retenir",
        paragraphs: [
          "Comparez toujours l'autonomie et la consommation ensemble, et convertissez l'autonomie WLTP en autonomie dans vos conditions avec le calculateur d'autonomie réelle.",
          "Pour trier vous-même l'ensemble du catalogue par autonomie plutôt que par tranche, consultez la [liste des voitures électriques](/voitures-electriques).",
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
        chart: {
          title: "Autonomie WLTP moyenne selon la chimie de la batterie",
          unit: "km",
          bars: [
            { label: `LFP (${lfp.length} versions)`, value: avg(lfp.map((v) => v.rangeWltp)) },
            { label: `NMC (${nmc.length} versions)`, value: avg(nmc.map((v) => v.rangeWltp)) },
          ],
          caption: "Moyennes sur des échantillons de tailles et de segments différents : un constat sur le catalogue, pas une loi générale.",
        },
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
        chart: {
          title: "Nombre de versions par puissance AC maximale",
          unit: "versions",
          bars: acValues.map((kw) => ({ label: `${formatNumber(kw, 1)} kW`, value: vehicles.filter((v) => v.chargingAC === kw).length })),
          caption: `Sur les ${N} versions du catalogue ; puissance de charge AC maximale publiée par la source.`,
        },
        paragraphs: [],
        table: {
          headers: ["Puissance AC maximale", "Nombre de versions", "Exemples"],
          rows: acValues.map((kw) => {
            const l = vehicles.filter((v) => v.chargingAC === kw);
            return [`${formatNumber(kw, 1)} kW`, String(l.length), [...new Set(l.map((v) => `${v.brand} ${v.model}`))].slice(0, 3).join(", ")];
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
        heading: "Combien de temps de recharge à la maison ?",
        paragraphs: [
          `Pour un modèle de chaque niveau de puissance AC, durée d'une recharge de 10 à 80 % (calcul EVExpert, rendement 90 %). La colonne « 22 kW » montre l'intérêt limité d'une borne plus puissante que le chargeur de la voiture : la durée ne diminue pas.`,
        ],
        table: {
          caption: "Recharge de 10 à 80 % selon la puissance de la borne",
          headers: ["Modèle", "AC maximale", "Sur 7,4 kW", "Sur 11 kW", "Sur 22 kW"],
          rows: acValues.map((kw) => {
            const l = vehicles.filter((v) => v.chargingAC === kw).sort((a, b) => a.batteryUsable - b.batteryUsable);
            const v = l[Math.floor(l.length / 2)];
            return [name(v), `${formatNumber(kw, 1)} kW`, ...[7.4, 11, 22].map((st) => minutesToHuman(acChargeMinutes(v, st).minutes))];
          }),
        },
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
        heading: "Complétude des données",
        paragraphs: [
          `Une donnée absente de la source reste vide et s'affiche « Non disponible » : elle n'est jamais estimée. Voici le nombre de versions renseignées, sur ${N}, pour les champs facultatifs :`,
        ],
        chart: {
          title: "Part des versions dont le champ est renseigné",
          unit: "%",
          bars: coverage.map((c) => ({ label: c.label, value: (c.filled / N) * 100, display: formatNumber((c.filled / N) * 100) })),
          max: 100,
          caption: `Sur ${N} versions. Les champs obligatoires (autonomie, capacité utile, puissances) sont renseignés pour toutes.`,
        },
        table: {
          headers: ["Donnée", "Versions renseignées", "Non disponible"],
          rows: coverage.map((c) => [c.label, `${c.filled} sur ${N}`, String(N - c.filled)]),
        },
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
  {
    slug: "garantie-batterie-ce-que-disent-les-donnees",
    title: `Garantie batterie : ce que disent les ${N} versions du catalogue`,
    description: `Durée et kilométrage de la garantie batterie des ${N} versions du catalogue : ce que la source publie, ce qu'elle ne précise pas et comment lire ces chiffres.`,
    category: "Batteries",
    author: "La rédaction EVExpert",
    publishedAt: DATE,
    updatedAt: DATE,
    readingTime: 4,
    excerpt: `${warranty.filter((w) => w.years === 8).length} versions sur ${N} annoncent 8 ans de garantie batterie : ce que cela recouvre, et ce que la source ne dit pas.`,
    intro: `La garantie de la batterie rassure, mais elle se lit avec précaution. Voici ce que la source publie pour les ${N} versions du catalogue, et les points à vérifier avant de s'y fier.`,
    sections: [
      {
        heading: "Ce que publie la source",
        paragraphs: [
          `${warranty.filter((w) => w.years === 8).length} versions sur ${N} sont annoncées avec 8 ans de garantie batterie, ${warranty.filter((w) => w.years === 7).length} avec 7 ans. La durée est le plus souvent accompagnée d'un kilométrage, mais pas toujours : ${warranty.filter((w) => !w.km && !w.miles).length} versions sur ${N} n'en ont pas dans la source.`,
        ],
        chart: {
          title: "Nombre de versions par garantie batterie publiée",
          unit: "versions",
          bars: warrantyGroups.map((g) => ({ label: g.label, value: g.list.length })),
          caption: "Texte de garantie tel que publié par la source spécialisée, regroupé à l'identique.",
        },
        table: {
          caption: "Garantie batterie publiée par la source",
          headers: ["Garantie publiée", "Versions", "Exemples"],
          rows: warrantyGroups.map((g) => [g.label, String(g.list.length), [...new Set(g.list.map((w) => `${w.v.brand} ${w.v.model}`))].slice(0, 3).join(", ")]),
        },
      },
      {
        heading: "Ce que les chiffres ne disent pas",
        paragraphs: [
          "La source ne précise ni le seuil de capacité couvert, ni les conditions d'application, ni le transfert au propriétaire suivant. Ces éléments figurent dans la notice de garantie du constructeur, qu'EVExpert ne collecte pas encore. Avant d'acheter, demandez le document exact de la version visée et vérifiez :",
        ],
        list: [
          "le seuil couvert : en général une perte de capacité au-delà d'une valeur exprimée en pourcentage, à lire dans la notice ;",
          "si la limite est la durée « ou » le kilométrage, c'est-à-dire la première atteinte, ou les deux ;",
          "les obligations d'entretien et de contrôle exigées pour conserver la garantie ;",
          "les conditions de transfert en cas de revente.",
        ],
      },
      {
        heading: "Miles, kilomètres et valeurs manquantes",
        paragraphs: [
          `${warranty.filter((w) => w.miles).length} versions sont publiées en miles (100 000 miles, soit environ 160 900 km par simple conversion) : vérifiez la garantie applicable en France. Lorsque le kilométrage est absent de la source, EVExpert n'en invente pas : la donnée reste « Non disponible ».`,
        ],
      },
      {
        heading: "Comment utiliser ces données",
        paragraphs: [
          "La garantie est un critère parmi d'autres : elle ne prédit pas la durée de vie de la batterie, qui dépend aussi des habitudes de charge et de la chaleur. Pour la ménager, voir comment préserver la batterie d'une voiture électrique. Pour comparer deux versions, ouvrez leurs fiches et le comparateur.",
        ],
      },
    ],
    relatedTools: ["/outils/tco-voiture-electrique"],
    relatedGuides: ["preserver-batterie-voiture-electrique", "recharger-a-80-pourcent", "batterie-brute-batterie-utile"],
    relatedVehicleIds: warranty.filter((w) => w.years === 8 && w.km).slice(0, 3).map((w) => w.v.id),
    faq: [
      {
        question: "Que signifie « 8 ans / 160 000 km » ?",
        answer: "En général, la garantie s'applique jusqu'à la première des deux limites atteinte, mais la formulation exacte est fixée par le constructeur : vérifiez la notice de la version concernée.",
      },
      {
        question: "La garantie couvre-t-elle l'usure normale de la batterie ?",
        answer: "Elle porte en général sur une perte de capacité au-delà d'un seuil ou sur un défaut, pas sur l'usure normale, mais les conditions varient d'un constructeur à l'autre : la source ne les précise pas.",
      },
    ],
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
