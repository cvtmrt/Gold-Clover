export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__inner container">
        <div className="about__media reveal">
          <img src="/images/gallery-aisle.webp" alt="Zarif düğün töreni koridoru" />
          <div className="about__badge">
            <span className="script">Gold</span>
            <span className="about__badge-sub">Clover</span>
          </div>
        </div>

        <div className="about__text">
          <span className="eyebrow reveal">Biz Kimiz</span>
          <h2 className="display reveal">
            Her yaprağı şansa, her anı <span className="text-gold">zarafete</span> dokunan bir ekip
          </h2>
          <p className="reveal">
            Gold Clover, Ankara merkezli bir etkinlik ve organizasyon atölyesidir. Dört yapraklı
            yoncanın getirdiği o nadir şansı, titiz bir planlama ve estetik bir dokunuşla
            gerçeğe dönüştürüyoruz. Konsept tasarımından sahne kurulumuna, çiçekten ışığa
            kadar her ayrıntıyı tek elden yönetiriz.
          </p>
          <ul className="about__list reveal">
            <li><CheckIcon /> Uçtan uca konsept &amp; sahne tasarımı</li>
            <li><CheckIcon /> Mekan, catering ve tedarikçi koordinasyonu</li>
            <li><CheckIcon /> Işık, ses ve görüntü prodüksiyonu</li>
            <li><CheckIcon /> Gün boyu profesyonel saha yönetimi</li>
          </ul>
          <a href="#contact" className="btn btn-outline reveal">Bizimle Tanışın</a>
        </div>
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
