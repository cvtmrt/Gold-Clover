import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Services from '../components/Services.jsx'
import Gallery from '../components/Gallery.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'
import useReveal from '../hooks/useReveal.js'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import BOLGELER, { bolgeBul, bolgeBaslik, bolgeAciklama, bolgeYolu } from '../data/bolgeler.js'
import '../styles/app.css'
import '../styles/bolge.css'

export default function BolgePage() {
  const { slug } = useParams()
  const bolge = bolgeBul(slug)
  useReveal(true)
  useDocumentMeta(
    bolge ? bolgeBaslik(bolge) : 'Bölge bulunamadı | Gold Clover',
    bolge
      ? bolgeAciklama(bolge)
      : 'Aradığınız bölge sayfası bulunamadı. Ankara genelinde hizmet verdiğimiz bölgeleri inceleyin.'
  )

  if (!bolge) return <Bulunamadi />

  const yakinlar = bolge.yakin.map(bolgeBul).filter(Boolean)

  return (
    <div className="site site--in">
      <Navbar />
      <main>
        <section className="hero hero--bolge" id="top">
          <div className="hero__bg" style={{ backgroundImage: 'url(/images/hero.webp)' }} />
          <div className="hero__overlay" />
          <div className="hero__content container">
            <nav className="bolge__crumb" aria-label="Konum">
              <Link to="/organizasyon">Organizasyon</Link>
              <span aria-hidden="true">›</span>
              <Link to="/organizasyon/bolgeler">Bölgeler</Link>
              <span aria-hidden="true">›</span>
              <strong>{bolge.ad}</strong>
            </nav>
            <span className="hero__eyebrow eyebrow reveal">
              Ankara {bolge.tip === 'semt' ? '· Semt' : '· İlçe'}
            </span>
            <h1 className="hero__title display reveal">
              {bolge.ad} <span className="script text-gold">organizasyon</span>
              <br /> ve balon süsleme
            </h1>
            <p className="hero__sub reveal">{bolge.ozet}</p>
            <div className="hero__actions reveal">
              <a href="#contact" className="btn btn-gold">Teklif Alın</a>
              <a
                className="btn btn-outline"
                href="https://wa.me/905518625660"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp’tan Yazın
              </a>
            </div>
          </div>
        </section>

        <section className="bolge" id="bolge">
          <div className="bolge__inner container">
            <div className="bolge__main">
              <span className="eyebrow reveal">{bolge.ad}’da Gold Clover</span>
              <h2 className="display reveal">
                {bolge.ad}’da <span className="text-gold">ne yapıyoruz</span>
              </h2>
              <p className="reveal">{bolge.giris}</p>
              <p className="reveal">{bolge.mekan}</p>

              <h3 className="bolge__h3 reveal">{bolge.ad}’da en çok istenen organizasyonlar</h3>
              <ul className="bolge__tags reveal">
                {bolge.oneCikan.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <h3 className="bolge__h3 reveal">
                Hizmet verdiğimiz {bolge.tip === 'semt' ? 'çevre' : 'mahalle ve semtler'}
              </h3>
              <ul className="bolge__tags bolge__tags--soft reveal">
                {bolge.mahalleler.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>

            <aside className="bolge__side reveal">
              <div className="bolge__card">
                <h3>Kısa bilgi</h3>
                <dl>
                  <dt>Bölge</dt>
                  <dd>
                    {bolge.ad}
                    {bolge.ust && bolge.ust !== 'Ankara' ? ` · ${bolge.ust}` : ''}, Ankara
                  </dd>
                  <dt>Ulaşım</dt>
                  <dd>{bolge.mesafe}</dd>
                  <dt>Atölye</dt>
                  <dd>Balgat, Çankaya</dd>
                  <dt>Telefon</dt>
                  <dd>
                    <a href="tel:+905518625660">0551 862 56 60</a>
                  </dd>
                </dl>
                <a href="#contact" className="btn btn-gold bolge__cardcta">
                  {bolge.ad} için teklif al
                </a>
                <p className="bolge__cardnote">
                  Aynı adreste <Link to="/kuafor">Dilek Sanık Hair &amp; Beauty Center</Link> —
                  gelin saçı ve makyajı organizasyonla aynı takvimde planlanır.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <Services />
        <Gallery />

        <section className="sss" id="sss">
          <div className="sss__inner container">
            <span className="eyebrow reveal">Sık sorulanlar</span>
            <h2 className="display reveal">
              {bolge.ad} için <span className="text-gold">merak edilenler</span>
            </h2>
            <div className="sss__list reveal">
              {bolge.sss.map((q) => (
                <details key={q.s} className="sss__item">
                  <summary>{q.s}</summary>
                  <p>{q.c}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="yakin" id="yakin">
          <div className="yakin__inner container">
            <span className="eyebrow reveal">Yakın bölgeler</span>
            <h2 className="display reveal">
              Ankara’nın <span className="text-gold">her yerindeyiz</span>
            </h2>
            <div className="yakin__grid reveal">
              {yakinlar.map((b) => (
                <Link key={b.slug} to={bolgeYolu(b.slug)} className="yakin__card">
                  <strong>{b.ad}</strong>
                  <span>{b.ozet}</span>
                </Link>
              ))}
            </div>
            <Link to="/organizasyon/bolgeler" className="btn btn-outline yakin__all">
              Tüm bölgeleri gör ({BOLGELER.length})
            </Link>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />

      <a
        className="wa-fab"
        href="https://wa.me/905518625660"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp ile yazın"
      >
        <WaIcon />
      </a>
    </div>
  )
}

function Bulunamadi() {
  return (
    <div className="site site--in">
      <Navbar />
      <main className="bolge404">
        <div className="container">
          <h1 className="display">Bu bölge sayfasını bulamadık</h1>
          <p>
            Ankara genelinde hizmet veriyoruz. Aşağıdaki listeden bölgenizi seçebilir veya
            doğrudan bize yazabilirsiniz.
          </p>
          <div className="bolge404__actions">
            <Link to="/organizasyon/bolgeler" className="btn btn-gold">Tüm bölgeler</Link>
            <Link to="/organizasyon" className="btn btn-outline">Ana sayfaya dön</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function WaIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.8L.5 31.5l7.9-2c2.3 1.2 4.9 1.9 7.6 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.2-4.6-.3-.5c-1.3-2.1-2-4.5-2-7C3 8.8 8.8 3 16 3s13 5.8 13 13-5.8 12.8-13 12.8zm7.2-9.8c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2s-1 1.3-1.2 1.5c-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5z" />
    </svg>
  )
}
