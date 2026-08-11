import { useRef, useState } from 'react'
import TileCaption from './TileCaption.jsx'

// Öncesi/sonrası karşılaştırma karosu — sürüklenen dikey ayraç.
// "Sonrası" tam görünür, "öncesi" ayraca kadar kırpılır.
//
// onExpand verilirse karo hem sürüklenebilir hem tıklanabilir olur: parmak/fare
// kayarsa ayraç hareket eder, yerinde kısa bir dokunuşsa büyük görünüm açılır.
// (Ayrı bir düğme koymak yerine böyle çözüldü; kimse köşedeki düğmeyi bulmuyordu.)
// Süre şartı yok bilerek: yavaş/uzun bir dokunuş da tıklama sayılmalı.
// Ayrım tek ölçüye dayanıyor — parmak/fare kaydı mı kaymadı mı.
const TIKLAMA_TOLERANSI = 6 // px

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  caption,
  className = '',
  onExpand,
  fitToImage = false, // büyük görünümde fotoğrafın kendi oranını kullan
}) {
  const wrapRef = useRef(null)
  const bastigiYer = useRef(null)
  const surukledi = useRef(false)
  const [pos, setPos] = useState(50)
  const [oran, setOran] = useState(null)

  function moveTo(clientX) {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }

  function onPointerDown(e) {
    bastigiYer.current = { x: e.clientX, y: e.clientY }
    surukledi.current = false
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    const bas = bastigiYer.current
    if (!bas) return
    if (!surukledi.current) {
      const uzaklik = Math.hypot(e.clientX - bas.x, e.clientY - bas.y)
      if (uzaklik < TIKLAMA_TOLERANSI) return // henüz tıklama mı sürükleme mi belli değil
      surukledi.current = true
    }
    moveTo(e.clientX)
  }

  function onPointerUp(e) {
    const bas = bastigiYer.current
    bastigiYer.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    if (!bas) return

    const kaymadi = Math.hypot(e.clientX - bas.x, e.clientY - bas.y) < TIKLAMA_TOLERANSI

    if (kaymadi && onExpand) onExpand()
    else if (kaymadi) moveTo(e.clientX) // büyütme yoksa (büyük görünüm) ayracı oraya taşı
    surukledi.current = false
  }

  function onKeyDown(e) {
    const step = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - step))
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + step))
    else return
    e.preventDefault()
    e.stopPropagation() // büyük görünümdeki fotoğraf geçişini tetiklemesin
  }

  return (
    <figure
      className={`k-ba ${className}`.trim()}
      ref={wrapRef}
      style={fitToImage && oran ? { aspectRatio: oran } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        className="k-ba__img"
        src={afterSrc}
        alt={caption ? `${caption} — sonrası` : 'Sonrası'}
        loading="lazy"
        onLoad={(e) => {
          if (fitToImage) setOran(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)
        }}
      />
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

      {/* Tıklanabilirlik ipucu — tıklamayı karonun kendisi yakalıyor. */}
      {onExpand && (
        <span className="k-ba__zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}

      <TileCaption text={caption} />
    </figure>
  )
}
