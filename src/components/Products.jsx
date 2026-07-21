import { useEffect, useState } from 'react'

export default function Products() {
  const [items, setItems] = useState([])
  const [state, setState] = useState('loading') // loading | ready | error

  useEffect(() => {
    let alive = true
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return
        setItems(Array.isArray(data.items) ? data.items : [])
        setState('ready')
      })
      .catch(() => alive && setState('error'))
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="products" id="urunler">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow reveal">Ürünler</span>
          <h2 className="reveal">Konsept &amp; <span className="text-gold">Hediyelik</span></h2>
          <span className="divider reveal" />
          <p className="reveal">
            Balon konseptleri, butik çiçek aranjmanları ve özel hediyelikler — her detay
            organizasyonunuzu tamamlamak için özenle hazırlanır.
          </p>
        </div>

        {state === 'ready' && items.length > 0 && (
          <div className="products__grid">
            {items.map((p) => (
              <article className="product" key={p.id}>
                <div className="product__media">
                  {p.hasImage ? (
                    <img src={`/api/products/${p.id}/image`} alt={p.name} loading="lazy" />
                  ) : (
                    <div className="product__ph"><span className="script">Gold Clover</span></div>
                  )}
                  {p.category && <span className="product__cat">{p.category}</span>}
                </div>
                <div className="product__body">
                  <h3>{p.name}</h3>
                  {p.description && <p>{p.description}</p>}
                  {p.price && <span className="product__price">{p.price}</span>}
                </div>
              </article>
            ))}
          </div>
        )}

        {state === 'loading' && (
          <p className="products__empty">Ürünler yükleniyor…</p>
        )}
        {state === 'ready' && items.length === 0 && (
          <p className="products__empty">Ürünler çok yakında burada. 🍀</p>
        )}
        {state === 'error' && (
          <p className="products__empty">Ürünler şu an yüklenemedi.</p>
        )}
      </div>
    </section>
  )
}
