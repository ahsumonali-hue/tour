import { db } from "@/db";
import { websiteSettings, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDbInitialized();
  try {
    const allSettings = await db.select().from(websiteSettings);
    const settingsMap: Record<string, string> = {};
    for (const item of allSettings) {
      settingsMap[item.key] = item.value;
    }
    return Response.json({ settings: settingsMap });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json(); // { key: value, ... }

    for (const [key, val] of Object.entries(body)) {
      if (typeof val === "string") {
        const existing = await db.select().from(websiteSettings).where(eq(websiteSettings.key, key)).limit(1);
        if (existing.length > 0) {
          await db.update(websiteSettings).set({ value: val, updatedAt: new Date() }).where(eq(websiteSettings.key, key));
        } else {
          await db.insert(websiteSettings).values({ key, value: val });
        }
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
