// PostgreSQL bağlantısı (Railway). DATABASE_URL yoksa DB devre dışı kalır ve
// uygulama bellek-içi geçici kayıtla çalışır (geliştirme kolaylığı için).
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

const url = process.env.DATABASE_URL;
export const hasDb = Boolean(url);

const needSsl = url && !/localhost|127\.0\.0\.1/.test(url);

export const sql = hasDb
  ? postgres(url, { ssl: needSsl ? "require" : false, max: 5 })
  : null;

export const db = hasDb ? drizzle(sql, { schema }) : null;
