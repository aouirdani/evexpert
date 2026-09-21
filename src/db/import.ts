import { and, eq, sql } from "drizzle-orm";
import type { Db } from "./index";
import {
  brands,
  chargingSpecs,
  dataRecords,
  models,
  sources,
  vehicleVersions,
} from "./schema";
import type { Vehicle } from "@/types";
import { validateVehicles } from "@/data/validation";

/**
 * Import idempotent du catalogue (objets `Vehicle`) vers PostgreSQL.
 * - upsert sur les clés naturelles (slugs, url) : aucune duplication à la relance ;
 * - une ligne n'est réécrite que si une valeur a changé (updated_at conservé sinon) ;
 * - tout dans UNE transaction : en cas d'erreur, rien n'est écrit.
 * - aucune donnée n'est inventée : null reste NULL.
 */

export interface ImportReport {
  brands: { total: number; created: number; updated: number };
  models: { total: number; created: number; updated: number };
  versions: { total: number; created: number; updated: number };
  chargingSpecs: { total: number; created: number; updated: number };
  prices: { total: number };
  sources: { total: number };
  dataRecords: { total: number };
  duplicates: number;
  invalidRecords: number;
  missingRequiredFields: number;
}

const counter = () => ({ total: 0, created: 0, updated: 0 });
const num = (n: number | null | undefined) => (n === null || n === undefined ? null : String(n));

export function parseYears(label: string): { from: number | null; to: number | null } {
  const m = /^(\d{4})(?:\s*-\s*(\d{4}))?$/.exec(label.trim());
  if (!m) return { from: null, to: null };
  const from = Number(m[1]);
  return { from, to: m[2] ? Number(m[2]) : from };
}

/**
 * Décompose le texte de garantie de la source. Le texte d'origine est toujours conservé ;
 * les nombres ne sont extraits que lorsqu'ils sont exprimés sans ambiguïté (années, km).
 * Les miles ne sont pas convertis.
 */
export function parseBatteryWarranty(text: string | null): { years: number | null; km: number | null } {
  if (!text) return { years: null, km: null };
  const years = /(\d+)\s*ans?/i.exec(text);
  const km = /(\d[\d\s ]*)\s*km/i.exec(text);
  return {
    years: years ? Number(years[1]) : null,
    km: km ? Number(km[1].replace(/[\s ]/g, "")) : null,
  };
}

const DATA_TYPE_MAP = { official: "official", specialized: "third_party", calculated: "calculated", estimated: "estimated" } as const;

