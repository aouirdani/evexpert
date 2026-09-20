// Core domain types for the EVExpert platform.

export type BodyType =
  | "citadine"
  | "berline"
  | "SUV"
  | "break"
  | "monospace"
  | "utilitaire"
  | "coupé";

export type ConnectorType = "Type 2" | "CCS" | "CHAdeMO";

export interface Vehicle {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  modelSlug: string;
  version: string;
  versionSlug: string;
  year: number;
  bodyType: BodyType;
  /** Prix indicatif en euros (TTC, hors bonus). */
  price: number;
  /** Capacité totale de la batterie en kWh. */
  batteryCapacity: number;
  /** Capacité utile de la batterie en kWh. */
  usableBatteryCapacity: number;
  /** Autonomie WLTP annoncée en km. */
  rangeWltp: number;
  /** Consommation WLTP en kWh/100 km. */
  consumptionWltp: number;
  /** Estimation d'autonomie réelle (mixte) en km. */
  realWorldRange: number;
  /** Puissance de charge AC maximale en kW. */
  chargingAC: number;
  /** Puissance de charge DC maximale en kW. */
  chargingDC: number;
  /** Pic de puissance DC observé en kW. */
  dcPeakPower: number;
  /** Temps de charge rapide 10-80% en minutes. */
  chargingTime10to80: number;
  /** Accélération 0-100 km/h en secondes. */
  acceleration: number;
  /** Puissance moteur en ch. */
  power: number;
  /** Couple en Nm. */
  torque: number;
  /** Poids à vide en kg. */
  weight: number;
  /** Volume de coffre en litres. */
  trunkVolume: number;
  seats: number;
  /** Dimensions L x l x h en mm. */
  dimensions: { length: number; width: number; height: number };
  /** Garantie véhicule (texte). */
  warranty: string;
  /** Garantie batterie (texte). */
  batteryWarranty: string;
  /** Nature/origine de la donnée. */
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  /** true = données d'exemple non officielles. */
  isDemo: boolean;
  /** Description éditoriale. */
  summary: string;
}

export interface ChargingStation {
  id: string;
  operator: string;
  network: string;
  location: string;
  city: string;
  department: string;
  latitude: number;
  longitude: number;
  power: number;
  connector: ConnectorType;
  price: string;
  access: string;
  openingHours: string;
  source: string;
  lastUpdated: string;
  isDemo: boolean;
}

export type ArticleCategory =
  | "Actualités"
  | "Guides"
  | "Comparatifs"
  | "Recharge"
  | "Batterie"
  | "Technologie"
  | "Marché";

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
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
  relatedVehicleIds?: string[];
  faq?: FaqItem[];
  sources?: Source[];
}

export interface Guide {
  slug: string;
  category: "achat" | "recharge" | "autonomie" | "batterie" | "entretien";
  title: string;
  description: string;
  updatedAt: string;
  readingTime: number;
  intro: string;
  sections: ArticleSection[];
  relatedTools?: string[];
  faq?: FaqItem[];
  sources?: Source[];
}

export interface Tool {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}
