# Gold Clover — Devir & Deploy Rehberi (HANDOFF)

Bu dosya, projeyi devralan kişinin **hızlıca çalıştırıp Railway'e alması** içindir.
Detaylı açıklama için `README.md`'ye bak; burada sadece **ne yapacağın** var.

---

## Bu proje nedir?

**İki markalı** tanıtım sitesi — ikisi de Ankara/Balgat'ta, aynı adreste:
**Gold Clover Organizasyon** (etkinlik) ve **Dilek Sanık — Hair & Beauty Center** (Balgat, güzellik).

- **Frontend:** Vite + React + react-router-dom (SPA, Türkçe). 4 rota:
  `/` portal (marka seçim ekranı) · `/organizasyon` · `/urunler` · `/kuafor`
- **Backend:** Express + Drizzle ORM + PostgreSQL
- **İş mantığı:** İletişim/teklif formu → gelen talepler DB'ye kaydolur → şifreli
  panelden (`/panel`) yönetilir (durum: Yeni / Arandı / Tamamlandı). Panel sekmeli:
  Talepler | Ürünler. Talepler `brand` (organizasyon|kuafor) ile ayrışır.
- **Ürün kataloğu:** panelden yönetilir, görseller `sharp` ile WebP'ye çevrilip DB'de
  `bytea` olarak tutulur (Railway diski kalıcı değil).
- **SEO:** SPA olmasına rağmen `server/seo.js` her URL için doğru
  title/description/canonical/OG/JSON-LD enjekte eder; tanımsız yollar 404 + noindex döner.

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
5. **Tablo oluşturma otomatik** — sunucu her açılışta `CREATE TABLE IF NOT EXISTS leads`
   çalıştırır (bkz. `db/ensure-schema.js`). Elle bir şey yapman gerekmez.
   İstersen dışarıdan da tetikleyebilirsin: `npm run db:migrate` (aynı şemayı uygular).
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
| GET | `/api/gallery` | public | Kuaför galerisi (`kind`, `hasAfter` alanlarıyla) |
| GET | `/api/gallery/:id/image` | public | Galeri görseli (dönüşümlerde "öncesi") |
| GET | `/api/gallery/:id/image-after` | public | Dönüşümün "sonrası" görseli |
| POST | `/api/admin/gallery` | admin | Foto ekle (`kind=foto\|donusum`, `image` + `imageAfter`) |

Admin uçları cookie (`gc_admin`, HttpOnly + prod'da Secure) ile korunur.

---

## 4) Proje yapısı

```
server/
  index.js      # Express giriş (dev: Vite middleware, prod: sirv dist + SPA fallback)
  api.js        # lead API + ürün CRUD + /panel admin + auth + rate-limit
  seo.js        # rota bazlı meta/JSON-LD enjeksiyonu (index.html'deki <!--SEO-->)
db/
  schema.js     # Drizzle: leads + products tabloları
  index.js      # postgres.js bağlantısı (DATABASE_URL yoksa null → bellek fallback)
  ensure-schema.js  # sunucu açılışında idempotent DDL (elle migrate gereksiz)
  migrate.js    # `npm run db:migrate` → aynı şemayı uygular
src/
  pages/        # PortalPage, OrganizasyonPage, ProductsPage, KuaforPage
  components/   # Hero, About, Services, Process, Testimonial, Gallery, Products, Contact, Footer
  styles/       # index.css (ortak) · app.css (organizasyon) · kuafor.css · portal.css
public/         # robots.txt, sitemap.xml, llms.txt, images/
```

`leads` tablosu: `id, name, phone, event_type, event_date, message, status, brand, created_at`.

`gallery` tablosu iki tür kayıt tutar: `kind='foto'` tek çalışma/model fotoğrafı,
`kind='donusum'` ise öncesi/sonrası ikilisi (`image_data` = öncesi, `image_data_after`
= sonrası). Kuaför sayfasındaki galeri, her iki türden de kayıt varsa
"Tümü / Çalışmalarımız / Öncesi & Sonrası" filtresini gösterir; dönüşüm karoları
sürüklenebilir karşılaştırma ayracıyla açılır (`src/components/BeforeAfter.jsx`).

---

## 5) Devralan için yapılacaklar / açık uçlar

- [ ] **Gerçek görseller**: `public/images/` şu an AI (Higgsfield) görselleri; gerçek etkinlik fotoğraflarıyla değiştir.
- [ ] **Gerçek iletişim bilgileri**: `src/components/Contact.jsx` içindeki telefon/e-posta/adres placeholder — gerçekleriyle güncelle.
- [x] **Özel alan adı**: bağlandı → **https://goldclover.site** (Railway).
- [ ] **Kuaför yerel SEO**: `server/seo.js` içindeki `KUAFOR_JSONLD.geo` ve `hasMap` hâlâ yorum
  satırında. İşletme adı değişikliği için Google'a başvuru yapıldı; başvuru sonuçlanınca gerçek
  koordinat + Google Business CID girilmeli. Haritalarda görünürlük için en değerli sinyal bu.
- [ ] **(Opsiyonel) E-posta bildirimi**: Şu an sadece panel/DB var. İstenirse `/api/lead` içine SMTP/Resend eklenebilir.
- [ ] **(Opsiyonel) İçerik yönetimi**: Galeri/hizmetler şu an kodda sabit. CMS istenirse akuport'taki `settings`/`assets` deseni buraya taşınabilir.

> Not: Canlı bir Higgsfield sürümü (gold-clover.higgsfield.app) AYRI bir repo/host'tur.
> Bu repo, gerçek backend + veritabanı gerektirdiği için Railway'e taşınan sürümdür.
