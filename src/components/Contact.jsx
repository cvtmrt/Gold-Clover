import { useState } from 'react'

const MAP_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(
  'Bir Damla Kuaför & Güzellik Salonu, Balgat, Ankara'
)}&z=15&output=embed`
const MAP_LINK = 'https://share.google/uOBZCIBSEmOiR2J1n'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

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
          brand: 'organizasyon',
        }),
      })
      if (!res.ok) throw new Error('request failed')
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__inner container">
        <div className="contact__info">
          <span className="eyebrow reveal">İletişim</span>
          <h2 className="display reveal">Hayalinizi <span className="text-gold">birlikte</span> tasarlayalım</h2>
          <p className="reveal">
            Aklınızdaki organizasyonu bize anlatın; 24 saat içinde size özel bir konsept ve
            teklifle geri dönelim. İlk görüşme daima ücretsizdir.
          </p>

          <ul className="contact__list reveal">
            <li>
              <PinIcon />
              <div><strong>Ankara</strong><span>Türkiye</span></div>
            </li>
            <li>
              <PhoneIcon />
              <div>
                <a href="tel:+905518625660"><strong>0551 862 56 60</strong></a>
                <span>Telefon &amp; WhatsApp</span>
              </div>
            </li>
            <li>
              <InstaIcon />
              <div>
                <a href="https://www.instagram.com/gold_cloverr" target="_blank" rel="noreferrer"><strong>@gold_cloverr</strong></a>
                <span>Son işlerimizi keşfedin</span>
              </div>
            </li>
          </ul>

          <div className="contact__map reveal">
            <iframe
              title="Konum — Google Haritalar"
              src={MAP_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a className="contact__maplink" href={MAP_LINK} target="_blank" rel="noreferrer">
              Google Maps’te Aç →
            </a>
          </div>
        </div>

        <form className="contact__form reveal" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Ad Soyad</label>
            <input id="name" name="name" type="text" required placeholder="Adınız" />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="phone">Telefon</label>
              <input id="phone" name="phone" type="tel" placeholder="05xx xxx xx xx" />
            </div>
            <div className="field">
              <label htmlFor="date">Tarih</label>
              <input id="date" name="date" type="date" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="type">Organizasyon Türü</label>
            <select id="type" name="type" defaultValue="">
              <option value="" disabled>Seçiniz</option>
              <option>Düğün &amp; Nişan</option>
              <option>Özel Kutlama</option>
              <option>Kurumsal Etkinlik</option>
              <option>Diğer</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="message">Mesajınız</label>
            <textarea id="message" name="message" rows="4" placeholder="Hayalinizdeki günü birkaç cümleyle anlatın..." />
          </div>
          <button type="submit" className="btn btn-gold contact__submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Gönderiliyor…' : status === 'sent' ? 'Teşekkürler! 🍀' : 'Teklif İste'}
          </button>
          <p className="contact__note">
            {status === 'sent'
              ? 'Talebiniz alındı; 24 saat içinde size dönüş yapacağız.'
              : status === 'error'
              ? 'Bir hata oluştu. Lütfen tekrar deneyin veya bizi arayın.'
              : 'Formu gönderdiğinizde talebiniz doğrudan ekibimize ulaşır.'}
          </p>
        </form>
      </div>
    </section>
  )
}

function PinIcon() { return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> }
function PhoneIcon() { return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg> }
function MailIcon() { return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg> }
function InstaIcon() { return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> }
