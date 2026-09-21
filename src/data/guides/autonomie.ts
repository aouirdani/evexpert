import type { Guide } from "@/types";
import { SOURCES } from "@/data/sources";
import { RANGE_SCENARIOS, batteryConsumption100, estimateRange } from "@/lib/vehicle-calcs";
import { formatNumber } from "@/lib/utils";
import { GUIDE_DATE, veh } from "./helpers";

const r5 = veh("renault-5-e-tech-52-kwh-150-ch");
const my = veh("tesla-model-y-rwd");
const ev3 = veh("kia-ev3-long-range");
const scen = (id: string) => RANGE_SCENARIOS.find((s) => s.id === id)!;
const km = (v: typeof r5, id: string) => formatNumber(Math.round(estimateRange(v, scen(id)) / 5) * 5);

export const autonomieGuides: Guide[] = [
  {
    slug: "calculer-autonomie-reelle",
    category: "autonomie",
    title: "Comment calculer l'autonomie réelle d'une voiture électrique ?",
    description:
      "Méthode pas à pas pour estimer l'autonomie réelle d'une voiture électrique : capacité utile, consommation, vitesse, température, avec exemples chiffrés.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 7,
    intro:
      "L'autonomie annoncée par un constructeur est une valeur d'homologation. Pour savoir ce que vous parcourrez vraiment, il faut partir de deux données simples — l'énergie disponible dans la batterie et votre consommation — puis les corriger de ce qui change vos conditions réelles.",
    sections: [
      {
        heading: "La formule de base",
        paragraphs: [
          "L'autonomie est le rapport entre l'énergie utilisable et l'énergie consommée par kilomètre : autonomie (km) = énergie utile (kWh) ÷ consommation (kWh/100 km) × 100.",
          "L'énergie utile est la capacité que la voiture laisse réellement à l'utilisateur, pas la capacité brute de la batterie (voir le guide sur la batterie brute et utile). La consommation est celle de votre trajet, pas celle de la fiche technique.",
        ],
      },
      {
        heading: "Partir de la consommation WLTP",
        paragraphs: [
          `Si vous ne connaissez pas encore votre consommation, une référence consiste à diviser la capacité utile par l'autonomie WLTP. Pour la ${r5.brand} ${r5.model} (${r5.version}), la source donne ${formatNumber(r5.batteryUsable, 1)} kWh utiles et ${r5.rangeWltp} km WLTP : ${formatNumber(r5.batteryUsable, 1)} ÷ ${r5.rangeWltp} × 100 ≈ ${formatNumber(batteryConsumption100(r5), 1)} kWh/100 km côté batterie.`,
          "Cette valeur correspond aux conditions de laboratoire. C'est un point de départ, pas une prévision.",
        ],
      },
      {
        heading: "Les facteurs qui font varier la consommation",
        paragraphs: ["Quatre facteurs pèsent le plus, dans l'ordre où ils se manifestent en usage courant :"],
        list: [
          "La vitesse : la résistance de l'air augmente avec le carré de la vitesse, donc la consommation grimpe vite sur autoroute.",
          "La température : le froid augmente la consommation (chauffage, batterie moins efficace). Voir le guide sur l'hiver.",
          "Le type de trajet : la ville, avec ses phases de récupération d'énergie au freinage, est souvent plus favorable que l'autoroute.",
          "Le relief, la charge, le vent et les pneus, qui jouent à la marge mais s'additionnent.",
        ],
      },
      {
        heading: "Exemple chiffré",
        paragraphs: [
          `Estimations EVExpert pour trois modèles du catalogue, avec les facteurs décrits sur la page Méthodologie (les valeurs sont arrondies à 5 km) :`,
        ],
        table: {
          caption: "Autonomie estimée selon le scénario (estimation EVExpert)",
          headers: ["Modèle", "WLTP (source)", "Mixte, 15 °C", "Autoroute 130 km/h, 20 °C", "Mixte hivernal, 0 °C"],
          rows: [r5, my, ev3].map((v) => [
            `${v.brand} ${v.model} ${v.version}`,
            `${formatNumber(v.rangeWltp)} km`,
            `${km(v, "mixte")} km`,
            `${km(v, "autoroute")} km`,
            `${km(v, "hiver")} km`,
          ]),
        },
      },
      {
        heading: "Affiner avec votre propre consommation",
        paragraphs: [
          "La méthode la plus fiable reste de relever la consommation moyenne affichée par votre voiture sur des trajets comparables (même vitesse, même saison), puis d'appliquer la formule de base. Gardez une marge : arriver à 5-10 % de batterie est rarement souhaitable.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique", "/outils/cout-recharge-voiture-electrique"],
    relatedGuides: ["autonomie-hiver", "autonomie-autoroute", "wltp-definition", "batterie-brute-batterie-utile"],
    relatedVehicleIds: [r5.id, my.id, ev3.id],
    faq: [
      { question: "Quelle marge de sécurité prévoir ?", answer: "Une marge de 10 à 20 % de la batterie est prudente sur un long trajet, surtout en hiver ou sur autoroute, le temps de trouver une borne disponible." },
      { question: "L'autonomie affichée au tableau de bord est-elle fiable ?", answer: "Elle s'appuie sur votre conduite récente et s'adapte, mais elle peut varier fortement si le profil du trajet change (autoroute après de la ville, par exemple)." },
    ],
    sources: [SOURCES.wltp, SOURCES.evdb],
  },
  {
    slug: "autonomie-hiver",
    category: "autonomie",
    title: "Pourquoi l'autonomie d'une voiture électrique baisse-t-elle en hiver ?",
    description:
      "Chauffage, batterie froide, air plus dense : les causes de la baisse d'autonomie en hiver, comment la limiter, et une estimation chiffrée pour trois modèles.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "En hiver, une voiture électrique consomme davantage : l'autonomie diminue, parfois de manière sensible. Ce n'est ni un défaut ni une usure de la batterie, mais la conséquence de plusieurs effets physiques qu'on peut en partie maîtriser.",
    sections: [
      {
        heading: "Les causes principales",
        paragraphs: ["Plusieurs mécanismes se cumulent quand la température baisse :"],
        list: [
          "Le chauffage de l'habitacle : sans moteur thermique pour fournir de la chaleur gratuite, il faut la produire avec l'énergie de la batterie (résistance ou pompe à chaleur).",
          "La batterie elle-même : à basse température, ses réactions chimiques sont moins efficaces et sa résistance interne augmente ; le véhicule la réchauffe aussi pour la protéger.",
          "L'air plus dense, qui augmente légèrement la résistance aérodynamique.",
          "Les pneus, dont l'adhérence et la résistance au roulement évoluent avec le froid, et la route mouillée ou enneigée.",
        ],
      },
      {
        heading: "Quel ordre de grandeur ?",
        paragraphs: [
          "La baisse dépend du modèle, du chauffage (pompe à chaleur ou non), du trajet et de la vitesse. Sur de courts trajets, où l'on chauffe une habitacle froid à chaque départ, l'effet est le plus fort ; sur un long trajet stabilisé, il est plus modéré.",
          "Le modèle EVExpert applique un facteur de consommation de ×1,20 à 0 °C par rapport à la température douce : ce n'est pas une mesure mais un ordre de grandeur, à remplacer par votre propre consommation observée.",
        ],
        table: {
          caption: "Mixte à 15 °C contre mixte à 0 °C (estimation EVExpert)",
          headers: ["Modèle", "Mixte, 15 °C", "Mixte hivernal, 0 °C", "Différence"],
          rows: [r5, my, ev3].map((v) => {
            const a = Math.round(estimateRange(v, scen("mixte")) / 5) * 5;
            const b = Math.round(estimateRange(v, scen("hiver")) / 5) * 5;
            return [`${v.brand} ${v.model}`, `${formatNumber(a)} km`, `${formatNumber(b)} km`, `−${formatNumber(a - b)} km`];
          }),
        },
      },
      {
        heading: "Comment limiter la baisse",
        paragraphs: [],
        list: [
          "Préconditionner la voiture branchée : chauffer l'habitacle et la batterie avec l'énergie du réseau plutôt que celle de la batterie.",
          "Utiliser les sièges et le volant chauffants, moins gourmands que chauffer tout l'habitacle.",
          "Adapter la vitesse : rouler un peu moins vite compense une partie de l'effet du froid.",
          "Vérifier la pression des pneus, qui baisse avec la température.",
          "Recharger tant que la batterie est encore chaude après un trajet : la recharge rapide est plus efficace batterie chaude.",
        ],
      },
      {
        heading: "Ce que cela change pour la recharge",
        paragraphs: [
          "Batterie froide, la puissance de charge rapide est réduite tant qu'elle n'est pas montée en température. Beaucoup de modèles peuvent préchauffer la batterie quand on navigue vers une borne rapide : à activer avant un arrêt en hiver.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique", "/outils/temps-recharge"],
    relatedGuides: ["calculer-autonomie-reelle", "autonomie-autoroute", "preserver-batterie-voiture-electrique"],
    relatedVehicleIds: [r5.id, my.id, ev3.id],
    faq: [
      { question: "La pompe à chaleur change-t-elle beaucoup de choses ?", answer: "Elle produit de la chaleur avec moins d'énergie qu'une simple résistance, ce qui limite la perte d'autonomie hivernale, surtout en usage urbain. L'équipement varie selon les modèles et les versions : vérifiez-le sur la fiche constructeur." },
      { question: "La batterie perd-elle définitivement de la capacité en hiver ?", answer: "Non : la baisse d'autonomie liée au froid est temporaire. Elle disparaît avec le retour à des températures douces." },
    ],
    sources: [SOURCES.evdb, SOURCES.avere],
  },
  {
    slug: "autonomie-autoroute",
    category: "autonomie",
    title: "Quelle autonomie sur autoroute avec une voiture électrique ?",
    description:
      "Pourquoi l'autonomie chute à 130 km/h, comment le calculer et quelle stratégie de recharge adopter sur un long trajet. Estimations chiffrées pour trois modèles.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "L'autoroute est le terrain le moins favorable à une voiture électrique : vitesse constante et élevée, aucune récupération d'énergie. L'autonomie réelle y est nettement inférieure à l'autonomie WLTP, et il vaut mieux le planifier que le découvrir en route.",
    sections: [
      {
        heading: "La physique en bref",
        paragraphs: [
          "La force de résistance de l'air croît avec le carré de la vitesse. Passer de 110 à 130 km/h multiplie donc par (130 ÷ 110)² ≈ 1,40 l'énergie dépensée par kilomètre pour vaincre l'air, alors que la résistance au roulement ne change presque pas.",
          "Comme l'aérodynamique représente l'essentiel de la consommation à vitesse d'autoroute, la consommation totale augmente de manière marquée : c'est pourquoi quelques km/h de moins ont un effet visible sur l'autonomie.",
        ],
      },
      {
        heading: "Estimation pour trois modèles",
        paragraphs: [
          "Estimations EVExpert à 130 km/h par 20 °C, puis par 0 °C, comparées à l'autonomie WLTP publiée par la source :",
        ],
        table: {
          caption: "Autonomie sur autoroute (estimation EVExpert, valeurs arrondies à 5 km)",
          headers: ["Modèle", "WLTP (source)", "130 km/h, 20 °C", "130 km/h, 0 °C"],
          rows: [r5, my, ev3].map((v) => [
            `${v.brand} ${v.model} ${v.version}`,
            `${formatNumber(v.rangeWltp)} km`,
            `${km(v, "autoroute")} km`,
            `${km(v, "hiver-autoroute")} km`,
          ]),
        },
      },
      {
        heading: "Planifier un long trajet",
        paragraphs: [],
        list: [
          "Comptez sur l'autonomie autoroutière estimée, pas sur le WLTP, et gardez une marge à l'arrivée.",
          "Privilégiez des arrêts plus fréquents mais plus courts : la recharge est la plus rapide entre 10 et 80 %.",
          "Repérez les aires équipées à l'avance et prévoyez une solution de repli.",
          "Réduire de 10 à 20 km/h améliore sensiblement la consommation pour un gain de temps souvent modeste.",
        ],
      },
      {
        heading: "Combien de temps s'arrêter ?",
        paragraphs: [
          "Le temps d'arrêt dépend de la puissance DC acceptée par la voiture et de la borne. La fiche de chaque modèle du catalogue indique le temps de charge de 10 à 80 % publié par la source : c'est un bon repère pour comparer, sans le prendre pour une garantie.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique", "/outils/temps-recharge", "/outils/puissance-borne-recharge"],
    relatedGuides: ["calculer-autonomie-reelle", "autonomie-hiver", "puissance-recharge-dc"],
    relatedVehicleIds: [r5.id, my.id, ev3.id],
    faq: [
      { question: "Faut-il rouler à 110 km/h plutôt qu'à 130 km/h ?", answer: "Cela réduit nettement la consommation ; le gain de temps à 130 km/h est en revanche limité sur un trajet moyen. Le compromis dépend de votre priorité." },
      { question: "L'autonomie annoncée est-elle valable sur autoroute ?", answer: "Non : le cycle WLTP est un mélange de conditions urbaines, routières et autoroutières avec une vitesse moyenne modérée." },
    ],
    sources: [SOURCES.wltp, SOURCES.evdb],
  },
  {
    slug: "wltp-definition",
    category: "autonomie",
    title: "WLTP : qu'est-ce que c'est et que mesure-t-il vraiment ?",
    description:
      "Le WLTP est la procédure d'homologation utilisée pour annoncer l'autonomie et la consommation des voitures neuves. Ce qu'il mesure, ses limites, et comment l'interpréter.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 5,
    intro:
      "Quand un constructeur annonce « 500 km d'autonomie », il cite presque toujours un résultat WLTP. Comprendre ce que recouvre ce sigle évite bien des déceptions et permet de comparer des modèles entre eux de façon équitable.",
    sections: [
      {
        heading: "Une procédure d'essai harmonisée",
        paragraphs: [
          "WLTP signifie Worldwide Harmonised Light Vehicle Test Procedure : une procédure d'essai commune pour mesurer consommation et émissions des véhicules légers. En Europe, elle a remplacé l'ancien cycle NEDC pour les véhicules neufs à partir de 2017-2018.",
          "Elle vise à rendre les chiffres plus proches de la réalité que ceux du NEDC, tout en restant une mesure normalisée : c'est ce qui permet de comparer deux voitures.",
        ],
      },
      {
        heading: "Le cycle WLTC en chiffres",
        paragraphs: [
          "Le cycle utilisé (WLTC, pour les voitures de classe 3) dure environ 30 minutes pour 23,25 km, à une vitesse moyenne d'environ 46,5 km/h et une pointe à 131,3 km/h. Il enchaîne quatre phases de vitesse croissante : basse, moyenne, haute et très haute.",
        ],
        table: {
          headers: ["Critère", "NEDC (ancien)", "WLTC classe 3"],
          rows: [
            ["Durée", "≈ 20 min", "≈ 30 min"],
            ["Distance", "≈ 11 km", "≈ 23,25 km"],
            ["Vitesse moyenne", "≈ 34 km/h", "≈ 46,5 km/h"],
            ["Vitesse maximale", "120 km/h", "131,3 km/h"],
          ],
        },
      },
      {
        heading: "Pourquoi l'autonomie réelle diffère",
        paragraphs: [
          "Le WLTP est mesuré en laboratoire, à une température ambiante contrôlée, sans dénivelé ni vent, avec un cycle de conduite qui reste modéré. Une utilisation à 130 km/h, par temps froid ou avec du relief consomme davantage.",
          "Le WLTP reste néanmoins utile : à conditions d'essai identiques, une voiture affichant une plus grande autonomie WLTP est généralement plus efficace ou mieux dotée en énergie. C'est un outil de comparaison, pas une promesse d'usage.",
        ],
      },
      {
        heading: "Autonomie WLTP et consommation WLTP",
        paragraphs: [
          "La consommation WLTP publiée est souvent mesurée à la prise (pertes de charge incluses), alors que l'autonomie dépend de l'énergie de la batterie. C'est une source fréquente de confusion : c'est pourquoi EVExpert distingue la consommation « côté batterie » (capacité utile ÷ autonomie) de la consommation « au compteur ».",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique", "/outils/cout-100-km"],
    relatedGuides: ["calculer-autonomie-reelle", "autonomie-autoroute", "autonomie-hiver"],
    relatedVehicleIds: ["tesla-model-3-long-range-rwd", "mercedes-benz-cla-250", "peugeot-e-3008-97-kwh-long-range"],
    faq: [
      { question: "Le WLTP est-il obligatoire ?", answer: "Il s'applique à l'homologation des véhicules légers neufs dans l'Union européenne : c'est pourquoi les autonomies affichées par les constructeurs sont comparables." },
      { question: "Existe-t-il plusieurs valeurs WLTP pour un même modèle ?", answer: "Oui : selon la version, les jantes et les options, l'autonomie WLTP change ; certaines sources publient aussi une valeur « ville » ou une autre méthode de calcul. Vérifiez la version exacte." },
    ],
    sources: [SOURCES.wltp, SOURCES.wltc],
  },
  {
    slug: "batterie-brute-batterie-utile",
    category: "batterie",
    title: "Batterie brute et batterie utile : quelle différence ?",
    description:
      "Capacité brute, capacité utile, réserve : pourquoi les deux chiffres diffèrent, lequel utiliser pour calculer autonomie et coût de recharge, avec des écarts réels observés.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 5,
    intro:
      "Une même voiture peut être annoncée avec deux capacités de batterie. Ces deux nombres ne se contredisent pas : ils ne mesurent pas la même chose, et pour la plupart des calculs, un seul des deux vous intéresse.",
    sections: [
      {
        heading: "Deux capacités, deux définitions",
        paragraphs: [
          "La capacité brute est l'énergie totale que peuvent stocker les cellules de la batterie. La capacité utile (ou nette) est la part que le constructeur laisse effectivement accessible au conducteur.",
          "L'écart correspond à des réserves de protection : le véhicule ne descend jamais à 0 % ni ne monte à 100 % « réels » pour préserver la durée de vie de la batterie.",
        ],
      },
      {
        heading: "Ce que montrent les modèles du catalogue",
        paragraphs: [
          "L'écart n'est pas identique d'un constructeur à l'autre. Voici quelques exemples relevés dans la source du catalogue (écart calculé par EVExpert) :",
        ],
        table: {
          caption: "Capacité brute et capacité utile, quelques modèles",
          headers: ["Modèle", "Brute", "Utile", "Écart"],
          rows: [
            "renault-twingo-e-tech-27-5-kwh",
            "renault-5-e-tech-52-kwh-150-ch",
            "tesla-model-3-long-range-rwd",
            "cupra-born-170-kw-79-kwh",
            "bmw-ix1-edrive20",
            "ford-puma-gen-e-gen-e",
          ].map((id) => {
            const v = veh(id);
            const gross = v.batteryGross!;
            const pct = ((gross - v.batteryUsable) / gross) * 100;
            return [`${v.brand} ${v.model} ${v.version}`, `${formatNumber(gross, 1)} kWh`, `${formatNumber(v.batteryUsable, 1)} kWh`, `${formatNumber(pct, 1)} %`];
          }),
        },
      },
      {
        heading: "Laquelle utiliser ?",
        paragraphs: [],
        list: [
          "Pour l'autonomie, le coût d'une recharge ou le temps de charge : la capacité utile, car c'est l'énergie réellement échangée avec le conducteur.",
          "Pour comparer des technologies de cellules ou des packs : la capacité brute peut servir, mais elle dit peu de l'usage.",
          "Quand une source n'indique qu'une seule capacité, vérifiez laquelle : l'erreur fausse directement l'autonomie ou le coût calculés.",
        ],
      },
      {
        heading: "Un point de vigilance",
        paragraphs: [
          "Certains constructeurs publient une capacité « nette » qui n'est pas toujours mesurée de la même façon, et la marge de protection peut être ajustée par mise à jour logicielle. Les valeurs issues d'une base tierce comme celle du catalogue sont donc à confirmer auprès du constructeur pour une décision d'achat.",
        ],
      },
    ],
    relatedTools: ["/outils/cout-recharge-voiture-electrique", "/outils/autonomie-voiture-electrique"],
    relatedGuides: ["calculer-autonomie-reelle", "preserver-batterie-voiture-electrique", "recharger-a-80-pourcent"],
    relatedVehicleIds: ["renault-5-e-tech-52-kwh-150-ch", "tesla-model-3-long-range-rwd", "cupra-born-170-kw-79-kwh"],
    faq: [
      { question: "Pourquoi ne pas tout simplement utiliser 100 % de la batterie brute ?", answer: "Parce que solliciter une batterie de 0 à 100 % réels accélérerait son vieillissement. La réserve protège les cellules." },
      { question: "La capacité utile change-t-elle avec l'âge ?", answer: "La capacité réellement disponible diminue lentement avec l'usage et le temps, comme pour toute batterie lithium-ion. C'est l'objet de la garantie batterie." },
    ],
    sources: [SOURCES.evdb],
  },
];
