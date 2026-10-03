import { db } from "@/db";
import { inquiries, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";
import { parseInquiryJson } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDbInitialized();
  try {
    const rawInquiries = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
    return Response.json({ inquiries: rawInquiries.map(parseInquiryJson) });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const inquiryCode = `iq-${Math.floor(Math.random() * 900) + 100}`;

    const newInquiry = {
      inquiryCode,
      customerName: body.customerName || "Customer",
      phone: body.phone || "",
      tourId: body.tourId || null,
      tourTitle: body.tourTitle || "সাধারণ অনুসন্ধান",
      personsCount: Number(body.personsCount) || 1,
      preferredPackage: body.preferredPackage || "Standard",
      message: body.message || "",
      status: body.status || "new",
      assignedTo: body.assignedTo || "Tanvir Ahmed",
      source: body.source || "website",
      followUps: body.followUps || [],
    };

    const [result] = await db.insert(inquiries).values(newInquiry);

    await db.insert(auditLogs).values({
      userName: body.customerName || "Website Visitor",
      userRole: "lead",
      action: "New Inquiry Submitted",
      details: `Inquiry for ${newInquiry.tourTitle} by ${newInquiry.customerName} (${newInquiry.phone})`,
    });

    return Response.json({
      success: true,
      inquiry: { ...newInquiry, id: (result as any)?.insertId },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
