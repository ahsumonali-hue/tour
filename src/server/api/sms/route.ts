import { db } from "@/db";
import { smsLogs, websiteSettings, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";
import { parseSmsLogJson } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await ensureDbInitialized();
  try {
    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get("tourId");

    let query;
    if (tourId) {
      query = db.select().from(smsLogs).where(eq(smsLogs.tourId, tourId)).orderBy(desc(smsLogs.createdAt));
    } else {
      query = db.select().from(smsLogs).orderBy(desc(smsLogs.createdAt));
    }

    const rawLogs = await query;
    const logs = rawLogs.map(parseSmsLogJson);
    const settings = await db.select().from(websiteSettings).where(eq(websiteSettings.key, "sms_balance")).limit(1);
    const smsBalance = settings[0]?.value ? Number(settings[0].value) : 1843;

    return Response.json({
      logs,
      balance: smsBalance,
      totalSent: logs.reduce((sum, l) => sum + (l.recipientCount || 1), 0),
      totalSpent: logs.reduce((sum, l) => sum + (l.cost || 0), 0),
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDbInitialized();
  try {
    const body = await req.json();
    const {
      tourId,
      senderName = "Islam (Guide)",
      smsType = "tour_broadcast",
      templateTitle = "কাস্টম মেসেজ",
      message,
      recipients = [], // Array of phone numbers
      costPerSms = 0.45,
    } = body;

    if (!message || message.trim().length === 0) {
      return Response.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const recipientCount = Array.isArray(recipients) && recipients.length > 0 ? recipients.length : 1;
    const totalCost = Number((recipientCount * costPerSms).toFixed(2));

    const newLog = {
      tourId: tourId || null,
      senderName,
      smsType,
      templateTitle,
      message,
      recipientCount,
      recipientPhones: recipients,
      deliveryStatus: `Delivered (${recipientCount}/${recipientCount})`,
      cost: totalCost,
    };

    const [result] = await db.insert(smsLogs).values(newLog);

    // Deduct balance
    const settings = await db.select().from(websiteSettings).where(eq(websiteSettings.key, "sms_balance")).limit(1);
    const currentBalance = settings[0]?.value ? Number(settings[0].value) : 1843;
    const newBalance = Math.max(0, currentBalance - recipientCount);

    if (settings.length > 0) {
      await db.update(websiteSettings).set({ value: String(newBalance) }).where(eq(websiteSettings.key, "sms_balance"));
    }

    await db.insert(auditLogs).values({
      userName: senderName,
      userRole: "tour_guide",
      action: "SMS Broadcast Sent",
      details: `Sent '${templateTitle}' to ${recipientCount} recipients. Cost: ৳${totalCost}`,
    });

    return Response.json({
      success: true,
      log: { ...newLog, id: (result as any)?.insertId },
      newBalance,
      deliveredTo: recipientCount,
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
