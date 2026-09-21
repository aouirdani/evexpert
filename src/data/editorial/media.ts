import type { EditorialImage } from "@/types";

/**
 * Schémas principaux des articles (public/editorial, générés par scripts/build-editorial-figures.py).
 * Chaque image explique un mécanisme ; le texte alternatif décrit le schéma, la légende rappelle
 * les chiffres importants : aucune information n'est présente uniquement dans l'image.
 */
const fig = (file: string, alt: string, caption: string): EditorialImage => ({
  src: `/editorial/${file}`,
  share: `/editorial/${file.replace(/\.svg$/, ".png")}`,
  width: 1200,
  height: 675,
  alt,
  caption,
});

export const EDITORIAL_HEROES: Record<string, EditorialImage> = {
  "recharge-ac-ou-dc": fig(
    "recharge-ac-dc-conversion.svg",
    "Schéma en deux lignes : en recharge AC, le courant alternatif traverse la borne puis le chargeur embarqué de la voiture, qui le convertit en courant continu pour la batterie ; en recharge DC, la borne convertit elle-même le courant et alimente directement la batterie.",
    "En AC, la conversion se fait dans la voiture ; en DC, elle se fait dans la borne.",
  ),
  "puissance-borne-7-11-22-kw": fig(
    "puissance-recharge-maillon-faible.svg",
    "Schéma : une borne de 22 kW et un chargeur embarqué limité à 11 kW ; la puissance réellement utilisée est de 11 kW, la plus petite des deux.",
    "Exemple illustratif : la puissance utilisée est celle du maillon le plus faible, ici 11 kW sur une borne de 22 kW.",
  ),
  "batterie-brute-batterie-utile": fig(
    "batterie-brute-batterie-utile.svg",
    "Schéma d'une batterie : la capacité brute englobe toutes les cellules ; la capacité utile est la partie centrale que la voiture laisse utiliser, encadrée de deux réserves.",
    "La capacité utile est celle qui sert à calculer l'autonomie et le temps de charge. Schéma illustratif : la part de réserve varie selon les modèles.",
  ),
  "recharger-a-80-pourcent": fig(
    "courbe-de-charge-10-80.svg",
    "Courbe illustrative de la puissance de charge selon le niveau de la batterie : elle monte vite, culmine entre 10 et 20 %, puis diminue, nettement au-delà de 80 %. La fenêtre de 10 à 80 % est surlignée.",
    "Courbe illustrative : la puissance diminue nettement au-delà de 80 %. La courbe réelle dépend de chaque modèle.",
  ),
  "puissance-recharge-dc": fig(
    "puissance-dc-pic-et-moyenne.svg",
    "Courbe illustrative de la puissance de charge DC : le pic annoncé est atteint brièvement autour de 20 % de batterie, la puissance moyenne sur la fenêtre 10-80 % est nettement plus basse.",
    "Le pic annoncé n'est atteint que brièvement ; c'est la puissance moyenne sur 10-80 % qui détermine la durée. Courbe illustrative.",
  ),
  "kw-kwh-difference-voiture-electrique": fig(
    "kw-kwh-reservoir-debit.svg",
    "Deux panneaux : le kWh mesure l'énergie stockée, comme le contenu d'un réservoir ; le kW mesure la puissance, comme un débit. En dessous : durée ≈ énergie ÷ puissance, par exemple 60 kWh ÷ 11 kW ≈ 5 h 30.",
    "Durée ≈ énergie (kWh) ÷ puissance (kW). Exemple : 60 kWh ÷ 11 kW ≈ 5 h 30, hors pertes de charge et limites de la voiture.",
  ),
  "fonctionnement-borne-de-recharge": fig(
    "fonctionnement-borne-de-recharge.svg",
    "Quatre étapes d'une recharge : branchement, dialogue entre la borne et la voiture, autorisation avec verrouillage du connecteur, puis charge.",
    "Déroulé simplifié : branchement, dialogue, autorisation, charge. Le détail dépend du type de borne et du réseau.",
  ),
  "combien-coute-recharge-domicile": fig(
    "cout-recharge-trois-etapes.svg",
    "Calcul du coût d'une recharge en trois étapes : énergie à stocker, division par le rendement de charge pour obtenir l'énergie tirée du réseau, puis multiplication par le prix du kWh. Exemple : 42 kWh, 46,7 kWh, environ 11,67 €.",
    "Exemple avec 60 kWh utiles, une recharge de 10 à 80 %, un rendement de 90 % et 0,25 €/kWh : 42 kWh stockés, environ 46,7 kWh tirés du réseau, environ 11,67 €.",
  ),
  "calculer-tco-voiture-electrique": fig(
    "tco-postes-de-cout.svg",
    "Le coût total de possession additionne la dépréciation, l'énergie, l'assurance, l'entretien et les pneus, et les taxes, en déduisant les aides ; on le divise ensuite par le nombre de mois ou de kilomètres.",
    "Les postes du TCO : ce qui s'additionne, ce qui se déduit, et la division par la durée ou le kilométrage pour comparer deux voitures.",
  ),
  "wltp-definition": fig(
    "cycle-wltc-quatre-phases.svg",
    "Les quatre phases du cycle WLTC : basse (589 s, jusqu'à 56,5 km/h), moyenne (433 s, jusqu'à 76,6 km/h), haute (455 s, jusqu'à 97,4 km/h) et très haute (323 s, jusqu'à 131,3 km/h), soit 1 800 secondes.",
    "Cycle WLTC classe 3 : basse 589 s (56,5 km/h max), moyenne 433 s (76,6 km/h), haute 455 s (97,4 km/h), très haute 323 s (131,3 km/h) ; 1 800 s au total.",
  ),
  "autonomie-autoroute": fig(
    "resistance-air-vitesse.svg",
    "Courbe de la résistance de l'air selon la vitesse, en indice 100 à 90 km/h : environ 149 à 110 km/h et environ 209 à 130 km/h, soit plus du double entre 90 et 130 km/h.",
    "Indice 100 à 90 km/h : environ 149 à 110 km/h et 209 à 130 km/h. La résistance de l'air croît avec le carré de la vitesse ; résistance au roulement non représentée.",
  ),
};

