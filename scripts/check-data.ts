/**
 * EVExpert — rapport de qualité des données.
 *
 *   npm run check:data
 *
 * 1. Contrôle le catalogue local (seed, src/data/vehicles.ts).
 * 2. Si DATABASE_URL (ou DATABASE_ADMIN_URL) est définie, contrôle aussi la base :
 *    comptages, doublons, sources et dates de vérification manquantes, relations,
 *    prix, valeurs de batterie / WLTP, et fidélité de la migration (base = seed).
 *
 * Le script SIGNALE, il ne corrige jamais. Code de sortie 1 si un problème bloquant est trouvé.
 */
import { Pool } from "pg";
import { buildPoolConfig } from "@/db";
import { vehicles as seed } from "@/data/vehicles";
import { countByCategory, validateVehicles, type Issue } from "@/data/validation";
import type { Vehicle } from "@/types";

const STALE_DAYS = 180;

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

function diffFields(a: Vehicle, b: Vehicle): string[] {
  return (Object.keys(a) as (keyof Vehicle)[]).filter((k) => !deepEqual(a[k], b[k])).map(String);
}

interface Row extends Record<string, unknown> {
  n: string;
}

async function main() {
  const url = process.env.DATABASE_ADMIN_URL?.trim() || process.env.DATABASE_URL?.trim();
  const blocking: string[] = [];
  const warnings: string[] = [];
  const lines: string[] = ["EVExpert Data Quality Report", ""];

  // ---- 1. Seed local
  const seedIssues = validateVehicles(seed);
  lines.push(`Local seed: ${seed.length} versions, ${new Set(seed.map((v) => v.brandSlug)).size} brands, ${new Set(seed.map((v) => `${v.brandSlug}/${v.modelSlug}`)).size} models`);
  if (seedIssues.length) blocking.push(...seedIssues.map((i) => `[seed/${i.category}] ${i.subject}: ${i.message}`));

  let dbIssues: Issue[] = [];
  if (!url) {
    lines.push("", "Database: non configurée (DATABASE_URL absente) — contrôle de la base ignoré.");
  } else {
    process.env.DATABASE_URL = url;
    const pool = new Pool(buildPoolConfig(url));
    const q = async (sql: string): Promise<number> => Number(((await pool.query<Row>(sql)).rows[0] as Row).n);
    try {
      const brandsN = await q("select count(*) n from brands");
      const modelsN = await q("select count(*) n from models");
      const versionsN = await q("select count(*) n from vehicle_versions");
      const chargingN = await q("select count(*) n from charging_specs");
      const pricesN = await q("select count(*) n from vehicle_prices");
      const pricesFr = await q("select count(*) n from vehicle_prices where market = 'FR'");
      const sourcesN = await q("select count(*) n from sources");

      const dupBrand = await q("select count(*) n from (select slug from brands group by slug having count(*) > 1) t");
      const dupModel = await q("select count(*) n from (select brand_id, slug from models group by brand_id, slug having count(*) > 1) t");
      const dupVersion = await q("select count(*) n from (select model_id, slug from vehicle_versions group by model_id, slug having count(*) > 1) t");
      const invalidPrices = await q("select count(*) n from vehicle_prices where price_eur <= 0 or (valid_to is not null and valid_to < valid_from) or (source_id is null and source_url is null)");
      const invalidBattery = await q("select count(*) n from vehicle_versions where battery_usable_kwh <= 0 or battery_gross_kwh <= 0 or battery_usable_kwh > battery_gross_kwh");
      const invalidWltp = await q("select count(*) n from vehicle_versions where wltp_range_km <= 0 or wltp_consumption_kwh_100km <= 0");
      const missingSources = await q("select count(*) n from vehicle_versions v where not exists (select 1 from data_records d where d.entity_type = 'vehicle_version' and d.entity_id = v.id and d.field = '*')");
      const missingVerification = await q("select count(*) n from data_records where verified_at is null");
      const stale = await q(`select count(*) n from vehicle_versions v where not exists (select 1 from data_records d where d.entity_type = 'vehicle_version' and d.entity_id = v.id and d.verified_at > now() - interval '${STALE_DAYS} days')`);
      const noCharging = await q("select count(*) n from vehicle_versions v where not exists (select 1 from charging_specs c where c.vehicle_version_id = v.id)");
      const noVersions = await q("select count(*) n from models m where not exists (select 1 from vehicle_versions v where v.model_id = m.id)");
      const noModels = await q("select count(*) n from brands b where not exists (select 1 from models m where m.brand_id = b.id)");
      const frPriceNoSource = await q("select count(*) n from vehicle_prices where market = 'FR' and source_id is null and source_url is null");

      // Chargement applicatif + règles de validation + fidélité vs seed
      const { loadCatalogFromDb } = await import("@/data/catalog/db-loader");
      const loaded = await loadCatalogFromDb();
      dbIssues = validateVehicles(loaded.vehicles);
      const seedById = new Map(seed.map((v) => [v.id, v]));
      const mismatches: string[] = [];
      let identical = 0;
      for (const v of loaded.vehicles) {
        const s = seedById.get(v.id);
        if (!s) { warnings.push(`version en base absente du seed : ${v.id}`); continue; }
        const d = diffFields(s, v);
        if (d.length === 0) identical++;
        else mismatches.push(`${v.id} [${d.join(", ")}]`);
      }
      const missingInDb = seed.filter((s) => !loaded.vehicles.some((v) => v.id === s.id)).map((s) => s.id);

      lines.push(
        "",
        `Brands: ${brandsN}`,
        `Models: ${modelsN}`,
        `Versions: ${versionsN}`,
        `Charging specs: ${chargingN}`,
        `Sources: ${sourcesN}`,
        `Prices: ${pricesN} (marché FR : ${pricesFr})`,
        "",
        `Invalid prices: ${invalidPrices}`,
        `Invalid battery values: ${invalidBattery + countByCategory(dbIssues, "battery")}`,
        `Invalid WLTP values: ${invalidWltp + countByCategory(dbIssues, "wltp", "consumption")}`,
        `Duplicate slugs: ${dupBrand + dupModel + dupVersion + countByCategory(dbIssues, "duplicate")}`,
        `Missing sources: ${missingSources + countByCategory(dbIssues, "source")}`,
        `Missing verification dates: ${missingVerification + countByCategory(dbIssues, "verification")}`,
        `Invalid relations: ${noCharging + noVersions + noModels}  (versions sans recharge : ${noCharging}, modèles sans version : ${noVersions}, marques sans modèle : ${noModels})`,
        `Unpublishable active versions: ${loaded.skipped.length}`,
        `Verified more than ${STALE_DAYS} days ago: ${stale}`,
        "",
        `Migration fidelity (base vs seed): ${identical}/${seed.length} identical`,
      );

      if (invalidPrices) blocking.push(`${invalidPrices} prix invalide(s)`);
      if (frPriceNoSource) blocking.push(`${frPriceNoSource} prix FR sans source`);
      if (invalidBattery) blocking.push(`${invalidBattery} valeur(s) de batterie invalide(s)`);
      if (invalidWltp) blocking.push(`${invalidWltp} valeur(s) WLTP invalide(s)`);
      if (dupBrand + dupModel + dupVersion) blocking.push("slugs dupliqués en base");
      if (missingSources) blocking.push(`${missingSources} version(s) sans source`);
      if (missingVerification) blocking.push(`${missingVerification} enregistrement(s) sans date de vérification`);
      if (noCharging) blocking.push(`${noCharging} version(s) sans fiche de recharge`);
      if (loaded.skipped.length) blocking.push(`${loaded.skipped.length} version(s) active(s) non publiables : ${loaded.skipped.join(", ")}`);
      blocking.push(...dbIssues.map((i) => `[db/${i.category}] ${i.subject}: ${i.message}`));
      if (mismatches.length) blocking.push(`écarts base ≠ seed : ${mismatches.slice(0, 10).join(" ; ")}`);
      if (missingInDb.length) warnings.push(`versions du seed absentes de la base : ${missingInDb.join(", ")}`);
      if (noVersions) warnings.push(`${noVersions} modèle(s) sans version`);
      if (noModels) warnings.push(`${noModels} marque(s) sans modèle`);
      if (stale) warnings.push(`${stale} version(s) vérifiée(s) il y a plus de ${STALE_DAYS} jours`);
    } finally {
      await pool.end();
    }
  }

  console.log(lines.join("\n"));
  if (warnings.length) console.log("\nAvertissements :\n" + warnings.map((w) => ` - ${w}`).join("\n"));
  if (blocking.length) {
    console.error("\nProblèmes bloquants :\n" + blocking.map((b) => ` - ${b}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("\nAucun problème bloquant.");
  }
}

void main();
