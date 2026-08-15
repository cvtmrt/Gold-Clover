import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'
import useReveal from '../hooks/useReveal.js'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { ILCELER, SEMTLER, bolgeYolu } from '../data/bolgeler.js'
import '../styles/app.css'
import '../styles/bolge.css'

export default function BolgelerPage() {
  useReveal(true)
  useDocumentMeta(
    'Ankara Organizasyon Bölgeleri — Tüm İlçe ve Semtler | Gold Clover',
    "Gold Clover Ankara'nın 25 ilçesinde ve yoğun talep gelen semtlerde organizasyon, balon süsleme ve çiçek hizmeti veriyor. Bölgenizi seçin, teklif alın."
  )

  return (
    <div className="site site--in">
      <Navbar />
      <main>
        <section className="hero hero--bolge hero--liste" id="top">
          <div className="hero__bg" style={{ backgroundImage: 'url(/images/hero.webp)' }} />
          <div className="hero__overlay" />
          <div className="hero__content container">
            <nav className="bolge__crumb" aria-label="Konum">
              <Link to="/organizasyon">Organizasyon</Link>
              <span aria-hidden="true">›</span>
              <strong>Bölgeler</strong>
            </nav>
            <span className="hero__eyebrow eyebrow reveal">Ankara Geneli</span>
            <h1 className="hero__title display reveal">
              Ankara’nın <span className="script text-gold">her</span> bölgesinde
            </h1>
            <p className="hero__sub reveal">
              Atölyemiz Balgat’ta; kurulum ekibimiz Ankara’nın 25 ilçesine ve yoğun talep gelen
              semtlere gidiyor. Bölgenizi seçin, o bölgeye özel bilgileri ve sık sorulanları görün.
            </p>
          </div>
        </section>

        <section className="liste" id="ilceler">
          <div className="liste__inner container">
            <span className="eyebrow reveal">Semtler</span>
            <h2 className="display reveal">
              En çok çalıştığımız <span className="text-gold">semtler</span>
            </h2>
            <div className="liste__grid reveal">
              {SEMTLER.map((b) => (
                <Link key={b.slug} to={bolgeYolu(b.slug)} className="liste__card">
                  <strong>{b.ad}</strong>
                  <span>{b.ozet}</span>
                  <em>{b.mesafe}</em>
                </Link>
              ))}
            </div>

            <span className="eyebrow reveal liste__ara">İlçeler</span>
            <h2 className="display reveal">
              Ankara’nın <span className="text-gold">25 ilçesi</span>
            </h2>
            <div className="liste__grid reveal">
              {ILCELER.map((b) => (
                <Link key={b.slug} to={bolgeYolu(b.slug)} className="liste__card">
                  <strong>{b.ad}</strong>
                  <span>{b.ozet}</span>
                  <em>{b.mesafe}</em>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  )
}
