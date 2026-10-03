import "server-only";
import { isDatabaseConfigured } from "@/db";
import { vehicles as localVehicles } from "@/data/vehicles";
import type { Vehicle } from "@/types";
import { loadCatalogFromDb, loadPricesFromDb, type PriceEntry } from "./db-loader";
import * as sel from "./selectors";

/**
 * COUCHE D'ACCÈS AUX DONNÉES DU CATALOGUE (serveur uniquement).
 *
 *   Pages / composants serveur → catalog (ici) → Drizzle → PostgreSQL (Supabase)
 *
 * Source des données :
 * - DATABASE_URL définie  → PostgreSQL. Une nouvelle tentative est faite après un échec ; si elle
 *   échoue aussi, le DERNIER CATALOGUE CONNU (en mémoire, même expiré) est servi avec un
 *   console.error, sinon l'erreur remonte. On ne retombe JAMAIS sur des données locales périmées.
 * - DATABASE_URL absente  → données locales (src/data/vehicles.ts), uniquement
 *   pour le développement et les builds sans base (phase de transition).
 * - EVEXPERT_DATA_SOURCE=local force les données locales même si DATABASE_URL existe.
 */

export type CatalogSource = "database" | "local";

export interface Catalog {
  source: CatalogSource;
  vehicles: Vehicle[];
  /** Date de relevé la plus récente (AAAA-MM-JJ). */
  checkedAt: string;
  /** Versions actives ignorées (champs requis manquants). */
  skipped: string[];
}

const TTL_MS = 5 * 60 * 1000;
let memo: { at: number; promise: Promise<Catalog> } | undefined;
/** Dernier catalogue chargé avec succès depuis la base, gardé pour survivre à une panne passagère. */
let lastGood: Catalog | undefined;
const RETRY_DELAY_MS = 300;

function describe(err: unknown): string {
  return err instanceof Error ? `${err.name}: ${err.message}` : String(err);
}

/** Charge depuis la base avec une seule nouvelle tentative, et journalise chaque échec. */
async function loadFromDbWithRetry(): ReturnType<typeof loadCatalogFromDb> {
  const started = Date.now();
  try {
    return await loadCatalogFromDb();
  } catch (first) {
    console.error(`[catalog] échec du chargement (${Date.now() - started} ms), nouvelle tentative : ${describe(first)}`);
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    const retryStarted = Date.now();
    try {
      return await loadCatalogFromDb();
    } catch (second) {
      console.error(`[catalog] échec de la nouvelle tentative (${Date.now() - retryStarted} ms) : ${describe(second)}`);
      throw second;
    }
  }
}

export function resolveCatalogSource(env: NodeJS.ProcessEnv = process.env): CatalogSource {
  if (env.EVEXPERT_DATA_SOURCE === "local") return "local";
  return isDatabaseConfigured() ? "database" : "local";
}

async function load(): Promise<Catalog> {
  if (resolveCatalogSource() === "local") {
    return { source: "local", vehicles: localVehicles, checkedAt: sel.latestVerification(localVehicles), skipped: [] };
  }
  const { vehicles, skipped } = await loadFromDbWithRetry();
  if (skipped.length) {
    console.warn(`[catalog] ${skipped.length} version(s) active(s) non publiable(s), ignorée(s) : ${skipped.join(", ")}`);
  }
  if (vehicles.length === 0) {
    throw new Error("[catalog] La base est joignable mais ne contient aucune version publiable. Lancez `npm run db:import`.");
  }
  const catalog: Catalog = { source: "database", vehicles, checkedAt: sel.latestVerification(vehicles), skipped };
  lastGood = catalog;
  return catalog;
}

/** `load()`, avec repli sur le dernier catalogue connu si la base ne répond pas. */
async function loadOrLastKnown(): Promise<{ catalog: Catalog; stale: boolean }> {
  try {
    return { catalog: await load(), stale: false };
  } catch (err) {
    if (!lastGood) throw err;
    console.error(`[catalog] base indisponible : dernier catalogue connu servi (${lastGood.vehicles.length} versions) : ${describe(err)}`);
    return { catalog: lastGood, stale: true };
  }
}

