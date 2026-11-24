import { useState, useEffect } from 'react'
import { CHEMICAL_SAMPLES, INDICATORS } from '../data/chemistryData'
import type { ChemicalSample, Indicator, SimulationRecord, SampleNature } from '../types/chemistry'
import { addLabExperimentRecord, getCurrentUser } from '../services/authStorage'
import { LabCitation } from './LabCitation'
import { LabBibliography } from './LabBibliography'

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

function getLabJournalKey(userId?: string): string {
  const uid = userId || getCurrentUser()?.id
  return uid ? `asambasa_lab_journal_${uid}` : 'asambasa_lab_journal_guest'
}

function loadLabJournal(userId?: string): SimulationRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(getLabJournalKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLabJournal(records: SimulationRecord[], userId?: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getLabJournalKey(userId), JSON.stringify(records))
  } catch (e) {
    console.warn('[VirtualLab] Gagal menyimpan jurnal ke localStorage:', e)
  }
}

export interface VirtualLabProps {
  onSimulationStateChange?: (state: 'initial' | 'acid' | 'neutral' | 'base') => void
}

export function VirtualLab({ onSimulationStateChange }: VirtualLabProps = {}) {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(CHEMICAL_SAMPLES[0].id)
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(INDICATORS[0].id)
  const [isTested, setIsTested] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [history, setHistory] = useState<SimulationRecord[]>(() => loadLabJournal())
  const [activeFilterCategory, setActiveFilterCategory] = useState<'semua' | 'sehari-hari' | 'laboratorium'>('semua')

  // AD14-06 & AD14-07: Muat ulang jurnal saat akun berganti atau halaman difokuskan kembali
  useEffect(() => {
    const handleAuthChange = () => {
      const freshUser = getCurrentUser()
      setHistory(loadLabJournal(freshUser?.id))
    }
    window.addEventListener('asambasa:auth_changed', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('focus', handleAuthChange)
    return () => {
      window.removeEventListener('asambasa:auth_changed', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('focus', handleAuthChange)
    }
  }, [])
  
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

  // Sinkronisasi status pengujian untuk tema dinamis latar lab (Inkuiri Kimia)
  useEffect(() => {
    if (!isTested) {
      onSimulationStateChange?.('initial')
    } else if (currentSample.approximatePh < 7.0) {
      onSimulationStateChange?.('acid')
    } else if (currentSample.approximatePh > 7.0) {
      onSimulationStateChange?.('base')
    } else {
      onSimulationStateChange?.('neutral')
    }
  }, [isTested, currentSample.approximatePh, onSimulationStateChange])

  const filteredSamples = CHEMICAL_SAMPLES.filter((s) => {
    if (activeFilterCategory === 'semua') return true
    return s.category === activeFilterCategory
  })

    // AD14-04: Pisahkan Sifat Larutan (Asam, Netral, Basa berdasarkan pH)
  // dari Kekuatan Senyawa Kimia (Kuat vs Lemah berdasarkan derajat ionisasi alpha / metadata)
  const getSolutionProperty = (ph: number): string => {
    if (ph < 7.0) return 'Asam'
    if (ph === 7.0) return 'Netral'
    return 'Basa'
  }

  const getCompoundStrengthLabel = (nature: SampleNature): string => {
    return NATURE_LABELS[nature] || 'Netral'
  }

  // Label gabungan deskriptif yang presisi secara ilmiah
  const getFullClassificationLabel = (sample: ChemicalSample): string => {
    const prop = getSolutionProperty(sample.approximatePh)
    const strength = getCompoundStrengthLabel(sample.nature)
    if (sample.nature === 'netral') return 'Netral'
    return `${prop} (${strength})`
  }

  const getNatureLabel = (_ph?: number): string => {
    return getFullClassificationLabel(currentSample)
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
      getFullClassificationLabel(currentSample),
      hypothesisLabel,
      isHypothesisCorrect,
      studentConclusion.trim() || undefined
    )
    const updatedHistory = [newRecord, ...history]
    setHistory(updatedHistory)
    saveLabJournal(updatedHistory)

    // Daftarkan ke sistem antrean/tautan akun eksperimen
    addLabExperimentRecord({
      sampleName: currentSample.name,
      indicatorName: currentIndicator.name,
      ph: currentSample.approximatePh,
      colorName: colorResult.colorName,
      colorHex: colorResult.colorHex,
      natureLabel: getFullClassificationLabel(currentSample),
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
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh catatan buku jurnal pengamatan inkuiri ini? Data yang dihapus tidak dapat dipulihkan.')) {
      setHistory([])
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(getLabJournalKey())
        } catch {}
      }
    }
  }

  // Helper untuk mendapatkan sitasi spesifik sampel terpilih
  const getSampleCitationId = (sampleId: string): string => {
    switch (sampleId) {
      case 'hcl':
      case 'naoh':
      case 'air-murni':
        return 'brown-2018'
      case 'lemon':
        return 'haynes-2016'
      case 'cuka':
      case 'soda':
      case 'sabun':
      case 'amonia':
        return 'chang-2016'
      case 'air-laut':
      case 'soda-kue':
      case 'antasida':
      case 'pemutih':
        return 'zumdahl-2020'
      default:
        return 'openstax-2019'
    }
  }

  // Helper untuk mendapatkan sitasi spesifik indikator terpilih
  const getIndicatorCitationId = (indId: string): string => {
    switch (indId) {
      case 'lakmus-merah':
      case 'lakmus-biru':
        return 'chang-2016'
      case 'kol-ungu':
      case 'kunyit':
        return 'harborne-1998'
      case 'pp':
      case 'btb':
      case 'mo':
        return 'haynes-2016'
      case 'universal':
      default:
        return 'openstax-2019'
    }
  }

  return (
    <section id="lab-section" className="content-section" aria-labelledby="lab-heading">
      <div className="virtual-lab-container">
        {/* =========================================================================
            BARIS 1 — RUMUSAN MASALAH (Full-width across content area)
            ========================================================================= */}
        <div className="virtual-lab-row-problem">
          <div className="problem-formulation-card">
            <div className="problem-header-row">
              <div className="problem-badge-wrapper">
                <span className="section-module-pill">Modul Inkuiri 2</span>
                <span className="problem-inquiry-badge">Tahap 1 Inkuiri: Orientasi Masalah</span>
              </div>
              <span className="stage-status-indicator" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                Titik Awal Eksperimen Terbimbing
              </span>
            </div>

            <div className="problem-title-section">
              <h2 id="lab-heading" className="section-title" style={{ marginBottom: '8px' }}>
                Laboratorium Virtual Pengujian Asam-Basa
              </h2>
              <p className="section-description" style={{ marginBottom: '14px' }}>
                Praktikkan metode ilmiah secara bertahap: pelajari masalah eksperimen, rumuskan hipotesis analit, kumpulkan data kolorimetri,
                bandingkan bukti empiris dengan dugaan awalmu, dan tarik kesimpulan ilmiah terverifikasi{' '}
                <LabCitation id="openstax-2019" />.
              </p>
            </div>

            {/* Research Question Callout */}
            <div className="problem-question-box">
              <span className="problem-question-icon" aria-hidden="true">🔬</span>
              <div className="problem-question-content">
                <h3 className="problem-question-title">Pertanyaan Pemantik / Masalah Eksperimen (Research Question)</h3>
                <p className="problem-question-text">
                  "Bagaimana cara mengidentifikasi dan mengelompokkan sifat larutan analit (asam kuat, asam lemah, netral, basa lemah, atau basa kuat) yang kita jumpai di kehidupan sehari-hari maupun laboratorium kimia menggunakan berbagai instrumen indikator kolorimetri? Serta bagaimana perubahan visual respon warna tersebut mencerminkan derajat keasaman (pH) dan pergeseran kesetimbangan ionik derajat disosiasi dalam larutan?"{' '}
                  <LabCitation id="skoog-2014" />
                  <LabCitation id="brown-2018" />
                </p>
              </div>
            </div>

            {/* 3 Sub-Cards Teori & Karakteristik */}
            <div className="problem-subcards-grid">
              <div className="lab-intro-subcard">
                <h4 className="intro-subcard-title">
                  <span>🎯</span> Tujuan Praktikum &amp; Konsep Kimia
                </h4>
                <p className="intro-subcard-text">
                  Mengidentifikasi derajat keasaman (pH) dan sifat asam-basa larutan melalui perubahan warna indikator kolorimetri{' '}
                  <LabCitation id="skoog-2014" />. Sifat asam ditentukan oleh kelebihan ion hidronium (<code>H₃O⁺</code>),
                  sedangkan sifat basa ditentukan oleh ion hidroksida (<code>OH⁻</code>) dalam pelarut air{' '}
                  <LabCitation id="brown-2018" />.
                </p>
              </div>

              <div className="lab-intro-subcard">
                <h4 className="intro-subcard-title">
                  <span>🧪</span> Fungsi Instrumen &amp; Reagen Lab
                </h4>
                <p className="intro-subcard-text">
                  Tabung reaksi berfungsi sebagai wadah transparan pengamatan mikro reaksi visual{' '}
                  <LabCitation id="brown-2018" />. Pipet tetes mengalirkan reagen indikator dalam volume mikro (1–2 tetes)
                  agar tidak mengubah kapasitas penyangga larutan uji secara signifikan{' '}
                  <LabCitation id="skoog-2014" />.
                </p>
              </div>

              <div className="lab-intro-subcard">
                <h4 className="intro-subcard-title">
                  <span>🌿</span> Karakteristik Indikator Asam-Basa
                </h4>
                <p className="intro-subcard-text">
                  Kertas lakmus memanfaatkan zat warna azolitmin alami untuk deteksi kualitatif cepat{' '}
                  <LabCitation id="chang-2016" />. Indikator sintetik memiliki rentang perubahan warna spesifik{' '}
                  <LabCitation id="haynes-2016" />, sementara indikator alami memanfaatkan pigmen antosianin dan kurkumin{' '}
                  <LabCitation id="harborne-1998" />.
                </p>
              </div>
            </div>

            {/* Banner Keselamatan Kerja Laboratorium */}
            <div className="lab-safety-alert-strip" role="note" aria-label="Informasi Keselamatan Kerja Laboratorium">
              <span style={{ fontSize: '18px' }} aria-hidden="true">⚠️</span>
              <div>
                <strong>Informasi Keselamatan Laboratorium (Safety Protocol):</strong> Pada laboratorium fisik riil, larutan asam kuat
                pekat seperti <code>HCl</code> dan basa kuat pekat seperti <code>NaOH</code> bersifat korosif dan dapat menyebabkan luka bakar kimiawi pada jaringan hidup{' '}
                <LabCitation id="brown-2018" />. Penggunaan alat pelindung diri (jas laboratorium, kacamata pengaman/goggles, dan sarung tangan)
                merupakan standar keselamatan yang mutlak dipatuhi sebelum menangani reagen kimia{' '}
                <LabCitation id="openstax-2019" />.
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BARIS 2 — ALUR INKUIRI (KIRI) DAN PILIH SAMPEL LARUTAN (KANAN)
            ========================================================================= */}
        <div className="virtual-lab-row-inquiry-sample">
          {/* KIRI: Alur Inkuiri Laboratorium Terbimbing */}
          <div className="inquiry-guide-panel">
            <div className="control-group-card inquiry-flow-card">
              <div className="control-card-header">
                <span className="step-badge" style={{ background: '#0284c7', color: '#ffffff' }}>
                  Pedoman Inkuiri
                </span>
                <h3 className="control-title">Alur Inkuiri Laboratorium Terbimbing</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
                Ikuti 6 langkah terstruktur metode ilmiah guided inquiry untuk menguji sifat larutan secara analitis dan bebas bias konfirmasi{' '}
                <LabCitation id="openstax-2019" />:
              </p>

              {/* Grid 2x3 Rapi untuk 6 Tahapan Inkuiri */}
              <div className="inquiry-steps-grid">
                {/* Step 1 */}
                <div className="inquiry-step-card completed">
                  <div className="step-card-top">
                    <span className="step-card-num">1</span>
                    <span className="step-card-status status-done">✓ Selesai</span>
                  </div>
                  <h4 className="step-card-title">Orientasi &amp; Rumusan Masalah</h4>
                  <p className="step-card-desc">
                    Mengkaji rumusan masalah eksperimen dan pertanyaan pemantik di Baris 1.
                  </p>
                </div>

                {/* Step 2 */}
                <div className={`inquiry-step-card ${selectedSampleId ? 'active' : ''}`}>
                  <div className="step-card-top">
                    <span className="step-card-num">2</span>
                    <span className="step-card-status status-active">Aktif</span>
                  </div>
                  <h4 className="step-card-title">Eksplorasi Sifat Reagen</h4>
                  <p className="step-card-desc">
                    Memilih sampel analit pada panel kanan dan pelajari spesi kimianya.
                  </p>
                </div>

                {/* Step 3 */}
                <div className={`inquiry-step-card ${hypothesisNature ? 'completed' : 'active'}`}>
                  <div className="step-card-top">
                    <span className="step-card-num">3</span>
                    <span className={`step-card-status ${hypothesisNature ? 'status-done' : 'status-pending'}`}>
                      {hypothesisNature ? (isHypothesisLocked ? '✓ Terkunci' : 'Dipilih') : 'Menunggu'}
                    </span>
                  </div>
                  <h4 className="step-card-title">Perumusan Hipotesis Awal</h4>
                  <p className="step-card-desc">
                    Memprediksi sifat keasaman sebelum uji untuk melatih penalaran deduktif{' '}
                    <LabCitation id="openstax-2019" showSourceBtn={false} />.
                  </p>
                </div>

                {/* Step 4 */}
                <div className={`inquiry-step-card ${isTested ? 'completed' : ''}`}>
                  <div className="step-card-top">
                    <span className="step-card-num">4</span>
                    <span className={`step-card-status ${isTested ? 'status-done' : 'status-pending'}`}>
                      {isTested ? '✓ Data Ada' : 'Belum Uji'}
                    </span>
                  </div>
                  <h4 className="step-card-title">Eksperimen Kolorimetri</h4>
                  <p className="step-card-desc">
                    Menguji respon warna dengan indikator pada tabung reaksi di Baris 3.
                  </p>
                </div>

                {/* Step 5 */}
                <div className={`inquiry-step-card ${isTested ? 'completed' : ''}`}>
                  <div className="step-card-top">
                    <span className="step-card-num">5</span>
                    <span className={`step-card-status ${isTested ? 'status-done' : 'status-pending'}`}>
                      {isTested ? '✓ Dianalisis' : 'Menunggu'}
                    </span>
                  </div>
                  <h4 className="step-card-title">Analisis Komparasi Data</h4>
                  <p className="step-card-desc">
                    Bandingkan dugaan awal vs bukti empiris Asas Le Chatelier{' '}
                    <LabCitation id="openstax-2019" showSourceBtn={false} />.
                  </p>
                </div>

                {/* Step 6 */}
                <div className={`inquiry-step-card ${studentConclusion.trim() ? 'completed' : ''}`}>
                  <div className="step-card-top">
                    <span className="step-card-num">6</span>
                    <span className={`step-card-status ${studentConclusion.trim() ? 'status-done' : 'status-pending'}`}>
                      {studentConclusion.trim() ? '✓ Disimpulkan' : 'Belum Diisi'}
                    </span>
                  </div>
                  <h4 className="step-card-title">Penarikan Kesimpulan</h4>
                  <p className="step-card-desc">
                    Menyusun kesimpulan ilmiah dan menyimpan catatan ke jurnal pengamatan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: Pilih Sampel Larutan */}
          <div className="sample-selection-panel">
            {/* Step 1: Sample Selection */}
            <div className="control-group-card">
              <div className="control-card-header">
                <span className="step-badge">Tahap 2 Inkuiri</span>
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

              {/* Quick Sample Info dengan Sitasi Spesifik Sifat Bahan Kimia */}
              <div className="sample-quick-info">
                <div className="sample-info-row">
                  <span className="info-key">Rumus Kimia:</span>
                  <span className="info-val font-mono">{currentSample.formula}</span>
                </div>
                <div className="sample-info-row">
                  <span className="info-key">Kategori:</span>
                  <span className="info-val" style={{ textTransform: 'capitalize' }}>
                    {currentSample.category}
                  </span>
                </div>
                <div className="sample-info-row">
                  <span className="info-key">Karakteristik Kimia:</span>
                  <span className="info-val">
                    {currentSample.description}{' '}
                    <LabCitation id={getSampleCitationId(currentSample.id)} />
                  </span>
                </div>
                <div className="sample-info-row">
                  <span className="info-key">Spesi Ionik:</span>
                  <span className="info-val font-mono">
                    {currentSample.ionPresent}{' '}
                    <LabCitation id="brown-2018" />
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Formulate Hypothesis (Tahap 3 Inkuiri) */}
            <div className="control-group-card hypothesis-panel-card">
              <div className="control-card-header">
                <span className="step-badge" style={{ background: '#f59e0b', color: '#ffffff' }}>
                  Tahap 3 Inkuiri
                </span>
                <h3 className="control-title">Rumuskan Hipotesis Awal</h3>
              </div>
              <p
                className="hypothesis-guide-text"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginBottom: '12px',
                  lineHeight: '1.5',
                }}
              >
                Sebelum menguji <strong>{currentSample.name}</strong>, apa dugaan ilmiahmu mengenai sifat keasaman larutan ini?
                Perumusan hipotesis awal sebelum pengamatan merupakan langkah esensial metode ilmiah untuk melatih penalaran deduktif
                tanpa dipengaruhi bias konfirmasi <LabCitation id="openstax-2019" />.
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

              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
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
          </div>
        </div>

        {/* =========================================================================
            BARIS 3 — TABUNG REAKSI (KIRI) DAN UJI DENGAN INDIKATOR (KANAN)
            ========================================================================= */}
        <div className="virtual-lab-row-tube-indicator">
          {/* KIRI: Tabung Reaksi / Pengujian Virtual */}
          <div className="test-tube-panel">
            {/* Dynamic Visual Simulation State Indicator Banner */}
            <div
              className={`lab-dynamic-state-banner state-${
                !isTested
                  ? 'initial'
                  : currentSample.approximatePh < 7
                  ? 'acid'
                  : currentSample.approximatePh > 7
                  ? 'base'
                  : 'neutral'
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="lab-state-banner-content">
                <div className="lab-state-banner-icon-badge">
                  {!isTested && <span aria-hidden="true">🧪</span>}
                  {isTested && currentSample.approximatePh < 7 && <span aria-hidden="true">🔥</span>}
                  {isTested && currentSample.approximatePh > 7 && <span aria-hidden="true">💧</span>}
                  {isTested && currentSample.approximatePh === 7 && <span aria-hidden="true">⚖️</span>}
                </div>
                <div className="lab-state-banner-text">
                  <div className="lab-state-banner-title">
                    {!isTested && 'Status Simulasi: Kondisi Awal (Siap Diuji)'}
                    {isTested && currentSample.approximatePh < 7 && `Hasil Uji: Larutan Bersifat ASAM (pH ≈ ${currentSample.approximatePh})`}
                    {isTested && currentSample.approximatePh > 7 && `Hasil Uji: Larutan Bersifat BASA (pH ≈ ${currentSample.approximatePh})`}
                    {isTested && currentSample.approximatePh === 7 && `Hasil Uji: Larutan Bersifat NETRAL (pH = 7.0)`}
                  </div>
                  <div className="lab-state-banner-sub">
                    {!isTested && 'Pilih sampel larutan dan indikator di panel samping, lalu klik tombol "Uji Larutan".'}
                    {isTested && currentSample.approximatePh < 7 && 'Konsentrasi ion hidronium [H₃O⁺] dominan. Latar laboratorium bertransisi ke nuansa Warm Orange-Yellow.'}
                    {isTested && currentSample.approximatePh > 7 && 'Konsentrasi ion hidroksida [OH⁻] dominan. Latar laboratorium bertransisi ke nuansa Baby Blue.'}
                    {isTested && currentSample.approximatePh === 7 && 'Konsentrasi ion [H₃O⁺] dan [OH⁻] seimbang sempurna. Latar laboratorium berada dalam mode netral.'}
                  </div>
                </div>
                {isTested && (
                  <div className="lab-state-banner-badge">
                    {currentSample.approximatePh < 7 ? 'ASAM' : currentSample.approximatePh > 7 ? 'BASA' : 'NETRAL'}
                  </div>
                )}
              </div>
            </div>

            {/* Workbench Graphic */}
            <div className="bench-stage-card">
              <div className="stage-header">
                <span className="stage-tag">Tabung Reaksi Pengujian Virtual</span>
                <span className="stage-status-indicator">
                  {isTested ? '✓ Pengujian Selesai (Data Terkumpul)' : (isAnimating ? 'Sedang Menguji Reaksi...' : 'Siap Diuji')}
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
              <div style={{ textAlign: 'center', padding: '6px 12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <em>
                  * Simulasi visual respon warna dimodelkan secara komputasional berdasarkan konstanta kesetimbangan analitik{' '}
                  <LabCitation id="skoog-2014" showSourceBtn={false} />.
                </em>
              </div>
            </div>
          </div>

          {/* KANAN: Uji dengan Indikator */}
          <div className="indicator-panel">
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

              {/* Quick Indicator Info dengan Sitasi Teori Indikator */}
              <div className="indicator-quick-info">
                <div className="sample-info-row">
                  <span className="info-key">Tipe Indikator:</span>
                  <span className="info-badge-type">
                    {currentIndicator.type.toUpperCase()}
                  </span>
                </div>
                <div className="sample-info-row">
                  <span className="info-key">Trayek Efektif:</span>
                  <span className="info-val font-mono">
                    {currentIndicator.phRange}{' '}
                    <LabCitation id="haynes-2016" />
                  </span>
                </div>
                <div className="sample-info-row">
                  <span className="info-key">Teori Kesetimbangan:</span>
                  <span className="info-val" style={{ fontSize: '12px' }}>
                    Indikator asam-basa merupakan asam organik lemah (<code>HIn</code>) yang berada dalam kesetimbangan disosiasi{' '}
                    <code>HIn(aq) ⇌ H⁺(aq) + In⁻(aq)</code>{' '}
                    <LabCitation id="skoog-2014" />.
                  </span>
                </div>
                <p className="indicator-tips-note">
                  {currentIndicator.tips}{' '}
                  <LabCitation id={getIndicatorCitationId(currentIndicator.id)} />
                </p>
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
                  title="Bilas tabung reaksi dengan akuades murni untuk menghilangkan residu analit (Chang & Goldsby, 2016)"
                >
                  Bilas Tabung (Reset)
                </button>
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <em>
                  * Pembilasan alat dengan akuades murni mutlak diperlukan untuk mencegah galat kontaminasi silang residu analit{' '}
                  <LabCitation id="chang-2016" showSourceBtn={false} />.
                </em>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BARIS 4 — PENGAMATAN DAN TAHAPAN EKSPERIMEN SELANJUTNYA
            ========================================================================= */}
        <div className="virtual-lab-row-observation">
          {isTested ? (
            <div className="observation-result-card animate-fade-in" id="observation-result">
              <div className="obs-card-header">
                <div className="obs-badge-group">
                  <span className="obs-status-pill">Tahap 4 Inkuiri: Data Hasil Pengamatan</span>
                  <span
                    className={`obs-nature-pill nature-${currentSample.nature}`}
                  >
                    {getFullClassificationLabel(currentSample)}
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
                <div className="lab-success-alert" role="status">
                  {savedSuccessMessage}
                </div>
              )}

              {/* Raw Data Grid 4 Kolom dengan Sitasi Parameter Ilmiah */}
              <div className="obs-result-grid-4col">
                <div className="obs-item-box">
                  <span className="obs-label">Warna Pengamatan Visual:</span>
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

                <div className="obs-item-box">
                  <span className="obs-label">Estimasi Derajat Keasaman:</span>
                  <strong className="obs-value font-mono">
                    pH ≈ {currentSample.approximatePh.toFixed(1)}{' '}
                    <LabCitation id="iupac-2019" />
                  </strong>
                </div>

                <div className="obs-item-box">
                  <span className="obs-label">Trayek Transisi Indikator:</span>
                  <span className="obs-value font-mono">
                    {currentIndicator.phRange}{' '}
                    <LabCitation id="haynes-2016" />
                  </span>
                </div>

                <div className="obs-item-box">
                  <span className="obs-label">Spesi Ionik Dominan:</span>
                  <span className="obs-value font-mono">
                    {currentSample.ionPresent}{' '}
                    <LabCitation id="brown-2018" />
                  </span>
                </div>
              </div>

              {/* Penjelasan Mekanisme Reaksi Kimia dengan Sitasi */}
              <div className="obs-explanation-box">
                <h4 className="explanation-title">Mekanisme Kimiawi Reaksi Perubahan Warna:</h4>
                <p className="explanation-text">
                  {colorResult.behaviorNote}{' '}
                  <LabCitation id={getIndicatorCitationId(currentIndicator.id)} />
                </p>
                <div style={{ marginTop: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Pergeseran warna terjadi sesuai Asas Le Chatelier: peningkatan konsentrasi ion hidronium (<code>H⁺</code>)
                  mendorong kesetimbangan ke arah pembentukan molekul asam indikator (<code>HIn</code>), sedangkan peningkatan basa
                  mendorong deprotonasi ke bentuk anion konjugasi (<code>In⁻</code>){' '}
                  <LabCitation id="openstax-2019" />.
                </div>
              </div>

              {/* Tahap 5: Menganalisis Data — Komparasi Hipotesis vs Data Eksperimen */}
              <div className="hypothesis-analysis-section" style={{ marginTop: '16px' }}>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Tahap 5 Inkuiri: Analisis Komparasi Hipotesis vs Data Eksperimen
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
                        yang konsisten dengan dominasi spesi <code>{currentSample.ionPresent}</code>{' '}
                        <LabCitation id="openstax-2019" />.
                      </p>
                    </div>
                  ) : (
                    <div className="hypothesis-eval-card eval-mismatch">
                      <div className="eval-header">
                        <span>🔍</span>
                        <span>Refleksi Ilmiah: Hipotesis Berbeda dari Data</span>
                      </div>
                      <p className="eval-desc">
                        Dugaan awalmu adalah <strong>{NATURE_LABELS[hypothesisNature]}</strong>, namun hasil uji eksperimen menunjukkan sifat{' '}
                        <strong>{getNatureLabel(currentSample.approximatePh)}</strong> (pH ≈ {currentSample.approximatePh.toFixed(1)}).
                        Dalam metode ilmiah, perbedaan antara hipotesis dan bukti empiris merupakan hal lumrah yang memicu peninjauan ulang konsep derajat ionisasi dan disosiasi spesi kimia{' '}
                        <LabCitation id="openstax-2019" />: sampel ini melepaskan <code>{currentSample.ionPresent}</code>{' '}
                        <LabCitation id="brown-2018" />.
                      </p>
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px dashed #cbd5e1',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#64748b',
                    }}
                  >
                    💡 <strong>Catatan Inkuiri:</strong> Kamu belum memilih hipotesis sebelum pengujian. Menetapkan hipotesis sebelum observasi merupakan prosedur standar untuk membangun penalaran berbasis bukti ilmiah{' '}
                    <LabCitation id="openstax-2019" />.
                  </div>
                )}
              </div>

              {/* Tahap 6: Menarik Kesimpulan Siswa */}
              <div className="conclusion-input-box">
                <label htmlFor="student-lab-conclusion" className="conclusion-label">
                  Tahap 6 Inkuiri: Rumuskan Kesimpulan Ilmiahmu
                </label>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Kesimpulan ilmiah harus merujuk pada perubahan warna indikator dan estimasi nilai pH untuk mengklasifikasikan kekuatan asam/basa sampel{' '}
                  <LabCitation id="iupac-2019" showSourceBtn={false} />.
                </div>
                <textarea
                  id="student-lab-conclusion"
                  className="conclusion-textarea"
                  rows={2}
                  placeholder="Contoh: Berdasarkan perubahan warna indikator dan nilai pH ≈ 2.8, larutan asam asetat tergolong asam lemah karena derajat ionisasinya kecil (Chang & Goldsby, 2016)..."
                  value={studentConclusion}
                  onChange={(e) => setStudentConclusion(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="observation-waiting-card">
              <div className="waiting-card-icon" aria-hidden="true">🧪</div>
              <div className="waiting-card-content">
                <h4 className="waiting-card-title">Tahap 4, 5, &amp; 6 Inkuiri: Pengamatan dan Tahapan Eksperimen Selanjutnya</h4>
                <p className="waiting-card-text">
                  Lakukan pengujian pada <strong>Baris 3</strong> di atas (pilih indikator pada panel kanan, lalu klik tombol{' '}
                  <em>"{currentIndicator.type === 'kertas' ? 'Celupkan Kertas Uji' : 'Teteskan Indikator'}"</em>).
                  Setelah pengujian dijalankan, lembar data hasil pengamatan kolorimetri, mekanisme kesetimbangan ionik Asas Le Chatelier,
                  evaluasi hipotesis, dan form perumusan kesimpulan ilmiah akan ditampilkan secara otomatis di sini{' '}
                  <LabCitation id="skoog-2014" showSourceBtn={false} />.
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
                Rekam jejak penyelidikan ilmiah: sampel, hipotesis awal, data pengamatan, evaluasi kesesuaian, dan kesimpulanmu{' '}
                <LabCitation id="openstax-2019" />.
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
                  <th scope="col">Indikator &amp; Hasil</th>
                  <th scope="col">Estimasi pH</th>
                  <th scope="col">Hipotesis Siswa</th>
                  <th scope="col">Evaluasi &amp; Sifat</th>
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

      {/* Bagian 7: Daftar Pustaka Lengkap Virtual Lab (Format APA 7th Edition) */}
      <LabBibliography />
    </section>
  )
}
