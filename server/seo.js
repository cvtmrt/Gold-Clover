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
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ankara",
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
  // Yerel SEO/Haritalar için GERÇEK değerleri gir, sonra yorumu kaldır:
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
      closes: "18:00",
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
      "Gold Clover Organizasyon ve DS Önce Sen (Dilek Kuaför Balgat). Ankara'da etkinlik organizasyonu ve güzellik & kişisel bakım. Hangisini keşfetmek istersiniz?",
    canonical: `${SITE}/`,
    ogImage: DEFAULT_OG,
    jsonLd: PORTAL_JSONLD,
  },
  "/organizasyon": {
    title: "Gold Clover Organizasyon — Ankara Etkinlik & Organizasyon",
    description:
      "Söz, nişan, doğum günü, baby shower, balon konsepti ve özel kutlamalar. Ankara'da hayalinizdeki etkinliği kusursuz kurguluyoruz. Butik çiçek & hediyelik ürünler.",
    canonical: `${SITE}/organizasyon`,
    ogImage: DEFAULT_OG,
    jsonLd: ORG_JSONLD,
  },
  "/urunler": {
    title: "Ürünler — Gold Clover Organizasyon | Balon Konsepti, Çiçek, Hediyelik",
    description:
      "Gold Clover ürünleri: balon konseptleri, butik çiçek aranjmanları ve özel hediyelikler. Ankara'da organizasyonunuzu tamamlayın.",
    canonical: `${SITE}/urunler`,
    ogImage: DEFAULT_OG,
    jsonLd: ORG_JSONLD,
  },
  "/kuafor": {
    title: "DS Önce Sen — Dilek Kuaför Balgat | Ankara Güzellik & Kişisel Bakım",
    description:
      "Balgat, Ankara'da saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım. DS Önce Sen — Dilek Kuaför. Her gün 09:00–18:00. Randevu: 0552 391 56 60.",
    canonical: `${SITE}/kuafor`,
    ogImage: DEFAULT_OG,
    jsonLd: KUAFOR_JSONLD,
  },
};

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function metaBlock(route) {
  const d = escapeAttr(route.description);
  const url = escapeAttr(route.canonical);
  const img = escapeAttr(route.ogImage);
  const title = escapeAttr(route.title);
  return [
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow" />`,
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

// index.html'i alır, path'e göre <title> ve <!--SEO--> işaretçisini doldurur.
export function injectMeta(html, pathname) {
  const key = (pathname || "/").replace(/\/+$/, "") || "/";
  const route = ROUTES[key] || ROUTES["/"];
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(route.title)}</title>`)
    .replace("<!--SEO-->", metaBlock(route));
}

export { SITE, ROUTES };
