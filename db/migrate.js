// Railway PostgreSQL tablolarını oluşturur (idempotent). `npm run db:migrate` ile çalışır.
// Aynı şemayı sunucu da açılışta uygular (bkz. db/ensure-schema.js), bu script
// sadece elle/CI'dan çalıştırmak isteyenler için duruyor.
import "dotenv/config";
import { hasDb, sql } from "./index.js";
import { ensureSchema } from "./ensure-schema.js";

if (!hasDb) {
  console.error("HATA: DATABASE_URL tanımlı değil.");
  process.exit(1);
}

async function run() {
  await ensureSchema();
  console.log("Migration tamamlandı: leads tablosu hazır.");
  await sql.end();
}

run().catch((err) => {
  console.error("Migration hatası:", err);
  process.exit(1);
});
