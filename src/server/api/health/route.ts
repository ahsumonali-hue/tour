import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbInitialized();
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, app: "Rajshahi Tours & Travels API" });
  } catch (error) {
    console.error("Healthcheck error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
