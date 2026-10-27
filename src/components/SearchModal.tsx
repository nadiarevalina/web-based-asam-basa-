import { useState, useEffect } from 'react'

interface SearchItem {
  id: string
  title: string
  sectionId: string
  category: string
  description: string
  keywords: string[]
}

const SEARCH_DATABASE: SearchItem[] = [
  {
    id: 's-arrhenius',
    title: 'Teori Asam Basa Arrhenius',
    sectionId: 'teori-section',
    category: 'Materi Teori',
    description: 'Konsep pelepasan ion H⁺ dan OH⁻ dalam pelarut air (1884).',
    keywords: ['arrhenius', 'teori', 'ion', 'h+', 'oh-', 'air', 'pelarut'],
  },
  {
    id: 's-bronsted',
    title: 'Teori Brønsted–Lowry & Asam-Basa Konjugasi',
    sectionId: 'teori-section',
    category: 'Materi Teori',
    description: 'Donor dan akseptor proton (H⁺) serta pasangan konjugasi.',
    keywords: ['bronsted', 'lowry', 'proton', 'donor', 'akseptor', 'konjugasi'],
  },
  {
    id: 's-lewis',
    title: 'Teori Asam Basa Lewis',
    sectionId: 'teori-section',
    category: 'Materi Teori',
    description: 'Serah terima pasangan elektron bebas (PEB) & ikatan kovalen koordinasi.',
    keywords: ['lewis', 'elektron', 'peb', 'koordinasi', 'bf3', 'nh3'],
  },
  {
    id: 's-sifat',
    title: 'Sifat Fisis & Kimia Larutan Asam Basa',
    sectionId: 'teori-section',
    category: 'Materi Teori',
    description: 'Rasa, daya hantar elektrolit, reaksi dengan seng & karbonat.',
    keywords: ['sifat', 'fisis', 'kimia', 'elektrolit', 'korosif', 'licin', 'kaustik', 'karbonat'],
  },
  {
    id: 's-kehidupan',
    title: 'Asam & Basa dalam Kehidupan Sehari-hari',
    sectionId: 'teori-section',
    category: 'Materi Teori',
    description: 'Asam lambung HCl, cuka asetat, vitamin C, soda kue, dan antasida maag.',
    keywords: ['sehari-hari', 'lambung', 'hcl', 'cuka', 'asetat', 'lemon', 'sitrat', 'sabun', 'maag', 'antasida'],
  },
  {
    id: 's-netralisasi',
    title: 'Reaksi Netralisasi & Titrasi',
    sectionId: 'teori-section',
    category: 'Materi Teori',
    description: 'Asam + Basa → Garam + Air dan aplikasi pengapuran tanah masam.',
    keywords: ['netralisasi', 'titrasi', 'garam', 'air', 'pengapuran', 'sengatan'],
  },
  {
    id: 's-lab-lakmus',
    title: 'Pengujian Kertas Lakmus Merah & Biru',
    sectionId: 'lab-section',
    category: 'Lab Virtual',
    description: 'Identifikasi sifat asam (memerahkan) dan basa (membirukan).',
    keywords: ['lakmus', 'kertas', 'merah', 'biru', 'indikator', 'lab'],
  },
  {
    id: 's-lab-pp',
    title: 'Indikator Fenolftalein (PP)',
    sectionId: 'lab-section',
    category: 'Lab Virtual',
    description: 'Trayek pH 8.3–10.0: bening di asam/netral, merah muda di basa.',
    keywords: ['fenolftalein', 'pp', 'trayek', 'merah muda', 'magenta', 'titrasi'],
  },
  {
    id: 's-lab-btb',
    title: 'Indikator Bromtimol Biru (BTB)',
    sectionId: 'lab-section',
    category: 'Lab Virtual',
    description: 'Trayek pH 6.0–7.6: kuning di asam, hijau di netral, biru di basa.',
    keywords: ['btb', 'bromtimol', 'kuning', 'hijau', 'biru'],
  },
  {
    id: 's-lab-mo',
    title: 'Indikator Metil Jingga (Methyl Orange / MO)',
    sectionId: 'lab-section',
    category: 'Lab Virtual',
    description: 'Trayek pH 3.1–4.4: merah di asam kuat, kuning di netral/basa.',
    keywords: ['metil', 'jingga', 'mo', 'orange', 'trayek'],
  },
  {
    id: 's-lab-alami',
    title: 'Indikator Alami: Kol Ungu & Kunyit',
    sectionId: 'lab-section',
    category: 'Lab Virtual',
    description: 'Pigmen antosianin dan kurkumin sebagai indikator ramah lingkungan.',
    keywords: ['alami', 'kol ungu', 'kunyit', 'kurkumin', 'antosianin'],
  },
  {
    id: 's-skala-ph',
    title: 'Visualisasi Skala pH 0 – 14',
    sectionId: 'skala-section',
    category: 'Skala pH',
    description: 'Hubungan [H⁺], [OH⁻], dan tetapan air Kw = 10⁻¹⁴ pada 25°C.',
    keywords: ['skala', 'ph', 'derajat keasaman', 'kw', 'logaritma', 'h+', 'oh-'],
  },
  {
    id: 's-calc-ph',
    title: 'Kalkulator pH Asam Kuat & Basa Kuat',
    sectionId: 'kalkulator-section',
    category: 'Kalkulator pH',
    description: 'Perhitungan matematis asam monoprotik (HCl, HNO₃) dan basa kuat (NaOH, KOH).',
    keywords: ['kalkulator', 'hitung', 'molaritas', 'konsentrasi', 'asam kuat', 'basa kuat', 'poh'],
  },
  {
    id: 's-kuis',
    title: 'Kuis Evaluasi Formatif & Skor',
    sectionId: 'kuis-section',
    category: 'Evaluasi',
    description: '8 soal pilihan ganda interaktif dengan pembahasan kimia mendalam.',
    keywords: ['kuis', 'soal', 'skor', 'evaluasi', 'latihan', 'pembahasan'],
  },
  {
    id: 's-refleksi',
    title: 'Jurnal Refleksi Pembelajaran Mandiri',
    sectionId: 'refleksi-section',
    category: 'Refleksi',
    description: 'Tuliskan pemahaman, kesulitan, rencana belajar, serta cetak PDF.',
    keywords: ['refleksi', 'jurnal', 'cetak', 'pdf', 'lembar kerja', 'metakognisi'],
  },
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToSection: (sectionId: string) => void
}

