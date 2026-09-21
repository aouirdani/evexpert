import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { vehicleVersions } from "./catalog";
import { marketEnum, priceTypeEnum } from "./enums";
import { sources } from "./sources";

/**
 * Historique des prix. Un prix appartient toujours à un MARCHÉ explicite :
 * l'application n'affiche un « prix France » que pour `market = 'FR'`.
 * Une période ouverte (`valid_to IS NULL`) désigne le prix en vigueur.
 */
export const vehiclePrices = pgTable(
  "vehicle_prices",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    vehicleVersionId: integer("vehicle_version_id")
      .notNull()
      .references(() => vehicleVersions.id, { onDelete: "cascade" }),
    priceEur: numeric("price_eur", { precision: 10, scale: 2 }).notNull(),
    priceType: priceTypeEnum("price_type").notNull().default("list"),
    market: marketEnum().notNull(),
    validFrom: date("valid_from").notNull(),
    validTo: date("valid_to"),
    sourceId: integer("source_id").references(() => sources.id, { onDelete: "set null" }),
    sourceUrl: text("source_url"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("vehicle_prices_price_range", sql`${t.priceEur} > 0 AND ${t.priceEur} < 5000000`),
    check("vehicle_prices_period_order", sql`${t.validTo} IS NULL OR ${t.validTo} >= ${t.validFrom}`),
    check("vehicle_prices_has_source", sql`${t.sourceId} IS NOT NULL OR ${t.sourceUrl} IS NOT NULL`),
    index("vehicle_prices_lookup_idx").on(t.vehicleVersionId, t.market, t.validFrom),
  ],
).enableRLS();
