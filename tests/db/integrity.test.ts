import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { adminPool, appPool, expectSqlError } from "../helpers/db";

const { pool } = adminPool();
let brandId: number;
let modelId: number;
let versionId: number;

beforeAll(async () => {
  brandId = (await pool.query("insert into brands (slug, name) values ('test-brand','Test') returning id")).rows[0].id;
  modelId = (await pool.query("insert into models (brand_id, slug, name) values ($1,'test-model','Test model') returning id", [brandId])).rows[0].id;
  versionId = (await pool.query(
    `insert into vehicle_versions (model_id, slug, name, body_type, drive, battery_gross_kwh, battery_usable_kwh, wltp_range_km)
     values ($1,'v1','V1','SUV','FWD',60,57,400) returning id`, [modelId])).rows[0].id;
});

afterAll(async () => {
  await pool.query("delete from vehicle_prices where vehicle_version_id = $1", [versionId]);
  await pool.query("delete from vehicle_versions where model_id = $1", [modelId]);
  await pool.query("delete from models where id = $1", [modelId]);
  await pool.query("delete from brands where id = $1", [brandId]);
  await pool.end();
});

const ver = (cols: string, vals: string) => `insert into vehicle_versions (model_id, slug, name, body_type, drive, ${cols}) values (${modelId}, 'bad-${Math.random().toString(36).slice(2, 8)}', 'Bad', 'SUV', 'FWD', ${vals})`;

describe("contraintes d'intégrité en base", () => {
  it("slugs dupliqués refusés", async () => {
    expect(await expectSqlError(pool, "insert into brands (slug, name) values ('test-brand','Autre')")).toMatch(/brands_slug_unique/);
    expect(await expectSqlError(pool, "insert into models (brand_id, slug, name) values ($1,'test-model','Autre')", [brandId])).toMatch(/models_brand_slug_unique/);
    expect(await expectSqlError(pool, "insert into vehicle_versions (model_id, slug, name, body_type, drive) values ($1,'v1','Autre','SUV','FWD')", [modelId])).toMatch(/vehicle_versions_model_slug_unique/);
  });
  it("slug mal formé refusé", async () => {
    expect(await expectSqlError(pool, "insert into brands (slug, name) values ('Pas Un Slug','X')")).toMatch(/brands_slug_format/);
  });
  it("batterie utile > brute refusée, valeurs non positives refusées", async () => {
    expect(await expectSqlError(pool, ver("battery_gross_kwh, battery_usable_kwh", "50, 60"))).toMatch(/battery_usable_le_gross/);
    expect(await expectSqlError(pool, ver("battery_usable_kwh", "-5"))).toMatch(/battery_positive/);
  });
  it("valeurs WLTP invalides refusées", async () => {
    expect(await expectSqlError(pool, ver("wltp_range_km", "0"))).toMatch(/wltp_range_range/);
    expect(await expectSqlError(pool, ver("wltp_range_km", "9999"))).toMatch(/wltp_range_range/);
    expect(await expectSqlError(pool, ver("wltp_consumption_kwh_100km", "1.4"))).toMatch(/wltp_consumption_range/);
  });
  it("relations invalides refusées (clés étrangères)", async () => {
    expect(await expectSqlError(pool, "insert into models (brand_id, slug, name) values (999999,'orphan','Orphan')")).toMatch(/foreign key/i);
    expect(await expectSqlError(pool, "insert into charging_specs (vehicle_version_id) values (999999)")).toMatch(/foreign key/i);
  });
  it("prix invalides refusés", async () => {
    const price = (v: string, extra = "'https://example.test'") => `insert into vehicle_prices (vehicle_version_id, price_eur, market, valid_from, ${extra.startsWith("'") ? "source_url" : "valid_to"}, verified_at) values (${versionId}, ${v}, 'FR', '2026-01-01', ${extra}, now())`;
    expect(await expectSqlError(pool, price("0"))).toMatch(/price_range/);
    expect(await expectSqlError(pool, price("-100"))).toMatch(/price_range/);
    // période inversée
    expect(await expectSqlError(pool, `insert into vehicle_prices (vehicle_version_id, price_eur, market, valid_from, valid_to, source_url, verified_at) values (${versionId}, 100, 'FR', '2026-02-01', '2026-01-01', 'https://e.test', now())`)).toMatch(/period_order/);
    // source obligatoire
    expect(await expectSqlError(pool, `insert into vehicle_prices (vehicle_version_id, price_eur, market, valid_from, verified_at) values (${versionId}, 100, 'FR', '2026-01-01', now())`)).toMatch(/has_source/);
    // marché explicite et valide
    expect(await expectSqlError(pool, `insert into vehicle_prices (vehicle_version_id, price_eur, market, valid_from, source_url, verified_at) values (${versionId}, 100, 'XX', '2026-01-01', 'https://e.test', now())`)).toMatch(/invalid input value for enum/);
    expect(await expectSqlError(pool, `insert into vehicle_prices (vehicle_version_id, price_eur, valid_from, source_url, verified_at) values (${versionId}, 100, '2026-01-01', 'https://e.test', now())`)).toMatch(/market/);
  });
  it("traçabilité : date de vérification et source obligatoires", async () => {
    expect(await expectSqlError(pool, "insert into data_records (entity_type, entity_id, source_id, source_url, data_type) values ('vehicle_version', 1, 1, 'https://e.test', 'third_party')")).toMatch(/verified_at/);
    expect(await expectSqlError(pool, "insert into data_records (entity_type, entity_id, source_url, data_type, verified_at) values ('vehicle_version', 1, 'https://e.test', 'third_party', now())")).toMatch(/source_id/);
    expect(await expectSqlError(pool, "insert into data_records (entity_type, entity_id, source_id, source_url, data_type, verified_at) values ('vehicle_version', 1, 1, 'https://e.test', 'inventé', now())")).toMatch(/invalid input value for enum/);
  });
  it("chaque version importée a sa source et sa date de vérification", async () => {
    const r = await pool.query(`select count(*)::int n from vehicle_versions v where v.slug <> 'v1' and not exists (select 1 from data_records d where d.entity_type='vehicle_version' and d.entity_id=v.id and d.field='*' and d.verified_at is not null)`);
    expect(r.rows[0].n).toBe(0);
  });
});

