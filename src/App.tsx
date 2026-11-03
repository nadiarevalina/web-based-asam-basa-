import { useState, useEffect, useCallback } from 'react'
import type { PageId } from './types/navigation'
import { normalizePageId, MAIN_NAV_ITEMS, PAGE_METADATA } from './types/navigation'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { TopicCards } from './components/TopicCards'
import { TheorySection } from './components/TheorySection'
import { VirtualLab } from './components/VirtualLab'
import { PhScaleSection } from './components/PhScaleSection'
import { PhCalculator } from './components/PhCalculator'
import { QuizSection } from './components/QuizSection'
import { ReflectionSection } from './components/ReflectionSection'
import { SearchModal } from './components/SearchModal'
import { Breadcrumb } from './components/Breadcrumb'
import { PageBottomNav } from './components/PageBottomNav'
import { Footer } from './components/Footer'
import './App.css'

function getInitialPage(): PageId {
  if (typeof window === 'undefined') return 'beranda'
  const hash = window.location.hash
  if (hash) {
    return normalizePageId(hash)
  }
  return 'beranda'
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(getInitialPage)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  // Navigasi ke halaman tertentu dan sinkronisasi ke URL hash
  const navigateToPage = useCallback((page: PageId) => {
    setActivePage(page)
    const targetHash = `#/${page}`
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Sinkronisasi tombol browser Back/Forward (popstate/hashchange)
  useEffect(() => {
    const handleHashChange = () => {
      const pageFromHash = normalizePageId(window.location.hash)
      setActivePage(pageFromHash)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Inisialisasi hash jika belum ada
    if (!window.location.hash) {
      window.location.hash = `#/beranda`
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Keyboard shortcut Ctrl+K / Cmd+K untuk membuka dialog pencarian
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="app-container">
      {/* Sticky Header Navbar — 7 Menu Utama */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activePage={activePage}
        onNavigatePage={navigateToPage}
      />

      {/* Main Learning Views — 7 Bagian Pembelajaran */}
      <main id="main-content" className="main-content" role="main">
        {/* 1. Beranda */}
        <div
          id="page-beranda"
          className={`page-view ${activePage === 'beranda' ? 'page-view-active' : 'page-view-hidden'}`}
          role="region"
          aria-label="Halaman Beranda"
          hidden={activePage !== 'beranda'}
        >
          {/* Hero Section */}
          <HeroSection
            onStartLearning={() => navigateToPage('teori')}
            onOpenLab={() => navigateToPage('lab')}
            onOpenCalculator={() => navigateToPage('kalkulator')}
          />

          {/* 3 Core Topic Cards Pengantar */}
          <TopicCards
            onSelectModule={(targetId) => navigateToPage(normalizePageId(targetId))}
          />

          {/* Hub Peta 7 Bagian Pembelajaran */}
          <section className="learning-path-hub-section" aria-labelledby="hub-heading">
            <div className="section-header-center">
              <span className="section-eyebrow">Peta Pembelajaran Komprehensif</span>
              <h2 id="hub-heading" className="section-title">
                7 Bagian Pembelajaran AsamBasa Lab
              </h2>
              <p className="section-description">
                Pelajari konsep asam basa secara runtut dan terarah melalui 7 bagian pembelajaran
                berikut. Anda dapat mengakses bagian mana pun langsung melalui menu navigasi atas.
              </p>
            </div>

            <div className="hub-grid">
              {MAIN_NAV_ITEMS.map((item) => {
                const meta = PAGE_METADATA[item.id]
                const isCurrent = activePage === item.id
                return (
                  <div key={item.id} className="hub-card">
                    <div className="hub-card-header">
                      <span className="hub-step-num">0{meta.number}</span>
                      <span className="hub-badge">{meta.badge}</span>
                    </div>
                    <h3 className="hub-title">{meta.label}</h3>
                    <p className="hub-subtitle">{meta.subtitle}</p>
                    <p className="hub-desc">{meta.shortDescription}</p>
                    <div className="hub-action-row">
                      <button
                        type="button"
                        className="btn btn-outline-cyan hub-btn"
                        onClick={() => navigateToPage(item.id)}
                        aria-label={`Buka bagian ${meta.label}`}
                      >
                        {isCurrent ? 'Sedang Dibuka' : 'Pelajari Sekarang →'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* 2. Materi Teori */}
        <div
          id="page-teori"
          className={`page-view ${activePage === 'teori' ? 'page-view-active' : 'page-view-hidden'}`}
          role="region"
          aria-label="Halaman Materi Teori"
          hidden={activePage !== 'teori'}
        >
          <Breadcrumb currentPage="teori" onNavigate={navigateToPage} />
          <TheorySection />
          <PageBottomNav currentPage="teori" onNavigate={navigateToPage} />
        </div>

        {/* 3. Lab Virtual */}
        <div
          id="page-lab"
          className={`page-view ${activePage === 'lab' ? 'page-view-active' : 'page-view-hidden'}`}
          role="region"
          aria-label="Halaman Lab Virtual"
          hidden={activePage !== 'lab'}
        >
          <Breadcrumb currentPage="lab" onNavigate={navigateToPage} />
          <VirtualLab />
          <PageBottomNav currentPage="lab" onNavigate={navigateToPage} />
        </div>

        {/* 4. Skala pH */}
        <div
          id="page-skala"
          className={`page-view ${activePage === 'skala' ? 'page-view-active' : 'page-view-hidden'}`}
          role="region"
          aria-label="Halaman Skala pH"
          hidden={activePage !== 'skala'}
        >
          <Breadcrumb currentPage="skala" onNavigate={navigateToPage} />
          <PhScaleSection />
          <PageBottomNav currentPage="skala" onNavigate={navigateToPage} />
        </div>

        {/* 5. Kalkulator pH */}
        <div
          id="page-kalkulator"
          className={`page-view ${activePage === 'kalkulator' ? 'page-view-active' : 'page-view-hidden'}`}
          role="region"
          aria-label="Halaman Kalkulator pH"
          hidden={activePage !== 'kalkulator'}
        >
          <Breadcrumb currentPage="kalkulator" onNavigate={navigateToPage} />
          <PhCalculator />
          <PageBottomNav currentPage="kalkulator" onNavigate={navigateToPage} />
        </div>

        {/* 6. Kuis dan Skor */}
        <div
          id="page-kuis"
          className={`page-view ${activePage === 'kuis' ? 'page-view-active' : 'page-view-hidden'}`}
          role="region"
          aria-label="Halaman Kuis dan Skor"
          hidden={activePage !== 'kuis'}
        >
          <Breadcrumb currentPage="kuis" onNavigate={navigateToPage} />
          <QuizSection />
          <PageBottomNav currentPage="kuis" onNavigate={navigateToPage} />
        </div>

        {/* 7. Refleksi */}
        <div
          id="page-refleksi"
          className={`page-view ${activePage === 'refleksi' ? 'page-view-active' : 'page-view-hidden'}`}
          role="region"
          aria-label="Halaman Refleksi"
          hidden={activePage !== 'refleksi'}
        >
          <Breadcrumb currentPage="refleksi" onNavigate={navigateToPage} />
          <ReflectionSection />
          <PageBottomNav currentPage="refleksi" onNavigate={navigateToPage} />
        </div>
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToPage={navigateToPage}
      />

      {/* Footer Navigasi 7 Bagian Pembelajaran */}
      <Footer onNavigateToPage={navigateToPage} />
    </div>
  )
}
