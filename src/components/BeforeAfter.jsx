import { useRef, useState } from 'react'

// Öncesi/sonrası karşılaştırma karosu — sürüklenen dikey ayraç.
// "Sonrası" tam görünür, "öncesi" ayraca kadar kırpılır.
export default function BeforeAfter({ beforeSrc, afterSrc, caption }) {
  const wrapRef = useRef(null)
  const dragging = useRef(false)
  const [pos, setPos] = useState(50)

  function moveTo(clientX) {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, next)))
  }

  function onPointerDown(e) {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }
  function onPointerMove(e) {
    if (!dragging.current) return
    moveTo(e.clientX)
  }
  function onPointerUp(e) {
    dragging.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }
  function onKeyDown(e) {
    const step = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - step))
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + step))
    else return
    e.preventDefault()
  }

  return (
    <figure
      className="k-ba"
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img className="k-ba__img" src={afterSrc} alt={caption ? `${caption} — sonrası` : 'Sonrası'} loading="lazy" />
      {/* Öncesi katmanı tam boyutta durur; sadece clip-path ile kırpılır — böylece
          ayraç kayarken fotoğraf ezilmez/kaymaz. */}
      <div className="k-ba__clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img className="k-ba__img" src={beforeSrc} alt={caption ? `${caption} — öncesi` : 'Öncesi'} loading="lazy" />
      </div>

      <span className="k-ba__tag k-ba__tag--before">Öncesi</span>
      <span className="k-ba__tag k-ba__tag--after">Sonrası</span>

      <div
        className="k-ba__handle"
        style={{ left: `${pos}%` }}
        role="slider"
        tabIndex={0}
        aria-label={caption ? `${caption} öncesi/sonrası karşılaştırma` : 'Öncesi/sonrası karşılaştırma'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
      >
        <span className="k-ba__grip" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M9.5 6 4 12l5.5 6V6zm5 0v12l5.5-6-5.5-6z" />
          </svg>
        </span>
      </div>

      {caption && <figcaption className="k-ba__caption">{caption}</figcaption>}
    </figure>
  )
}
