import { db } from "@/db";
import { bookings, customers, tours, smsLogs, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await ensureDbInitialized();
  try {
    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get("tourId");

    let query;
    if (tourId) {
      query = db.select().from(bookings).where(eq(bookings.tourId, tourId)).orderBy(desc(bookings.createdAt));
    } else {
      query = db.select().from(bookings).orderBy(desc(bookings.createdAt));
    }

    const allBookings = await query;
    return Response.json({ bookings: allBookings });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const cleanPhone = (body.customerPhone || "").trim();
    const customerName = (body.customerName || "Customer").trim();

    // 1. Check or create customer in CRM
    let customerId = body.customerId;
    if (!customerId && cleanPhone) {
      const existingCustomer = await db
        .select()
        .from(customers)
        .where(eq(customers.phone, cleanPhone))
        .limit(1);

      if (existingCustomer.length > 0) {
        customerId = existingCustomer[0].id;
        // update customer trip count and spent
        await db
          .update(customers)
          .set({
            totalTrips: (existingCustomer[0].totalTrips || 0) + 1,
            totalSpent: (existingCustomer[0].totalSpent || 0) + Number(body.totalAmount || 0),
            currentDue: (existingCustomer[0].currentDue || 0) + Number(body.dueAmount || 0),
            nextTripName: body.tourTitle || "আসন্ন ট্যুর",
          })
          .where(eq(customers.id, customerId));
      } else {
        const [custRes] = await db
          .insert(customers)
          .values({
            name: customerName,
            phone: cleanPhone,
            district: body.district || "Rajshahi",
            tags: ["New"],
            totalTrips: 1,
            totalSpent: Number(body.totalAmount || 0),
            currentDue: Number(body.dueAmount || 0),
            nextTripName: body.tourTitle || "আসন্ন ট্যুর",
          });
        customerId = (custRes as any)?.insertId;
      }
    }

    const bookingCode = `RTT-${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newBooking = {
      bookingCode,
      tourId: body.tourId,
      customerId: customerId || null,
      customerName,
      customerPhone: cleanPhone,
      packageId: body.packageId || null,
      packageName: body.packageName || "স্ট্যান্ডার্ড প্যাকেজ",
      personsCount: Number(body.personsCount) || 1,
      seatNumbers: body.seatNumbers || "",
      baseAmount: Number(body.baseAmount) || 0,
      addonsAmount: Number(body.addonsAmount) || 0,
      discountAmount: Number(body.discountAmount) || 0,
      totalAmount: Number(body.totalAmount) || 0,
      paidAmount: Number(body.paidAmount) || 0,
      dueAmount: Number(body.dueAmount) || 0,
      paymentMethod: body.paymentMethod || "bKash",
      bookingSource: body.bookingSource || "Phone Call",
      status: body.status || "confirmed",
      pickupPoint: body.pickupPoint || "ভদ্রা মোড়, রাজশাহী",
      notes: body.notes || "",
      createdBy: body.createdBy || "Tanvir Ahmed",
    };

    const [bookingRes] = await db.insert(bookings).values(newBooking);

    // Auto-generate Confirmation SMS Log
    if (body.sendSms) {
      const smsMessage = `প্রিয় ${customerName}, আপনার বুকিং কনফার্ম হয়েছে! বুকিং কোড: ${bookingCode}। মোট: ৳${newBooking.totalAmount}, জমা: ৳${newBooking.paidAmount}, বকেয়া: ৳${newBooking.dueAmount}। সাথে থাকার জন্য ধন্যবাদ — Rajshahi Tours & Travels (${process.env.PHONE || "01782-250709"})`;

      await db.insert(smsLogs).values({
        tourId: body.tourId,
        senderName: body.createdBy || "Admin",
        smsType: "booking_confirm",
        templateTitle: "বুকিং নিশ্চিতকরণ এসএমএস",
        message: smsMessage,
        recipientCount: 1,
        recipientPhones: [cleanPhone],
        deliveryStatus: "Delivered",
        cost: 0.45,
      });
    }

    await db.insert(auditLogs).values({
      userName: body.createdBy || "Staff",
      userRole: "staff",
      action: "New Booking Created",
      details: `Created booking ${bookingCode} for ${customerName} (${newBooking.personsCount} persons)`,
    });

    return Response.json({
      success: true,
      booking: { ...newBooking, id: (bookingRes as any)?.insertId },
    });
  } catch (err) {
    console.error("Booking creation error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const { id, paidAmount, dueAmount, seatNumbers, status, notes } = body;

    if (!id) {
      return Response.json({ error: "Booking ID required" }, { status: 400 });
    }

    await db
      .update(bookings)
      .set({
        paidAmount: paidAmount !== undefined ? Number(paidAmount) : undefined,
        dueAmount: dueAmount !== undefined ? Number(dueAmount) : undefined,
        seatNumbers: seatNumbers !== undefined ? seatNumbers : undefined,
        status: status !== undefined ? status : undefined,
        notes: notes !== undefined ? notes : undefined,
      })
      .where(eq(bookings.id, id));

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
    await db.delete(bookings).where(eq(bookings.id, id));
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
