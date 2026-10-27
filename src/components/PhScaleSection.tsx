import { useState } from 'react'
import { PH_SCALE_ITEMS } from '../data/chemistryData'

export function PhScaleSection() {
  const [selectedPh, setSelectedPh] = useState<number>(7)

  const currentItem = PH_SCALE_ITEMS.find((item) => item.ph === selectedPh) || PH_SCALE_ITEMS[7]

  return (
    <section id="skala-section" className="content-section" aria-labelledby="skala-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Skala Visual</span>
          <span className="section-topic-pill">Spektrum Derajat Keasaman (pH 0 – 14)</span>
        </div>
        <h2 id="skala-heading" className="section-title">
          Visualisasi Interaktif Skala pH
        </h2>
        <p className="section-description">
          Skala pH merupakan skala logaritmik negatif konsentrasi ion hidrogen (<code>pH = -log[H⁺]</code>).
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
            <span>0 (Asam Kuat)</span>
            <span>7 (Netral)</span>
            <span>14 (Basa Kuat)</span>
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
                Contoh Zat: <strong>{currentItem.example}</strong>
              </p>
            </div>
          </div>

          <div className="spotlight-right">
            <div className="ion-conc-grid">
              <div className="ion-box h-ion">
                <span className="ion-title">Konsentrasi Ion Hidronium [H⁺]:</span>
                <span className="ion-math font-mono">{currentItem.hConc}</span>
              </div>
              <div className="ion-box oh-ion">
                <span className="ion-title">Konsentrasi Ion Hidroksida [OH⁻]:</span>
                <span className="ion-math font-mono">{currentItem.ohConc}</span>
              </div>
            </div>

            <div className="spotlight-note-box">
              <span className="note-title">Karakteristik Kimia:</span>
              <p className="note-body">{currentItem.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Autoionization Law Card */}
      <div className="kw-insight-card">
        <div className="kw-header">
          <div className="kw-icon">💡</div>
          <div>
            <h3 className="kw-title">Prinsip Tetapan Kesetimbangan Air (Kw)</h3>
            <p className="kw-subtitle">
              Pada suhu standar kamar (25°C), molekul air murni mengalami autoionisasi membentuk ion H⁺ dan OH⁻:
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
            <strong>Larutan Asam:</strong> [H⁺] &gt; 10⁻⁷ M, sehingga <strong>pH &lt; 7</strong>
          </div>
          <div className="kw-rule-item neutral-rule">
            <strong>Larutan Netral:</strong> [H⁺] = [OH⁻] = 10⁻⁷ M, sehingga <strong>pH = 7</strong>
          </div>
          <div className="kw-rule-item base-rule">
            <strong>Larutan Basa:</strong> [H⁺] &lt; 10⁻⁷ M ([OH⁻] &gt; 10⁻⁷ M), sehingga <strong>pH &gt; 7</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
