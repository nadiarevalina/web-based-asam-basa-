import type { PageId } from '../types/navigation'

const CURRENT_YEAR = new Date().getFullYear()

interface FooterProps {
  onNavigateToPage: (pageId: PageId) => void
}

export function Footer({ onNavigateToPage }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer-container" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand-column">
          <button
            type="button"
            className="footer-logo btn-ghost"
            onClick={() => onNavigateToPage('beranda')}
            aria-label="Kembali ke Beranda"
          >
            <svg
              className="footer-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
              <path d="M8.5 2h7" />
            </svg>
            <span className="footer-brand-text">
              AsamBasa<span className="brand-highlight">Lab</span>
            </span>
          </button>
          <p className="footer-desc">
            Media pembelajaran sains kimia berbasis web interaktif dengan pendekatan inkuiri terbimbing
            untuk siswa SMA/MA Kelas XI.
          </p>
          <div className="footer-curriculum-badge">
            <span>Standar Capaian Pembelajaran Kimia Fase F (Kelas XI)</span>
          </div>
        </div>

        <div className="footer-nav-column">
          <h4 className="footer-col-title">Navigasi 7 Bagian Pembelajaran</h4>
          <ul className="footer-link-list">
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToPage('beranda')}
              >
                1. Beranda
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToPage('teori')}
              >
                2. Materi Teori
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToPage('lab')}
              >
                3. Lab Virtual
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToPage('skala')}
              >
                4. Skala pH
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToPage('kalkulator')}
              >
                5. Kalkulator pH
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToPage('kuis')}
              >
                6. Kuis dan Skor
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToPage('refleksi')}
              >
                7. Refleksi
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-formula-column">
          <h4 className="footer-col-title">Rumus Kunci Kimia</h4>
          <div className="footer-formula-box">
            <code>pH = -log[H⁺]</code>
            <code>pOH = -log[OH⁻]</code>
            <code>pH + pOH = 14 &nbsp; (25°C)</code>
            <code>[H⁺] = M × a &nbsp; (Asam Kuat)</code>
            <code>[OH⁻] = M × b &nbsp; (Basa Kuat)</code>
          </div>
          <p className="formula-caption">
            Suhu standar 25°C &bull; Kw = 1.0 &times; 10⁻¹⁴
          </p>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p className="footer-copyright">
          &copy; {CURRENT_YEAR} AsamBasa Lab. Dirancang untuk pendidikan kimia interaktif Indonesia.
        </p>
        <button
          type="button"
          className="btn-back-to-top"
          onClick={scrollToTop}
          title="Kembali ke atas halaman"
        >
          <span>Ke Atas</span>
          <svg
            className="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
