-- Gold Clover — başlangıç tabloları.
CREATE TABLE IF NOT EXISTS leads (
  id          serial PRIMARY KEY,
  name        text NOT NULL,
  phone       text,
  event_type  text,
  event_date  text,
  message     text,
  status      text NOT NULL DEFAULT 'new',
  created_at  timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
