import { db } from "@/db";
import { customers, bookings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";
import { parseCustomerJson } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await ensureDbInitialized();
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const tag = searchParams.get("tag") || "";
    const district = searchParams.get("district") || "";
    const format = searchParams.get("format");

    const rawCustomers = await db.select().from(customers).orderBy(desc(customers.totalSpent));
    let allCustomers = rawCustomers.map(parseCustomerJson);

    if (search) {
      allCustomers = allCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.phone.toLowerCase().includes(search) ||
          (c.district && c.district.toLowerCase().includes(search))
      );
    }

    if (tag && tag !== "all") {
      allCustomers = allCustomers.filter((c) => c.tags?.includes(tag));
    }

    if (district && district !== "all") {
      allCustomers = allCustomers.filter((c) => c.district.toLowerCase() === district.toLowerCase());
    }

    // CSV Export
    if (format === "csv") {
      const header = "ID,Name,Phone,District,Trips,Total Spent,Current Due,Tags,Last Trip,Next Trip\n";
      const rows = allCustomers
        .map(
          (c) =>
            `"${c.id}","${c.name}","${c.phone}","${c.district}","${c.totalTrips}","${c.totalSpent}","${c.currentDue}","${(c.tags || []).join(";")}","${c.lastTripName || ""}","${c.nextTripName || ""}"`
        )
        .join("\n");

      return new Response(header + rows, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="customers-rajshahi-tours.csv"',
        },
      });
    }

    // Compute stats
    const totalCustomers = allCustomers.length;
    const repeatCustomers = allCustomers.filter((c) => (c.totalTrips || 0) >= 2);
    const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers.length / totalCustomers) * 100) : 0;
    const customersWithDue = allCustomers.filter((c) => (c.currentDue || 0) > 0);
    const totalDueAmount = customersWithDue.reduce((sum, c) => sum + (c.currentDue || 0), 0);
    const topSpender = allCustomers.length > 0 ? allCustomers[0] : null;

    return Response.json({
      customers: allCustomers,
      stats: {
        totalCustomers,
        totalTravelled: allCustomers.filter((c) => (c.totalTrips || 0) > 0).length,
        repeatRate,
        repeatCount: repeatCustomers.length,
        dueCount: customersWithDue.length,
        totalDueAmount,
        topSpender: topSpender
          ? {
              name: topSpender.name,
              totalSpent: topSpender.totalSpent,
              trips: topSpender.totalTrips,
            }
          : null,
      },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const cleanPhone = (body.phone || "").trim();

    const existing = await db.select().from(customers).where(eq(customers.phone, cleanPhone)).limit(1);
    if (existing.length > 0) {
      return Response.json({ error: "Customer already exists with this phone" }, { status: 400 });
    }

    const newCustomer = {
      name: body.name || "New Customer",
      phone: cleanPhone,
      email: body.email || null,
      district: body.district || "Rajshahi",
      address: body.address || "",
      tags: body.tags || ["New"],
      totalTrips: Number(body.totalTrips) || 0,
      totalSpent: Number(body.totalSpent) || 0,
      currentDue: Number(body.currentDue) || 0,
      notes: body.notes || "",
    };

    const [result] = await db.insert(customers).values(newCustomer);

    return Response.json({
      success: true,
      customer: { ...newCustomer, id: (result as any)?.insertId },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const { id, name, phone, email, district, address, tags, notes, currentDue } = body;

    if (!id) {
      return Response.json({ error: "Customer ID required" }, { status: 400 });
    }

    await db
      .update(customers)
      .set({
        name,
        phone,
        email,
        district,
        address,
        tags,
        notes,
        currentDue: currentDue !== undefined ? Number(currentDue) : undefined,
      })
      .where(eq(customers.id, Number(id)));

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
    await db.delete(customers).where(eq(customers.id, id));
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
