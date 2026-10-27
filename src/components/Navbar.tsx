import { useState } from 'react'

interface NavbarProps {
  onOpenSearch: () => void
  activeSection: string
}

export function Navbar({ onOpenSearch, activeSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { id: 'hero', label: 'Beranda' },
    { id: 'teori-section', label: 'Materi Teori' },
    { id: 'lab-section', label: 'Lab Virtual' },
    { id: 'skala-section', label: 'Skala pH' },
    { id: 'kalkulator-section', label: 'Kalkulator pH' },
    { id: 'kuis-section', label: 'Kuis & Skor' },
    { id: 'refleksi-section', label: 'Refleksi' },
  ]

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="navbar-container" role="banner">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <button
          type="button"
          className="brand-logo"
          onClick={() => handleNavClick('hero')}
          aria-label="Kembali ke Beranda AsamBasa Lab"
        >
          <div className="brand-icon-wrapper">
            <svg
              className="brand-svg"
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
              <path d="M7 16h10" />
            </svg>
            <span className="brand-dot-pulse" />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">
              AsamBasa<span className="brand-highlight">Lab</span>
            </span>
            <span className="brand-subtitle">Kimia SMA Kelas XI</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Navigasi Utama">
          <ul className="nav-list">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    onClick={() => handleNavClick(link.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Actions (Search + Mobile Toggle) */}
        <div className="navbar-actions">
          <button
            type="button"
            className="search-trigger-btn"
            onClick={onOpenSearch}
            title="Cari materi asam-basa (Ctrl+K)"
            aria-label="Buka pencarian materi"
          >
            <svg
              className="action-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="search-text-desktop">Cari Topik...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="action-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  className={`mobile-nav-link ${
                    activeSection === link.id ? 'mobile-nav-link-active' : ''
                  }`}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
