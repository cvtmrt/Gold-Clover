// Lead (teklif formu) API + ürün kataloğu + şifreli admin paneli (/panel).
// DATABASE_URL varsa Railway PostgreSQL'e, yoksa bellek-içi geçici depoya yazar.
import crypto from "crypto";
import multer from "multer";
import sharp from "sharp";
import { hasDb, sql } from "../db/index.js";

const isProduction = process.env.NODE_ENV === "production";

// DATABASE_URL yokken geliştirmede çalışması için geçici bellek depoları.
// Sunucu yeniden başlayınca sıfırlanır (kalıcı DEĞİL) — sadece lokal deneme içindir.
const memoryLeads = [];
let memoryLeadId = 1;
const memoryProducts = [];
let memoryProductId = 1;
const memoryGallery = [];
let memoryGalleryId = 1;

const VALID_STATUS = new Set(["new", "contacted", "done"]);
const VALID_BRAND = new Set(["organizasyon", "kuafor"]);
// Galeri kaydı türü: tek fotoğraf (model çalışması) ya da öncesi/sonrası ikilisi.
const VALID_GALLERY_KIND = new Set(["foto", "donusum"]);

// Görsel yükleme: bellekte tut, sharp ile WebP'ye sıkıştır, DB'de bytea sakla.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB ham üst sınır
});

async function toWebp(buffer) {
  return sharp(buffer)
    .rotate() // EXIF yönünü uygula
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

// Basit bellek-içi IP hız sınırı — public form spam koruması.
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5; // dakikada IP başına en fazla 5 gönderim
const rateHits = new Map();

function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || req.socket?.remoteAddress || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const hits = (rateHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateHits.set(ip, hits);
  if (rateHits.size > 5000) {
    for (const [key, times] of rateHits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) rateHits.delete(key);
    }
  }
  return hits.length > RATE_MAX;
}

function sessionValue() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-admin-session";
  return crypto.createHash("sha256").update(`goldclover:${secret}`).digest("hex");
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)])
  );
}

function requireAdmin(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.gc_admin === sessionValue()) return next();
  res.status(401).json({ ok: false, error: "Yetkisiz" });
}

// Basit string temizleme: kırp + üst sınır. Boşsa null döndürmek çağıranın işi.
function clean(value, max) {
  if (value === undefined || value === null) return "";
  return String(value).trim().slice(0, max);
}

function toInt(value, fallback = 0) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function toBool(value) {
  if (typeof value === "boolean") return value;
  const s = String(value).toLowerCase();
  return s === "true" || s === "1" || s === "on" || s === "yes";
}

