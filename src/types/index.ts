// Core domain types for the EVExpert platform.

export type BodyType =
  | "citadine"
  | "compacte"
  | "berline"
  | "SUV"
  | "break"
  | "monospace"
  | "utilitaire"
  | "coupé";

export type ConnectorType = "Type 2" | "CCS" | "CHAdeMO";

/**
 * Nature d'une donnée affichée sur EVExpert.
 * - official    : issue d'un document officiel (constructeur, autorité publique)
 * - specialized : issue d'une base spécialisée reconnue (ex. EV Database)
 * - calculated  : calculée par EVExpert à partir de données affichées
 * - estimated   : estimation EVExpert reposant sur des hypothèses explicites
 */
export type DataType = "official" | "specialized" | "calculated" | "estimated";

export interface DataSource {
  /** Nom lisible de la source. */
  name: string;
  /** URL de la fiche source (absolue). */
  url: string;
  dataType: DataType;
  /** Date (ISO) à laquelle EVExpert a relevé les données. */
  lastUpdated: string;
}

export type DriveType = "FWD" | "RWD" | "AWD";
export type BatteryChemistry = "LFP" | "NMC";

/**
 * Fiche véhicule. Toute valeur inconnue est `null` : on n'invente jamais
 * une donnée, l'interface affiche « Non disponible ».
 */
export interface Vehicle {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  modelSlug: string;
  version: string;
  versionSlug: string;
  /** Années de commercialisation telles que publiées par la source. */
  years: string;
  bodyType: BodyType;
  drive: DriveType;
  chemistry: BatteryChemistry | null;
  /** Capacité brute de la batterie (kWh). */
  batteryGross: number | null;
  /** Capacité utile de la batterie (kWh). */
  batteryUsable: number;
  /** Autonomie WLTP mixte (km), telle que publiée par la source. */
  rangeWltp: number;
  /** Consommation WLTP (kWh/100 km, énergie tirée du réseau) si publiée et cohérente. */
  consumptionWltp: number | null;
  /** Puissance maximale (kW). */
  powerKw: number;
  /** Puissance maximale (ch). */
  powerPs: number;
  torque: number | null;
  acceleration0to100: number | null;
  topSpeed: number | null;
  /** Puissance de charge AC maximale (kW). */
  chargingAC: number;
  /** Puissance de charge DC maximale (kW). */
  chargingDC: number | null;
  /** Temps de charge DC 10-80 % (min). */
  chargingTime10to80: number | null;
  dimensions: { length: number; width: number; height: number };
  weight: number | null;
  /** Coffre (L). */
  trunkVolume: number | null;
  trunkVolumeMax: number | null;
  seats: number;
  /** Garantie batterie, telle que publiée par la source. */
  batteryWarranty: string | null;
  /** Garantie véhicule : non collectée à ce stade. */
  warranty: string | null;
  /** Prix France TTC : non collecté à ce stade (voir /methodologie). */
  price: number | null;
  source: DataSource;
}

export type ArticleCategory =
  | "Nouveautés"
  | "Marché électrique"
  | "Recharge"
  | "Batteries"
  | "Prix"
  | "Technologie"
  | "Guides pratiques";

export interface ArticleTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface ArticleSection {
  heading?: string;
  /** Niveau de titre : 2 par défaut, 3 pour une sous-section. */
  level?: 2 | 3;
  paragraphs: string[];
  list?: string[];
  table?: ArticleTable;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Source {
  label: string;
  url: string;
  accessed: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  excerpt: string;
  intro: string;
  sections: ArticleSection[];
  relatedTools?: string[];
  relatedGuides?: string[];
  relatedVehicleIds?: string[];
  faq?: FaqItem[];
  sources?: Source[];
}

export interface Guide {
  slug: string;
  category: GuideCategory;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  intro: string;
  sections: ArticleSection[];
  relatedTools?: string[];
  relatedGuides?: string[];
  relatedVehicleIds?: string[];
  faq?: FaqItem[];
  sources?: Source[];
}

export type GuideCategory = "autonomie" | "recharge" | "batterie" | "coûts" | "achat" | "comprendre";

export interface Tool {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}
