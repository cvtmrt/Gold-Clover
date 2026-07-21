import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  ['Hakkımızda', '#about'],
  ['Hizmetler', '#services'],
  ['Süreç', '#process'],
  ['Galeri', '#gallery'],
  ['İletişim', '#contact'],
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onOrg = pathname === '/organizasyon'
  // Org sayfasında hero koyu olduğu için şeffaf nav; diğer sayfalarda (açık zemin) hep solid.
  const solid = scrolled || !onOrg

  // Org sayfasındaysak sayfa içi kaydırma (#), değilsek org sayfasına gidip kaydır.
  const secHref = (hash) => (onOrg ? hash : `/organizasyon${hash}`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
          <img src="/clover.svg" alt="" className="nav__logo" />
          <span className="nav__name display">Gold Clover</span>
        </Link>

        <nav className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          {LINKS.map(([label, hash]) => (
            <a key={hash} href={secHref(hash)} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <Link to="/urunler" className={pathname === '/urunler' ? 'is-active' : ''} onClick={() => setOpen(false)}>Ürünler</Link>
          <Link to="/kuafor" className="nav__switch" onClick={() => setOpen(false)}>Kuaför</Link>
          <a href={secHref('#contact')} className="btn btn-gold nav__cta" onClick={() => setOpen(false)}>Teklif Al</a>
        </nav>

        <button
          className={`nav__burger ${open ? 'is-open' : ''}`}
          aria-label="Menü"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