export function mountApi(app) {
  // ============================================================
  // Public: teklif formu (organizasyon + kuaför)
  // ============================================================
  app.post("/api/lead", async (req, res) => {
    if (rateLimited(clientIp(req))) {
      res.status(429).json({ ok: false, error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." });
      return;
    }
    const body = req.body || {};
    const name = clean(body.name, 120);
    if (!name) {
      res.status(400).json({ ok: false, error: "Ad Soyad gerekli." });
      return;
    }
    const brandRaw = clean(body.brand, 20).toLowerCase();
    const brand = VALID_BRAND.has(brandRaw) ? brandRaw : "organizasyon";
    const lead = {
      name,
      phone: clean(body.phone, 40) || null,
      eventType: clean(body.type ?? body.eventType, 80) || null,
      eventDate: clean(body.date ?? body.eventDate, 20) || null,
      message: clean(body.message, 4000) || null,
      brand,
    };
    try {
      if (hasDb) {
        await sql`
          INSERT INTO leads (name, phone, event_type, event_date, message, brand)
          VALUES (${lead.name}, ${lead.phone}, ${lead.eventType}, ${lead.eventDate}, ${lead.message}, ${lead.brand})
        `;
      } else {
        memoryLeads.unshift({
          id: memoryLeadId++,
          ...lead,
          status: "new",
          createdAt: new Date().toISOString(),
        });
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("lead kayıt hatası:", err);
      res.status(500).json({ ok: false, error: "Kayıt alınamadı." });
    }
  });

  // ============================================================
  // Public: ürün kataloğu (organizasyon)
  // ============================================================
  app.get("/api/products", async (req, res) => {
    try {
      if (hasDb) {
        const rows = await sql`
          SELECT id, name, category, price, description, sort_order AS "sortOrder",
                 (image_data IS NOT NULL) AS "hasImage"
          FROM products
          WHERE active = true
          ORDER BY sort_order ASC, id ASC
        `;
        res.json({ items: rows });
        return;
      }
      const items = memoryProducts
        .filter((p) => p.active)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        .map(({ imageBuffer, imageType, ...rest }) => ({ ...rest, hasImage: Boolean(imageBuffer) }));
      res.json({ items });
    } catch (err) {
      console.error("ürün listesi hatası:", err);
      res.status(500).json({ ok: false, error: "Ürünler alınamadı." });
    }
  });

  app.get("/api/products/:id/image", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).end();
      return;
    }
    try {
      if (hasDb) {
        const [row] = await sql`SELECT image_type, image_data FROM products WHERE id = ${id}`;
        if (!row || !row.image_data) {
          res.status(404).end();
          return;
        }
        res.setHeader("Content-Type", row.image_type || "image/webp");
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.end(Buffer.from(row.image_data));
        return;
      }
      const p = memoryProducts.find((x) => x.id === id);
      if (!p || !p.imageBuffer) {
        res.status(404).end();
        return;
      }
      res.setHeader("Content-Type", p.imageType || "image/webp");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end(p.imageBuffer);
    } catch (err) {
      console.error("ürün görseli hatası:", err);
      res.status(500).end();
    }
  });

  // ============================================================
  // Admin: oturum
  // ============================================================
  app.get("/api/admin/session", requireAdmin, (req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/admin/login", (req, res) => {
    const password = req.body?.password || "";
    if (isProduction && !process.env.ADMIN_PASSWORD) {
      res.status(500).json({ ok: false, error: "ADMIN_PASSWORD production ortamında zorunlu." });
      return;
    }
    if (process.env.ADMIN_PASSWORD && password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ ok: false, error: "Parola hatalı." });
      return;
    }
    const secure = isProduction ? "; Secure" : "";
    res.setHeader(
      "Set-Cookie",
      `gc_admin=${encodeURIComponent(sessionValue())}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${secure}`
    );
    res.json({ ok: true });
  });

  app.post("/api/admin/logout", requireAdmin, (req, res) => {
    res.setHeader("Set-Cookie", "gc_admin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
    res.status(204).end();
  });

  // ============================================================
  // Admin: lead yönetimi
  // ============================================================
  app.get("/api/admin/leads", requireAdmin, async (req, res) => {
    try {
      if (hasDb) {
        const rows = await sql`
          SELECT id, name, phone, event_type AS "eventType", event_date AS "eventDate",
                 message, brand, status, created_at AS "createdAt"
          FROM leads ORDER BY created_at DESC NULLS LAST, id DESC
        `;
        res.json({ items: rows, db: true });
        return;
      }
      res.json({ items: memoryLeads, db: false });
    } catch (err) {
      console.error("lead listesi hatası:", err);
      res.status(500).json({ ok: false, error: "Liste alınamadı." });
    }
  });

  app.patch("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const status = clean(req.body?.status, 20);
    if (!Number.isInteger(id) || !VALID_STATUS.has(status)) {
      res.status(400).json({ ok: false, error: "Geçersiz istek." });
      return;
    }
    try {
      if (hasDb) {
        await sql`UPDATE leads SET status = ${status} WHERE id = ${id}`;
      } else {
        const lead = memoryLeads.find((x) => x.id === id);
        if (lead) lead.status = status;
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("lead güncelleme hatası:", err);
      res.status(500).json({ ok: false, error: "Güncellenemedi." });
    }
  });

  app.delete("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ ok: false, error: "Geçersiz istek." });
      return;
    }
    try {
      if (hasDb) {
        await sql`DELETE FROM leads WHERE id = ${id}`;
      } else {
        const i = memoryLeads.findIndex((x) => x.id === id);
        if (i >= 0) memoryLeads.splice(i, 1);
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("lead silme hatası:", err);
      res.status(500).json({ ok: false, error: "Silinemedi." });
    }
  });

  // ============================================================
  // Admin: ürün yönetimi
  // ============================================================
  app.get("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      if (hasDb) {
        const rows = await sql`
          SELECT id, name, category, price, description, active, sort_order AS "sortOrder",
                 (image_data IS NOT NULL) AS "hasImage", created_at AS "createdAt"
          FROM products ORDER BY sort_order ASC, id ASC
        `;
        res.json({ items: rows });
        return;
      }
      const items = memoryProducts
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        .map(({ imageBuffer, ...rest }) => ({ ...rest, hasImage: Boolean(imageBuffer) }));
      res.json({ items });
    } catch (err) {
      console.error("ürün listesi (admin) hatası:", err);
      res.status(500).json({ ok: false, error: "Liste alınamadı." });
    }
  });

  app.post("/api/admin/products", requireAdmin, upload.single("image"), async (req, res) => {
    const body = req.body || {};
    const name = clean(body.name, 160);
    if (!name) {
      res.status(400).json({ ok: false, error: "Ürün adı gerekli." });
      return;
    }
    const data = {
      name,
      category: clean(body.category, 80) || null,
      price: clean(body.price, 60) || null,
      description: clean(body.description, 2000) || null,
      active: body.active === undefined ? true : toBool(body.active),
      sortOrder: toInt(body.sortOrder, 0),
    };
    try {
      let imageBuffer = null;
      let imageType = null;
      if (req.file?.buffer) {
        imageBuffer = await toWebp(req.file.buffer);
        imageType = "image/webp";
      }
      if (hasDb) {
        const [row] = await sql`
          INSERT INTO products (name, category, price, description, image_type, image_data, active, sort_order)
          VALUES (${data.name}, ${data.category}, ${data.price}, ${data.description},
                  ${imageType}, ${imageBuffer}, ${data.active}, ${data.sortOrder})
          RETURNING id
        `;
        res.json({ ok: true, id: row.id });
      } else {
        const product = { id: memoryProductId++, ...data, imageType, imageBuffer, createdAt: new Date().toISOString() };
        memoryProducts.push(product);
        res.json({ ok: true, id: product.id });
      }
    } catch (err) {
      console.error("ürün ekleme hatası:", err);
      res.status(500).json({ ok: false, error: "Ürün eklenemedi." });
    }
  });

  app.patch("/api/admin/products/:id", requireAdmin, upload.single("image"), async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ ok: false, error: "Geçersiz istek." });
      return;
    }
    const body = req.body || {};
    const name = clean(body.name, 160);
    if (!name) {
      res.status(400).json({ ok: false, error: "Ürün adı gerekli." });
      return;
    }
    const data = {
      name,
      category: clean(body.category, 80) || null,
      price: clean(body.price, 60) || null,
      description: clean(body.description, 2000) || null,
      active: body.active === undefined ? true : toBool(body.active),
      sortOrder: toInt(body.sortOrder, 0),
    };
    try {
      let imageBuffer = null;
      if (req.file?.buffer) imageBuffer = await toWebp(req.file.buffer);

      if (hasDb) {
        if (imageBuffer) {
          await sql`
            UPDATE products SET name = ${data.name}, category = ${data.category}, price = ${data.price},
              description = ${data.description}, active = ${data.active}, sort_order = ${data.sortOrder},
              image_type = 'image/webp', image_data = ${imageBuffer}
            WHERE id = ${id}
          `;
        } else {
          await sql`
            UPDATE products SET name = ${data.name}, category = ${data.category}, price = ${data.price},
              description = ${data.description}, active = ${data.active}, sort_order = ${data.sortOrder}
            WHERE id = ${id}
          `;
        }
      } else {
        const p = memoryProducts.find((x) => x.id === id);
        if (p) {
          Object.assign(p, data);
          if (imageBuffer) {
            p.imageBuffer = imageBuffer;
            p.imageType = "image/webp";
          }
        }
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("ürün güncelleme hatası:", err);
      res.status(500).json({ ok: false, error: "Güncellenemedi." });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ ok: false, error: "Geçersiz istek." });
      return;
    }
    try {
      if (hasDb) {
        await sql`DELETE FROM products WHERE id = ${id}`;
      } else {
        const i = memoryProducts.findIndex((x) => x.id === id);
        if (i >= 0) memoryProducts.splice(i, 1);
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("ürün silme hatası:", err);
      res.status(500).json({ ok: false, error: "Silinemedi." });
    }
  });

  // ============================================================
  // Public: kuaför galeri
  // ============================================================
  app.get("/api/gallery", async (req, res) => {
    try {
      if (hasDb) {
        const rows = await sql`
          SELECT id, caption, kind, sort_order AS "sortOrder",
                 (image_data IS NOT NULL) AS "hasImage",
                 (image_data_after IS NOT NULL) AS "hasAfter"
          FROM gallery WHERE active = true ORDER BY sort_order ASC, id ASC
        `;
        res.json({ items: rows });
        return;
      }
      const items = memoryGallery
        .filter((g) => g.active)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        .map(({ imageBuffer, imageType, imageBufferAfter, imageTypeAfter, ...rest }) => ({
          ...rest,
          hasImage: Boolean(imageBuffer),
          hasAfter: Boolean(imageBufferAfter),
        }));
      res.json({ items });
    } catch (err) {
      console.error("galeri listesi hatası:", err);
      res.status(500).json({ ok: false, error: "Galeri alınamadı." });
    }
  });

  app.get("/api/gallery/:id/image", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).end();
      return;
    }
    try {
      if (hasDb) {
        const [row] = await sql`SELECT image_type, image_data FROM gallery WHERE id = ${id}`;
        if (!row || !row.image_data) {
          res.status(404).end();
          return;
        }
        res.setHeader("Content-Type", row.image_type || "image/webp");
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.end(Buffer.from(row.image_data));
        return;
      }
      const g = memoryGallery.find((x) => x.id === id);
      if (!g || !g.imageBuffer) {
        res.status(404).end();
        return;
      }
      res.setHeader("Content-Type", g.imageType || "image/webp");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end(g.imageBuffer);
    } catch (err) {
      console.error("galeri görseli hatası:", err);
      res.status(500).end();
    }
  });

  // "Öncesi/sonrası" kayıtlarının ikinci görseli (sonrası).
  app.get("/api/gallery/:id/image-after", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).end();
      return;
    }
    try {
      if (hasDb) {
        const [row] = await sql`SELECT image_type_after, image_data_after FROM gallery WHERE id = ${id}`;
        if (!row || !row.image_data_after) {
          res.status(404).end();
          return;
        }
        res.setHeader("Content-Type", row.image_type_after || "image/webp");
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.end(Buffer.from(row.image_data_after));
        return;
      }
      const g = memoryGallery.find((x) => x.id === id);
      if (!g || !g.imageBufferAfter) {
        res.status(404).end();
        return;
      }
      res.setHeader("Content-Type", g.imageTypeAfter || "image/webp");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end(g.imageBufferAfter);
    } catch (err) {
      console.error("galeri sonrası görseli hatası:", err);
      res.status(500).end();
    }
  });

  // ============================================================
  // Admin: kuaför galeri yönetimi
  // ============================================================
  app.get("/api/admin/gallery", requireAdmin, async (req, res) => {
    try {
      if (hasDb) {
        const rows = await sql`
          SELECT id, caption, kind, active, sort_order AS "sortOrder",
                 (image_data IS NOT NULL) AS "hasImage",
                 (image_data_after IS NOT NULL) AS "hasAfter", created_at AS "createdAt"
          FROM gallery ORDER BY sort_order ASC, id ASC
        `;
        res.json({ items: rows });
        return;
      }
      const items = memoryGallery
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        .map(({ imageBuffer, imageBufferAfter, ...rest }) => ({
          ...rest,
          hasImage: Boolean(imageBuffer),
          hasAfter: Boolean(imageBufferAfter),
        }));
      res.json({ items });
    } catch (err) {
      console.error("galeri (admin) hatası:", err);
      res.status(500).json({ ok: false, error: "Liste alınamadı." });
    }
  });

  const galleryUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "imageAfter", maxCount: 1 },
  ]);

  app.post("/api/admin/gallery", requireAdmin, galleryUpload, async (req, res) => {
    const before = req.files?.image?.[0];
    const after = req.files?.imageAfter?.[0];
    if (!before?.buffer) {
      res.status(400).json({ ok: false, error: "Görsel gerekli." });
      return;
    }
    const kind = VALID_GALLERY_KIND.has(clean(req.body?.kind, 20)) ? clean(req.body.kind, 20) : "foto";
    if (kind === "donusum" && !after?.buffer) {
      res.status(400).json({ ok: false, error: "Öncesi/sonrası için iki fotoğraf da gerekli." });
      return;
    }
    const caption = clean(req.body?.caption, 200) || null;
    const sortOrder = toInt(req.body?.sortOrder, 0);
    try {
      const imageBuffer = await toWebp(before.buffer);
      const imageBufferAfter = kind === "donusum" ? await toWebp(after.buffer) : null;
      if (hasDb) {
        const [row] = await sql`
          INSERT INTO gallery (caption, kind, image_type, image_data, image_type_after, image_data_after, active, sort_order)
          VALUES (${caption}, ${kind}, 'image/webp', ${imageBuffer},
                  ${imageBufferAfter ? "image/webp" : null}, ${imageBufferAfter}, true, ${sortOrder})
          RETURNING id
        `;
        res.json({ ok: true, id: row.id });
      } else {
        const g = {
          id: memoryGalleryId++,
          caption,
          kind,
          imageType: "image/webp",
          imageBuffer,
          imageTypeAfter: imageBufferAfter ? "image/webp" : null,
          imageBufferAfter,
          active: true,
          sortOrder,
          createdAt: new Date().toISOString(),
        };
        memoryGallery.push(g);
        res.json({ ok: true, id: g.id });
      }
    } catch (err) {
      console.error("galeri ekleme hatası:", err);
      res.status(500).json({ ok: false, error: "Eklenemedi." });
    }
  });

  // Açıklama/tür/sıra düzenleme. Görsel değiştirmez — foto değişecekse sil-yeniden yükle.
  app.patch("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ ok: false, error: "Geçersiz istek." });
      return;
    }
    const body = req.body || {};
    const caption = clean(body.caption, 200) || null;
    const sortOrder = toInt(body.sortOrder, 0);
    const active = body.active === undefined ? true : toBool(body.active);
    const kindRaw = clean(body.kind, 20);
    const kind = VALID_GALLERY_KIND.has(kindRaw) ? kindRaw : null;
    try {
      if (hasDb) {
        // 'donusum'a ancak ikinci görseli olan bir kayıt geçebilir.
        if (kind === "donusum") {
          const [row] = await sql`SELECT (image_data_after IS NOT NULL) AS has_after FROM gallery WHERE id = ${id}`;
          if (!row?.has_after) {
            res.status(400).json({ ok: false, error: "Bu kaydın 'sonrası' görseli yok." });
            return;
          }
        }
        await sql`
          UPDATE gallery
          SET caption = ${caption}, sort_order = ${sortOrder}, active = ${active},
              kind = COALESCE(${kind}, kind)
          WHERE id = ${id}
        `;
      } else {
        const g = memoryGallery.find((x) => x.id === id);
        if (g) {
          if (kind === "donusum" && !g.imageBufferAfter) {
            res.status(400).json({ ok: false, error: "Bu kaydın 'sonrası' görseli yok." });
            return;
          }
          Object.assign(g, { caption, sortOrder, active }, kind ? { kind } : {});
        }
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("galeri güncelleme hatası:", err);
      res.status(500).json({ ok: false, error: "Güncellenemedi." });
    }
  });

  app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ ok: false, error: "Geçersiz istek." });
      return;
    }
    try {
      if (hasDb) {
        await sql`DELETE FROM gallery WHERE id = ${id}`;
      } else {
        const i = memoryGallery.findIndex((x) => x.id === id);
        if (i >= 0) memoryGallery.splice(i, 1);
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("galeri silme hatası:", err);
      res.status(500).json({ ok: false, error: "Silinemedi." });
    }
  });

  // --- Yönetim paneli (kendi kendine yeten tek HTML sayfa) ---
  app.get("/panel", (req, res) => {
    res.type("html").send(PANEL_HTML);
  });
}

