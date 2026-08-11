// Galeri karosunun alt yazısı. Panelde tek alan olarak girilen açıklamayı
// "—" işaretinden ayırıp başlık + açıklama diye iki kademede gösterir:
// "Sombre balayaj — doğal geçişli kahve tonları" → başlık / detay.
export default function TileCaption({ text, as: Tag = 'figcaption' }) {
  if (!text) return null
  const [title, ...rest] = String(text).split('—')
  const detail = rest.join('—').trim()

  return (
    <Tag className="k-cap">
      <span className="k-cap__title">{title.trim()}</span>
      {detail && <span className="k-cap__detail">{detail}</span>}
    </Tag>
  )
}
