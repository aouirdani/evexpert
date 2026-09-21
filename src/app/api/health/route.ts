import { sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";

export const dynamic = "force-dynamic";

// Liveness endpoint. La base est optionnelle en développement : sans DATABASE_URL
// l'application sert les données locales et le signale (`database: "not_configured"`).
// Quand DATABASE_URL est définie, une connexion défaillante est une erreur.
export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json({ ok: true, database: "not_configured" });
  }

  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ ok: true, database: "up" });
  } catch {
    return Response.json({ ok: false, database: "down" }, { status: 500 });
  }
}
