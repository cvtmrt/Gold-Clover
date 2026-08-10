// Rota-bazlı SEO meta enjeksiyonu. SPA olmasına rağmen sunucu her URL için doğru
// <title>/description/OG/JSON-LD döndürür → arama motorları ilk yanıtta doğru içeriği görür.
// index.html içindeki <!--SEO--> işaretçisi rota bloğuyla değiştirilir.

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
  name: "Dilek Kuaför Balgat — DS Önce Sen",
  description:
    "Balgat, Ankara'da saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım hizmetleri sunan güzellik merkezi.",
  url: `${SITE}/kuafor`,
  "@id": `${SITE}/kuafor`,
  image: `${SITE}/images/hero.webp`,
  telephone: "+90 552 391 56 60",
  priceRange: "₺₺",
  areaServed: "Balgat, Çankaya, Ankara",
  sameAs: ["https://www.instagram.com/gold_cloverr"],
  // BEKLEMEDE: işletme adı değişikliği için Google'a başvuru yapıldı. Başvuru
  // sonuçlanınca aşağıdaki GERÇEK değerleri gir ve yorumu kaldır — yerel arama
  // ve Haritalar görünürlüğü için en değerli sinyal bunlar:
  // geo: { "@type": "GeoCoordinates", latitude: 39.9xxx, longitude: 32.8xxx },
  // hasMap: "https://maps.google.com/?cid=<gerçek_google_business_cid>",
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
    title: "Gold Clover — Organizasyon & DS Önce Sen Kuaför | Ankara",
    description:
      "Gold Clover Organizasyon ve DS Önce Sen (Dilek Kuaför Balgat). Ankara'da etkinlik organizasyonu ve güzellik & kişisel bakım.",
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
    title: "DS Önce Sen — Dilek Kuaför Balgat | Ankara Güzellik & Bakım",
    description:
      "Balgat, Ankara'da saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım. DS Önce Sen — Dilek Kuaför. Her gün 09:00–19:00. Randevu: 0552 391 56 60.",
    canonical: `${SITE}/kuafor`,
    ogImage: DEFAULT_OG,
    jsonLd: KUAFOR_JSONLD,
  },
};

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
    <p>Ankara merkezli iki markanın ortak dijital kapısı: Gold Clover Organizasyon ve DS Önce Sen — Dilek Kuaför Balgat.</p>
    <h2>Gold Clover Organizasyon</h2>
    <p>Ankara'da söz, nişan, doğum günü, baby shower, balon konsepti ve özel etkinlik organizasyonu. <a href="/organizasyon">Organizasyonu keşfet</a></p>
    <h2>DS Önce Sen — Dilek Kuaför Balgat</h2>
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
    <h1>DS Önce Sen — Dilek Kuaför Balgat</h1>
    <p>Balgat, Çankaya (Ankara)'da güzelliğin adresi. Saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım hizmetleri.</p>
    <h2>Hizmetler</h2>
    <ul>
      <li>Saç kesim, bakım & şekillendirme</li>
      <li>Makyaj & gelin makyajı</li>
      <li>Gelin saçı</li>
      <li>Cilt & kişisel bakım</li>
    </ul>
    <p>Çalışma saatleri: Her gün 09:00–19:00. Randevu: 0552 391 56 60.</p>`,
};

// Ekrandan gizleyen ama içeriği DOM'da bırakan sarmalayıcı (sr-only).
// display:none KULLANMA — gizlenen içeriği crawler'lar yok sayabilir.
const SSR_HIDDEN_STYLE =
  "position:absolute;width:1px;height:1px;margin:-1px;padding:0;" +
  "overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);" +
  "white-space:nowrap;border:0";

function ssrBlock(key) {
  const content = SSR_CONTENT[key] || SSR_CONTENT["/"];
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
  return Object.prototype.hasOwnProperty.call(ROUTES, routeKey(pathname));
}

// index.html'i alır, path'e göre <title> ve <!--SEO--> işaretçisini doldurur.
export function injectMeta(html, pathname) {
  const key = routeKey(pathname);
  const known = isKnownRoute(key);
  const route = ROUTES[key] || ROUTES["/"];
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(route.title)}</title>`)
    .replace("<!--SEO-->", metaBlock(route, known))
    .replace(
      '<div id="root"></div>',
      `<div id="root">${ssrBlock(key)}</div>`,
    );
}

export { SITE, ROUTES };
