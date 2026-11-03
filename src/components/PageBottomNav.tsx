import type { PageId } from '../types/navigation'
import { getAdjacentPages, PAGE_METADATA } from '../types/navigation'

interface PageBottomNavProps {
  currentPage: PageId
  onNavigate: (page: PageId) => void
}

export function PageBottomNav({ currentPage, onNavigate }: PageBottomNavProps) {
  const { prev, next } = getAdjacentPages(currentPage)
  const currentMeta = PAGE_METADATA[currentPage]

  return (
    <nav className="page-bottom-nav-container" aria-label="Navigasi Halaman Pembelajaran">
      <div className="page-bottom-nav-card">
        <div className="page-bottom-nav-info">
          <span className="bottom-nav-current-badge">
            Bagian {currentMeta.number} dari 7: {currentMeta.label}
          </span>
          <span className="bottom-nav-sub">Gunakan navigasi cepat untuk berpindah materi</span>
        </div>

        <div className="page-bottom-nav-actions">
          {prev && (
            <button
              type="button"
              className="bottom-nav-btn bottom-nav-prev"
              onClick={() => onNavigate(prev.id)}
              aria-label={`Kembali ke ${prev.label}`}
            >
              <svg
                className="bottom-nav-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <div className="bottom-nav-btn-text">
                <span className="btn-dir-label">Sebelumnya</span>
                <span className="btn-target-title">{prev.label}</span>
              </div>
            </button>
          )}

          {next && (
            <button
              type="button"
              className="bottom-nav-btn bottom-nav-next"
              onClick={() => onNavigate(next.id)}
              aria-label={`Lanjut ke ${next.label}`}
            >
              <div className="bottom-nav-btn-text">
                <span className="btn-dir-label">
                  {next.id === 'beranda' ? 'Selesai' : 'Selanjutnya'}
                </span>
                <span className="btn-target-title">{next.label}</span>
              </div>
              <svg
                className="bottom-nav-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

