import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const databaseUrl =
  process.env.DATABASE_URL ||
  "mysql://root:butterflyPHPadmin77!@127.0.0.1:3306/tour_db";

const globalForDb = globalThis as typeof globalThis & {
  __tourMysqlPool?: mysql.Pool;
};

export const pool =
  globalForDb.__tourMysqlPool ??
  mysql.createPool({
    uri: databaseUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__tourMysqlPool = pool;
}

export const db = drizzle(pool);
