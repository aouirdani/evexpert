import type { Source } from "@/types";

/**
 * Sources externes citées sur le site. Chaque URL a été ouverte avec succès
 * à la date `accessed`. Aucune source n'est citée sans avoir été consultée.
 */
const accessed = "2026-09-21";

export const SOURCES = {
  evdb: {
    label: "EV Database — caractéristiques techniques des voitures électriques",
    url: "https://ev-database.org/",
    accessed,
  },
  wltp: {
    label: "Transport Policy — Worldwide Harmonized Light Vehicles Test Procedure (WLTP)",
    url: "https://www.transportpolicy.net/standard/international-light-duty-worldwide-harmonized-light-vehicles-test-procedure-wltp/",
    accessed,
  },
  wltc: {
    label: "DieselNet — Worldwide Harmonized Light Vehicles Test Cycle (WLTC)",
    url: "https://dieselnet.com/standards/cycles/wltp.php",
    accessed,
  },
  irve: {
    label: "data.gouv.fr — Base nationale des IRVE (infrastructures de recharge pour véhicules électriques)",
    url: "https://www.data.gouv.fr/datasets/base-nationale-des-irve-infrastructures-de-recharge-pour-vehicules-electriques",
    accessed,
  },
  irveTransport: {
    label: "transport.data.gouv.fr — Fichier consolidé des bornes de recharge",
    url: "https://transport.data.gouv.fr/datasets/fichier-consolide-des-bornes-de-recharge-pour-vehicules-electriques",
    accessed,
  },
  servicePublic: {
    label: "Service-public.fr — informations et démarches pour les particuliers",
    url: "https://www.service-public.fr/",
    accessed,
  },
  ecologie: {
    label: "Ministère de la Transition écologique — mobilité et véhicules électriques",
    url: "https://www.ecologie.gouv.fr/",
    accessed,
  },
  enedis: {
    label: "Enedis — raccordement, compteur et puissance souscrite",
    url: "https://www.enedis.fr/",
    accessed,
  },
  avere: {
    label: "Avere-France — association nationale pour le développement de la mobilité électrique",
    url: "https://www.avere-france.org/",
    accessed,
  },
  cre: {
    label: "Commission de régulation de l'énergie (CRE) — marché de l'électricité",
    url: "https://www.cre.fr/",
    accessed,
  },
  geotabBattery2026: {
    label: "Geotab — étude de santé des batteries de véhicules électriques (janvier 2026, plus de 22 700 véhicules)",
    url: "https://www.geotab.com/uk/press-release/ev-battery-health-degradation-fast-charging-study/",
    accessed: "2026-10-02",
  },
  gtr22: {
    label: "HORIBA — UN GTR n° 22, durabilité des batteries embarquées (exigences minimales de performance)",
    url: "https://www.horiba.com/aut/mobility/applications/emissions-performance-and-durability/exhaust-emissions/gtr-no22/",
    accessed: "2026-10-02",
  },
  euro7: {
    label: "EUR-Lex — Euro 7, émissions et durabilité des batteries (règlement (UE) 2024/1257) : synthèse",
    url: "https://eur-lex.europa.eu/ES/legal-content/summary/vehicle-emissions-and-battery-durability-euro-7-technical-requirements-and-certification-rules.html",
    accessed: "2026-10-02",
  },
  bnefBatteryPrice2025: {
    label: "BloombergNEF — « New record lows for battery prices » (enquête 2025 sur le prix des packs)",
    url: "https://about.bnef.com/insights/clean-transport/new-record-lows-for-battery-prices/",
    accessed: "2026-10-02",
  },
  mac4everBatterie: {
    label: "Mac4Ever Auto — Combien coûte le remplacement d'une batterie de voiture électrique ? Enquête auprès des marques (8 décembre 2024)",
    url: "https://www.mac4ever.com/auto/184682-combien-coute-le-remplacement-d-une-batterie-de-voiture-electrique-on-a-enquete-aupres-des-marques",
    accessed: "2026-10-02",
  },
  cnil: {
    label: "CNIL — cookies et traceurs, données personnelles",
    url: "https://www.cnil.fr/",
    accessed,
  },
} satisfies Record<string, Source>;

/** Sources listées sur la page /sources, avec leur rôle sur EVExpert. */
export const SOURCE_ROLES: { source: Source; usage: string }[] = [
  { source: SOURCES.evdb, usage: "Caractéristiques techniques des véhicules du catalogue (source spécialisée, non constructeur)." },
  { source: SOURCES.wltp, usage: "Définition et principes du cycle d'homologation WLTP." },
  { source: SOURCES.wltc, usage: "Paramètres du cycle WLTC (durée, distance, vitesses)." },
  { source: SOURCES.irve, usage: "Jeu de données ouvert des points de recharge en France (référence pour une future carte des bornes)." },
  { source: SOURCES.servicePublic, usage: "Renvoi vers les informations officielles pour les démarches (copropriété, aides, fiscalité)." },
  { source: SOURCES.ecologie, usage: "Renvoi vers les informations officielles sur la mobilité électrique." },
  { source: SOURCES.enedis, usage: "Puissance souscrite, compteur et raccordement à domicile." },
  { source: SOURCES.avere, usage: "Ressources de l'association nationale sur la mobilité électrique." },
  { source: SOURCES.cre, usage: "Fonctionnement du marché de l'électricité et des tarifs." },
  { source: SOURCES.geotabBattery2026, usage: "Taux moyen de dégradation des batteries et facteurs d'influence (guide sur la durée de vie de la batterie)." },
  { source: SOURCES.gtr22, usage: "Seuils minimaux de capacité restante du GTR 22 de l'ONU, référence de la durabilité des batteries." },
  { source: SOURCES.euro7, usage: "Existence et calendrier des exigences européennes de durabilité des batteries (Euro 7)." },
  { source: SOURCES.bnefBatteryPrice2025, usage: "Prix moyen des packs de batterie, par région (guide sur le prix d'une batterie)." },
  { source: SOURCES.mac4everBatterie, usage: "Relevé journalistique de devis de remplacement de batterie auprès de marques et de concessions." },
  { source: SOURCES.cnil, usage: "Règles sur les cookies et le consentement." },
];
