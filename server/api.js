// Lead (teklif formu) API + şifreli admin paneli (/panel).
// DATABASE_URL varsa Railway PostgreSQL'e, yoksa bellek-içi geçici diziye yazar.
import crypto from "crypto";
import { hasDb, sql } from "../db/index.js";

const isProduction = process.env.NODE_ENV === "production";

// DATABASE_URL yokken geliştirmede formun çalışması için geçici bellek deposu.
// Sunucu yeniden başlayınca sıfırlanır (kalıcı DEĞİL) — sadece lokal deneme içindir.
const memoryLeads = [];
let memoryId = 1;

const VALID_STATUS = new Set(["new", "contacted", "done"]);

// Basit bellek-içi IP hız sınırı — public form spam koruması.
// Tek instance için yeterli; çok-instance ölçekte Redis'e taşınmalı.
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
  // Map'in sınırsız büyümesini engelle: ara sıra eski kayıtları temizle.
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

export function mountApi(app) {
  // --- Public: teklif formu ---
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
    const lead = {
      name,
      phone: clean(body.phone, 40) || null,
      eventType: clean(body.type ?? body.eventType, 80) || null,
      eventDate: clean(body.date ?? body.eventDate, 20) || null,
      message: clean(body.message, 4000) || null,
    };
    try {
      if (hasDb) {
        await sql`
          INSERT INTO leads (name, phone, event_type, event_date, message)
          VALUES (${lead.name}, ${lead.phone}, ${lead.eventType}, ${lead.eventDate}, ${lead.message})
        `;
      } else {
        memoryLeads.unshift({
          id: memoryId++,
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

  // --- Admin oturum ---
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

  // --- Admin: lead yönetimi ---
  app.get("/api/admin/leads", requireAdmin, async (req, res) => {
    try {
      if (hasDb) {
        const rows = await sql`
          SELECT id, name, phone, event_type AS "eventType", event_date AS "eventDate",
                 message, status, created_at AS "createdAt"
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
  .wrap { max-width:1040px; margin:0 auto; padding:28px 20px 80px; }
  header { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:24px; }
  .brand { display:flex; align-items:center; gap:10px; font-weight:600; letter-spacing:.5px; }
  .brand .dot { width:12px; height:12px; border-radius:50%; background:var(--gold); box-shadow:0 0 14px var(--gold); }
  h1 { font-size:18px; margin:0; }
  .btn { background:var(--gold); color:#1a1200; border:none; padding:10px 16px; border-radius:8px; font-weight:600; cursor:pointer; font-size:14px; }
  .btn.ghost { background:transparent; color:var(--muted); border:1px solid var(--line); }
  .btn:hover { filter:brightness(1.05); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:22px; }
  .login { max-width:380px; margin:12vh auto 0; }
  .login h2 { margin:0 0 6px; font-size:20px; }
  .login p { color:var(--muted); margin:0 0 20px; font-size:14px; }
  input, select { width:100%; padding:11px 12px; border-radius:8px; border:1px solid var(--line); background:#100f0c; color:var(--text); font-size:14px; }
  .stats { display:flex; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
  .stat { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:12px 18px; min-width:110px; }
  .stat b { display:block; font-size:22px; color:var(--gold-soft); }
  .stat span { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  th, td { text-align:left; padding:12px 10px; border-bottom:1px solid var(--line); vertical-align:top; }
  th { color:var(--muted); font-weight:500; font-size:12px; text-transform:uppercase; letter-spacing:.6px; }
  td .msg { color:var(--muted); max-width:260px; }
  .row-status { padding:6px 8px; font-size:13px; }
  .del { color:#e08a8a; background:none; border:none; cursor:pointer; font-size:13px; }
  .empty { text-align:center; color:var(--muted); padding:40px 0; }
  .err { color:#e08a8a; font-size:13px; min-height:18px; margin-top:8px; }
  .badge { font-size:11px; padding:2px 8px; border-radius:999px; border:1px solid var(--line); color:var(--muted); }
  .note { color:var(--muted); font-size:12px; margin-top:14px; }
  .tablewrap { overflow-x:auto; }
</style>
</head>
<body>
<div class="wrap">
  <div id="app"></div>
</div>
<script>
  var app = document.getElementById("app");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }
  function api(path, opts) {
    return fetch(path, Object.assign({ headers: { "Content-Type": "application/json" } }, opts));
  }
  var STATUS = { "new":"Yeni", "contacted":"Arandı", "done":"Tamamlandı" };

  function renderLogin(msg) {
    app.innerHTML =
      '<div class="card login">' +
        '<h2>Gold Clover Panel</h2>' +
        '<p>Yönetici parolasıyla giriş yapın.</p>' +
        '<input id="pw" type="password" placeholder="Parola" autofocus />' +
        '<div class="err" id="err">' + esc(msg || "") + '</div>' +
        '<button class="btn" style="width:100%;margin-top:6px" id="loginBtn">Giriş</button>' +
      '</div>';
    var pw = document.getElementById("pw");
    document.getElementById("loginBtn").onclick = doLogin;
    pw.onkeydown = function (e) { if (e.key === "Enter") doLogin(); };
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

  function statusSelect(lead) {
    var opts = "";
    for (var key in STATUS) {
      opts += '<option value="' + key + '"' + (lead.status === key ? " selected" : "") + '>' + STATUS[key] + '</option>';
    }
    return '<select class="row-status" data-id="' + lead.id + '">' + opts + '</select>';
  }

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return esc(iso);
    return d.toLocaleDateString("tr-TR") + " " + d.toLocaleTimeString("tr-TR", { hour:"2-digit", minute:"2-digit" });
  }

  function render(items, db) {
    var counts = { "new":0, "contacted":0, "done":0 };
    items.forEach(function (l) { if (counts[l.status] != null) counts[l.status]++; });

    var rows = items.map(function (l) {
      return '<tr>' +
        '<td>' + esc(fmtDate(l.createdAt)) + '</td>' +
        '<td><strong>' + esc(l.name) + '</strong>' + (l.phone ? '<br><a href="tel:' + esc(l.phone) + '">' + esc(l.phone) + '</a>' : '') + '</td>' +
        '<td>' + esc(l.eventType || "-") + (l.eventDate ? '<br><span class="badge">' + esc(l.eventDate) + '</span>' : '') + '</td>' +
        '<td class="msg">' + esc(l.message || "-") + '</td>' +
        '<td>' + statusSelect(l) + '</td>' +
        '<td><button class="del" data-del="' + l.id + '">Sil</button></td>' +
      '</tr>';
    }).join("");

    app.innerHTML =
      '<header>' +
        '<div class="brand"><span class="dot"></span><h1>Gold Clover — Talepler</h1></div>' +
        '<button class="btn ghost" id="logoutBtn">Çıkış</button>' +
      '</header>' +
      '<div class="stats">' +
        '<div class="stat"><b>' + items.length + '</b><span>Toplam</span></div>' +
        '<div class="stat"><b>' + counts["new"] + '</b><span>Yeni</span></div>' +
        '<div class="stat"><b>' + counts["contacted"] + '</b><span>Arandı</span></div>' +
        '<div class="stat"><b>' + counts["done"] + '</b><span>Tamamlandı</span></div>' +
      '</div>' +
      '<div class="card tablewrap">' +
        (items.length
          ? '<table><thead><tr><th>Tarih</th><th>Ad / Telefon</th><th>Tür / Tarih</th><th>Mesaj</th><th>Durum</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>'
          : '<div class="empty">Henüz talep yok.</div>') +
      '</div>' +
      (db ? '' : '<div class="note">⚠️ DATABASE_URL tanımlı değil — kayıtlar geçici bellekte tutuluyor, sunucu yeniden başlayınca silinir.</div>');

    document.getElementById("logoutBtn").onclick = logout;
    Array.prototype.forEach.call(document.querySelectorAll(".row-status"), function (sel) {
      sel.onchange = function () { setStatus(sel.getAttribute("data-id"), sel.value); };
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-del]"), function (btn) {
      btn.onclick = function () { del(btn.getAttribute("data-del")); };
    });
  }

  function setStatus(id, status) {
    api("/api/admin/leads/" + id, { method:"PATCH", body: JSON.stringify({ status: status }) });
  }
  function del(id) {
    if (!confirm("Bu talep silinsin mi?")) return;
    api("/api/admin/leads/" + id, { method:"DELETE" }).then(function () { load(); });
  }

  function load() {
    api("/api/admin/leads").then(function (r) {
      if (r.status === 401) { renderLogin(""); return null; }
      return r.json();
    }).then(function (data) {
      if (data) render(data.items || [], data.db);
    }).catch(function () { renderLogin("Bağlantı hatası."); });
  }

  load();
</script>
</body>
</html>`;
