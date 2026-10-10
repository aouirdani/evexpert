import type { Guide } from "@/types";
import { formatNumber } from "@/lib/format";
import { EXPANSION_DATE, EXPANSION_SOURCES } from "@/data/editorial/expansion-sources";
import type { GuideContext } from "./helpers";
import { fullName } from "./helpers";

/** Exemples pédagogiques recalculés depuis le catalogue, jamais des diagnostics d'occasion. */
export function buildOccasionGuides({ vehicles }: GuideContext): Guide[] {
  const examples = ["tesla-model-3-rwd", "hyundai-kona-electric-65-kwh", "peugeot-e-208-50-kwh"]
    .flatMap((id) => vehicles.filter((v) => v.id === id));

  return [{
    slug: "acheter-voiture-electrique-occasion",
    category: "achat",
    title: "Acheter une voiture électrique d'occasion : les vérifications avant de signer",
    metaTitle: "Voiture électrique d'occasion : points à vérifier",
    description: "Documents, rapport de santé batterie, recharge et essai : une méthode pour examiner une électrique d'occasion, avec des scénarios chiffrés et leurs limites.",
    publishedAt: EXPANSION_DATE,
    updatedAt: EXPANSION_DATE,
    readingTime: 10,
    intro: "Avant d'acheter une voiture électrique d'occasion, vérifiez trois choses séparément : l'identité et l'historique de l'exemplaire, l'état documenté de sa batterie, puis son comportement sur vos trajets et à la recharge. Une autonomie affichée au tableau de bord ne remplace pas ce dossier. EVExpert propose une méthode pour rassembler les preuves, poser les bonnes questions au vendeur et mesurer la marge d'énergie dont vous aurez besoin, sans inventer de prix ni diagnostiquer une voiture à distance.",
    sections: [
      {
        heading: "Identifier l'exemplaire avant de comparer les chiffres",
        paragraphs: [
          "Commencez par rapprocher l'annonce, le certificat d'immatriculation et le numéro d'identification du véhicule. Demandez la désignation exacte de la version, la date de première mise en circulation et les documents qui permettent de retrouver sa batterie et ses capacités de recharge. Le nom commercial seul ne suffit pas : un même modèle peut avoir changé de batterie, de chargeur embarqué ou de connecteur au fil des générations.",
          "Les fiches du catalogue décrivent les versions collectées, pas toutes les voitures qui portent un nom voisin. Par exemple, notre Kona Electric correspond à une version précise ; ses données ne doivent pas être reportées sur un Kona plus ancien sans vérifier la correspondance. Utilisez le catalogue pour préparer les questions, puis le dossier du véhicule et le constructeur pour confirmer les réponses. Si la version n'est pas dans EVExpert, une valeur absente reste inconnue.",
          "Photographiez les documents utiles avec l'accord du vendeur et notez les points qui ne concordent pas. Une différence d'appellation peut avoir une explication simple, mais elle doit être résolue avant de calculer un budget ou une autonomie. Ne choisissez pas une fiche approchante uniquement parce qu'elle donne un résultat rassurant : la qualité de toutes les étapes suivantes dépend de cette première identification.",
        ],
      },
      {
        heading: "Construire un dossier de preuves, pas une impression générale",
        paragraphs: [
          "Demandez le carnet ou l'historique d'entretien disponible, les factures, les rapports de contrôle et les interventions sur la batterie ou la recharge. Une batterie remplacée n'est pas automatiquement un défaut ni un avantage : il faut connaître la date, la pièce installée, la raison de l'intervention et la garantie applicable. Distinguez ce qui est écrit de ce qui est seulement déclaré pendant la visite.",
          "En France, Service Public détaille les documents de cession, le certificat de situation administrative et le partage d'informations via HistoVec. Pour une voiture de plus de quatre ans vendue à un particulier, vérifiez notamment le contrôle technique de moins de six mois ; les règles de contre-visite et les exceptions doivent être relues sur cette source officielle. HistoVec et les documents administratifs ne constituent pas un diagnostic de batterie.",
        ],
        table: {
          caption: "Grille de vérification EVExpert : des preuves complémentaires, sans note globale",
          headers: ["Pièce ou observation", "Ce qu'elle aide à vérifier", "Ce qu'elle ne garantit pas"],
          rows: [
            ["Identité et version", "Correspondance de la voiture avec les caractéristiques recherchées", "État actuel de la batterie"],
            ["HistoVec et documents de cession", "Historique administratif et informations disponibles", "Absence de toute panne future"],
            ["Factures et interventions", "Opérations documentées et dates", "Historique complet si des pièces manquent"],
            ["Rapport batterie daté", "Résultat d'une méthode sur cet exemplaire", "Autonomie sur tous les trajets"],
            ["Essai routier et de recharge", "Fonctionnement dans les conditions de l'essai", "Puissance maximale en toute saison"],
          ],
        },
      },
      {
        heading: "Lire un SOH sans le confondre avec le niveau de charge",
        paragraphs: [
          "Le niveau de charge indique quelle part de l'énergie actuellement disponible reste dans la batterie. L'état de santé, souvent appelé SOH, cherche à caractériser sa capacité de rétention par rapport à une référence. Une voiture chargée à 90 % n'a donc pas nécessairement un SOH de 90 %. Demandez un rapport daté, rattaché à l'exemplaire, avec l'origine du diagnostic et une explication de la grandeur mesurée.",
          "Deux pourcentages provenant de méthodes différentes ne se comparent pas automatiquement. Regardez la référence utilisée, les conditions du test, les informations disponibles sur la batterie et l'identité de l'organisme qui produit le rapport. Une capture isolée sans date ni identification est moins exploitable qu'un document que le vendeur peut expliquer. Un résultat étonnant appelle une vérification par un professionnel ; EVExpert ne fixe pas de seuil universel d'achat acceptable.",
          "Le manuel Tesla Model 3 illustre cette distinction : il décrit une évaluation et, sur les véhicules compatibles, un test avec ses propres conditions. Tesla réserve ce test aux problèmes de rétention d'énergie et précise qu'il peut durer longtemps. Ce n'est pas une procédure universelle à lancer pendant chaque visite. Suivez le manuel de l'exemplaire ou demandez un diagnostic adapté, sans chercher à reproduire une manipulation prévue pour une autre voiture.",
        ],
      },
      {
        heading: "Traduire une capacité restante en marge pour vos trajets",
        paragraphs: [
          "Un pourcentage devient utile lorsqu'on le rapproche de votre besoin quotidien. Pour illustrer la méthode, nous partons des capacités utiles de trois versions du catalogue et retenons une hypothèse de 90 % de cette énergie. Ce coefficient n'est le SOH d'aucune voiture : c'est un scénario pédagogique, qui ne serait applicable à un rapport réel qu'après vérification de la même référence de capacité.",
          "Nous limitons ensuite l'usage à une fenêtre de charge allant de 80 à 10 %, soit 70 % de l'énergie restante, et supposons une consommation de 16 kWh/100 km. La distance calculée vaut capacité utile × 0,90 × 0,70 ÷ 16 × 100. Ces hypothèses ne sont ni des recommandations de charge universelles ni des mesures d'autonomie ; elles servent à rendre visible la marge disponible entre deux branchements.",
        ],
        table: {
          caption: "Scénario EVExpert : capacité retenue 90 %, fenêtre 80–10 %, consommation hypothétique 16 kWh/100 km",
          headers: ["Version de référence", "Capacité utile source", "Énergie retenue à 90 %", "Fenêtre utilisable", "Distance calculée"],
          rows: examples.map((v) => [
            fullName(v),
            `${formatNumber(v.batteryUsable, 1)} kWh`,
            `${formatNumber(v.batteryUsable * 0.9, 2)} kWh`,
            `${formatNumber(v.batteryUsable * 0.9 * 0.7, 2)} kWh`,
            `${formatNumber(v.batteryUsable * 0.9 * 0.7 / 16 * 100)} km`,
          ]),
        },
      },
      {
        heading: "Faire varier la consommation avant de conclure",
        paragraphs: [
          "La capacité ne détermine pas seule la distance. À énergie identique, passer de l'hypothèse de 16 à 20 kWh/100 km réduit la distance calculée de 20 %. Cette variation suffit à changer la faisabilité d'un trajet avec peu de possibilités de recharge. Elle montre pourquoi un SOH rassurant ne dispense pas d'examiner la vitesse, le froid, le relief et les conditions réelles de votre utilisation.",
          "Préparez deux besoins : votre plus long trajet fréquent et un scénario moins favorable. Notez la possibilité de recharger à destination, la réserve souhaitée et les détours acceptables. Une visite en ville au printemps ne répond pas à la question d'un trajet autoroutier en hiver. Le [guide autonomie hiver](/guides/autonomie-hiver) aide à identifier ces différences ; l'outil autonomie permet de comparer des hypothèses, sans certifier un exemplaire.",
          "Ne multipliez pas ensuite automatiquement une autonomie WLTP par un SOH pour présenter le résultat comme une nouvelle autonomie officielle. Cela mélangerait homologation, diagnostic et conditions d'usage. Notre scénario raisonne en énergie utile et en consommation choisie. Après l'achat, vos relevés de consommation et vos trajets répétés pourront affiner le budget de distance, avec des hypothèses qui correspondent vraiment à votre situation.",
        ],
      },
      {
        heading: "Vérifier la recharge AC et DC séparément",
        paragraphs: [
          "Organisez un essai de recharge compatible avec votre usage, avec l'accord du vendeur. Vérifiez que le câble et le connecteur conviennent, que la session démarre, que la voiture affiche une charge cohérente et que l'arrêt puis le débranchement suivent la procédure du véhicule. Une prise qui semble propre ne prouve pas que toute la chaîne fonctionne. Conservez les éventuelles alertes pour les faire examiner.",
          "L'essai AC concerne notamment votre recharge habituelle. Comparez la puissance de la borne au plafond du chargeur embarqué : une borne de 22 kW ne permet pas à une version limitée à 11 kW de charger à 22 kW. L'essai DC, si votre usage l'exige, vérifie une autre voie de charge. Le pic dépend du niveau de charge, de la température et de la borne ; une puissance observée basse n'établit pas à elle seule une panne.",
          "Le [comparateur des puissances de borne](/outils/puissance-borne-recharge) permet de préparer les durées attendues avec la bonne version. Pendant la visite, relevez la borne, la durée, les niveaux de charge et les messages affichés. Si une étape échoue, demandez un contrôle avant la décision. Ne tentez pas d'intervenir sur les éléments haute tension pour comprendre le problème.",
        ],
      },
      {
        heading: "Préparer un essai routier reproductible",
        paragraphs: [
          "Choisissez un trajet qui ressemble à votre usage et notez sa longueur, la météo, les niveaux de charge au départ et à l'arrivée, ainsi que la consommation affichée. Vérifiez le confort, les commandes, le freinage, les bruits et les alertes, comme pour tout véhicule. Pour une question technique ou un doute sur un choc sous la voiture, faites examiner l'exemplaire plutôt que d'en tirer une conclusion avec une fiche internet.",
          "Un petit essai ne mesure pas la capacité totale du pack. Les pourcentages arrondis, la température et le parcours peuvent modifier fortement un calcul extrapolé à partir de quelques kilomètres. Demander au vendeur de partir avec un niveau de charge convenu facilite la comparaison, mais ne transforme pas l'essai en certification. Séparez la consommation observée de la capacité retenue dans votre scénario.",
          "Vérifiez aussi les fonctions qui comptent pour vous : chauffage, climatisation, navigation, câble fourni et accès aux services de la voiture. Demandez comment le compte utilisateur sera transféré et quels abonnements éventuels restent nécessaires. Le catalogue ne renseigne pas les équipements et services de chaque exemplaire ; ce qui vous est indispensable doit être essayé ou confirmé dans le contrat de vente.",
        ],
      },
      {
        heading: "Obtenir les conditions de garantie de l'exemplaire",
        paragraphs: [
          "La durée publiée sur une fiche constitue un repère, pas la garantie restante de la voiture visitée. Retrouvez la date de départ, la limite de kilométrage, les exclusions et les conditions de transfert. Demandez quels éléments sont couverts et comment un défaut ou une perte de capacité est établi. Une garantie sur le véhicule et une garantie sur la batterie peuvent avoir des périmètres différents.",
          "Le [dossier sur les garanties batterie du catalogue](/blog/garantie-batterie-ce-que-disent-les-donnees) explique les limites des textes collectés. Pour une occasion, exigez la confirmation applicable au numéro d'identification de la voiture, surtout si la batterie a été remplacée ou si le véhicule vient d'un autre marché. EVExpert ne déduit ni la validité d'une couverture ni un droit à réparation à partir du nom du modèle.",
          "Demandez enfin si la batterie appartient au vendeur ou si un contrat distinct existe, et faites clarifier tout engagement qui continuerait après la vente. Le catalogue actuel ne contient pas ces contrats individuels. Si le vendeur annonce une couverture supplémentaire, obtenez son document complet : un nom commercial de garantie ne suffit pas à connaître franchise, exclusions ou interlocuteur en cas de problème.",
        ],
      },
      {
        heading: "Comparer le budget sans inventer une cote d'occasion",
        paragraphs: [
          "Utilisez le prix réellement proposé, un devis d'assurance et votre solution de recharge. Ajoutez les frais identifiés : pneus à remplacer, travaux éventuels pour recharger, entretien prévu ou équipement manquant. Le [calculateur de coût total de possession](/outils/tco-voiture-electrique) aide à comparer des hypothèses de durée et de kilométrage ; la revente reste une hypothèse, pas une cote issue d'EVExpert.",
          "Pour départager deux annonces, utilisez les mêmes trajets, tarifs d'énergie et durées de possession. Ne donnez pas à l'une un prix de revente optimiste et à l'autre une hypothèse pessimiste sans raison documentée. Faites plutôt varier les paramètres sensibles pour voir si votre conclusion résiste. Aucun tableau de ce guide ne classe des occasions par prix ni ne prédit le coût d'une panne.",
        ],
      },
      {
        heading: "Méthodologie et limites de cette vérification",
        paragraphs: [
          "EVExpert sépare trois niveaux : les caractéristiques d'une version, les documents de l'exemplaire et les scénarios calculés. Les capacités des exemples sont celles de nos fiches, avec leur source spécialisée et leur date de relevé. Les coefficients de 90 %, la fenêtre 80–10 % et les consommations de 16 ou 20 kWh/100 km sont des choix explicites de calcul. Ils ne proviennent pas d'un diagnostic d'occasion.",
          "La méthode ne mesure pas les cellules, ne certifie pas un SOH et ne contrôle pas l'historique complet. Elle ne permet pas de comparer la fiabilité de deux marques, de prévoir une panne ou de confirmer un contrat. Les prix, l'état et les documents d'un véhicule restent à recueillir pendant votre démarche. La [méthodologie EVExpert](/methodologie) détaille la distinction entre données publiées, calculées et estimées.",
          "Pour terminer la visite, classez les points en trois catégories : confirmé par un document ou un essai, encore à vérifier, incompatible avec votre besoin. Cette grille évite de compenser un manque de preuve par un bon chiffre d'autonomie. Un modèle adapté sur le papier peut être un exemplaire mal documenté ; inversement, une capacité restante plus faible peut suffire à un usage modeste si elle est correctement établie.",
        ],
        list: [
          "Avant de signer : identité et version rapprochées, historique demandé, conditions de cession relues sur Service Public.",
          "Batterie : rapport expliqué ou contrôle convenu, aucune autonomie du tableau de bord prise pour un diagnostic.",
          "Usage : trajet et recharge essayés, scénario moins favorable examiné, devis et hypothèses de budget conservés.",
          "Décision : questions non résolues écrites, engagements du vendeur documentés, vérification professionnelle lorsque nécessaire.",
        ],
      },
    ],
    relatedTools: ["/outils/autonomie-voiture-electrique", "/outils/tco-voiture-electrique", "/outils/puissance-borne-recharge"],
    relatedGuides: ["choisir-premiere-voiture-electrique", "duree-de-vie-batterie-voiture-electrique", "prix-batterie-voiture-electrique"],
    relatedVehicleIds: examples.map((v) => v.id),
    sources: [EXPANSION_SOURCES.sale, EXPANSION_SOURCES.teslaHealth, ...examples.map((v) => ({ label: `${v.source.name} — ${fullName(v)} (capacité de référence)`, url: v.source.url, accessed: v.source.lastUpdated }))],
  }];
}
