import type { Guide } from "@/types";
import { SOURCES } from "@/data/sources";
import { formatNumber } from "@/lib/format";
import type { GuideContext } from "./helpers";

const DATE = "2026-10-02";

/** Perte annuelle moyenne mesurée par Geotab (étude de janvier 2026), puis valeurs extrêmes citées par l'étude. */
const RATES = [
  { label: "Recharge AC ou faible puissance (environ 1,5 %/an)", rate: 1.5 },
  { label: "Moyenne de l'étude (2,3 %/an)", rate: 2.3 },
  { label: "Recharge DC > 100 kW fréquente (jusqu'à 3,0 %/an)", rate: 3.0 },
];
const YEARS = [5, 8, 10];
/** Hypothèse de simplification EVExpert : perte linéaire. */
const retained = (ratePerYear: number, years: number) => Math.max(0, 100 - ratePerYear * years);

/** Prix de pack BloombergNEF 2025 : moyenne mondiale, Chine, et écarts publiés pour l'Amérique du Nord et l'Europe. */
const BNEF = { global: 108, china: 84, europeVsChina: 0.56 };
const bnefEurope = BNEF.china * (1 + BNEF.europeVsChina);
const round100 = (n: number) => Math.round(n / 100) * 100;

/**
 * Deux guides batterie aux intentions distinctes : « combien de temps dure-t-elle ? »
 * (durée de vie, dégradation, facteurs) et « combien coûte-t-elle ? » (prix du pack,
 * remplacement, modules). Chaque chiffre externe vient d'une source ouverte et datée
 * (voir `SOURCES`) ; ce qui n'est pas publié est indiqué « Non disponible ».
 */
