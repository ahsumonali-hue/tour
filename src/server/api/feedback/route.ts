import { db } from "@/db";
import { feedbackReviews, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";
import { parseReviewJson } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await ensureDbInitialized();
  try {
    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get("tourId");
    const publishedOnly = searchParams.get("published") === "true";

    let reviews = await db.select().from(feedbackReviews).orderBy(desc(feedbackReviews.createdAt));

    if (tourId) {
      reviews = reviews.filter((r) => r.tourId === tourId);
    }
    if (publishedOnly) {
      reviews = reviews.filter((r) => r.isPublished);
    }

    const averageRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

    const parsedReviews = reviews.map(parseReviewJson);

    return Response.json({ reviews: parsedReviews, averageRating, total: parsedReviews.length });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const newReview = {
      tourId: body.tourId || null,
      tourTitle: body.tourTitle || "রাজশাহী ট্যুরস ট্রাভেলার রিভিউ",
      customerName: body.customerName || "সন্তুষ্ট ভ্রমণকারী",
      customerPhone: body.customerPhone || "",
      rating: Number(body.rating) || 5,
      likedFeatures: body.likedFeatures || [],
      reviewText: body.reviewText || "অসাধারণ অভিজ্ঞতা!",
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      travelerType: body.travelerType || "Group",
    };

    const [result] = await db.insert(feedbackReviews).values(newReview);

    return Response.json({
      success: true,
      review: { ...newReview, id: (result as any)?.insertId },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const { id, isPublished } = body;

    if (!id) {
      return Response.json({ error: "Review ID required" }, { status: 400 });
    }

    await db
      .update(feedbackReviews)
      .set({ isPublished: Boolean(isPublished) })
      .where(eq(feedbackReviews.id, Number(id)));

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
    await db.delete(feedbackReviews).where(eq(feedbackReviews.id, id));
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
