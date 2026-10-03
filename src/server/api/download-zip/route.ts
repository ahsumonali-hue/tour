import JSZip from "jszip";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function addDirectoryToZip(zip: JSZip, dirPath: string, rootDir: string) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    if (
      item === "node_modules" ||
      item === ".next" ||
      item === ".git" ||
      item === "dist" ||
      item === ".env.local" ||
      item === "package-lock.json"
    ) {
      continue;
    }

    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const folder = zip.folder(relativePath);
      if (folder) {
        addDirectoryToZip(zip, fullPath, rootDir);
      }
    } else {
      try {
        const fileContent = fs.readFileSync(fullPath);
        zip.file(relativePath, fileContent);
      } catch (err) {
        console.warn(`Could not read file for zip: ${fullPath}`, err);
      }
    }
  }
}

export async function GET() {
  try {
    const zip = new JSZip();
    const projectRoot = process.cwd();

    addDirectoryToZip(zip, projectRoot, projectRoot);

    // Add README.md for the downloaded zip
    const readmeContent = `# Rajshahi Tours & Travels (রাজশাহী ট্যুরস এন্ড ট্রাভেলস)

Fullstack Tour Operator & Travel Agency Management System built with Next.js 15 App Router, React 19, Tailwind CSS, and PostgreSQL (Drizzle ORM).

## Features Included:
- **Public Website**: Landing page, upcoming tours, tour details & booking inquiry, photo gallery, past tour memories, traveler feedback, phone & WhatsApp contact integration.
- **Role-Based Staff Dashboard**:
  - Owner (Safayat Hossain) - Full financial budgeting, SMS campaigns, business settings, team oversight
  - Admin (Tanvir Ahmed) - Bookings, Leads & Inquiries Kanban, Customers CRM, SMS
  - Tour Guide (Rakibul Islam) - Live in-tour SMS broadcast ("Lunch is ready", departure alerts), traveler checklist, ground network contacts
  - Accountant (Mahmudul Hasan) - Tour profit & loss, expense tracking, monthly financial statements, exportable receipt
  - Staff (Nusrat Jahan) - Lead follow-ups and booking entries
- **In-Tour SMS Broadcast System**: Real-time broadcast to confirmed travelers with live mobile SMS preview, unicode character count, and message log.
- **Inquiries CRM Kanban**: Follow-up notes, 1-click booking converter, lead pipeline.
- **7-Step Tour Wizard**: Schedule auto-calculation, packages & pricing, bus & guide assignments, meal planner, day-by-day itinerary, profit/loss break-even calculator.
- **Ground Network Contacts**: Hotels, resorts, Chander gari, boats, and restaurants database with 1-click call/WhatsApp.
- **Traveler Feedback System**: Interactive rating and public feedback submission link.

## Getting Started:
1. \`npm install\`
2. Configure \`DATABASE_URL\` in \`.env\`
3. Run \`npm run dev\`
4. Visit \`http://localhost:3000\`
`;

    zip.file("README_RAJSHAHI_TOURS.md", readmeContent);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const filename = `rajshahi-tours-and-travels-source-${new Date().toISOString().split("T")[0]}.zip`;

    return new Response(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("ZIP Generation error:", err);
    return Response.json({ error: "Failed to generate ZIP archive: " + String(err) }, { status: 500 });
  }
}
