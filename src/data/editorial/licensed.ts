import type { EditorialImage } from "@/types";

/**
 * Photographies sous licence libre compatible avec un usage commercial, enregistrées avec leur provenance.
 * Règles : sources autorisées = Unsplash (licence Unsplash, hors Unsplash+), Pexels, Pixabay pour les
 * images génériques ; Wikimedia Commons (licence vérifiée image par image) ou espaces presse des
 * constructeurs (conditions d'usage lues) pour un modèle précis. Jamais d'image récupérée sans licence
 * explicite. Chaque entrée garde l'URL source, l'auteur, la licence et son lien, la date de récupération.
 * Si aucune image libre ne convient à un contenu, il n'a pas d'entrée ici (voir docs/visuel-articles.md) :
 * on ne force pas.
 *
 * Fichiers préparés dans public/editorial/licences : JPEG 1600 × 900 (16:9, servi en AVIF/WebP par
 * next/image) et dérivé Open Graph 1200 × 630. Les clés sont les slugs des guides, des articles de blog
 * et des pages connecteurs (/recharge/[topic]). Les illustrations générées par IA (EDITORIAL_PHOTOS)
 * restent en place pour les contenus qui n'ont pas d'entrée ici ; une entrée ici les remplace.
 */

const RETRIEVED_AT = "2026-10-03";
const CROP = "Recadrage 16:9 (1600 × 900) et dérivé Open Graph 1200 × 630, recompression JPEG.";

interface Base {
  /** Nom des fichiers dans public/editorial/licences (sans extension). */
  file: string;
  author: string;
  /** Compte de l'auteur chez la source (Unsplash : @compte ; Commons : Utilisateur:nom). */
  user: string;
  alt: string;
  caption: string;
}

/** Photo Unsplash : `id` = fin de l'URL de la page de la photo. Licence Unsplash : crédit facultatif, affiché quand même. */
function unsplash(a: Base & { id: string }): EditorialImage {
  return {
    src: `/editorial/licences/${a.file}.jpeg`,
    share: `/editorial/licences/${a.file}-og.jpeg`,
    shareHeight: 630,
    width: 1600,
    height: 900,
    alt: a.alt,
    caption: a.caption,
    credit: {
      sourceName: "Unsplash",
      sourceUrl: `https://unsplash.com/photos/${a.id}`,
      author: a.author,
      authorUrl: `https://unsplash.com/@${a.user}`,
      license: "Licence Unsplash",
      licenseUrl: "https://unsplash.com/license",
      retrievedAt: RETRIEVED_AT,
      attributionRequired: false,
      modifications: CROP,
    },
  };
}

/** Fichier de Wikimedia Commons : licence relevée sur la page du fichier. CC BY / BY-SA : crédit obligatoire ; BY-SA : l'image recadrée reste sous la même licence. */
function commons(a: Base & { commonsFile: string; license: string; licenseUrl: string }): EditorialImage {
  const shareAlike = a.license.includes("BY-SA");
  const attributionRequired = a.license.includes("BY");
  return {
    src: `/editorial/licences/${a.file}.jpeg`,
    share: `/editorial/licences/${a.file}-og.jpeg`,
    shareHeight: 630,
    width: 1600,
    height: 900,
    alt: a.alt,
    caption: a.caption,
    credit: {
      sourceName: "Wikimedia Commons",
      sourceUrl: `https://commons.wikimedia.org/wiki/File:${a.commonsFile}`,
      author: a.author,
      authorUrl: `https://commons.wikimedia.org/wiki/User:${a.user}`,
      license: a.license,
      licenseUrl: a.licenseUrl,
      retrievedAt: RETRIEVED_AT,
      attributionRequired,
      modifications: shareAlike ? `${CROP} Image modifiée, diffusée ici sous la même licence (${a.license}).` : CROP,
    },
  };
}

