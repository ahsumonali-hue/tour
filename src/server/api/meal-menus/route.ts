import { db } from "@/db";
import { mealMenus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDbInitialized();
  try {
    const menus = await db.select().from(mealMenus);
    return Response.json({ menus });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const newMenu = {
      name: body.name,
      mealType: body.mealType || "breakfast",
      costPerPerson: Number(body.costPerPerson) || 100,
      description: body.description || "",
    };
    const [result] = await db.insert(mealMenus).values(newMenu);
    return Response.json({
      success: true,
      menu: { ...newMenu, id: (result as any)?.insertId },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await ensureDbInitialized();
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return Response.json({ error: "ID required" }, { status: 400 });
    }
    await db.delete(mealMenus).where(eq(mealMenus.id, id));
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
