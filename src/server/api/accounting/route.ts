import { db } from "@/db";
import { accountingEntries, tours, bookings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDbInitialized } from "@/lib/db-init";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await ensureDbInitialized();
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") || "2026-10";

    const allEntries = await db.select().from(accountingEntries).orderBy(desc(accountingEntries.entryDate));
    const currentMonthEntries = allEntries.filter((e) => e.monthYear === month);

    // Compute Income, Tour Expenses, Overheads, Marketing
    const tourRevenues = currentMonthEntries
      .filter((e) => e.entryType === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    const tourExpenses = currentMonthEntries.filter((e) => e.entryType === "tour_expense");
    const overheadExpenses = currentMonthEntries.filter((e) => e.entryType === "overhead_expense");
    const marketingExpenses = currentMonthEntries.filter((e) => e.entryType === "marketing_expense");

    const totalTourCost = tourExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalOverhead = overheadExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalMarketing = marketingExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Categories breakdown
    const busCost = tourExpenses.filter((e) => e.category === "bus").reduce((sum, e) => sum + e.amount, 0);
    const hotelCost = tourExpenses.filter((e) => e.category === "hotel").reduce((sum, e) => sum + e.amount, 0);
    const foodCost = tourExpenses.filter((e) => e.category === "food").reduce((sum, e) => sum + e.amount, 0);
    const guideCost = tourExpenses.filter((e) => e.category === "guide").reduce((sum, e) => sum + e.amount, 0);
    const boatCost = tourExpenses.filter((e) => e.category === "boat").reduce((sum, e) => sum + e.amount, 0);
    const ticketsCost = tourExpenses.filter((e) => e.category === "tickets").reduce((sum, e) => sum + e.amount, 0);

    const grossProfit = tourRevenues - totalTourCost;
    const netProfit = grossProfit - totalOverhead - totalMarketing;

    // Previous month comparison
    const prevMonth = month === "2026-10" ? "2026-09" : "2026-08";
    const prevEntries = allEntries.filter((e) => e.monthYear === prevMonth);
    const prevRevenue = prevEntries.filter((e) => e.entryType === "income").reduce((sum, e) => sum + e.amount, 0);
    const prevCost = prevEntries.filter((e) => e.entryType !== "income").reduce((sum, e) => sum + e.amount, 0);
    const prevNetProfit = prevRevenue - prevCost;

    return Response.json({
      month,
      entries: currentMonthEntries,
      summary: {
        tourRevenues,
        totalTourCost,
        totalOverhead,
        totalMarketing,
        grossProfit,
        netProfit,
        breakdown: {
          busCost,
          hotelCost,
          foodCost,
          guideCost,
          boatCost,
          ticketsCost,
          officeRent: overheadExpenses.filter((e) => e.category === "office_rent").reduce((sum, e) => sum + e.amount, 0),
          wifiBill: overheadExpenses.filter((e) => e.category === "wifi").reduce((sum, e) => sum + e.amount, 0),
          marketing: totalMarketing,
        },
      },
      comparison: {
        prevMonth,
        prevRevenue,
        prevCost,
        prevNetProfit,
        revenueGrowthPercent: prevRevenue > 0 ? Math.round(((tourRevenues - prevRevenue) / prevRevenue) * 100) : 0,
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
    const newEntry = {
      monthYear: body.monthYear || "2026-10",
      tourId: body.tourId || null,
      entryType: body.entryType || "tour_expense",
      category: body.category || "other",
      amount: Number(body.amount) || 0,
      description: body.description || "",
      entryDate: body.entryDate || new Date().toISOString().split("T")[0],
    };

    const [result] = await db.insert(accountingEntries).values(newEntry);

    return Response.json({
      success: true,
      entry: { ...newEntry, id: (result as any)?.insertId },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
