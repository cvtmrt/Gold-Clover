import { useState } from 'react'
import CinematicIntro from './components/CinematicIntro.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Testimonial from './components/Testimonial.jsx'
import Gallery from './components/Gallery.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import useReveal from './hooks/useReveal.js'
import './styles/app.css'

export default function App() {
  const [ready, setReady] = useState(false)
  useReveal(ready)

  return (
    <>
      <CinematicIntro onDone={() => setReady(true)} />
      <div className={`site ${ready ? 'site--in' : ''}`}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Process />
          <Testimonial />
          <Gallery />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
