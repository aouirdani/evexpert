import type { Article, ArticleSection, Vehicle } from "@/types";
import { acChargeMinutes, averageDcPower, batteryConsumption100 } from "@/lib/vehicle-calcs";
import { formatNumber, minutesToHuman } from "@/lib/format";
import { fullName } from "@/data/guides/helpers";
import { EXPANSION_DATE, EXPANSION_SOURCES } from "./expansion-sources";

const value = (n: number | null | undefined, unit: string, digits = 0) =>
  n === null || n === undefined ? "Non disponible" : `${formatNumber(n, digits)} ${unit}`;

/** Sous-ensemble documenté de marques, pas un champ d'origine ajouté au catalogue. */
export function buildChineseVehiclesArticle(vehicles: Vehicle[]): Article {
  const selected = vehicles.filter((v) => v.brandSlug === "byd" || v.brandSlug === "mg");
  const find = (id: string) => selected.find((v) => v.id === id);
  const dolphin = find("byd-dolphin-surf-43-2-kwh-comfort");
  const urban = find("mg-mg4-urban-comfort-long-range");
  const atto = find("byd-atto-3-evo-rwd-design");
  const mgs5 = find("mg-mgs5-ev-64-kwh");
  const seal = find("byd-seal-82-5-kwh-awd-excellence");
  const note = (v: Vehicle | undefined) => v
    ? `${fullName(v)} : ${value(v.batteryUsable, "kWh", 1)} utiles, ${value(v.rangeWltp, "km")} WLTP, ${value(v.chargingAC, "kW")} AC et un temps 10–80 % de ${value(v.chargingTime10to80, "min")}, selon ${v.source.name}.`
    : "La version d'exemple n'est pas présente dans le catalogue chargé ; ses chiffres ne sont pas reconstitués.";
  const dc = selected.filter((v) => v.chargingTime10to80 !== null && v.chargingTime10to80 > 0);
  const sections: ArticleSection[] = [
    {
      heading: "Ce que recouvre ici l'expression « voitures électriques chinoises »",
      paragraphs: [
        "Nous retenons ici BYD et MG pour examiner deux gammes de groupes chinois présentes dans EVExpert. BYD décrit ses origines à Shenzhen dans sa présentation officielle. MG appartient à SAIC Motor, comme l'explique sa société mère dans la source citée. Cette sélection concerne les groupes et marques ; elle ne constitue pas une certification du lieu de fabrication de chaque exemplaire.",
        "Il faut séparer la marque, son propriétaire et l'usine qui produit une voiture donnée. Un badge n'identifie pas à lui seul le pays d'assemblage, l'origine de tous les composants ou le statut d'un véhicule dans un dispositif français. Notre catalogue ne collecte pas ces informations par numéro d'identification. Nous ne les déduisons donc ni du nom ni des caractéristiques de la batterie.",
        `Le périmètre comprend ${selected.length} version${selected.length === 1 ? "" : "s"} BYD et MG dans le catalogue chargé. Il ne représente pas l'offre complète en France, les stocks des distributeurs ou toutes les marques chinoises. Pour les gammes séparées, consultez les pages [BYD](/voitures-electriques/byd) et [MG](/voitures-electriques/mg). L'intérêt de cette analyse est de rapprocher les mêmes critères entre ces deux ensembles, avec une méthode et des limites communes.`,
      ],
    },
    {
      heading: "Partir de la carrosserie et de la version exacte",
      paragraphs: [
        "Une citadine, une compacte, une berline et un SUV ne répondent pas aux mêmes contraintes. Avant de comparer l'autonomie, éliminez les formats incompatibles avec votre stationnement, vos passagers et vos bagages. Le tableau rapproche les dimensions et le coffre publiés dans notre source ; il ne mesure ni la facilité d'accès aux places arrière ni la place réelle de vos objets.",
        "Vérifiez aussi la version : le nom MG4, par exemple, ne suffit pas pour identifier la voiture étudiée ici. Le catalogue présente une Urban Comfort Long Range précise, à distinguer des autres générations et configurations. La même prudence s'applique à l'Atto 3 Evo et aux différentes Seal. Ne reportez pas ces chiffres sur une annonce au nom voisin sans confirmer sa batterie et sa transmission.",
      ],
      table: {
        caption: "Versions BYD et MG présentes dans EVExpert — données spécialisées, pas une liste de stocks français",
        headers: ["Version", "Carrosserie", "Longueur", "Coffre", "Batterie utile", "WLTP"],
        rows: selected.map((v) => [fullName(v), v.bodyType, value(v.dimensions.length, "mm"), value(v.trunkVolume, "L"), value(v.batteryUsable, "kWh", 1), value(v.rangeWltp, "km")]),
      },
    },
    {
      heading: "Dolphin Surf et MG4 Urban : deux façons de couvrir les trajets quotidiens",
      paragraphs: [
        note(dolphin),
        note(urban),
        "Pour ces deux formats, la question utile est la marge laissée après votre plus long trajet fréquent et la place disponible dans votre garage. Comparez les dimensions à votre accès, puis la batterie à votre rythme de recharge. Une capacité supplémentaire peut permettre d'espacer les branchements, mais elle ne rend pas une voiture plus simple à stationner ni plus adaptée à tous les usages.",
        "Le rapport capacité utile sur autonomie WLTP permet de calculer une consommation de comparaison côté batterie. Il ne s'agit pas de la consommation officielle à la prise ni d'un essai en ville. Utilisez-le pour lire les différences entre versions, puis préparez un scénario réel avec votre trajet. La finition, le confort et les équipements nécessaires restent à essayer : ces lignes techniques ne donnent pas une note de qualité.",
      ],
    },
    {
      heading: "Atto 3 Evo et MGS5 : comparer deux SUV sans réduire le choix au WLTP",
      paragraphs: [
        note(atto),
        note(mgs5),
        "Ces deux SUV invitent à comparer simultanément énergie embarquée et durée de recharge. Une fenêtre de 10 à 80 % ajoute 70 % de la capacité utile : une durée identique ne représenterait donc pas nécessairement la même quantité d'énergie. Le tableau DC ci-dessous explicite ce point. Nous ne convertissons pas cette énergie en kilomètres autoroutiers sans ajouter une hypothèse de consommation.",
        "Le volume de coffre et la longueur donnent d'autres repères, à vérifier avec les objets que vous transportez. Les litres publiés ne décrivent pas toujours une mesure parfaitement comparable ni la forme du chargement. Pour une famille, contrôlez les places, les accès et l'installation de vos équipements pendant un essai. Pour les longs trajets, ajoutez la disponibilité de votre recharge habituelle au comparatif : le véhicule ne décide pas seul du temps de voyage.",
      ],
    },
    {
      heading: "La Seal : distinguer grande batterie, transmission et besoin réel",
      paragraphs: [
        note(seal),
        "La Seal de cette analyse correspond à une version AWD Excellence. Le lecteur doit donc comparer ce véhicule précis, sans généraliser sa batterie, sa transmission ou sa recharge à toutes les Seal. Une berline peut convenir à un trajet régulier tout en imposant un autre accès au coffre qu'un SUV ; les seules valeurs de volume et de longueur ne tranchent pas cette question.",
        "Une batterie plus grande ne donne pas une hausse proportionnelle de l'autonomie si la consommation change aussi. Regardez le rapport entre énergie utile et distance WLTP, puis le temps nécessaire pour récupérer une fenêtre de charge. Le résultat est un compromis à examiner selon votre usage, pas une récompense automatique à la plus grosse batterie. La puissance moteur ou la transmission ne remplacent pas non plus l'évaluation du confort, des pneus et du coût total.",
      ],
    },
    {
      heading: "LFP ou NMC : ne pas attribuer une chimie à une nationalité",
      paragraphs: [
        "La chimie est une caractéristique de version, pas un attribut universel des voitures d'un pays. Le tableau conserve le champ publié par notre source et affiche une absence lorsqu'il n'est pas renseigné. La présence de LFP ou de NMC ne suffit pas à conclure à une meilleure autonomie, une meilleure fiabilité ou un usage autorisé de la charge à 100 %.",
        "Pour la conduite quotidienne, suivez la notice du véhicule sur les niveaux de charge recommandés et le stockage. Pour la longévité, ne transformez pas le nom d'une chimie en prévision individuelle : température, gestion du pack et usage interviennent aussi. Notre [analyse LFP et NMC](/blog/lfp-ou-nmc-ce-que-montrent-les-donnees) traite cette question séparément. Ici, nous cherchons surtout à éviter qu'une comparaison entre marques masque des différences entre versions.",
      ],
      table: {
        headers: ["Version", "Chimie source", "Consommation calculée côté batterie"],
        rows: selected.map((v) => [fullName(v), v.chemistry ?? "Non disponible", value(batteryConsumption100(v), "kWh/100 km", 1)]),
      },
    },
    {
      heading: "Recharge à domicile : comparer la borne avec le plafond AC",
      paragraphs: [
        "Une borne plus puissante que le chargeur embarqué ne raccourcit pas automatiquement la recharge AC. Notre calcul prend le minimum entre puissance de borne et limite du véhicule, puis un rendement hypothétique de 90 %. Il porte sur la fenêtre 10–80 %, à puissance constante : c'est un temps théorique pour comparer les solutions, pas une mesure de votre installation.",
        "Regardez les colonnes ensemble. Quand le véhicule plafonne déjà avant 11 kW, choisir une borne de 22 kW n'apporte pas le gain suggéré par son étiquette. Quand les deux acceptent 11 kW, la capacité à recharger explique une partie des différences de durée. La puissance réellement disponible dans votre logement et les éventuels autres usages électriques restent à examiner avant de choisir une borne.",
        "Pour vérifier une configuration ou changer de véhicule, utilisez [l'outil de comparaison des puissances de borne](/outils/puissance-borne-recharge). Il prolonge le tableau sans créer une seconde calculatrice dans cette page. Ne présumez pas qu'une option de charge est installée sur une voiture visitée parce que le modèle existe avec cette option : relevez la configuration exacte sur ses documents.",
      ],
      table: {
        caption: "Calcul EVExpert, 10–80 %, rendement 90 %, puissance effective plafonnée au chargeur AC",
        headers: ["Version", "AC maximale", "Borne 7,4 kW", "Borne 11 kW", "Borne 22 kW"],
        rows: selected.map((v) => [fullName(v), value(v.chargingAC, "kW", 1), ...[7.4, 11, 22].map((kw) => minutesToHuman(acChargeMinutes(v, kw, 10, 80, 90).minutes))]),
      },
    },
    {
      heading: "Recharge rapide : rapprocher durée et énergie ajoutée",
      paragraphs: [
        "Le pic de puissance DC n'est pas maintenu pendant toute la session. Nous conservons le temps 10–80 % publié et calculons séparément l'énergie utile de cette fenêtre, puis une puissance moyenne équivalente. La formule est capacité utile × 0,70 ÷ durée en heures. Cette moyenne est déduite des données de la source ; elle ne représente pas la consommation mesurée au compteur de la borne.",
        "Comparez d'abord les quantités d'énergie et les durées, puis les conséquences sur votre trajet. Un arrêt court pour une petite batterie peut ajouter moins d'énergie qu'un arrêt un peu plus long pour une grande batterie. Sans consommation de trajet commune, cela ne suffit pas à classer les kilomètres récupérés. Le calcul évite de confondre une puissance maximale séduisante avec un arrêt réellement adapté à votre besoin.",
        "Les conditions de la borne, la température du pack, son niveau de départ et sa préparation peuvent modifier le résultat vécu. Les temps publiés ne garantissent donc pas la même session sur chaque aire. Si votre choix dépend de longs trajets fréquents, consultez aussi le [guide autonomie autoroute](/guides/autonomie-autoroute), puis vérifiez la recharge de la version envisagée dans des conditions proches des vôtres.",
      ],
      table: {
        caption: "DC : pic et temps publiés ; énergie et moyenne équivalente calculées par EVExpert",
        headers: ["Version", "Pic DC source", "10–80 % source", "Énergie utile ajoutée", "Moyenne calculée"],
        rows: dc.map((v) => [fullName(v), value(v.chargingDC, "kW"), value(v.chargingTime10to80, "min"), value(v.batteryUsable * 0.7, "kWh", 2), value(averageDcPower(v), "kW", 1)]),
      },
    },
    {
      heading: "Prix et qualité : ce que ces données ne permettent pas de classer",
      paragraphs: [
        selected.some((v) => v.price !== null)
          ? "Des prix sont renseignés pour certaines versions du catalogue chargé, mais cette analyse ne les utilise pas pour établir un classement qualité-prix. Une comparaison complète exige un périmètre, des équipements et des conditions de vente cohérents."
          : "Aucun prix France n'est renseigné pour ces versions dans le catalogue chargé. Nous ne publions donc pas de classement « moins chère » ou « qualité-prix ». Le volume de recherche d'une expression ne fournit pas les données manquantes, et un tarif d'un autre pays ne devient pas un prix français par simple conversion.",
        "Demandez un devis pour la configuration réellement proposée et examinez les équipements, les frais et les conditions. Si vous comparez achat et leasing, une mensualité isolée ne suffit pas : durée, kilométrage, apport et restitution changent le budget. Le calculateur TCO peut accueillir vos hypothèses de possession, mais EVExpert ne possède pas ici une base d'offres financières ou de prix de revente.",
        "Les tableaux ne mesurent pas la fiabilité, la qualité du logiciel, l'insonorisation ou la disponibilité des pièces. Une valeur absente n'est pas un mauvais résultat, et une valeur élevée n'est pas une note globale. Réservez ces questions à un essai, à des documents appropriés et aux interlocuteurs du réseau. L'appartenance à un groupe ne permet pas de répondre à la place du véhicule et de son contrat.",
      ],
    },
    {
      heading: "Méthodologie EVExpert et limites des données",
      paragraphs: [
        "La sélection utilise les identifiants de marques BYD et MG du catalogue chargé. Les caractéristiques, les versions et les dates de relevé viennent de la même couche de données que les fiches ; aucun champ d'origine n'a été ajouté aux véhicules. Les pages constructeur citées servent uniquement à expliquer le choix des groupes. Les sources exactes des fiches sont listées à la fin, avec leur date de collecte.",
        "La consommation calculée vaut capacité utile ÷ autonomie WLTP × 100, côté batterie. Les durées AC utilisent 70 % de la capacité utile, un rendement de 90 % et le plafond du chargeur embarqué. Pour le DC, l'énergie est 70 % de la capacité utile et la moyenne est déduite du temps publié. Les valeurs manquantes restent « Non disponible » ; une durée DC absente n'est pas remplacée par une extrapolation du pic.",
        "Les arrondis servent à la lecture et ne créent pas une précision de mesure supplémentaire. Nous ne combinons pas une consommation réelle d'un essai externe avec une autonomie WLTP pour produire un faux résultat homogène. La [méthodologie du site](/methodologie) explique ces natures de données ; les tableaux doivent être lus dans leur cadre, sans transformer un calcul reproductible en essai routier.",
      ],
    },
    {
      heading: "Passer de la comparaison à une vérification en France",
      paragraphs: [
        "Retenez deux ou trois configurations qui correspondent à vos trajets, puis ouvrez le [comparateur de véhicules](/comparer) pour examiner les autres critères. Demandez au distributeur la notice française, les conditions de garantie applicables, les éléments inclus dans la livraison et les possibilités de prise en charge près de chez vous. Ces réponses portent sur le véhicule et votre contrat, pas seulement sur la réputation d'une marque.",
        "Lors d'un essai, contrôlez l'installation de vos bagages, l'accès aux places, les fonctions que vous utiliserez et la compatibilité de la recharge prévue. Vérifiez également que la version proposée correspond à celle que vous avez comparée. Une petite différence de nom peut recouvrir une génération ou un équipement différent. Les pages techniques sont un outil de préparation ; elles ne remplacent pas cette vérification concrète.",
        "La conclusion peut être un compromis plutôt qu'un gagnant : un format adapté à la ville, une fenêtre de recharge compatible avec votre logement, ou moins de temps passé aux arrêts sur un trajet régulier. Formulez ce besoin avant de décider. Cette analyse décrit un sous-ensemble d'EVExpert et ses différences mesurables ; elle ne recommande pas une marque pour son origine et ne prétend pas établir la meilleure voiture du marché.",
      ],
    },
  ];

  return {
    slug: "voitures-electriques-chinoises-byd-mg",
    title: "Voitures électriques chinoises : BYD et MG dans le catalogue EVExpert",
    metaTitle: "Voitures électriques chinoises : comparer BYD et MG",
    description: "BYD et MG comparées avec les données EVExpert : formats, batteries, autonomie et recharge. Méthode, sources et limites, sans classement qualité-prix.",
    category: "Marché électrique",
    author: "Aymane Ouirdani",
    publishedAt: EXPANSION_DATE,
    updatedAt: EXPANSION_DATE,
    readingTime: 11,
    excerpt: "Une analyse croisée des BYD et MG de notre base : énergie embarquée, recharge et usages, sans confondre origine, prix et qualité.",
    intro: "Comparer des voitures électriques chinoises demande d'abord de choisir les versions et les critères utiles : format, batterie, autonomie et recharge. Cette analyse rapproche les BYD et MG présentes dans EVExpert avec des chiffres sourcés et des calculs explicites. Elle distingue le groupe auquel appartient une marque du lieu de fabrication d'un exemplaire, puis montre les compromis que les données permettent réellement d'examiner. Aucun prix absent, score de fiabilité ou classement qualité-prix n'est inventé.",
    sections,
    relatedTools: ["/outils/puissance-borne-recharge", "/outils/tco-voiture-electrique"],
    relatedGuides: ["choisir-voiture-electrique-selon-usage", "recharge-ac-ou-dc", "puissance-recharge-dc"],
    relatedVehicleIds: selected.slice(0, 5).map((v) => v.id),
    sources: [EXPANSION_SOURCES.bydHistory, EXPANSION_SOURCES.mgParent, ...selected.map((v) => ({ label: `${v.source.name} — ${fullName(v)}`, url: v.source.url, accessed: v.source.lastUpdated }))],
  };
}
