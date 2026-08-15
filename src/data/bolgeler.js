// Ankara bölge (ilçe + semt) sayfalarının tek veri kaynağı.
//
// Bu dosya hem istemci (BolgePage.jsx) hem sunucu (server/seo.js, sitemap)
// tarafından import edilir. Bu yüzden SAF JS: JSX yok, CSS importu yok,
// tarayıcıya veya Node'a özel API yok.
//
// Her kayıt gerçekten o bölgeye ait içerik taşır (mahalleler, mekan tipi,
// mesafe, bölgeye özel SSS). Amaç şablon çoğaltmak değil; aynı metni 35 kez
// tekrarlayan sayfalar hem kullanıcıya hem arama motoruna değersiz görünür.

export const MERKEZ = "Balgat, Çankaya";

// tip: "ilce" → Ankara'nın 25 ilçesi · "semt" → yoğun talep gelen alt bölgeler
const BOLGELER = [
  // ————————————————————————————————————————————————————————
  // MERKEZ İLÇELER
  // ————————————————————————————————————————————————————————
  {
    slug: "cankaya",
    ad: "Çankaya",
    tip: "ilce",
    ozet: "Ankara'nın merkez ilçesi; söz, nişan ve kurumsal etkinliğin en yoğun olduğu bölge.",
    giris:
      "Çankaya, Gold Clover'ın kendi atölyesinin de bulunduğu ilçe. Balgat'taki merkezimizden Kızılay, Çukurambar, Oran, Ayrancı ve Bilkent hattına aynı gün içinde kurulum yapabiliyoruz. İlçede söz ve nişan talebi yıl boyunca sabit, kurumsal etkinlik ve ofis kutlamaları ise ilkbahar ve sonbaharda yoğunlaşıyor.",
    mahalleler: [
      "Balgat",
      "Çukurambar",
      "Söğütözü",
      "Oran",
      "Kavaklıdere",
      "Ayrancı",
      "Gaziosmanpaşa",
      "Bahçelievler",
      "Yıldız",
      "Birlik",
      "Bilkent",
      "Beysukent",
    ],
    mekan:
      "İlçede çalıştığımız ortamlar üç grupta toplanıyor: rezidans ve site sosyal tesisleri, Tunalı–Bahçelievler hattındaki kafe ve bistrolar, Söğütözü–Çukurambar çevresindeki otel toplantı salonları. Ev kutlamaları da Çankaya'da diğer ilçelere göre belirgin biçimde fazla.",
    oneCikan: ["Söz & nişan", "Kurumsal etkinlik & açılış", "Doğum günü", "Baby shower"],
    mesafe: "Atölyemiz Balgat'ta; ilçe içi kurulumlara 10–20 dakikada ulaşıyoruz.",
    sss: [
      {
        s: "Çankaya'da aynı gün kurulum yapıyor musunuz?",
        c: "Evet. Atölyemiz Balgat'ta olduğu için Çankaya sınırları içinde stoktaki konseptlerde aynı gün kurulum mümkün. Özel renk veya özel baskılı ürün gerekiyorsa 2–3 gün önceden haber vermek gerekiyor.",
      },
      {
        s: "Sitemizin sosyal tesisinde kurulum yapabilir misiniz?",
        c: "Yapıyoruz. Site yönetiminden kurulum saati ve asansör kullanımı için izin alınması yeterli. Kurulum öncesi tesisi görmek isteriz; ölçü ve tavan yüksekliği konsepti doğrudan etkiliyor.",
      },
      {
        s: "Nişan organizasyonu ile gelin saçı ve makyajını birlikte alabilir miyiz?",
        c: "Alabilirsiniz. Aynı adreste Dilek Sanık Hair & Beauty Center var; nişan konsepti ile saç–makyaj tek görüşmede planlanıp tek takvimde yürütülüyor.",
      },
    ],
    yakin: ["cukurambar", "balgat", "oran", "golbasi"],
  },
  {
    slug: "yenimahalle",
    ad: "Yenimahalle",
    tip: "ilce",
    ozet: "Batıkent'ten Demetevler'e geniş bir yerleşim; doğum günü ve sünnet talebi yüksek.",
    giris:
      "Yenimahalle nüfus olarak Ankara'nın en kalabalık ilçelerinden biri ve talep profili de buna göre şekilleniyor: çocuk doğum günü, sünnet ve ev kutlaması ağırlıkta. Batıkent hattındaki siteler kendi sosyal tesislerine sahip olduğu için kurulum alanı çoğu zaman hazır geliyor.",
    mahalleler: [
      "Batıkent",
      "Demetevler",
      "Şentepe",
      "Ragıp Tüzün",
      "İvedik",
      "Ostim çevresi",
      "Ergazi",
      "Çiğdemtepe",
    ],
    mekan:
      "Site sosyal tesisleri ve mahalle içi kafeler ilk sırada. İvedik ve Ostim çevresinde ise iş yeri açılışı, showroom açılışı ve firma yıl dönümü talepleri geliyor; bunlar hafta içi sabah saatlerinde kuruluyor.",
    oneCikan: ["Doğum günü", "Sünnet & kına", "İş yeri açılışı", "Baby shower"],
    mesafe: "Balgat'tan Batıkent hattına yaklaşık 25–30 dakika.",
    sss: [
      {
        s: "Batıkent'te sosyal tesis kurulumu için ne kadar süre gerekiyor?",
        c: "Standart bir doğum günü kurulumu 60–90 dakika sürüyor. Tesisi bizden önce boşaltılmış teslim alabilirsek bu süre kısalıyor.",
      },
      {
        s: "İvedik'te iş yeri açılışı yapıyor musunuz?",
        c: "Süsleme, kurdele, karşılama masası ve balon kemeri kısmını biz kuruyoruz. Sahne, ses sistemi ve profesyonel personel gerekiyorsa çözüm ortağımızla birlikte planlıyoruz.",
      },
    ],
    yakin: ["batikent", "etimesgut", "kecioren", "cankaya"],
  },
  {
    slug: "kecioren",
    ad: "Keçiören",
    tip: "ilce",
    ozet: "Aile yoğunluğu yüksek ilçe; sünnet, kına ve çocuk doğum günü ağırlıklı.",
    giris:
      "Keçiören'de organizasyon talebi büyük ölçüde aile kutlamalarından geliyor. Sünnet ve kına sezonu haziran–ağustos arasında tepe yapıyor, çocuk doğum günleri ise hafta sonlarına yığılıyor. Bölgede bütçeye göre ölçeklenebilen paketler diğer ilçelere göre daha çok tercih ediliyor.",
    mahalleler: [
      "Etlik",
      "Kalaba",
      "Aktepe",
      "Ovacık",
      "Kuşcağız",
      "Sanatoryum",
      "Bağlum",
      "Güçlükaya",
    ],
    mekan:
      "İlçede kutlama çoğunlukla ev, salon veya mahalle kafesinde yapılıyor. Estergon Kalesi çevresi ve Kuzey Ankara hattındaki teraslı mekanlar açık hava kutlamaları için tercih ediliyor.",
    oneCikan: ["Sünnet & kına", "Doğum günü", "Baby shower", "Söz & nişan"],
    mesafe: "Balgat'tan Etlik ve Kalaba hattına yaklaşık 25–35 dakika.",
    sss: [
      {
        s: "Sünnet süslemesi için ne kadar önceden randevu almalıyız?",
        c: "Haziran–ağustos arasında en az 10 gün önceden. Sezon dışında 3–4 gün yeterli oluyor.",
      },
      {
        s: "Ev kutlaması için kurulum yapıyor musunuz?",
        c: "Yapıyoruz. Salon ölçüsünü ve tavan yüksekliğini önceden almamız yeterli; balon kemeri ve arka fon buna göre boyutlandırılıyor.",
      },
    ],
    yakin: ["etlik", "altindag", "pursaklar", "yenimahalle"],
  },
  {
    slug: "mamak",
    ad: "Mamak",
    tip: "ilce",
    ozet: "Geniş yerleşim, yoğun aile nüfusu; doğum günü ve sünnet odaklı.",
    giris:
      "Mamak'ta talep pratik ve hızlı çözümlere yöneliyor: aynı hafta içinde planlanan doğum günleri, sünnet süslemeleri ve küçük ölçekli ev kutlamaları. Natavega çevresi ise mağaza açılışı ve kurumsal kutlama için ilçenin en hareketli noktası.",
    mahalleler: [
      "Abidinpaşa",
      "Akdere",
      "Şahintepe",
      "Boğaziçi",
      "Kutludüğün",
      "Türközü",
      "Ege",
      "Altıağaç",
    ],
    mekan:
      "Ev ve apartman bahçesi kutlamaları ilk sırada. Alışveriş merkezi içindeki mağazalar için açılış süslemesi, hafta içi sabah saatlerinde kuruluyor.",
    oneCikan: ["Doğum günü", "Sünnet & kına", "Mağaza açılışı", "Baby shower"],
    mesafe: "Balgat'tan ilçe merkezine yaklaşık 20–30 dakika.",
    sss: [
      {
        s: "Küçük bütçeli bir doğum günü süslemesi mümkün mü?",
        c: "Mümkün. Balon kemeri ve arka fonu daha küçük ölçüde kurup folyo balon sayısını azaltarak bütçeyi ciddi biçimde düşürebiliyoruz. Konsept değişmiyor, ölçek değişiyor.",
      },
      {
        s: "Kurulum sonrası toplama hizmeti veriyor musunuz?",
        c: "Talep edilirse veriyoruz. Aynı gün toplama için kutlama bitiş saatinin önceden netleşmesi gerekiyor.",
      },
    ],
    yakin: ["altindag", "cankaya", "elmadag", "kecioren"],
  },
  {
    slug: "etimesgut",
    ad: "Etimesgut",
    tip: "ilce",
    ozet: "Genç aile nüfusu yoğun; gender reveal, ilk yaş ve baby shower talebi güçlü.",
    giris:
      "Etimesgut, Ankara'nın genç aile yoğunluğu en yüksek ilçelerinden biri. Bunun doğrudan sonucu olarak gender reveal, hastane odası süslemesi ve birinci yaş doğum günü talepleri diğer ilçelerin üzerinde seyrediyor. Eryaman ve Elvankent hattındaki siteler kurulum için elverişli ortak alanlara sahip.",
    mahalleler: [
      "Eryaman",
      "Elvankent",
      "Göksu",
      "Bağlıca",
      "Ahi Mesut",
      "Erler",
      "Piyade",
      "Güzelkent",
    ],
    mekan:
      "Site sosyal tesisleri, Eryaman hattındaki kafeler ve Gordion çevresindeki mekanlar. Bağlıca tarafında üniversite çevresi mezuniyet ve teklif organizasyonu getiriyor.",
    oneCikan: ["Gender reveal", "Baby shower", "Doğum günü", "Söz & nişan"],
    mesafe: "Balgat'tan Eryaman hattına yaklaşık 25–35 dakika.",
    sss: [
      {
        s: "Gender reveal için hangi seçenekler var?",
        c: "Renkli duman, balon patlatma kutusu, konfetili dev balon ve pasta üstü sürprizi en çok tercih edilenler. Kapalı mekanda duman kullanımı için önce mekan yönetiminden onay almak gerekiyor.",
      },
      {
        s: "Eryaman'da hafta içi akşam kurulumu yapabiliyor musunuz?",
        c: "Yapıyoruz. Akşam kurulumlarında trafiği hesaba katarak ekibi 1 saat erken çıkarıyoruz.",
      },
    ],
    yakin: ["eryaman", "sincan", "yenimahalle", "batikent"],
  },
  {
    slug: "sincan",
    ad: "Sincan",
    tip: "ilce",
    ozet: "Kalabalık yerleşim ve sanayi hattı; aile kutlamaları ve iş yeri açılışı.",
    giris:
      "Sincan'da hem yoğun aile kutlaması hem de sanayi bölgesi kaynaklı kurumsal açılış talebi var. Fatih ve Yenikent hattında düğün salonu kültürü güçlü; salon zaten hazır geldiği için bizden istenen çoğunlukla masa süsleme, giriş kemeri ve arka fon oluyor.",
    mahalleler: [
      "Fatih",
      "Yenikent",
      "Törekent",
      "Plevne",
      "Andiçen",
      "Osmanlı",
      "Tandoğan",
      "Temelli çevresi",
    ],
    mekan:
      "Düğün ve nikah salonları ilk sırada. Başkent OSB ve çevresindeki firmalar için açılış ve yıl dönümü süslemesi hafta içi kuruluyor.",
    oneCikan: ["Sünnet & kına", "Söz & nişan", "İş yeri açılışı", "Doğum günü"],
    mesafe: "Balgat'tan ilçe merkezine yaklaşık 35–45 dakika.",
    sss: [
      {
        s: "Düğün salonuna kurulum yapabiliyor musunuz?",
        c: "Yapıyoruz. Salonun kendi süsleme anlaşması varsa önce onu teyit etmek gerekiyor; birçok salon dışarıdan kurulum için ek izin istiyor.",
      },
      {
        s: "Sincan'a ulaşım ücreti var mı?",
        c: "Belirli bir tutarın üzerindeki işlerde ulaşım dahil. Küçük ölçekli kurulumlarda mesafeye göre ulaşım farkı teklifte açıkça yazılıyor.",
      },
    ],
    yakin: ["etimesgut", "eryaman", "kahramankazan", "yenimahalle"],
  },
  {
    slug: "altindag",
    ad: "Altındağ",
    tip: "ilce",
    ozet: "Tarihi Ankara dokusu; Hamamönü çevresinde kına ve fotoğraf odaklı organizasyon.",
    giris:
      "Altındağ, Ankara'nın tarihi çekirdeği. Hamamönü ve Hacı Bayram çevresindeki restore konaklar, kına gecesi ve nişan çekimi için bambaşka bir zemin sunuyor. Bu bölgede konsept genellikle mekanın dokusuna uyumlu kurgulanıyor: bakır, kadife ve sıcak tonlar balon renklerini de belirliyor.",
    mahalleler: [
      "Hamamönü",
      "Ulus",
      "Aydınlıkevler",
      "Siteler",
      "Hacı Bayram",
      "Solfasol",
      "Karapürçek",
      "Önder",
    ],
    mekan:
      "Restore konaklar ve avlulu kafeler kına gecesi için tercih ediliyor. Siteler bölgesinde ise mobilyacı ve showroom açılışları düzenli talep getiriyor.",
    oneCikan: ["Kına gecesi", "Söz & nişan", "Showroom açılışı", "Doğum günü"],
    mesafe: "Balgat'tan Hamamönü hattına yaklaşık 20–25 dakika.",
    sss: [
      {
        s: "Hamamönü'ndeki konaklarda kurulum yapılabiliyor mu?",
        c: "Yapılabiliyor, ancak çoğu tarihi yapı olduğu için duvara sabitleme yapılamıyor. Ayaklı sistem ve zeminden yükselen kemer kullanıyoruz.",
      },
      {
        s: "Kına konseptinde geleneksel tema kuruyor musunuz?",
        c: "Kuruyoruz. Bakır sini, kadife örtü ve fenerle kurulan geleneksel düzenle modern balon kemerini birlikte çalıştırabiliyoruz.",
      },
    ],
    yakin: ["kecioren", "mamak", "cankaya", "pursaklar"],
  },
  {
    slug: "pursaklar",
    ad: "Pursaklar",
    tip: "ilce",
    ozet: "Genç nüfus ve yeni siteler; ilk yaş, sünnet ve baby shower yoğun.",
    giris:
      "Pursaklar hızlı büyüyen, genç nüfuslu bir ilçe. Yeni site yerleşimleri sosyal tesisleriyle birlikte geldiği için kutlamalar çoğunlukla site içinde yapılıyor. Talep profili net: birinci yaş, sünnet ve baby shower.",
    mahalleler: [
      "Merkez",
      "Saray",
      "Altınova",
      "Sirkeli",
      "Karacaören",
      "Ayvalı çevresi",
    ],
    mekan:
      "Site sosyal tesisleri ve mahalle içi salonlar. Açık havada yapılan kutlamalar mayıs–eylül arasında yoğunlaşıyor.",
    oneCikan: ["Sünnet & kına", "Doğum günü", "Baby shower", "Gender reveal"],
    mesafe: "Balgat'tan ilçe merkezine yaklaşık 30–40 dakika.",
    sss: [
      {
        s: "Site sosyal tesisi için ölçü almanız gerekiyor mu?",
        c: "Fotoğraf çoğu zaman yeterli oluyor. Duvar genişliği ve tavan yüksekliğini telefonla ölçüp bize iletmeniz kurulum planı için yeterli.",
      },
      {
        s: "Aynı gün iki ayrı kurulum yapabiliyor musunuz?",
        c: "Takvim uygunsa yapabiliyoruz. Bu durumda ikinci kurulumun saatini bir tampon payıyla planlıyoruz.",
      },
    ],
    yakin: ["kecioren", "altindag", "cubuk", "akyurt"],
  },
  {
    slug: "golbasi",
    ad: "Gölbaşı",
    tip: "ilce",
    ozet: "Mogan ve Eymir çevresindeki kır bahçeleri; söz, nişan ve kır düğününün merkezi.",
    giris:
      "Gölbaşı, Ankara'da açık hava organizasyonunun kalbi. Mogan Gölü çevresindeki kır bahçeleri ve davet evleri, söz ve nişan için şehrin en çok tercih edilen adresleri. Bu bölgede mekan zaten hazır; bizden istenen görsel konsept, masa düzeni, çiçek ve balon kurgusu oluyor.",
    mahalleler: [
      "İncek",
      "Mogan çevresi",
      "Taşpınar",
      "Karagedik",
      "Bahçelievler",
      "Seğmenler",
      "Hacılar",
      "Oğulbey",
    ],
    mekan:
      "Kır bahçeleri, göl manzaralı davet evleri ve bahçeli restoranlar. Açık havada rüzgar konseptin en büyük değişkeni; kemer ve arka fon buna göre ağırlıklandırılıyor.",
    oneCikan: ["Söz & nişan", "Kır düğünü konsepti", "Baby shower", "Evlilik teklifi"],
    mesafe: "Balgat'tan Gölbaşı ve İncek hattına yaklaşık 20–30 dakika.",
    sss: [
      {
        s: "Kır bahçesinde rüzgar sorun oluyor mu?",
        c: "Oluyor. Bu yüzden açık alanda ağırlıklı taban, sabitlemeli kemer ve rüzgara dayanıklı çiçek seçimi kullanıyoruz. Kurulumu etkinlikten en az 3 saat önce bitiriyoruz.",
      },
      {
        s: "Mekanla anlaşmamız varsa siz sadece süsleme yapar mısınız?",
        c: "Evet, en sık çalıştığımız model bu. Mekan yemeği ve servisi üstleniyor, biz konsept, çiçek ve balon tarafını kuruyoruz.",
      },
      {
        s: "Evlilik teklifi organizasyonu yapıyor musunuz?",
        c: "Yapıyoruz. Göl kenarı ve bahçe teklifleri için mum yolu, harf ışık ve çiçek kemeri en çok istenen kurgu. Gizlilik gerektiren kurulumları etkinlikten önce sessizce tamamlıyoruz.",
      },
    ],
    yakin: ["incek", "cankaya", "oran", "haymana"],
  },

  // ————————————————————————————————————————————————————————
  // ÇEVRE İLÇELER
  // ————————————————————————————————————————————————————————
  {
    slug: "polatli",
    ad: "Polatlı",
    tip: "ilce",
    ozet: "Kendi düğün ve salon kültürü olan büyük ilçe; planlı kurulum yapıyoruz.",
    giris:
      "Polatlı, Ankara'nın kendi içinde bir merkez gibi çalışan ilçelerinden. Düğün ve nişan geleneği güçlü, salon sayısı fazla. Şehir merkezine uzaklığı nedeniyle burada işleri en az bir hafta önceden planlıyor, kurulumu tek seferde ve eksiksiz yapacak şekilde çıkıyoruz.",
    mahalleler: [
      "Cumhuriyet",
      "Yenidoğan",
      "Şentepe",
      "Zafer",
      "Karapınar",
      "Sakarya",
    ],
    mekan: "Düğün salonları, kır bahçeleri ve aile bahçeleri.",
    oneCikan: ["Söz & nişan", "Sünnet & kına", "Doğum günü", "İş yeri açılışı"],
    mesafe: "Ankara merkezden yaklaşık 80 km; kurulumu bir hafta önceden planlıyoruz.",
    sss: [
      {
        s: "Polatlı'ya geliyor musunuz?",
        c: "Geliyoruz. Mesafe nedeniyle randevuyu en az 7 gün önceden alıyor, malzemeyi tek seferde götürüyoruz. Ulaşım farkı teklifte ayrıca belirtiliyor.",
      },
      {
        s: "Kurulum aynı gün mü yapılıyor?",
        c: "Etkinlik günü sabahı kuruluyor. Akşam etkinliklerinde öğleden önce sahada oluyoruz.",
      },
    ],
    yakin: ["sincan", "haymana", "ayas", "etimesgut"],
  },
  {
    slug: "cubuk",
    ad: "Çubuk",
    tip: "ilce",
    ozet: "Aile kutlamaları ve bahçeli mekanlar; hafta sonu yoğunluğu yüksek.",
    giris:
      "Çubuk'ta kutlamalar çoğunlukla bahçeli evlerde ve aile mekanlarında yapılıyor. Sünnet ve kına sezonu belirgin; yaz aylarında hafta sonları hızlı doluyor. Açık hava kurulumları için bölgede alan sıkıntısı yok, bu da daha büyük ölçekli konseptlere imkan veriyor.",
    mahalleler: ["Merkez", "Yıldırım", "Esenboğa çevresi", "Karadere", "Yenice"],
    mekan: "Bahçeli evler, aile bahçeleri ve ilçe merkezindeki salonlar.",
    oneCikan: ["Sünnet & kına", "Söz & nişan", "Doğum günü", "Baby shower"],
    mesafe: "Ankara merkezden yaklaşık 40 km; 3–4 gün önceden planlama yeterli.",
    sss: [
      {
        s: "Bahçede büyük ölçekli kurulum yapabiliyor musunuz?",
        c: "Yapabiliyoruz. Bahçe kurulumlarında zemin sertliği ve elektrik erişimi iki kritik nokta; ikisini de önceden sormamız gerekiyor.",
      },
      {
        s: "Esenboğa çevresindeki tesislere geliyor musunuz?",
        c: "Geliyoruz. Havalimanı çevresindeki otel ve tesislerde kurulum yaptığımız işler oldu.",
      },
    ],
    yakin: ["akyurt", "pursaklar", "kecioren", "kahramankazan"],
  },
  {
    slug: "kahramankazan",
    ad: "Kahramankazan",
    tip: "ilce",
    ozet: "Sanayi ve havacılık hattı; kurumsal etkinlik ile aile kutlaması bir arada.",
    giris:
      "Kahramankazan'da iki ayrı talep birlikte yürüyor: sanayi tesisleri ve firmalar için açılış, yıl dönümü ve ödül töreni süslemesi; ilçe merkezinde ise klasik aile kutlamaları. Kurumsal işlerde faturalı çalışıyor, kurulum saatini vardiya düzenine göre ayarlıyoruz.",
    mahalleler: ["Merkez", "Saray", "Fatih", "Atatürk", "Orhaniye"],
    mekan: "Fabrika ve tesis alanları, ilçe merkezindeki salonlar, bahçeli mekanlar.",
    oneCikan: ["Kurumsal etkinlik", "İş yeri açılışı", "Sünnet & kına", "Doğum günü"],
    mesafe: "Ankara merkezden yaklaşık 45 km; kurumsal işlerde 1 hafta önceden planlama.",
    sss: [
      {
        s: "Fabrika içinde kurulum yapabiliyor musunuz?",
        c: "Yapıyoruz. Tesis giriş izni ve iş güvenliği kurallarının kurulum ekibimize önceden bildirilmesi gerekiyor.",
      },
      {
        s: "Kurumsal işlerde fatura kesiyor musunuz?",
        c: "Kesiyoruz. Kurumsal teklif, kalem kalem dökümlü olarak yazılı gönderiliyor.",
      },
    ],
    yakin: ["akyurt", "cubuk", "sincan", "yenimahalle"],
  },
  {
    slug: "akyurt",
    ad: "Akyurt",
    tip: "ilce",
    ozet: "Havalimanı ve OSB hattı; kurumsal açılış ve tesis etkinlikleri.",
    giris:
      "Akyurt, Esenboğa Havalimanı ve organize sanayi hattı üzerinde. Bu nedenle bölgeden gelen taleplerin önemli kısmı firma açılışı, showroom açılışı ve tesis içi kutlama. İlçe merkezinde ise sünnet ve doğum günü kurulumları yapıyoruz.",
    mahalleler: ["Merkez", "Balıkhisar", "Elecik", "Cücük", "Kızık"],
    mekan: "OSB içindeki tesisler, havalimanı çevresindeki oteller, ilçe merkezi salonları.",
    oneCikan: ["İş yeri açılışı", "Kurumsal etkinlik", "Sünnet & kına", "Doğum günü"],
    mesafe: "Ankara merkezden yaklaşık 45 km; 5–7 gün önceden planlama.",
    sss: [
      {
        s: "Otel salonunda kurulum yapıyor musunuz?",
        c: "Yapıyoruz. Otelin kendi dekorasyon anlaşması varsa önce onun teyit edilmesi gerekiyor.",
      },
      {
        s: "Açılış için kurdele ve karşılama düzeni dahil mi?",
        c: "Açılış paketinde kurdele, makas, karşılama masası ve balon kemeri standart olarak yer alıyor.",
      },
    ],
    yakin: ["cubuk", "kahramankazan", "pursaklar", "kecioren"],
  },
  {
    slug: "elmadag",
    ad: "Elmadağ",
    tip: "ilce",
    ozet: "Şehre yakın ilçe; aile kutlamaları ve bahçeli mekan organizasyonları.",
    giris:
      "Elmadağ, merkeze görece yakın olduğu için aynı gün kurulum yapabildiğimiz çevre ilçelerden. Hasanoğlan hattı ve ilçe merkezinde sünnet, kına ve doğum günü talepleri düzenli geliyor. Yaz aylarında yayla ve bahçe kutlamaları için de çağrılıyoruz.",
    mahalleler: ["Merkez", "Hasanoğlan", "Yeniyapan", "Karacahasan", "Lalabel"],
    mekan: "Bahçeli evler, ilçe salonları, yayla ve piknik alanları.",
    oneCikan: ["Sünnet & kına", "Doğum günü", "Söz & nişan", "Baby shower"],
    mesafe: "Ankara merkezden yaklaşık 40 km; 3–4 gün önceden planlama yeterli.",
    sss: [
      {
        s: "Açık alanda elektrik yoksa kurulum yapılabilir mi?",
        c: "Yapılabilir. Işıklı ürünler için pilli sistem kullanıyoruz; balon ve çiçek kurulumu zaten elektrik gerektirmiyor.",
      },
      {
        s: "Hafta içi kurulum mümkün mü?",
        c: "Mümkün. Hafta içi takvim daha rahat olduğu için tarih seçiminde esneklik daha fazla.",
      },
    ],
    yakin: ["mamak", "cankaya", "bala", "kalecik"],
  },
  {
    slug: "kizilcahamam",
    ad: "Kızılcahamam",
    tip: "ilce",
    ozet: "Termal oteller ve orman; otel salonunda nişan ve kurumsal etkinlik.",
    giris:
      "Kızılcahamam'ın termal otelleri, hem hafta sonu aile kutlamaları hem de şirket toplantı ve etkinlikleri için kullanılıyor. Otel salonlarında kurulum yaptığımız işlerin çoğu nişan, yıl dönümü ve firma organizasyonu. Orman dokusu, doğal renklerle çalışan konseptler için çok elverişli.",
    mahalleler: ["Merkez", "Soğuksu çevresi", "Çeltikçi", "Pazar", "Güvem"],
    mekan: "Termal otel salonları ve bahçeleri, orman içi tesisler.",
    oneCikan: ["Söz & nişan", "Kurumsal etkinlik", "Yıl dönümü", "Doğum günü"],
    mesafe: "Ankara merkezden yaklaşık 80 km; en az 1 hafta önceden planlama.",
    sss: [
      {
        s: "Otelde kurulum için ne gerekiyor?",
        c: "Otelin etkinlik sorumlusuyla kurulum saatinin ve giriş iznin netleşmesi yeterli. Salon fotoğrafını önceden almamız konsept planını hızlandırıyor.",
      },
      {
        s: "Kış aylarında da geliyor musunuz?",
        c: "Geliyoruz. Kar durumuna göre ekibi daha erken çıkarıyor, yola bir tampon payı ekliyoruz.",
      },
    ],
    yakin: ["camlidere", "kahramankazan", "cubuk", "gudul"],
  },
  {
    slug: "beypazari",
    ad: "Beypazarı",
    tip: "ilce",
    ozet: "Tarihi konaklar ve turizm dokusu; butik nişan ve çekim organizasyonları.",
    giris:
      "Beypazarı'nın restore konakları ve taş sokakları, butik ölçekli nişan ve çekim organizasyonları için Ankara'da benzeri az bulunan bir zemin sunuyor. Burada kurduğumuz konseptler genellikle küçük davetli sayısına ve mekanın kendi dokusuna sadık kalacak şekilde tasarlanıyor.",
    mahalleler: ["Merkez", "Rüştiye", "Kurtuluş", "Zafer", "Yeni"],
    mekan: "Tarihi konaklar, butik oteller, avlulu kafeler.",
    oneCikan: ["Söz & nişan", "Kına gecesi", "Evlilik teklifi", "Doğum günü"],
    mesafe: "Ankara merkezden yaklaşık 100 km; en az 1 hafta önceden planlama.",
    sss: [
      {
        s: "Tarihi konakta kurulum kısıtı var mı?",
        c: "Var. Duvara ve ahşaba sabitleme yapılmıyor; tamamen ayaklı ve zeminden yükselen sistemlerle çalışıyoruz.",
      },
      {
        s: "Küçük davetli sayısı için de geliyor musunuz?",
        c: "Geliyoruz. 15–30 kişilik butik davetler bu bölgede en sık çalıştığımız ölçek.",
      },
    ],
    yakin: ["gudul", "ayas", "nallihan", "kizilcahamam"],
  },
  {
    slug: "nallihan",
    ad: "Nallıhan",
    tip: "ilce",
    ozet: "Ankara'nın batı ucu; planlı ve tek seferde tamamlanan kurulumlar.",
    giris:
      "Nallıhan, Ankara'nın merkeze en uzak ilçelerinden. Buraya gelen işleri tek seferde ve eksiksiz tamamlanacak şekilde planlıyoruz: malzeme listesi önceden çıkarılıyor, yedekleriyle birlikte yola çıkılıyor. Kuş cenneti ve renkli kanyon çevresi, dış mekan çekimli organizasyonlar için tercih ediliyor.",
    mahalleler: ["Merkez", "Çayırhan", "Sarıyar", "Beydili"],
    mekan: "İlçe salonları, bahçeli mekanlar, dış mekan çekim alanları.",
    oneCikan: ["Söz & nişan", "Sünnet & kına", "Doğum günü", "Baby shower"],
    mesafe: "Ankara merkezden yaklaşık 160 km; en az 10 gün önceden planlama.",
    sss: [
      {
        s: "Bu mesafeye gerçekten geliyor musunuz?",
        c: "Geliyoruz, ancak takvimin uygun olması ve işin tek seferde tamamlanacak ölçekte olması gerekiyor. Ulaşım farkı teklifte açık yazılıyor.",
      },
      {
        s: "Malzeme eksiği çıkarsa ne oluyor?",
        c: "Uzak bölgelerde her kalemin yedeğini götürüyoruz; tam da bu yüzden planlama süresi daha uzun.",
      },
    ],
    yakin: ["beypazari", "gudul", "camlidere", "ayas"],
  },
  {
    slug: "gudul",
    ad: "Güdül",
    tip: "ilce",
    ozet: "Küçük ölçekli, sakin ilçe; aile kutlamaları için planlı hizmet.",
    giris:
      "Güdül'de talep genellikle aile kutlamalarından geliyor: sünnet, kına ve doğum günü. İlçe küçük olduğu için işler çoğunlukla bahçeli evlerde ve merkezdeki salonlarda yapılıyor. Mesafe nedeniyle randevuyu önceden alıp tek kurulumda tamamlıyoruz.",
    mahalleler: ["Merkez", "Karacaören", "Sorgun", "Yeşilöz"],
    mekan: "Bahçeli evler, ilçe merkezindeki salonlar.",
    oneCikan: ["Sünnet & kına", "Doğum günü", "Söz & nişan", "Baby shower"],
    mesafe: "Ankara merkezden yaklaşık 90 km; en az 1 hafta önceden planlama.",
    sss: [
      {
        s: "Küçük bir kutlama için gelir misiniz?",
        c: "Geliriz, ancak mesafe nedeniyle çok küçük ölçekli işlerde ulaşım farkı toplam bütçede belirgin hale gelebiliyor. Teklifte bunu baştan gösteriyoruz.",
      },
    ],
    yakin: ["beypazari", "ayas", "nallihan", "kizilcahamam"],
  },
  {
    slug: "ayas",
    ad: "Ayaş",
    tip: "ilce",
    ozet: "Bağ ve bahçe dokusu; açık hava kutlamaları için elverişli.",
    giris:
      "Ayaş, bağ evleri ve bahçeleriyle açık hava kutlamalarına çok uygun bir ilçe. Yaz aylarında bahçe düğünü, kına ve aile kutlaması talepleri geliyor. Açık alan bol olduğu için kurulumda ölçek sınırı çoğunlukla bütçe oluyor, alan değil.",
    mahalleler: ["Merkez", "Sinanlı", "Ilıca", "Oltan", "Bayat"],
    mekan: "Bağ evleri, bahçeler, ilçe merkezindeki salonlar.",
    oneCikan: ["Sünnet & kına", "Söz & nişan", "Doğum günü", "Baby shower"],
    mesafe: "Ankara merkezden yaklaşık 60 km; 5–7 gün önceden planlama.",
    sss: [
      {
        s: "Bağ evinde kurulum yapıyor musunuz?",
        c: "Yapıyoruz. Zemin toprak ya da çimse ağırlıklı taban kullanıyoruz; rüzgar için ek sabitleme ekliyoruz.",
      },
    ],
    yakin: ["gudul", "beypazari", "sincan", "polatli"],
  },
  {
    slug: "bala",
    ad: "Bala",
    tip: "ilce",
    ozet: "Kırsal doku; sünnet ve kına ağırlıklı planlı kurulumlar.",
    giris:
      "Bala'da organizasyon talebi büyük ölçüde geleneksel aile kutlamalarından oluşuyor. Sünnet ve kına sezonunda köy ve mahalle ölçeğinde kalabalık kutlamalar yapılıyor; kurulumu buna göre dayanıklı ve geniş planlıyoruz.",
    mahalleler: ["Merkez", "Kesikköprü", "Afşar", "Küredağı"],
    mekan: "Köy ve mahalle meydanları, bahçeli evler, ilçe salonları.",
    oneCikan: ["Sünnet & kına", "Söz & nişan", "Doğum günü"],
    mesafe: "Ankara merkezden yaklaşık 55 km; 5–7 gün önceden planlama.",
    sss: [
      {
        s: "Kalabalık kutlamalarda kurulum ölçeği ne oluyor?",
        c: "Giriş kemeri, sahne arkası fon ve masa düzeni birlikte planlanıyor. Kalabalık kutlamalarda dayanıklılık, detaydan daha önemli.",
      },
    ],
    yakin: ["elmadag", "golbasi", "haymana", "kalecik"],
  },
  {
    slug: "haymana",
    ad: "Haymana",
    tip: "ilce",
    ozet: "Termal tesisler ve geniş kırsal; otel ve bahçe organizasyonları.",
    giris:
      "Haymana'da termal otellerde yapılan nişan ve aile kutlamaları ile ilçe merkezindeki salon organizasyonları öne çıkıyor. Otel işlerinde kurulum saatini tesise göre ayarlıyor, salon işlerinde ise geleneksel düzenle modern konsepti birleştiriyoruz.",
    mahalleler: ["Merkez", "Yeşilyurt", "Bumsuz", "Cingirli"],
    mekan: "Termal otel salonları, ilçe merkezi salonları, bahçeli mekanlar.",
    oneCikan: ["Söz & nişan", "Sünnet & kına", "Doğum günü", "Yıl dönümü"],
    mesafe: "Ankara merkezden yaklaşık 70 km; en az 1 hafta önceden planlama.",
    sss: [
      {
        s: "Otel salonu ölçüsünü nasıl alıyorsunuz?",
        c: "Genellikle otelin etkinlik sorumlusundan salon planını ve fotoğrafını istiyoruz; bu, yerinde keşif ihtiyacını çoğu işte ortadan kaldırıyor.",
      },
    ],
    yakin: ["golbasi", "polatli", "bala", "cankaya"],
  },
  {
    slug: "sereflikochisar",
    ad: "Şereflikoçhisar",
    tip: "ilce",
    ozet: "Tuz Gölü hattı; uzak mesafe, tek seferde tamamlanan kurulum.",
    giris:
      "Şereflikoçhisar, Ankara'nın güney ucunda, Tuz Gölü hattında. Buraya gelen işleri uzun planlama ve tek seferlik eksiksiz kurulum mantığıyla yürütüyoruz. Tuz Gölü çevresi, dış mekan çekimli nişan ve teklif organizasyonları için görsel olarak çok güçlü bir zemin.",
    mahalleler: ["Merkez", "Şereflifakılı", "Yeşilova", "Doğankaya"],
    mekan: "İlçe salonları, bahçeli mekanlar, Tuz Gölü çevresi dış mekan alanları.",
    oneCikan: ["Söz & nişan", "Evlilik teklifi", "Sünnet & kına", "Doğum günü"],
    mesafe: "Ankara merkezden yaklaşık 150 km; en az 10 gün önceden planlama.",
    sss: [
      {
        s: "Tuz Gölü kenarında kurulum yapılabiliyor mu?",
        c: "Yapılabiliyor. Zemin ve rüzgar nedeniyle hafif, taşınabilir ve hızlı toplanan sistemler kullanıyoruz.",
      },
    ],
    yakin: ["evren", "bala", "haymana", "golbasi"],
    // slug: sereflikochisar (Şereflikoçhisar)
  },
  {
    slug: "evren",
    ad: "Evren",
    tip: "ilce",
    ozet: "Ankara'nın en küçük ilçesi; önceden planlanmış kurulumlar.",
    giris:
      "Evren, Ankara'nın en küçük ve merkeze en uzak ilçesi. Buradan gelen talepler genellikle aile kutlaması ölçeğinde oluyor. Mesafe nedeniyle işi baştan net tanımlayıp tek seferde tamamlıyoruz.",
    mahalleler: ["Merkez", "Çayırlı", "Ayvalı"],
    mekan: "İlçe salonları ve bahçeli evler.",
    oneCikan: ["Sünnet & kına", "Söz & nişan", "Doğum günü"],
    mesafe: "Ankara merkezden yaklaşık 170 km; en az 10 gün önceden planlama.",
    sss: [
      {
        s: "Bu mesafede nasıl çalışıyorsunuz?",
        c: "Konsept ve ölçü tamamen önceden netleşiyor, malzeme yedekleriyle birlikte tek seferde götürülüyor. Ulaşım farkı teklifte ayrı satır olarak gösteriliyor.",
      },
    ],
    yakin: ["sereflikochisar", "bala", "haymana"],
  },
  {
    slug: "kalecik",
    ad: "Kalecik",
    tip: "ilce",
    ozet: "Kale ve bağlar; bağ evi ve dış mekan organizasyonları.",
    giris:
      "Kalecik, kalesi ve bağlarıyla dış mekan organizasyonu için ilgi çekici bir ilçe. Bağ evlerinde yapılan nişan ve aile kutlamaları, üzüm hasadı dönemine denk gelen etkinlikler burada öne çıkıyor. Doğal doku, toprak tonlu konseptlerle çok iyi çalışıyor.",
    mahalleler: ["Merkez", "Tavşancık", "Hasayaz", "Karalar"],
    mekan: "Bağ evleri, kale çevresi dış mekan alanları, ilçe salonları.",
    oneCikan: ["Söz & nişan", "Sünnet & kına", "Doğum günü", "Evlilik teklifi"],
    mesafe: "Ankara merkezden yaklaşık 75 km; en az 1 hafta önceden planlama.",
    sss: [
      {
        s: "Bağ evinde akşam kurulumu yapılabiliyor mu?",
        c: "Yapılabiliyor. Akşam kurulumlarında aydınlatma planını da birlikte çıkarıyoruz; pilli ışık sistemleri elektriksiz alanlarda iş görüyor.",
      },
    ],
    yakin: ["cubuk", "elmadag", "akyurt", "bala"],
  },
  {
    slug: "camlidere",
    ad: "Çamlıdere",
    tip: "ilce",
    ozet: "Orman ve yayla dokusu; doğa temalı organizasyonlar.",
    giris:
      "Çamlıdere'nin orman dokusu, doğa temalı kutlamalar için Ankara'da az bulunan bir ortam. Yayla evleri ve orman içi tesislerde yapılan aile kutlamaları ve küçük ölçekli nişanlar burada en sık çalıştığımız işler.",
    mahalleler: ["Merkez", "Peçenek", "Elmalı", "Bayındır"],
    mekan: "Yayla evleri, orman içi tesisler, ilçe merkezindeki salonlar.",
    oneCikan: ["Söz & nişan", "Doğum günü", "Sünnet & kına", "Baby shower"],
    mesafe: "Ankara merkezden yaklaşık 110 km; en az 10 gün önceden planlama.",
    sss: [
      {
        s: "Orman içi alanda kurulum için izin gerekiyor mu?",
        c: "Tesise bağlı. İşletme içindeki alanlarda tesis izni yeterli; kamuya açık orman alanlarında ilgili idareden izin alınması gerekiyor.",
      },
    ],
    yakin: ["kizilcahamam", "gudul", "kahramankazan", "nallihan"],
  },

  // ————————————————————————————————————————————————————————
  // YOĞUN TALEP GELEN SEMTLER
  // ————————————————————————————————————————————————————————
  {
    slug: "cayyolu",
    ad: "Çayyolu",
    tip: "semt",
    ust: "Ankara",
    ozet: "Ankara'nın çocuk partisi merkezi; parti evleri ve site tesisleri yoğun.",
    giris:
      "Çayyolu hattı, Ankara'da çocuk doğum günü kültürünün en güçlü olduğu bölge. Parti evleri, oyun alanları ve site sosyal tesisleri kutlamaların büyük kısmını karşılıyor. Aileler organizasyonu erken planlıyor ve konsept beklentisi yüksek; bu hatta tema tutarlılığı fiyattan daha çok konuşuluyor.",
    mahalleler: ["Çayyolu", "Ümitköy", "Konutkent", "Yaşamkent", "Alacaatlı", "Koru", "Prof. Dr. Ahmet Taner Kışlalı"],
    mekan:
      "Parti evleri ve çocuk oyun merkezleri ilk sırada; ardından site sosyal tesisleri ve hat üzerindeki kafeler geliyor. Doğum günü kurulumlarını mekanın açılış saatinden önce tamamlıyoruz.",
    oneCikan: ["Çocuk doğum günü", "Baby shower", "Gender reveal", "Söz & nişan"],
    mesafe: "Balgat'tan Çayyolu hattına yaklaşık 20–25 dakika.",
    sss: [
      {
        s: "Parti evine kurulum yapabiliyor musunuz?",
        c: "Yapıyoruz. Parti evlerinin çoğu kendi süsleme paketini sunuyor ama dışarıdan kurulum kabul ediyor. Rezervasyon sırasında bunu teyit etmeniz yeterli.",
      },
      {
        s: "Tema karakteri özel baskı yapabiliyor musunuz?",
        c: "Yapabiliyoruz. Özel baskılı pano ve isimli süslemeler için en az 4 gün önceden sipariş almamız gerekiyor.",
      },
      {
        s: "Kurulum ne kadar sürüyor?",
        c: "Orta ölçekli bir çocuk doğum günü kurulumu 60–90 dakika. Kutlama saatinden en az 1 saat önce bitiriyoruz.",
      },
    ],
    yakin: ["umitkoy", "bilkent-beysukent", "cankaya", "yenimahalle"],
  },
  {
    slug: "umitkoy",
    ad: "Ümitköy",
    tip: "semt",
    ust: "Ankara",
    ozet: "Çayyolu hattının merkezi; site tesisleri ve kafe kutlamaları.",
    giris:
      "Ümitköy, Çayyolu hattının en yerleşik bölgesi. Kutlamalar çoğunlukla site sosyal tesislerinde ve hat üzerindeki kafelerde yapılıyor. Yetişkin doğum günü ve baby shower talebi burada çocuk partilerinin yanında ciddi bir yer tutuyor.",
    mahalleler: ["Ümitköy", "Çayyolu", "Konutkent", "Koru", "Mutlukent"],
    mekan:
      "Site sosyal tesisleri, butik kafeler ve teraslı mekanlar. Küçük davetli sayısıyla yapılan butik kutlamalar bu semtte en sık çalıştığımız format.",
    oneCikan: ["Baby shower", "Doğum günü", "Söz & nişan", "Gender reveal"],
    mesafe: "Balgat'tan yaklaşık 20–25 dakika.",
    sss: [
      {
        s: "15–20 kişilik butik bir baby shower için neler kuruyorsunuz?",
        c: "Arka fon, balon kemeri, pasta masası düzeni ve çiçek aranjmanı standart. Kişiye özel isim panosu ve hediyelik masası isteğe bağlı ekleniyor.",
      },
      {
        s: "Kafede kurulum için izin gerekiyor mu?",
        c: "Gerekiyor. Mekanla kurulum saatini önceden netleştirmek yeterli; çoğu kafe rezervasyon saatinden 1 saat önce giriş veriyor.",
      },
    ],
    yakin: ["cayyolu", "bilkent-beysukent", "cankaya", "yenimahalle"],
  },
  {
    slug: "cukurambar",
    ad: "Çukurambar",
    tip: "semt",
    ust: "Çankaya",
    ozet: "Rezidans ve ofis yoğunluğu; kurumsal kutlama ile butik davet bir arada.",
    giris:
      "Çukurambar, atölyemize en yakın semtlerden biri. Rezidans yoğunluğu ve ofis kültürü nedeniyle burada iki tür talep birlikte geliyor: rezidans içi butik kutlamalar ve ofis kutlamaları, yıl dönümleri, terfi ve doğum günü sürprizleri. Kurulum süresi kısa, erişim hızlı.",
    mahalleler: ["Çukurambar", "Söğütözü", "Kızılırmak", "Mustafa Kemal"],
    mekan:
      "Rezidans ortak alanları ve daireler, çevredeki ofisler, Söğütözü hattındaki otel toplantı salonları ve restoranlar.",
    oneCikan: ["Ofis & kurumsal kutlama", "Doğum günü", "Söz & nişan", "Evlilik teklifi"],
    mesafe: "Balgat'taki atölyemize 5–10 dakika.",
    sss: [
      {
        s: "Ofise sürpriz kurulum yapabiliyor musunuz?",
        c: "Yapıyoruz. Bina girişi ve asansör kullanımı için önceden bilgi verilmesi, kurulumun sürpriz kalması açısından da faydalı oluyor.",
      },
      {
        s: "Rezidansta kurulum kısıtı olur mu?",
        c: "Bazı rezidanslar kurulum için yönetim onayı istiyor. Onay alınmışsa geri kalan tamamen bizde.",
      },
    ],
    yakin: ["balgat", "cankaya", "oran", "bilkent-beysukent"],
  },
  {
    slug: "balgat",
    ad: "Balgat",
    tip: "semt",
    ust: "Çankaya",
    ozet: "Atölyemizin ve kuaförümüzün bulunduğu semt; en hızlı hizmet verdiğimiz bölge.",
    giris:
      "Balgat, Gold Clover'ın merkezi. Aynı adreste Dilek Sanık Hair & Beauty Center da bulunuyor; bu yüzden Balgat'ta gelin saçı, makyaj ve organizasyon aynı gün, aynı ekiple planlanabiliyor. Semt içinde acil kurulumlara en kısa sürede yanıt verdiğimiz bölge burası.",
    mahalleler: ["Balgat", "Çukurambar", "Söğütözü", "Ehlibeyt", "Öveçler"],
    mekan:
      "Ev ve daire kutlamaları, semt içindeki kafe ve restoranlar, çevredeki ofisler ve otel salonları.",
    oneCikan: ["Gelin paketi (saç + makyaj + konsept)", "Doğum günü", "Söz & nişan", "Baby shower"],
    mesafe: "Atölyemiz Balgat'ta; semt içi kurulumlarda erişim süresi en kısa.",
    sss: [
      {
        s: "Gelin saçı ve organizasyonu birlikte alınca nasıl ilerliyor?",
        c: "Tek görüşmede konsept ve saç–makyaj birlikte planlanıyor, tek takvimde yürütülüyor. Gelinin hazırlık saati ile mekan kurulum saati aynı planda çakışmayacak şekilde ayarlanıyor.",
      },
      {
        s: "Aynı gün süsleme mümkün mü?",
        c: "Balgat içinde stoktaki konseptlerde çoğu zaman mümkün. Sabah saatlerinde ulaşırsanız aynı gün kurulum yapabiliyoruz.",
      },
    ],
    yakin: ["cukurambar", "oran", "cankaya", "bilkent-beysukent"],
  },
  {
    slug: "oran",
    ad: "Oran",
    tip: "semt",
    ust: "Çankaya",
    ozet: "Site yoğunluğu yüksek, sakin semt; butik davet ve ev kutlamaları.",
    giris:
      "Oran, kapalı site yapısının yoğun olduğu bir semt. Kutlamalar çoğunlukla site sosyal tesislerinde ve evlerde yapılıyor. Davetli sayısı görece küçük, konsept beklentisi ise yüksek; bu da detaylı ve sakin renk paletli kurulumlara alan açıyor.",
    mahalleler: ["Oran", "Yıldızevler", "Dikmen", "Karakusunlar"],
    mekan: "Site sosyal tesisleri, ev kutlamaları, semt içindeki kafeler.",
    oneCikan: ["Söz & nişan", "Doğum günü", "Baby shower", "Yıl dönümü"],
    mesafe: "Balgat'tan yaklaşık 10 dakika.",
    sss: [
      {
        s: "Site tesisinde kurulum saati nasıl ayarlanıyor?",
        c: "Tesis rezervasyon saatinden en az 90 dakika önce girmemiz yeterli. Yönetimden alınacak tek şey kurulum izni.",
      },
    ],
    yakin: ["balgat", "cankaya", "cukurambar", "golbasi"],
  },
  {
    slug: "bilkent-beysukent",
    ad: "Bilkent & Beysukent",
    tip: "semt",
    ust: "Çankaya",
    ozet: "Üniversite ve yerleşke hattı; mezuniyet, teklif ve butik davet.",
    giris:
      "Bilkent ve Beysukent hattı, üniversite yerleşkesi çevresinde şekilleniyor. Mayıs–haziran döneminde mezuniyet ve bölüm kutlamaları, yıl boyunca ise evlilik teklifi ve butik doğum günü talebi geliyor. Yerleşke içi kurulumlarda izin süreci önceden çözülmesi gereken tek konu.",
    mahalleler: ["Bilkent", "Beysukent", "Ümitköy sınırı", "Çayyolu sınırı"],
    mekan:
      "Yerleşke içi alanlar, çevredeki kafeler ve otel salonları, site sosyal tesisleri.",
    oneCikan: ["Mezuniyet & balo", "Evlilik teklifi", "Doğum günü", "Söz & nişan"],
    mesafe: "Balgat'tan yaklaşık 15–20 dakika.",
    sss: [
      {
        s: "Yerleşke içinde kurulum yapabiliyor musunuz?",
        c: "Yapabiliyoruz; ancak yerleşke yönetiminden araç girişi ve kurulum izni alınması gerekiyor. Bu izin genelde birkaç gün sürüyor.",
      },
      {
        s: "Mezuniyet için grup fiyatı var mı?",
        c: "Var. Bölüm veya sınıf ölçeğinde talep geldiğinde kişi başına düşen maliyeti düşüren paket kuruyoruz.",
      },
    ],
    yakin: ["cayyolu", "umitkoy", "cankaya", "balgat"],
  },
  {
    slug: "eryaman",
    ad: "Eryaman",
    tip: "semt",
    ust: "Etimesgut",
    ozet: "Genç aile yoğunluğu; ilk yaş, gender reveal ve baby shower.",
    giris:
      "Eryaman, Ankara'nın en genç aile profiline sahip bölgelerinden. Site sosyal tesisleri kutlama için hazır alan sunuyor; bu da özellikle birinci yaş doğum günü ve baby shower kurulumlarını kolaylaştırıyor. Hafta sonu takvimi bu semtte erken doluyor.",
    mahalleler: ["Eryaman", "Elvankent", "Güzelkent", "Devlet Mahallesi", "Ahi Mesut"],
    mekan: "Site sosyal tesisleri, semt içindeki kafeler, ev kutlamaları.",
    oneCikan: ["Gender reveal", "Birinci yaş doğum günü", "Baby shower", "Sünnet & kına"],
    mesafe: "Balgat'tan yaklaşık 25–35 dakika.",
    sss: [
      {
        s: "Hafta sonu için ne kadar önceden yer ayırtmalıyız?",
        c: "En az 10 gün. Eryaman'da hafta sonu takvimi diğer bölgelere göre daha hızlı doluyor.",
      },
      {
        s: "Birinci yaş konseptinde neler yer alıyor?",
        c: "Balon kemeri, arka fon, pasta masası düzeni, isimli pano ve aylık fotoğraf panosu en çok istenenler.",
      },
    ],
    yakin: ["etimesgut", "batikent", "sincan", "yenimahalle"],
  },
  {
    slug: "etlik",
    ad: "Etlik",
    tip: "semt",
    ust: "Keçiören",
    ozet: "Keçiören'in en yoğun hattı; sünnet, kına ve doğum günü.",
    giris:
      "Etlik, Keçiören'in en kalabalık ve hareketli hattı. Hastane yoğunluğu nedeniyle hastane odası süslemesi ve yeni doğan kutlaması talepleri de bu bölgeden geliyor. Sünnet ve kına sezonunda ise takvim erkenden doluyor.",
    mahalleler: ["Etlik", "Aşağı Eğlence", "Yükseltepe", "Şenlik", "Bağlum yolu"],
    mekan:
      "Ev ve salon kutlamaları, semt içindeki kafeler, hastane odaları.",
    oneCikan: ["Hastane odası süslemesi", "Sünnet & kına", "Doğum günü", "Baby shower"],
    mesafe: "Balgat'tan yaklaşık 25–30 dakika.",
    sss: [
      {
        s: "Hastane odası süslemesi ne kadar sürüyor?",
        c: "Kurulum 20–30 dakika. Hastaneye giriş için oda numarası ve ziyaret saatinin bize bildirilmesi yeterli.",
      },
      {
        s: "Hastane süslemesinde kısıt var mı?",
        c: "Var. Çoğu hastane koku yayan ürünlere ve duvara yapıştırmaya izin vermiyor; bu yüzden ayaklı ve serbest duran sistemlerle çalışıyoruz.",
      },
    ],
    yakin: ["kecioren", "altindag", "pursaklar", "yenimahalle"],
  },
  {
    slug: "batikent",
    ad: "Batıkent",
    tip: "semt",
    ust: "Yenimahalle",
    ozet: "Geniş site yerleşimi; sosyal tesis kutlamaları yoğun.",
    giris:
      "Batıkent, planlı site yapısıyla Ankara'nın kutlama altyapısı en hazır bölgelerinden. Neredeyse her sitenin sosyal tesisi var; bu da doğum günü ve sünnet kurulumlarını hem kolaylaştırıyor hem ucuzlatıyor. Metro erişimi nedeniyle davetli katılımı da yüksek oluyor.",
    mahalleler: ["Batıkent", "Çiğdemtepe", "Ergazi", "Kentkoop", "Uğur Mumcu"],
    mekan: "Site sosyal tesisleri, semt içi kafeler, ev kutlamaları.",
    oneCikan: ["Doğum günü", "Sünnet & kına", "Baby shower", "Söz & nişan"],
    mesafe: "Balgat'tan yaklaşık 25–30 dakika.",
    sss: [
      {
        s: "Sosyal tesiste kurulum için ekstra ücret alıyor musunuz?",
        c: "Hayır. Tesis kurulumu standart kurulum kapsamında; sadece asansörsüz kat ve uzun taşıma mesafesi varsa bunu önceden bilmemiz gerekiyor.",
      },
    ],
    yakin: ["yenimahalle", "eryaman", "etimesgut", "kecioren"],
  },
  {
    slug: "incek",
    ad: "İncek",
    tip: "semt",
    ust: "Gölbaşı",
    ozet: "Davet evleri ve kır bahçeleri hattı; söz ve nişanın en yoğun adresi.",
    giris:
      "İncek, Ankara'da söz ve nişanın en çok yapıldığı hatlardan biri. Davet evleri ve kır bahçeleri yan yana; mekanlar hazır geliyor, fark yaratan şey konsept oluyor. Bu bölgede mekanlarla doğrudan çalışıyor, gelin ve damat tarafının tek muhatapla ilerlemesini sağlıyoruz.",
    mahalleler: ["İncek", "Taşpınar", "Mogan çevresi", "Karagedik"],
    mekan:
      "Davet evleri, kır bahçeleri, göl manzaralı bahçe restoranları ve site sosyal tesisleri.",
    oneCikan: ["Söz & nişan", "Kır düğünü konsepti", "Evlilik teklifi", "Baby shower"],
    mesafe: "Balgat'tan yaklaşık 20–30 dakika.",
    sss: [
      {
        s: "Davet evinin kendi süsleme ekibi varsa ne oluyor?",
        c: "Mekanın dışarıdan kurulum politikasını önce teyit ediyoruz. İzin veriyorsa konsept tamamen bize kalıyor; vermiyorsa çiçek, hediyelik ve gelin hazırlığı tarafında destek veriyoruz.",
      },
      {
        s: "Nişan konsepti kaç gün önce netleşmeli?",
        c: "En az 2 hafta. Özel renk çiçek ve baskılı ürün gerekiyorsa 3 hafta daha rahat oluyor.",
      },
    ],
    yakin: ["golbasi", "oran", "cankaya", "balgat"],
  },
];

