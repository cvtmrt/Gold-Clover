const STEPS = [
  { n: '01', t: 'Tanışma & Konsept', d: 'Hayalinizi, bütçenizi ve beklentilerinizi dinleriz; size özel bir konsept ve moodboard hazırlarız.' },
  { n: '02', t: 'Planlama & Tasarım', d: 'Mekan, tema, çiçek, ışık ve akış — her detayı görselleştirir, onayınıza sunarız.' },
  { n: '03', t: 'Koordinasyon', d: 'Tüm tedarikçileri biz yönetiriz. Siz yalnızca heyecanlanmaya odaklanırsınız.' },
  { n: '04', t: 'Etkinlik Günü', d: 'Sahadaki ekibimizle her şeyi dakikası dakikasına yönetir, kusursuz bir gün yaşatırız.' },
]

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Nasıl Çalışırız</span>
          <h2>Fikirden kutlamaya dört adım</h2>
          <span className="divider" />
        </div>

        <div className="process__grid">
          {STEPS.map((s) => (
            <div className="step reveal" key={s.n}>
              <span className="step__num script">{s.n}</span>
              <h3 className="display">{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
