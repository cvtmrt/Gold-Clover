export default function Testimonial() {
  return (
    <section className="quote">
      <div className="quote__bg" style={{ backgroundImage: 'url(/images/gallery-aisle.webp)' }} />
      <div className="quote__veil" />
      <div className="quote__inner container reveal">
        <svg className="quote__mark" viewBox="0 0 24 24" width="46" height="46" fill="currentColor"><path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2H4v2h1a4 4 0 0 0 4-4V7zm11 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V7z"/></svg>
        <p className="quote__text display">
          Hayalimizdeki düğünü kelimenin tam anlamıyla gerçeğe dönüştürdüler.
          Her detay, davetlilerimizin yıllarca konuşacağı bir zarafetteydi.
        </p>
        <div className="quote__by">
          <span className="quote__name">Elif &amp; Kaan</span>
          <span className="quote__role">Düğün · Ankara</span>
        </div>
      </div>
    </section>
  )
}
