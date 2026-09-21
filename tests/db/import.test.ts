import { afterAll, describe, expect, it } from "vitest";
import { importCatalog } from "@/db/import";
import { vehicles } from "@/data/vehicles";
import { adminPool } from "../helpers/db";

const { pool, db } = adminPool();
afterAll(() => pool.end());

const counts = async () =>
  (await pool.query(`select (select count(*)::int from brands) b, (select count(*)::int from models) m, (select count(*)::int from vehicle_versions) v, (select count(*)::int from charging_specs) c, (select count(*)::int from data_records) d, (select count(*)::int from sources) s`)).rows[0];

describe("import du catalogue", () => {
  it("est idempotent : relancé, il ne crée rien et ne modifie rien", async () => {
    const before = await counts();
    expect(before).toMatchObject({ b: 22, m: 45, v: 47, c: 47, s: 1, d: 94 });
    const r = await importCatalog(db, vehicles);
    expect(r.brands.created + r.models.created + r.versions.created + r.chargingSpecs.created).toBe(0);
    expect(r.brands.updated + r.models.updated + r.versions.updated + r.chargingSpecs.updated).toBe(0);
    expect(r).toMatchObject({ duplicates: 0, invalidRecords: 0, missingRequiredFields: 0, prices: { total: 0 } });
    expect(await counts()).toEqual(before);
  });
  it("ne réécrit pas updated_at des lignes inchangées", async () => {
    const t1 = (await pool.query("select max(updated_at) t from vehicle_versions")).rows[0].t;
    await importCatalog(db, vehicles);
    const t2 = (await pool.query("select max(updated_at) t from vehicle_versions")).rows[0].t;
    expect(t2).toEqual(t1);
  });
  it("met à jour une valeur modifiée à la source, sans dupliquer", async () => {
    const changed = vehicles.map((v) => (v.id === "renault-5-e-tech-52-kwh-150-ch" ? { ...v, rangeWltp: 410 } : v));
    const r = await importCatalog(db, changed);
    expect(r.versions).toMatchObject({ created: 0, updated: 1 });
    expect((await counts()).v).toBe(47);
    await importCatalog(db, vehicles); // restaure
    const range = (await pool.query("select wltp_range_km r from vehicle_versions v join models m on m.id=v.model_id where m.slug='5-e-tech'")).rows[0].r;
    expect(range).toBe(416);
  });
  it("est transactionnel : une erreur en cours d'import n'écrit rien", async () => {
    const before = await counts();
    const bad = [...vehicles.slice(0, 3), { ...vehicles[3], chargingAC: 22, chargingDC: 5 }];
    await expect(importCatalog(db, bad)).rejects.toThrow(/Import refusé/);
    expect(await counts()).toEqual(before);
  });
  it("refuse un prix sans marché", async () => {
    await expect(importCatalog(db, [{ ...vehicles[0], price: 30000 }])).rejects.toThrow(/sans marché/);
  });
  it("refuse les doublons du catalogue source", async () => {
    await expect(importCatalog(db, [vehicles[0], vehicles[0]])).rejects.toThrow(/duplicate/);
  });
});
