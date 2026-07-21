// leads tablosunu oluşturur (idempotent). Hem `npm run db:migrate` hem de sunucu
// açılışı bunu kullanır — böylece Railway'de elle migration çalıştırmak gerekmez.
// Şema referansı: db/schema.js ve db/migrations/0001_init.sql ile aynı yapıdır.
import { hasDb, sql } from "./index.js";

export async function ensureSchema() {
  if (!hasDb) return false;

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

  return true;
}
