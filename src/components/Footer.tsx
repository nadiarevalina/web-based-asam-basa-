const CURRENT_YEAR = new Date().getFullYear()

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void
}

export function Footer({ onNavigateToSection }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer-container" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand-column">
          <div className="footer-logo">
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
          </div>
          <p className="footer-desc">
            Media pembelajaran sains kimia berbasis web interaktif dengan pendekatan inkuiri terbimbing
            untuk siswa SMA/MA Kelas XI.
          </p>
          <div className="footer-curriculum-badge">
            <span>Standar Capaian Pembelajaran Kimia Fase F (Kelas XI)</span>
          </div>
        </div>

        <div className="footer-nav-column">
          <h4 className="footer-col-title">Navigasi Modul</h4>
          <ul className="footer-link-list">
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToSection('teori-section')}
              >
                Modul 1: Teori Asam &amp; Basa
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToSection('lab-section')}
              >
                Modul 2: Lab Virtual Indikator
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToSection('skala-section')}
              >
                Visualisasi Skala pH 0–14
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToSection('kalkulator-section')}
              >
                Modul 3: Kalkulator pH Monovalen
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToSection('kuis-section')}
              >
                Kuis &amp; Evaluasi Formatif
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateToSection('refleksi-section')}
              >
                Lembar Refleksi Pembelajaran
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
            Suhu standar 25°C • Kw = 1.0 × 10⁻¹⁴
          </p>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p className="footer-copyright">
          © {CURRENT_YEAR} AsamBasa Lab. Dirancang untuk pendidikan kimia interaktif Indonesia.
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
