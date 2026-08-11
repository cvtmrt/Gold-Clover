import { useEffect, useRef } from 'react'
import BeforeAfter from './BeforeAfter.jsx'
import TileCaption from './TileCaption.jsx'

// Galeri fotoğrafının büyük görünümü. Öncesi/sonrası kayıtlarında karşılaştırma
// ayracı burada da çalışır, sadece daha geniş.
export default function Lightbox({ items, index, onClose, onNavigate }) {
  const kapatRef = useRef(null)
  const oncekiOdak = useRef(null)
  const karartidaBasildi = useRef(false)
  const item = items[index]

  useEffect(() => {
    oncekiOdak.current = document.activeElement
    kapatRef.current?.focus()

    // Arka plan kaymasın; kaydırma çubuğu kaybolunca sayfa zıplamasın.
    const { overflow, paddingRight } = document.body.style
    const bar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (bar > 0) document.body.style.paddingRight = `${bar}px`

    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onNavigate(-1)
      else if (e.key === 'ArrowRight') onNavigate(1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      oncekiOdak.current?.focus?.()
    }
  }, [onClose, onNavigate])

  if (!item) return null
  const donusum = item.kind === 'donusum' && item.hasAfter

  return (
    <div
      className="k-lb"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || 'Galeri fotoğrafı'}
      // Karartıya tıklayınca kapansın — ama yalnızca basma DA karartıda başladıysa.
      // Aksi halde: (a) karoya dokunup açtığımızda hemen ardından gelen click
      // olayı yeni açılan karartıya düşüp pencereyi anında kapatıyordu,
      // (b) ayracı sürükleyip parmağı dışarıda bırakınca pencere kapanıyordu.
      onPointerDown={(e) => { karartidaBasildi.current = e.target === e.currentTarget }}
      onClick={(e) => {
        if (e.target === e.currentTarget && karartidaBasildi.current) onClose()
        karartidaBasildi.current = false
      }}
    >
      <button ref={kapatRef} type="button" className="k-lb__close" onClick={onClose} aria-label="Kapat">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="k-lb__nav k-lb__nav--prev"
            aria-label="Önceki fotoğraf"
            onClick={(e) => { e.stopPropagation(); onNavigate(-1) }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="k-lb__nav k-lb__nav--next"
            aria-label="Sonraki fotoğraf"
            onClick={(e) => { e.stopPropagation(); onNavigate(1) }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Sahneye tıklamak kapatmasın — ayracı sürüklerken kazara kapanmamalı. */}
      <figure className="k-lb__stage" onClick={(e) => e.stopPropagation()}>
        {donusum ? (
          <BeforeAfter
            key={item.id}
            className="k-ba--lb"
            fitToImage
            beforeSrc={`/api/gallery/${item.id}/image`}
            afterSrc={`/api/gallery/${item.id}/image-after`}
          />
        ) : (
          <img className="k-lb__img" src={`/api/gallery/${item.id}/image`} alt={item.caption || 'Dilek Sanık'} />
        )}

        <div className="k-lb__bar">
          <TileCaption text={item.caption} as="figcaption" variant="full" />
          {items.length > 1 && (
            <span className="k-lb__count">{index + 1} / {items.length}</span>
          )}
        </div>
      </figure>
    </div>
  )
}
