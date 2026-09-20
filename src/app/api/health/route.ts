import { sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";

export const dynamic = "force-dynamic";

// Liveness endpoint. The database is optional for now: when DATABASE_URL is not
// set the app is still healthy and reports the database as "not_configured".
// When it is set, a failing connection is reported as an error.
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
