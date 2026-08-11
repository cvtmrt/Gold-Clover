// Galeri yazısı iki yerde görünür ve ikisinde farklı davranır:
//   variant="tile" → karonun altında tek satırlık kısa etiket (yer dar)
//   variant="full" → büyük görünümde başlık + tam metin (yer bol)
// Panele girilen metnin belirli bir kalıba uyması beklenmez.
const AYRAC = /\s[—–|·]\s/ // elle ayraç konmuşsa önceliği o alır
const KARO_SINIR = 58 // karoda bundan uzun etiket iki satıra taşıp kırpılıyor
const BASLIK_UST_SINIR = 80 // yalnızca büyük görünümde kullanılır, orada yer bol
const EN_KISA_BASLIK = 16

// Kelimeyi ortasından kesmeden kısaltır; mümkünse cümle sonunda biter.
function kisalt(metin, sinir) {
  const t = metin.trim()
  if (t.length <= sinir) return t

  const cumle = t.lastIndexOf('. ', sinir)
  if (cumle > sinir * 0.45) return t.slice(0, cumle + 1)

  const kesit = t.slice(0, sinir)
  const bosluk = kesit.lastIndexOf(' ')
  const govde = bosluk > sinir * 0.45 ? kesit.slice(0, bosluk) : kesit
  return govde.replace(/[,;:.\s]+$/, '') + '…'
}

function ayir(metin) {
  const t = metin.trim()

  const parcalar = t.split(AYRAC)
  if (parcalar.length > 1) {
    return { baslik: parcalar[0].trim(), detay: parcalar.slice(1).join(' · ').trim() }
  }

  const nokta = t.indexOf('. ')
  if (nokta > 0 && nokta <= BASLIK_UST_SINIR) {
    return { baslik: t.slice(0, nokta).trim(), detay: t.slice(nokta + 1).trim() }
  }

  const virgul = t.indexOf(', ')
  if (virgul >= EN_KISA_BASLIK && virgul <= BASLIK_UST_SINIR) {
    return { baslik: t.slice(0, virgul).trim(), detay: t.slice(virgul + 1).trim() }
  }

  if (t.length <= BASLIK_UST_SINIR) return { baslik: t, detay: '' }
  return { baslik: '', detay: t }
}

export default function TileCaption({ text, as: Tag = 'figcaption', variant = 'tile' }) {
  if (!text) return null
  const t = String(text).trim()
  if (!t) return null

  // Karoda tek satır: uzun metin burada okunmuyor, tamamı büyük görünümde.
  if (variant === 'tile') {
    return (
      <Tag className="k-cap k-cap--tile">
        <span className="k-cap__title">{kisalt(t, KARO_SINIR)}</span>
      </Tag>
    )
  }

  const { baslik, detay } = ayir(t)
  return (
    <Tag className="k-cap k-cap--full">
      {baslik && <span className="k-cap__title">{baslik}</span>}
      {detay && <span className="k-cap__detail">{detay}</span>}
    </Tag>
  )
}
