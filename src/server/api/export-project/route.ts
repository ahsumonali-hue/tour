import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getAllProjectFiles(dirPath: string, rootDir: string, result: Record<string, string>) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    if (
      item === "node_modules" ||
      item === ".next" ||
      item === ".git" ||
      item === "dist" ||
      item === ".env.local" ||
      item === "package-lock.json" ||
      item === ".turbo" ||
      item === ".DS_Store"
    ) {
      continue;
    }

    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllProjectFiles(fullPath, rootDir, result);
    } else {
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        result[relativePath] = content;
      } catch (err) {
        // If binary or error, ignore or handle
        console.warn(`Could not read file: ${fullPath}`, err);
      }
    }
  }
}

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const files: Record<string, string> = {};

    getAllProjectFiles(projectRoot, projectRoot, files);

    // Add Readme
    files["README.md"] = `# Rajshahi Tours & Travels (রাজশাহী ট্যুরস এন্ড ট্রাভেলস)

Fullstack Tour Operator & Travel Agency Management System built with Next.js 15 App Router, React 19, Tailwind CSS, and PostgreSQL (Drizzle ORM).

## Setup Instructions:
1. Unzip the project folder.
2. Run \`npm install\` to install dependencies.
3. Configure \`DATABASE_URL\` in \`.env\` file with your PostgreSQL connection string:
   \`\`\`env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/rajshahi_tours"
   \`\`\`
4. Run \`npm run dev\`
5. Open \`http://localhost:3000\` in your browser.
`;

    return Response.json({
      success: true,
      totalFiles: Object.keys(files).length,
      files,
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
