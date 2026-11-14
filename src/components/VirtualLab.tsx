import { useState } from 'react'
import { CHEMICAL_SAMPLES, INDICATORS } from '../data/chemistryData'
import type { ChemicalSample, Indicator, SimulationRecord, SampleNature } from '../types/chemistry'
import { addLabExperimentRecord } from '../services/authStorage'

let recordCounter = 0

const NATURE_LABELS: Record<SampleNature, string> = {
  asam_kuat: 'Asam Kuat',
  asam_lemah: 'Asam Lemah',
  netral: 'Netral',
  basa_lemah: 'Basa Lemah / Sedang',
  basa_kuat: 'Basa Kuat',
}

function createSimulationRecord(
  sampleName: string,
  indicatorName: string,
  ph: number,
  colorName: string,
  colorHex: string,
  natureLabel: string,
  hypothesisNature?: string,
  isHypothesisCorrect?: boolean,
  studentConclusion?: string
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
    hypothesisNature,
    isHypothesisCorrect,
    studentConclusion,
  }
}

export function VirtualLab() {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(CHEMICAL_SAMPLES[0].id)
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(INDICATORS[0].id)
  const [isTested, setIsTested] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [history, setHistory] = useState<SimulationRecord[]>([])
  const [activeFilterCategory, setActiveFilterCategory] = useState<'semua' | 'sehari-hari' | 'laboratorium'>('semua')
  
  // Guided Inquiry States (Tahap 3, 5, 6)
  const [hypothesisNature, setHypothesisNature] = useState<SampleNature | null>(null)
  const [isHypothesisLocked, setIsHypothesisLocked] = useState<boolean>(false)
  const [studentConclusion, setStudentConclusion] = useState<string>('')
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null)

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

  const handleSampleChange = (sampleId: string) => {
    setSelectedSampleId(sampleId)
    setIsTested(false)
    setHypothesisNature(null)
    setIsHypothesisLocked(false)
    setStudentConclusion('')
    setSavedSuccessMessage(null)
  }

  const handleIndicatorChange = (indicatorId: string) => {
    setSelectedIndicatorId(indicatorId)
    setIsTested(false)
    setSavedSuccessMessage(null)
  }

  const handleTest = () => {
    setIsAnimating(true)
    setSavedSuccessMessage(null)
    setTimeout(() => {
      setIsAnimating(false)
      setIsTested(true)
    }, 700)
  }

  const handleReset = () => {
    setIsTested(false)
    setIsAnimating(false)
    setSavedSuccessMessage(null)
  }

  const isHypothesisCorrect = hypothesisNature ? hypothesisNature === currentSample.nature : undefined

  const handleSaveToJournal = () => {
    const hypothesisLabel = hypothesisNature ? NATURE_LABELS[hypothesisNature] : undefined

    const newRecord = createSimulationRecord(
      currentSample.name,
      currentIndicator.name,
      currentSample.approximatePh,
      colorResult.colorName,
      colorResult.colorHex,
      getNatureLabel(currentSample.approximatePh),
      hypothesisLabel,
      isHypothesisCorrect,
      studentConclusion.trim() || undefined
    )
    setHistory([newRecord, ...history])

    // Daftarkan ke sistem antrean/tautan akun eksperimen
    addLabExperimentRecord({
      sampleName: currentSample.name,
      indicatorName: currentIndicator.name,
      ph: currentSample.approximatePh,
      colorName: colorResult.colorName,
      colorHex: colorResult.colorHex,
      natureLabel: getNatureLabel(currentSample.approximatePh),
      hypothesisNature: hypothesisLabel,
      studentConclusion: studentConclusion.trim() || undefined,
      isHypothesisCorrect,
    })

    setSavedSuccessMessage('✓ Pengamatan & analisis berhasil dicatat ke Jurnal Pembelajaran!')
    setTimeout(() => {
      setSavedSuccessMessage(null)
    }, 4000)
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  return (
    <section id="lab-section" className="content-section" aria-labelledby="lab-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Modul Inkuiri 2</span>
          <span className="section-topic-pill">Tahap 3, 4, 5, & 6: Eksperimen & Analisis</span>
        </div>
        <h2 id="lab-heading" className="section-title">
          Laboratorium Virtual Pengujian Asam-Basa
        </h2>
        <p className="section-description">
          Praktikkan metode ilmiah secara bertahap: rumuskan hipotesis sifat larutan, kumpulkan data eksperimen indikator,
          bandingkan hasil empiris dengan hipotesismu, dan tarik kesimpulan ilmiah.
        </p>
      </div>

      <div className="lab-workbench-grid">
        {/* Left Column: Sample, Hypothesis, & Indicator Selectors */}
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
                Sampel yang sedang diselidiki:
              </label>
              <select
                id="sample-dropdown"
                className="lab-dropdown"
                value={selectedSampleId}
                onChange={(e) => handleSampleChange(e.target.value)}
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
                <span className="info-key">Kategori:</span>
                <span className="info-val" style={{ textTransform: 'capitalize' }}>{currentSample.category}</span>
              </div>
              <div className="sample-info-row">
                <span className="info-key">Deskripsi:</span>
                <span className="info-val">{currentSample.description}</span>
              </div>
            </div>
          </div>

          {/* Step 2: Formulate Hypothesis (Tahap 3 Inkuiri) */}
          <div className="control-group-card hypothesis-panel-card">
            <div className="control-card-header">
              <span className="step-badge" style={{ background: '#f59e0b', color: '#ffffff' }}>Tahap 3 Inkuiri</span>
              <h3 className="control-title">Rumuskan Hipotesis Awal</h3>
            </div>
            <p className="hypothesis-guide-text" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
              Sebelum menguji <strong>{currentSample.name}</strong>, apa dugaan ilmiahmu mengenai sifat keasaman larutan ini?
            </p>

            <div className="hypothesis-options-grid">
              {(
                [
                  { key: 'asam_kuat', label: 'Asam Kuat' },
                  { key: 'asam_lemah', label: 'Asam Lemah' },
                  { key: 'netral', label: 'Netral' },
                  { key: 'basa_lemah', label: 'Basa Lemah' },
                  { key: 'basa_kuat', label: 'Basa Kuat' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  disabled={isHypothesisLocked}
                  className={`hypothesis-option-btn ${hypothesisNature === opt.key ? 'selected' : ''}`}
                  onClick={() => setHypothesisNature(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {hypothesisNature ? (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '12px', padding: '5px 12px' }}
                  onClick={() => setIsHypothesisLocked(!isHypothesisLocked)}
                >
                  {isHypothesisLocked ? '🔓 Ubah Dugaan' : '🔒 Kunci Dugaan'}
                </button>
              ) : (
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  💡 Pilih salah satu dugaan sifat di atas
                </span>
              )}
              {isHypothesisLocked && (
                <span className="hypothesis-locked-badge">✓ Dugaan Terkunci</span>
              )}
            </div>
          </div>

          {/* Step 3: Indicator Selection & Test Execution (Tahap 4 Inkuiri) */}
          <div className="control-group-card">
            <div className="control-card-header">
              <span className="step-badge">Tahap 4 Inkuiri</span>
              <h3 className="control-title">Uji dengan Indikator</h3>
            </div>

            <div className="indicator-select-wrapper">
              <label htmlFor="indicator-dropdown" className="control-label">
                Pilih alat uji / indikator kimia:
              </label>
              <select
                id="indicator-dropdown"
                className="lab-dropdown"
                value={selectedIndicatorId}
                onChange={(e) => handleIndicatorChange(e.target.value)}
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
                    <span>Sedang Menguji Reaksi...</span>
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

        {/* Right Column: Visual Workbench, Observation Result, Hypothesis Evaluation, & Conclusion */}
        <div className="lab-display-panel">
          {/* Workbench Graphic */}
          <div className="bench-stage-card">
            <div className="stage-header">
              <span className="stage-tag">Tabung Reaksi Pengujian Virtual</span>
              <span className="stage-status-indicator">
                {isTested ? '✓ Pengujian Selesai (Data Terkumpul)' : 'Siap Diuji'}
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

          {/* Observation Result & Inquiry Scaffolding Card */}
          {isTested ? (
            <div className="observation-result-card animate-fade-in" id="observation-result">
              <div className="obs-card-header">
                <div className="obs-badge-group">
                  <span className="obs-status-pill">Tahap 4: Data Pengamatan</span>
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

              {savedSuccessMessage && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' }}>
                  {savedSuccessMessage}
                </div>
              )}

              {/* Raw Data Grid */}
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
                  <span className="obs-label">Spesi Ionik Dominan:</span>
                  <span className="obs-value font-mono">{currentSample.ionPresent}</span>
                </div>
              </div>

              <div className="obs-explanation-box">
                <h4 className="explanation-title">Mekanisme Kimiawi Reaksi:</h4>
                <p className="explanation-text">{colorResult.behaviorNote}</p>
              </div>

              {/* Tahap 5: Menganalisis Data — Komparasi Hipotesis vs Data Eksperimen */}
              <div className="hypothesis-analysis-section" style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Tahap 5: Analisis Komparasi Hipotesis vs Data
                </h4>
                {hypothesisNature ? (
                  isHypothesisCorrect ? (
                    <div className="hypothesis-eval-card eval-success">
                      <div className="eval-header">
                        <span>✅</span>
                        <span>Hipotesis Terbukti Sesuai!</span>
                      </div>
                      <p className="eval-desc">
                        Dugaanmu bahwa <strong>{currentSample.name}</strong> bersifat <strong>{NATURE_LABELS[hypothesisNature]}</strong> terbukti benar.
                        Data eksperimen menunjukkan respon warna <strong>{colorResult.colorName}</strong> dengan estimasi pH <strong>{currentSample.approximatePh.toFixed(1)}</strong>,
                        yang konsisten dengan dominasi spesi <code>{currentSample.ionPresent}</code>.
                      </p>
                    </div>
                  ) : (
                    <div className="hypothesis-eval-card eval-mismatch">
                      <div className="eval-header">
                        <span>🔍</span>
                        <span>Refleksi Ilmiah: Hipotesis Berbeda dari Data</span>
                      </div>
                      <p className="eval-desc">
                        Dugaan awalmu adalah <strong>{NATURE_LABELS[hypothesisNature]}</strong>, namun hasil uji eksperimen menunjukkan sifat <strong>{getNatureLabel(currentSample.approximatePh)}</strong> (pH ≈ {currentSample.approximatePh.toFixed(1)}).
                        Hal ini lumrah terjadi dalam penelitian ilmiah. Faktor penentunya adalah kekuatan ionisasi: sampel ini melepaskan <code>{currentSample.ionPresent}</code>.
                      </p>
                    </div>
                  )
                ) : (
                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', color: '#64748b' }}>
                    💡 <strong>Catatan Inkuiri:</strong> Kamu belum memilih hipotesis sebelum pengujian. Cobalah mengunci dugaan sifat larutan pada pengujian berikutnya untuk melatih intuisi penalaran sainsmu!
                  </div>
                )}
              </div>

              {/* Tahap 6: Menarik Kesimpulan Siswa */}
              <div className="conclusion-input-box">
                <label htmlFor="student-lab-conclusion" className="conclusion-label">
                  Tahap 6: Rumuskan Kesimpulan Ilmiahmu
                </label>
                <textarea
                  id="student-lab-conclusion"
                  className="conclusion-textarea"
                  rows={2}
                  placeholder="Contoh: Berdasarkan perubahan warna indikator dan nilai pH, larutan ini tergolong asam lemah karena derajat ionisasinya kecil..."
                  value={studentConclusion}
                  onChange={(e) => setStudentConclusion(e.target.value)}
                />
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
                <strong>Alur Inkuiri Laboratorium Terbimbing:</strong>
                <p>
                  1. Pilih sampel larutan pada panel kiri.<br />
                  2. Rumuskan hipotesismu mengenai sifat larutan pada <strong>Tahap 3</strong>.<br />
                  3. Pilih indikator kimia dan klik tombol{' '}
                  <em>
                    "{currentIndicator.type === 'kertas'
                      ? 'Celupkan Kertas Uji'
                      : 'Teteskan Indikator'}"
                  </em>{' '}
                  untuk mengumpulkan data pengamatan.
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
              <h3 className="journal-title">Buku Jurnal Pengamatan Inkuiri Siswa</h3>
              <p className="journal-subtitle">
                Rekam jejak penyelidikan ilmiah: sampel, hipotesis awal, data pengamatan, evaluasi kesesuaian, dan kesimpulanmu.
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
                  <th scope="col">Indikator & Hasil</th>
                  <th scope="col">Estimasi pH</th>
                  <th scope="col">Hipotesis Siswa</th>
                  <th scope="col">Evaluasi & Sifat</th>
                  <th scope="col">Kesimpulan Siswa</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td className="font-mono text-muted">{record.timestamp}</td>
                    <td><strong>{record.sampleName}</strong></td>
                    <td>
                      <div className="table-color-swatch-row">
                        <span
                          className="table-color-dot"
                          style={{ backgroundColor: record.colorHex }}
                        />
                        <span>{record.indicatorName} ({record.colorName})</span>
                      </div>
                    </td>
                    <td className="font-mono">{record.ph.toFixed(1)}</td>
                    <td>
                      {record.hypothesisNature ? (
                        <span className="font-medium">{record.hypothesisNature}</span>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '12px' }}>Tanpa Dugaan</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className="badge-nature-small">
                          {record.natureLabel}
                        </span>
                        {record.isHypothesisCorrect !== undefined && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: record.isHypothesisCorrect ? '#166534' : '#b45309',
                            }}
                          >
                            {record.isHypothesisCorrect ? '✓ Sesuai' : '⚡ Perlu Refleksi'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ maxWidth: '220px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {record.studentConclusion || <span className="text-muted">Belum diisi</span>}
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
