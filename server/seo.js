// Rota-bazlı SEO meta enjeksiyonu. SPA olmasına rağmen sunucu her URL için doğru
// <title>/description/OG/JSON-LD döndürür → arama motorları ilk yanıtta doğru içeriği görür.
// index.html içindeki <!--SEO--> işaretçisi rota bloğuyla değiştirilir.

import BOLGELER, {
  bolgeBul,
  bolgeBaslik,
  bolgeAciklama,
} from "../src/data/bolgeler.js";

const SITE = "https://goldclover.site";
const DEFAULT_OG = `${SITE}/images/hero.webp`;

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "EventPlanner",
  name: "Gold Clover Organizasyon",
  description:
    "Ankara'da söz, nişan, doğum günü, baby shower, balon konsepti ve özel etkinlik organizasyonu.",
  url: `${SITE}/organizasyon`,
  "@id": `${SITE}/organizasyon`,
  image: `${SITE}/images/hero.webp`,
  telephone: "+90 551 862 56 60",
  areaServed: "Ankara",
  // Organizasyon ve kuaför AYNI adreste faaliyet gösteriyor (Balgat, Çankaya).
  address: {
    "@type": "PostalAddress",
    addressLocality: "Balgat, Çankaya",
    addressRegion: "Ankara",
    addressCountry: "TR",
  },
  sameAs: ["https://www.instagram.com/gold_cloverr"],
};

const KUAFOR_JSONLD = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Dilek Sanık — Hair & Beauty Center",
  alternateName: "Dilek Sanık Kuaför Balgat",
  description:
    "Balgat, Ankara'da saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım hizmetleri sunan güzellik merkezi.",
  url: `${SITE}/kuafor`,
  "@id": `${SITE}/kuafor`,
  image: `${SITE}/images/hero.webp`,
  telephone: "+90 552 391 56 60",
  priceRange: "₺₺",
  areaServed: "Balgat, Çankaya, Ankara",
  sameAs: ["https://www.instagram.com/ds_hairbeautycenter"],
  // Google'daki işletme adı değişikliği onaylandı (2026-08-10) — koordinatlar
  // Maps'in yeni ada verdiği yanıttan alındı, eski kayıtla ~12 m örtüşüyor.
  geo: { "@type": "GeoCoordinates", latitude: 39.8822401, longitude: 32.8149229 },
  hasMap: "https://share.google/bx9TMZEIYhSD7em2F",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Balgat, Çankaya",
    addressRegion: "Ankara",
    addressCountry: "TR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  ],
};

const PORTAL_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gold Clover",
  url: SITE,
  inLanguage: "tr-TR",
  sameAs: ["https://www.instagram.com/gold_cloverr"],
};

const ROUTES = {
  "/": {
    title: "Gold Clover Organizasyon & Dilek Sanık Kuaför | Ankara",
    description:
      "Gold Clover Organizasyon ve Dilek Sanık Hair & Beauty Center (Balgat). Ankara'da etkinlik organizasyonu ve güzellik & kişisel bakım.",
    canonical: `${SITE}/`,
    ogImage: DEFAULT_OG,
    jsonLd: PORTAL_JSONLD,
  },
  "/organizasyon": {
    title: "Gold Clover Organizasyon — Ankara Etkinlik & Organizasyon",
    description:
      "Söz, nişan, doğum günü, baby shower, balon konsepti ve özel kutlamalar. Ankara'da hayalinizdeki etkinliği kusursuz kurguluyoruz. Butik çiçek & hediyelik.",
    canonical: `${SITE}/organizasyon`,
    ogImage: DEFAULT_OG,
    jsonLd: ORG_JSONLD,
  },
  "/urunler": {
    title: "Ürünler — Balon Konsepti, Çiçek & Hediyelik | Gold Clover",
    description:
      "Gold Clover ürünleri: balon konseptleri, butik çiçek aranjmanları ve özel hediyelikler. Ankara'da organizasyonunuzu tamamlayın.",
    canonical: `${SITE}/urunler`,
    ogImage: DEFAULT_OG,
    jsonLd: ORG_JSONLD,
  },
  "/kuafor": {
    title: "Dilek Sanık Hair & Beauty Center | Balgat Ankara Kuaför",
    description:
      "Balgat, Ankara'da saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım. Dilek Sanık Hair & Beauty Center. Her gün 09:00–19:00. Randevu: 0552 391 56 60.",
    canonical: `${SITE}/kuafor`,
    ogImage: DEFAULT_OG,
    jsonLd: KUAFOR_JSONLD,
  },
  "/organizasyon/bolgeler": {
    title: "Ankara Organizasyon Bölgeleri — Tüm İlçe ve Semtler | Gold Clover",
    description:
      "Gold Clover Ankara'nın 25 ilçesinde ve yoğun talep gelen semtlerde organizasyon, balon süsleme ve çiçek hizmeti veriyor. Bölgenizi seçin, teklif alın.",
    canonical: `${SITE}/organizasyon/bolgeler`,
    ogImage: DEFAULT_OG,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Ankara organizasyon bölgeleri",
      url: `${SITE}/organizasyon/bolgeler`,
      inLanguage: "tr-TR",
      about: { "@id": `${SITE}/organizasyon` },
      hasPart: BOLGELER.map((b) => ({
        "@type": "WebPage",
        name: `${b.ad} organizasyon`,
        url: `${SITE}/organizasyon/${b.slug}`,
      })),
    },
  },
};

