import { useState, useEffect } from 'react'
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
import { Footer } from './components/Footer'
import './App.css'

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  // Scroll smoothly to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
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

  // Section observer to update active navbar state
  useEffect(() => {
    const sectionIds = [
      'hero',
      'teori-section',
      'lab-section',
      'skala-section',
      'kalkulator-section',
      'kuis-section',
      'refleksi-section',
    ]

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-container">
      {/* Sticky Header Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Learning Sections */}
      <main id="main-content" className="main-content" role="main">
        {/* Hero Section */}
        <HeroSection
          onStartLearning={() => scrollToSection('teori-section')}
          onOpenLab={() => scrollToSection('lab-section')}
          onOpenCalculator={() => scrollToSection('kalkulator-section')}
        />

        {/* 3 Core Topic Cards */}
        <TopicCards onSelectModule={scrollToSection} />

        <div className="section-divider-line" />

        {/* Modul 1: Materi Teori Asam Basa */}
        <TheorySection />

        <div className="section-divider-line" />

        {/* Modul 2: Lab Virtual Indikator */}
        <VirtualLab />

        <div className="section-divider-line" />

        {/* Skala pH Interaktif (Visualisasi 0-14 & Kw) */}
        <PhScaleSection />

        <div className="section-divider-line" />

        {/* Modul 3: Kalkulator pH Kuat Monovalen */}
        <PhCalculator />

        <div className="section-divider-line" />

        {/* Evaluasi Formatif: Kuis dengan Skor & Pembahasan */}
        <QuizSection />

        <div className="section-divider-line" />

        {/* Refleksi Pembelajaran Mandiri & Cetak PDF */}
        <ReflectionSection />
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToSection={scrollToSection}
      />

      {/* Footer */}
      <Footer onNavigateToSection={scrollToSection} />
    </div>
  )
}
