-- 0003 — Kuaför galerisine "öncesi / sonrası" kategorisi.
-- Not: Asıl kaynak db/ensure-schema.js (açılışta idempotent uygulanır).
-- Bu dosya parity/dokümantasyon içindir.

-- kind='foto'     → tek görsel (model çalışması), image_data kullanılır.
-- kind='donusum'  → image_data = öncesi, image_data_after = sonrası.
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'foto';
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_type_after text;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_data_after bytea;
