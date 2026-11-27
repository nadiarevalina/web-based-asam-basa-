import { useState, useEffect } from 'react'
import './OnboardingModal.css'

export interface OnboardingModalProps {
  isOpen: boolean
  isMandatory?: boolean
  onComplete: () => void
  onClose?: () => void
}

interface InquiryStageInfo {
  step: number
  name: string
  shortLabel: string
  icon: string
  color: string
}

const INQUIRY_STAGES: InquiryStageInfo[] = [
  { step: 1, name: 'Orientasi', shortLabel: 'Orientasi', icon: '🌟', color: 'stage-warm' },
  { step: 2, name: 'Merumuskan Masalah', shortLabel: 'Masalah', icon: '❓', color: 'stage-orange' },
  { step: 3, name: 'Merumuskan Hipotesis', shortLabel: 'Hipotesis', icon: '💡', color: 'stage-amber' },
  { step: 4, name: 'Mengumpulkan Data', shortLabel: 'Eksplorasi', icon: '🧪', color: 'stage-blue' },
  { step: 5, name: 'Menguji Hipotesis', shortLabel: 'Pengujian', icon: '⚖️', color: 'stage-sky' },
  { step: 6, name: 'Menarik Kesimpulan', shortLabel: 'Kesimpulan', icon: '🎯', color: 'stage-cyan' },
]

