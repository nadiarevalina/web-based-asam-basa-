import { useState } from 'react'
import { PH_SCALE_ITEMS, CHEMICAL_SAMPLES } from '../data/chemistryData'

export function PhScaleSection() {
  const [selectedPh, setSelectedPh] = useState<number>(7)

  const currentItem = PH_SCALE_ITEMS.find((item) => item.ph === selectedPh) || PH_SCALE_ITEMS[7]

  // Filter lab samples matching the selected integer pH (tolerance ±0.6)
  const relatedLabSamples = CHEMICAL_SAMPLES.filter(
    (s) => Math.abs(s.approximatePh - selectedPh) <= 0.6
  )

  return (
    <section id="skala-section" className="content-section" aria-labelledby="skala-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Modul Inkuiri 3</span>
          <span className="section-topic-pill">Tahap 5: Spektrum Derajat Keasaman (pH 0 – 14)</span>
        </div>
        <h2 id="skala-heading" className="section-title">
          Visualisasi Interaktif Skala pH & Hubungan Eksperimen
        </h2>
        <p className="section-description">
          Hubungkan hasil pengamatan kualitatif indikator dari Laboratorium Virtual dengan spektrum kuantitatif pH logaritmik (<code>pH = -log[H⁺]</code>).
          Setiap pergeseran 1 satuan pH menunjukkan perubahan konsentrasi <code>H⁺</code> sebesar 10 kali lipat!
        </p>
      </div>

      {/* Main Interactive Bar */}
      <div className="ph-scale-interactive-card">
        {/* pH Bar with gradient and markers */}
        <div className="ph-spectrum-bar-wrap">
          <div className="ph-spectrum-bar" />
          <div className="ph-scale-chips">
            {PH_SCALE_ITEMS.map((item) => {
              const isSelected = item.ph === selectedPh
              return (
                <button
                  key={item.ph}
                  type="button"
                  className={`ph-chip-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    borderColor: isSelected ? item.colorHex : 'transparent',
                    backgroundColor: isSelected ? item.colorHex : undefined,
                  }}
                  onClick={() => setSelectedPh(item.ph)}
                  aria-label={`Pilih pH ${item.ph}`}
                >
                  <span className="ph-chip-num">{item.ph}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Range Slider for Mobile & Smooth drag */}
        <div className="ph-slider-container">
          <label htmlFor="ph-range-slider" className="sr-only">
            Pilih Nilai Skala pH (0 sampai 14)
          </label>
          <input
            id="ph-range-slider"
            type="range"
            min="0"
            max="14"
            step="1"
            value={selectedPh}
            onChange={(e) => setSelectedPh(parseInt(e.target.value, 10))}
            className="ph-slider-input"
            style={{
              accentColor: currentItem.colorHex,
            }}
          />
          <div className="ph-slider-labels">
            <span>0 (Asam Kuat Ekstrem)</span>
            <span>7 (Netral Sempurna)</span>
            <span>14 (Basa Kuat Ekstrem)</span>
          </div>
        </div>

        {/* Selected pH Detail Display */}
        <div className="ph-detail-spotlight">
          <div className="spotlight-left">
            <div
              className="ph-giant-badge"
              style={{ backgroundColor: currentItem.colorHex }}
            >
              <span className="giant-label">pH</span>
              <span className="giant-number">{currentItem.ph}</span>
            </div>
            <div className="spotlight-category-group">
              <span className="spotlight-category-name" style={{ color: currentItem.colorHex }}>
                {currentItem.category}
              </span>
              <p className="spotlight-example">
                Contoh Zat Khas: <strong>{currentItem.example}</strong>
              </p>
            </div>
          </div>

          <div className="spotlight-right">
            <div className="ion-conc-grid">
              <div className="ion-box h-ion">
                <span className="ion-title">Konsentrasi Ion Hidrogen [H⁺]:</span>
                <span className="ion-math font-mono">{currentItem.hConc}</span>
              </div>
              <div className="ion-box oh-ion">
                <span className="ion-title">Konsentrasi Ion Hidroksida [OH⁻]:</span>
                <span className="ion-math font-mono">{currentItem.ohConc}</span>
              </div>
            </div>

            <div className="spotlight-note-box">
              <span className="note-title">Karakteristik & Respon Kimiawi:</span>
              <p className="note-body">{currentItem.description}</p>
            </div>

            {/* Related Lab Samples indicator */}
            {relatedLabSamples.length > 0 && (
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sampel Lab Virtual Terkait: </span>
                <span style={{ color: '#2563eb' }}>
                  {relatedLabSamples.map((s) => `${s.name} (pH ~${s.approximatePh})`).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Link to Virtual Lab Samples on pH Scale */}
      <div className="lab-samples-mapping-card" style={{ marginTop: '24px', background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb', textTransform: 'uppercase' }}>Inkuiri Terhubung</span>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Hubungkan dengan Sampel Eksperimen Lab Virtual</h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
          Pilih salah satu sampel di bawah untuk memetakan posisinya pada skala pH dan meninjau hubungan antara konsentrasi <code>[H⁺]</code> dengan respon indikator:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CHEMICAL_SAMPLES.map((sample) => {
            const roundedPh = Math.round(sample.approximatePh)
            const isActive = roundedPh === selectedPh
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => setSelectedPh(roundedPh)}
                className={`filter-chip ${isActive ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {sample.name} (pH ≈ {sample.approximatePh.toFixed(1)})
              </button>
            )
          })}
        </div>
      </div>

      {/* Inquiry Guiding Question & Scientific Reasoning */}
      <div className="inquiry-scaffolding-box" style={{ marginTop: '24px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
            Pertanyaan Pemantik Inkuiri: Mengapa Skala pH Bersifat Logaritmik?
          </h4>
        </div>
        <p style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.6', marginBottom: '12px' }}>
          Mengapa pergeseran dari pH 4 (jus tomat) ke pH 2 (air lemon) berarti keasaman melonjak <strong>100 kali lipat</strong>, bukan hanya 2 kali lipat?
        </p>
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '14px 18px', border: '1px solid #dbeafe', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <strong>Penjelasan Ilmiah:</strong> Definisi matematis Sørensen adalah <code>pH = -log₁₀[H⁺]</code>, yang artinya konsentrasi ion hidronium adalah <code>[H⁺] = 10⁻ᵖᴴ</code>.
          <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
            <li>Pada pH 4: <code>[H⁺] = 10⁻⁴ M = 0.0001 M</code></li>
            <li>Pada pH 2: <code>[H⁺] = 10⁻² M = 0.01 M</code></li>
          </ul>
          Rasionya adalah <code>0.01 M / 0.0001 M = 100</code> kali lipat! Setiap penurunan 1 angka pH melipatgandakan keasaman 10 kali, sehingga larutan dengan pH 1 memiliki keasaman 1.000.000 kali lipat dibanding air netral pH 7.
        </div>
      </div>

      {/* Autoionization Law Card */}
      <div className="kw-insight-card" style={{ marginTop: '24px' }}>
        <div className="kw-header">
          <div className="kw-icon">💡</div>
          <div>
            <h3 className="kw-title">Prinsip Tetapan Kesetimbangan Air (Kw)</h3>
            <p className="kw-subtitle">
              Pada suhu standar kamar (25°C), molekul air murni mengalami autoionisasi membentuk kesetimbangan dinamis ion H⁺ dan OH⁻:
            </p>
          </div>
        </div>

        <div className="kw-math-row">
          <div className="math-badge">
            <code>H₂O(l) ⇌ H⁺(aq) + OH⁻(aq)</code>
          </div>
          <div className="math-badge">
            <code>Kw = [H⁺] × [OH⁻] = 1.0 × 10⁻¹⁴</code>
          </div>
          <div className="math-badge">
            <code>pH + pOH = 14</code>
          </div>
        </div>

        <div className="kw-rules-grid">
          <div className="kw-rule-item acid-rule">
            <strong>Larutan Asam:</strong> [H⁺] &gt; 10⁻⁷ M, sehingga <strong>pH &lt; 7</strong> (warna lakmus merah)
          </div>
          <div className="kw-rule-item neutral-rule">
            <strong>Larutan Netral:</strong> [H⁺] = [OH⁻] = 10⁻⁷ M, sehingga <strong>pH = 7</strong> (warna lakmus tidak berubah)
          </div>
          <div className="kw-rule-item base-rule">
            <strong>Larutan Basa:</strong> [H⁺] &lt; 10⁻⁷ M ([OH⁻] &gt; 10⁻⁷ M), sehingga <strong>pH &gt; 7</strong> (warna lakmus biru)
          </div>
        </div>
      </div>
    </section>
  )
}
