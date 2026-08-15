import { Link } from 'react-router-dom'
import { SEMTLER, ILCELER, bolgeYolu } from '../data/bolgeler.js'

// Footer'daki bölge sütunu: en çok talep gelen semtler + merkez ilçeler.
// Tam liste /organizasyon/bolgeler sayfasında.
const ONE_CIKAN_BOLGELER = [...SEMTLER.slice(0, 5), ...ILCELER.slice(0, 4)]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src="/clover.svg" alt="" />
            <span className="display">Gold Clover</span>
          </div>
          <p>Ankara merkezli etkinlik &amp; organizasyon atölyesi. Anlarınızı zarafetle kurguluyoruz.</p>
        </div>

        <div className="footer__cols">
          <div>
            <h4>Keşfet</h4>
            <a href="#about">Hakkımızda</a>
            <a href="#services">Hizmetler</a>
            <a href="#process">Süreç</a>
            <a href="#gallery">Galeri</a>
          </div>
          <div>
            <h4>Hizmetler</h4>
            <a href="#services">Düğün &amp; Nişan</a>
            <a href="#services">Özel Kutlamalar</a>
            <a href="#services">Kurumsal Etkinlik</a>
          </div>
          <div>
            <h4>Bölgeler</h4>
            {ONE_CIKAN_BOLGELER.map((b) => (
              <Link key={b.slug} to={bolgeYolu(b.slug)}>{b.ad}</Link>
            ))}
            <Link to="/organizasyon/bolgeler" className="footer__more">Tüm bölgeler →</Link>
          </div>
          <div>
            <h4>İletişim</h4>
            <a href="https://www.instagram.com/gold_cloverr" target="_blank" rel="noreferrer">@gold_cloverr</a>
            <a href="mailto:hello@goldclover.com">hello@goldclover.com</a>
            <span>Çankaya, Ankara</span>
          </div>
        </div>
      </div>
      <div className="footer__bar container">
        <span>© {new Date().getFullYear()} Gold Clover Organizasyon. Tüm hakları saklıdır.</span>
        <span>Ankara ile tasarlandı ✦</span>
      </div>
    </footer>
  )
}
