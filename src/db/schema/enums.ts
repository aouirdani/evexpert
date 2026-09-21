import { pgEnum } from "drizzle-orm/pg-core";

/** Nature de la source (qui publie la donnée). */
export const sourceTypeEnum = pgEnum("source_type", [
  "manufacturer",
  "official",
  "public",
  "specialized",
  "evexpert",
  "other",
]);

/** Nature de la donnée (comment elle a été obtenue). */
export const dataTypeEnum = pgEnum("data_type", [
  "official",
  "third_party",
  "calculated",
  "estimated",
]);

export const entityTypeEnum = pgEnum("entity_type", [
  "brand",
  "model",
  "vehicle_version",
  "charging_spec",
  "vehicle_price",
]);

export const bodyTypeEnum = pgEnum("body_type", [
  "citadine",
  "compacte",
  "berline",
  "SUV",
  "break",
  "monospace",
  "utilitaire",
  "coupé",
]);

export const driveTypeEnum = pgEnum("drive_type", ["FWD", "RWD", "AWD"]);

export const batteryChemistryEnum = pgEnum("battery_chemistry", ["LFP", "NMC"]);

/** Marché d'un prix : un prix d'un autre marché n'est JAMAIS un prix français. */
export const marketEnum = pgEnum("market", [
  "FR",
  "EU",
  "DE",
  "NL",
  "BE",
  "ES",
  "IT",
  "UK",
]);

export const priceTypeEnum = pgEnum("price_type", [
  "list",
  "promotional",
  "estimated",
]);
