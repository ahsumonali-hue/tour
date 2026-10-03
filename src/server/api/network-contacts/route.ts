import { db } from "@/db";
import { networkContacts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await ensureDbInitialized();
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase() || "";

    let contacts = await db.select().from(networkContacts).orderBy(desc(networkContacts.rating));

    if (district && district !== "all") {
      contacts = contacts.filter((c) => c.district.toLowerCase() === district.toLowerCase());
    }

    if (category && category !== "all") {
      contacts = contacts.filter((c) => c.category === category);
    }

    if (search) {
      contacts = contacts.filter(
        (c) =>
          c.businessName.toLowerCase().includes(search) ||
          c.contactPerson.toLowerCase().includes(search) ||
          c.phone.includes(search) ||
          (c.notes && c.notes.toLowerCase().includes(search))
      );
    }

    return Response.json({ contacts });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const newContact = {
      businessName: body.businessName,
      contactPerson: body.contactPerson,
      phone: body.phone,
      district: body.district || "Sylhet",
      category: body.category || "hotel",
      rating: Number(body.rating) || 5,
      notes: body.notes || "",
      lastUsedDate: body.lastUsedDate || new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      linkedToursCount: Number(body.linkedToursCount) || 1,
    };

    const [result] = await db.insert(networkContacts).values(newContact);

    return Response.json({
      success: true,
      contact: { ...newContact, id: (result as any)?.insertId },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const { id, businessName, contactPerson, phone, district, category, rating, notes } = body;

    if (!id) {
      return Response.json({ error: "Contact ID required" }, { status: 400 });
    }

    await db
      .update(networkContacts)
      .set({
        businessName,
        contactPerson,
        phone,
        district,
        category,
        rating: Number(rating),
        notes,
      })
      .where(eq(networkContacts.id, Number(id)));

    return Response.json({ success: true });
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
    await db.delete(networkContacts).where(eq(networkContacts.id, id));
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
