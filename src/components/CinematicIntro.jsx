import { useEffect, useState } from 'react'

/**
 * Cinematic zoom intro — a full-screen event image that slowly pushes in,
 * the brand name draws in over it, then the whole plate zooms through the
 * viewer and dissolves to reveal the site.
 */
export default function CinematicIntro({ onDone }) {
  const [phase, setPhase] = useState('enter') // enter -> zoom -> gone

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.body.classList.add('intro-lock')

    if (reduce) {
      const t = setTimeout(finish, 400)
      return () => clearTimeout(t)
    }
    const t1 = setTimeout(() => setPhase('zoom'), 2600)
    const t2 = setTimeout(finish, 3900)
    return () => { clearTimeout(t1); clearTimeout(t2) }

    function finish() {
      setPhase('gone')
      document.body.classList.remove('intro-lock')
      onDone?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'gone') return null

  return (
    <div className={`intro intro--${phase}`} aria-hidden="true">
      <div className="intro__media" style={{ backgroundImage: 'url(/images/hero.webp)' }} />
      <div className="intro__veil" />
      <div className="intro__content">
        <span className="intro__eyebrow">Ankara &middot; Organizasyon</span>
        <h1 className="intro__title script">Gold Clover</h1>
        <span className="intro__line" />
        <span className="intro__tag">Hayalinizdeki an, kusursuz kurgulanır</span>
      </div>
      <button className="intro__skip" onClick={() => { setPhase('zoom'); setTimeout(() => { setPhase('gone'); document.body.classList.remove('intro-lock'); onDone?.() }, 700) }}>
        Geç
      </button>
    </div>
  )
}
