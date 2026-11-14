import { useState } from 'react'
import type { PageId } from '../types/navigation'

interface InquiryStageBannerProps {
  currentPage: PageId
  onNavigate?: (page: PageId) => void
}

interface StageInfo {
  number: number
  title: string
  subtitle: string
  description: string
  guidingQuestion: string
  scaffoldingTips: string[]
  pageId: PageId
}

const INQUIRY_STAGES: Record<number, StageInfo> = {
  1: {
    number: 1,
    title: 'Orientasi',
    subtitle: 'Pengamatan Fenomena Nyata',
    description: 'Mengamati peristiwa asam dan basa dalam kehidupan sehari-hari serta mengenali alur penyelidikan ilmiah.',
    guidingQuestion: 'Mengapa buah lemon terasa masam sedangkan air sabun terasa licin dan pahit? Mengapa obat maag antasida dapat meredakan rasa perih di lambung?',
    scaffoldingTips: [
      'Amati fenomena asam cuka, sabun, dan antasida pada simulasi Beranda.',
      'Kenali bahwa bahan di sekitar kita memiliki derajat keasaman yang berbeda-beda.',
      'Lanjutkan ke materi Teori untuk merumuskan masalah ilmiah seputar konsep asam-basa.',
    ],
    pageId: 'beranda',
  },
  2: {
    number: 2,
    title: 'Merumuskan Masalah',
    subtitle: 'Identifikasi Pertanyaan Kunci',
    description: 'Mengidentifikasi pertanyaan ilmiah mengenai definisi asam-basa, spesi ion pembawa sifat, dan respon indikator.',
    guidingQuestion: 'Gas amonia (NH₃) tidak memiliki ion OH⁻, tetapi mengapa dapat membirukan kertas lakmus merah? Teori asam-basa manakah yang dapat menjelaskannya?',
    scaffoldingTips: [
      'Bandingkan teori Arrhenius, Brønsted–Lowry, dan Lewis pada tab materi.',
      'Identifikasi pasangan asam-basa konjugasi melalui serah terima proton H⁺.',
      'Coba jawab pertanyaan pemantik interaktif untuk menguji pemahaman awalmu.',
    ],
    pageId: 'teori',
  },
  3: {
    number: 3,
    title: 'Merumuskan Hipotesis',
    subtitle: 'Dugaan Ilmiah Sementara',
    description: 'Menyusun dugaan sementara mengenai sifat sampel larutan dan perkiraan perubahan warna indikator sebelum pengujian.',
    guidingQuestion: 'Sebelum menguji asam cuka dapur atau air sabun, apakah dugaanmu mengenai sifat larutan dan perubahan warna indikator lakmus/BTB/PP?',
    scaffoldingTips: [
      'Pilih sampel larutan pada panel Lab Virtual.',
      'Kunci hipotesis sifat larutan (Asam Kuat/Lemah, Netral, Basa Kuat/Lemah) sebelum meneteskan indikator.',
      'Dugaan awal yang keliru adalah hal wajar dalam sains—data eksperimen yang akan membuktikannya!',
    ],
    pageId: 'lab',
  },
  4: {
    number: 4,
    title: 'Mengumpulkan Data',
    subtitle: 'Eksperimen Laboratorium Virtual',
    description: 'Meneteskan indikator cairan atau mencelupkan kertas lakmus ke dalam tabung reaksi untuk mengamati data perubahan warna teramati.',
    guidingQuestion: 'Bagaimana respons warna lakmus merah, lakmus biru, PP, atau indikator alami kunyit ketika bereaksi dengan ion H⁺ atau OH⁻ dalam sampel?',
    scaffoldingTips: [
      'Tekan tombol "Teteskan Indikator" atau "Celupkan Kertas Uji" pada workbench.',
      'Perhatikan transformasi warna cairan dan kertas uji secara cermat.',
      'Catat hasil pengamatan berupa warna teramati, perkiraan pH, dan spesi ion dominan ke Buku Jurnal.',
    ],
    pageId: 'lab',
  },
  5: {
    number: 5,
    title: 'Menganalisis Data',
    subtitle: 'Komparasi Hipotesis & Skala pH',
    description: 'Membandingkan data hasil eksperimen dengan hipotesis awal, menganalisis spektrum pH 0–14, dan menghitung konsentrasi ion.',
    guidingQuestion: 'Apakah data pengamatan mendukung atau menolak hipotesis awalmu? Bagaimana hubungan antara nilai pH dengan konsentrasi ion [H⁺] dan [OH⁻]?',
    scaffoldingTips: [
      'Periksa kotak evaluasi hipotesis di Lab Virtual: apakah dugaanmu terbukti atau perlu refleksi konsep?',
      'Buka menu Skala pH untuk melihat letak sampel yang telah kamu uji pada rentang 0–14.',
      'Gunakan Kalkulator pH untuk menganalisis hubungan matematis pH = -log[H⁺] pada larutan kuat.',
    ],
    pageId: 'skala',
  },
  6: {
    number: 6,
    title: 'Menarik Kesimpulan',
    subtitle: 'Perumusan Konsep Ilmiah',
    description: 'Merumuskan kesimpulan ilmiah mengenai sifat zat, teori asam-basa yang sesuai, dan mekanisme perubahan warna indikator.',
    guidingQuestion: 'Berdasarkan seluruh data eksperimen, apa ciri mendasar larutan asam dan basa? Bagaimana cara kerja indikator dalam membedakannya?',
    scaffoldingTips: [
      'Tuliskan kesimpulan mandiri pada setiap sesi pengujian Lab Virtual.',
      'Gunakan data empiris (warna indikator dan pH) sebagai bukti pendukung kesimpulanmu.',
      'Tuangkan kesimpulan komprehensif pada Jurnal Refleksi di akhir pembelajaran.',
    ],
    pageId: 'refleksi',
  },
  7: {
    number: 7,
    title: 'Refleksi & Evaluasi',
    subtitle: 'Evaluasi Hipotesis & Kuis Formatif',
    description: 'Mengevaluasi pemahaman konsep melalui kuis penalaran HOTS dan menuliskan jurnal metakognisi terhadap hipotesis awal.',
    guidingQuestion: 'Sejauh mana pemahamanmu terhadap konsep asam-basa telah berkembang? Miskonsepsi apa yang berhasil kamu perbaiki selama inkuiri?',
    scaffoldingTips: [
      'Kerjakan 10 soal kuis formatif HOTS untuk menguji penalaran aplikasi konsep C3–C5.',
      'Pelajari pembahasan mendalam pada setiap nomor soal kuis.',
      'Isi lembar Jurnal Refleksi, evaluasi hipotesis awalmu, dan simpan/cetak sebagai portofolio belajar.',
    ],
    pageId: 'kuis',
  },
}