/** Charge le catalogue complet (mis en cache quelques minutes par processus). */
export function getCatalog(): Promise<Catalog> {
  const now = Date.now();
  if (!memo || now - memo.at > TTL_MS) {
    const loading = loadOrLastKnown();
    const promise = loading.then((r) => r.catalog);
    memo = { at: now, promise };
    // Un échec, ou un repli sur le dernier catalogue connu, ne reste pas en cache : la requête
    // suivante retente la base.
    loading.then(
      (r) => {
        if (r.stale && memo?.promise === promise) memo = undefined;
      },
      () => {
        if (memo?.promise === promise) memo = undefined;
      },
    );
  }
  return memo.promise;
}

/** Vide le cache (tests). */
export function resetCatalogCache(): void {
  memo = undefined;
  lastGood = undefined;
}

/* ------------------------------ API publique ------------------------------ */

export async function getAllVehicles(): Promise<Vehicle[]> {
  return (await getCatalog()).vehicles;
}

/** Alias explicite : toutes les versions publiables. */
export const getVehicleVersions = getAllVehicles;

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  return sel.byId((await getCatalog()).vehicles, id);
}

export async function getVehiclesByBrand(brandSlug: string): Promise<Vehicle[]> {
  return sel.byBrand((await getCatalog()).vehicles, brandSlug);
}

/** Retrouve une version (ou la première version d'un modèle si `versionSlug` est omis). */
export async function getVehicleBySlug(brandSlug: string, modelSlug: string, versionSlug?: string): Promise<Vehicle | undefined> {
  return sel.find((await getCatalog()).vehicles, brandSlug, modelSlug, versionSlug);
}

export async function getModelVersions(brandSlug: string, modelSlug: string): Promise<Vehicle[]> {
  return sel.versionsOf((await getCatalog()).vehicles, brandSlug, modelSlug);
}

export async function getBrands() {
  return sel.brandsOf((await getCatalog()).vehicles);
}

/** Un représentant (première version) par modèle. */
export async function getModels(): Promise<Vehicle[]> {
  return sel.modelsOf((await getCatalog()).vehicles);
}

export async function getSimilarVehicles(vehicle: Vehicle, limit = 3): Promise<Vehicle[]> {
  return sel.similarTo((await getCatalog()).vehicles, vehicle, limit);
}

export async function isVersionPageIndexable(v: Vehicle): Promise<boolean> {
  return sel.isVersionIndexable((await getCatalog()).vehicles, v);
}

/** Véhicules à comparer, dans l'ordre des identifiants demandés (les inconnus sont ignorés). */
export async function getVehiclesForComparison(ids: string[]): Promise<Vehicle[]> {
  const all = (await getCatalog()).vehicles;
  return ids.map((id) => sel.byId(all, id)).filter((v): v is Vehicle => Boolean(v));
}

export async function getCatalogDate(): Promise<string> {
  return (await getCatalog()).checkedAt;
}

/**
 * Prix d'une version. Sans `market`, retourne le prix FRANÇAIS en vigueur
 * (`null` si inconnu). Les prix d'autres marchés ne sont retournés que sur demande explicite.
 */
export async function getVehiclePrice(vehicleId: string, market: PriceEntry["market"] = "FR"): Promise<PriceEntry | null> {
  const cat = await getCatalog();
  if (cat.source === "local") return null;
  const today = new Date().toISOString().slice(0, 10);
  const all = await loadPricesFromDb(vehicleId);
  return all.find((p) => p.market === market && p.validFrom <= today && (p.validTo === null || p.validTo >= today)) ?? null;
}

export async function getVehiclePriceHistory(vehicleId: string): Promise<PriceEntry[]> {
  const cat = await getCatalog();
  return cat.source === "local" ? [] : loadPricesFromDb(vehicleId);
}

/** Spécifications de recharge d'une version (AC, DC, temps de charge DC 10-80 %). */
export async function getChargingSpecs(vehicleId: string) {
  const v = await getVehicleById(vehicleId);
  if (!v) return null;
  return {
    acMaxKw: v.chargingAC,
    dcMaxKw: v.chargingDC,
    dc1080Min: v.chargingTime10to80,
    dc1080PercentStart: 10,
    dc1080PercentEnd: 80,
  };
}

/** Sources rattachées à une version (nom, URL, nature, date de vérification). */
export async function getVehicleSources(vehicleId: string) {
  const v = await getVehicleById(vehicleId);
  return v ? [v.source] : [];
}

export type { PriceEntry };
