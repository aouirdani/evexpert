import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { batteryChemistryEnum, bodyTypeEnum, driveTypeEnum } from "./enums";
import { sources } from "./sources";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

const slug = () => text().notNull();

export const brands = pgTable(
  "brands",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: slug(),
    name: text().notNull(),
    /** Pays d'origine : NULL tant qu'il n'est pas sourcé. */
    country: text(),
    logoUrl: text("logo_url"),
    ...timestamps,
  },
  (t) => [
    unique("brands_slug_unique").on(t.slug),
    check("brands_slug_format", sql`${t.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
  ],
).enableRLS();

export const models = pgTable(
  "models",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    slug: slug(),
    name: text().notNull(),
    description: text(),
    ...timestamps,
  },
  (t) => [
    unique("models_brand_slug_unique").on(t.brandId, t.slug),
    check("models_slug_format", sql`${t.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
    index("models_brand_idx").on(t.brandId),
  ],
).enableRLS();

/**
 * Version = finition + motorisation précise. Toute donnée inconnue est NULL.
 * Les données de recharge sont dans `charging_specs`, les prix dans `vehicle_prices`
 * (pas de doublon ni de « prix courant » dupliqué ici).
 */
export const vehicleVersions = pgTable(
  "vehicle_versions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    modelId: integer("model_id")
      .notNull()
      .references(() => models.id, { onDelete: "restrict" }),
    slug: slug(),
    name: text().notNull(),
    yearFrom: smallint("year_from"),
    yearTo: smallint("year_to"),
    isActive: boolean("is_active").notNull().default(true),

    bodyType: bodyTypeEnum("body_type").notNull(),
    drive: driveTypeEnum().notNull(),
    batteryChemistry: batteryChemistryEnum("battery_chemistry"),

    batteryGrossKwh: numeric("battery_gross_kwh", { precision: 6, scale: 1 }),
    batteryUsableKwh: numeric("battery_usable_kwh", { precision: 6, scale: 1 }),

    wltpRangeKm: integer("wltp_range_km"),
    wltpConsumptionKwh100km: numeric("wltp_consumption_kwh_100km", { precision: 5, scale: 1 }),

    powerKw: integer("power_kw"),
    powerPs: integer("power_ps"),
    torqueNm: integer("torque_nm"),
    acceleration0100S: numeric("acceleration_0_100_s", { precision: 4, scale: 1 }),
    topSpeedKmh: integer("top_speed_kmh"),

    lengthMm: integer("length_mm"),
    widthMm: integer("width_mm"),
    heightMm: integer("height_mm"),
    weightKg: integer("weight_kg"),
    trunkL: integer("trunk_l"),
    trunkMaxL: integer("trunk_max_l"),
    seats: smallint(),

    vehicleWarrantyYears: smallint("vehicle_warranty_years"),
    batteryWarrantyYears: smallint("battery_warranty_years"),
    batteryWarrantyKm: integer("battery_warranty_km"),
    /** Texte de garantie tel que publié par la source (conditions « ou », miles…). */
    batteryWarrantyText: text("battery_warranty_text"),

    ...timestamps,
  },
  (t) => [
    unique("vehicle_versions_model_slug_unique").on(t.modelId, t.slug),
    check("vehicle_versions_slug_format", sql`${t.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
    check(
      "vehicle_versions_battery_usable_le_gross",
      sql`${t.batteryUsableKwh} IS NULL OR ${t.batteryGrossKwh} IS NULL OR ${t.batteryUsableKwh} <= ${t.batteryGrossKwh}`,
    ),
    check("vehicle_versions_battery_positive", sql`(${t.batteryGrossKwh} IS NULL OR ${t.batteryGrossKwh} > 0) AND (${t.batteryUsableKwh} IS NULL OR ${t.batteryUsableKwh} > 0)`),
    check("vehicle_versions_wltp_range_range", sql`${t.wltpRangeKm} IS NULL OR ${t.wltpRangeKm} BETWEEN 30 AND 1500`),
    check("vehicle_versions_wltp_consumption_range", sql`${t.wltpConsumptionKwh100km} IS NULL OR ${t.wltpConsumptionKwh100km} BETWEEN 5 AND 60`),
    check("vehicle_versions_years_order", sql`${t.yearFrom} IS NULL OR ${t.yearTo} IS NULL OR ${t.yearFrom} <= ${t.yearTo}`),
    check("vehicle_versions_years_range", sql`(${t.yearFrom} IS NULL OR ${t.yearFrom} BETWEEN 2000 AND 2100) AND (${t.yearTo} IS NULL OR ${t.yearTo} BETWEEN 2000 AND 2100)`),
    check("vehicle_versions_power_positive", sql`(${t.powerKw} IS NULL OR ${t.powerKw} > 0) AND (${t.powerPs} IS NULL OR ${t.powerPs} > 0)`),
    check("vehicle_versions_seats_range", sql`${t.seats} IS NULL OR ${t.seats} BETWEEN 1 AND 9`),
    index("vehicle_versions_model_idx").on(t.modelId),
  ],
).enableRLS();

/** Spécifications de recharge d'une version (1 ligne par version). */
export const chargingSpecs = pgTable(
  "charging_specs",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    vehicleVersionId: integer("vehicle_version_id")
      .notNull()
      .references(() => vehicleVersions.id, { onDelete: "cascade" }),
    acMaxKw: numeric("ac_max_kw", { precision: 5, scale: 1 }),
    dcMaxKw: numeric("dc_max_kw", { precision: 5, scale: 1 }),
    /** Durée de la charge DC entre les deux niveaux ci-dessous (par défaut 10 → 80 %). */
    dc1080Min: smallint("dc_10_80_min"),
    dc1080PercentStart: smallint("dc_10_80_percent_start").notNull().default(10),
    dc1080PercentEnd: smallint("dc_10_80_percent_end").notNull().default(80),
    chargingSourceId: integer("charging_source_id").references(() => sources.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [
    unique("charging_specs_version_unique").on(t.vehicleVersionId),
    check("charging_specs_ac_range", sql`${t.acMaxKw} IS NULL OR ${t.acMaxKw} BETWEEN 1 AND 50`),
    check("charging_specs_dc_range", sql`${t.dcMaxKw} IS NULL OR ${t.dcMaxKw} BETWEEN 10 AND 1000`),
    check("charging_specs_dc_ge_ac", sql`${t.dcMaxKw} IS NULL OR ${t.acMaxKw} IS NULL OR ${t.dcMaxKw} >= ${t.acMaxKw}`),
    check("charging_specs_time_range", sql`${t.dc1080Min} IS NULL OR ${t.dc1080Min} BETWEEN 5 AND 240`),
    check("charging_specs_percent_window", sql`${t.dc1080PercentStart} >= 0 AND ${t.dc1080PercentEnd} <= 100 AND ${t.dc1080PercentStart} < ${t.dc1080PercentEnd}`),
  ],
).enableRLS();
