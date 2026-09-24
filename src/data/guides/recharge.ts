import type { Guide } from "@/types";
import { ASSUMPTIONS } from "@/data/assumptions";
import { SOURCES } from "@/data/sources";
import { acChargeMinutes, averageDcPower, chargeCost } from "@/lib/vehicle-calcs";
import { formatEuro, formatNumber, minutesToHuman } from "@/lib/format";
import type { GuideContext } from "./helpers";
import { GUIDE_DATE } from "./helpers";

export function buildRechargeGuides(ctx: GuideContext): Guide[] {
  const { veh } = ctx;
  const r5 = veh("renault-5-e-tech-52-kwh-150-ch");
  const my = veh("tesla-model-y-rwd");
  const ioniq5 = veh("hyundai-ioniq-5-84-kwh-rwd");
  const ev3 = veh("kia-ev3-long-range");
  const inster = veh("hyundai-inster-long-range");
  const bmw = veh("bmw-i4-edrive40");
  const twingo = veh("renault-twingo-e-tech-27-5-kwh");
  const home = ASSUMPTIONS.homePrice;

  return [
  {
    slug: "combien-coute-recharge-domicile",
    category: "coûts",
    title: "Combien coûte la recharge d'une voiture électrique à la maison ?",
    description:
      "Comment calculer le prix d'une recharge à la maison : énergie, rendement, tarif du kWh, heures creuses. Exemples chiffrés pour plusieurs modèles.",
    publishedAt: GUIDE_DATE,
    updatedAt: "2026-09-24",
    readingTime: 6,
    intro:
      "Recharger chez soi est en général la solution la moins chère. Son coût se calcule simplement, à condition de connaître le prix de votre kWh et de compter les pertes de charge : voici la méthode, avec des exemples.",
    sections: [
      {
        heading: "Le calcul en trois étapes",
        paragraphs: [],
        list: [
          "Énergie stockée = capacité utile × (état de charge visé − état de charge de départ).",
          "Énergie au compteur = énergie stockée ÷ rendement de charge (souvent proche de 90 % en AC).",
          "Coût = énergie au compteur × prix du kWh de votre contrat.",
        ],
      },
      {
        heading: "Quel prix du kWh utiliser ?",
        paragraphs: [
          "C'est celui de votre contrat : il figure sur votre facture, hors abonnement. Avec une option heures creuses, le kWh est moins cher pendant certaines plages horaires, ce qui favorise une recharge programmée la nuit.",
          `Dans les exemples de ce guide et les fiches du catalogue, EVExpert utilise une hypothèse de ${formatNumber(home, 2)} €/kWh, qu'il faut remplacer par votre tarif. Le fonctionnement du marché de l'électricité et des offres est présenté sur le site de la CRE.`,
        ],
      },
      {
        heading: "Exemples chiffrés",
        paragraphs: [
          `Coût d'une recharge de 10 à 80 % à ${formatNumber(home, 2)} €/kWh et ${ASSUMPTIONS.chargingEfficiency} % de rendement (calcul EVExpert) :`,
        ],
        table: {
          headers: ["Modèle", "Batterie utile", "Énergie au compteur", "Coût", "Autonomie ajoutée"],
          rows: [twingo, r5, my, bmw].map((v) => {
            const c = chargeCost(v, home, 10, 80);
            return [
              `${v.brand} ${v.model}`,
              `${formatNumber(v.batteryUsable, 1)} kWh`,
              `${formatNumber(c.gridEnergy, 1)} kWh`,
              formatEuro(c.cost, 2),
              `≈ ${formatNumber(Math.round(c.rangeAdded / 5) * 5)} km`,
            ];
          }),
        },
      },
      {
        heading: "Ce qui peut changer le résultat",
        paragraphs: [
          "Remplacez ces hypothèses par les vôtres dans le [simulateur de coût de recharge](/outils/cout-recharge-voiture-electrique), pour un résultat propre à votre tarif et à votre véhicule. Ce qui fait varier le résultat par rapport aux exemples ci-dessus :",
        ],
        list: [
          "Le rendement de charge : plus faible avec une petite puissance sur une batterie froide.",
          "La puissance souscrite : une recharge simultanée avec d'autres appareils peut imposer de limiter la puissance.",
          "Le contrat : tarif de base, heures creuses ou offre à prix de marché.",
          "L'état de la batterie et la température.",
        ],
      },
    ],
    relatedTools: ["/outils/cout-recharge-voiture-electrique", "/outils/cout-100-km"],
    relatedGuides: ["recharge-domicile-ou-borne-publique", "cout-100-km-voiture-electrique", "cout-borne-recharge-domicile"],
    relatedVehicleIds: [r5.id, my.id, twingo.id],
    faq: [
      { question: "Combien coûte un plein complet à la maison ?", answer: "Il faut multiplier la capacité utile par le prix du kWh, en ajoutant les pertes de charge (division par le rendement). Les exemples du guide donnent une fourchette par modèle." },
      { question: "Les heures creuses valent-elles le coup ?", answer: "Si votre offre propose un kWh moins cher la nuit et que vous rechargez surtout à ces heures, oui. Vérifiez aussi le prix de l'abonnement et du kWh en heures pleines." },
    ],
    sources: [SOURCES.cre, SOURCES.enedis, SOURCES.evdb],
  },
  {
    slug: "puissance-borne-7-11-22-kw",
    category: "recharge",
    title: "Quelle puissance de borne choisir : 7,4, 11 ou 22 kW ?",
    description:
      "Wallbox 7,4, 11 ou 22 kW : ce que change la puissance, les limites du véhicule et du réseau, et comment choisir selon votre voiture et votre usage.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "Choisir la puissance d'une borne à domicile ne consiste pas à prendre la plus élevée. La vitesse de charge est plafonnée par la voiture, par l'installation électrique et par votre besoin réel : souvent, une puissance modérée suffit.",
    sections: [
      {
        heading: "D'où viennent 3,7, 7,4, 11 et 22 kW ?",
        paragraphs: [
          "Ces valeurs correspondent à des intensités et des types de courant courants en courant alternatif : 16 A en monophasé (≈ 3,7 kW), 32 A en monophasé (≈ 7,4 kW), 16 A en triphasé (≈ 11 kW) et 32 A en triphasé (≈ 22 kW).",
        ],
        table: {
          headers: ["Puissance", "Courant", "Intensité"],
          rows: [
            ["3,7 kW", "Monophasé 230 V", "16 A"],
            ["7,4 kW", "Monophasé 230 V", "32 A"],
            ["11 kW", "Triphasé 400 V", "16 A par phase"],
            ["22 kW", "Triphasé 400 V", "32 A par phase"],
          ],
        },
      },
      {
        heading: "Le maillon le plus faible fixe la vitesse",
        paragraphs: [
          "La puissance utilisée est le minimum entre la puissance de la borne et la limite AC du chargeur embarqué de la voiture. Les limites varient selon les modèles :",
        ],
        table: {
          caption: "Puissance AC maximale acceptée (source du catalogue)",
          headers: ["Modèle", "AC maximale", "10 → 80 % sur une borne 22 kW"],
          rows: [twingo, r5, inster, veh("renault-scenic-e-tech-ev87-220-ch")].map((v) => {
            const t = acChargeMinutes(v, 22);
            return [`${v.brand} ${v.model}`, `${formatNumber(v.chargingAC, 1)} kW`, minutesToHuman(t.minutes)];
          }),
        },
      },
      {
        heading: "Ce que dit votre installation",
        paragraphs: [
          "Une borne 22 kW suppose un raccordement triphasé et une puissance souscrite suffisante : ce n'est pas le cas de tous les logements. Les informations sur le compteur, la puissance souscrite et le raccordement sont publiées par le gestionnaire du réseau. Un installateur qualifié doit dimensionner la ligne, la protection et le câble.",
        ],
      },
      {
        heading: "Comment décider",
        paragraphs: [],
        list: [
          "Regardez la limite AC de votre voiture : investir dans plus de puissance que ce qu'elle accepte est inutile.",
          "Estimez votre besoin : la voiture reste souvent branchée toute la nuit ; quelques kW suffisent pour recharger l'énergie d'un trajet quotidien.",
          "Vérifiez la puissance souscrite et le type de raccordement de votre logement.",
          "Anticipez un futur véhicule : une borne triphasée peut servir à plusieurs voitures, pas nécessairement au maximum.",
        ],
      },
    ],
    relatedTools: ["/outils/puissance-borne-recharge", "/outils/temps-recharge"],
    relatedGuides: ["recharge-ac-ou-dc", "cout-borne-recharge-domicile", "temps-recharge-voiture-electrique"],
    relatedVehicleIds: [r5.id, "renault-scenic-e-tech-ev87-220-ch", twingo.id],
    faq: [
      { question: "Une wallbox 22 kW est-elle dangereuse pour une voiture limitée à 7,4 kW ?", answer: "Non : c'est la voiture qui limite la puissance appelée. Mais vous paieriez une installation plus puissante sans en profiter." },
      { question: "Faut-il une wallbox ou une prise renforcée ?", answer: "Une prise renforcée suffit parfois pour un faible kilométrage, mais une wallbox offre plus de puissance et de sécurité pour un usage quotidien." },
    ],
    sources: [SOURCES.enedis, SOURCES.avere, SOURCES.evdb],
  },
  {
    slug: "recharge-ac-ou-dc",
    category: "recharge",
    title: "Recharge AC ou DC : quelle différence ?",
    description:
      "Courant alternatif ou continu : où s'effectue la conversion, pourquoi la recharge rapide est en DC, et ce que cela change pour la puissance, le prix et l'usage.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 5,
    intro:
      "Le réseau électrique fournit du courant alternatif (AC), alors qu'une batterie stocke du courant continu (DC). La différence entre recharge AC et DC tient à l'endroit où s'effectue la conversion, et cela explique presque tout : la puissance, la vitesse et le prix.",
    sections: [
      {
        heading: "Recharge AC : le chargeur est dans la voiture",
        paragraphs: [
          "En AC, la borne (ou la wallbox) apporte le courant alternatif et le chargeur embarqué de la voiture le convertit en courant continu. La puissance est donc limitée par la taille de ce chargeur : typiquement de 3,7 à 22 kW selon les modèles.",
          "C'est le mode de la recharge à domicile, au travail et sur la plupart des bornes de voirie.",
        ],
      },
      {
        heading: "Recharge DC : le chargeur est dans la borne",
        paragraphs: [
          "En DC, la conversion est faite par la borne, qui envoie directement du courant continu à la batterie. Ces bornes peuvent être bien plus puissantes, de quelques dizaines à plusieurs centaines de kW, car le convertisseur n'a pas à tenir dans la voiture.",
          "La recharge rapide sur autoroute est en DC. Elle exige aussi des installations plus coûteuses, ce qui se reflète en général sur le prix du kWh.",
        ],
      },
      {
        heading: "Comparaison",
        paragraphs: [],
        table: {
          headers: ["", "Recharge AC", "Recharge DC"],
          rows: [
            ["Conversion du courant", "Dans la voiture", "Dans la borne"],
            ["Puissances courantes", "3,7 à 22 kW", "50 kW et plus"],
            ["Usage typique", "Domicile, travail, voirie", "Trajets longs, autoroute"],
            ["Limite de vitesse", "Chargeur embarqué", "Batterie et courbe de charge"],
            ["Prix du kWh", "Généralement plus bas", "Généralement plus élevé"],
          ],
        },
      },
      {
        heading: "Les modèles du catalogue",
        paragraphs: ["Les puissances maximales varient beaucoup d'un modèle à l'autre :"],
        table: {
          headers: ["Modèle", "AC max.", "DC max.", "10-80 % en DC"],
          rows: [twingo, r5, ev3, ioniq5].map((v) => [
            `${v.brand} ${v.model}`,
            `${formatNumber(v.chargingAC, 1)} kW`,
            v.chargingDC ? `${formatNumber(v.chargingDC)} kW` : "Non disponible",
            v.chargingTime10to80 ? `${v.chargingTime10to80} min` : "Non disponible",
          ]),
        },
      },
      {
        heading: "Quand utiliser quoi ?",
        paragraphs: [
          "Pour l'usage quotidien, la recharge AC est presque toujours suffisante et moins chère. La recharge DC est faite pour les longs trajets et les dépannages : recharger 10-80 % en une pause café.",
        ],
      },
    ],
    relatedTools: ["/outils/temps-recharge", "/outils/puissance-borne-recharge"],
    relatedGuides: ["puissance-borne-7-11-22-kw", "puissance-recharge-dc", "fonctionnement-borne-de-recharge"],
    relatedVehicleIds: [twingo.id, r5.id, ioniq5.id],
    faq: [
      { question: "Peut-on recharger en DC à domicile ?", answer: "C'est théoriquement possible avec des bornes bidirectionnelles ou DC dédiées, mais ce n'est pas la pratique courante : à domicile, on charge presque toujours en AC." },
      { question: "La recharge DC abîme-t-elle la batterie ?", answer: "Une utilisation occasionnelle est prévue par les constructeurs. Un usage très fréquent peut accélérer légèrement le vieillissement : voir le guide sur la préservation de la batterie." },
    ],
    sources: [SOURCES.avere, SOURCES.evdb],
  },
  {
    slug: "temps-recharge-voiture-electrique",
    category: "recharge",
    title: "Combien de temps faut-il pour recharger une voiture électrique ?",
    description:
      "Temps de recharge selon la puissance de borne : formule, exemples chiffrés en AC, temps 10-80 % en DC et pourquoi la fin de charge est plus lente.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 6,
    intro:
      "Il n'y a pas de temps de recharge unique : tout dépend de l'énergie à ajouter et de la puissance réellement disponible. On peut pourtant l'estimer facilement en AC, et s'appuyer sur des valeurs publiées pour la recharge rapide.",
    sections: [
      {
        heading: "La formule en AC",
        paragraphs: [
          "Durée (h) = énergie à ajouter (kWh) ÷ (puissance utilisée (kW) × rendement). La puissance utilisée est la plus faible entre la borne et le chargeur du véhicule.",
        ],
      },
      {
        heading: "Exemples chiffrés en AC",
        chart: {
          title: `${r5.brand} ${r5.model} : durée d'une recharge AC de 10 à 80 %`,
          unit: "",
          bars: [3.7, 7.4, 11, 22].map((kw) => {
            const m = acChargeMinutes(r5, kw).minutes;
            return { label: `Borne ${formatNumber(kw, 1)} kW`, value: m, display: minutesToHuman(m) };
          }),
          caption: `Calcul EVExpert (rendement ${ASSUMPTIONS.chargingEfficiency} %). Au-delà de ${formatNumber(r5.chargingAC, 1)} kW, la durée ne baisse plus : la voiture limite la puissance.`,
        },
        paragraphs: [`Recharge de 10 à 80 % (calcul EVExpert, rendement ${ASSUMPTIONS.chargingEfficiency} %) :`],
        table: {
          headers: ["Modèle", "Sur 3,7 kW", "Sur 7,4 kW", "Sur 11 kW", "Sur 22 kW"],
          rows: [twingo, r5, my, ioniq5].map((v) => [
            `${v.brand} ${v.model}`,
            ...[3.7, 7.4, 11, 22].map((kw) => minutesToHuman(acChargeMinutes(v, kw).minutes)),
          ]),
        },
      },
      {
        heading: "En recharge rapide (DC)",
        paragraphs: [
          "En DC, la puissance n'est pas constante : elle atteint un pic puis diminue à mesure que la batterie se remplit. C'est pourquoi les constructeurs publient un temps de 10 à 80 % plutôt qu'un simple rapport énergie/puissance.",
        ],
        table: {
          caption: "Temps 10-80 % en DC publié par la source, et puissance moyenne déduite (calcul EVExpert)",
          headers: ["Modèle", "DC max.", "10-80 %", "Puissance moyenne"],
          rows: [r5, ev3, ioniq5, bmw].map((v) => [
            `${v.brand} ${v.model}`,
            `${formatNumber(v.chargingDC ?? 0)} kW`,
            `${v.chargingTime10to80} min`,
            `${formatNumber(averageDcPower(v) ?? 0)} kW`,
          ]),
        },
      },
      {
        heading: "Pourquoi 80 % ?",
        paragraphs: [
          "Au-delà de 80 %, la voiture réduit fortement la puissance pour protéger la batterie. Sur un long trajet, s'arrêter plus tôt et plus souvent est en général plus rapide que d'attendre 100 %.",
        ],
      },
    ],
    relatedTools: ["/outils/temps-recharge", "/outils/puissance-borne-recharge"],
    relatedGuides: ["recharger-a-80-pourcent", "puissance-recharge-dc", "recharge-ac-ou-dc"],
    relatedVehicleIds: [r5.id, ioniq5.id, bmw.id],
    faq: [
      { question: "Pourquoi mon temps de recharge est-il plus long que prévu ?", answer: "La température de la batterie, le niveau de charge de départ, la puissance réellement délivrée par la borne et le partage avec d'autres véhicules peuvent réduire la puissance." },
      { question: "Combien de temps pour un plein en 3,7 kW ?", answer: "C'est long : l'énergie de la batterie divisée par une puissance faible se compte en nombreuses heures. Utilisez le calculateur pour votre modèle." },
    ],
    sources: [SOURCES.evdb],
  },
  {
    slug: "fonctionnement-borne-de-recharge",
    category: "recharge",
    title: "Comment fonctionnent les bornes de recharge ?",
    description:
      "Ce que fait réellement une borne de recharge : dialogue avec la voiture, sécurité, comptage, paiement et supervision par l'opérateur.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 5,
    intro:
      "Une borne de recharge n'est pas une simple prise : elle dialogue avec la voiture, sécurise la connexion, mesure l'énergie et, dans l'espace public, communique avec un opérateur pour le paiement. Voici ce qui se passe entre le branchement et la fin de charge.",
    sections: [
      {
        heading: "Le dialogue avec la voiture",
        paragraphs: [
          "Avant de fournir de l'énergie, la borne et le véhicule échangent : la voiture indique qu'elle est connectée, la borne annonce le courant maximal qu'elle peut fournir et le véhicule règle son appel de puissance en conséquence. C'est un mécanisme de sécurité : le courant n'est établi que lorsque la connexion est correcte.",
        ],
      },
      {
        heading: "En AC : un interrupteur intelligent",
        paragraphs: [
          "Une borne AC contient surtout des protections, un contacteur et un compteur d'énergie. La conversion en courant continu est faite dans la voiture. C'est ce qui rend les wallbox simples et peu coûteuses.",
        ],
      },
      {
        heading: "En DC : un convertisseur puissant",
        paragraphs: [
          "Une borne DC embarque des convertisseurs de forte puissance et un système de refroidissement, et régule le courant en continu pendant la charge selon les demandes de la batterie. C'est un équipement bien plus complexe, qui explique le prix du kWh en recharge rapide.",
        ],
      },
      {
        heading: "Du badge au paiement",
        paragraphs: [
          "Sur le réseau public, l'utilisateur s'identifie avec une application, un badge ou un moyen de paiement. La borne est reliée à un système de supervision qui gère les sessions, la disponibilité et la facturation, selon des protocoles de communication normalisés entre bornes et opérateurs.",
        ],
      },
      {
        heading: "Où trouver les bornes ?",
        paragraphs: [
          "La localisation et les caractéristiques des points de recharge ouverts au public en France sont publiées en données ouvertes dans la base nationale des IRVE sur data.gouv.fr. Les applications et cartes d'opérateurs s'appuient sur ces données ou sur leurs propres relevés.",
        ],
      },
    ],
    relatedTools: ["/outils/puissance-borne-recharge", "/outils/cout-recharge-voiture-electrique"],
    relatedGuides: ["recharge-ac-ou-dc", "puissance-borne-7-11-22-kw", "recharge-domicile-ou-borne-publique"],
    relatedVehicleIds: [r5.id, ioniq5.id],
    faq: [
      { question: "Peut-on brancher n'importe quelle voiture sur n'importe quelle borne ?", answer: "En Europe, les connecteurs Type 2 (AC) et CCS (DC) sont les standards. Les voitures anciennes peuvent utiliser un autre connecteur en recharge rapide." },
      { question: "La borne peut-elle refuser de charger ?", answer: "Oui : en cas de défaut de mise à la terre, de connexion incomplète ou de limite de puissance, la charge ne démarre pas ou s'arrête par sécurité." },
    ],
    sources: [SOURCES.irve, SOURCES.avere],
  },
  {
    slug: "puissance-recharge-dc",
    category: "recharge",
    title: "Que signifie la puissance de recharge DC d'une voiture électrique ?",
    description:
      "Puissance maximale, puissance moyenne, courbe de charge : comment lire un chiffre de recharge DC et pourquoi le temps 10-80 % est un meilleur repère.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 5,
    intro:
      "« 250 kW en recharge rapide » : le chiffre impressionne, mais il décrit un pic, pas une moyenne. Pour comparer deux voitures, il vaut mieux regarder le temps de charge 10-80 % et la puissance moyenne qu'il implique.",
    sections: [
      {
        heading: "Un pic, pas une constante",
        paragraphs: [
          "La puissance DC maximale est atteinte sur une partie limitée de la charge, quand la batterie est vide, chaude et proche de sa température idéale. Elle décroît ensuite selon une courbe propre à chaque batterie.",
        ],
      },
      {
        heading: "La puissance moyenne, un meilleur indicateur",
        paragraphs: [
          "À partir du temps 10-80 % publié, on peut déduire la puissance moyenne : énergie de la fenêtre (70 % de la capacité utile) divisée par la durée. C'est un calcul EVExpert, utile pour comparer.",
        ],
        table: {
          caption: "Puissance maximale et puissance moyenne 10-80 % (calcul EVExpert d'après la source)",
          headers: ["Modèle", "DC max.", "10-80 %", "Moyenne déduite", "Moyenne / max."],
          rows: [veh("renault-5-e-tech-52-kwh-150-ch"), veh("hyundai-ioniq-5-84-kwh-rwd"), veh("bmw-ix3-40"), veh("mercedes-benz-cla-250"), veh("tesla-model-3-rwd")].map((v) => {
            const avg = averageDcPower(v) ?? 0;
            return [
              `${v.brand} ${v.model}`,
              `${formatNumber(v.chargingDC ?? 0)} kW`,
              `${v.chargingTime10to80} min`,
              `${formatNumber(avg)} kW`,
              `${formatNumber((avg / (v.chargingDC ?? 1)) * 100)} %`,
            ];
          }),
        },
      },
      {
        heading: "Ce qui limite la puissance en pratique",
        paragraphs: [],
        list: [
          "La puissance de la borne, qui peut être partagée entre deux véhicules.",
          "La température de la batterie, trop froide ou trop chaude.",
          "Le niveau de charge de départ : charger à partir de 10-20 % est plus efficace que partir de 50 %.",
          "Le câble et la tension du système : les tensions plus élevées permettent des puissances plus fortes.",
        ],
      },
      {
        heading: "Faut-il viser la puissance la plus élevée ?",
        paragraphs: [
          "Cela dépend de votre usage. Si vous ne faites que quelques longs trajets par an, la différence entre 100 et 250 kW représente quelques minutes par arrêt. Pour des trajets fréquents, le temps 10-80 % devient un critère important.",
        ],
      },
    ],
    relatedTools: ["/outils/temps-recharge", "/outils/puissance-borne-recharge"],
    relatedGuides: ["temps-recharge-voiture-electrique", "recharge-ac-ou-dc", "recharger-a-80-pourcent"],
    relatedVehicleIds: ["renault-5-e-tech-52-kwh-150-ch", "hyundai-ioniq-5-84-kwh-rwd", "bmw-ix3-40"],
    faq: [
      { question: "Le chiffre DC de la fiche est-il garanti ?", answer: "Non : c'est un maximum atteint dans de bonnes conditions. Le temps 10-80 % est plus représentatif." },
      { question: "Une puissance élevée est-elle toujours utile ?", answer: "Elle l'est surtout si vous faites souvent de longs trajets et que les bornes utilisées peuvent la délivrer." },
    ],
    sources: [SOURCES.evdb],
  },
  {
    slug: "recharger-a-80-pourcent",
    category: "batterie",
    title: "Faut-il charger une voiture électrique à 80 % ?",
    description:
      "Charger à 80 % ou à 100 % : ce que recommandent la logique de la batterie et la recharge rapide, selon la chimie (NMC ou LFP) et l'usage quotidien.",
    publishedAt: GUIDE_DATE,
    updatedAt: GUIDE_DATE,
    readingTime: 5,
    intro:
      "La règle des 80 % circule beaucoup. Elle est pertinente dans deux cas — la préservation de certaines batteries et la recharge rapide — mais elle n'est pas universelle. Voici comment décider.",
    sections: [
      {
        heading: "Deux raisons différentes de s'arrêter à 80 %",
        paragraphs: [
          "En recharge rapide, la puissance chute nettement après 80 % : s'arrêter à ce niveau fait gagner du temps sur un long trajet.",
          "En recharge quotidienne, éviter de conserver la batterie à un niveau de charge très élevé peut ralentir son vieillissement, surtout pour les batteries de type NMC. C'est un effet d'usure sur le long terme, pas un risque immédiat.",
        ],
      },
      {
        heading: "Cela dépend de la chimie de la batterie",
        paragraphs: [
          "Les batteries LFP (lithium-fer-phosphate) supportent bien les charges à 100 % : plusieurs constructeurs recommandent même de les charger à fond régulièrement pour recalibrer l'estimation de charge. Les batteries NMC sont plus sensibles à un stockage prolongé à un état de charge élevé.",
          "Le type de chimie figure dans la source de chaque fiche du catalogue lorsqu'il est connu ; la notice constructeur reste la référence pour votre modèle.",
        ],
      },
      {
        heading: "Une règle pratique",
        paragraphs: [],
        list: [
          "Usage quotidien : viser un niveau modéré (par exemple 80 %) sur une batterie NMC, sauf besoin de l'autonomie complète.",
          "Long trajet : charger à 100 % avant de partir si nécessaire, puis s'arrêter à 80 % aux bornes rapides.",
          "Batterie LFP : suivre la recommandation du constructeur, qui autorise souvent 100 %.",
          "Éviter de laisser la voiture longtemps à 100 % ou à un niveau très bas.",
        ],
      },
      {
        heading: "Ce que dit la garantie",
        paragraphs: [
          "Les garanties batterie (souvent 8 ans) portent sur la capacité restante, avec un seuil défini par chaque constructeur. Lisez ses conditions d'usage, notamment sur les recharges rapides répétées.",
        ],
      },
    ],
    relatedTools: ["/outils/cout-recharge-voiture-electrique", "/outils/temps-recharge"],
    relatedGuides: ["preserver-batterie-voiture-electrique", "puissance-recharge-dc", "batterie-brute-batterie-utile"],
    relatedVehicleIds: ["tesla-model-3-rwd", "tesla-model-3-long-range-rwd", "renault-5-e-tech-52-kwh-150-ch"],
    faq: [
      { question: "Charger à 100 % détruit-il la batterie ?", answer: "Non : c'est prévu par le constructeur. C'est le maintien prolongé à un niveau élevé, surtout sur une batterie NMC, qui contribue à l'usure." },
      { question: "Où trouver la recommandation de mon constructeur ?", answer: "Dans le manuel du véhicule ou l'application du constructeur : elle dépend du modèle et de la chimie de la batterie." },
    ],
    sources: [SOURCES.evdb, SOURCES.avere],
  },
  ];
}
