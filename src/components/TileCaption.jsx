// Galeri karosunun alt yazısı: üstte serif başlık, altında ince detay satırı.
// Panele yazı girenin belirli bir kalıba uymasını beklemiyoruz — metni olduğu
// gibi alıp en makul yerden ikiye ayırıyoruz.
const AYRAC = /\s[—–|·]\s/ // açıkça ayraç konmuşsa önceliği o alır
const BASLIK_UST_SINIR = 68 // bundan uzun bir başlık karoda blok gibi görünüyor
const EN_KISA_BASLIK = 16 // "Saç," gibi tek kelimelik bir başlık üretmeyelim

function ayir(metin) {
  const t = metin.trim()

  // 1) Elle konmuş ayraç: "Sombre balayaj — doğal geçişli kahve tonları"
  const parcalar = t.split(AYRAC)
  if (parcalar.length > 1) {
    return { baslik: parcalar[0].trim(), detay: parcalar.slice(1).join(' · ').trim() }
  }

  // 2) İlk cümle başlık olacak kadar kısaysa oradan böl
  const nokta = t.indexOf('. ')
  if (nokta > 0 && nokta <= BASLIK_UST_SINIR) {
    return { baslik: t.slice(0, nokta).trim(), detay: t.slice(nokta + 1).trim() }
  }

  // 3) Cümle sınırı yoksa ilk virgülü ayraç gibi kullan
  const virgul = t.indexOf(', ')
  if (virgul >= EN_KISA_BASLIK && virgul <= BASLIK_UST_SINIR) {
    return { baslik: t.slice(0, virgul).trim(), detay: t.slice(virgul + 1).trim() }
  }

  // 4) Bölünecek yer yok ama kısa: tamamı başlık
  if (t.length <= BASLIK_UST_SINIR) return { baslik: t, detay: '' }

  // 5) Uzun ve bölünemiyor — hepsini ince detay satırı olarak bas ki
  //    dev serif blok halinde karoyu kaplamasın.
  return { baslik: '', detay: t }
}

export default function TileCaption({ text, as: Tag = 'figcaption' }) {
  if (!text) return null
  const { baslik, detay } = ayir(String(text))
  if (!baslik && !detay) return null

  return (
    <Tag className="k-cap">
      {baslik && <span className="k-cap__title">{baslik}</span>}
      {detay && <span className="k-cap__detail">{detay}</span>}
    </Tag>
  )
}
