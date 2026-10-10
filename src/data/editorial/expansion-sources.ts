import type { Source } from "@/types";

export const EXPANSION_DATE = "2026-10-08";

/** Sources consultées pour les nouveaux dossiers ; les sources existantes gardent leur date. */
export const EXPANSION_SOURCES = {
  sale: {
    label: "Service Public — vendre ou donner son véhicule : documents, contrôle technique et HistoVec",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1707",
    accessed: EXPANSION_DATE,
  },
  teslaHealth: {
    label: "Tesla — manuel Model 3 : état de santé de la batterie haute tension et limites du test",
    url: "https://www.tesla.com/ownersmanual/model3/fr_fr/GUID-B9807218-7291-4F68-9AFF-7C525CF498F3.html",
    accessed: EXPANSION_DATE,
  },
  bydHistory: {
    label: "BYD Europe — présentation du groupe et origine à Shenzhen",
    url: "https://www.byd.com/eu/blog/Hello-we-are-BYD",
    accessed: EXPANSION_DATE,
  },
  mgParent: {
    label: "MG Motor Europe — MG et sa société mère SAIC Motor",
    url: "https://news.mgmotor.eu/fr/decouvrez-notre-societe-mere-saic-motor/",
    accessed: EXPANSION_DATE,
  },
} satisfies Record<string, Source>;