const PANEL_HTML = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Gold Clover — Panel</title>
<style>
  :root { --gold:#c9a24b; --gold-soft:#e3c67d; --bg:#0f0e0c; --card:#1a1814; --line:#2c2820; --text:#f4efe4; --muted:#a99f88; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font-family:'Jost',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
  a { color:var(--gold-soft); }
  .wrap { max-width:1080px; margin:0 auto; padding:28px 20px 90px; }
  header { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:20px; }
  .brand { display:flex; align-items:center; gap:10px; font-weight:600; letter-spacing:.5px; }
  .brand .dot { width:12px; height:12px; border-radius:50%; background:var(--gold); box-shadow:0 0 14px var(--gold); }
  h1 { font-size:18px; margin:0; }
  .btn { background:var(--gold); color:#1a1200; border:none; padding:10px 16px; border-radius:8px; font-weight:600; cursor:pointer; font-size:14px; }
  .btn.ghost { background:transparent; color:var(--muted); border:1px solid var(--line); }
  .btn.small { padding:7px 12px; font-size:13px; }
  .btn:hover { filter:brightness(1.05); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:22px; }
  .login { max-width:380px; margin:12vh auto 0; }
  .login h2 { margin:0 0 6px; font-size:20px; }
  .login p { color:var(--muted); margin:0 0 20px; font-size:14px; }
  input, select, textarea { width:100%; padding:11px 12px; border-radius:8px; border:1px solid var(--line); background:#100f0c; color:var(--text); font-size:14px; font-family:inherit; }
  textarea { resize:vertical; min-height:70px; }
  label.fl { display:block; font-size:12px; color:var(--muted); margin:12px 0 5px; text-transform:uppercase; letter-spacing:.5px; }
  .tabs { display:flex; gap:8px; margin-bottom:18px; }
  .tab { padding:9px 18px; border-radius:999px; border:1px solid var(--line); background:transparent; color:var(--muted); cursor:pointer; font-size:14px; font-weight:500; }
  .tab.active { background:var(--gold); color:#1a1200; border-color:var(--gold); }
  .stats { display:flex; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
  .stat { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:12px 18px; min-width:104px; }
  .stat b { display:block; font-size:22px; color:var(--gold-soft); }
  .stat span { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  th, td { text-align:left; padding:12px 10px; border-bottom:1px solid var(--line); vertical-align:top; }
  th { color:var(--muted); font-weight:500; font-size:12px; text-transform:uppercase; letter-spacing:.6px; }
  td .msg { color:var(--muted); max-width:240px; }
  .row-status { padding:6px 8px; font-size:13px; }
  .del { color:#e08a8a; background:none; border:none; cursor:pointer; font-size:13px; padding:0; }
  .edit { color:var(--gold-soft); background:none; border:none; cursor:pointer; font-size:13px; padding:0; margin-right:12px; }
  .empty { text-align:center; color:var(--muted); padding:40px 0; }
  .err { color:#e08a8a; font-size:13px; min-height:18px; margin-top:8px; }
  .badge { font-size:11px; padding:2px 8px; border-radius:999px; border:1px solid var(--line); color:var(--muted); }
  .badge.org { color:var(--gold-soft); border-color:rgba(227,198,125,.4); }
  .badge.kuafor { color:#e0b3c8; border-color:rgba(224,179,200,.4); }
  .badge.off { color:#c88; }
  .note { color:var(--muted); font-size:12px; margin-top:14px; }
  .tablewrap { overflow-x:auto; }
  .thumb { width:52px; height:52px; border-radius:8px; object-fit:cover; background:#100f0c; border:1px solid var(--line); }
  .ggrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:12px; }
  .gcard { position:relative; border:1px solid var(--line); border-radius:12px; overflow:hidden; background:var(--card); }
  .gthumb { width:100%; aspect-ratio:4/5; object-fit:cover; display:block; background:#100f0c; }
  .gcap { padding:8px 10px; font-size:12px; color:var(--muted); }
  .gpair { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--line); }
  .gpair .gside { position:relative; background:#100f0c; }
  .gpair .gside img { width:100%; aspect-ratio:4/5; object-fit:cover; display:block; }
  .gpair .gside span { position:absolute; left:6px; bottom:6px; font-size:10px; letter-spacing:.5px; text-transform:uppercase; background:rgba(15,14,12,.8); border:1px solid var(--line); border-radius:5px; padding:2px 6px; color:var(--gold-soft); }
  .gdel { position:absolute; top:8px; right:8px; background:rgba(15,14,12,.8); border:1px solid var(--line); border-radius:6px; padding:4px 8px; color:#e08a8a; }
  .prodform { display:grid; grid-template-columns:1fr 1fr; gap:12px 16px; margin-top:6px; }
  .prodform .full { grid-column:1 / -1; }
  .modal { position:fixed; inset:0; background:rgba(0,0,0,.6); display:none; align-items:flex-start; justify-content:center; padding:5vh 16px; z-index:50; overflow:auto; }
  .modal.show { display:flex; }
  .modal .card { width:min(560px,100%); }
  .row-actions { white-space:nowrap; }
  @media (max-width:560px){ .prodform { grid-template-columns:1fr; } }
</style>
</head>
<body>
<div class="wrap">
  <div id="app"></div>
</div>

<div class="modal" id="modal">
  <div class="card">
    <h2 id="pfTitle" style="margin:0 0 4px;font-size:18px">Ürün</h2>
    <div class="err" id="pfErr"></div>
    <form id="pf" class="prodform">
      <div><label class="fl">Ürün Adı *</label><input name="name" required maxlength="160" /></div>
      <div><label class="fl">Kategori</label><input name="category" maxlength="80" placeholder="Balon Konsepti / Çiçek..." /></div>
      <div><label class="fl">Fiyat</label><input name="price" maxlength="60" placeholder="₺350 / Talep üzerine" /></div>
      <div><label class="fl">Sıra</label><input name="sortOrder" type="number" value="0" /></div>
      <div class="full"><label class="fl">Açıklama</label><textarea name="description" maxlength="2000"></textarea></div>
      <div class="full"><label class="fl">Görsel (yükle)</label><input name="image" type="file" accept="image/*" /></div>
      <div class="full" style="display:flex;align-items:center;gap:8px">
        <input type="checkbox" name="active" id="pfActive" checked style="width:auto" />
        <label for="pfActive" style="margin:0;color:var(--text);font-size:14px">Sitede yayında</label>
      </div>
      <div class="full" style="display:flex;gap:10px;margin-top:6px">
        <button type="submit" class="btn" id="pfSave">Kaydet</button>
        <button type="button" class="btn ghost" id="pfCancel">İptal</button>
      </div>
    </form>
  </div>
</div>

<div class="modal" id="gmodal">
  <div class="card">
    <h2 style="margin:0 0 4px;font-size:18px">Galeri Fotoğrafı</h2>
    <div class="err" id="gfErr"></div>
    <form id="gf" class="prodform">
      <div class="full"><label class="fl">Tür</label>
        <select name="kind" id="gfKind">
          <option value="foto">Çalışma / Model fotoğrafı</option>
          <option value="donusum">Öncesi &amp; Sonrası</option>
        </select>
      </div>
      <div class="full"><label class="fl" id="gfLabel1">Fotoğraf *</label><input name="image" type="file" accept="image/*" required /></div>
      <div class="full" id="gfAfterWrap" style="display:none"><label class="fl">Sonrası *</label><input name="imageAfter" type="file" accept="image/*" /></div>
      <div><label class="fl">Açıklama (opsiyonel)</label><input name="caption" maxlength="200" placeholder="Saç · Gelin · Bakım..." /></div>
      <div><label class="fl">Sıra</label><input name="sortOrder" type="number" value="0" /></div>
      <div class="full" style="display:flex;gap:10px;margin-top:6px">
        <button type="submit" class="btn" id="gfSave">Yükle</button>
        <button type="button" class="btn ghost" id="gfCancel">İptal</button>
      </div>
    </form>
  </div>
</div>

<script>
  var app = document.getElementById("app");
  var modal = document.getElementById("modal");
  var gmodal = document.getElementById("gmodal");
  var view = "leads"; // leads | products
  var editingId = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }
  function api(path, opts) {
    return fetch(path, Object.assign({ headers: { "Content-Type": "application/json" } }, opts));
  }
  var STATUS = { "new":"Yeni", "contacted":"Arandı", "done":"Tamamlandı" };
  var BRAND = { "organizasyon":"Organizasyon", "kuafor":"Kuaför" };

  function renderLogin(msg) {
    app.innerHTML =
      '<div class="card login">' +
        '<h2>Gold Clover Panel</h2>' +
        '<p>Yönetici parolasıyla giriş yapın.</p>' +
        '<input id="pw" type="password" placeholder="Parola" autofocus />' +
        '<div class="err" id="err">' + esc(msg || "") + '</div>' +
        '<button class="btn" style="width:100%;margin-top:6px" id="loginBtn">Giriş</button>' +
      '</div>';
    document.getElementById("loginBtn").onclick = doLogin;
    document.getElementById("pw").onkeydown = function (e) { if (e.key === "Enter") doLogin(); };
  }

  function doLogin() {
    var pw = document.getElementById("pw").value;
    api("/api/admin/login", { method:"POST", body: JSON.stringify({ password: pw }) })
      .then(function (r) { return r.json().then(function (j) { return { ok:r.ok, j:j }; }); })
      .then(function (res) {
        if (res.ok) load();
        else document.getElementById("err").textContent = (res.j && res.j.error) || "Giriş başarısız.";
      })
      .catch(function () { document.getElementById("err").textContent = "Bağlantı hatası."; });
  }

  function logout() {
    api("/api/admin/logout", { method:"POST" }).then(function () { renderLogin(""); });
  }

  function shell(inner) {
    return '<header>' +
        '<div class="brand"><span class="dot"></span><h1>Gold Clover — Panel</h1></div>' +
        '<button class="btn ghost small" id="logoutBtn">Çıkış</button>' +
      '</header>' +
      '<div class="tabs">' +
        '<button class="tab ' + (view==="leads"?"active":"") + '" data-view="leads">Talepler</button>' +
        '<button class="tab ' + (view==="products"?"active":"") + '" data-view="products">Ürünler</button>' +
        '<button class="tab ' + (view==="gallery"?"active":"") + '" data-view="gallery">Kuaför Galeri</button>' +
      '</div>' + inner;
  }

  function wireShell() {
    document.getElementById("logoutBtn").onclick = logout;
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
      t.onclick = function () { view = t.getAttribute("data-view"); load(); };
    });
  }

  // ---------- Talepler ----------
  function statusSelect(lead) {
    var opts = "";
    for (var key in STATUS) {
      opts += '<option value="' + key + '"' + (lead.status === key ? " selected" : "") + '>' + STATUS[key] + '</option>';
    }
    return '<select class="row-status" data-id="' + lead.id + '">' + opts + '</select>';
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var value = String(iso);
    var hasTimeZone = /(?:Z|[+-][0-9]{2}:?[0-9]{2})$/i.test(value);
    var normalized = hasTimeZone ? value : value.replace(" ", "T") + "Z";
    var d = new Date(normalized);
    if (isNaN(d.getTime())) return esc(iso);
    return new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  }

  function renderLeads(items, db) {
    var counts = { "new":0, "contacted":0, "done":0 };
    items.forEach(function (l) { if (counts[l.status] != null) counts[l.status]++; });
    var rows = items.map(function (l) {
      var b = l.brand === "kuafor" ? "kuafor" : "org";
      return '<tr>' +
        '<td>' + esc(fmtDate(l.createdAt)) + '<br><span class="badge ' + b + '">' + esc(BRAND[l.brand] || "Organizasyon") + '</span></td>' +
        '<td><strong>' + esc(l.name) + '</strong>' + (l.phone ? '<br><a href="tel:' + esc(l.phone) + '">' + esc(l.phone) + '</a>' : '') + '</td>' +
        '<td>' + esc(l.eventType || "-") + (l.eventDate ? '<br><span class="badge">' + esc(l.eventDate) + '</span>' : '') + '</td>' +
        '<td class="msg">' + esc(l.message || "-") + '</td>' +
        '<td>' + statusSelect(l) + '</td>' +
        '<td class="row-actions"><button class="del" data-del="' + l.id + '">Sil</button></td>' +
      '</tr>';
    }).join("");

    app.innerHTML = shell(
      '<div class="stats">' +
        '<div class="stat"><b>' + items.length + '</b><span>Toplam</span></div>' +
        '<div class="stat"><b>' + counts["new"] + '</b><span>Yeni</span></div>' +
        '<div class="stat"><b>' + counts["contacted"] + '</b><span>Arandı</span></div>' +
        '<div class="stat"><b>' + counts["done"] + '</b><span>Tamamlandı</span></div>' +
      '</div>' +
      '<div class="card tablewrap">' +
        (items.length
          ? '<table><thead><tr><th>Tarih / Marka</th><th>Ad / Telefon</th><th>Tür / Tarih</th><th>Mesaj</th><th>Durum</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>'
          : '<div class="empty">Henüz talep yok.</div>') +
      '</div>' +
      (db ? '' : '<div class="note">⚠️ DATABASE_URL tanımlı değil — kayıtlar geçici bellekte tutuluyor, sunucu yeniden başlayınca silinir.</div>')
    );
    wireShell();
    Array.prototype.forEach.call(document.querySelectorAll(".row-status"), function (sel) {
      sel.onchange = function () { setStatus(sel.getAttribute("data-id"), sel.value); };
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-del]"), function (btn) {
      btn.onclick = function () { delLead(btn.getAttribute("data-del")); };
    });
  }

  function setStatus(id, status) {
    api("/api/admin/leads/" + id, { method:"PATCH", body: JSON.stringify({ status: status }) });
  }
  function delLead(id) {
    if (!confirm("Bu talep silinsin mi?")) return;
    api("/api/admin/leads/" + id, { method:"DELETE" }).then(function () { load(); });
  }

  // ---------- Ürünler ----------
  function renderProducts(items) {
    var rows = items.map(function (p) {
      var img = p.hasImage ? '<img class="thumb" src="/api/products/' + p.id + '/image?v=' + Date.now() + '" alt="" />' : '<div class="thumb"></div>';
      return '<tr>' +
        '<td>' + img + '</td>' +
        '<td><strong>' + esc(p.name) + '</strong>' + (p.category ? '<br><span class="badge">' + esc(p.category) + '</span>' : '') + '</td>' +
        '<td>' + esc(p.price || "-") + '</td>' +
        '<td>' + (p.active ? '<span class="badge org">Yayında</span>' : '<span class="badge off">Gizli</span>') + '</td>' +
        '<td>' + esc(p.sortOrder) + '</td>' +
        '<td class="row-actions"><button class="edit" data-edit="' + p.id + '">Düzenle</button><button class="del" data-delp="' + p.id + '">Sil</button></td>' +
      '</tr>';
    }).join("");

    app.innerHTML = shell(
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<div class="stat" style="min-width:0"><b>' + items.length + '</b><span>Ürün</span></div>' +
        '<button class="btn" id="addProd">+ Yeni Ürün</button>' +
      '</div>' +
      '<div class="card tablewrap">' +
        (items.length
          ? '<table><thead><tr><th>Görsel</th><th>Ad / Kategori</th><th>Fiyat</th><th>Durum</th><th>Sıra</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>'
          : '<div class="empty">Henüz ürün yok. “+ Yeni Ürün” ile ekleyin.</div>') +
      '</div>'
    );
    wireShell();
    document.getElementById("addProd").onclick = function () { openProduct(null); };
    Array.prototype.forEach.call(document.querySelectorAll("[data-edit]"), function (b) {
      b.onclick = function () { openProduct(items.find(function(x){ return String(x.id)===b.getAttribute("data-edit"); })); };
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-delp]"), function (b) {
      b.onclick = function () { delProduct(b.getAttribute("data-delp")); };
    });
  }

  function openProduct(p) {
    editingId = p ? p.id : null;
    document.getElementById("pfTitle").textContent = p ? "Ürünü Düzenle" : "Yeni Ürün";
    document.getElementById("pfErr").textContent = "";
    var f = document.getElementById("pf");
    f.name.value = p ? (p.name || "") : "";
    f.category.value = p ? (p.category || "") : "";
    f.price.value = p ? (p.price || "") : "";
    f.sortOrder.value = p ? (p.sortOrder || 0) : 0;
    f.description.value = p ? (p.description || "") : "";
    f.image.value = "";
    f.active.checked = p ? !!p.active : true;
    modal.classList.add("show");
  }
  function closeProduct() { modal.classList.remove("show"); }

  function delProduct(id) {
    if (!confirm("Bu ürün silinsin mi?")) return;
    api("/api/admin/products/" + id, { method:"DELETE" }).then(function () { load(); });
  }

  document.getElementById("pfCancel").onclick = closeProduct;
  modal.onclick = function (e) { if (e.target === modal) closeProduct(); };
  document.getElementById("pf").onsubmit = function (e) {
    e.preventDefault();
    var f = e.currentTarget;
    var fd = new FormData();
    fd.append("name", f.name.value);
    fd.append("category", f.category.value);
    fd.append("price", f.price.value);
    fd.append("sortOrder", f.sortOrder.value || "0");
    fd.append("description", f.description.value);
    fd.append("active", f.active.checked ? "true" : "false");
    if (f.image.files[0]) fd.append("image", f.image.files[0]);
    var url = editingId ? "/api/admin/products/" + editingId : "/api/admin/products";
    var method = editingId ? "PATCH" : "POST";
    document.getElementById("pfSave").disabled = true;
    fetch(url, { method: method, body: fd })
      .then(function (r) { return r.json().then(function (j) { return { ok:r.ok, j:j }; }); })
      .then(function (res) {
        document.getElementById("pfSave").disabled = false;
        if (res.ok) { closeProduct(); load(); }
        else document.getElementById("pfErr").textContent = (res.j && res.j.error) || "Kaydedilemedi.";
      })
      .catch(function () {
        document.getElementById("pfSave").disabled = false;
        document.getElementById("pfErr").textContent = "Bağlantı hatası.";
      });
  };

  // ---------- Kuaför Galeri ----------
  function renderGallery(items) {
    var cards = items.map(function (g) {
      var v = "?v=" + Date.now();
      var img = g.hasImage ? '<img class="gthumb" src="/api/gallery/' + g.id + '/image' + v + '" alt="" />' : '<div class="gthumb"></div>';
      if (g.kind === "donusum" && g.hasAfter) {
        img = '<div class="gpair">' +
          '<div class="gside"><img src="/api/gallery/' + g.id + '/image' + v + '" alt="" /><span>Önce</span></div>' +
          '<div class="gside"><img src="/api/gallery/' + g.id + '/image-after' + v + '" alt="" /><span>Sonra</span></div>' +
        '</div>';
      }
      return '<div class="gcard">' + img +
        '<div class="gcap">' +
          '<span class="badge ' + (g.kind === "donusum" ? "kuafor" : "org") + '">' +
            (g.kind === "donusum" ? "Öncesi & Sonrası" : "Çalışma") +
          '</span>' +
          (g.caption ? " " + esc(g.caption) : "") +
          '<br><button class="edit" data-editg="' + g.id + '">Yazıyı düzenle</button>' +
        '</div>' +
        '<button class="del gdel" data-delg="' + g.id + '">Sil</button>' +
      '</div>';
    }).join("");
    app.innerHTML = shell(
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<div class="stat" style="min-width:0"><b>' + items.length + '</b><span>Fotoğraf</span></div>' +
        '<button class="btn" id="addG">+ Foto Ekle</button>' +
      '</div>' +
      (items.length ? '<div class="ggrid">' + cards + '</div>' : '<div class="card"><div class="empty">Henüz fotoğraf yok. “+ Foto Ekle” ile yükleyin.</div></div>')
    );
    wireShell();
    document.getElementById("addG").onclick = openGallery;
    Array.prototype.forEach.call(document.querySelectorAll("[data-delg]"), function (b) {
      b.onclick = function () { delGallery(b.getAttribute("data-delg")); };
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-editg]"), function (b) {
      b.onclick = function () {
        var id = b.getAttribute("data-editg");
        var g = items.filter(function (x) { return String(x.id) === id; })[0] || {};
        editGallery(g);
      };
    });
  }

  // Görseli değiştirmeden açıklama/sıra düzenleme.
  function editGallery(g) {
    var caption = prompt("Fotoğrafın açıklaması:", g.caption || "");
    if (caption === null) return;
    api("/api/admin/gallery/" + g.id, {
      method: "PATCH",
      body: JSON.stringify({ caption: caption, sortOrder: g.sortOrder || 0, active: g.active !== false })
    }).then(function () { load(); });
  }
  function openGallery() {
    document.getElementById("gfErr").textContent = "";
    document.getElementById("gf").reset();
    syncGalleryKind();
    gmodal.classList.add("show");
  }
  function syncGalleryKind() {
    var donusum = document.getElementById("gfKind").value === "donusum";
    document.getElementById("gfAfterWrap").style.display = donusum ? "" : "none";
    document.getElementById("gfLabel1").textContent = donusum ? "Öncesi *" : "Fotoğraf *";
  }
  document.getElementById("gfKind").onchange = syncGalleryKind;
  function closeGallery() { gmodal.classList.remove("show"); }
  function delGallery(id) {
    if (!confirm("Bu fotoğraf silinsin mi?")) return;
    api("/api/admin/gallery/" + id, { method:"DELETE" }).then(function () { load(); });
  }
  document.getElementById("gfCancel").onclick = closeGallery;
  gmodal.onclick = function (e) { if (e.target === gmodal) closeGallery(); };
  document.getElementById("gf").onsubmit = function (e) {
    e.preventDefault();
    var f = e.currentTarget;
    var kind = f.kind.value === "donusum" ? "donusum" : "foto";
    if (!f.image.files[0]) {
      document.getElementById("gfErr").textContent = kind === "donusum" ? "Öncesi fotoğrafını seçin." : "Fotoğraf seçin.";
      return;
    }
    if (kind === "donusum" && !f.imageAfter.files[0]) {
      document.getElementById("gfErr").textContent = "Sonrası fotoğrafını seçin.";
      return;
    }
    var fd = new FormData();
    fd.append("kind", kind);
    fd.append("image", f.image.files[0]);
    if (kind === "donusum") fd.append("imageAfter", f.imageAfter.files[0]);
    fd.append("caption", f.caption.value);
    fd.append("sortOrder", f.sortOrder.value || "0");
    document.getElementById("gfSave").disabled = true;
    fetch("/api/admin/gallery", { method:"POST", body: fd })
      .then(function (r) { return r.json().then(function (j) { return { ok:r.ok, j:j }; }); })
      .then(function (res) {
        document.getElementById("gfSave").disabled = false;
        if (res.ok) { closeGallery(); load(); }
        else document.getElementById("gfErr").textContent = (res.j && res.j.error) || "Yüklenemedi.";
      })
      .catch(function () {
        document.getElementById("gfSave").disabled = false;
        document.getElementById("gfErr").textContent = "Bağlantı hatası.";
      });
  };

  // ---------- Yükleme ----------
  function load() {
    if (view === "products") {
      api("/api/admin/products").then(function (r) {
        if (r.status === 401) { renderLogin(""); return null; }
        return r.json();
      }).then(function (data) { if (data) renderProducts(data.items || []); })
        .catch(function () { renderLogin("Bağlantı hatası."); });
    } else if (view === "gallery") {
      api("/api/admin/gallery").then(function (r) {
        if (r.status === 401) { renderLogin(""); return null; }
        return r.json();
      }).then(function (data) { if (data) renderGallery(data.items || []); })
        .catch(function () { renderLogin("Bağlantı hatası."); });
    } else {
      api("/api/admin/leads").then(function (r) {
        if (r.status === 401) { renderLogin(""); return null; }
        return r.json();
      }).then(function (data) { if (data) renderLeads(data.items || [], data.db); })
        .catch(function () { renderLogin("Bağlantı hatası."); });
    }
  }

  load();
</script>
</body>
</html>`;