describe("Row Level Security", () => {
  it("RLS activée sur toutes les tables", async () => {
    const r = await pool.query("select relname from pg_class where relnamespace='public'::regnamespace and relkind='r' and not relrowsecurity");
    expect(r.rows).toEqual([]);
  });
  it("le rôle applicatif lit, mais ne modifie rien", async () => {
    const app = appPool();
    expect((await app.query("select count(*)::int n from vehicle_versions")).rows[0].n).toBeGreaterThan(40);
    expect(await expectSqlError(app, "update brands set name='x'")).toMatch(/permission denied/i);
    expect(await expectSqlError(app, "insert into sources (name, url, source_type) values ('x','https://x.test','other')")).toMatch(/permission denied/i);
    await app.end();
  });
  it("un rôle sans policy (équivalent des rôles publics Supabase) ne voit AUCUNE ligne", async () => {
    await pool.query("do $$ begin if not exists (select 1 from pg_roles where rolname='evexpert_no_policy') then create role evexpert_no_policy nologin; end if; end $$");
    await pool.query("grant usage on schema public to evexpert_no_policy; grant select on all tables in schema public to evexpert_no_policy");
    const client = await pool.connect();
    try {
      await client.query("set role evexpert_no_policy");
      expect((await client.query("select count(*)::int n from vehicle_versions")).rows[0].n).toBe(0);
      expect((await client.query("select count(*)::int n from brands")).rows[0].n).toBe(0);
    } finally {
      await client.query("reset role");
      client.release();
    }
  });
});
