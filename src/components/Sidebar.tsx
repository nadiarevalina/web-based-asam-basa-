import { useState, useEffect } from 'react'
import type { PageId } from '../types/navigation'
import { getCurrentUser } from '../services/authStorage'
import type { UserAccount } from '../types/auth'

export interface SidebarProps {
  activePage: PageId
  onNavigatePage: (page: PageId) => void
  onOpenSearch: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

interface NavMenuItem {
  id: PageId
  label: string
  shortDesc: string
  badge?: string
  icon: (active: boolean) => React.ReactNode
}

export function Sidebar({
  activePage,
  onNavigatePage,
  onOpenSearch,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser())

  // Refresh user state when window gains focus, storage changes, or auth changed
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleStorageChange)
    window.addEventListener('asambasa:auth_changed', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleStorageChange)
      window.removeEventListener('asambasa:auth_changed', handleStorageChange)
    }
  }, [])

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        onToggleCollapse()
      }
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onToggleCollapse, mobileDrawerOpen])

  const handleItemClick = (pageId: PageId) => {
    onNavigatePage(pageId)
    setMobileDrawerOpen(false)
  }

  // 7 Menu Utama Pembelajaran
  const coreMenuItems: NavMenuItem[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      shortDesc: 'Awal Pembelajaran & Peta Modul',
      icon: (active) => (
        <svg
          className="sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? '2.5' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'teori',
      label: 'Materi Teori',
      shortDesc: '3 Teori Asam Basa & Sifat Larutan',
      badge: '01',
      icon: (active) => (
        <svg
          className="sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? '2.5' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      id: 'lab',
      label: 'Lab Virtual',
      shortDesc: 'Eksperimen Inkuiri Indikator',
      badge: '02',
      icon: (active) => (
        <svg
          className="sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? '2.5' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </svg>
      ),
    },
    {
      id: 'skala',
      label: 'Skala pH',
      shortDesc: 'Spektrum Derajat Keasaman 0–14',
      badge: '03',
      icon: (active) => (
        <svg
          className="sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? '2.5' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      id: 'kalkulator',
      label: 'Kalkulator pH',
      shortDesc: 'Perhitungan pH Kuantitatif',
      badge: '04',
      icon: (active) => (
        <svg
          className="sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? '2.5' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="16" y1="14" x2="16" y2="18" />
          <path d="M16 10h.01" />
          <path d="M12 10h.01" />
          <path d="M8 10h.01" />
          <path d="M12 14h.01" />
          <path d="M8 14h.01" />
          <path d="M12 18h.01" />
          <path d="M8 18h.01" />
        </svg>
      ),
    },
    {
      id: 'kuis',
      label: 'Kuis dan Skor',
      shortDesc: 'Evaluasi Formatif 10 Soal HOTS',
      badge: '05',
      icon: (active) => (
        <svg
          className="sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? '2.5' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'refleksi',
      label: 'Refleksi',
      shortDesc: 'Jurnal Metakognisi & PDF',
      badge: '06',
      icon: (active) => (
        <svg
          className="sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? '2.5' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="14" y2="13" />
        </svg>
      ),
    },
  ]

  return (
    <>
      {/* ── Mobile Top Bar (Hanya tampil pada viewport < 768px) ── */}
      <header className="mobile-top-header" role="banner">
        <div className="mobile-header-inner">
          <button
            type="button"
            className="mobile-menu-toggle-btn mobile-hamburger-btn"
            onClick={() => setMobileDrawerOpen((prev) => !prev)}
            aria-label={mobileDrawerOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
            aria-expanded={mobileDrawerOpen}
            aria-controls="app-sidebar"
          >
            <svg
              className="mobile-header-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <button
            type="button"
            className="mobile-brand-btn btn-ghost"
            onClick={() => onNavigatePage('beranda')}
            aria-label="Ke Beranda AsamBasa Lab"
          >
            <div className="brand-icon-wrapper-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="brand-svg-sm"
              >
                <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                <path d="M8.5 2h7" />
                <path d="M7 16h10" />
              </svg>
            </div>
            <span className="mobile-brand-title">
              AsamBasa<span className="brand-highlight">Lab</span>
            </span>
          </button>

          <div className="mobile-header-actions">
            <button
              type="button"
              className="mobile-action-icon-btn"
              onClick={onOpenSearch}
              title="Cari materi pembelajaran (Ctrl+K)"
              aria-label="Buka pencarian"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              className="mobile-action-icon-btn mobile-user-btn"
              onClick={() => onNavigatePage('login')}
              title={
                currentUser
                  ? `Akun: ${currentUser.fullName} (${currentUser.role})`
                  : 'Masuk ke Portal Akun'
              }
              aria-label="Buka Portal Akun"
            >
              {currentUser ? (
                <span
                  className="mobile-avatar-badge"
                  style={{ backgroundColor: currentUser.avatarColor || '#2563eb' }}
                >
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Backdrop Overlay (Hanya aktif saat drawer terbuka) ── */}
      {mobileDrawerOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Navigasi Utama (Desktop & Mobile Drawer) ── */}
      <aside
        id="app-sidebar"
        className={`app-sidebar ${isCollapsed ? 'collapsed' : 'expanded'} ${
          mobileDrawerOpen ? 'mobile-open' : ''
        }`}
        role="navigation"
        aria-label="Navigasi Utama AsamBasa Lab"
      >
        {/* Header Sidebar: Brand + Close/Toggle Buttons */}
        <div className="sidebar-header">
          <button
            type="button"
            className="sidebar-brand-btn"
            onClick={() => handleItemClick('beranda')}
            aria-label="AsamBasa Lab - Ke Beranda"
            title="AsamBasa Lab - Interactive Chemistry Learning"
          >
            <div className="sidebar-brand-icon-wrapper">
              <svg
                className="sidebar-brand-svg"
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
              <span className="brand-dot-pulse" aria-hidden="true" />
            </div>

            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-title">
                  AsamBasa<span className="brand-highlight">Lab</span>
                </span>
                <span className="sidebar-brand-subtitle">
                  Interactive Chemistry Learning
                </span>
              </div>
            )}
          </button>

          {/* Tombol Close Mobile (Hanya di layar kecil) */}
          <button
            type="button"
            className="sidebar-mobile-close-btn"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Tutup Menu Navigasi"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Tombol Toggle Collapse Desktop */}
          <button
            type="button"
            className="sidebar-desktop-toggle-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            title={isCollapsed ? 'Perluas Sidebar (Ctrl+B)' : 'Ciutkan Sidebar (Ctrl+B)'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`toggle-chevron-svg ${isCollapsed ? 'is-collapsed' : ''}`}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Search Bar / Trigger Button */}
        <div className="sidebar-search-container">
          <button
            type="button"
            className={`sidebar-search-btn ${isCollapsed ? 'collapsed' : ''}`}
            onClick={onOpenSearch}
            title="Cari Topik Pembelajaran (Ctrl+K)"
            aria-label="Cari Topik Pembelajaran"
          >
            <svg
              className="sidebar-search-icon"
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
            {!isCollapsed && (
              <>
                <span className="sidebar-search-text">Cari Topik...</span>
                <kbd className="sidebar-search-kbd">⌘K</kbd>
              </>
            )}
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="sidebar-scrollable-content">
          {/* Group 1: Modul Belajar */}
          <div className="sidebar-menu-group">
            {!isCollapsed && (
              <span className="sidebar-group-label">Navigasi Belajar</span>
            )}
            <ul className="sidebar-nav-list" role="list">
              {coreMenuItems.map((item) => {
                const isActive = activePage === item.id
                return (
                  <li key={item.id} className="sidebar-nav-item-wrap">
                    <button
                      type="button"
                      className={`sidebar-nav-item ${isActive ? 'active' : ''} ${
                        isCollapsed ? 'collapsed' : ''
                      }`}
                      onClick={() => handleItemClick(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      title={isCollapsed ? `${item.label} — ${item.shortDesc}` : undefined}
                    >
                      <span className="sidebar-item-icon-wrap">
                        {item.icon(isActive)}
                      </span>
                      {!isCollapsed && (
                        <span className="sidebar-item-text-group">
                          <span className="sidebar-item-label">{item.label}</span>
                          <span className="sidebar-item-desc">{item.shortDesc}</span>
                        </span>
                      )}
                      {isActive && <span className="sidebar-active-indicator" aria-hidden="true" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Group 2: Khusus Guru (Jika User memiliki peran Guru) */}
          {currentUser?.role === 'guru' && (
            <div className="sidebar-menu-group group-teacher">
              {!isCollapsed && (
                <span className="sidebar-group-label teacher-label">Akses Guru</span>
              )}
              <ul className="sidebar-nav-list" role="list">
                <li className="sidebar-nav-item-wrap">
                  <button
                    type="button"
                    className={`sidebar-nav-item teacher-nav-item ${
                      activePage === 'guru' ? 'active' : ''
                    } ${isCollapsed ? 'collapsed' : ''}`}
                    onClick={() => handleItemClick('guru')}
                    aria-current={activePage === 'guru' ? 'page' : undefined}
                    title={isCollapsed ? 'Panel Guru — Monitoring Hasil Belajar Siswa' : undefined}
                  >
                    <span className="sidebar-item-icon-wrap">
                      <svg
                        className="sidebar-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={activePage === 'guru' ? '2.5' : '2'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </span>
                    {!isCollapsed && (
                      <span className="sidebar-item-text-group">
                        <span className="sidebar-item-label">
                          Panel Guru{' '}
                          <span className="sidebar-teacher-badge">Resmi</span>
                        </span>
                        <span className="sidebar-item-desc">
                          Rekap Hasil &amp; Analisis Siswa
                        </span>
                      </span>
                    )}
                    {activePage === 'guru' && (
                      <span className="sidebar-active-indicator teacher-indicator" aria-hidden="true" />
                    )}
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Group 3: Akun & Server Sync */}
          <div className="sidebar-menu-group group-auth">
            {!isCollapsed && (
              <span className="sidebar-group-label">Sistem &amp; Server</span>
            )}
            <ul className="sidebar-nav-list" role="list">
              <li className="sidebar-nav-item-wrap">
                <button
                  type="button"
                  className={`sidebar-nav-item ${
                    activePage === 'login' ? 'active' : ''
                  } ${isCollapsed ? 'collapsed' : ''}`}
                  onClick={() => handleItemClick('login')}
                  aria-current={activePage === 'login' ? 'page' : undefined}
                  title={
                    isCollapsed
                      ? 'Portal Akun & Server — Tautkan Hasil & Kirim Antrean'
                      : undefined
                  }
                >
                  <span className="sidebar-item-icon-wrap">
                    <svg
                      className="sidebar-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={activePage === 'login' ? '2.5' : '2'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="7" r="4" />
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    </svg>
                  </span>
                  {!isCollapsed && (
                    <span className="sidebar-item-text-group">
                      <span className="sidebar-item-label">Portal Akun &amp; Server</span>
                      <span className="sidebar-item-desc">
                        {currentUser ? `${currentUser.fullName}` : 'Masuk / Daftar Akun'}
                      </span>
                    </span>
                  )}
                  {activePage === 'login' && (
                    <span className="sidebar-active-indicator" aria-hidden="true" />
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Footer: User Profile Card & Quick Actions */}
        <div className={`sidebar-footer ${isCollapsed ? 'collapsed' : ''}`}>
          {currentUser ? (
            <div
              className={`sidebar-user-card ${isCollapsed ? 'collapsed' : ''}`}
              onClick={() => handleItemClick('login')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleItemClick('login')
                }
              }}
              title={`Akun: ${currentUser.fullName} (${currentUser.role === 'guru' ? 'Guru' : 'Siswa'}) — Klik untuk buka portal`}
              aria-label={`Akun ${currentUser.fullName}`}
            >
              <div
                className="sidebar-user-avatar"
                style={{ backgroundColor: currentUser.avatarColor || '#2563eb' }}
              >
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="sidebar-user-meta">
                  <span className="sidebar-user-name" title={currentUser.fullName}>
                    {currentUser.fullName}
                  </span>
                  <div className="sidebar-user-sub-row">
                    <span className={`sidebar-role-tag ${currentUser.role}`}>
                      {currentUser.role === 'guru' ? '👩‍🏫 Guru' : '👨‍🎓 Siswa'}
                    </span>
                    <span className="sidebar-id-tag">
                      {currentUser.identifierNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className={`sidebar-login-prompt-btn ${isCollapsed ? 'collapsed' : ''}`}
              onClick={() => handleItemClick('login')}
              title="Masuk ke Akun Pembelajaran"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sidebar-icon"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              </svg>
              {!isCollapsed && <span>Masuk ke Akun</span>}
            </button>
          )}

          {/* Quick Collapse / Expand control in footer */}
          <div className="sidebar-footer-controls">
            <button
              type="button"
              className="sidebar-footer-toggle-btn"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
              title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`footer-chevron-svg ${isCollapsed ? 'is-collapsed' : ''}`}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {!isCollapsed && (
                <span className="footer-toggle-text">Ciutkan Sidebar</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
