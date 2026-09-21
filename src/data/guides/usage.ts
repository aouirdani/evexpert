import type { Guide } from "@/types";
import { ASSUMPTIONS } from "@/data/assumptions";
import { SOURCES } from "@/data/sources";
import { getAllVehicles } from "@/data/vehicles";
import { chargeCost, costPer100km } from "@/lib/vehicle-calcs";
import { annualCost, costPer100km as costPer100 } from "@/lib/calculators";
import { formatEuro, formatNumber } from "@/lib/utils";
import { GUIDE_DATE, veh } from "./helpers";

const r5 = veh("renault-5-e-tech-52-kwh-150-ch");
const my = veh("tesla-model-y-rwd");
const ev3 = veh("kia-ev3-long-range");
const twingo = veh("renault-twingo-e-tech-27-5-kwh");
const elroq = veh("skoda-elroq-85");
const A = ASSUMPTIONS;

export const usageGuides: Guide[] = [
  {
    slug: "preserver-batterie-voiture-electrique",
    category: "batterie",
    title: "Comment préserver la batterie d'une voiture électrique ?",
    description:
      "Les bons réflexes pour ralentir le vieillissement de la batterie : niveaux de charge, chaleur, recharge rapide, stockage, en tenant compte de la chimie de la batterie.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "Une batterie lithium-ion vieillit : c'est inévitable. On peut en revanche ralentir cette usure par quelques habitudes simples, sans contrainte excessive. L'essentiel tient en trois idées : éviter les extrêmes, éviter la chaleur, ne pas abuser de la recharge rapide.",
    sections: [
      {
        heading: "Ce qui use une batterie",
        paragraphs: [
          "Deux phénomènes se combinent : le vieillissement lié au temps (calendaire) et celui lié aux cycles de charge et de décharge. Les températures élevées, les états de charge extrêmes maintenus longtemps et les fortes puissances de charge accélèrent l'usure.",
        ],
      },
      {
        heading: "Les bons réflexes",
        paragraphs: [],
        list: [
          "Éviter de laisser la voiture longtemps à un niveau de charge très élevé ou très bas.",
          "Pour une batterie NMC, viser un niveau modéré au quotidien, et charger plus haut seulement quand l'autonomie est nécessaire.",
          "Pour une batterie LFP, suivre la recommandation du constructeur, qui autorise souvent des charges à 100 %.",
          "Se garer à l'ombre ou au frais par forte chaleur ; laisser la gestion thermique du véhicule fonctionner branchée.",
          "Réserver la recharge rapide aux trajets longs, plutôt que d'en faire son mode de charge habituel.",
        ],
      },
      {
        heading: "La recharge rapide est-elle un problème ?",
        paragraphs: [
          "Elle est prévue et validée par les constructeurs. Répétée très fréquemment, elle sollicite davantage les cellules et peut contribuer à une usure un peu plus rapide qu'une recharge lente. À l'inverse, un usage occasionnel n'est pas un motif d'inquiétude.",
        ],
      },
      {
        heading: "Que dit la garantie ?",
        paragraphs: [
          "Les garanties batterie sont souvent de 8 ans, parfois avec une limite de kilométrage, et portent sur un niveau de capacité restante défini par le constructeur. Les valeurs des fiches du catalogue viennent d'une source tierce : vérifiez les conditions exactes dans le carnet du véhicule.",
        ],
      },
      {
        heading: "Suivre l'état de sa batterie",
        paragraphs: [
          "Certains véhicules affichent un indicateur de santé (« state of health »). En occasion, demandez un rapport de santé de batterie avant l'achat : c'est un élément de valeur important.",
        ],
      },
    ],
    relatedTools: ["/outils/cout-recharge-voiture-electrique"],
    relatedGuides: ["recharger-a-80-pourcent", "batterie-brute-batterie-utile", "autonomie-hiver"],
    relatedVehicleIds: [r5.id, twingo.id, "tesla-model-3-rwd"],
    faq: [
      { question: "Combien de temps dure une batterie de voiture électrique ?", answer: "Elle perd lentement de la capacité avec le temps. Les garanties constructeur, souvent de 8 ans, donnent un repère minimum mais pas une durée de vie maximale." },
      { question: "La chaleur est-elle plus problématique que le froid ?", answer: "La chaleur soutenue accélère l'usure de la batterie, alors que le froid réduit surtout l'autonomie de manière temporaire." },
    ],
    sources: [SOURCES.avere, SOURCES.evdb],
  },
  {
    slug: "recharge-domicile-ou-borne-publique",
    category: "recharge",
    title: "Voiture électrique : recharge à domicile ou borne publique ?",
    description:
      "Domicile, travail, voirie ou rapide : comparaison des modes de recharge selon le coût, la commodité et le logement, avec des coûts calculés.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "La meilleure solution dépend d'abord de votre logement et de vos habitudes : quand on peut brancher sa voiture chez soi, la recharge à domicile est en général la plus économique et la plus pratique. Sans accès à une prise, les bornes publiques doivent faire partie du calcul.",
    sections: [
      {
        heading: "Trois grands cas de figure",
        paragraphs: [],
        list: [
          "Maison individuelle avec place de stationnement : recharge à domicile, la solution la plus simple.",
          "Immeuble avec parking : possible avec une installation en copropriété, qui suit une procédure spécifique (droit à la prise) ; renseignez-vous auprès du syndic et sur Service-public.fr.",
          "Stationnement dans la rue : recharge sur borne publique, au travail ou lors des courses, ce qui change la budgétisation.",
        ],
      },
      {
        heading: "Comparaison des coûts",
        paragraphs: [
          `Coût d'une recharge de 10 à 80 % pour trois modèles, avec les hypothèses EVExpert de ${formatNumber(A.homePrice, 2)} €/kWh à domicile, ${formatNumber(A.publicAcPrice, 2)} € sur borne AC publique et ${formatNumber(A.fastDcPrice, 2)} € en recharge rapide. Ces prix sont des hypothèses : relevez ceux de vos bornes habituelles.`,
        ],
        table: {
          headers: ["Modèle", "Domicile", "Borne AC publique", "Recharge rapide DC"],
          rows: [twingo, r5, my].map((v) => [
            `${v.brand} ${v.model}`,
            formatEuro(chargeCost(v, A.homePrice).cost, 2),
            formatEuro(chargeCost(v, A.publicAcPrice).cost, 2),
            formatEuro(chargeCost(v, A.fastDcPrice).cost, 2),
          ]),
        },
      },
      {
        heading: "Au-delà du prix",
        paragraphs: [],
        list: [
          "Commodité : à domicile, la voiture est pleine chaque matin sans détour.",
          "Vitesse : les bornes rapides sont plus rapides mais plus chères.",
          "Prévisibilité : un tarif domicile est stable, les prix publics varient selon opérateur, abonnement et horaire.",
          "Disponibilité : une borne publique peut être occupée ou hors service.",
        ],
      },
      {
        heading: "Combiner plusieurs modes",
        paragraphs: [
          "Beaucoup de conducteurs rechargent à domicile la plupart du temps et utilisent une borne rapide pour les longs trajets. Le calculateur de coût par 100 km et le calculateur TCO permettent de pondérer la part de recharge publique.",
        ],
      },
    ],
    relatedTools: ["/outils/cout-recharge-voiture-electrique", "/outils/tco-voiture-electrique"],
    relatedGuides: ["combien-coute-recharge-domicile", "cout-borne-recharge-domicile", "recharge-ac-ou-dc"],
    relatedVehicleIds: [twingo.id, r5.id, my.id],
    faq: [
      { question: "Peut-on vivre avec une voiture électrique sans recharge à domicile ?", answer: "Oui, à condition d'avoir un accès régulier à une borne (travail, quartier). Le coût est alors plus élevé et l'organisation plus contraignante." },
      { question: "Où trouver les bornes proches de chez soi ?", answer: "Dans les applications des opérateurs, ou dans les données ouvertes de la base nationale des IRVE sur data.gouv.fr." },
    ],
    sources: [SOURCES.servicePublic, SOURCES.irve, SOURCES.evdb],
  },
  {
    slug: "cout-borne-recharge-domicile",
    category: "coûts",
    title: "Combien coûte une borne de recharge à domicile ?",
    description:
      "Ce qui compose le prix d'une borne à domicile, les éléments qui font varier le devis, les aides à vérifier et les questions à poser à l'installateur.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "Le prix d'une borne de recharge à domicile ne se résume pas à celui de l'appareil. Il dépend surtout de l'installation : distance au tableau électrique, protections à ajouter, type de raccordement. Aucun chiffre unique n'est fiable : voici comment lire un devis.",
    sections: [
      {
        heading: "Les postes d'un devis",
        paragraphs: [],
        list: [
          "La borne (ou wallbox) : son prix varie selon la puissance, la connectivité et les options (délestage, pilotage, comptage).",
          "La pose : main-d'œuvre, câblage entre le tableau et l'emplacement, percement, goulottes.",
          "Les protections électriques : disjoncteur dédié, différentiel adapté, parfois mise à niveau du tableau.",
          "Les éventuels travaux de raccordement ou d'augmentation de puissance souscrite.",
          "Les frais de mise en service et les attestations de conformité.",
        ],
      },
      {
        heading: "Ce qui fait varier le prix",
        paragraphs: [],
        list: [
          "La distance entre le tableau électrique et la place de stationnement.",
          "La puissance : monophasé 7,4 kW ou triphasé 11-22 kW.",
          "L'état de l'installation existante.",
          "Le contexte : maison individuelle, copropriété, parking collectif.",
        ],
      },
      {
        heading: "Faire un bon choix",
        paragraphs: [
          "Demandez plusieurs devis à des installateurs qualifiés. Vérifiez la puissance proposée par rapport à la limite AC de votre voiture (voir le guide sur 7,4, 11 et 22 kW) et à votre puissance souscrite. Le gestionnaire du réseau publie les informations sur le compteur et la puissance.",
        ],
      },
      {
        heading: "Aides et démarches",
        paragraphs: [
          "Des aides ou dispositifs peuvent exister pour l'installation d'une borne (par exemple le programme Advenir, financé par les certificats d'économie d'énergie), avec des conditions et des montants qui évoluent et souvent le recours à un installateur qualifié. EVExpert ne publie pas de montant : consultez les sources officielles à jour avant de signer un devis.",
          "En copropriété, le droit à la prise encadre la démarche : rapprochez-vous du syndic.",
        ],
      },
      {
        heading: "Ce qu'une borne fait économiser",
        paragraphs: [
          `Rechargée à domicile avec l'hypothèse de ${formatNumber(A.homePrice, 2)} €/kWh, la ${r5.brand} ${r5.model} ajoute environ 10 à 80 % pour ${formatEuro(chargeCost(r5, A.homePrice).cost, 2)}, contre ${formatEuro(chargeCost(r5, A.fastDcPrice).cost, 2)} au tarif de recharge rapide supposé. C'est ce type d'écart, multiplié par vos recharges annuelles, que vous comparez au coût de l'installation.`,
        ],
      },
    ],
    relatedTools: ["/outils/cout-recharge-voiture-electrique", "/outils/tco-voiture-electrique"],
    relatedGuides: ["puissance-borne-7-11-22-kw", "recharge-domicile-ou-borne-publique", "calculer-tco-voiture-electrique"],
    relatedVehicleIds: [r5.id, my.id, elroq.id],
    faq: [
      { question: "Pourquoi ne donnez-vous pas de prix ?", answer: "Parce que le coût dépend du chantier et du contexte, et que les aides évoluent. Un chiffre unique serait trompeur ; comparez plusieurs devis." },
      { question: "Faut-il un installateur qualifié ?", answer: "Pour la sécurité et pour bénéficier de certaines aides, oui : vérifiez ses qualifications avant de signer." },
    ],
    sources: [SOURCES.servicePublic, SOURCES.enedis, SOURCES.avere],
  },
  {
    slug: "cout-100-km-voiture-electrique",
    category: "coûts",
    title: "Combien coûte 100 km en voiture électrique ?",
    description:
      "Comment calculer le coût aux 100 km d'une voiture électrique, avec exemples chiffrés pour plusieurs modèles selon le tarif de recharge, et comparaison avec l'essence.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "Le coût aux 100 km d'une électrique est simple à calculer : il suffit de multiplier la consommation par le prix du kWh, en n'oubliant pas les pertes de charge. Il change beaucoup selon l'endroit où l'on recharge, plus encore que d'un modèle à l'autre.",
    sections: [
      {
        heading: "La formule",
        paragraphs: [
          "Coût aux 100 km = consommation au compteur (kWh/100 km) × prix du kWh. La consommation au compteur est la consommation côté batterie divisée par le rendement de charge. EVExpert calcule la consommation côté batterie comme capacité utile ÷ autonomie WLTP × 100.",
        ],
      },
      {
        heading: "Exemples selon le tarif",
        paragraphs: [
          `Conditions WLTP, rendement ${A.chargingEfficiency} %, tarifs d'hypothèse : ${formatNumber(A.homePrice, 2)} €/kWh (domicile), ${formatNumber(A.publicAcPrice, 2)} € (AC public), ${formatNumber(A.fastDcPrice, 2)} € (rapide).`,
        ],
        table: {
          caption: "Coût aux 100 km (calcul EVExpert)",
          headers: ["Modèle", "Domicile", "Borne AC publique", "Recharge rapide"],
          rows: [twingo, r5, my, ev3, elroq].map((v) => [
            `${v.brand} ${v.model}`,
            formatEuro(costPer100km(v, A.homePrice), 2),
            formatEuro(costPer100km(v, A.publicAcPrice), 2),
            formatEuro(costPer100km(v, A.fastDcPrice), 2),
          ]),
        },
      },
      {
        heading: "Comparaison avec l'essence",
        paragraphs: [
          `À titre d'illustration, une essence à 6,5 L/100 km avec un litre à ${formatNumber(A.petrolPrice, 2)} € coûte ${formatEuro(costPer100({ consumption: 6.5, price: A.petrolPrice }), 2)} aux 100 km, soit ${formatEuro(annualCost(costPer100({ consumption: 6.5, price: A.petrolPrice }), A.annualKm), 0)} d'énergie pour ${formatNumber(A.annualKm)} km par an. Ces prix sont des hypothèses : remplacez-les par les vôtres.`,
          "Attention : cette comparaison ne porte que sur l'énergie. Achat, entretien, assurance et dépréciation sont traités dans le guide sur le coût réel et dans le calculateur TCO.",
        ],
      },
      {
        heading: "Pourquoi votre coût réel diffère",
        paragraphs: [],
        list: [
          "Votre consommation réelle est différente du WLTP (vitesse, froid, relief).",
          "Votre tarif du kWh dépend de votre contrat et de vos habitudes de recharge.",
          "Le mix domicile / public / rapide change fortement la moyenne.",
        ],
      },
    ],
    relatedTools: ["/outils/cout-100-km", "/outils/essence-vs-electrique", "/outils/tco-voiture-electrique"],
    relatedGuides: ["voiture-electrique-vs-essence", "combien-coute-recharge-domicile", "calculer-tco-voiture-electrique"],
    relatedVehicleIds: [twingo.id, r5.id, my.id],
    faq: [
      { question: "Comment obtenir mon coût aux 100 km réel ?", answer: "Divisez ce que vous avez payé pour l'énergie sur une période par les kilomètres parcourus, puis multipliez par 100." },
      { question: "L'électrique est-elle toujours moins chère à l'énergie ?", answer: "À domicile, en général oui. Sur une recharge rapide publique chère, l'écart avec un thermique sobre peut être plus faible." },
    ],
    sources: [SOURCES.evdb, SOURCES.cre],
  },
  {
    slug: "voiture-electrique-vs-essence",
    category: "coûts",
    title: "Voiture électrique vs essence : quel est le coût réel ?",
    description:
      "Comparer une électrique et une essence sur l'énergie, l'entretien, l'assurance et la dépréciation : la méthode, un exemple chiffré et les hypothèses à ajuster.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 7,
    intro:
      "Comparer deux voitures uniquement sur le prix d'achat ou sur le plein est trompeur. Le coût réel additionne l'énergie, l'entretien, l'assurance, la dépréciation et, selon les cas, quelques taxes. La méthode compte plus que le résultat d'un exemple : voici comment la construire.",
    sections: [
      {
        heading: "Les postes à comparer",
        paragraphs: [],
        list: [
          "Énergie : électricité contre carburant, selon votre consommation et vos prix.",
          "Dépréciation : différence entre prix d'achat et valeur de revente.",
          "Entretien : en général moindre sur une électrique (moins de pièces d'usure moteur), mais pas nul (pneus, freins, suspension).",
          "Assurance et taxes : à demander sous forme de devis, elles varient selon les profils.",
          "Aides éventuelles à l'achat et coût d'une borne à domicile.",
        ],
      },
      {
        heading: "Un exemple illustratif",
        paragraphs: [
          `Voici un exemple avec des chiffres d'illustration — un prix d'achat de 40 000 € pour l'électrique et de 30 000 € pour l'essence, ${formatNumber(15000)} km par an, énergie aux hypothèses EVExpert. Ces chiffres ne décrivent aucun modèle précis ; ils servent à montrer la méthode. Utilisez le comparateur pour saisir les vôtres.`,
        ],
        table: {
          caption: "Coût annuel d'illustration (calcul EVExpert)",
          headers: ["Poste", "Électrique", "Essence"],
          rows: [
            ["Énergie", formatEuro((16 * A.homePrice * 15000) / 100, 0), formatEuro((6.5 * A.petrolPrice * 15000) / 100, 0)],
            ["Assurance (hypothèse)", formatEuro(700, 0), formatEuro(650, 0)],
            ["Entretien (hypothèse)", formatEuro(250, 0), formatEuro(600, 0)],
            ["Dépréciation (12 % / 14 %)", formatEuro(40000 * 0.12, 0), formatEuro(30000 * 0.14, 0)],
            [
              "Total annuel",
              formatEuro((16 * A.homePrice * 15000) / 100 + 700 + 250 + 40000 * 0.12, 0),
              formatEuro((6.5 * A.petrolPrice * 15000) / 100 + 650 + 600 + 30000 * 0.14, 0),
            ],
          ],
        },
      },
      {
        heading: "Lire le résultat avec prudence",
        paragraphs: [
          "Dans cet exemple, l'énergie et l'entretien favorisent l'électrique, la dépréciation supposée plus élevée d'une voiture plus chère compense en partie. Un simple changement d'hypothèse (prix de revente, kilométrage, prix de l'énergie) peut inverser l'ordre : c'est pourquoi il faut tester plusieurs scénarios.",
        ],
      },
      {
        heading: "Trois questions avant de conclure",
        paragraphs: [],
        list: [
          "Puis-je recharger à domicile ? Cela change le coût moyen du kWh.",
          "Quelle durée de détention est réaliste ? La dépréciation pèse d'autant plus que la durée est courte.",
          "Quel kilométrage annuel ? Plus il est élevé, plus l'économie d'énergie compte.",
        ],
      },
    ],
    relatedTools: ["/outils/essence-vs-electrique", "/outils/tco-voiture-electrique", "/outils/cout-100-km"],
    relatedGuides: ["calculer-tco-voiture-electrique", "cout-100-km-voiture-electrique", "recharge-domicile-ou-borne-publique"],
    relatedVehicleIds: [r5.id, "peugeot-e-208-50-kwh", "citroen-e-c3-standard-range-44-kwh"],
    faq: [
      { question: "L'électrique est-elle toujours moins chère à l'usage ?", answer: "Pas toujours : cela dépend du prix d'achat, des tarifs de recharge, du kilométrage et de la revente. Le calcul sur votre cas est la seule réponse fiable." },
      { question: "Les aides à l'achat sont-elles incluses ?", answer: "Non : elles évoluent et dépendent de votre situation. Saisissez-les manuellement dans le calculateur si vous y avez droit après vérification." },
    ],
    sources: [SOURCES.cre, SOURCES.servicePublic, SOURCES.evdb],
  },
  {
    slug: "calculer-tco-voiture-electrique",
    category: "coûts",
    title: "Comment calculer le TCO d'une voiture électrique ?",
    description:
      "Le coût total de possession expliqué : postes à inclure, formule, exemple chiffré sur 5 ans et erreurs fréquentes à éviter.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "Le coût total de possession, ou TCO, est ce qu'une voiture vous coûte sur toute la période où vous la gardez, ramené par mois ou par kilomètre. C'est l'outil le plus fiable pour comparer des véhicules dont les prix d'achat et les coûts d'usage diffèrent.",
    sections: [
      {
        heading: "La formule",
        paragraphs: [
          "TCO = (prix d'achat − aides − valeur de revente) + énergie + assurance + entretien + pneus + taxes, le tout sur la durée de détention. On le divise ensuite par le nombre de mois ou de kilomètres pour obtenir un coût comparable.",
        ],
      },
      {
        heading: "Exemple sur 5 ans",
        paragraphs: [
          "Exemple illustratif, sans lien avec un modèle précis : véhicule à 40 000 €, revendu 18 000 € après 5 ans, 15 000 km par an, 16 kWh/100 km, 20 % de recharge publique.",
        ],
        table: {
          headers: ["Poste", "Montant (5 ans)"],
          rows: (() => {
            const totalKm = 15000 * 5;
            const kwh = (16 * totalKm) / 100;
            const energy = kwh * 0.8 * A.homePrice + kwh * 0.2 * A.publicAcPrice;
            const dep = 40000 - 18000;
            const other = (700 + 250 + 150) * 5;
            return [
              ["Dépréciation (40 000 − 18 000)", formatEuro(dep, 0)],
              ["Énergie (80 % domicile, 20 % public)", formatEuro(energy, 0)],
              ["Assurance, entretien, pneus (hypothèses)", formatEuro(other, 0)],
              ["Total TCO", formatEuro(dep + energy + other, 0)],
              ["Par mois", formatEuro((dep + energy + other) / 60, 0)],
            ];
          })(),
        },
      },
      {
        heading: "Les erreurs à éviter",
        paragraphs: [],
        list: [
          "Oublier la valeur de revente : elle est souvent le premier poste du TCO.",
          "Ignorer le coût d'une borne à domicile quand on compare avec une thermique.",
          "Utiliser un prix moyen du kWh sans tenir compte de la part de recharge publique.",
          "Compter des aides auxquelles on n'a pas droit, ou périmées.",
          "Comparer sur une durée trop courte, qui exagère le poids de la dépréciation.",
        ],
      },
      {
        heading: "Faire varier les hypothèses",
        paragraphs: [
          "Les résultats sont les plus sensibles à la valeur de revente, au kilométrage et au prix de l'énergie. Faites varier ces trois paramètres pour voir si votre conclusion tient : si oui, elle est robuste.",
        ],
      },
    ],
    relatedTools: ["/outils/tco-voiture-electrique", "/outils/essence-vs-electrique"],
    relatedGuides: ["voiture-electrique-vs-essence", "cout-100-km-voiture-electrique", "cout-borne-recharge-domicile"],
    relatedVehicleIds: [my.id, elroq.id, r5.id],
    faq: [
      { question: "Sur quelle durée calculer le TCO ?", answer: "Sur la durée pendant laquelle vous comptez garder la voiture, souvent 4 à 8 ans." },
      { question: "Comment estimer la valeur de revente ?", answer: "C'est une hypothèse : consultez les annonces de modèles comparables de plusieurs années d'âge et testez plusieurs valeurs." },
    ],
    sources: [SOURCES.cre, SOURCES.servicePublic],
  },
  {
    slug: "choisir-voiture-electrique-selon-usage",
    category: "achat",
    title: "Quelle voiture électrique choisir selon son usage ?",
    description:
      "Ville, famille, longs trajets : quels critères de la fiche technique regarder selon votre usage, avec des exemples de modèles du catalogue filtrés par critères objectifs.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 7,
    intro:
      "Il n'y a pas de « meilleure » voiture électrique dans l'absolu : il y a celle qui colle à votre usage. Ce guide propose de partir de vos trajets pour choisir les critères qui comptent, puis montre des modèles du catalogue qui répondent à ces critères. Ce ne sont pas des recommandations, seulement des filtres objectifs.",
    sections: [
      {
        heading: "Ville et petits trajets",
        paragraphs: [
          "Pour un usage surtout urbain et périurbain, une batterie modeste suffit et une petite voiture est plus simple à garer. Regardez la consommation, la puissance de charge AC (pour recharger vite à domicile) et la taille.",
        ],
        table: {
          caption: "Modèles du catalogue avec une batterie utile de 50 kWh ou moins et moins de 4,2 m",
          headers: ["Modèle", "Batterie utile", "Autonomie WLTP", "Longueur", "Coffre"],
          rows: getAllVehicles()
            .filter((v) => v.batteryUsable <= 50 && v.dimensions.length < 4200)
            .sort((a, b) => a.dimensions.length - b.dimensions.length)
            .slice(0, 8)
            .map((v) => [
              `${v.brand} ${v.model} ${v.version}`,
              `${formatNumber(v.batteryUsable, 1)} kWh`,
              `${formatNumber(v.rangeWltp)} km`,
              `${formatNumber(v.dimensions.length)} mm`,
              v.trunkVolume ? `${formatNumber(v.trunkVolume)} L` : "Non disponible",
            ]),
        },
      },
      {
        heading: "Famille et coffre",
        paragraphs: [
          "Regardez le volume de coffre, le nombre de places et l'espace intérieur. Le coffre publié est parfois mesuré différemment selon les constructeurs : vérifiez en réel.",
        ],
        table: {
          caption: "Modèles du catalogue avec un coffre d'au moins 540 L",
          headers: ["Modèle", "Coffre", "Coffre banquette rabattue", "Autonomie WLTP"],
          rows: getAllVehicles()
            .filter((v) => (v.trunkVolume ?? 0) >= 540)
            .sort((a, b) => (b.trunkVolume ?? 0) - (a.trunkVolume ?? 0))
            .slice(0, 8)
            .map((v) => [
              `${v.brand} ${v.model} ${v.version}`,
              `${formatNumber(v.trunkVolume ?? 0)} L`,
              v.trunkVolumeMax ? `${formatNumber(v.trunkVolumeMax)} L` : "Non disponible",
              `${formatNumber(v.rangeWltp)} km`,
            ]),
        },
      },
      {
        heading: "Longs trajets réguliers",
        paragraphs: [
          "Sur route, deux critères comptent surtout : l'autonomie sur autoroute et le temps de charge rapide 10-80 %. Ne vous fiez pas au seul chiffre WLTP : consultez les guides sur l'autoroute et la recharge DC.",
        ],
        table: {
          caption: "Modèles du catalogue avec au moins 600 km WLTP et une charge 10-80 % en 32 min ou moins",
          headers: ["Modèle", "Autonomie WLTP", "DC max.", "10-80 %"],
          rows: getAllVehicles()
            .filter((v) => v.rangeWltp >= 600 && (v.chargingTime10to80 ?? 99) <= 32)
            .sort((a, b) => b.rangeWltp - a.rangeWltp)
            .slice(0, 8)
            .map((v) => [
              `${v.brand} ${v.model} ${v.version}`,
              `${formatNumber(v.rangeWltp)} km`,
              `${formatNumber(v.chargingDC ?? 0)} kW`,
              `${v.chargingTime10to80} min`,
            ]),
        },
      },
      {
        heading: "Le critère qui prime : la recharge à la maison",
        paragraphs: [
          "Quelle que soit la catégorie, votre accès à la recharge (domicile, travail) est le critère le plus décisif : avec une prise à la maison, une batterie moyenne est très confortable ; sans elle, l'autonomie et la recharge rapide comptent bien davantage.",
        ],
      },
    ],
    relatedTools: ["/outils/tco-voiture-electrique", "/outils/cout-100-km", "/outils/autonomie-voiture-electrique"],
    relatedGuides: ["choisir-premiere-voiture-electrique", "autonomie-autoroute", "recharge-domicile-ou-borne-publique"],
    relatedVehicleIds: [twingo.id, elroq.id, ev3.id],
    faq: [
      { question: "Quelle autonomie faut-il vraiment ?", answer: "Elle dépend de votre plus long trajet fréquent et de votre accès à la recharge. Comparez votre usage quotidien à l'autonomie estimée dans vos conditions, pas au WLTP." },
      { question: "Ces listes sont-elles un classement ?", answer: "Non : ce sont des sélections par critères objectifs, sans hiérarchie. Le bon modèle est celui qui répond à votre usage et à votre budget." },
    ],
    sources: [SOURCES.evdb, SOURCES.avere],
  },
  {
    slug: "choisir-premiere-voiture-electrique",
    category: "achat",
    title: "Comment choisir sa première voiture électrique ?",
    description:
      "Les questions à se poser avant d'acheter sa première électrique : recharge, budget total, autonomie, occasion ou neuve, et une check-list pour lire une fiche technique.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 7,
    intro:
      "Passer à l'électrique change surtout une chose : la façon de faire le « plein ». Plutôt que de partir des modèles, partez de votre situation : où recharger, combien rouler, quel budget global. Cette check-list vous y aide.",
    sections: [
      {
        heading: "1. Où allez-vous recharger ?",
        paragraphs: [
          "C'est la première question. À domicile, la recharge est simple et économique ; au travail, elle peut suffire ; sinon, il faut compter sur des bornes publiques. Le guide domicile ou borne publique détaille les cas.",
        ],
      },
      {
        heading: "2. Quels trajets ?",
        paragraphs: [
          "Listez vos trajets quotidiens et vos plus longs trajets réguliers. Comparez-les à l'autonomie estimée dans vos conditions (hiver, autoroute) plutôt qu'au WLTP, avec une marge de sécurité.",
        ],
      },
      {
        heading: "3. Quel budget total ?",
        paragraphs: [
          "Additionnez achat ou location, énergie, assurance, entretien et éventuelle borne à domicile. Le calculateur TCO permet de comparer plusieurs scénarios. Vérifiez les aides à jour sur les sites officiels : elles évoluent.",
        ],
      },
      {
        heading: "4. Comment lire une fiche technique ?",
        paragraphs: [],
        list: [
          "Capacité utile de la batterie plutôt que brute.",
          "Autonomie WLTP comme repère de comparaison, pas comme promesse.",
          "Puissance de charge AC (recharge à domicile) et DC (longs trajets), et temps 10-80 %.",
          "Garantie batterie : durée, kilométrage et seuil de capacité.",
          "Volume de coffre et dimensions par rapport à votre garage.",
        ],
      },
      {
        heading: "5. Neuve ou d'occasion ?",
        paragraphs: [
          "En occasion, demandez un rapport de santé de batterie et les conditions de transfert de la garantie. Vérifiez l'historique de recharge rapide si possible et le connecteur adapté à votre usage.",
        ],
      },
      {
        heading: "6. Essayer avant de choisir",
        paragraphs: [
          "Un essai sur vos trajets habituels apprend plus que n'importe quelle fiche : consommation réelle, confort, logiciel de navigation vers les bornes. Comparez ensuite deux ou trois modèles dans le comparateur.",
        ],
      },
    ],
    relatedTools: ["/outils/tco-voiture-electrique", "/outils/cout-100-km", "/outils/autonomie-voiture-electrique"],
    relatedGuides: ["choisir-voiture-electrique-selon-usage", "recharge-domicile-ou-borne-publique", "calculer-tco-voiture-electrique"],
    relatedVehicleIds: [r5.id, ev3.id, "peugeot-e-208-50-kwh"],
    faq: [
      { question: "Faut-il attendre que les batteries progressent ?", answer: "Il y aura toujours une génération suivante. Le bon moment est celui où un modèle actuel répond à votre besoin à un coût total acceptable." },
      { question: "L'autonomie est-elle le critère principal ?", answer: "Pas toujours : l'accès à la recharge, le coût total et la vitesse de charge comptent autant, voire plus, selon votre usage." },
    ],
    sources: [SOURCES.avere, SOURCES.servicePublic, SOURCES.evdb],
  },
];
