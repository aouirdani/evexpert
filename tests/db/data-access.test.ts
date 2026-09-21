import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { closeDb } from "@/db";
import { vehicles as seed } from "@/data/vehicles";
import {
  getBrands,
  getCatalog,
  getChargingSpecs,
  getModels,
  getVehicleBySlug,
  getVehiclePrice,
  getVehiclePriceHistory,
  getVehicleSources,
  getVehiclesByBrand,
  getVehiclesForComparison,
  getModelVersions,
  resetCatalogCache,
} from "@/data/catalog";
import { adminPool } from "../helpers/db";
import { TEST_APP_URL } from "../helpers/env";

const admin = adminPool();
const R5 = "renault-5-e-tech-52-kwh-150-ch";
let versionId: number;

beforeAll(async () => {
  process.env.DATABASE_URL = TEST_APP_URL; // rôle lecture seule, comme en production
  delete process.env.EVEXPERT_DATA_SOURCE;
  resetCatalogCache();
  const r = await admin.pool.query("select v.id from vehicle_versions v join models m on m.id=v.model_id join brands b on b.id=m.brand_id where b.slug='renault' and m.slug='5-e-tech'");
  versionId = r.rows[0].id;
});

afterAll(async () => {
  await admin.pool.query("delete from vehicle_prices");
  await admin.pool.end();
  await closeDb();
});

describe("connexion et source de données", () => {
  it("utilise la base quand DATABASE_URL est définie", async () => {
    const cat = await getCatalog();
    expect(cat.source).toBe("database");
    expect(cat.vehicles).toHaveLength(47);
    expect(cat.skipped).toEqual([]);
  });
  it("le rôle applicatif ne peut PAS écrire", async () => {
    const { appPool, expectSqlError } = await import("../helpers/db");
    const app = appPool();
    expect(await expectSqlError(app, "delete from brands")).toMatch(/permission denied/i);
    expect(await expectSqlError(app, "insert into brands (slug, name) values ('x', 'X')")).toMatch(/permission denied/i);
    await app.end();
  });
});

describe("lecture des données", () => {
  it("marques", async () => {
    const brands = await getBrands();
    expect(brands).toHaveLength(22);
    expect(brands.find((b) => b.slug === "renault")).toMatchObject({ name: "Renault", count: 5 });
    expect(brands.find((b) => b.slug === "cupra")?.name).toBe("CUPRA");
  });
  it("modèles", async () => {
    expect(await getModels()).toHaveLength(45);
    expect(await getModelVersions("tesla", "model-3")).toHaveLength(2);
  });
  it("version par slug", async () => {
    const v = await getVehicleBySlug("renault", "5-e-tech", "52-kwh-150-ch");
    expect(v).toBeDefined();
    expect(v).toMatchObject({ id: R5, batteryUsable: 52, batteryGross: 55, rangeWltp: 416, chargingAC: 11, chargingDC: 101, chargingTime10to80: 31 });
    expect(await getVehicleBySlug("renault", "5-e-tech", "inconnue")).toBeUndefined();
  });
  it("véhicules d'une marque et comparaison", async () => {
    expect(await getVehiclesByBrand("bmw")).toHaveLength(3);
    const cmp = await getVehiclesForComparison([R5, "peugeot-e-208-50-kwh", "n-existe-pas"]);
    expect(cmp.map((v) => v.id)).toEqual([R5, "peugeot-e-208-50-kwh"]);
  });
  it("spécifications de recharge", async () => {
    expect(await getChargingSpecs(R5)).toEqual({ acMaxKw: 11, dcMaxKw: 101, dc1080Min: 31, dc1080PercentStart: 10, dc1080PercentEnd: 80 });
    expect(await getChargingSpecs("inconnu")).toBeNull();
  });
  it("sources et date de vérification", async () => {
    const [src] = await getVehicleSources(R5);
    expect(src).toMatchObject({ name: "EV Database", dataType: "specialized", lastUpdated: "2026-09-21" });
    expect(src.url).toMatch(/^https:\/\/ev-database\.org\/car\/2135\//);
  });
  it("la base restitue exactement les données du seed local", async () => {
    const cat = await getCatalog();
    expect(cat.vehicles).toEqual(seed);
  });
});

describe("prix (marché explicite)", () => {
  it("aucun prix français tant qu'aucun prix FR n'est enregistré", async () => {
    expect(await getVehiclePrice(R5)).toBeNull();
    expect((await getCatalog()).vehicles.every((v) => v.price === null)).toBe(true);
  });
  it("un prix néerlandais ou allemand n'est JAMAIS retourné comme prix français", async () => {
    await admin.pool.query(
      `insert into vehicle_prices (vehicle_version_id, price_eur, market, valid_from, source_url, verified_at)
       values ($1, 30990, 'NL', '2026-01-01', 'https://ev-database.org/car/2135/x', now()),
              ($1, 32900, 'DE', '2026-01-01', 'https://ev-database.org/car/2135/x', now())`,
      [versionId],
    );
    resetCatalogCache();
    expect(await getVehiclePrice(R5)).toBeNull();
    expect(await getVehiclePrice(R5, "NL")).toMatchObject({ priceEur: 30990, market: "NL" });
    expect(await getVehiclePrice(R5, "DE")).toMatchObject({ priceEur: 32900, market: "DE" });
    expect((await getVehicleBySlug("renault", "5-e-tech"))?.price).toBeNull();
  });
  it("un prix FR en vigueur est retourné, l'historique est conservé", async () => {
    await admin.pool.query(
      `insert into vehicle_prices (vehicle_version_id, price_eur, market, valid_from, valid_to, source_url, verified_at)
       values ($1, 29990, 'FR', '2025-01-01', '2026-06-30', 'https://example.test/old', now()),
              ($1, 30490, 'FR', '2026-07-01', null, 'https://example.test/new', now())`,
      [versionId],
    );
    resetCatalogCache();
    expect(await getVehiclePrice(R5)).toMatchObject({ priceEur: 30490, market: "FR", validTo: null });
    expect((await getVehicleBySlug("renault", "5-e-tech"))?.price).toBe(30490);
    const history = await getVehiclePriceHistory(R5);
    expect(history.filter((p) => p.market === "FR")).toHaveLength(2);
  });
});

describe("échec explicite (pas de repli silencieux)", () => {
  it("base configurée mais injoignable → erreur, pas de données locales", async () => {
    await closeDb();
    process.env.DATABASE_URL = "postgresql://evexpert_app:x@127.0.0.1:59999/none";
    resetCatalogCache();
    await expect(getCatalog()).rejects.toThrow();
    await closeDb();
    process.env.DATABASE_URL = TEST_APP_URL;
    resetCatalogCache();
  });
  it("EVEXPERT_DATA_SOURCE=local force le seed", async () => {
    process.env.EVEXPERT_DATA_SOURCE = "local";
    resetCatalogCache();
    expect((await getCatalog()).source).toBe("local");
    delete process.env.EVEXPERT_DATA_SOURCE;
    resetCatalogCache();
  });
  it("sans DATABASE_URL : repli sur les données locales", async () => {
    const saved = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    resetCatalogCache();
    const cat = await getCatalog();
    expect(cat.source).toBe("local");
    expect(cat.vehicles).toHaveLength(47);
    process.env.DATABASE_URL = saved;
    resetCatalogCache();
  });
});
