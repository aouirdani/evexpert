import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { dataTypeEnum, entityTypeEnum, sourceTypeEnum } from "./enums";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
};

/** Sources de données (site, document, base). Une source est réutilisée par de nombreuses données. */
export const sources = pgTable(
  "sources",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    url: text().notNull(),
    sourceType: sourceTypeEnum("source_type").notNull(),
    ...timestamps,
  },
  (t) => [unique("sources_url_unique").on(t.url)],
).enableRLS();

/**
 * Traçabilité : rattache une donnée (ou une ligne entière, `field = '*'`) à sa
 * source, à l'URL précise consultée, à sa nature et à sa date de vérification.
 * `verified_at` est obligatoire : une donnée sans date de vérification n'existe pas.
 */
export const dataRecords = pgTable(
  "data_records",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    entityType: entityTypeEnum("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    /** Nom de la colonne concernée, ou '*' pour toute la ligne. */
    field: text().notNull().default("*"),
    sourceId: integer("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    sourceUrl: text("source_url").notNull(),
    dataType: dataTypeEnum("data_type").notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull(),
    note: text(),
    ...timestamps,
  },
  (t) => [
    unique("data_records_entity_field_source_unique").on(t.entityType, t.entityId, t.field, t.sourceId),
    index("data_records_entity_idx").on(t.entityType, t.entityId),
    index("data_records_source_idx").on(t.sourceId),
  ],
).enableRLS();

