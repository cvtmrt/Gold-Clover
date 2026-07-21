import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Services from '../components/Services.jsx'
import Process from '../components/Process.jsx'
import Testimonial from '../components/Testimonial.jsx'
import Gallery from '../components/Gallery.jsx'
import Products from '../components/Products.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'
import useReveal from '../hooks/useReveal.js'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import '../styles/app.css'

export default function OrganizasyonPage() {
  useReveal(true)
  useDocumentMeta(
    'Gold Clover Organizasyon — Ankara Etkinlik & Organizasyon',
    "Söz, nişan, doğum günü, baby shower, balon konsepti ve özel kutlamalar. Ankara'da hayalinizdeki etkinliği kusursuz kurguluyoruz."
  )

  return (
    <div className="site site--in">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <Testimonial />
        <Gallery />
        <Products />
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
        <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
          <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.8L.5 31.5l7.9-2c2.3 1.2 4.9 1.9 7.6 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.2-4.6-.3-.5c-1.3-2.1-2-4.5-2-7C3 8.8 8.8 3 16 3s13 5.8 13 13-5.8 12.8-13 12.8zm7.2-9.8c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2s-1 1.3-1.2 1.5c-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5z"/>
        </svg>
      </a>
    </div>
  )
}
