import type { PageId } from '../types/navigation'
import { PAGE_METADATA } from '../types/navigation'

interface BreadcrumbProps {
  currentPage: PageId
  onNavigate: (page: PageId) => void
}

export function Breadcrumb({ currentPage, onNavigate }: BreadcrumbProps) {
  if (currentPage === 'beranda') return null

  const currentMeta = PAGE_METADATA[currentPage]

  return (
    <nav className="page-breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() => onNavigate('beranda')}
          >
            <svg
              className="breadcrumb-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Beranda</span>
          </button>
        </li>
        <li className="breadcrumb-separator" aria-hidden="true">
          /
        </li>
        <li className="breadcrumb-item breadcrumb-current" aria-current="page">
          <span className="breadcrumb-badge">{currentMeta.number}.</span>
          <span className="breadcrumb-text">{currentMeta.label}</span>
        </li>
      </ol>
    </nav>
  )
}

