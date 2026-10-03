import { db } from "@/db";
import { tours, tourPackages, tourAddons, bookings, smsLogs, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";
import { parseTourJson } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDbInitialized();
  try {
    const { id } = await params;
    const tourList = await db.select().from(tours).where(eq(tours.id, id)).limit(1);

    if (tourList.length === 0) {
      return Response.json({ error: "Tour not found" }, { status: 404 });
    }

    const tour = parseTourJson(tourList[0]);
    const packages = await db.select().from(tourPackages).where(eq(tourPackages.tourId, id));
    const addons = await db.select().from(tourAddons).where(eq(tourAddons.tourId, id));
    const tourBookings = await db.select().from(bookings).where(eq(bookings.tourId, id)).orderBy(desc(bookings.createdAt));
    const tourSms = await db.select().from(smsLogs).where(eq(smsLogs.tourId, id)).orderBy(desc(smsLogs.createdAt));

    const bookedPersons = tourBookings.reduce((sum, b) => sum + (b.personsCount || 1), 0);
    const totalCollected = tourBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const totalDue = tourBookings.reduce((sum, b) => sum + (b.dueAmount || 0), 0);
    const totalReceivable = tourBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return Response.json({
      tour: {
        ...tour,
        packages,
        addons,
        bookings: tourBookings,
        smsLogs: tourSms,
        bookingCount: tourBookings.length,
        bookedPersons,
        remainingSeats: Math.max(0, tour.totalSeats - bookedPersons),
        totalCollected,
        totalDue,
        totalReceivable,
      },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDbInitialized();
  try {
    const { id } = await params;
    const body = await req.json();

    await db
      .update(tours)
      .set({
        title: body.title,
        destination: body.destination,
        batchName: body.batchName,
        startDate: body.startDate,
        endDate: body.endDate,
        durationDays: Number(body.durationDays),
        durationNights: Number(body.durationNights),
        departureFrom: body.departureFrom,
        totalSeats: Number(body.totalSeats),
        basePrice: Number(body.basePrice),
        status: body.status,
        isFeatured: Boolean(body.isFeatured),
        coverImage: body.coverImage,
        posterImage: body.posterImage,
        galleryImages: body.galleryImages,
        description: body.description,
        highlights: body.highlights,
        inclusions: body.inclusions,
        exclusions: body.exclusions,
        assignedGuideIds: body.assignedGuideIds,
        busType: body.busType,
        foodPlan: body.foodPlan,
        itinerary: body.itinerary,
        budgetData: body.budgetData,
        updatedAt: new Date(),
      })
      .where(eq(tours.id, id));

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDbInitialized();
  try {
    const { id } = await params;
    await db.delete(tours).where(eq(tours.id, id));
    await db.delete(tourPackages).where(eq(tourPackages.tourId, id));
    await db.delete(tourAddons).where(eq(tourAddons.tourId, id));
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
