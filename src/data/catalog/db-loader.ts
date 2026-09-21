import { and, asc, desc, eq, isNull, lte, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  brands,
  chargingSpecs,
  dataRecords,
  models,
  sources,
  vehiclePrices,
  vehicleVersions,
} from "@/db/schema";
import type { DataType, Vehicle } from "@/types";

/** Nature en base → nature affichée dans l'interface (voir docs/data-model.md). */
const DATA_TYPE_UI = {
  official: "official",
  third_party: "specialized",
  calculated: "calculated",
  estimated: "estimated",
} as const satisfies Record<string, DataType>;

const n = (v: string | null): number | null => (v === null ? null : Number(v));

function yearsLabel(from: number | null, to: number | null): string {
  if (from === null && to === null) return "";
  if (from === null || to === null || from === to) return String(from ?? to);
  return `${from}-${to}`;
}

export interface LoadedFromDb {
  vehicles: Vehicle[];
  /** Versions actives ignorées car incomplètes (champs requis manquants). */
  skipped: string[];
}

/**
 * Charge le catalogue publiable depuis PostgreSQL : versions actives avec leur
 * modèle, marque, spécifications de recharge, provenance et prix français en vigueur.
 * Ordre = ordre d'insertion (id), ce qui préserve l'ordre du catalogue d'origine.
 */
export async function loadCatalogFromDb(): Promise<LoadedFromDb> {
  const db = getDb();

  const rows = await db
    .select({
      versionId: vehicleVersions.id,
      brandSlug: brands.slug,
      brandName: brands.name,
      modelSlug: models.slug,
      modelName: models.name,
      v: vehicleVersions,
      c: chargingSpecs,
    })
    .from(vehicleVersions)
    .innerJoin(models, eq(vehicleVersions.modelId, models.id))
    .innerJoin(brands, eq(models.brandId, brands.id))
    .leftJoin(chargingSpecs, eq(chargingSpecs.vehicleVersionId, vehicleVersions.id))
    .where(eq(vehicleVersions.isActive, true))
    .orderBy(asc(vehicleVersions.id));

  const provenance = await db
    .select({
      entityId: dataRecords.entityId,
      sourceUrl: dataRecords.sourceUrl,
      dataType: dataRecords.dataType,
      verifiedAt: dataRecords.verifiedAt,
      sourceName: sources.name,
    })
    .from(dataRecords)
    .innerJoin(sources, eq(dataRecords.sourceId, sources.id))
    .where(and(eq(dataRecords.entityType, "vehicle_version"), eq(dataRecords.field, "*")))
    .orderBy(desc(dataRecords.verifiedAt));
  const provByVersion = new Map<number, (typeof provenance)[number]>();
  for (const p of provenance) if (!provByVersion.has(p.entityId)) provByVersion.set(p.entityId, p);

  // Prix français en vigueur uniquement : un prix d'un autre marché n'est jamais un prix FR.
  const frPrices = await db
    .select({ versionId: vehiclePrices.vehicleVersionId, priceEur: vehiclePrices.priceEur })
    .from(vehiclePrices)
    .where(
      and(
        eq(vehiclePrices.market, "FR"),
        lte(vehiclePrices.validFrom, sql`CURRENT_DATE`),
        or(isNull(vehiclePrices.validTo), sql`${vehiclePrices.validTo} >= CURRENT_DATE`),
      ),
    )
    .orderBy(desc(vehiclePrices.validFrom));
  const priceByVersion = new Map<number, number>();
  for (const p of frPrices) if (!priceByVersion.has(p.versionId)) priceByVersion.set(p.versionId, Number(p.priceEur));

  const vehicles: Vehicle[] = [];
  const skipped: string[] = [];
  for (const r of rows) {
    const { v, c } = r;
    const id = `${r.brandSlug}-${r.modelSlug}-${v.slug}`;
    const prov = provByVersion.get(r.versionId);
    const usable = n(v.batteryUsableKwh);
    const acMax = c ? n(c.acMaxKw) : null;
    // Champs indispensables à l'affichage d'une fiche : sinon la version n'est pas publiable.
    if (usable === null || v.wltpRangeKm === null || v.powerKw === null || v.powerPs === null || acMax === null || v.seats === null ||
        v.lengthMm === null || v.widthMm === null || v.heightMm === null || !prov) {
      skipped.push(id);
      continue;
    }
    vehicles.push({
      id,
      brand: r.brandName,
      brandSlug: r.brandSlug,
      model: r.modelName,
      modelSlug: r.modelSlug,
      version: v.name,
      versionSlug: v.slug,
      years: yearsLabel(v.yearFrom, v.yearTo),
      bodyType: v.bodyType,
      drive: v.drive,
      chemistry: v.batteryChemistry,
      batteryGross: n(v.batteryGrossKwh),
      batteryUsable: usable,
      rangeWltp: v.wltpRangeKm,
      consumptionWltp: n(v.wltpConsumptionKwh100km),
      powerKw: v.powerKw,
      powerPs: v.powerPs,
      torque: v.torqueNm,
      acceleration0to100: n(v.acceleration0100S),
      topSpeed: v.topSpeedKmh,
      chargingAC: acMax,
      chargingDC: c ? n(c.dcMaxKw) : null,
      chargingTime10to80: c ? c.dc1080Min : null,
      dimensions: { length: v.lengthMm, width: v.widthMm, height: v.heightMm },
      weight: v.weightKg,
      trunkVolume: v.trunkL,
      trunkVolumeMax: v.trunkMaxL,
      seats: v.seats,
      batteryWarranty: v.batteryWarrantyText,
      warranty: v.vehicleWarrantyYears === null ? null : `${v.vehicleWarrantyYears} ans`,
      price: priceByVersion.get(r.versionId) ?? null,
      source: {
        name: prov.sourceName,
        url: prov.sourceUrl,
        dataType: DATA_TYPE_UI[prov.dataType],
        lastUpdated: prov.verifiedAt.toISOString().slice(0, 10),
      },
    });
  }
  return { vehicles, skipped };
}