export async function importCatalog(db: Db, vehicles: Vehicle[]): Promise<ImportReport> {
  const issues = validateVehicles(vehicles);
  const errors = issues;
  const report: ImportReport = {
    brands: counter(),
    models: counter(),
    versions: counter(),
    chargingSpecs: counter(),
    prices: { total: 0 },
    sources: { total: 0 },
    dataRecords: { total: 0 },
    duplicates: issues.filter((i) => i.category === "duplicate").length,
    invalidRecords: new Set(issues.filter((i) => i.category !== "duplicate" && i.category !== "required").map((i) => i.subject)).size,
    missingRequiredFields: issues.filter((i) => i.category === "required").length,
  };
  if (errors.length) {
    throw new Error(
      `Import refusé : ${errors.length} problème(s) de qualité dans le catalogue source.\n` +
        errors.slice(0, 20).map((i) => ` - [${i.category}] ${i.subject} : ${i.message}`).join("\n"),
    );
  }
  if (vehicles.some((v) => v.price !== null)) {
    // Un prix sans marché explicite ne peut pas être importé : on refuse plutôt que de deviner.
    throw new Error("Import refusé : un véhicule source porte un prix sans marché. Importer les prix avec leur marché dans vehicle_prices.");
  }

  await db.transaction(async (tx) => {
    // 1. Sources (une par couple nom/URL de base)
    const sourceIds = new Map<string, number>();
    for (const v of vehicles) {
      const base = new URL(v.source.url).origin + "/";
      if (sourceIds.has(base)) continue;
      const [row] = await tx
        .insert(sources)
        .values({ name: v.source.name, url: base, sourceType: "specialized" })
        .onConflictDoUpdate({ target: sources.url, set: { name: v.source.name }, setWhere: sql`${sources.name} IS DISTINCT FROM excluded.name` })
        .returning({ id: sources.id });
      const id = row?.id ?? (await tx.select({ id: sources.id }).from(sources).where(eq(sources.url, base)))[0].id;
      sourceIds.set(base, id);
    }
    report.sources.total = sourceIds.size;

    const brandIds = new Map<string, number>();
    const modelIds = new Map<string, number>();

    for (const v of vehicles) {
      // 2. Marque
      let brandId = brandIds.get(v.brandSlug);
      if (brandId === undefined) {
        const [b] = await tx
          .insert(brands)
          .values({ slug: v.brandSlug, name: v.brand })
          .onConflictDoUpdate({ target: brands.slug, set: { name: v.brand, updatedAt: sql`now()` }, setWhere: sql`${brands.name} IS DISTINCT FROM excluded.name` })
          .returning({ id: brands.id, inserted: sql<boolean>`(xmax = 0)` });
        if (b) { report.brands[b.inserted ? "created" : "updated"]++; brandId = b.id; }
        else brandId = (await tx.select({ id: brands.id }).from(brands).where(eq(brands.slug, v.brandSlug)))[0].id;
        brandIds.set(v.brandSlug, brandId);
        report.brands.total++;
      }

      // 3. Modèle
      const modelKey = `${v.brandSlug}/${v.modelSlug}`;
      let modelId = modelIds.get(modelKey);
      if (modelId === undefined) {
        const [m] = await tx
          .insert(models)
          .values({ brandId, slug: v.modelSlug, name: v.model })
          .onConflictDoUpdate({ target: [models.brandId, models.slug], set: { name: v.model, updatedAt: sql`now()` }, setWhere: sql`${models.name} IS DISTINCT FROM excluded.name` })
          .returning({ id: models.id, inserted: sql<boolean>`(xmax = 0)` });
        if (m) { report.models[m.inserted ? "created" : "updated"]++; modelId = m.id; }
        else modelId = (await tx.select({ id: models.id }).from(models).where(and(eq(models.brandId, brandId), eq(models.slug, v.modelSlug))))[0].id;
        modelIds.set(modelKey, modelId);
        report.models.total++;
      }

      // 4. Version
      const years = parseYears(v.years);
      const warranty = parseBatteryWarranty(v.batteryWarranty);
      const values = {
        modelId,
        slug: v.versionSlug,
        name: v.version,
        yearFrom: years.from,
        yearTo: years.to,
        isActive: true,
        bodyType: v.bodyType,
        drive: v.drive,
        batteryChemistry: v.chemistry,
        batteryGrossKwh: num(v.batteryGross),
        batteryUsableKwh: num(v.batteryUsable),
        wltpRangeKm: v.rangeWltp,
        wltpConsumptionKwh100km: num(v.consumptionWltp),
        powerKw: v.powerKw,
        powerPs: v.powerPs,
        torqueNm: v.torque,
        acceleration0100S: num(v.acceleration0to100),
        topSpeedKmh: v.topSpeed,
        lengthMm: v.dimensions.length,
        widthMm: v.dimensions.width,
        heightMm: v.dimensions.height,
        weightKg: v.weight,
        trunkL: v.trunkVolume,
        trunkMaxL: v.trunkVolumeMax,
        seats: v.seats,
        vehicleWarrantyYears: null,
        batteryWarrantyYears: warranty.years,
        batteryWarrantyKm: warranty.km,
        batteryWarrantyText: v.batteryWarranty,
      };
      const { modelId: _m, slug: _s, ...updatable } = values;
      void _m; void _s;
      const changed = sql.join(
        (Object.keys(updatable) as (keyof typeof updatable)[]).map((k) => sql`${vehicleVersions[k]} IS DISTINCT FROM excluded.${sql.identifier(vehicleVersions[k].name)}`),
        sql` OR `,
      );
      const [ver] = await tx
        .insert(vehicleVersions)
        .values(values)
        .onConflictDoUpdate({ target: [vehicleVersions.modelId, vehicleVersions.slug], set: { ...updatable, updatedAt: sql`now()` }, setWhere: changed })
        .returning({ id: vehicleVersions.id, inserted: sql<boolean>`(xmax = 0)` });
      let versionId: number;
      if (ver) { report.versions[ver.inserted ? "created" : "updated"]++; versionId = ver.id; }
      else versionId = (await tx.select({ id: vehicleVersions.id }).from(vehicleVersions).where(and(eq(vehicleVersions.modelId, modelId), eq(vehicleVersions.slug, v.versionSlug))))[0].id;
      report.versions.total++;

      const sourceId = sourceIds.get(new URL(v.source.url).origin + "/")!;

      // 5. Recharge
      const charging = {
        vehicleVersionId: versionId,
        acMaxKw: num(v.chargingAC),
        dcMaxKw: num(v.chargingDC),
        dc1080Min: v.chargingTime10to80,
        dc1080PercentStart: 10,
        dc1080PercentEnd: 80,
        chargingSourceId: sourceId,
      };
      const { vehicleVersionId: _v, ...chargingUpd } = charging;
      void _v;
      const chargingChanged = sql.join(
        (Object.keys(chargingUpd) as (keyof typeof chargingUpd)[]).map((k) => sql`${chargingSpecs[k]} IS DISTINCT FROM excluded.${sql.identifier(chargingSpecs[k].name)}`),
        sql` OR `,
      );
      const [cs] = await tx
        .insert(chargingSpecs)
        .values(charging)
        .onConflictDoUpdate({ target: chargingSpecs.vehicleVersionId, set: { ...chargingUpd, updatedAt: sql`now()` }, setWhere: chargingChanged })
        .returning({ id: chargingSpecs.id, inserted: sql<boolean>`(xmax = 0)` });
      let chargingId: number;
      if (cs) { report.chargingSpecs[cs.inserted ? "created" : "updated"]++; chargingId = cs.id; }
      else chargingId = (await tx.select({ id: chargingSpecs.id }).from(chargingSpecs).where(eq(chargingSpecs.vehicleVersionId, versionId)))[0].id;
      report.chargingSpecs.total++;

      // 6. Traçabilité (une ligne par version et par fiche de recharge, toute la ligne = '*')
      for (const [entityType, entityId] of [["vehicle_version", versionId], ["charging_spec", chargingId]] as const) {
        await tx
          .insert(dataRecords)
          .values({
            entityType,
            entityId,
            field: "*",
            sourceId,
            sourceUrl: v.source.url,
            dataType: DATA_TYPE_MAP[v.source.dataType],
            verifiedAt: new Date(`${v.source.lastUpdated.slice(0, 10)}T00:00:00Z`),
          })
          .onConflictDoUpdate({
            target: [dataRecords.entityType, dataRecords.entityId, dataRecords.field, dataRecords.sourceId],
            set: { sourceUrl: v.source.url, dataType: DATA_TYPE_MAP[v.source.dataType], verifiedAt: new Date(`${v.source.lastUpdated.slice(0, 10)}T00:00:00Z`) },
          });
        report.dataRecords.total++;
      }
    }
  });

  return report;
}

export function formatImportReport(r: ImportReport): string {
  const line = (label: string, x: { total: number; created?: number; updated?: number }) =>
    `${label.padEnd(24)} ${String(x.total).padStart(3)}${x.created !== undefined ? `   (créés : ${x.created}, mis à jour : ${x.updated})` : ""}`;
  return [
    "EVExpert — rapport d'import",
    "",
    line("Brands imported:", r.brands),
    line("Models imported:", r.models),
    line("Vehicle versions imported:", r.versions),
    line("Charging specs imported:", r.chargingSpecs),
    line("Prices imported:", r.prices),
    line("Sources imported:", r.sources),
    line("Data records written:", r.dataRecords),
    "",
    `Duplicates: ${r.duplicates}`,
    `Invalid records: ${r.invalidRecords}`,
    `Missing required fields: ${r.missingRequiredFields}`,
  ].join("\n");
}
