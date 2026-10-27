import { useState, useId } from 'react'

type SolutionCategory = 'asam_kuat' | 'basa_kuat'

interface CompoundOption {
  formula: string
  name: string
  ionName: string
}

const STRONG_ACIDS: CompoundOption[] = [
  { formula: 'HCl', name: 'Asam Klorida', ionName: 'H⁺ dan Cl⁻' },
  { formula: 'HNO₃', name: 'Asam Nitrat', ionName: 'H⁺ dan NO₃⁻' },
  { formula: 'HBr', name: 'Asam Bromida', ionName: 'H⁺ dan Br⁻' },
  { formula: 'HClO₄', name: 'Asam Perklorat', ionName: 'H⁺ dan ClO₄⁻' },
]

const STRONG_BASES: CompoundOption[] = [
  { formula: 'NaOH', name: 'Natrium Hidroksida', ionName: 'Na⁺ dan OH⁻' },
  { formula: 'KOH', name: 'Kalium Hidroksida', ionName: 'K⁺ dan OH⁻' },
  { formula: 'LiOH', name: 'Litium Hidroksida', ionName: 'Li⁺ dan OH⁻' },
]

const PRESET_MOLARITIES = [0.1, 0.05, 0.02, 0.01, 0.005, 0.001]

export function PhCalculator() {
  const [solType, setSolType] = useState<SolutionCategory>('asam_kuat')
  const [compound, setCompound] = useState<string>(STRONG_ACIDS[0].formula)
  const [molarityInput, setMolarityInput] = useState<string>('0.01')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const compoundSelectId = useId()
  const molarityInputId = useId()

  const currentCompoundList = solType === 'asam_kuat' ? STRONG_ACIDS : STRONG_BASES
  const selectedCompound =
    currentCompoundList.find((c) => c.formula === compound) || currentCompoundList[0]

  const handleCategoryChange = (type: SolutionCategory) => {
    setSolType(type)
    setCompound(type === 'asam_kuat' ? STRONG_ACIDS[0].formula : STRONG_BASES[0].formula)
    setErrorMessage(null)
  }

  // Calculate results
  const M = parseFloat(molarityInput)
  const isValid = !isNaN(M) && M > 0 && M <= 1.0

  let ph = 7.0
  let pOh = 7.0
  let ionConcStr = ''
  let scientificStr = ''

  if (isValid) {
    if (solType === 'asam_kuat') {
      const hConc = M // a = 1
      ph = -Math.log10(hConc)
      pOh = 14 - ph
      ionConcStr = `${hConc} M`
      scientificStr = hConc.toExponential(2)
    } else {
      const ohConc = M // b = 1
      pOh = -Math.log10(ohConc)
      ph = 14 - pOh
      ionConcStr = `${ohConc} M`
      scientificStr = ohConc.toExponential(2)
    }
  }

  const handleMolarityChange = (val: string) => {
    setMolarityInput(val)
    const num = parseFloat(val)
    if (isNaN(num) || num <= 0) {
      setErrorMessage('Konsentrasi harus berupa bilangan positif lebih besar dari 0.')
    } else if (num > 1.0) {
      setErrorMessage('Model kalkulator ini dibatasi untuk konsentrasi maksimum 1.0 M.')
    } else {
      setErrorMessage(null)
    }
  }

  // Calculate gauge marker percentage (0 to 14 mapped to 0% to 100%)
  const gaugePercent = Math.max(0, Math.min(100, (ph / 14) * 100))

  return (
    <section id="kalkulator-section" className="content-section" aria-labelledby="calc-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Modul 3</span>
          <span className="section-topic-pill">Perhitungan Kuantitatif Asam & Basa</span>
        </div>
        <h2 id="calc-heading" className="section-title">
          Kalkulator pH Larutan Kuat Monovalen
        </h2>
        <p className="section-description">
          Hitung nilai pH dan pOH secara matematis dengan langkah penyelesaian lengkap.
          Dibatasi pada model asam kuat monoprotik (valensi <em>a = 1</em>) dan basa kuat monovalen (valensi <em>b = 1</em>)
          yang terionisasi sempurna pada suhu 25°C.
        </p>
      </div>

      <div className="calculator-layout-grid">
        {/* Left: Interactive Input Panel */}
        <div className="calc-form-card">
          <div className="calc-card-header">
            <span className="step-badge">Konfigurasi</span>
            <h3 className="control-title">Parameter Larutan</h3>
          </div>

          {/* Solution Type Toggle */}
          <div className="calc-type-switcher" role="radiogroup" aria-label="Jenis Larutan">
            <button
              type="button"
              role="radio"
              aria-checked={solType === 'asam_kuat'}
              className={`calc-type-btn acid-type ${solType === 'asam_kuat' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('asam_kuat')}
            >
              <span className="type-icon">🔴</span>
              <span className="type-title">Asam Kuat Monoprotik</span>
              <span className="type-sub font-mono">valensi a = 1</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={solType === 'basa_kuat'}
              className={`calc-type-btn base-type ${solType === 'basa_kuat' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('basa_kuat')}
            >
              <span className="type-icon">🔵</span>
              <span className="type-title">Basa Kuat Monovalen</span>
              <span className="type-sub font-mono">valensi b = 1</span>
            </button>
          </div>

          {/* Compound Selection */}
          <div className="calc-input-group">
            <label htmlFor={compoundSelectId} className="calc-label">
              Pilih Senyawa Kimia:
            </label>
            <select
              id={compoundSelectId}
              className="lab-dropdown"
              value={compound}
              onChange={(e) => setCompound(e.target.value)}
            >
              {currentCompoundList.map((item) => (
                <option key={item.formula} value={item.formula}>
                  {item.formula} — {item.name}
                </option>
              ))}
            </select>
            <span className="calc-helper-note">
              Terdisosiasi menghasilkan ion: <code>{selectedCompound.ionName}</code>
            </span>
          </div>

          {/* Molarity Input */}
          <div className="calc-input-group">
            <label htmlFor={molarityInputId} className="calc-label">
              Konsentrasi Molaritas (M):
            </label>
            <div className="input-with-unit">
              <input
                id={molarityInputId}
                type="number"
                step="0.001"
                min="0.0001"
                max="1.0"
                value={molarityInput}
                onChange={(e) => handleMolarityChange(e.target.value)}
                className={`calc-num-input font-mono ${errorMessage ? 'has-error' : ''}`}
                placeholder="0.01"
              />
              <span className="unit-badge">M (mol/L)</span>
            </div>
            {errorMessage && <p className="calc-error-msg">{errorMessage}</p>}
          </div>

          {/* Preset Buttons */}
          <div className="preset-molarity-row">
            <span className="preset-label">Pilihan Konsentrasi Cepat:</span>
            <div className="preset-chips">
              {PRESET_MOLARITIES.map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`preset-chip ${parseFloat(molarityInput) === val ? 'active' : ''}`}
                  onClick={() => handleMolarityChange(val.toString())}
                >
                  {val} M
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Calculation & Gauge */}
        <div className="calc-results-card">
          <div className="calc-card-header">
            <span className="step-badge">Hasil & Analisis</span>
            <h3 className="control-title">Langkah Perhitungan Ilmiah</h3>
          </div>

          {isValid ? (
            <>
              {/* Highlight Result Board */}
              <div
                className={`result-scoreboard ${
                  solType === 'asam_kuat' ? 'board-acid' : 'board-base'
                }`}
              >
                <div className="scoreboard-main">
                  <span className="result-caption">Derajat Keasaman:</span>
                  <div className="result-ph-huge font-mono">
                    pH = {ph.toFixed(2)}
                  </div>
                  {solType === 'basa_kuat' && (
                    <div className="result-poh-sub font-mono">
                      (pOH = {pOh.toFixed(2)})
                    </div>
                  )}
                </div>

                <div className="scoreboard-badge">
                  <span className="status-label">Kategori Sifat:</span>
                  <strong className="status-val">
                    {ph < 3 ? 'Asam Kuat Ekstrem' : ph < 7 ? 'Asam' : ph > 11 ? 'Basa Kuat Ekstrem' : 'Basa'}
                  </strong>
                </div>
              </div>

              {/* Dynamic Visual Scale Pointer */}
              <div className="calc-gauge-wrap">
                <div className="gauge-track">
                  <div
                    className="gauge-pointer"
                    style={{ left: `${gaugePercent}%` }}
                    title={`Posisi pH: ${ph.toFixed(2)}`}
                  >
                    <span className="pointer-arrow" />
                    <span className="pointer-text font-mono">{ph.toFixed(1)}</span>
                  </div>
                </div>
                <div className="gauge-axis">
                  <span>0 (Asam)</span>
                  <span>7 (Netral)</span>
                  <span>14 (Basa)</span>
                </div>
              </div>

              {/* Step-by-step breakdown */}
              <div className="steps-flow-container">
                <h4 className="steps-heading">Tahapan Perhitungan Matematis:</h4>

                {solType === 'asam_kuat' ? (
                  <ol className="steps-list">
                    <li className="step-flow-item">
                      <div className="step-flow-header">
                        <span className="step-flow-num">1</span>
                        <strong>Tuliskan Persamaan Ionisasi:</strong>
                      </div>
                      <div className="step-math-box font-mono">
                        {selectedCompound.formula}(aq) → H⁺(aq) + A⁻(aq)
                      </div>
                      <p className="step-flow-desc">
                        Karena {selectedCompound.name} merupakan asam kuat monoprotik (terionisasi sempurna, α = 1), maka valensi asam (<em>a</em>) = 1.
                      </p>
                    </li>

                    <li className="step-flow-item">
                      <div className="step-flow-header">
                        <span className="step-flow-num">2</span>
                        <strong>Hitung Konsentrasi Ion Hidrogen [H⁺]:</strong>
                      </div>
                      <div className="step-math-box font-mono">
                        [H⁺] = M × a = {M} M × 1 = {ionConcStr} = {scientificStr} M
                      </div>
                    </li>

                    <li className="step-flow-item">
                      <div className="step-flow-header">
                        <span className="step-flow-num">3</span>
                        <strong>Hitung Nilai pH dengan Logaritma Negatif:</strong>
                      </div>
                      <div className="step-math-box font-mono">
                        pH = -log[H⁺] = -log({scientificStr}) = {ph.toFixed(2)}
                      </div>
                    </li>
                  </ol>
                ) : (
                  <ol className="steps-list">
                    <li className="step-flow-item">
                      <div className="step-flow-header">
                        <span className="step-flow-num">1</span>
                        <strong>Tuliskan Persamaan Ionisasi:</strong>
                      </div>
                      <div className="step-math-box font-mono">
                        {selectedCompound.formula}(aq) → B⁺(aq) + OH⁻(aq)
                      </div>
                      <p className="step-flow-desc">
                        {selectedCompound.name} menghasilkan satu ion OH⁻ per satuan rumus (valensi basa <em>b</em> = 1) dan terdisosiasi sempurna (α = 1).
                      </p>
                    </li>

                    <li className="step-flow-item">
                      <div className="step-flow-header">
                        <span className="step-flow-num">2</span>
                        <strong>Hitung Konsentrasi Ion Hidroksida [OH⁻]:</strong>
                      </div>
                      <div className="step-math-box font-mono">
                        [OH⁻] = M × b = {M} M × 1 = {ionConcStr} = {scientificStr} M
                      </div>
                    </li>

                    <li className="step-flow-item">
                      <div className="step-flow-header">
                        <span className="step-flow-num">3</span>
                        <strong>Hitung Nilai pOH:</strong>
                      </div>
                      <div className="step-math-box font-mono">
                        pOH = -log[OH⁻] = -log({scientificStr}) = {pOh.toFixed(2)}
                      </div>
                    </li>

                    <li className="step-flow-item">
                      <div className="step-flow-header">
                        <span className="step-flow-num">4</span>
                        <strong>Konversikan ke Nilai pH (Suhu 25°C):</strong>
                      </div>
                      <div className="step-math-box font-mono">
                        pH = 14 - pOH = 14 - {pOh.toFixed(2)} = {ph.toFixed(2)}
                      </div>
                    </li>
                  </ol>
                )}
              </div>
            </>
          ) : (
            <div className="calc-invalid-box">
              <p>Masukkan konsentrasi yang valid untuk melihat tahapan perhitungan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Model Assumptions and Scientific Limitations Banner */}
      <div className="model-limitations-card">
        <div className="limitations-header">
          <svg
            className="limitation-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h4 className="limitations-title">Batasan &amp; Asumsi Ilmiah Model Kalkulator:</h4>
        </div>
        <ul className="limitations-list">
          <li>
            <strong>Batasan Valensi:</strong> Model ini hanya berlaku untuk asam kuat monoprotik (menghasilkan 1 ion H⁺) dan basa kuat monovalen (menghasilkan 1 ion OH⁻). Tidak dapat digunakan untuk asam poliprotik seperti H₂SO₄ atau basa divalen seperti Ba(OH)₂ tanpa penyesuaian valensi.
          </li>
          <li>
            <strong>Ionisasi Sempurna:</strong> Mengasumsikan derajat ionisasi α = 1 (100%), sehingga rumus ini tidak berlaku untuk asam lemah (seperti CH₃COOH) atau basa lemah (seperti NH₃) yang membutuhkan konstanta kesetimbangan Ka atau Kb.
          </li>
          <li>
            <strong>Kondisi Suhu Kamar (25°C):</strong> Menggunakan nilai tetapan autoionisasi air Kw = 1.0 × 10⁻¹⁴ (sehingga pH + pOH = 14).
          </li>
          <li>
            <strong>Autoionisasi Pelarut Diabaikan:</strong> Kontribusi ion H⁺ atau OH⁻ dari autoionisasi air murni diabaikan karena konsentrasi asam/basa yang dimasukkan jauh lebih tinggi dari 10⁻⁷ M.
          </li>
        </ul>
      </div>
    </section>
  )
}
