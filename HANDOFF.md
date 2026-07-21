# Gold Clover — Devir & Deploy Rehberi (HANDOFF)

Bu dosya, projeyi devralan kişinin **hızlıca çalıştırıp Railway'e alması** içindir.
Detaylı açıklama için `README.md`'ye bak; burada sadece **ne yapacağın** var.

---

## Bu proje nedir?

Gold Clover Organizasyon (Ankara etkinlik firması) tanıtım sitesi.
- **Frontend:** Vite + React (tek sayfa / SPA, Türkçe)
- **Backend:** Express + Drizzle ORM + PostgreSQL
- **İş mantığı:** İletişim/teklif formu → gelen talepler DB'ye kaydolur → şifreli
  panelden (`/panel`) yönetilir (durum: Yeni / Arandı / Tamamlandı).

Tek sunucu her şeyi servis eder: üretimde React `dist`'i `sirv` ile, geliştirmede
Vite middleware ile. Yani ayrı frontend/backend host'u YOK — tek Railway servisi yeter.

---

## 1) Lokalde çalıştır (30 sn)

```bash
npm install
npm run dev          # http://localhost:3000
```

- `DATABASE_URL` yoksa form **geçici bellekte** çalışır (sunucu yeniden başlayınca silinir) — lokal deneme için yeterli.
- Panel: `http://localhost:3000/panel` — lokalde şifre yoksa **herhangi bir şey** yazıp gir.

---

## 2) Railway'e deploy (asıl iş)

### Adım adım
1. **Railway'de yeni proje** → GitHub repo'sunu bağla (veya Railway CLI: `railway up`).
2. Aynı projeye **PostgreSQL** servisi ekle (Railway → New → Database → PostgreSQL).
3. Web servisinin **Variables** sekmesine şunları gir:

   | Değişken | Değer | Not |
   | --- | --- | --- |
   | `DATABASE_URL` | Postgres servisinin `DATABASE_URL`'i | Railway'de Postgres'e tıkla → Variables → referansla bağla |
   | `NODE_ENV` | `production` | zorunlu |
   | `ADMIN_PASSWORD` | güçlü bir şifre | panel girişi; **production'da zorunlu** |
   | `ADMIN_SESSION_SECRET` | uzun rastgele değer | cookie imzası (örn. `openssl rand -hex 32`) |

4. Railway otomatik algılar:
   - **Build:** `npm run build`
   - **Start:** `npm start`   (Railway `PORT`'u kendi verir, kod onu okur)
5. İlk deploy'dan sonra **bir kez** tabloyu oluştur:
   ```bash
   npm run db:migrate
   ```
   Bunu ya Railway servis shell'inde, ya da lokalde aynı `DATABASE_URL`'i `.env`'e
   koyup çalıştır. `leads` tablosu oluşur. (İdempotent — tekrar çalıştırmak zararsız.)
6. Verilen `*.up.railway.app` adresini aç → formu doldur → `/panel`'de `ADMIN_PASSWORD` ile gir → talebi gör.

### Deploy sonrası hızlı kontrol
- [ ] Ana sayfa açılıyor
- [ ] Form gönderiliyor ("Teşekkürler! 🍀")
- [ ] `/panel` şifreyle açılıyor ve talep görünüyor (sarı "bellek" uyarısı YOK = Postgres bağlı)

---

## 3) API (referans)

| Yöntem | Yol | Erişim | Açıklama |
| --- | --- | --- | --- |
| POST | `/api/lead` | public | Form kaydı (IP rate-limit: dk'da 5) |
| POST | `/api/admin/login` | public | Panel girişi (`{password}`) |
| GET | `/api/admin/leads` | admin | Talep listesi |
| PATCH | `/api/admin/leads/:id` | admin | Durum güncelle (`{status}`) |
| DELETE | `/api/admin/leads/:id` | admin | Talep sil |

Admin uçları cookie (`gc_admin`, HttpOnly + prod'da Secure) ile korunur.

---

## 4) Proje yapısı

```
server/
  index.js      # Express giriş (dev: Vite middleware, prod: sirv dist + SPA fallback)
  api.js        # lead API + /panel admin + auth + rate-limit
db/
  schema.js     # Drizzle: leads tablosu
  index.js      # postgres.js bağlantısı (DATABASE_URL yoksa null → bellek fallback)
  migrate.js    # `npm run db:migrate` → tabloyu oluşturur
src/            # React SPA (Hero, About, Services, ... Contact, Footer)
```

`leads` tablosu: `id, name, phone, event_type, event_date, message, status, created_at`.

---

## 5) Devralan için yapılacaklar / açık uçlar

- [ ] **Gerçek görseller**: `public/images/` şu an AI (Higgsfield) görselleri; gerçek etkinlik fotoğraflarıyla değiştir.
- [ ] **Gerçek iletişim bilgileri**: `src/components/Contact.jsx` içindeki telefon/e-posta/adres placeholder — gerçekleriyle güncelle.
- [ ] **Özel alan adı**: Railway'de domain bağla (örn. goldclover.com.tr) → `Settings → Domains`.
- [ ] **(Opsiyonel) E-posta bildirimi**: Şu an sadece panel/DB var. İstenirse `/api/lead` içine SMTP/Resend eklenebilir.
- [ ] **(Opsiyonel) İçerik yönetimi**: Galeri/hizmetler şu an kodda sabit. CMS istenirse akuport'taki `settings`/`assets` deseni buraya taşınabilir.

> Not: Canlı bir Higgsfield sürümü (gold-clover.higgsfield.app) AYRI bir repo/host'tur.
> Bu repo, gerçek backend + veritabanı gerektirdiği için Railway'e taşınan sürümdür.
