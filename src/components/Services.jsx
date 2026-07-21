const SERVICES = [
  {
    img: '/images/wedding.webp',
    tag: '01',
    title: 'Düğün & Nişan',
    desc: 'Kına, nişan, düğün ve after-party. Masa düzeninden gelin girişine, ilk dansınızdan havai fişeğe kadar romantik ve kusursuz bir kurgu.',
    items: ['Konsept & süsleme', 'Gelin–damat girişi', 'Sahne & pist tasarımı'],
  },
  {
    img: '/images/celebration.webp',
    tag: '02',
    title: 'Özel Kutlamalar',
    desc: 'Doğum günü, baby shower, mezuniyet ve evlilik teklifi. Küçük ama unutulmaz anları, size özel temalarla büyütüyoruz.',
    items: ['Temalı tasarım', 'Sürpriz kurgusu', 'Pasta & ikram düzeni'],
  },
  {
    img: '/images/corporate.webp',
    tag: '03',
    title: 'Kurumsal Etkinlik',
    desc: 'Lansman, gala, açılış, kongre ve bayi toplantıları. Markanızın prestijini yansıtan, akışı dakikası dakikasına planlanmış etkinlikler.',
    items: ['Sahne & prodüksiyon', 'Marka deneyimi', 'Protokol & organizasyon'],
  },
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Ne Yapıyoruz</span>
          <h2>Her davet için özel bir hikâye</h2>
          <span className="divider" />
          <p>Üç uzmanlık alanı, tek bir tutku: sizi ve misafirlerinizi büyülemek.</p>
        </div>

        <div className="services__grid">
          {SERVICES.map((s) => (
            <article className="svc reveal" key={s.title}>
              <div className="svc__media">
                <img src={s.img} alt={s.title} loading="lazy" />
                <span className="svc__tag">{s.tag}</span>
              </div>
              <div className="svc__body">
                <h3 className="display">{s.title}</h3>
                <p>{s.desc}</p>
                <ul>
                  {s.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
                <a href="#contact" className="svc__link">
                  Detaylı Bilgi
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
