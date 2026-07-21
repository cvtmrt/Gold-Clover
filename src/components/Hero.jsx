export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__bg" style={{ backgroundImage: 'url(/images/hero.webp)' }} />
      <div className="hero__overlay" />

      <div className="hero__content container">
        <span className="hero__eyebrow eyebrow reveal">Ankara &middot; Etkinlik &amp; Organizasyon</span>
        <h1 className="hero__title display reveal">
          Anlarınızı <span className="script text-gold">altına</span>
          <br /> dönüştürüyoruz
        </h1>
        <p className="hero__sub reveal">
          Düğünden nişana, özel kutlamalardan kurumsal etkinliklere —
          her detayı sizin için özenle kurgular, unutulmaz bir gün armağan ederiz.
        </p>
        <div className="hero__actions reveal">
          <a href="#contact" className="btn btn-gold">Hayalinizi Anlatın</a>
          <a href="#services" className="btn btn-outline">Hizmetleri Keşfet</a>
        </div>

        <div className="hero__stats reveal">
          <div><strong>250+</strong><span>Kusursuz Organizasyon</span></div>
          <div><strong>12 Yıl</strong><span>Sektör Tecrübesi</span></div>
          <div><strong>%100</strong><span>Memnun Davetli</span></div>
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label="Aşağı kaydır">
        <span />
      </a>
    </section>
  )
}