/**
 * Photographies éditoriales (public/editorial/*.jpeg, 1376 × 768, JPEG progressif ~180-230 Ko servi
 * en AVIF/WebP par next/image). Images d'ILLUSTRATION générées par IA, véhicules et lieux
 * génériques : jamais utilisées sur une fiche véhicule (elles pourraient passer pour le modèle
 * concerné). `share` = dérivé 1200 × 630 pour og:image, twitter:image et JSON-LD.
 *
 * Hiérarchie : la photo est l'image principale (sous l'introduction) ; le schéma technique du même
 * article (EDITORIAL_HEROES) descend dans le corps, après la section `schemaAfter`, là où il explique.
 */
const photo = (file: string, alt: string, caption: string): EditorialImage => ({
  src: `/editorial/${file}.jpeg`,
  share: `/editorial/${file}-og.jpeg`,
  shareHeight: 630,
  width: 1376,
  height: 768,
  alt,
  caption: `${caption} Image d'illustration générée par IA, véhicule et lieu génériques.`,
});

export const EDITORIAL_PHOTOS: Record<string, { image: EditorialImage; schemaAfter?: string }> = {
  "recharge-ac-ou-dc": {
    image: photo(
      "recharge-borne-dc-rapide",
      "Voiture électrique bleu nuit branchée à une borne de recharge rapide sous l'auvent d'une aire de service, en fin de journée.",
      "En recharge rapide, la conversion du courant se fait dans la borne.",
    ),
    schemaAfter: "Recharge DC : le chargeur est dans la borne",
  },
  "puissance-recharge-dc": {
    image: photo(
      "recharge-station-haute-puissance",
      "Voiture électrique en recharge sur une station haute puissance, avec plusieurs bornes alignées au second plan.",
      "Une station haute puissance : la puissance annoncée n'est atteinte que sur une partie de la charge.",
    ),
    schemaAfter: "Un pic, pas une constante",
  },
  "puissance-borne-7-11-22-kw": {
    image: photo(
      "recharge-wallbox-garage",
      "Voiture électrique branchée à une wallbox murale dans un garage résidentiel, avec un vélo posé contre le mur du fond.",
      "À domicile, la puissance utilisée est celle du maillon le plus faible entre la wallbox et la voiture.",
    ),
    schemaAfter: "Le maillon le plus faible fixe la vitesse",
  },
  "recharger-sur-prise-domestique": {
    image: photo(
      "recharge-prise-domestique",
      "Voiture électrique rechargée par un câble relié à une prise extérieure, devant une maison contemporaine.",
      "Sur une prise ordinaire, la recharge est lente : elle se compte en heures.",
    ),
  },
  "batterie-brute-batterie-utile": {
    image: photo(
      "batterie-pack-technique",
      "Pack batterie haute tension d'une voiture électrique posé sur un support dans un atelier, cellules et câblage orange visibles.",
      "Un pack batterie : la capacité brute est celle des cellules, la capacité utile est celle que la voiture laisse utiliser.",
    ),
    schemaAfter: "Deux capacités, deux définitions",
  },
  "preserver-batterie-voiture-electrique": {
    image: photo(
      "batterie-dessous-vehicule",
      "Dessous d'une voiture électrique sur un pont élévateur : le pack batterie occupe le plancher entre les essieux.",
      "Le pack batterie occupe le plancher de la voiture : ses habitudes de charge et de température déterminent son vieillissement.",
    ),
  },
};
