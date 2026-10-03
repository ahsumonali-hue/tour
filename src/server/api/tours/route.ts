import { db } from "@/db";
import { tours, tourPackages, tourAddons, bookings, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";
import { parseTourJson } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await ensureDbInitialized();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = db.select().from(tours).orderBy(desc(tours.startDate));
    const allTours = await query;

    // Attach packages and addons
    const allPackages = await db.select().from(tourPackages);
    const allAddons = await db.select().from(tourAddons);
    const allBookings = await db.select().from(bookings);

    const toursWithDetails = allTours.map((rawTour) => {
      const tour = parseTourJson(rawTour);
      const packages = allPackages.filter((p) => p.tourId === tour.id);
      const addons = allAddons.filter((a) => a.tourId === tour.id);
      const tourBookings = allBookings.filter((b) => b.tourId === tour.id);
      const bookedPersons = tourBookings.reduce((sum, b) => sum + (b.personsCount || 1), 0);
      const totalCollected = tourBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
      const totalReceivable = tourBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      return {
        ...tour,
        packages,
        addons,
        bookingCount: tourBookings.length,
        bookedPersons,
        remainingSeats: Math.max(0, tour.totalSeats - bookedPersons),
        totalCollected,
        totalReceivable,
      };
    });

    if (status) {
      return Response.json({ tours: toursWithDetails.filter((t) => t.status === status) });
    }

    return Response.json({ tours: toursWithDetails });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const id = body.id || `t-${Date.now().toString(36)}`;
    const slug = body.slug || `${body.destination?.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;

    const newTour = {
      id,
      title: body.title || "নতুন ট্যুর",
      slug,
      destination: body.destination || "বাংলাদেশ",
      batchName: body.batchName || "আসন্ন ব্যাচ",
      startDate: body.startDate || "2026-10-25",
      endDate: body.endDate || "2026-10-28",
      durationDays: Number(body.durationDays) || 2,
      durationNights: Number(body.durationNights) || 3,
      departureFrom: body.departureFrom || "ভদ্রা মোড় / রেলগেট, রাজশাহী",
      totalSeats: Number(body.totalSeats) || 40,
      availableSeats: Number(body.totalSeats) || 40,
      basePrice: Number(body.basePrice) || 4500,
      status: body.status || "published",
      isFeatured: Boolean(body.isFeatured),
      coverImage: body.coverImage || "https://images.pexels.com/photos/6128962/pexels-photo-6128962.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      posterImage: body.posterImage || "",
      galleryImages: body.galleryImages || [],
      description: body.description || "",
      highlights: body.highlights || [],
      inclusions: body.inclusions || [],
      exclusions: body.exclusions || [],
      assignedGuideIds: body.assignedGuideIds || [],
      busType: body.busType || "নন-এসি চেয়ার কোচ বাস",
      foodPlan: body.foodPlan || [],
      itinerary: body.itinerary || [],
      budgetData: body.budgetData || {
        busCost: 40000,
        hotelCost: 25000,
        foodCost: 30000,
        guideFee: 5000,
        ticketsCost: 4000,
        otherCost: 2000,
        estTotalCost: 106000,
        estMinPersons: 35,
        breakEvenPersons: 24,
      },
    };

    await db.insert(tours).values(newTour);

    // Insert packages if provided
    if (Array.isArray(body.packages) && body.packages.length > 0) {
      for (const pkg of body.packages) {
        await db.insert(tourPackages).values({
          tourId: id,
          name: pkg.name || "স্ট্যান্ডার্ড প্যাকেজ",
          roomType: pkg.roomType || "Standard",
          pricePerPerson: Number(pkg.pricePerPerson) || newTour.basePrice,
          description: pkg.description || "",
          isDefault: Boolean(pkg.isDefault),
        });
      }
    } else {
      // Default package
      await db.insert(tourPackages).values({
        tourId: id,
        name: "স্ট্যান্ডার্ড ৪ জন শেয়ারিং",
        roomType: "4 in 1 Room",
        pricePerPerson: newTour.basePrice,
        description: "৪ জন ১ রুমে শেয়ারিং প্যাকেজ",
        isDefault: true,
      });
    }

    // Insert addons if provided
    if (Array.isArray(body.addons) && body.addons.length > 0) {
      for (const addon of body.addons) {
        await db.insert(tourAddons).values({
          tourId: id,
          name: addon.name,
          price: Number(addon.price) || 100,
        });
      }
    }

    await db.insert(auditLogs).values({
      userName: body.userName || "Admin",
      userRole: body.userRole || "admin",
      action: "Created Tour",
      details: `Created new tour: ${newTour.title} (${newTour.startDate})`,
    });

    return Response.json({ success: true, tourId: id, tour: newTour });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