export function OnboardingModal({
  isOpen,
  isMandatory = true,
  onComplete,
  onClose,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [agreementChecked, setAgreementChecked] = useState<boolean>(false)
  const [hypothesisText, setHypothesisText] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    try {
      return window.localStorage.getItem('asambasa_user_hypothesis') || ''
    } catch {
      return ''
    }
  })

  // Sinkronisasi status hipotesis ke localStorage
  const handleHypothesisChange = (val: string) => {
    setHypothesisText(val)
    try {
      window.localStorage.setItem('asambasa_user_hypothesis', val)
    } catch {
      // ignore storage error
    }
  }

  // Cegah scroll pada body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Cegah penutupan melalui tombol Escape jika prosedur wajib
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isMandatory && onClose) {
          onClose()
        }
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isMandatory, onClose])

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFinish = () => {
    if (currentStep === 6 && agreementChecked) {
      try {
        window.localStorage.setItem('asambasa_onboarding_completed', 'true')
      } catch {
        // ignore storage error
      }
      onComplete()
    }
  }

  return (
    <div
      className="onboarding-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onClick={(e) => {
        // Hanya izinkan klik luar jika BUKAN mode wajib
        if (!isMandatory && e.target === e.currentTarget && onClose) {
          onClose()
        }
      }}
    >
      <div className="onboarding-card-wrapper animate-slide-up">
        {/* Top Header Card */}
        <div className="onboarding-header">
          <div className="onboarding-badge-row">
            <span className="onboarding-tag">
              <span className="onboarding-tag-pulse" />
              Sintaks Inkuiri Terbimbing
            </span>
            <span className="onboarding-step-counter">
              Tahap {currentStep} dari 6
            </span>
            {!isMandatory && onClose && (
              <button
                type="button"
                className="onboarding-close-btn"
                onClick={onClose}
                aria-label="Tutup Panduan"
              >
                ✕
              </button>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="onboarding-stepper" role="tablist" aria-label="Tahapan Inkuiri Terbimbing">
            {INQUIRY_STAGES.map((stage) => {
              const isPast = stage.step < currentStep
              const isCurrent = stage.step === currentStep
              return (
                <div
                  key={stage.step}
                  className={`stepper-node ${isCurrent ? 'active' : ''} ${
                    isPast ? 'completed' : ''
                  }`}
                  onClick={() => {
                    // Izinkan navigasi langsung ke tahap yang sudah dilalui atau tahap berikutnya
                    if (stage.step <= currentStep) {
                      setCurrentStep(stage.step)
                    }
                  }}
                  title={`Tahap ${stage.step}: ${stage.name}`}
                >
                  <div className="stepper-bubble">
                    {isPast ? '✓' : stage.icon}
                  </div>
                  <span className="stepper-label">{stage.shortLabel}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Dynamic Body Content */}
        <div className="onboarding-body-scroll">
          {/* =================================================================
              TAHAP 1: ORIENTASI
              ================================================================= */}
          {currentStep === 1 && (
            <div className="onboarding-step-content animate-fade-in">
              <div className="step-hero-banner warm-acid-theme">
                <div className="step-hero-icon-wrap">
                  <span className="step-big-icon">⚗️</span>
                </div>
                <div className="step-hero-text">
                  <span className="step-eyebrow">Tahap 1 Inkuiri Terbimbing</span>
                  <h2 id="onboarding-title" className="step-main-title">
                    Selamat Datang di Pembelajaran Asam Basa!
                  </h2>
                </div>
              </div>

              <div className="onboarding-intro-box">
                <p className="intro-lead-text">
                  Selamat datang di website pembelajaran kimia Asam Basa. Melalui website ini, kamu akan mempelajari konsep asam dan basa melalui materi interaktif, simulasi, kegiatan eksplorasi, dan evaluasi. Sebelum memulai pembelajaran, pelajari terlebih dahulu petunjuk penggunaan berikut agar kamu dapat mengikuti seluruh kegiatan dengan baik.
                </p>
              </div>

              <div className="onboarding-instruction-card">
                <div className="instruction-card-title">
                  <span className="instruction-icon">📋</span>
                  <strong>Petunjuk Penting bagi Siswa:</strong>
                </div>
                <ul className="instruction-list">
                  <li>
                    <span className="list-dot-num">1</span>
                    <span><strong>Bacalah setiap tahapan prosedur dengan cermat</strong> agar memahami alur dan tujuan kegiatan.</span>
                  </li>
                  <li>
                    <span className="list-dot-num">2</span>
                    <span><strong>Ikuti urutan kegiatan yang telah disediakan</strong> secara sistematis mulai dari konsep dasar hingga praktikum.</span>
                  </li>
                  <li>
                    <span className="list-dot-num">3</span>
                    <span><strong>Gunakan tombol navigasi</strong> "Kembali" dan "Lanjutkan" untuk berpindah antar tahapan inkuiri.</span>
                  </li>
                  <li>
                    <span className="list-dot-num">4</span>
                    <span><strong>Jangan melewati tahapan</strong> sebelum memahami petunjuk dan konsep pada tahap tersebut.</span>
                  </li>
                </ul>
              </div>

              <div className="onboarding-tip-banner">
                <span className="tip-symbol">💡</span>
                <span>Prosedur ini dirancang berbasis <strong>Inkuiri Terbimbing</strong> untuk membimbingmu menemukan konsep kimia secara mandiri, kritis, dan menyenangkan.</span>
              </div>
            </div>
          )}

          {/* =================================================================
              TAHAP 2: MERUMUSKAN MASALAH
              ================================================================= */}
          {currentStep === 2 && (
            <div className="onboarding-step-content animate-fade-in">
              <div className="step-hero-banner orange-acid-theme">
                <div className="step-hero-icon-wrap">
                  <span className="step-big-icon">❓</span>
                </div>
                <div className="step-hero-text">
                  <span className="step-eyebrow">Tahap 2 Inkuiri Terbimbing</span>
                  <h2 id="onboarding-title" className="step-main-title">
                    Apa yang Akan Kamu Pelajari?
                  </h2>
                </div>
              </div>

              <div className="onboarding-problem-card">
                <div className="problem-card-header">
                  <span className="problem-sparkle">🍋 🧼</span>
                  <span className="problem-badge">Pertanyaan Pemantik Inkuiri</span>
                </div>
                <blockquote className="problem-quote">
                  "Mengapa air jeruk terasa asam, sedangkan air sabun terasa licin? Bagaimana cara mengetahui suatu larutan termasuk asam atau basa secara ilmiah dan aman?"
                </blockquote>
              </div>

              <div className="onboarding-explanation-card">
                <p>
                  Pertanyaan tersebut akan menjadi <strong>awal kegiatan penyelidikanmu</strong>. Kamu tidak boleh mencicipi zat kimia sembarangan di laboratorium! Oleh karena itu, kamu akan diarahkan untuk menemukan jawaban melalui materi konseptual, simulasi laboratorium virtual, dan kegiatan eksplorasi indikator yang tersedia di website ini.
                </p>
              </div>

              <div className="learning-goals-grid">
                <div className="goal-item-card">
                  <div className="goal-icon">🎯</div>
                  <div className="goal-content">
                    <strong>Tujuan 1: Mengenali Sifat Asam & Basa</strong>
                    <p>Membedakan karakteristik larutan asam, basa, dan netral melalui indikator lakmus, pH, dan indikator alami.</p>
                  </div>
                </div>

                <div className="goal-item-card">
                  <div className="goal-icon">📚</div>
                  <div className="goal-content">
                    <strong>Tujuan 2: Memahami 3 Teori Asam Basa</strong>
                    <p>Menjelaskan konsep transfer proton dan pasangan elektron menurut Arrhenius, Brønsted–Lowry, dan Lewis.</p>
                  </div>
                </div>

                <div className="goal-item-card">
                  <div className="goal-icon">🔬</div>
                  <div className="goal-content">
                    <strong>Tujuan 3: Eksplorasi Lab & Nilai pH</strong>
                    <p>Melakukan pengujian virtual secara akurat, menghitung nilai pH, serta menarik kesimpulan berbasis data ilmiah.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAHAP 3: MERUMUSKAN HIPOTESIS
              ================================================================= */}
          {currentStep === 3 && (
            <div className="onboarding-step-content animate-fade-in">
              <div className="step-hero-banner amber-theme">
                <div className="step-hero-icon-wrap">
                  <span className="step-big-icon">💡</span>
                </div>
                <div className="step-hero-text">
                  <span className="step-eyebrow">Tahap 3 Inkuiri Terbimbing</span>
                  <h2 id="onboarding-title" className="step-main-title">
                    Buat Dugaan Awalmu!
                  </h2>
                </div>
              </div>

              <div className="onboarding-intro-box">
                <p>
                  Sebelum melakukan eksplorasi di dalam materi dan laboratorium virtual, cobalah membuat <strong>dugaan awal (hipotesis)</strong> berdasarkan pengetahuan atau pengalaman sehari-hari yang telah kamu miliki.
                </p>
              </div>

              <div className="hypothesis-interactive-card">
                <div className="hypothesis-q-header">
                  <span className="q-tag">Pertanyaan Refleksi Hipotesis:</span>
                  <h3 className="hypothesis-q-title">
                    "Menurut dugaanmu, apakah semua larutan yang memiliki rasa asam dapat dikenali melalui sifat atau indikator yang sama?"
                  </h3>
                </div>

                <div className="hypothesis-input-group">
                  <label htmlFor="hypothesis-field" className="hypothesis-label">
                    Tuliskan dugaan awalmu secara mandiri di bawah ini (Opsional):
                  </label>
                  <textarea
                    id="hypothesis-field"
                    className="hypothesis-textarea"
                    rows={4}
                    placeholder="Contoh: Menurut dugaan saya, semua larutan asam akan selalu mengubah lakmus biru menjadi merah, menghasilkan ion H+, dan memiliki nilai pH di bawah 7..."
                    value={hypothesisText}
                    onChange={(e) => handleHypothesisChange(e.target.value)}
                  />
                  <span className="hypothesis-char-hint">
                    {hypothesisText.length > 0
                      ? `✓ Dugaanmu tersimpan sementara di peramban (${hypothesisText.length} karakter)`
                      : 'Kamu dapat mengisi kolom ini atau langsung melanjutkan ke tahap berikutnya.'}
                  </span>
                </div>

                <div className="hypothesis-reassurance-box">
                  <span className="reassurance-icon">🤝</span>
                  <p>
                    <strong>Tidak perlu khawatir jika dugaanmu belum tepat.</strong> Kamu akan memperoleh informasi, bukti empiris, dan penjelasan teoritis melalui kegiatan pembelajaran dan simulasi virtual pada tahap berikutnya.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAHAP 4: MENGUMPULKAN DATA
              ================================================================= */}
          {currentStep === 4 && (
            <div className="onboarding-step-content animate-fade-in">
              <div className="step-hero-banner base-blue-theme">
                <div className="step-hero-icon-wrap">
                  <span className="step-big-icon">🧪</span>
                </div>
                <div className="step-hero-text">
                  <span className="step-eyebrow">Tahap 4 Inkuiri Terbimbing</span>
                  <h2 id="onboarding-title" className="step-main-title">
                    Jelajahi Fitur Pembelajaran!
                  </h2>
                </div>
              </div>

              <div className="onboarding-intro-box">
                <p>
                  Untuk mengumpulkan data dan memahami konsep asam basa secara komprehensif, website ini telah dilengkapi dengan <strong>menu dan fitur pembelajaran interaktif</strong>. Kenali setiap fungsi menu berikut agar kamu dapat menjelajahi website dengan lancar:
                </p>
              </div>

              <div className="feature-nav-guide-list">
                {/* 1. Beranda */}
                <div className="nav-guide-item item-beranda">
                  <div className="nav-guide-badge">01</div>
                  <div className="nav-guide-details">
                    <div className="nav-guide-title-row">
                      <span className="nav-guide-icon">🏠</span>
                      <strong>Menu Beranda (Halaman Pembuka)</strong>
                    </div>
                    <ul className="nav-guide-sublist">
                      <li>Menampilkan halaman utama pembelajaran dan pengantar inkuiri.</li>
                      <li>Menyajikan pertanyaan pemantik fenomena kehidupan nyata dan peta 7 modul pembelajaran.</li>
                      <li>Menjadi titik awal untuk memulai dan meninjau kembali seluruh kegiatan belajar.</li>
                    </ul>
                  </div>
                </div>

                {/* 2. Materi Teori */}
                <div className="nav-guide-item item-teori">
                  <div className="nav-guide-badge">02</div>
                  <div className="nav-guide-details">
                    <div className="nav-guide-title-row">
                      <span className="nav-guide-icon">📖</span>
                      <strong>Menu Materi Teori</strong>
                    </div>
                    <ul className="nav-guide-sublist">
                      <li>Mempelajari konsep asam dan basa secara bertahap (Arrhenius, Brønsted–Lowry, Lewis).</li>
                      <li>Membaca penjelasan sifat fisis-kimia larutan dan mengamati ilustrasi submikroskopis.</li>
                      <li>Mengikuti urutan materi terstruktur dengan analogi ilmiah interaktif.</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Lab Virtual */}
                <div className="nav-guide-item item-lab">
                  <div className="nav-guide-badge">03</div>
                  <div className="nav-guide-details">
                    <div className="nav-guide-title-row">
                      <span className="nav-guide-icon">🧪</span>
                      <strong>Menu Laboratorium Virtual</strong>
                    </div>
                    <ul className="nav-guide-sublist">
                      <li>Mengikuti kegiatan eksplorasi simulasi pengujian larutan dengan indikator asam-basa.</li>
                      <li>Mengamati perubahan warna larutan pada tabung reaksi (lakmus, PP, BTB, MO, kol ungu, kunyit).</li>
                      <li>Mencatat hasil pengamatan dan menyusun jurnal percobaan untuk membuktikan hipotesis.</li>
                    </ul>
                  </div>
                </div>

                {/* 4. Skala pH & Kalkulator */}
                <div className="nav-guide-item item-skala">
                  <div className="nav-guide-badge">04</div>
                  <div className="nav-guide-details">
                    <div className="nav-guide-title-row">
                      <span className="nav-guide-icon">📊</span>
                      <strong>Menu Skala pH &amp; Kalkulator pH</strong>
                    </div>
                    <ul className="nav-guide-sublist">
                      <li>Memvisualisasikan rentang derajat keasaman pH 0–14 dan kesetimbangan autoionisasi air Kw.</li>
                      <li>Melakukan perhitungan matematis kuantitatif konsentrasi ion [H⁺] dan [OH⁻] secara transparan.</li>
                      <li>Mengamati keterkaitan antara pH, pOH, dan kekuatan elektrolit larutan.</li>
                    </ul>
                  </div>
                </div>

                {/* 5. Kuis & Evaluasi */}
                <div className="nav-guide-item item-kuis">
                  <div className="nav-guide-badge">05</div>
                  <div className="nav-guide-details">
                    <div className="nav-guide-title-row">
                      <span className="nav-guide-icon">📝</span>
                      <strong>Menu Kuis Formatif (10 Soal HOTS)</strong>
                    </div>
                    <ul className="nav-guide-sublist">
                      <li>Mengerjakan latihan soal formatif berstandar HOTS (C3–C5) untuk mengukur pemahaman konsep.</li>
                      <li>Membaca umpan balik dan pembahasan saintifik instan setelah menjawab setiap soal.</li>
                      <li>Melihat skor capaian belajar dan riwayat analisis butir soal.</li>
                    </ul>
                  </div>
                </div>

                {/* 6. Refleksi & Server */}
                <div className="nav-guide-item item-refleksi">
                  <div className="nav-guide-badge">06</div>
                  <div className="nav-guide-details">
                    <div className="nav-guide-title-row">
                      <span className="nav-guide-icon">🌱</span>
                      <strong>Menu Refleksi &amp; Portal Akun Server</strong>
                    </div>
                    <ul className="nav-guide-sublist">
                      <li>Mengisi jurnal metakognisi pembelajaran mandiri dan mencetak rangkuman lembar kerja PDF.</li>
                      <li>Masuk ke akun Siswa atau Guru untuk menautkan hasil pengujian praktikum dan evaluasi.</li>
                      <li>Mengantrekan pengiriman data ke server agar dapat ditinjau oleh guru secara resmi.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="onboarding-tip-banner">
                <span className="tip-symbol">🧭</span>
                <span>Kamu dapat menggunakan <strong>Sidebar Navigasi di sebelah kiri</strong> atau tombol <strong>Pencarian Cepat (Ctrl+K)</strong> kapan saja untuk berpindah antar halaman sesuai alur belajarmu.</span>
              </div>
            </div>
          )}

          {/* =================================================================
              TAHAP 5: MENGUJI HIPOTESIS
              ================================================================= */}
          {currentStep === 5 && (
            <div className="onboarding-step-content animate-fade-in">
              <div className="step-hero-banner sky-blue-theme">
                <div className="step-hero-icon-wrap">
                  <span className="step-big-icon">⚖️</span>
                </div>
                <div className="step-hero-text">
                  <span className="step-eyebrow">Tahap 5 Inkuiri Terbimbing</span>
                  <h2 id="onboarding-title" className="step-main-title">
                    Saatnya Membuktikan Dugaanmu!
                  </h2>
                </div>
              </div>

              <div className="onboarding-intro-box">
                <p>
                  Setelah mengenal fitur dan menu website, sekarang kamu akan melakukan kegiatan pembelajaran secara terarah untuk <strong>membuktikan kebenaran dugaan awal (hipotesis)</strong> yang telah kamu buat.
                </p>
              </div>

              <div className="investigation-flow-card">
                <div className="flow-card-header">
                  <span className="flow-header-icon">🔄</span>
                  <strong>6 Langkah Sistematis Penyelidikan Ilmiah:</strong>
                </div>

                <div className="flow-steps-timeline">
                  <div className="timeline-item">
                    <div className="timeline-badge">1</div>
                    <div className="timeline-content">
                      <strong>Pelajari Materi Asam Basa</strong>
                      <p>Pelajari konsep asam basa secara runtut mulai dari definisi Arrhenius hingga Lewis serta sifat larutan.</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-badge">2</div>
                    <div className="timeline-content">
                      <strong>Amati Informasi & Ilustrasi Saintifik</strong>
                      <p>Cermati data sifat fisis-kimia, derajat ionisasi, serta analogi submikroskopis yang disajikan.</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-badge">3</div>
                    <div className="timeline-content">
                      <strong>Lakukan Eksplorasi di Lab Virtual</strong>
                      <p>Uji berbagai larutan sampel (air lemon, cuka, sabun, amonia, dll) dengan kertas lakmus dan indikator cair.</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-badge">4</div>
                    <div className="timeline-content">
                      <strong>Catat Hasil Pengamatan & Perubahan Warna</strong>
                      <p>Simpan data pengujian pada tabel observasi praktikum dan simpan ke jurnal belajarmu.</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-badge">5</div>
                    <div className="timeline-content">
                      <strong>Bandingkan dengan Dugaan Awalmu</strong>
                      <p>Apakah hasil pengamatan eksperimen sesuai dengan hipotesis yang kamu tuliskan pada Tahap 3?</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-badge">6</div>
                    <div className="timeline-content">
                      <strong>Kerjakan Kuis Formatif</strong>
                      <p>Uji pemahamanmu melalui 10 butir soal kuis HOTS dan cermati umpan balik saintifik yang diberikan.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="onboarding-warning-banner">
                <span className="warning-symbol">⚠️</span>
                <span><strong>Catatan Penting:</strong> Ikuti seluruh kegiatan secara berurutan agar pemahaman konsepmu terbentuk secara utuh dan tidak ada tahapan penting yang terlewat.</span>
              </div>
            </div>
          )}

          {/* =================================================================
              TAHAP 6: MENARIK KESIMPULAN
              ================================================================= */}
          {currentStep === 6 && (
            <div className="onboarding-step-content animate-fade-in">
              <div className="step-hero-banner cyan-theme">
                <div className="step-hero-icon-wrap">
                  <span className="step-big-icon">🎯</span>
                </div>
                <div className="step-hero-text">
                  <span className="step-eyebrow">Tahap 6 Inkuiri Terbimbing</span>
                  <h2 id="onboarding-title" className="step-main-title">
                    Siap Memulai Pembelajaran?
                  </h2>
                </div>
              </div>

              <div className="onboarding-congratulation-box">
                <div className="congrats-icon">🎉</div>
                <div className="congrats-text">
                  <h3 className="congrats-title">Hebat! Prosedur Penggunaan Telah Selesai Dipelajari</h3>
                  <p className="congrats-desc">
                    Kamu telah mempelajari seluruh prosedur penggunaan website pembelajaran Asam Basa berbasis inkuiri terbimbing. Sekarang kamu sudah memahami tujuan pembelajaran, fungsi setiap menu, serta alur kegiatan yang harus dilakukan.
                  </p>
                </div>
              </div>

              <div className="readiness-checklist-card">
                <div className="checklist-card-title">
                  <span className="check-icon-title">☑️</span>
                  <strong>Daftar Kesiapan Belajar Siswa:</strong>
                </div>
                <div className="readiness-items-grid">
                  <div className="readiness-item checked">
                    <span className="item-check-icon">✓</span>
                    <span>Memahami tujuan pembelajaran kimia asam dan basa.</span>
                  </div>
                  <div className="readiness-item checked">
                    <span className="item-check-icon">✓</span>
                    <span>Mengetahui fungsi seluruh menu navigasi website.</span>
                  </div>
                  <div className="readiness-item checked">
                    <span className="item-check-icon">✓</span>
                    <span>Memahami urutan 6 tahapan inkuiri terbimbing.</span>
                  </div>
                  <div className="readiness-item checked">
                    <span className="item-check-icon">✓</span>
                    <span>Mengetahui cara menggunakan Lab Virtual & mengerjakan kuis.</span>
                  </div>
                  <div className="readiness-item checked">
                    <span className="item-check-icon">✓</span>
                    <span>Siap mengikuti seluruh kegiatan belajar secara aktif dan mandiri.</span>
                  </div>
                </div>
              </div>

              {/* Checkbox Wajib Sebelum Memulai */}
              <div className="agreement-wrapper">
                <label className="agreement-checkbox-label">
                  <input
                    type="checkbox"
                    className="agreement-checkbox-input"
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                  />
                  <span className="agreement-text">
                    <strong>Saya telah membaca dan memahami prosedur penggunaan website pembelajaran Asam Basa.</strong>
                  </span>
                </label>
                {!agreementChecked && (
                  <span className="agreement-hint-text">
                    * Centang kotak pernyataan di atas untuk mengaktifkan tombol Mulai Pembelajaran.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation Controls */}
        <div className="onboarding-footer">
          <div className="footer-left-info">
            <span className="footer-guide-note">
              {currentStep < 6
                ? 'Pelajari setiap tahapan dengan cermat sebelum melanjutkan.'
                : 'Konfirmasi kesiapanmu untuk masuk ke Beranda.'}
            </span>
          </div>

          <div className="footer-button-group">
            {/* Tombol Kembali */}
            <button
              type="button"
              className="btn btn-onboarding-secondary"
              onClick={handlePrev}
              disabled={currentStep === 1}
              aria-label="Kembali ke tahap sebelumnya"
            >
              <span>← Kembali</span>
            </button>

            {/* Tombol Lanjutkan / Mulai Pembelajaran */}
            {currentStep < 6 ? (
              <button
                type="button"
                className="btn btn-onboarding-primary"
                onClick={handleNext}
                aria-label="Lanjutkan ke tahap berikutnya"
              >
                <span>Lanjutkan →</span>
              </button>
            ) : (
              <button
                type="button"
                className={`btn btn-onboarding-finish ${
                  !agreementChecked ? 'disabled-finish' : 'ready-finish'
                }`}
                onClick={handleFinish}
                disabled={!agreementChecked}
                aria-label="Mulai Pembelajaran dan Masuk ke Beranda"
              >
                <span>🚀 MULAI PEMBELAJARAN</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