export function buildBatteryGuides(ctx: GuideContext): Guide[] {
  const { veh, vehicles } = ctx;
  const r5 = veh("renault-5-e-tech-52-kwh-150-ch");
  const my = veh("tesla-model-y-rwd");
  const twingo = veh("renault-twingo-e-tech-27-5-kwh");
  const ev3 = veh("kia-ev3-long-range");
  const elroq = veh("skoda-elroq-85");
  const lfp = vehicles.filter((v) => v.chemistry === "LFP").length;
  const nmc = vehicles.filter((v) => v.chemistry === "NMC").length;
  const N = vehicles.length;
  const name = (v: typeof r5) => `${v.brand} ${v.model} ${v.version}`;

  return [
    {
      slug: "duree-de-vie-batterie-voiture-electrique",
      category: "batterie",
      title: "Durée de vie d'une batterie de voiture électrique : ce que disent les données",
      description:
        "Combien de capacité perd une batterie de voiture électrique avec le temps ? Taux de dégradation mesuré, facteurs qui l'accélèrent, rôle de la garantie et bons réflexes.",
      metaTitle: "Durée de vie d'une batterie de voiture électrique",
      metaDescription:
        "Une batterie perd de la capacité, lentement : taux mesuré sur plus de 22 700 véhicules, facteurs qui l'accélèrent, ce que couvre la garantie et bons réflexes.",
      publishedAt: DATE,
      updatedAt: DATE,
      readingTime: 7,
      intro:
        "Une batterie de voiture électrique ne s'arrête pas un jour : elle perd progressivement de la capacité. Le rythme moyen mesuré en 2026 sur plus de 22 700 véhicules est de 2,3 % par an, avec des écarts selon la façon de recharger, le climat et l'usage. Ce guide explique ce que ce chiffre veut dire, ce qui le fait varier et ce qu'une garantie garantit réellement.",
      sections: [
        {
          heading: "La réponse courte",
          paragraphs: [
            "Selon l'étude Geotab de janvier 2026, fondée sur des données télématiques agrégées de plus de 22 700 véhicules (21 marques et modèles), la batterie perd en moyenne 2,3 % de sa capacité par an. La même société mesurait 1,8 % dans son étude de 2024 : ce taux n'est donc pas une constante, il dépend de l'échantillon et des usages.",
            "Aucune des sources consultées ne donne une durée de vie en années ou en kilomètres valable pour tous les modèles. EVExpert n'en avance donc pas : un taux annuel moyen décrit un rythme, pas une date de fin.",
          ],
        },
        {
          heading: "Ce que mesure la dégradation",
          paragraphs: [
            "La dégradation se lit par l'état de santé de la batterie (SOH, state of health) : la part de capacité encore disponible par rapport à l'origine. Geotab donne l'exemple d'une batterie de 60 kWh à 80 % de SOH, qui se comporte comme une batterie de 48 kWh (pour la différence entre capacité brute et capacité utile, voir [batterie brute et batterie utile](/guides/batterie-brute-batterie-utile)). Une capacité réduite se traduit directement par une autonomie plus courte.",
            "Elle ne touche pas la voiture d'un coup : la capacité baisse progressivement, et l'autonomie homologuée WLTP d'origine ne correspond plus à l'autonomie disponible après quelques années.",
          ],
        },
        {
          heading: "Ce que représente 2,3 % par an",
          paragraphs: [
            "Pour donner un ordre de grandeur, le tableau applique les taux cités par Geotab à une perte supposée régulière dans le temps (extrapolation linéaire EVExpert). C'est une simplification : l'étude ne dit pas que la perte est linéaire, et chaque batterie évolue différemment. Ce n'est pas une prévision.",
          ],
          table: {
            caption: "Capacité restante après 5, 8 et 10 ans selon le rythme annuel de perte (calcul illustratif EVExpert)",
            headers: ["Rythme de perte", ...YEARS.map((y) => `Après ${y} ans`)],
            rows: RATES.map((r) => [r.label, ...YEARS.map((y) => `${formatNumber(retained(r.rate, y))} %`)]),
          },
        },
        {
          heading: "Traduction en kWh et en kilomètres",
          level: 3,
          paragraphs: [
            `Au rythme moyen de 2,3 %/an, après 8 ans, il resterait ${formatNumber(retained(2.3, 8))} % de la capacité. Appliqué à la capacité utile des fiches du catalogue, et en supposant une autonomie proportionnelle à la capacité (simplification EVExpert, valeurs WLTP d'origine) :`,
          ],
          table: {
            caption: "Capacité utile et autonomie WLTP restantes après 8 ans à 2,3 %/an (calcul illustratif)",
            headers: ["Modèle", "Capacité utile d'origine", "Après 8 ans", "Autonomie WLTP d'origine", "Après 8 ans"],
            rows: [r5, my].map((v) => [
              name(v),
              `${formatNumber(v.batteryUsable, 1)} kWh`,
              `${formatNumber((v.batteryUsable * retained(2.3, 8)) / 100, 1)} kWh`,
              `${formatNumber(v.rangeWltp)} km`,
              `${formatNumber((v.rangeWltp * retained(2.3, 8)) / 100)} km`,
            ]),
          },
        },
        {
          heading: "Ce qui accélère ou ralentit la dégradation",
          paragraphs: [
            "L'étude Geotab isole plusieurs facteurs. Le premier est la puissance de recharge, présentée comme l'influence opérationnelle la plus forte.",
          ],
          table: {
            caption: "Facteurs mesurés par Geotab (janvier 2026)",
            headers: ["Facteur", "Effet mesuré", "Comment le lire"],
            rows: [
              ["Recharge DC au-dessus de 100 kW utilisée de façon intensive", "Jusqu'à 3,0 % par an en moyenne", "Contre environ 1,5 % pour les véhicules rechargés surtout en AC ou à faible puissance"],
              ["Climat chaud", "Environ 0,4 % de plus par an", "Par rapport à un climat tempéré"],
              ["Usage intensif", "Environ 0,8 % de plus par an", "Par rapport au groupe de véhicules le moins utilisé"],
              ["Niveau de charge", "Accélération seulement au-delà de 80 % du temps à un niveau très haut ou très bas", "Un passage ponctuel à 100 % ou à un niveau bas n'est pas ce que décrit l'étude"],
            ],
          },
        },
        {
          heading: "Vieillissement calendaire et vieillissement cyclique",
          paragraphs: [
            "On distingue d'ordinaire deux mécanismes : le vieillissement lié au temps, même quand la voiture roule peu (calendaire), et celui lié aux cycles de charge et de décharge (cyclique). On associe généralement la chaleur et un stockage prolongé à un niveau de charge extrême au premier, les charges très puissantes et les cycles nombreux au second.",
            "Les données Geotab vont dans ce sens, mais ne permettent pas de séparer les deux effets : les facteurs ci-dessus se cumulent dans les mesures. C'est pourquoi ce guide ne chiffre pas la part de chacun.",
          ],
        },
        {
          heading: "LFP ou NMC : une chimie plus durable ?",
          paragraphs: [
            `Dans notre catalogue de ${N} versions, la source indique la chimie pour ${lfp + nmc} d'entre elles (${lfp} LFP, ${nmc} NMC). Les cellules LFP sont réputées supporter mieux les charges répétées à 100 %, mais le communiqué Geotab consulté ne publie pas de taux de dégradation par chimie : EVExpert n'en déduit donc pas de durée de vie plus longue pour l'une ou l'autre. Pour la comparaison technique, voir l'analyse [LFP ou NMC](/blog/lfp-ou-nmc-ce-que-montrent-les-donnees).`,
          ],
        },
        {
          heading: "Garantie et durée de vie : deux choses différentes",
          paragraphs: [
            "Une garantie de 8 ans fixe un minimum contractuel, pas une durée de vie maximale. Les conditions (seuil de capacité couvert, kilométrage, transfert) varient selon le constructeur et ne sont pas publiées par la source du catalogue : voir [ce que disent les données sur la garantie batterie](/blog/garantie-batterie-ce-que-disent-les-donnees).",
            "Un repère indépendant existe côté réglementation. Le GTR n° 22 de l'ONU sur la durabilité des batteries embarquées fixe, pour les voitures particulières, une capacité certifiée restante d'au moins 80 % jusqu'à 5 ans ou 100 000 km, puis d'au moins 70 % jusqu'à 8 ans ou 160 000 km (le plus tôt des deux étant retenu). Le règlement européen Euro 7 introduit des exigences minimales de durabilité des batteries, applicables aux nouveaux types de voitures à partir du 29 novembre 2026 et à tous les nouveaux véhicules à partir du 29 novembre 2027 ; ses seuils précis sont fixés par le texte du règlement et ne sont pas repris ici.",
            `À titre de comparaison, le rythme moyen de 2,3 %/an laisserait environ ${formatNumber(retained(2.3, 5))} % après 5 ans et ${formatNumber(retained(2.3, 8))} % après 8 ans dans l'hypothèse linéaire du tableau précédent. La comparaison est indicative : le GTR 22 mesure une capacité énergétique certifiée, Geotab un état de santé issu de télématique.`,
          ],
        },
        {
          heading: "Les bons réflexes",
          paragraphs: [
            "Ils découlent directement des facteurs mesurés, sans demander de contrainte excessive :",
          ],
          list: [
            "Réserver la recharge rapide à forte puissance aux trajets longs, plutôt que d'en faire le mode de recharge courant (détails dans [comment préserver la batterie](/guides/preserver-batterie-voiture-electrique)).",
            "Éviter de laisser la voiture longtemps à un niveau de charge très haut ou très bas, en suivant la recommandation du constructeur selon la chimie ([faut-il charger à 80 % ?](/guides/recharger-a-80-pourcent)).",
            "Limiter l'exposition prolongée à la chaleur quand c'est possible.",
            "À l'achat d'un véhicule d'occasion, demander un rapport d'état de santé de la batterie.",
          ],
        },
        {
          heading: "Limites de ces données",
          paragraphs: [
            "Les taux cités sont des moyennes sur un échantillon de véhicules télématiques, pas des garanties individuelles : un véhicule donné peut se situer au-dessus ou en dessous. Les résultats dépendent de la méthode de mesure du SOH, des modèles représentés et des conditions d'usage. Les valeurs de capacité et d'autonomie des fiches EVExpert viennent d'une source tierce et sont à confirmer auprès du constructeur. Si le coût d'un remplacement vous préoccupe, voir le [prix d'une batterie de voiture électrique](/guides/prix-batterie-voiture-electrique).",
          ],
        },
      ],
      relatedTools: ["/outils/autonomie-voiture-electrique", "/outils/tco-voiture-electrique"],
      relatedGuides: [
        "preserver-batterie-voiture-electrique",
        "recharger-a-80-pourcent",
        "batterie-brute-batterie-utile",
        "prix-batterie-voiture-electrique",
      ],
      relatedVehicleIds: [r5.id, my.id, twingo.id],
      faq: [
        {
          question: "Combien de temps dure une batterie de voiture électrique ?",
          answer:
            "Aucune source consultée ne donne de durée valable pour tous les modèles. Elle perd progressivement de la capacité : 2,3 % par an en moyenne selon l'étude Geotab de 2026, avec des écarts selon la recharge, le climat et l'usage.",
        },
        {
          question: "La recharge rapide abîme-t-elle la batterie ?",
          answer:
            "Selon Geotab, une recharge DC de plus de 100 kW utilisée de façon intensive est associée à une perte pouvant atteindre 3,0 % par an, contre environ 1,5 % pour une recharge surtout en AC ou à faible puissance. Un usage occasionnel n'est pas ce que décrit l'étude.",
        },
        {
          question: "La garantie de 8 ans correspond-elle à la durée de vie ?",
          answer:
            "Non : c'est un minimum contractuel dont les conditions varient selon le constructeur. Elle ne prédit pas la durée de vie réelle de la batterie.",
        },
      ],
      sources: [SOURCES.geotabBattery2026, SOURCES.gtr22, SOURCES.euro7, SOURCES.evdb],
    },
    {
      slug: "prix-batterie-voiture-electrique",
      category: "batterie",
      title: "Prix d'une batterie de voiture électrique : pack, remplacement et réparation",
      description:
        "Combien coûte une batterie de voiture électrique ? Prix du pack au kWh, prix de remplacement publiés par les constructeurs, réparation par modules et ce qui n'est pas publié.",
      metaTitle: "Prix d'une batterie de voiture électrique",
      metaDescription:
        "Prix du pack au kWh, prix de remplacement publiés par les constructeurs, réparation par modules : ce que coûte une batterie et ce qui reste inconnu.",
      publishedAt: DATE,
      updatedAt: DATE,
      readingTime: 7,
      intro:
        "Deux prix coexistent et il ne faut pas les confondre : celui d'un pack de batterie sortant d'usine, publié en dollars par kWh, et celui qu'un propriétaire se voit facturer pour un remplacement. Le premier baisse ; le second dépend du modèle, du réseau et de la possibilité de réparer. Ce guide sépare les deux, avec des sources datées.",
      sections: [
        {
          heading: "La réponse courte",
          paragraphs: [
            `Selon BloombergNEF, le prix moyen d'un pack de batterie lithium-ion a atteint ${formatNumber(BNEF.global)} $/kWh en 2025 (moyenne pondérée, en baisse de 8 % sur un an). Ce n'est pas le prix payé par un conducteur : BloombergNEF précise qu'il s'agit du prix du pack, pas de celui des véhicules ou de leur entretien.`,
            "Les constructeurs publient en France le prix de remplacement de leurs batteries : L'argus relève par exemple 7 000 € TTC pour la batterie de la Dacia Spring (26,8 kWh), 14 400 € pour celle de la Renault 5 E-Tech 52 kWh et 25 000 € pour celle du Scénic E-Tech de 87 kWh. Ces prix varient fortement d'un modèle à l'autre : EVExpert n'en publie pas de moyenne.",
          ],
        },
        {
          heading: "Le prix du pack, au kWh",
          paragraphs: [
            `BloombergNEF donne ${formatNumber(BNEF.global)} $/kWh en moyenne mondiale pour 2025, ${formatNumber(BNEF.china)} $/kWh en Chine, avec des prix supérieurs de 44 % en Amérique du Nord et de 56 % en Europe par rapport à la Chine. L'écart européen représente donc environ ${formatNumber(bnefEurope)} $/kWh (calcul EVExpert : ${formatNumber(BNEF.china)} × 1,56). L'étude relie cette baisse à la surcapacité des usines, à la concurrence et à l'essor des cellules LFP moins coûteuses.`,
            "Le tableau applique ces deux repères à la capacité brute des modèles du catalogue (la différence avec la capacité utile est expliquée dans [batterie brute et batterie utile](/guides/batterie-brute-batterie-utile)). C'est un ordre de grandeur du coût du pack, pas un devis : il ne comprend ni main-d'œuvre, ni marge, ni logistique, et il est exprimé en dollars sans conversion de devises.",
          ],
          table: {
            caption: "Ordre de grandeur du coût d'un pack (calcul EVExpert, arrondi à la centaine de dollars)",
            headers: ["Modèle", "Capacité brute", `À ${formatNumber(BNEF.global)} $/kWh (moyenne mondiale)`, `À environ ${formatNumber(bnefEurope)} $/kWh (Europe, calculé)`],
            rows: [twingo, r5, my, ev3, elroq].map((v) => [
              name(v),
              v.batteryGross ? `${formatNumber(v.batteryGross, 1)} kWh` : "Non disponible",
              v.batteryGross ? `${formatNumber(round100(v.batteryGross * BNEF.global))} $` : "Non disponible",
              v.batteryGross ? `${formatNumber(round100(v.batteryGross * bnefEurope))} $` : "Non disponible",
            ]),
          },
        },
        {
          heading: "Ce que facturent les marques",
          paragraphs: [
            "Les constructeurs de voitures électrifiées doivent rendre publics les prix de leurs batteries en France, selon L'argus, qui les compile. Le tableau reprend les prix TTC de remplacement de la batterie des modèles 100 % électriques Renault et Dacia, tels que publiés (dernière mise à jour de la page : 13 juin 2026). Les libellés sont ceux de la source, parfois abrégés ; la page ne précise pas si la pose est comprise. Le prix par kWh est calculé par EVExpert.",
          ],
          table: {
            caption: "Prix TTC de la batterie de remplacement publiés par Renault Group (source : L'argus) et prix par kWh calculé",
            headers: ["Modèle (libellé de la source, abrégé)", "Capacité", "Prix TTC", "Soit par kWh"],
            rows: [
              ["Dacia Spring 65 ch", 26.8, 7000],
              ["Renault Twingo E-Tech 81 ch", 22, 12000],
              ["Mégane E-Tech Autonomie Urbaine 130 ch", 40, 12000],
              ["Renault Kangoo E-Tech 120 ch", 45, 15000],
              ["Renault 5 E-Tech EV52 150 ch", 52, 14400],
              ["Renault Zoe R110 / R135", 52, 15000],
              ["Mégane E-Tech Autonomie Confort 130 / 220 ch", 60, 17000],
              ["Scénic E-Tech Autonomie Confort 170 ch", 60, 22000],
              ["Scénic E-Tech Grande Autonomie 220 ch", 87, 25000],
            ].map(([m, kwh, price]) => [
              String(m),
              `${formatNumber(kwh as number, 1)} kWh`,
              `${formatNumber(price as number)} €`,
              `${formatNumber(Math.round((price as number) / (kwh as number)))} €/kWh`,
            ]),
          },
        },
        {
          heading: "Un autre constructeur pour comparaison",
          level: 3,
          paragraphs: [
            "Chez Peugeot, L'argus relève 23 600 € TTC pour la batterie de 97 kWh des e-3008 et e-5008 Grande Autonomie, soit environ 243 €/kWh (calcul EVExpert). Les prix publiés ne se comparent pas modèle à modèle sans précaution : capacités, chimies et politiques de prix diffèrent, et les libellés ne correspondent pas toujours aux versions du catalogue EVExpert. Les prix des autres marques du catalogue n'ont pas été relevés : Non disponible.",
          ],
        },
        {
          heading: "Pourquoi l'écart entre le pack et la facture",
          level: 3,
          paragraphs: [
            "Le prix par kWh publié par les constructeurs (de l'ordre de 240 à 550 €/kWh dans le tableau) est supérieur au prix moyen du pack d'usine selon BloombergNEF, et les deux ne sont pas exprimés dans la même devise ni au même périmètre : on ne peut pas en déduire un coefficient précis. Les sources consultées ne détaillent pas la décomposition du prix (marge, logistique, diagnostic, main-d'œuvre, reprise de l'ancienne batterie). EVExpert ne la chiffre donc pas.",
            "Ce qu'on peut dire : le coût de fabrication du pack baisse, mais la facture d'un remplacement dépend d'abord du modèle, de la disponibilité de la pièce et de la politique de la marque.",
          ],
        },
        {
          heading: "Remplacement complet, modules ou cellules",
          paragraphs: [
            "Une batterie défaillante n'est pas toujours à remplacer entièrement. À titre anecdotique : en décembre 2024, Mac4Ever a recueilli des propos de commerciaux et d'ateliers, non vérifiés et hors main-d'œuvre, selon lesquels le diagnostic coûterait entre 150 et 250 € et un rééquilibrage ou une petite réparation moins de 500 €. Ces montants n'engagent aucune marque et ne remplacent pas un devis.",
            "Tout dépend de la conception du pack : d'après les mêmes propos, le remplacement par module serait possible sur certains modèles (Mini, Audi, Volkswagen série ID, BMW, Renault Zoé), mais pas sur d'autres, comme Tesla (conception cell-to-vehicle) ou la Dacia Spring (batterie non modulaire).",
          ],
          list: [
            "Défaut localisé et pack modulaire : réparation par module ou cellule, souvent beaucoup moins chère qu'un pack complet.",
            "Pack non modulaire ou dégradation générale : remplacement complet, selon le tarif de la marque.",
          ],
        },
        {
          heading: "Garantie : qui paie ?",
          paragraphs: [
            "Pendant la garantie, la prise en charge d'une batterie défaillante ou trop dégradée dépend des conditions du constructeur : seuil de capacité, durée, kilométrage, entretien exigé. La source du catalogue ne les précise pas. Voir [ce que disent les données sur la garantie batterie](/blog/garantie-batterie-ce-que-disent-les-donnees), et le guide sur la [durée de vie d'une batterie](/guides/duree-de-vie-batterie-voiture-electrique) pour comprendre ce que la garantie couvre ou ne couvre pas.",
          ],
        },
        {
          heading: "Ce qui n'est pas disponible",
          paragraphs: [
            "Faute de source fiable, EVExpert ne publie pas les valeurs suivantes :",
          ],
          list: [
            "prix de remplacement publiés par les marques autres que Renault, Dacia et Peugeot : Non disponible ;",
            "prix d'un pack reconditionné ou d'un échange standard : Non disponible ;",
            "décomposition de la facture entre pièce, main-d'œuvre et marge : Non disponible ;",
            "prix d'une batterie d'occasion : Non disponible.",
          ],
        },
        {
          heading: "Comment s'en servir pour décider",
          paragraphs: [
            "Le risque d'un remplacement hors garantie pèse dans le coût total d'un véhicule gardé longtemps ou acheté d'occasion. Pour un neuf, comparer les conditions de garantie ; pour une occasion, demander un rapport d'état de santé de la batterie avant l'achat, et consulter le prix de remplacement publié par la marque pour le modèle visé. Le [calculateur de coût total de possession](/outils/tco-voiture-electrique) permet d'intégrer ces postes dans un scénario, et le guide pour [calculer le TCO](/guides/calculer-tco-voiture-electrique) détaille la méthode.",
          ],
        },
      ],
      relatedTools: ["/outils/tco-voiture-electrique", "/outils/cout-100-km"],
      relatedGuides: [
        "duree-de-vie-batterie-voiture-electrique",
        "batterie-brute-batterie-utile",
        "preserver-batterie-voiture-electrique",
        "calculer-tco-voiture-electrique",
      ],
      relatedVehicleIds: [twingo.id, r5.id, my.id],
      faq: [
        {
          question: "Combien coûte le remplacement d'une batterie de voiture électrique ?",
          answer:
            "Cela dépend du modèle : chez Renault Group, L'argus relève des prix TTC publiés allant de 7 000 € (Dacia Spring) à 25 000 € (Scénic E-Tech 87 kWh). Consultez le prix publié par la marque pour votre modèle.",
        },
        {
          question: "Le prix de 108 $/kWh est-il le prix que je paierais ?",
          answer:
            "Non. C'est le prix moyen d'un pack en 2025 selon BloombergNEF, pas le prix facturé à un propriétaire pour un remplacement.",
        },
        {
          question: "Peut-on remplacer seulement une partie de la batterie ?",
          answer:
            "Parfois : certaines batteries permettent de remplacer un module, d'autres non. Cela dépend du constructeur et du modèle.",
        },
      ],
      sources: [SOURCES.bnefBatteryPrice2025, SOURCES.largusBatterieRenault, SOURCES.largusBatteriePeugeot, SOURCES.mac4everBatterie, SOURCES.evdb],
    },
  ];
}
