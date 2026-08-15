import { Link } from 'react-router-dom'
import BOLGELER, { SEMTLER, ILCELER, bolgeYolu } from '../data/bolgeler.js'

// Organizasyon ana sayfasındaki bölge şeridi: hem ziyaretçiye "bize gelir mi"
// sorusunu cevaplar hem de bölge sayfalarına iç link verir.
const ONE_CIKAN = [...SEMTLER.slice(0, 6), ...ILCELER.slice(0, 8)]

export default function BolgeSerit() {
  return (
    <section className="serit" id="bolgeler">
      <div className="serit__inner container">
        <span className="eyebrow reveal">Hizmet bölgeleri</span>
        <h2 className="display reveal">
          Ankara’nın <span className="text-gold">her ilçesine</span> geliyoruz
        </h2>
        <p className="serit__lead reveal">
          Atölyemiz Balgat’ta. Kurulum ekibimiz Ankara’nın 25 ilçesine ve yoğun talep gelen
          semtlere gidiyor. Bölgenizi seçin; o bölgedeki mekanlar, ulaşım süresi ve sık sorulanlar
          sizi bekliyor.
        </p>

        <ul className="serit__list reveal">
          {ONE_CIKAN.map((b) => (
            <li key={b.slug}>
              <Link to={bolgeYolu(b.slug)}>{b.ad}</Link>
            </li>
          ))}
        </ul>

        <Link to="/organizasyon/bolgeler" className="btn btn-gold serit__cta">
          Tüm bölgeleri gör ({BOLGELER.length})
        </Link>
      </div>
    </section>
  )
}