export interface PriceEntry {
  priceEur: number;
  priceType: "list" | "promotional" | "estimated";
  /** Marché EXPLICITE : ne jamais présenter un prix non FR comme un prix français. */
  market: "FR" | "EU" | "DE" | "NL" | "BE" | "ES" | "IT" | "UK";
  validFrom: string;
  validTo: string | null;
  sourceUrl: string | null;
  verifiedAt: string;
}

/** Historique complet des prix d'une version (tous marchés), du plus récent au plus ancien. */
export async function loadPricesFromDb(vehicleId: string): Promise<PriceEntry[]> {
  const db = getDb();
  const rows = await db
    .select({
      priceEur: vehiclePrices.priceEur,
      priceType: vehiclePrices.priceType,
      market: vehiclePrices.market,
      validFrom: vehiclePrices.validFrom,
      validTo: vehiclePrices.validTo,
      sourceUrl: vehiclePrices.sourceUrl,
      verifiedAt: vehiclePrices.verifiedAt,
      brandSlug: brands.slug,
      modelSlug: models.slug,
      versionSlug: vehicleVersions.slug,
    })
    .from(vehiclePrices)
    .innerJoin(vehicleVersions, eq(vehiclePrices.vehicleVersionId, vehicleVersions.id))
    .innerJoin(models, eq(vehicleVersions.modelId, models.id))
    .innerJoin(brands, eq(models.brandId, brands.id))
    .orderBy(desc(vehiclePrices.validFrom));
  return rows
    .filter((r) => `${r.brandSlug}-${r.modelSlug}-${r.versionSlug}` === vehicleId)
    .map((r) => ({
      priceEur: Number(r.priceEur),
      priceType: r.priceType,
      market: r.market,
      validFrom: r.validFrom,
      validTo: r.validTo,
      sourceUrl: r.sourceUrl,
      verifiedAt: r.verifiedAt.toISOString(),
    }));
}
