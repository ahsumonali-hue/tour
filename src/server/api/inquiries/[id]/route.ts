import { db } from "@/db";
import { inquiries, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";
import { safeJsonParse } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDbInitialized();
  try {
    const { id } = await params;
    const numericId = Number(id);
    const body = await req.json();

    const existing = await db.select().from(inquiries).where(eq(inquiries.id, numericId)).limit(1);
    if (existing.length === 0) {
      return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const currentInquiry = existing[0];
    let updatedFollowUps: any[] = safeJsonParse(currentInquiry.followUps, []);

    if (body.newNote) {
      updatedFollowUps = [
        ...updatedFollowUps,
        {
          id: `fu-${Date.now()}`,
          note: body.newNote,
          author: body.author || "Tanvir Ahmed",
          date: new Date().toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        },
      ];
    }

    await db
      .update(inquiries)
      .set({
        status: body.status !== undefined ? body.status : currentInquiry.status,
        assignedTo: body.assignedTo !== undefined ? body.assignedTo : currentInquiry.assignedTo,
        followUps: updatedFollowUps,
      })
      .where(eq(inquiries.id, numericId));

    return Response.json({ success: true, followUps: updatedFollowUps });
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
    await db.delete(inquiries).where(eq(inquiries.id, Number(id)));
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