// ————————————————————————————————————————————————————————————
// Bölge (ilçe / semt) sayfaları — /organizasyon/<slug>
// Tek veri kaynağı src/data/bolgeler.js; buradaki fonksiyonlar o veriden
// hem meta bloğunu hem JSON-LD'yi hem de crawler'ın göreceği metni üretir.
// ————————————————————————————————————————————————————————————

// "/organizasyon/cankaya" → "cankaya" · diğer her şey için null
function bolgeSlugu(key) {
  const m = /^\/organizasyon\/([a-z0-9-]+)$/.exec(key);
  if (!m) return null;
  if (m[1] === "bolgeler") return null; // statik ROUTES'ta tanımlı
  return bolgeBul(m[1]) ? m[1] : null;
}

function bolgeJsonLd(b) {
  const url = `${SITE}/organizasyon/${b.slug}`;
  const alan =
    b.tip === "semt"
      ? { "@type": "Place", name: `${b.ad}, Ankara` }
      : { "@type": "AdministrativeArea", name: `${b.ad}, Ankara` };

  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Etkinlik organizasyonu ve balon süsleme",
      name: `${b.ad} organizasyon ve balon süsleme`,
      description: bolgeAciklama(b),
      url,
      areaServed: alan,
      provider: { ...ORG_JSONLD },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${b.ad} hizmetleri`,
        itemListElement: b.oneCikan.map((ad) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: ad },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Organizasyon", item: `${SITE}/organizasyon` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Bölgeler",
          item: `${SITE}/organizasyon/bolgeler`,
        },
        { "@type": "ListItem", position: 3, name: b.ad, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: b.sss.map((q) => ({
        "@type": "Question",
        name: q.s,
        acceptedAnswer: { "@type": "Answer", text: q.c },
      })),
    },
  ];
}

function bolgeRotasi(slug) {
  const b = bolgeBul(slug);
  if (!b) return null;
  return {
    title: bolgeBaslik(b),
    description: bolgeAciklama(b),
    canonical: `${SITE}/organizasyon/${b.slug}`,
    ogImage: DEFAULT_OG,
    jsonLd: bolgeJsonLd(b),
  };
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Bölge sayfasının crawler'a görünen statik metni (React mount olunca silinir).
function bolgeSsr(slug) {
  const b = bolgeBul(slug);
  if (!b) return SSR_CONTENT["/"];
  return `
    <h1>${esc(b.ad)} Organizasyon ve Balon Süsleme — Gold Clover Ankara</h1>
    <p>${esc(b.giris)}</p>
    <p>${esc(b.mekan)}</p>
    <h2>${esc(b.ad)}'da en çok istenen organizasyonlar</h2>
    <ul>${b.oneCikan.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    <h2>Hizmet verdiğimiz mahalle ve semtler</h2>
    <ul>${b.mahalleler.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
    <p>${esc(b.mesafe)} Atölyemiz Balgat, Çankaya'da. Teklif için: 0551 862 56 60.</p>
    <h2>Sık sorulan sorular</h2>
    ${b.sss.map((q) => `<h3>${esc(q.s)}</h3><p>${esc(q.c)}</p>`).join("")}
    <p><a href="/organizasyon/bolgeler">Ankara'da hizmet verdiğimiz tüm bölgeler</a></p>`;
}

// Route bazlı statik içerik bloğu. #root içine basılır; React mount olunca
// createRoot() container'ı temizleyip üzerine yazar → kullanıcı görmez, ama
// arama motorları & AI crawler'lar ilk HTML yanıtında metni görür.
//
// GÖRSEL OLARAK GİZLİ: blok, React yüklenene kadar ekranda kalıyordu ve stilsiz
// (çıplak h1/p/ul) göründüğü için sayfa bir an "bozuk açılıp düzeliyor" gibi
// algılanıyordu. Standart sr-only tekniğiyle gizlendi — DOM'da ve HTML kaynağında
// duruyor (crawler + ekran okuyucu görür), gözle görünmez.
const SSR_CONTENT = {
  "/": `
    <h1>Gold Clover</h1>
    <p>Ankara merkezli iki markanın ortak dijital kapısı: Gold Clover Organizasyon ve Dilek Sanık — Hair &amp; Beauty Center (Balgat).</p>
    <h2>Gold Clover Organizasyon</h2>
    <p>Ankara'da söz, nişan, doğum günü, baby shower, balon konsepti ve özel etkinlik organizasyonu. <a href="/organizasyon">Organizasyonu keşfet</a></p>
    <h2>Dilek Sanık — Hair &amp; Beauty Center (Balgat)</h2>
    <p>Balgat, Çankaya'da saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım. <a href="/kuafor">Kuaförü keşfet</a></p>`,
  "/organizasyon": `
    <h1>Gold Clover Organizasyon — Ankara</h1>
    <p>Ankara'da hayalinizdeki etkinliği kusursuz kurguluyoruz. Söz, nişan, doğum günü, baby shower, balon konsepti ve özel kutlamalar.</p>
    <h2>Hizmetler</h2>
    <ul>
      <li>Söz & nişan organizasyonu</li>
      <li>Doğum günü & baby shower</li>
      <li>Balon konsepti tasarımı</li>
      <li>Butik çiçek aranjmanları & hediyelik</li>
    </ul>
    <p><a href="/urunler">Ürün ve konseptleri gör</a></p>`,
  "/urunler": `
    <h1>Ürünler — Gold Clover Organizasyon</h1>
    <p>Balon konseptleri, butik çiçek aranjmanları ve özel hediyelikler. Ankara'da organizasyonunuzu tamamlayın.</p>
    <h2>Kategoriler</h2>
    <ul>
      <li>Balon konseptleri</li>
      <li>Çiçek aranjmanları</li>
      <li>Özel hediyelikler</li>
    </ul>`,
  "/kuafor": `
    <h1>Dilek Sanık — Hair &amp; Beauty Center, Balgat</h1>
    <p>Balgat, Çankaya (Ankara)'da güzelliğin adresi. Saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım hizmetleri.</p>
    <h2>Hizmetler</h2>
    <ul>
      <li>Saç kesim, bakım & şekillendirme</li>
      <li>Makyaj & gelin makyajı</li>
      <li>Gelin saçı</li>
      <li>Cilt & kişisel bakım</li>
    </ul>
    <p>Çalışma saatleri: Her gün 09:00–19:00. Randevu: 0552 391 56 60.</p>`,
  "/organizasyon/bolgeler": `
    <h1>Ankara Organizasyon Bölgeleri — Gold Clover</h1>
    <p>Atölyemiz Balgat, Çankaya'da. Kurulum ekibimiz Ankara'nın 25 ilçesine ve yoğun talep gelen semtlere gidiyor.</p>
    <h2>Hizmet verdiğimiz bölgeler</h2>
    <ul>${BOLGELER.map(
      (b) =>
        `<li><a href="/organizasyon/${b.slug}">${b.ad} organizasyon ve balon süsleme</a></li>`,
    ).join("")}</ul>`,
};

// Ekrandan gizleyen ama içeriği DOM'da bırakan sarmalayıcı (sr-only).
// display:none KULLANMA — gizlenen içeriği crawler'lar yok sayabilir.
const SSR_HIDDEN_STYLE =
  "position:absolute;width:1px;height:1px;margin:-1px;padding:0;" +
  "overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);" +
  "white-space:nowrap;border:0";

function ssrBlock(key) {
  const slug = bolgeSlugu(key);
  const content = slug ? bolgeSsr(slug) : SSR_CONTENT[key] || SSR_CONTENT["/"];
  return `<div data-seo-ssr style="${SSR_HIDDEN_STYLE}">${content}</div>`;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function metaBlock(route, known) {
  const d = escapeAttr(route.description);
  const url = escapeAttr(route.canonical);
  const img = escapeAttr(route.ogImage);
  const title = escapeAttr(route.title);
  return [
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    // Bilinmeyen yollar 404 döndüğü için indekslenmemeli; linkler yine izlensin.
    `<meta name="robots" content="${known ? "index, follow" : "noindex, follow"}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Gold Clover" />`,
    `<meta property="og:locale" content="tr_TR" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="2000" />`,
    `<meta property="og:image:height" content="1125" />`,
    `<meta property="og:image:alt" content="${title}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>`,
  ].join("\n    ");
}

function routeKey(pathname) {
  return (pathname || "/").replace(/\/+$/, "") || "/";
}

// Sunucunun 200 mü 404 mü döneceğine karar vermesi için: tanımlı rota mı?
export function isKnownRoute(pathname) {
  const key = routeKey(pathname);
  if (Object.prototype.hasOwnProperty.call(ROUTES, key)) return true;
  return bolgeSlugu(key) !== null;
}

// index.html'i alır, path'e göre <title> ve <!--SEO--> işaretçisini doldurur.
export function injectMeta(html, pathname) {
  const key = routeKey(pathname);
  const known = isKnownRoute(key);
  const slug = bolgeSlugu(key);
  const route = (slug && bolgeRotasi(slug)) || ROUTES[key] || ROUTES["/"];
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(route.title)}</title>`)
    .replace("<!--SEO-->", metaBlock(route, known))
    .replace(
      '<div id="root"></div>',
      `<div id="root">${ssrBlock(key)}</div>`,
    );
}

// ————————————————————————————————————————————————————————————
// sitemap.xml — statik dosya yerine burada üretilir. Böylece yeni bir bölge
// eklendiğinde sitemap'i elle güncellemek gerekmez.
// ————————————————————————————————————————————————————————————
export function buildSitemap(lastmod) {
  const tarih = lastmod || new Date().toISOString().slice(0, 10);
  const sayfalar = [
    { loc: `${SITE}/`, freq: "monthly", pri: "1.0" },
    { loc: `${SITE}/organizasyon`, freq: "monthly", pri: "0.9" },
    { loc: `${SITE}/kuafor`, freq: "monthly", pri: "0.9" },
    { loc: `${SITE}/urunler`, freq: "weekly", pri: "0.8" },
    { loc: `${SITE}/organizasyon/bolgeler`, freq: "monthly", pri: "0.7" },
    ...BOLGELER.map((b) => ({
      loc: `${SITE}/organizasyon/${b.slug}`,
      freq: "monthly",
      // Semtler ve merkez ilçeler öncelikli; uzak ilçeler daha düşük.
      pri: b.tip === "semt" ? "0.7" : "0.6",
    })),
  ];

  const govde = sayfalar
    .map(
      (s) =>
        `  <url>\n    <loc>${s.loc}</loc>\n    <lastmod>${tarih}</lastmod>\n` +
        `    <changefreq>${s.freq}</changefreq>\n    <priority>${s.pri}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${govde}\n</urlset>\n`;
}

export { SITE, ROUTES };
