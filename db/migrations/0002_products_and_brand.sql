-- 0002 — Ürün kataloğu + lead marka ayrımı.
-- Not: Asıl kaynak db/ensure-schema.js (açılışta idempotent uygulanır).
-- Bu dosya parity/dokümantasyon içindir.

ALTER TABLE leads ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'organizasyon';

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
);

CREATE INDEX IF NOT EXISTS products_sort_idx ON products (active, sort_order, id);
