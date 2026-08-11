import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import BeforeAfter from '../components/BeforeAfter.jsx'
import TileCaption from '../components/TileCaption.jsx'
import Lightbox from '../components/Lightbox.jsx'
import '../styles/kuafor.css'

const PHONE_DISPLAY = '0552 391 56 60'
const PHONE_TEL = '+905523915660'
const WA = 'https://wa.me/905523915660'
// Google'daki işletme adı değişikliği onaylandı (2026-08-10). Yeni sorgu, eski
// sorguyla aynı noktaya düşüyor (39.88224, 32.81492 — ~12 m fark) — doğrulandı.
const MAP_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(
  'Dilek Sanık Hair & Beauty Center, Balgat, Ankara'
)}&z=15&output=embed`
const MAP_LINK = 'https://share.google/bx9TMZEIYhSD7em2F'

const SERVICES = [
  ['Saç', 'Kesim, boya, bakım, fön ve şekillendirme — size en yakışanı.'],
  ['Makyaj', 'Gündüz, gece ve özel gün makyajı; doğal veya gösterişli.'],
  ['Gelin Saçı & Makyajı', 'Düğün gününüz için prova dahil özel gelin paketi.'],
  ['Kaş & Kirpik', 'Kaş tasarımı, kirpik lifting ve ipek kirpik uygulamaları.'],
  ['Cilt & Kozmetik Bakım', 'Cilt bakımı, peeling ve kişiye özel bakım ritüelleri.'],
  ['Manikür & Pedikür', 'El ve ayak bakımı, kalıcı oje ve tırnak tasarımı.'],
]

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

// Galeri kategorileri — yalnızca her iki türden de fotoğraf varsa gösterilir.
const FILTERS = [
  ['all', 'Tümü'],
  ['foto', 'Çalışmalarımız'],
  ['donusum', 'Öncesi & Sonrası'],
]

export default function KuaforPage() {
  useReveal(true)
  useDocumentMeta(
    'Dilek Sanık Hair & Beauty Center | Balgat Ankara Kuaför',
    "Balgat, Ankara'da saç, makyaj, gelin saçı & makyajı, cilt ve kişisel bakım. Dilek Sanık Hair & Beauty Center. Her gün 09:00–19:00. Randevu: 0552 391 56 60."
  )

  const [status, setStatus] = useState('idle')
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null) // büyük görünümdeki fotoğrafın sırası

  // Öncesi/sonrası kayıtları ikinci fotoğrafı olmadan gösterilmez.
  const transformations = photos.filter((g) => g.kind === 'donusum' && g.hasAfter)
  const works = photos.filter((g) => g.kind !== 'donusum')
  const hasBothKinds = transformations.length > 0 && works.length > 0
  const shownPhotos =
    !hasBothKinds || filter === 'all' ? photos : filter === 'donusum' ? transformations : works

  useEffect(() => {
    let alive = true
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => alive && setPhotos(Array.isArray(data.items) ? data.items : []))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name') || '',
          phone: f.get('phone') || '',
          type: f.get('type') || '',
          date: f.get('date') || '',
          message: f.get('message') || '',
          brand: 'kuafor',
        }),
      })
      if (!res.ok) throw new Error('fail')
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="k">
      {/* NAV */}
      <header className="k-nav">
        <div className="k-nav__inner">
          <a href="#k-top" className="k-nav__brand">
            <img className="k-nav__mark" src="/ds-mark-light.png" alt="" aria-hidden="true" />
            <span className="k-nav__name">Dilek Sanık</span>
          </a>
          <nav className="k-nav__links">
            <a href="#k-hizmetler">Hizmetler</a>
            <a href="#k-saatler">Saatler</a>
            <a href="#k-galeri">Galeri</a>
            <Link to="/organizasyon" className="k-nav__switch">Organizasyon</Link>
            <a href="#k-iletisim" className="k-btn k-btn--gold">Randevu</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="k-hero" id="k-top">
        <div className="k-hero__glow" />
        <div className="k-hero__inner reveal">
          {/* Monogram; tam kilit (isim + alt satır) hemen altındaki başlıkta tekrarlanıyor. */}
          <img
            className="k-hero__logo"
            src="/ds-mark-light.png"
            alt=""
            aria-hidden="true"
            width="300"
            height="423"
          />
          <span className="k-hero__eyebrow">Balgat, Çankaya · Ankara</span>
          <h1 className="k-hero__title">Dilek <span className="k-script">Sanık</span></h1>
          <span className="k-hero__tagline">Hair &amp; Beauty Center</span>
          <p className="k-hero__sub">
            Güzellik, kozmetik ve kişisel bakımda ayrıcalıklı bir deneyim. Saçınızdan
            cildinize, en özel gününüzden günlük bakımınıza kadar yanınızdayız.
          </p>
          <div className="k-hero__actions">
            <a href="#k-iletisim" className="k-btn k-btn--gold">Randevu Al</a>
            <a href={WA} target="_blank" rel="noreferrer" className="k-btn k-btn--ghost">WhatsApp</a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="k-about">
        <div className="k-wrap k-about__inner">
          <div className="reveal">
            <span className="k-eyebrow">Hakkımızda</span>
            <h2 className="k-h2">Balgat’ta güzelliğin <span className="k-gold">adresi</span></h2>
            <p>
              Dilek Sanık Hair &amp; Beauty Center, Ankara Balgat’ta güzellik, kozmetik ve kişisel
              bakım hizmetleri sunan butik bir kuaför &amp; güzellik merkezidir. Deneyimli ekibimizle
              her misafirimize özel, rahat ve zarif bir deneyim sunuyoruz.
            </p>
            <p>
              İster özel gününüz için hazırlanın, ister kendinize vakit ayırın — burada önce siz
              varsınız.
            </p>
          </div>
          <div className="k-about__card reveal">
            <span className="k-about__label">Çalışma Saatleri</span>
            <strong className="k-about__hours">Her gün · 09:00 – 19:00</strong>
            <a href={`tel:${PHONE_TEL}`} className="k-about__phone">{PHONE_DISPLAY}</a>
            <span className="k-about__loc">Balgat, Çankaya / Ankara</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="k-services" id="k-hizmetler">
        <div className="k-wrap">
          <div className="k-head reveal">
            <span className="k-eyebrow">Hizmetler</span>
            <h2 className="k-h2">Size özel <span className="k-gold">bakım</span></h2>
          </div>
          <div className="k-services__grid">
            {SERVICES.map(([title, desc], i) => (
              <article className="k-svc reveal" key={title}>
                <span className="k-svc__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOURS */}
      <section className="k-hours" id="k-saatler">
        <div className="k-wrap k-hours__inner">
          <div className="reveal">
            <span className="k-eyebrow">Çalışma Saatleri</span>
            <h2 className="k-h2">Haftanın <span className="k-gold">her günü</span></h2>
            <p>Randevu için bizi arayabilir veya WhatsApp’tan yazabilirsiniz.</p>
            <a href={WA} target="_blank" rel="noreferrer" className="k-btn k-btn--gold">WhatsApp’tan Yaz</a>
          </div>
          <ul className="k-hours__list reveal">
            {DAYS.map((d) => (
              <li key={d}><span>{d}</span><b>09:00 – 19:00</b></li>
            ))}
          </ul>
        </div>
      </section>

      {/* GALLERY */}
      <section className="k-gallery" id="k-galeri">
        <div className="k-wrap">
          <div className="k-head reveal">
            <span className="k-eyebrow">Galeri</span>
            <h2 className="k-h2">Atölyemizden</h2>
            {photos.length === 0 && (
              <p className="k-muted">Gerçek çalışma fotoğraflarımız çok yakında burada.</p>
            )}
            {hasBothKinds && (
              <div className="k-filters" role="tablist" aria-label="Galeri kategorileri">
                {FILTERS.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={filter === key}
                    className={`k-chip${filter === key ? ' k-chip--on' : ''}`}
                    onClick={() => { setFilter(key); setLightbox(null) }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            {filter === 'donusum' && shownPhotos.length > 0 && (
              <p className="k-muted k-gallery__hint">Ayracı sürükleyerek öncesi/sonrasını karşılaştırın.</p>
            )}
          </div>
          <div className="k-gallery__grid">
            {photos.length > 0
              ? shownPhotos.map((g, i) =>
                  g.kind === 'donusum' && g.hasAfter ? (
                    <BeforeAfter
                      key={g.id}
                      beforeSrc={`/api/gallery/${g.id}/image`}
                      afterSrc={`/api/gallery/${g.id}/image-after`}
                      caption={g.caption}
                      onExpand={() => setLightbox(i)}
                    />
                  ) : (
                    <button
                      type="button"
                      className="k-tile k-tile--photo"
                      key={g.id}
                      onClick={() => setLightbox(i)}
                      aria-label={`${g.caption || 'Fotoğrafı'} büyüt`}
                    >
                      <img src={`/api/gallery/${g.id}/image`} alt={g.caption || 'Dilek Sanık'} loading="lazy" />
                      <TileCaption text={g.caption} as="span" />
                    </button>
                  )
                )
              : [0, 1, 2, 3, 4, 5].map((n) => (
                  <div className={`k-tile k-tile--${n % 3}`} key={n}><span>DS</span></div>
                ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="k-contact" id="k-iletisim">
        <div className="k-wrap k-contact__inner">
          <div className="k-contact__info reveal">
            <span className="k-eyebrow">Randevu & İletişim</span>
            <h2 className="k-h2">Sizi <span className="k-gold">bekliyoruz</span></h2>
            <p>Randevu talebinizi bırakın, en kısa sürede size dönelim.</p>
            <ul className="k-contact__list">
              <li><span>Telefon</span><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></li>
              <li><span>WhatsApp</span><a href={WA} target="_blank" rel="noreferrer">{PHONE_DISPLAY}</a></li>
              <li><span>Adres</span><b>Balgat, Çankaya / Ankara</b></li>
              <li><span>Saatler</span><b>Her gün 09:00 – 19:00</b></li>
            </ul>

            <div className="k-map">
              <iframe
                title="Dilek Sanık Hair &amp; Beauty Center — Konum"
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a className="k-map__link" href={MAP_LINK} target="_blank" rel="noreferrer">
                Google Maps’te Aç →
              </a>
            </div>
          </div>

          <form className="k-form reveal" onSubmit={handleSubmit}>
            <div className="k-field">
              <label htmlFor="k-name">Ad Soyad</label>
              <input id="k-name" name="name" type="text" required placeholder="Adınız" />
            </div>
            <div className="k-field-row">
              <div className="k-field">
                <label htmlFor="k-phone">Telefon</label>
                <input id="k-phone" name="phone" type="tel" placeholder="05xx xxx xx xx" />
              </div>
              <div className="k-field">
                <label htmlFor="k-date">Tarih</label>
                <input id="k-date" name="date" type="date" />
              </div>
            </div>
            <div className="k-field">
              <label htmlFor="k-type">Hizmet</label>
              <select id="k-type" name="type" defaultValue="">
                <option value="" disabled>Seçiniz</option>
                {SERVICES.map(([t]) => <option key={t}>{t}</option>)}
                <option>Diğer</option>
              </select>
            </div>
            <div className="k-field">
              <label htmlFor="k-msg">Notunuz</label>
              <textarea id="k-msg" name="message" rows="3" placeholder="İsteğinizi kısaca yazın..." />
            </div>
            <button type="submit" className="k-btn k-btn--gold k-form__submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Gönderiliyor…' : status === 'sent' ? 'Talebiniz alındı ✨' : 'Randevu Talebi Gönder'}
            </button>
            <p className="k-form__note">
              {status === 'sent'
                ? 'Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz.'
                : status === 'error'
                ? 'Bir hata oluştu. Lütfen bizi arayın veya WhatsApp’tan yazın.'
                : 'Talebiniz doğrudan salonumuza ulaşır.'}
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="k-footer">
        <div className="k-wrap k-footer__inner">
          <div className="k-footer__brand">
            <img className="k-nav__mark" src="/ds-mark-light.png" alt="" aria-hidden="true" />
            <span>Dilek Sanık — Hair &amp; Beauty Center</span>
          </div>
          <div className="k-footer__meta">
            <span>Balgat, Çankaya / Ankara · Her gün 09:00–19:00</span>
            <span>© {new Date().getFullYear()} Dilek Sanık · <Link to="/">Gold Clover</Link></span>
          </div>
        </div>
      </footer>

      {lightbox !== null && (
        <Lightbox
          items={shownPhotos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={(adim) =>
            setLightbox((i) => (i + adim + shownPhotos.length) % shownPhotos.length)
          }
        />
      )}

      {/* WhatsApp FAB */}
      <a className="k-fab" href={WA} target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
          <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.8L.5 31.5l7.9-2c2.3 1.2 4.9 1.9 7.6 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.2-4.6-.3-.5c-1.3-2.1-2-4.5-2-7C3 8.8 8.8 3 16 3s13 5.8 13 13-5.8 12.8-13 12.8zm7.2-9.8c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2s-1 1.3-1.2 1.5c-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5z"/>
        </svg>
      </a>
    </div>
  )
}