function getActiveStageForPage(page: PageId): number {
  switch (page) {
    case 'beranda':
      return 1
    case 'teori':
      return 2
    case 'lab':
      return 4 // Lab mencakup tahap 3 (Hipotesis), 4 (Kumpul Data), dan 5 (Analisis)
    case 'skala':
    case 'kalkulator':
      return 5
    case 'kuis':
      return 7
    case 'refleksi':
      return 6
    case 'login':
    default:
      return 7
  }
}

export function InquiryStageBanner({ currentPage, onNavigate }: InquiryStageBannerProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const currentStageNum = getActiveStageForPage(currentPage)
  const currentStage = INQUIRY_STAGES[currentStageNum] || INQUIRY_STAGES[1]

  return (
    <div className="inquiry-stage-banner-wrapper" aria-label="Penunjuk Tahapan Inkuiri Terbimbing">
      {/* 7-Step Progress Stepper Bar */}
      <div className="inquiry-stepper-container">
        <div className="stepper-header-row">
          <div className="stepper-title-badge">
            <span className="stepper-badge-icon">🔬</span>
            <span className="stepper-badge-text">Alur Inkuiri Terbimbing</span>
            <span className="stepper-step-active-tag">
              Tahap {currentStage.number} dari 7: {currentStage.title}
            </span>
          </div>

          <button
            type="button"
            className="btn-toggle-scaffolding"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Sembunyikan petunjuk inkuiri' : 'Tampilkan petunjuk inkuiri'}
          >
            <span>{isExpanded ? 'Tutup Panduan' : 'Buka Panduan & Pemantik'}</span>
            <svg
              className={`toggle-arrow-svg ${isExpanded ? 'rotated' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* 7 Circles Stepper */}
        <nav className="inquiry-steps-list" aria-label="Daftar 7 Tahapan Inkuiri">
          {Object.values(INQUIRY_STAGES).map((stg) => {
            const isActive = stg.number === currentStageNum
            const isCompleted = stg.number < currentStageNum
            return (
              <button
                key={stg.number}
                type="button"
                className={`inquiry-step-node ${isActive ? 'step-active' : ''} ${
                  isCompleted ? 'step-completed' : ''
                }`}
                onClick={() => onNavigate && onNavigate(stg.pageId)}
                title={`Tahap ${stg.number}: ${stg.title} (${stg.subtitle})`}
              >
                <span className="step-node-bubble">
                  {isCompleted ? '✓' : stg.number}
                </span>
                <span className="step-node-label">{stg.title}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Expandable Scaffolding & Guiding Question Box */}
      {isExpanded && (
        <div className="inquiry-scaffolding-box animate-fade-in">
          <div className="scaffolding-grid">
            {/* Left: Stage Focus & Context */}
            <div className="scaffolding-left">
              <div className="stage-meta-row">
                <span className="scaffolding-tag">Fokus Tahap {currentStage.number}</span>
                <h4 className="scaffolding-stage-title">{currentStage.subtitle}</h4>
              </div>
              <p className="scaffolding-desc">{currentStage.description}</p>

              {/* Guiding Question / Pertanyaan Pemantik */}
              <div className="guiding-question-card">
                <div className="guiding-q-header">
                  <span className="guiding-q-icon">❓</span>
                  <strong className="guiding-q-title">Pertanyaan Pemantik:</strong>
                </div>
                <p className="guiding-q-text">{currentStage.guidingQuestion}</p>
              </div>
            </div>

            {/* Right: Step-by-Step Scaffolding Tips */}
            <div className="scaffolding-right">
              <span className="scaffolding-tips-header">
                💡 Petunjuk Terbimbing (Scaffolding):
              </span>
              <ul className="scaffolding-tips-list">
                {currentStage.scaffoldingTips.map((tip, idx) => (
                  <li key={idx} className="scaffolding-tip-item">
                    <span className="tip-bullet-num">{idx + 1}</span>
                    <span className="tip-text">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

