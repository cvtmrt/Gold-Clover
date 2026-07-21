// Railway PostgreSQL tablolarını oluşturur (idempotent). `npm run db:migrate` ile çalışır.
// Şema referansı: db/schema.js ve db/migrations/0001_init.sql ile aynı yapıdır.
import "dotenv/config";
import { hasDb, sql } from "./index.js";

if (!hasDb) {
  console.error("HATA: DATABASE_URL tanımlı değil.");
  process.exit(1);
}

async function run() {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id          serial PRIMARY KEY,
      name        text NOT NULL,
      phone       text,
      event_type  text,
      event_date  text,
      message     text,
      status      text NOT NULL DEFAULT 'new',
      created_at  timestamp DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC)`;
  console.log("Migration tamamlandı: leads tablosu hazır.");
  await sql.end();
}

run().catch((err) => {
  console.error("Migration hatası:", err);
  process.exit(1);
});
