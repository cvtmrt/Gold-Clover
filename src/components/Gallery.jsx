const SHOTS = [
  { src: '/images/hero.webp', cls: 'g-wide', cap: 'Düğün' },
  { src: '/images/gallery-rings.webp', cls: 'g-tall', cap: 'Nişan' },
  { src: '/images/celebration.webp', cls: '', cap: 'Kutlama' },
  { src: '/images/corporate.webp', cls: '', cap: 'Kurumsal' },
  { src: '/images/gallery-aisle.webp', cls: 'g-tall', cap: 'Tören' },
  { src: '/images/wedding.webp', cls: 'g-wide', cap: 'Detay' },
]

export default function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Anılardan</span>
          <h2>Kadraja sığan zarafet</h2>
          <span className="divider" />
          <p>İmzamızı taşıyan organizasyonlardan seçkiler.</p>
        </div>

        <div className="gallery__grid">
          {SHOTS.map((s, i) => (
            <figure className={`shot ${s.cls} reveal`} key={i}>
              <img src={s.src} alt={s.cap} loading="lazy" />
              <figcaption><span className="script">{s.cap}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
