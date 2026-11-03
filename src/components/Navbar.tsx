import { useState } from 'react'
import type { PageId } from '../types/navigation'
import { MAIN_NAV_ITEMS } from '../types/navigation'

interface NavbarProps {
  onOpenSearch: () => void
  activePage: PageId
  onNavigatePage: (page: PageId) => void
}

export function Navbar({ onOpenSearch, activePage, onNavigatePage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (pageId: PageId) => {
    setMobileMenuOpen(false)
    onNavigatePage(pageId)
  }

  return (
    <header className="navbar-container" role="banner">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <button
          type="button"
          className="brand-logo"
          onClick={() => handleNavClick('beranda')}
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

        {/* Desktop Navigation — 7 Menu Utama */}
        <nav className="desktop-nav" aria-label="Navigasi Utama">
          <ul className="nav-list">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Actions (Pencarian + Tombol Mobile Menu) */}
        <div className="navbar-actions">
          <button
            type="button"
            className="search-trigger-btn"
            onClick={onOpenSearch}
            title="Cari topik pembelajaran (Ctrl+K)"
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
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
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
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menu Navigasi Mobile">
          <ul className="mobile-nav-list">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`mobile-nav-link ${
                      isActive ? 'mobile-nav-link-active' : ''
                    }`}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                    {item.shortDescription && (
                      <span className="mobile-nav-desc">{item.shortDescription}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}
