// leads + products tablolarını oluşturur (idempotent). Hem `npm run db:migrate`
// hem de sunucu açılışı bunu kullanır — böylece Railway'de elle migration gerekmez.
// Şema referansı: db/schema.js ve db/migrations/*.sql ile aynı yapıdadır.
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
  // Sonradan eklenen kolon — mevcut Railway tablosuna güvenle uygula.
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'organizasyon'`;
  await sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC)`;

  // Organizasyon ürün kataloğu — görsel WebP olarak bytea'da.
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id          serial PRIMARY KEY,
      name        text NOT NULL,
      category    text,
      price       text,
      description text,
      image_type  text,
      image_data  bytea,
      active      boolean NOT NULL DEFAULT true,
      sort_order  integer NOT NULL DEFAULT 0,
      created_at  timestamp DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS products_sort_idx ON products (active, sort_order, id)`;

  // Kuaför galeri fotoğrafları.
  await sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id          serial PRIMARY KEY,
      caption     text,
      image_type  text,
      image_data  bytea,
      active      boolean NOT NULL DEFAULT true,
      sort_order  integer NOT NULL DEFAULT 0,
      created_at  timestamp DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS gallery_sort_idx ON gallery (active, sort_order, id)`;
  // Sonradan eklenen: "öncesi/sonrası" kayıtları. kind='foto' tek görsel (model
  // çalışması), kind='donusum' ise image_data = öncesi, image_data_after = sonrası.
  await sql`ALTER TABLE gallery ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'foto'`;
  await sql`ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_type_after text`;
  await sql`ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_data_after bytea`;

  return true;
}
