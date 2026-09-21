import type { Guide, Vehicle } from "@/types";
import { ASSUMPTIONS as A } from "@/data/assumptions";
import { SOURCES } from "@/data/sources";
import { acChargeMinutes, averageDcPower, batteryConsumption100, chargeCost, costPer100km } from "@/lib/vehicle-calcs";
import { formatEuro, formatNumber, minutesToHuman } from "@/lib/utils";
import type { GuideContext } from "./helpers";
import { GUIDE_DATE } from "./helpers";

const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const avg = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;

/**
 * Guides ajoutés lors de la passe éditoriale : chacun répond à une question distincte des guides
 * existants et s'appuie sur les données du catalogue (aucune valeur inventée : tout chiffre
 * de véhicule est calculé depuis les fiches).
 */
export function buildNewGuides(ctx: GuideContext): Guide[] {
  const { veh, vehicles } = ctx;
  const N = vehicles.length;
  const r5 = veh("renault-5-e-tech-52-kwh-150-ch");
  const my = veh("tesla-model-y-rwd");
  const ev3 = veh("kia-ev3-long-range");
  const ec3 = veh("citroen-e-c3-standard-range-44-kwh");
  const elroq = veh("skoda-elroq-85");
  const name = (v: Vehicle) => `${v.brand} ${v.model}`;
  const full = (v: Vehicle) => `${v.brand} ${v.model} ${v.version}`;
  const kmPerKwh = (v: Vehicle) => v.rangeWltp / v.batteryUsable;

  /* ---------------------------- consommation ---------------------------- */
  const byCons = [...vehicles].sort((a, b) => batteryConsumption100(a) - batteryConsumption100(b));
  const consValues = vehicles.map(batteryConsumption100);
  const pairs = vehicles.filter((v): v is Vehicle & { consumptionWltp: number } => v.consumptionWltp !== null);
  const ratios = pairs.map((v) => v.consumptionWltp / batteryConsumption100(v));
  const medianGap = (median(ratios) - 1) * 100;
  const impliedEfficiency = 100 / median(ratios);
  const bodyTypes = ["citadine", "compacte", "berline", "SUV"] as const;
  const bodyCons = bodyTypes.map((b) => {
    const l = vehicles.filter((v) => v.bodyType === b);
    return { b, n: l.length, cons: avg(l.map(batteryConsumption100)) };
  });

  /* --------------------------- prise domestique -------------------------- */
  const socketModels = [ec3, r5, my, elroq];
  const nightKwh = 2.3 * (A.chargingEfficiency / 100) * 10;
  const nightKm = (v: Vehicle) => (nightKwh / batteryConsumption100(v)) * 100;
  const eightHourKm = (v: Vehicle) => ((2.3 * (A.chargingEfficiency / 100) * 8) / batteryConsumption100(v)) * 100;

  return [
    {
      slug: "kw-kwh-difference-voiture-electrique",
      category: "comprendre",
      title: "kW ou kWh : quelle différence pour une voiture électrique ?",
      description:
        "Le kWh mesure l'énergie de la batterie, le kW la puissance de charge ou du moteur : la différence expliquée avec des exemples chiffrés tirés du catalogue.",
      publishedAt: GUIDE_DATE,
      updatedAt: GUIDE_DATE,
      readingTime: 5,
      intro:
        "Les fiches techniques alignent deux unités qui se ressemblent : le kWh et le kW. Le premier décrit ce que la batterie peut contenir, le second la vitesse à laquelle l'énergie circule. Bien les distinguer évite de mal lire une autonomie ou un temps de charge.",
      sections: [
        {
          heading: "Le kWh : une quantité d'énergie",
          paragraphs: [
            "Le kilowattheure (kWh) mesure une énergie. C'est ce que la batterie stocke, et ce que vous payez sur une facture d'électricité ou à une borne. Un kWh, c'est l'énergie consommée par un appareil de 1 kW pendant une heure.",
            `Plus la capacité est grande, plus la voiture peut parcourir de kilomètres, à consommation égale. Trois modèles du catalogue, avec les kilomètres WLTP obtenus par kWh utile (calcul EVExpert) :`,
          ],
          table: {
            caption: "Capacité de batterie et autonomie WLTP (source spécialisée, calcul EVExpert pour la dernière colonne)",
            headers: ["Modèle", "Batterie utile", "Autonomie WLTP", "Kilomètres par kWh"],
            rows: [r5, my, ev3].map((v) => [
              full(v),
              `${formatNumber(v.batteryUsable, 1)} kWh`,
              `${formatNumber(v.rangeWltp)} km`,
              `${formatNumber(kmPerKwh(v), 1)} km/kWh`,
            ]),
          },
        },
        {
          heading: "Le kW : une puissance",
          paragraphs: [
            "Le kilowatt (kW) mesure une puissance, c'est-à-dire un débit d'énergie à un instant donné. Il apparaît à trois endroits d'une fiche : la puissance du moteur, la puissance de charge en courant alternatif (AC) et celle en courant continu (DC).",
            "La puissance du moteur est aussi donnée en chevaux : 1 kW correspond à environ 1,36 ch.",
          ],
          table: {
            caption: "Puissances publiées par la source",
            headers: ["Modèle", "Moteur", "Charge AC maximale", "Charge DC maximale"],
            rows: [r5, my, ev3].map((v) => [
              full(v),
              `${formatNumber(v.powerKw)} kW (${formatNumber(v.powerPs)} ch)`,
              `${formatNumber(v.chargingAC, 1)} kW`,
              v.chargingDC === null ? "Non disponible" : `${formatNumber(v.chargingDC)} kW`,
            ]),
          },
        },
        {
          heading: "Relier les deux : la durée de charge",
          paragraphs: [
            "En divisant l'énergie à ajouter par la puissance utilisée, on obtient une durée : durée (h) = énergie (kWh) ÷ puissance (kW), à corriger des pertes de charge.",
            `Pour la ${full(r5)}, passer de 10 à 80 % revient à ajouter 0,7 × ${formatNumber(r5.batteryUsable, 1)} = ${formatNumber(r5.batteryUsable * 0.7, 1)} kWh. Sur une borne AC de 7,4 kW, cela prend environ ${minutesToHuman(acChargeMinutes(r5, 7.4).minutes)} ; sur 11 kW, environ ${minutesToHuman(acChargeMinutes(r5, 11).minutes)} (calcul EVExpert, rendement de charge ${A.chargingEfficiency} %).`,
            r5.chargingDC !== null && r5.chargingTime10to80 !== null
              ? `En courant continu, la source publie un temps de ${r5.chargingTime10to80} minutes pour la même fenêtre : la puissance moyenne est d'environ ${formatNumber(averageDcPower(r5) ?? 0)} kW, alors que la puissance maximale annoncée est de ${formatNumber(r5.chargingDC)} kW. Le pic n'est atteint que brièvement.`
              : "",
          ].filter(Boolean),
        },
        {
          heading: "Les confusions à éviter",
          paragraphs: [],
          list: [
            "« kW par heure » n'a pas de sens ici : la puissance ne s'accumule pas. C'est l'énergie (kWh) qui résulte d'une puissance maintenue pendant une durée.",
            "Une borne de 22 kW ne charge pas à 22 kW une voiture limitée à 11 kW : la puissance utilisée est la plus faible des deux, comme l'explique le guide sur la puissance de borne.",
            "La taille d'une batterie se donne en kWh, jamais en kW : comparer deux batteries en kW n'a pas de sens.",
            "La puissance maximale de charge n'est pas la puissance moyenne : c'est cette dernière qui détermine le temps de charge.",
          ],
        },
      ],
      relatedTools: ["/outils/temps-recharge", "/outils/cout-recharge-voiture-electrique"],
      relatedGuides: ["batterie-brute-batterie-utile", "puissance-borne-7-11-22-kw", "temps-recharge-voiture-electrique", "puissance-recharge-dc"],
      relatedVehicleIds: [r5.id, my.id, ev3.id],
      faq: [
        {
          question: "Un kWh, c'est combien de kilomètres ?",
          answer: "Cela dépend de la consommation : à 15 kWh/100 km, un kWh permet d'environ 6,7 km ; à 20 kWh/100 km, 5 km. La consommation réelle varie avec la vitesse et la température.",
        },
        {
          question: "Pourquoi le prix de l'électricité se donne-t-il en kWh ?",
          answer: "Parce que l'on paie de l'énergie consommée. La puissance intervient dans la vitesse de charge et, à la maison, dans la puissance souscrite de l'abonnement.",
        },
      ],
      sources: [SOURCES.evdb],
    },

    {
      slug: "consommation-voiture-electrique-kwh-100-km",
      category: "autonomie",
      title: "Consommation d'une voiture électrique : combien de kWh aux 100 km ?",
      description: `Ce que mesure la consommation en kWh/100 km, la différence entre consommation à la batterie et à la prise, et les valeurs des ${N} versions du catalogue.`,
      publishedAt: GUIDE_DATE,
      updatedAt: GUIDE_DATE,
      readingTime: 6,
      intro:
        "La consommation d'une voiture électrique se lit en kWh aux 100 km. Selon qu'elle est mesurée à la batterie ou à la prise, le chiffre n'est pas le même : c'est la source de bien des comparaisons faussées.",
      sections: [
        {
          heading: "Ce que mesure la consommation en kWh/100 km",
          paragraphs: [
            "La consommation est l'énergie utilisée pour parcourir 100 km. Plus elle est basse, moins la voiture demande d'énergie, donc d'argent, pour la même distance. Elle ne dépend pas que du véhicule : la vitesse, la température, le relief et le style de conduite la font varier fortement.",
            "Les valeurs publiées sont des valeurs d'homologation, mesurées dans des conditions normalisées. Elles servent à comparer des voitures entre elles, pas à prévoir votre consommation.",
          ],
        },
        {
          heading: "Consommation à la batterie ou à la prise",
          paragraphs: [
            "Deux consommations coexistent. La consommation « côté batterie » est l'énergie qui sort de la batterie ; EVExpert la calcule en divisant la capacité utile par l'autonomie WLTP. La consommation « à la prise » inclut les pertes de la recharge : elle est plus élevée, et c'est elle qui détermine la facture.",
            "Quand la source publie une consommation WLTP, elle correspond souvent à la prise. Voici l'écart pour cinq modèles du catalogue :",
          ],
          table: {
            caption: "Consommation WLTP publiée et consommation calculée côté batterie",
            headers: ["Modèle", "WLTP publiée (prise)", "Calculée côté batterie", "Écart"],
            rows: [r5, my, ev3, ec3, elroq].map((v) => [
              full(v),
              v.consumptionWltp === null ? "Non disponible" : `${formatNumber(v.consumptionWltp, 1)} kWh/100 km`,
              `${formatNumber(batteryConsumption100(v), 1)} kWh/100 km`,
              v.consumptionWltp === null ? "Non disponible" : `+${formatNumber((v.consumptionWltp / batteryConsumption100(v) - 1) * 100)} %`,
            ]),
          },
        },
        {
          heading: "Ce que montre l'écart sur tout le catalogue",
          paragraphs: [
            `Sur les ${pairs.length} versions pour lesquelles la source publie les deux valeurs, la consommation WLTP dépasse en médiane de ${formatNumber(medianGap)} % la consommation calculée côté batterie. Cet ordre de grandeur correspond à des pertes de charge : un rendement d'environ ${formatNumber(impliedEfficiency)} %, contre ${A.chargingEfficiency} % retenus par défaut par EVExpert pour ses calculs.`,
            "L'écart peut aussi refléter des différences de définition entre la capacité utile publiée et l'énergie réellement mesurée : lisez-le comme un ordre de grandeur, pas comme une mesure du rendement d'un modèle. Le rendement est un paramètre modifiable dans les calculateurs.",
          ],
        },
        {
          heading: "Les valeurs du catalogue",
          paragraphs: [
            `Côté batterie, la consommation calculée va de ${formatNumber(consValues.reduce((a, b) => Math.min(a, b)), 1)} kWh/100 km (${full(byCons[0])}) à ${formatNumber(consValues.reduce((a, b) => Math.max(a, b)), 1)} kWh/100 km (${full(byCons[N - 1])}), avec une médiane de ${formatNumber(median(consValues), 1)} kWh/100 km. Ces moyennes par carrosserie portent sur des échantillons de tailles différentes : elles décrivent le catalogue, pas le marché.`,
          ],
          chart: {
            title: "Consommation moyenne calculée par carrosserie (côté batterie)",
            unit: "kWh/100 km",
            bars: bodyCons.map((c) => ({ label: `${c.b[0].toUpperCase()}${c.b.slice(1)} (${c.n} versions)`, value: c.cons, display: formatNumber(c.cons, 1) })),
            caption: "Calcul EVExpert : capacité utile ÷ autonomie WLTP × 100, moyenne des versions de chaque carrosserie.",
          },
        },
        {
          heading: "Ce qui fait varier votre consommation",
          paragraphs: [],
          list: [
            "La vitesse : la résistance de l'air augmente avec le carré de la vitesse (voir l'autonomie sur autoroute).",
            "La température : le chauffage et une batterie froide augmentent la consommation en hiver.",
            "Le type de trajet : la ville et la récupération d'énergie au freinage sont plus favorables que l'autoroute.",
            "Le poids, les pneus, le relief et les équipements, qui jouent à la marge mais s'additionnent.",
          ],
        },
        {
          heading: "Convertir la consommation en euros",
          paragraphs: [
            `Le coût aux 100 km est la consommation à la prise multipliée par le prix du kWh. Avec les hypothèses d'EVExpert (rendement ${A.chargingEfficiency} %, ${formatNumber(A.homePrice, 2)} €/kWh à domicile), la ${full(r5)} revient à environ ${formatEuro(costPer100km(r5, A.homePrice), 2)} aux 100 km en conditions WLTP. Remplacez ces hypothèses par les vôtres dans le calculateur de coût aux 100 km.`,
          ],
        },
      ],
      relatedTools: ["/outils/cout-100-km", "/outils/autonomie-voiture-electrique", "/outils/cout-recharge-voiture-electrique"],
      relatedGuides: ["cout-100-km-voiture-electrique", "autonomie-autoroute", "autonomie-hiver", "wltp-definition", "calculer-autonomie-reelle"],
      relatedVehicleIds: [byCons[0].id, byCons[1].id, byCons[2].id],
      faq: [
        {
          question: "Quelle est une consommation normale pour une voiture électrique ?",
          answer: `Dans le catalogue, la consommation calculée côté batterie va de ${formatNumber(consValues.reduce((a, b) => Math.min(a, b)), 1)} à ${formatNumber(consValues.reduce((a, b) => Math.max(a, b)), 1)} kWh/100 km en conditions d'homologation. En usage réel, prévoyez davantage, surtout à 130 km/h et en hiver.`,
        },
        {
          question: "Pourquoi ma consommation est-elle plus élevée que celle annoncée ?",
          answer: "Les valeurs annoncées sont mesurées en laboratoire, sans relief ni vent, à température contrôlée. Vitesse élevée, froid, chauffage et trajets courts augmentent la consommation réelle.",
        },
      ],
      sources: [SOURCES.evdb, SOURCES.wltp],
    },

    {
      slug: "recharger-sur-prise-domestique",
      category: "recharge",
      title: "Recharger sur une prise domestique : combien de temps, et à quelles conditions ?",
      description:
        "Durée de recharge sur une prise ordinaire pour quatre modèles du catalogue, kilomètres récupérés par nuit et précautions avant un usage régulier.",
      publishedAt: GUIDE_DATE,
      updatedAt: GUIDE_DATE,
      readingTime: 6,
      intro:
        "Recharger sur une prise ordinaire est possible et parfois suffisant, mais c'est lent et cela sollicite l'installation pendant des heures. Voici les durées réelles pour quelques modèles du catalogue, et les précautions à prendre.",
      sections: [
        {
          heading: "Quelle puissance sur une prise ordinaire ?",
          paragraphs: [
            "Une prise domestique délivre du courant monophasé en 230 V. La puissance dépend de l'intensité : P = U × I, soit environ 2,3 kW à 10 A et 3,7 kW à 16 A.",
            "En pratique, le câble fourni avec la voiture limite souvent l'intensité, autour de 8 à 10 A selon les modèles, soit environ 1,8 à 2,3 kW. Consultez la notice de votre câble : c'est lui, et l'état de l'installation, qui fixent la puissance réellement disponible.",
            "Pour comparer : une wallbox monophasée peut atteindre 7,4 kW (32 A) et une wallbox triphasée 11 kW (16 A par phase).",
          ],
        },
        {
          heading: "Combien de temps pour recharger ?",
          paragraphs: [
            `Recharge de 10 à 80 % (calcul EVExpert, rendement ${A.chargingEfficiency} %). La puissance utilisée est la plus faible entre la borne et le chargeur du véhicule :`,
          ],
          chart: {
            title: `${full(r5)} : durée d'une recharge de 10 à 80 %`,
            unit: "",
            bars: [2.3, 3.7, 7.4, 11].map((kw) => {
              const m = acChargeMinutes(r5, kw).minutes;
              return { label: `${formatNumber(kw, 1)} kW${kw === 2.3 ? " (prise ordinaire)" : ""}`, value: m, display: minutesToHuman(m) };
            }),
            caption: "Calcul EVExpert, en supposant que la puissance indiquée est effectivement disponible pendant toute la charge.",
          },
          table: {
            caption: "Durée d'une recharge de 10 à 80 % selon la puissance disponible (calcul EVExpert)",
            headers: ["Modèle", "Batterie utile", "Sur 2,3 kW", "Sur 3,7 kW", "Sur 7,4 kW"],
            rows: socketModels.map((v) => [
              full(v),
              `${formatNumber(v.batteryUsable, 1)} kWh`,
              ...[2.3, 3.7, 7.4].map((kw) => minutesToHuman(acChargeMinutes(v, kw).minutes)),
            ]),
          },
        },
        {
          heading: "Ce qu'une nuit permet de récupérer",
          paragraphs: [
            `À 2,3 kW pendant 10 heures, l'énergie stockée est d'environ ${formatNumber(nightKwh, 1)} kWh. La ${full(r5)}, dont la consommation calculée est de ${formatNumber(batteryConsumption100(r5), 1)} kWh/100 km, récupère ainsi environ ${formatNumber(Math.round(nightKm(r5) / 5) * 5)} km WLTP ; la ${name(my)}, environ ${formatNumber(Math.round(nightKm(my) / 5) * 5)} km.`,
            `Sur 8 heures, la ${name(r5)} récupère environ ${formatNumber(Math.round(eightHourKm(r5) / 5) * 5)} km WLTP. En hiver, ou à vitesse élevée, la distance réelle est plus courte : voir le guide sur l'autonomie.`,
          ],
        },
        {
          heading: "À quelles conditions ?",
          paragraphs: [
            "Une recharge dure des heures à courant élevé : une prise ancienne, un branchement usé ou une rallonge inadaptée peuvent chauffer. Avant d'en faire un usage régulier :",
          ],
          list: [
            "Faites contrôler l'installation par un électricien qualifié : circuit, protection, état de la prise.",
            "Évitez les rallonges et les multiprises, sauf modèle explicitement prévu pour cet usage par son fabricant.",
            "Branchez le câble à fond et vérifiez de temps en temps que la prise ne chauffe pas ; en cas de doute, arrêtez la charge.",
            "Suivez la notice de la voiture et du câble : certaines voitures permettent de limiter l'intensité de charge.",
          ],
        },
        {
          heading: "Quand la prise suffit, et quand passer à une borne",
          paragraphs: [
            "La prise ordinaire convient à un usage régulier de courts trajets quotidiens, à une résidence secondaire ou à un dépannage. Dès que le kilométrage quotidien augmente, que la batterie est grande ou que l'hiver relève la consommation, une wallbox devient plus confortable.",
            "Pour choisir entre les deux, voir le comparatif [recharge à domicile ou borne publique](/guides/recharge-domicile-ou-borne-publique).",
          ],
        },
      ],
      relatedTools: ["/outils/temps-recharge", "/outils/puissance-borne-recharge", "/outils/cout-recharge-voiture-electrique"],
      relatedGuides: ["puissance-borne-7-11-22-kw", "cout-borne-recharge-domicile", "recharge-domicile-ou-borne-publique", "temps-recharge-voiture-electrique"],
      relatedVehicleIds: [r5.id, ec3.id, my.id],
      faq: [
        {
          question: "Peut-on recharger tous les jours sur une prise domestique ?",
          answer: "C'est techniquement possible si l'installation est en bon état et adaptée, mais la charge dure de nombreuses heures à courant élevé. Faites contrôler votre installation par un électricien avant un usage quotidien.",
        },
        {
          question: "Combien coûte une recharge sur prise domestique ?",
          answer: `Le coût dépend du prix du kWh, pas de la puissance de la prise. À ${formatNumber(A.homePrice, 2)} €/kWh (hypothèse EVExpert), une recharge de 10 à 80 % de la ${name(r5)} revient à environ ${formatEuro(chargeCost(r5, A.homePrice, 10, 80).cost, 2)}.`,
        },
      ],
      sources: [SOURCES.avere, SOURCES.servicePublic, SOURCES.enedis, SOURCES.evdb],
    },
  ];
}