export function SearchModal({
  isOpen,
  onClose,
  onNavigateToSection,
}: SearchModalProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const trimmed = query.trim().toLowerCase()
  const results =
    trimmed.length === 0
      ? SEARCH_DATABASE.slice(0, 6)
      : SEARCH_DATABASE.filter((item) => {
          return (
            item.title.toLowerCase().includes(trimmed) ||
            item.description.toLowerCase().includes(trimmed) ||
            item.category.toLowerCase().includes(trimmed) ||
            item.keywords.some((k) => k.includes(trimmed))
          )
        })

  const handleSelect = (sectionId: string) => {
    onNavigateToSection(sectionId)
    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Materi Asam Basa"
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="modal-header">
          <div className="search-input-wrapper">
            <svg
              className="search-input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              autoFocus
              className="search-field"
              placeholder="Ketik topik atau istilah kimia (misal: pH, lakmus, Lewis, antasida)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup pencarian"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="search-results-meta">
            <span>
              {trimmed.length === 0 ? 'Topik Populer' : `Ditemukan ${results.length} hasil pencarian`}
            </span>
          </div>

          <div className="search-results-list">
            {results.length > 0 ? (
              results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="search-result-item"
                  onClick={() => handleSelect(item.sectionId)}
                >
                  <div className="result-item-top">
                    <span className="result-category-badge">{item.category}</span>
                    <span className="result-arrow">Buka →</span>
                  </div>
                  <h4 className="result-title">{item.title}</h4>
                  <p className="result-desc">{item.description}</p>
                </button>
              ))
            ) : (
              <div className="search-empty-state">
                <p>Tidak menemukan topik kimia dengan kata kunci "{query}".</p>
                <span className="empty-hint">
                  Coba kata kunci lain: <em>Arrhenius, titrasi, kunyit, kalkulator, atau pH</em>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <span>Tekan <kbd>ESC</kbd> untuk menutup</span>
        </div>
      </div>
    </div>
  )
}
