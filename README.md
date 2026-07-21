# Gold Clover Organizasyon

Ankara etkinlik/organizasyon firması tanıtım sitesi. **Vite + React (SPA)** arayüz,
**Express + Drizzle ORM + Railway PostgreSQL** backend. İletişim/teklif formu
gelen talepleri veritabanına kaydeder; şifreli panelden (`/panel`) yönetilir.

## Teknoloji
- **Vite + React** — tek sayfa sinematik tanıtım sitesi
- **Express** — API + statik servis (üretimde `sirv`, geliştirmede Vite middleware)
- **Drizzle ORM + postgres.js** — Railway PostgreSQL (`leads` tablosu)
- `DATABASE_URL` yoksa form bellek-içi geçici kayıtla çalışır (lokal deneme)

## Geliştirme
```bash
npm install
npm run dev          # http://localhost:3000
```
> `DATABASE_URL` tanımlı değilse gelen talepler bellekte tutulur (sunucu yeniden
> başlayınca silinir). Kalıcı kayıt için PostgreSQL bağlayın.

## Railway PostgreSQL bağlama
1. Railway'de **PostgreSQL** servisi oluşturun.
2. `.env.example` → `.env` kopyalayın, `DATABASE_URL`'i girin.
3. Tabloyu oluşturun:
```bash
npm run db:migrate
```

## Yönetim paneli
- Panel: **`/panel`**
- Giriş şifresi: `ADMIN_PASSWORD` (production'da zorunlu)
- Panelde gelen talepleri görür, durumlarını (**Yeni / Arandı / Tamamlandı**)
  günceller ve silebilirsiniz.

## Üretim (Railway deploy)
- **Build:** `npm run build`
- **Start:** `npm start` (Railway `PORT`'u otomatik verir)
- **Ortam değişkenleri:**
  - `DATABASE_URL` — Railway Postgres bağlantısı
  - `NODE_ENV=production`
  - `ADMIN_PASSWORD` — panel şifresi
  - `ADMIN_SESSION_SECRET` — cookie imzası (uzun rastgele değer)

### Railway adımları (özet)
1. Repo'yu Railway'e bağla → yeni servis (Node).
2. Aynı projede **PostgreSQL** ekle; `DATABASE_URL`'i web servisine değişken olarak ver.
3. Değişkenleri gir: `NODE_ENV=production`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
4. Deploy sonrası bir kez `npm run db:migrate` çalıştır (Railway shell veya lokal
   `DATABASE_URL` ile) → `leads` tablosu oluşsun.
5. Formu doldurup `/panel`'den talebi gör.

## API
| Yöntem | Yol | Açıklama |
| --- | --- | --- |
| POST | `/api/lead` | Formdan talep kaydı (public) |
| POST | `/api/admin/login` | Panel girişi |
| GET | `/api/admin/leads` | Talep listesi (admin) |
| PATCH | `/api/admin/leads/:id` | Durum güncelle (admin) |
| DELETE | `/api/admin/leads/:id` | Talep sil (admin) |
