import { useState } from 'react'

interface HeroSectionProps {
  onStartLearning: () => void
  onOpenLab: () => void
  onOpenCalculator: () => void
}

export function HeroSection({
  onStartLearning,
  onOpenLab,
  onOpenCalculator,
}: HeroSectionProps) {
  const [fluidState, setFluidState] = useState<'acid' | 'neutral' | 'base'>('acid')

  const stateDetails = {
    acid: {
      label: 'Suasana Asam (pH 2.0)',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.4)',
      bubbleColor: '#fca5a5',
      sample: 'Jus Lemon / HCl Encer',
      note: 'Kaya ion H⁺ / H₃O⁺',
    },
    neutral: {
      label: 'Suasana Netral (pH 7.0)',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      bubbleColor: '#a7f3d0',
      sample: 'Air Murni (Akuades)',
      note: '[H⁺] = [OH⁻] = 10⁻⁷ M',
    },
    base: {
      label: 'Suasana Basa (pH 12.0)',
      color: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.4)',
      bubbleColor: '#ddd6fe',
      sample: 'Air Sabun / NaOH Encer',
      note: 'Kaya ion OH⁻ bebas',
    },
  }

  const current = stateDetails[fluidState]

  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-badge-wrap">
        <span className="hero-pill-badge">
          <span className="pill-dot" />
          Media Pembelajaran Kimia SMA/MA Kelas XI • Inkuiri Terbimbing
        </span>
      </div>

      <div className="hero-grid">
        {/* Left Column: Headlines & Call-to-actions */}
        <div className="hero-content">
          <h1 id="hero-title" className="hero-main-title">
            Jelajahi Dunia <span className="text-gradient-acid">Asam</span> dan{' '}
            <span className="text-gradient-base">Basa!</span>
          </h1>

          <p className="hero-lead-text">
            Pahami fenomena keasaman dan kebasaan di sekitarmu—dari rasa masam buah
            lemon, keajaiban obat maag antasida, hingga rahasia perubahan warna
            indikator laboratorium—secara visual, mendalam, dan interaktif.
          </p>

          <div className="hero-button-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onStartLearning}
              id="hero-start-btn"
            >
              <span>Mulai Belajar</span>
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
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onOpenLab}
              id="hero-lab-btn"
            >
              <svg
                className="btn-icon"
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
              <span>Lab Virtual</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={onOpenCalculator}
              id="hero-calc-btn"
            >
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" />
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
              <span>Kalkulator pH</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <span className="highlight-number">3</span>
              <span className="highlight-text">Modul Terstruktur</span>
            </div>
            <div className="highlight-divider" />
            <div className="highlight-item">
              <span className="highlight-number">15+</span>
              <span className="highlight-text">Larutan Sampel</span>
            </div>
            <div className="highlight-divider" />
            <div className="highlight-item">
              <span className="highlight-number">8</span>
              <span className="highlight-text">Indikator Kimia</span>
            </div>
            <div className="highlight-divider" />
            <div className="highlight-item">
              <span className="highlight-number">100%</span>
              <span className="highlight-text">Inkuiri Interaktif</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Science Visual */}
        <div className="hero-visual">
          <div className="flask-card">
            <div className="flask-header">
              <span className="flask-tag">Eksperimen Sentuh Cepat</span>
              <div className="flask-switch-buttons">
                <button
                  type="button"
                  className={`switch-chip ${fluidState === 'acid' ? 'active-acid' : ''}`}
                  onClick={() => setFluidState('acid')}
                >
                  Asam
                </button>
                <button
                  type="button"
                  className={`switch-chip ${fluidState === 'neutral' ? 'active-neutral' : ''}`}
                  onClick={() => setFluidState('neutral')}
                >
                  Netral
                </button>
                <button
                  type="button"
                  className={`switch-chip ${fluidState === 'base' ? 'active-base' : ''}`}
                  onClick={() => setFluidState('base')}
                >
                  Basa
                </button>
              </div>
            </div>

            {/* Simulated Animated Chemical Flask */}
            <div className="flask-graphic-wrapper">
              <div
                className="flask-ambient-glow"
                style={{ background: current.glow }}
              />

              <svg
                className="flask-svg"
                viewBox="0 0 200 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Measuring ticks */}
                <line x1="85" y1="130" x2="95" y2="130" stroke="#94a3b8" strokeWidth="2" />
                <line x1="80" y1="150" x2="95" y2="150" stroke="#94a3b8" strokeWidth="2" />
                <line x1="75" y1="170" x2="95" y2="170" stroke="#94a3b8" strokeWidth="2" />
                <line x1="70" y1="190" x2="95" y2="190" stroke="#94a3b8" strokeWidth="2" />

                {/* Fluid in Flask */}
                <defs>
                  <clipPath id="flask-inside">
                    <path d="M85 40 L85 100 L30 205 Q25 215 35 215 L165 215 Q175 215 170 205 L115 100 L115 40 Z" />
                  </clipPath>
                  <linearGradient id="fluidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={current.color} stopOpacity="0.75" />
                    <stop offset="100%" stopColor={current.color} stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                <g clipPath="url(#flask-inside)">
                  {/* Liquid fill */}
                  <rect
                    x="20"
                    y="120"
                    width="160"
                    height="100"
                    fill="url(#fluidGradient)"
                    className="liquid-rect"
                  />
                  {/* Liquid Surface Wave */}
                  <ellipse
                    cx="100"
                    cy="120"
                    rx="45"
                    ry="8"
                    fill={current.color}
                    opacity="0.85"
                  />
                  {/* Rising Bubbles */}
                  <circle cx="90" cy="190" r="4" fill={current.bubbleColor} className="bubble-1" />
                  <circle cx="115" cy="175" r="5" fill={current.bubbleColor} className="bubble-2" />
                  <circle cx="100" cy="150" r="3" fill={current.bubbleColor} className="bubble-3" />
                  <circle cx="125" cy="195" r="3.5" fill={current.bubbleColor} className="bubble-4" />
                </g>

                {/* Glassware Outline */}
                <path
                  d="M85 30 L85 100 L30 205 Q25 215 35 215 L165 215 Q175 215 170 205 L115 100 L115 30"
                  stroke="#cbd5e1"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Lip rim */}
                <ellipse cx="100" cy="30" rx="18" ry="5" stroke="#cbd5e1" strokeWidth="5" />
                {/* Glass reflection */}
                <path
                  d="M48 200 L95 110"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Fluid description info */}
            <div className="flask-footer">
              <div className="fluid-status-badge">
                <span
                  className="fluid-status-dot"
                  style={{ backgroundColor: current.color }}
                />
                <strong className="fluid-status-title">{current.label}</strong>
              </div>
              <div className="fluid-details-row">
                <span className="fluid-sample">Contoh: {current.sample}</span>
                <span className="fluid-note">{current.note}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
