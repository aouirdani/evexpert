/**
 * Titres et descriptions pour les résultats de recherche. Le H1 reste le titre éditorial ;
 * ici, une version plus courte pour la balise <title> (≈ 50 caractères avant le suffixe « | EVExpert »)
 * et, quand la description éditoriale dépasse ~160 caractères, une meta description resserrée.
 */
export const EDITORIAL_META: Record<string, { metaTitle?: string; metaDescription?: string }> = {
  // Guides
  "calculer-autonomie-reelle": {
    metaTitle: "Calculer l'autonomie réelle d'une voiture électrique",
    metaDescription: "Méthode pas à pas pour estimer l'autonomie réelle : capacité utile, consommation, vitesse et température, avec des exemples chiffrés.",
  },
  "autonomie-hiver": {
    metaTitle: "Autonomie en hiver d'une voiture électrique",
    metaDescription: "Chauffage, batterie froide, air plus dense : pourquoi l'autonomie baisse en hiver, comment la limiter, et une estimation chiffrée pour trois modèles.",
  },
  "autonomie-autoroute": {
    metaTitle: "Autonomie d'une voiture électrique sur autoroute",
    metaDescription: "Pourquoi l'autonomie chute à 130 km/h, une estimation pour trois modèles et comment planifier ses arrêts de recharge sur un long trajet.",
  },
  "wltp-definition": {
    metaTitle: "WLTP : définition et ce que mesure le cycle",
    metaDescription: "Le WLTP, la procédure d'homologation des autonomies : le cycle en chiffres, la différence avec l'usage réel et avec la consommation.",
  },
  "batterie-brute-batterie-utile": {
    metaTitle: "Batterie brute ou utile : la différence",
    metaDescription: "Capacité brute, capacité utile : ce que chacune mesure, laquelle utiliser pour calculer l'autonomie, avec les modèles du catalogue.",
  },
  "combien-coute-recharge-domicile": { metaTitle: "Coût d'une recharge à domicile : le calcul" },
  "puissance-borne-7-11-22-kw": { metaTitle: "Borne 7,4, 11 ou 22 kW : laquelle choisir ?" },
  "recharge-ac-ou-dc": {
    metaTitle: "Recharge AC ou DC : la différence",
    metaDescription: "Courant alternatif ou continu : où s'effectue la conversion, pourquoi la recharge rapide est en DC, et l'effet sur la puissance et le prix.",
  },
  "temps-recharge-voiture-electrique": { metaTitle: "Temps de recharge d'une voiture électrique" },
  "fonctionnement-borne-de-recharge": { metaTitle: "Comment fonctionne une borne de recharge" },
  "puissance-recharge-dc": { metaTitle: "Puissance de recharge DC : pic ou moyenne ?" },
  "recharger-a-80-pourcent": { metaTitle: "Faut-il charger à 80 % une voiture électrique ?" },
  "preserver-batterie-voiture-electrique": {
    metaTitle: "Préserver la batterie d'une voiture électrique",
    metaDescription: "Les bons réflexes pour ralentir le vieillissement de la batterie : niveaux de charge, chaleur, recharge rapide, selon la chimie.",
  },
  "recharge-domicile-ou-borne-publique": { metaTitle: "Recharge à domicile ou borne publique" },
  "cout-borne-recharge-domicile": { metaTitle: "Prix d'une borne de recharge à domicile" },
  "cout-100-km-voiture-electrique": {
    metaTitle: "Coût aux 100 km d'une voiture électrique",
    metaDescription: "Calculer le coût aux 100 km d'une électrique selon le tarif de recharge, avec exemples chiffrés pour plusieurs modèles et comparaison à l'essence.",
  },
  "voiture-electrique-vs-essence": {
    metaTitle: "Voiture électrique ou essence : coût réel",
    metaDescription: "Électrique ou essence : comparer l'énergie, l'entretien, l'assurance et la dépréciation, avec un exemple chiffré et les hypothèses à ajuster.",
  },
  "calculer-tco-voiture-electrique": { metaTitle: "Calculer le TCO d'une voiture électrique" },
  "choisir-voiture-electrique-selon-usage": {
    metaTitle: "Choisir sa voiture électrique selon son usage",
    metaDescription: "Ville, famille, longs trajets : quels critères comptent selon votre usage pour choisir une voiture électrique, avec des repères chiffrés.",
  },
  "choisir-premiere-voiture-electrique": {
    metaTitle: "Choisir sa première voiture électrique",
    metaDescription: "Recharge, trajets, budget total, lecture d'une fiche technique, neuf ou occasion : les six questions à se poser avant d'acheter.",
  },
  // Blog
  "voitures-electriques-les-plus-sobres": {
    metaTitle: "Voitures électriques les plus sobres du catalogue",
    metaDescription: "Consommation calculée de chaque version du catalogue : quelles électriques consomment le moins aux 100 km, et l'effet sur le coût d'usage.",
  },
  "recharge-rapide-temps-10-80": { metaTitle: "Recharge rapide : les temps 10-80 % du catalogue" },
  "autonomie-wltp-repartition-catalogue": { metaTitle: "Autonomie WLTP : répartition des modèles" },
  "lfp-ou-nmc-ce-que-montrent-les-donnees": {
    metaTitle: "Batteries LFP ou NMC : ce que montrent les données",
    metaDescription: "LFP contre NMC : les différences de chimie et une comparaison chiffrée des versions du catalogue, avec les limites de l'exercice.",
  },
  "recharge-ac-puissances-acceptees": { metaTitle: "Recharge AC : puissances acceptées par les voitures" },
  "comment-evexpert-construit-sa-base": { metaTitle: "Comment EVExpert construit sa base de véhicules" },
  // Nouveaux contenus
  "kw-kwh-difference-voiture-electrique": { metaTitle: "kW ou kWh : la différence en voiture électrique" },
  "consommation-voiture-electrique-kwh-100-km": { metaTitle: "Consommation d'une voiture électrique (kWh/100 km)" },
  "recharger-sur-prise-domestique": { metaTitle: "Recharger sur une prise domestique : durée et limites" },
  "garantie-batterie-ce-que-disent-les-donnees": { metaTitle: "Garantie batterie : ce que disent les données" },
};