export default BOLGELER;

export const BOLGE_MAP = Object.fromEntries(BOLGELER.map((b) => [b.slug, b]));

export const ILCELER = BOLGELER.filter((b) => b.tip === "ilce");
export const SEMTLER = BOLGELER.filter((b) => b.tip === "semt");

export function bolgeBul(slug) {
  return BOLGE_MAP[slug] || null;
}

export function bolgeYolu(slug) {
  return `/organizasyon/${slug}`;
}

// Sayfa başlığı ve açıklaması tek yerden üretilir; hem React tarafı hem
// sunucudaki SEO enjeksiyonu aynı metni kullansın diye burada duruyor.
export function bolgeBaslik(b) {
  return `${b.ad} Organizasyon & Balon Süsleme | Gold Clover Ankara`;
}

// Meta description'ın arama sonucunda kırpılmaması için üst sınır ~158 karakter.
// Metin uzarsa hizmet listesi kısaltılır; cümle yarıda kesilmez.
const ACIKLAMA_SINIRI = 158;

export function bolgeAciklama(b) {
  for (let adet = 3; adet >= 1; adet--) {
    const hizmetler = b.oneCikan
      .slice(0, adet)
      .join(", ")
      .toLocaleLowerCase("tr-TR");
    const metin = `${b.ad} organizasyon ve balon süsleme: ${hizmetler}. Konsept, çiçek ve hediyelik. Gold Clover Ankara · 0551 862 56 60.`;
    if (metin.length <= ACIKLAMA_SINIRI || adet === 1) return metin;
  }
}