export const EDITORIAL_LICENSED: Record<string, { image: EditorialImage; schemaAfter?: string }> = {
  "temps-recharge-voiture-electrique": {
    image: unsplash({
      file: "temps-recharge-voiture-electrique",
      id: "electric-vehicle-charging-with-cable-2jRNVr0ac7s",
      author: "Joel Heyd (compte Zaptec)",
      user: "zaptec",
      alt: "Main d'une personne qui enfonce le connecteur d'un câble de recharge dans la trappe latérale d'une voiture électrique blanche, en contre-jour.",
      caption: "Brancher le câble ne suffit pas à prévoir la durée : elle dépend de l'énergie à ajouter et de la puissance réellement disponible.",
    }),
  },
  "calculer-autonomie-reelle": {
    image: unsplash({
      file: "calculer-autonomie-reelle",
      id: "d0VoImxkPQg",
      author: "Daniel Tafjord",
      user: "danieltafjord",
      alt: "Combiné d'instruments numérique d'une voiture, avec une jauge de puissance graduée de 25 à 100 % et l'indication READY, vu depuis la place du conducteur.",
      caption: "L'autonomie affichée au tableau de bord est une estimation : elle s'ajuste à la conduite récente.",
    }),
  },
  "autonomie-hiver": {
    image: unsplash({
      file: "autonomie-hiver",
      id: "Og1UPq-1cZw",
      author: "Renato Mitra",
      user: "renatomitra",
      alt: "Petite voiture électrique de type Mini circulant sur une route enneigée au milieu d'une forêt couverte de neige.",
      caption: "Par temps froid, le chauffage et une batterie moins efficace font baisser l'autonomie.",
    }),
  },
  "autonomie-autoroute": {
    image: unsplash({
      file: "autonomie-autoroute",
      id: "J06f5D8i5d0",
      author: "Hyundai Motor Group",
      user: "hyundaimotorgroup",
      alt: "Hyundai IONIQ 5 de couleur claire vue de face sur une autoroute dégagée, avec un pont et un ciel bleu en arrière-plan.",
      caption: "À vitesse d'autoroute, la résistance de l'air domine la consommation : l'autonomie réelle est nettement sous le WLTP.",
    }),
    schemaAfter: "La physique en bref",
  },
  "combien-coute-recharge-domicile": {
    image: unsplash({
      file: "combien-coute-recharge-domicile",
      id: "LP9D8zD4Xmw",
      author: "dcbel",
      user: "privategrid",
      alt: "Borne de recharge domestique murale grise fixée sur un mur en bois, avec des câbles de charge enroulés de part et d'autre.",
      caption: "À domicile, le coût d'une recharge dépend du prix du kWh de votre contrat.",
    }),
    schemaAfter: "Exemples chiffrés",
  },
  "fonctionnement-borne-de-recharge": {
    image: unsplash({
      file: "fonctionnement-borne-de-recharge",
      id: "xfaYAsMV1p8",
      author: "CHUTTERSNAP",
      user: "chuttersnap",
      alt: "Prise de charge d'une voiture électrique avec un connecteur branché et un anneau lumineux bleu autour de la prise.",
      caption: "Avant de fournir de l'énergie, la borne et la voiture dialoguent : le courant n'est établi que si la connexion est correcte.",
    }),
    schemaAfter: "Le dialogue avec la voiture",
  },
  "recharger-a-80-pourcent": {
    image: unsplash({
      file: "recharger-a-80-pourcent",
      id: "JkTjKEVcckg",
      author: "JUICE",
      user: "juice_world",
      alt: "Voiture blanche branchée à une petite borne murale installée contre la façade vitrée d'un bâtiment, de nuit.",
      caption: "Sur un long trajet, s'arrêter à 80 % est souvent plus rapide que d'attendre la charge complète.",
    }),
    schemaAfter: "Deux raisons différentes de s'arrêter à 80 %",
  },
  "recharge-domicile-ou-borne-publique": {
    image: unsplash({
      file: "recharge-domicile-ou-borne-publique",
      id: "N2Td7KpIvYc",
      author: "Precious Madubuike",
      user: "preciousm",
      alt: "Voiture électrique noire en charge dans une rue de ville, avec un câble bleu branché sur son flanc arrière.",
      caption: "Sans prise à domicile, la recharge sur la voirie fait partie du calcul.",
    }),
  },
  "cout-borne-recharge-domicile": {
    image: unsplash({
      file: "cout-borne-recharge-domicile",
      id: "2n7ugRl1YsQ",
      author: "Joel Heyd (compte Zaptec)",
      user: "zaptec",
      alt: "Borne de recharge compacte et noire fixée sur un mur en lattes de bois, avec son câble enroulé en dessous.",
      caption: "Le prix d'une borne dépend surtout de l'installation, pas seulement de l'appareil.",
    }),
  },
  "kw-kwh-difference-voiture-electrique": {
    image: unsplash({
      file: "kw-kwh-difference-voiture-electrique",
      id: "0MKzwPmehRE",
      author: "Jon Moore",
      user: "thejmoore",
      alt: "Panneau de compteurs d'électricité alignés en rangées sur un mur, chacun avec son cadran rond.",
      caption: "Un compteur mesure une énergie en kWh ; le kW décrit une puissance à un instant donné.",
    }),
    schemaAfter: "Relier les deux : la durée de charge",
  },
  "calculer-tco-voiture-electrique": {
    image: unsplash({
      file: "calculer-tco-voiture-electrique",
      id: "djb1whucfBY",
      author: "StellrWeb",
      user: "stellrweb",
      alt: "Calculatrice à imprimante grise posée sur un fond jaune clair, vue de trois quarts.",
      caption: "Le coût total de possession additionne plusieurs postes sur toute la durée de détention.",
    }),
    schemaAfter: "La formule",
  },
  "choisir-voiture-electrique-selon-usage": {
    image: unsplash({
      file: "choisir-voiture-electrique-selon-usage",
      id: "3sF03nuyIS8",
      author: "Mehmet Talha Onuk",
      user: "mtonuk",
      alt: "Grande salle d'exposition vitrée d'une concession automobile avec plusieurs véhicules garés à l'intérieur.",
      caption: "Partez de votre usage plutôt que du modèle exposé : les critères de la fiche technique décident.",
    }),
  },
  "choisir-premiere-voiture-electrique": {
    image: unsplash({
      file: "choisir-premiere-voiture-electrique",
      id: "ahA57lQR1vg",
      author: "Vitalii Khodzinskyi",
      user: "khodzinskyi",
      alt: "Intérieur d'une voiture moderne vu depuis la place du conducteur, avec le volant et un grand écran tactile sur la console centrale.",
      caption: "Un essai sur vos trajets habituels apprend plus que n'importe quelle fiche technique.",
    }),
  },
  "duree-de-vie-batterie-voiture-electrique": {
    image: unsplash({
      file: "duree-de-vie-batterie-voiture-electrique",
      id: "lGrYPbLF4p4",
      author: "Bernd Dittrich",
      user: "hdbernd",
      alt: "Compartiment technique d'une voiture électrique, avec des câbles haute tension orange et des boîtiers de puissance.",
      caption: "La batterie perd de la capacité progressivement ; son rythme dépend surtout de la recharge, de la chaleur et de l'usage.",
    }),
  },
  "prix-batterie-voiture-electrique": {
    image: commons({
      file: "prix-batterie-voiture-electrique",
      commonsFile: "Nissan_Leaf_battery_pack_DC_03_2011_1629.jpg",
      author: "Mariordo (Mario Roberto Duran Ortiz)",
      user: "Mariordo",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      alt: "Pack de batterie de Nissan Leaf ouvert : des modules gris regroupés dans un boîtier métallique, reliés par des câbles orange.",
      caption: "Un pack se compose de modules ; selon le modèle, un module peut parfois être remplacé sans changer tout le pack.",
    }),
  },
  "voitures-electriques-les-plus-sobres": {
    image: unsplash({
      file: "voitures-electriques-les-plus-sobres",
      id: "3GbF9_BU5l8",
      author: "Madeline Liu",
      user: "madeline_sd",
      alt: "Tesla Model Y blanche roulant sur un pont d'autoroute au-dessus d'un lac, sous un ciel bleu nuageux.",
      caption: "La consommation se compare à conditions d'homologation identiques, pas à votre usage.",
    }),
  },
  "recharge-rapide-temps-10-80": {
    image: unsplash({
      file: "recharge-rapide-temps-10-80",
      id: "OWWnwU0cVnI",
      author: "YRKA PICTURED",
      user: "yrkapictured",
      alt: "Arrière d'une Hyundai IONIQ 6 en charge rapide de nuit, câble branché et station éclairée en arrière-plan.",
      caption: "La fenêtre de 10 à 80 % est le repère le plus utile pour comparer la recharge rapide.",
    }),
  },
  "recharge-ac-puissances-acceptees": {
    image: unsplash({
      file: "recharge-ac-puissances-acceptees",
      id: "9QzxkWxMUik",
      author: "Zaptec",
      user: "zaptec",
      alt: "Main branchant un câble de charge sur une borne murale blanche installée contre un mur de briques.",
      caption: "En AC, la puissance utilisée est la plus faible entre la borne et le chargeur de la voiture.",
    }),
  },
  "autonomie-wltp-repartition-catalogue": {
    image: unsplash({
      file: "autonomie-wltp-repartition-catalogue",
      id: "blun3m0HCpQ",
      author: "Dennis Cortés",
      user: "cortes",
      alt: "Tesla Model 3 sombre garée sur une aire de bord de route, devant des collines sèches et un ciel bleu.",
      caption: "L'autonomie WLTP est une mesure de laboratoire : elle sert à comparer, pas à prévoir un trajet.",
    }),
  },
  "lfp-ou-nmc-ce-que-montrent-les-donnees": {
    image: commons({
      file: "lfp-ou-nmc-ce-que-montrent-les-donnees",
      commonsFile: "Lithium-Ion_Battery_for_BMW_i3_-_Battery_Pack.JPG",
      author: "RudolfSimon",
      user: "RudolfSimon",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      alt: "Pack de batterie lithium-ion d'une BMW i3 présenté capot ouvert : des modules de cellules et leurs connexions métalliques.",
      caption: "Deux chimies, deux compromis : le catalogue ne permet pas de conclure sur la durée de vie.",
    }),
  },
  "type-2": {
    image: commons({
      file: "type-2",
      commonsFile: "Iec-type2-ccs-combo2-and-iec-type2-charging-connectors-side-by-side.jpg",
      author: "Paul Sladen",
      user: "Sladen",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      alt: "Deux prises de charge côte à côte, vues de face : à gauche un connecteur CCS Combo 2 avec deux grosses broches de courant continu en bas, à droite un connecteur Type 2.",
      caption: "À gauche le CCS Combo 2, à droite le Type 2 : le CCS ajoute les deux broches du bas pour le courant continu.",
    }),
  },
  "ccs": {
    image: commons({
      file: "ccs",
      commonsFile: "CCS_(Type2_Combo)_Charging_Plug.jpg",
      author: "Danilo Bargen",
      user: "Dbrgn",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      alt: "Connecteur CCS Combo 2 vu de face : la prise Type 2 en haut et les deux grosses broches de courant continu en bas.",
      caption: "Le CCS Combo 2 ajoute deux contacts de courant continu sous la prise Type 2.",
    }),
  },
  "chademo": {
    image: commons({
      file: "chademo",
      commonsFile: "CHAdeMO_Charging_Plug.jpg",
      author: "Danilo Bargen",
      user: "Dbrgn",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      alt: "Connecteur CHAdeMO vu de face : une prise ronde noire avec plusieurs alvéoles et deux grosses broches centrales claires.",
      caption: "Le CHAdeMO est un connecteur rond, distinct du Type 2 et du CCS.",
    }),
  },
};
