import { Link } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import '../styles/portal.css'

export default function PortalPage() {
  useDocumentMeta(
    'Gold Clover — Organizasyon & DS Önce Sen Kuaför | Ankara',
    "Gold Clover Organizasyon ve DS Önce Sen (Dilek Kuaför Balgat). Ankara'da etkinlik organizasyonu ve güzellik & kişisel bakım."
  )

  return (
    <div className="portal">
      <div className="portal__head">
        <span className="portal__eyebrow">Ankara</span>
        <h1 className="portal__wordmark script">Gold Clover</h1>
        <p className="portal__lead">Nereye gitmek istersiniz?</p>
      </div>

      <div className="portal__split">
        <Link to="/organizasyon" className="portal__panel portal__panel--org">
          <span className="portal__veil" />
          <div className="portal__content">
            <img src="/clover.svg" alt="" className="portal__mark" />
            <h2 className="portal__name display">Organizasyon</h2>
            <span className="portal__sub">Söz · Nişan · Doğum Günü · Konsept</span>
            <span className="portal__cta">Keşfet →</span>
          </div>
        </Link>

        <Link to="/kuafor" className="portal__panel portal__panel--kuafor">
          <span className="portal__veil" />
          <div className="portal__content">
            <span className="portal__ds">DS</span>
            <h2 className="portal__name display">Kuaför &amp; Güzellik</h2>
            <span className="portal__sub">DS Önce Sen · Dilek Kuaför · Balgat</span>
            <span className="portal__cta">Keşfet →</span>
          </div>
        </Link>
      </div>

      <div className="portal__foot">© {new Date().getFullYear()} Gold Clover · Ankara</div>
    </div>
  )
}
