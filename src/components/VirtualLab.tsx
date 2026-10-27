import { useState } from 'react'
import { CHEMICAL_SAMPLES, INDICATORS } from '../data/chemistryData'
import type { ChemicalSample, Indicator, SimulationRecord } from '../types/chemistry'

let recordCounter = 0

function createSimulationRecord(
  sampleName: string,
  indicatorName: string,
  ph: number,
  colorName: string,
  colorHex: string,
  natureLabel: string
): SimulationRecord {
  recordCounter += 1
  return {
    id: `rec-${recordCounter}-${ph}`,
    sampleName,
    indicatorName,
    ph,
    colorName,
    colorHex,
    natureLabel,
    timestamp: 'Baru saja',
  }
}

export function VirtualLab() {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(CHEMICAL_SAMPLES[0].id)
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(INDICATORS[0].id)
  const [isTested, setIsTested] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [history, setHistory] = useState<SimulationRecord[]>([])
  const [activeFilterCategory, setActiveFilterCategory] = useState<'semua' | 'sehari-hari' | 'laboratorium'>('semua')

  const currentSample: ChemicalSample =
    CHEMICAL_SAMPLES.find((s) => s.id === selectedSampleId) || CHEMICAL_SAMPLES[0]
  const currentIndicator: Indicator =
    INDICATORS.find((i) => i.id === selectedIndicatorId) || INDICATORS[0]

  const colorResult = currentIndicator.getColorResult(currentSample.approximatePh)

  const filteredSamples = CHEMICAL_SAMPLES.filter((s) => {
    if (activeFilterCategory === 'semua') return true
    return s.category === activeFilterCategory
  })

  const getNatureLabel = (ph: number): string => {
    if (ph < 3.0) return 'Asam Kuat'
    if (ph < 7.0) return 'Asam Lemah'
    if (ph === 7.0) return 'Netral'
    if (ph <= 11.5) return 'Basa Lemah / Sedang'
    return 'Basa Kuat'
  }

  const handleTest = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      setIsTested(true)
    }, 700)
  }

  const handleReset = () => {
    setIsTested(false)
    setIsAnimating(false)
  }

  const handleSaveToJournal = () => {
    const newRecord = createSimulationRecord(
      currentSample.name,
      currentIndicator.name,
      currentSample.approximatePh,
      colorResult.colorName,
      colorResult.colorHex,
      getNatureLabel(currentSample.approximatePh)
    )
    setHistory([newRecord, ...history])
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  return (
    <section id="lab-section" className="content-section" aria-labelledby="lab-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Modul 2</span>
          <span className="section-topic-pill">Simulasi Inkuiri Laboratorium Virtual</span>
        </div>
        <h2 id="lab-heading" className="section-title">
          Laboratorium Pengujian Indikator Asam-Basa
        </h2>
        <p className="section-description">
          Lakukan eksplorasi inkuiri terbimbing secara mandiri! Pilih larutan sampel, teteskan atau celupkan
          indikator pilihanmu, amati transformasi warna, dan rumuskan kesimpulan sifat larutan.
        </p>
      </div>

      <div className="lab-workbench-grid">
        {/* Left Column: Sample & Indicator Selectors */}
        <div className="lab-controls-panel">
          {/* Step 1: Sample Selection */}
          <div className="control-group-card">
            <div className="control-card-header">
              <span className="step-badge">Langkah 1</span>
              <h3 className="control-title">Pilih Sampel Larutan</h3>
            </div>

            <div className="filter-chips-row">
              <button
                type="button"
                className={`filter-chip ${activeFilterCategory === 'semua' ? 'active' : ''}`}
                onClick={() => setActiveFilterCategory('semua')}
              >
                Semua ({CHEMICAL_SAMPLES.length})
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilterCategory === 'sehari-hari' ? 'active' : ''}`}
                onClick={() => setActiveFilterCategory('sehari-hari')}
              >
                Sehari-hari
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilterCategory === 'laboratorium' ? 'active' : ''}`}
                onClick={() => setActiveFilterCategory('laboratorium')}
              >
                Laboratorium
              </button>
            </div>

            <div className="sample-select-wrapper">
              <label htmlFor="sample-dropdown" className="control-label">
                Sampel yang sedang diuji:
              </label>
              <select
                id="sample-dropdown"
                className="lab-dropdown"
                value={selectedSampleId}
                onChange={(e) => {
                  setSelectedSampleId(e.target.value)
                  setIsTested(false)
                }}
              >
                {filteredSamples.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.name} ({sample.formula})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Sample Info */}
            <div className="sample-quick-info">
              <div className="sample-info-row">
                <span className="info-key">Rumus Kimia:</span>
                <span className="info-val font-mono">{currentSample.formula}</span>
              </div>
              <div className="sample-info-row">
                <span className="info-key">Deskripsi:</span>
                <span className="info-val">{currentSample.description}</span>
              </div>
            </div>
          </div>

          {/* Step 2: Indicator Selection */}
          <div className="control-group-card">
            <div className="control-card-header">
              <span className="step-badge">Langkah 2</span>
              <h3 className="control-title">Pilih Indikator Kimia</h3>
            </div>

            <div className="indicator-select-wrapper">
              <label htmlFor="indicator-dropdown" className="control-label">
                Indikator asam-basa:
              </label>
              <select
                id="indicator-dropdown"
                className="lab-dropdown"
                value={selectedIndicatorId}
                onChange={(e) => {
                  setSelectedIndicatorId(e.target.value)
                  setIsTested(false)
                }}
              >
                {INDICATORS.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name} [{ind.phRange}]
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Indicator Info */}
            <div className="indicator-quick-info">
              <div className="sample-info-row">
                <span className="info-key">Tipe Indikator:</span>
                <span className="info-badge-type">
                  {currentIndicator.type.toUpperCase()}
                </span>
              </div>
              <div className="sample-info-row">
                <span className="info-key">Trayek Efektif:</span>
                <span className="info-val font-mono">{currentIndicator.phRange}</span>
              </div>
              <p className="indicator-tips-note">{currentIndicator.tips}</p>
            </div>

            {/* Action Buttons */}
            <div className="lab-action-buttons">
              <button
                type="button"
                className="btn btn-primary btn-lab-test"
                onClick={handleTest}
                disabled={isAnimating}
                id="btn-run-simulation"
              >
                {isAnimating ? (
                  <>
                    <span className="spinner-dots" />
                    <span>Sedang Menguji...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="btn-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2v8" />
                      <path d="m4.93 10.93 1.41 1.41" />
                      <path d="M2 18h2" />
                      <path d="M20 18h2" />
                      <path d="m19.07 10.93-1.41 1.41" />
                      <path d="M22 22H2" />
                      <path d="m8 22 4-10 4 10" />
                    </svg>
                    <span>
                      {currentIndicator.type === 'kertas'
                        ? 'Celupkan Kertas Uji'
                        : 'Teteskan Indikator'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-lab-reset"
                onClick={handleReset}
                id="btn-reset-simulation"
              >
                Bilas Tabung (Reset)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Workbench & Observation Result */}
        <div className="lab-display-panel">
          {/* Workbench Graphic */}
          <div className="bench-stage-card">
            <div className="stage-header">
              <span className="stage-tag">Tabung Reaksi Pengujian Virtual</span>
              <span className="stage-status-indicator">
                {isTested ? '✓ Pengujian Selesai' : 'Siap Diuji'}
              </span>
            </div>

            <div className="tube-workbench-view">
              {/* Dropper Pipette / Paper Tool Animation */}
              <div
                className={`dropper-tool ${
                  isAnimating ? 'dropper-animating' : ''
                } ${currentIndicator.type === 'kertas' ? 'tool-paper' : 'tool-pipette'}`}
              >
                {currentIndicator.type === 'kertas' ? (
                  <div
                    className="test-paper-strip"
                    style={{
                      backgroundColor:
                        isTested && colorResult.paperColorHex
                          ? colorResult.paperColorHex
                          : selectedIndicatorId === 'lakmus-biru'
                          ? '#2563eb'
                          : '#ef4444',
                    }}
                  >
                    <span className="paper-label">
                      {selectedIndicatorId === 'lakmus-biru' ? 'Lakmus Biru' : 'Lakmus Merah'}
                    </span>
                  </div>
                ) : (
                  <div className="dropper-graphic">
                    <div className="pipette-bulb" />
                    <div className="pipette-stem" />
                    {isAnimating && <div className="liquid-drop-fall" />}
                  </div>
                )}
              </div>

              {/* Glass Test Tube */}
              <div className="test-tube-wrapper">
                <svg
                  className="test-tube-svg"
                  viewBox="0 0 100 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="tube-clip">
                      <path d="M22 25 L22 195 Q22 225 50 225 Q78 225 78 195 L78 25 Z" />
                    </clipPath>
                    <linearGradient id="tubeFluid" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={
                          isTested
                            ? colorResult.colorHex
                            : currentSample.initialColor
                        }
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          isTested
                            ? colorResult.colorHex
                            : currentSample.initialColor
                        }
                        stopOpacity="0.95"
                      />
                    </linearGradient>
                  </defs>

                  {/* Inside fluid */}
                  <g clipPath="url(#tube-clip)">
                    <rect
                      x="20"
                      y="110"
                      width="60"
                      height="120"
                      fill="url(#tubeFluid)"
                      className="test-tube-liquid"
                    />
                    {/* Liquid meniscus */}
                    <ellipse
                      cx="50"
                      cy="110"
                      rx="28"
                      ry="6"
                      fill={isTested ? colorResult.colorHex : currentSample.initialColor}
                      opacity="0.85"
                    />
                    {/* Measurement marks */}
                    <line x1="30" y1="130" x2="40" y2="130" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="28" y1="150" x2="42" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="30" y1="170" x2="40" y2="170" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="28" y1="190" x2="42" y2="190" stroke="#94a3b8" strokeWidth="1.5" />
                  </g>

                  {/* Glass tube walls */}
                  <path
                    d="M22 20 L22 195 Q22 225 50 225 Q78 225 78 195 L78 20"
                    stroke="#cbd5e1"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* Tube lip */}
                  <ellipse cx="50" cy="20" rx="30" ry="7" stroke="#cbd5e1" strokeWidth="4" />
                  {/* Reflection */}
                  <path
                    d="M30 190 L30 50"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
              </div>

              {/* Rack Stand Base */}
              <div className="tube-rack-base" />
            </div>

            <div className="stage-footer-caption">
              <span className="caption-sample-badge">
                Sampel: <strong>{currentSample.name}</strong>
              </span>
              <span className="caption-ind-badge">
                Indikator: <strong>{currentIndicator.name}</strong>
              </span>
            </div>
          </div>

          {/* Observation Result Card */}
          {isTested ? (
            <div className="observation-result-card animate-fade-in" id="observation-result">
              <div className="obs-card-header">
                <div className="obs-badge-group">
                  <span className="obs-status-pill">Hasil Analisis Pengamatan</span>
                  <span
                    className={`obs-nature-pill nature-${currentSample.nature}`}
                  >
                    {getNatureLabel(currentSample.approximatePh)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-save-journal"
                  onClick={handleSaveToJournal}
                  title="Simpan hasil uji ke jurnal catatan belajar"
                >
                  <svg
                    className="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>Simpan ke Jurnal</span>
                </button>
              </div>

              <div className="obs-result-grid">
                <div className="obs-item">
                  <span className="obs-label">Warna Pengamatan:</span>
                  <div className="obs-color-preview-row">
                    <span
                      className="color-swatch-box"
                      style={{ backgroundColor: colorResult.colorHex }}
                    />
                    <strong className="obs-value color-name">
                      {colorResult.colorName}
                    </strong>
                  </div>
                </div>

                <div className="obs-item">
                  <span className="obs-label">Estimasi Derajat Keasaman:</span>
                  <strong className="obs-value font-mono">
                    pH ≈ {currentSample.approximatePh.toFixed(1)}
                  </strong>
                </div>

                <div className="obs-item">
                  <span className="obs-label">Trayek Indikator:</span>
                  <span className="obs-value font-mono">{currentIndicator.phRange}</span>
                </div>

                <div className="obs-item">
                  <span className="obs-label">Spesi Ionik Utama:</span>
                  <span className="obs-value font-mono">{currentSample.ionPresent}</span>
                </div>
              </div>

              <div className="obs-explanation-box">
                <h4 className="explanation-title">Penjelasan Konsep Kimia:</h4>
                <p className="explanation-text">{colorResult.behaviorNote}</p>
              </div>
            </div>
          ) : (
            <div className="lab-prompt-box">
              <svg
                className="prompt-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <div className="prompt-text">
                <strong>Petunjuk Praktikum Inkuiri:</strong>
                <p>
                  Pilih larutan sampel dan indikator pada panel kiri, lalu klik tombol{' '}
                  <em>
                    "{currentIndicator.type === 'kertas'
                      ? 'Celupkan Kertas Uji'
                      : 'Teteskan Indikator'}"
                  </em>{' '}
                  untuk melihat perubahan warna dan analisis kimianya.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Observation Journal Table */}
      {history.length > 0 && (
        <div className="lab-journal-section">
          <div className="journal-header">
            <div>
              <h3 className="journal-title">Buku Jurnal Pengamatan Laboratorium</h3>
              <p className="journal-subtitle">
                Catatan riwayat hasil pengujian inkuiri yang telah kamu lakukan pada sesi ini.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-clear-history"
              onClick={handleClearHistory}
            >
              Hapus Semua Riwayat ({history.length})
            </button>
          </div>

          <div className="table-responsive">
            <table className="chem-table journal-table">
              <thead>
                <tr>
                  <th scope="col">Waktu</th>
                  <th scope="col">Sampel Larutan</th>
                  <th scope="col">Indikator</th>
                  <th scope="col">Warna Akhir</th>
                  <th scope="col">Estimasi pH</th>
                  <th scope="col">Kesimpulan Sifat</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td className="font-mono text-muted">{record.timestamp}</td>
                    <td><strong>{record.sampleName}</strong></td>
                    <td>{record.indicatorName}</td>
                    <td>
                      <div className="table-color-swatch-row">
                        <span
                          className="table-color-dot"
                          style={{ backgroundColor: record.colorHex }}
                        />
                        <span>{record.colorName}</span>
                      </div>
                    </td>
                    <td className="font-mono">{record.ph.toFixed(1)}</td>
                    <td>
                      <span className="badge-nature-small">
                        {record.natureLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
