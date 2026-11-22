import React from 'react'
import './ChemistryBackground.css'

export interface ChemistryBackgroundProps {
  /**
   * Mode tampilan background:
   * - 'default': Halaman non-lab (paduan harmonis Warm Orange-Yellow, Baby Blue, dan Soft Cream)
   * - 'initial': Kondisi awal Lab Virtual sebelum pengujian sampel / saat reset
   * - 'neutral': Kondisi hasil pengujian netral (pH = 7.0)
   * - 'acid': Kondisi hasil pengujian asam (pH < 7.0, Warm Orange-Yellow & Amber dominan)
   * - 'base': Kondisi hasil pengujian basa (pH > 7.0, Baby Blue & Ocean Blue dominan)
   */
  mode?: 'default' | 'initial' | 'acid' | 'neutral' | 'base'
}

export const ChemistryBackground: React.FC<ChemistryBackgroundProps> = ({ mode = 'default' }) => {
  return (
    <div className={`chem-bg-root chem-mode-${mode} background-decoration-layer`} aria-hidden="true">
      {/* ====================================================================
          LAYER 0: Base Ambient Gradient Mesh with Real Depth
          Warm Orange-Yellow (#FFD58A) & Baby Blue (#B9E5FA) Chemistry Atmosphere
          Transisi dinamis mulus 600ms antar mode asam, basa, netral, dan default
          ==================================================================== */}
      <div className="chem-bg-layer-0-base" />

      {/* ====================================================================
          LAYER 1: Large Luminous Organic Blobs & Glow Shapes
          Rich Warm Orange-Yellow (Acid) & Baby Blue (Base)
          ==================================================================== */}
      <div className="chem-bg-layer-1-blobs">
        {/* Top-Left: Warm Orange-Yellow Glow (Acid side) */}
        <div className="chem-organic-blob blob-warm-top" />

        {/* Top-Right: Baby Blue Lagoon Glow (Base side) */}
        <div className="chem-organic-blob blob-cool-top" />

        {/* Mid-Left: Soft Tangerine & Amber Radiance */}
        <div className="chem-organic-blob blob-warm-mid" />

        {/* Mid-Right / Center: Soft Cyan & Sky Blue Atmosphere */}
        <div className="chem-organic-blob blob-cool-mid" />

        {/* Bottom-Right: Baby Blue Ocean & Ice Blue Glow */}
        <div className="chem-organic-blob blob-cool-bottom" />

        {/* Bottom-Left: Soft Golden Sun Glow */}
        <div className="chem-organic-blob blob-warm-bottom" />
      </div>

      {/* ====================================================================
          LAYER 2: Chemistry Decorations (Molecules, Ions, Network, Bubbles)
          All strictly in background behind all interactive content (pointer-events: none)
          ==================================================================== */}
      <div className="chem-bg-layer-2-particles">
        {/* 2A. Molecular Network SVG (Subtle Atom Nodes & Connecting Bonds) */}
        <svg
          className="chem-molecular-network"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="netBondGradWarm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD58A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F5A623" stopOpacity="0.30" />
            </linearGradient>
            <linearGradient id="netBondGradCool" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B9E5FA" stopOpacity="0.50" />
              <stop offset="100%" stopColor="#399ACB" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="netBondGradCross" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD58A" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#B9E5FA" stopOpacity="0.40" />
            </linearGradient>
          </defs>

          {/* Top-Left Network (Acid) */}
          <line x1="90" y1="140" x2="220" y2="100" stroke="url(#netBondGradWarm)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="220" y1="100" x2="300" y2="200" stroke="url(#netBondGradWarm)" strokeWidth="1.5" />
          <line x1="300" y1="200" x2="190" y2="280" stroke="url(#netBondGradWarm)" strokeWidth="1.2" strokeDasharray="5 5" />
          <line x1="190" y1="280" x2="90" y2="140" stroke="url(#netBondGradWarm)" strokeWidth="1.5" />
          <line x1="220" y1="100" x2="380" y2="110" stroke="url(#netBondGradWarm)" strokeWidth="1.2" strokeDasharray="3 3" />

          {/* Atom Nodes Top-Left */}
          <circle cx="90" cy="140" r="6" fill="#FFD58A" opacity="0.85" />
          <circle cx="220" cy="100" r="5" fill="#F5A623" opacity="0.85" />
          <circle cx="300" cy="200" r="7.5" fill="#FFD58A" opacity="0.9" />
          <circle cx="190" cy="280" r="5" fill="#FFF5DF" opacity="0.8" />
          <circle cx="380" cy="110" r="4" fill="#F5A623" opacity="0.75" />

          {/* Top-Right Network (Base) */}
          <line x1="1160" y1="120" x2="1270" y2="190" stroke="url(#netBondGradCool)" strokeWidth="1.5" />
          <line x1="1270" y1="190" x2="1390" y2="130" stroke="url(#netBondGradCool)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="1270" y1="190" x2="1220" y2="310" stroke="url(#netBondGradCool)" strokeWidth="1.2" />
          <line x1="1220" y1="310" x2="1120" y2="240" stroke="url(#netBondGradCool)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="1390" y1="130" x2="1430" y2="240" stroke="url(#netBondGradCool)" strokeWidth="1.2" />

          {/* Atom Nodes Top-Right */}
          <circle cx="1160" cy="120" r="5.5" fill="#D8F1FC" opacity="0.85" />
          <circle cx="1270" cy="190" r="7.5" fill="#B9E5FA" opacity="0.9" />
          <circle cx="1390" cy="130" r="5" fill="#399ACB" opacity="0.85" />
          <circle cx="1220" cy="310" r="6" fill="#B9E5FA" opacity="0.8" />
          <circle cx="1120" cy="240" r="4.5" fill="#D8F1FC" opacity="0.85" />
          <circle cx="1430" cy="240" r="5" fill="#399ACB" opacity="0.75" />

          {/* Bottom-Left Network */}
          <line x1="70" y1="740" x2="170" y2="670" stroke="url(#netBondGradWarm)" strokeWidth="1.5" />
          <line x1="170" y1="670" x2="260" y2="760" stroke="url(#netBondGradCross)" strokeWidth="1.2" strokeDasharray="4 4" />
          <line x1="260" y1="760" x2="340" y2="700" stroke="url(#netBondGradWarm)" strokeWidth="1.5" />
          <circle cx="70" cy="740" r="5" fill="#F5A623" opacity="0.8" />
          <circle cx="170" cy="670" r="6.5" fill="#FFD58A" opacity="0.85" />
          <circle cx="260" cy="760" r="5" fill="#B9E5FA" opacity="0.8" />
          <circle cx="340" cy="700" r="4" fill="#FFF5DF" opacity="0.75" />

          {/* Bottom-Right Network */}
          <line x1="1220" y1="700" x2="1340" y2="780" stroke="url(#netBondGradCool)" strokeWidth="1.5" />
          <line x1="1340" y1="780" x2="1420" y2="700" stroke="url(#netBondGradCool)" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="1340" y1="780" x2="1280" y2="860" stroke="url(#netBondGradCool)" strokeWidth="1.5" />
          <circle cx="1220" cy="700" r="5.5" fill="#B9E5FA" opacity="0.8" />
          <circle cx="1340" cy="780" r="7" fill="#399ACB" opacity="0.9" />
          <circle cx="1420" cy="700" r="4.5" fill="#D8F1FC" opacity="0.8" />
          <circle cx="1280" cy="860" r="5" fill="#399ACB" opacity="0.75" />
        </svg>

        {/* 2B. Floating Chemistry Molecules */}

        {/* Molecule 1: H2O (Top-Left Margin) */}
        <div className="chem-molecule chem-molecule-1">
          <svg width="96" height="86" viewBox="0 0 96 86" fill="none">
            {/* Covalent Bond Lines */}
            <line x1="48" y1="52" x2="20" y2="20" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <line x1="48" y1="52" x2="76" y2="20" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            
            {/* Oxygen Atom (Warm Orange-Yellow with 3D Radial Shading) */}
            <circle cx="48" cy="52" r="17" fill="url(#gradOxy1)" filter="url(#sphereShadow)" />
            <text x="48" y="57" textAnchor="middle" fill="#263747" fontSize="13" fontWeight="900" fontFamily="sans-serif">O</text>

            {/* Hydrogen Atoms (Baby Blue with 3D Radial Shading) */}
            <circle cx="20" cy="20" r="11" fill="url(#gradHydro1)" filter="url(#sphereShadow)" />
            <text x="20" y="24.5" textAnchor="middle" fill="#263747" fontSize="10.5" fontWeight="900" fontFamily="sans-serif">H</text>

            <circle cx="76" cy="20" r="11" fill="url(#gradHydro1)" filter="url(#sphereShadow)" />
            <text x="76" y="24.5" textAnchor="middle" fill="#263747" fontSize="10.5" fontWeight="900" fontFamily="sans-serif">H</text>

            <defs>
              <filter id="sphereShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#263747" floodOpacity="0.12" />
              </filter>
              <radialGradient id="gradOxy1" cx="32%" cy="30%" r="68%">
                <stop offset="0%" stopColor="#FFF5DF" />
                <stop offset="50%" stopColor="#FFD58A" />
                <stop offset="100%" stopColor="#F5A623" />
              </radialGradient>
              <radialGradient id="gradHydro1" cx="32%" cy="30%" r="68%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#D8F1FC" />
                <stop offset="85%" stopColor="#B9E5FA" />
                <stop offset="100%" stopColor="#399ACB" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Molecule 2: Diatomic Polar Bond Molecule (Mid-Right Margin) */}
        <div className="chem-molecule chem-molecule-2">
          <svg width="86" height="50" viewBox="0 0 86 50" fill="none">
            <line x1="25" y1="25" x2="61" y2="25" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <circle cx="25" cy="25" r="14" fill="url(#gradYellowAtom2)" filter="url(#sphereShadow2)" />
            <circle cx="61" cy="25" r="14" fill="url(#gradBlueAtom2)" filter="url(#sphereShadow2)" />
            <defs>
              <filter id="sphereShadow2" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#263747" floodOpacity="0.12" />
              </filter>
              <radialGradient id="gradYellowAtom2" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF5DF" />
                <stop offset="55%" stopColor="#FFD58A" />
                <stop offset="100%" stopColor="#F5A623" />
              </radialGradient>
              <radialGradient id="gradBlueAtom2" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#D8F1FC" />
                <stop offset="100%" stopColor="#399ACB" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Molecule 3: H2O Inverted (Bottom-Left Margin) */}
        <div className="chem-molecule chem-molecule-3">
          <svg width="88" height="78" viewBox="0 0 88 78" fill="none">
            <line x1="44" y1="28" x2="18" y2="58" stroke="#CBD5E1" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="44" y1="28" x2="70" y2="58" stroke="#CBD5E1" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="44" cy="28" r="15" fill="url(#gradOxy3)" filter="url(#sphereShadow)" />
            <text x="44" y="33" textAnchor="middle" fill="#263747" fontSize="12" fontWeight="900" fontFamily="sans-serif">O</text>
            <circle cx="18" cy="58" r="10" fill="url(#gradHydro3)" filter="url(#sphereShadow)" />
            <text x="18" y="62" textAnchor="middle" fill="#263747" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">H</text>
            <circle cx="70" cy="58" r="10" fill="url(#gradHydro3)" filter="url(#sphereShadow)" />
            <text x="70" y="62" textAnchor="middle" fill="#263747" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">H</text>
            <defs>
              <radialGradient id="gradOxy3" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF5DF" />
                <stop offset="50%" stopColor="#FFD58A" />
                <stop offset="100%" stopColor="#F5A623" />
              </radialGradient>
              <radialGradient id="gradHydro3" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#D8F1FC" />
                <stop offset="100%" stopColor="#B9E5FA" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Molecule 4: H3O+ Hydronium 3D Molecule (Bottom-Right Margin) */}
        <div className="chem-molecule chem-molecule-4">
          <svg width="92" height="88" viewBox="0 0 92 88" fill="none">
            <line x1="46" y1="46" x2="22" y2="24" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="46" y1="46" x2="70" y2="24" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="46" y1="46" x2="46" y2="76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="46" cy="46" r="15" fill="url(#gradOxy4)" filter="url(#sphereShadow)" />
            <text x="46" y="50.5" textAnchor="middle" fill="#263747" fontSize="11" fontWeight="900" fontFamily="sans-serif">O</text>
            <circle cx="22" cy="24" r="9" fill="url(#gradHydro4)" filter="url(#sphereShadow)" />
            <text x="22" y="27.5" textAnchor="middle" fill="#263747" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">H</text>
            <circle cx="70" cy="24" r="9" fill="url(#gradHydro4)" filter="url(#sphereShadow)" />
            <text x="70" y="27.5" textAnchor="middle" fill="#263747" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">H</text>
            <circle cx="46" cy="76" r="9" fill="url(#gradHydro4)" filter="url(#sphereShadow)" />
            <text x="46" y="79.5" textAnchor="middle" fill="#263747" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">H</text>
            <defs>
              <radialGradient id="gradOxy4" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF5DF" />
                <stop offset="60%" stopColor="#FFD58A" />
                <stop offset="100%" stopColor="#F5A623" />
              </radialGradient>
              <radialGradient id="gradHydro4" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#B9E5FA" />
                <stop offset="100%" stopColor="#399ACB" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* 2C. Glowing Acid & Base Chemical Ions (H+, OH-, H3O+) */}
        {/* H+ Acid Ion 1 */}
        <div className="chem-ion chem-ion-hplus-1">
          <span className="chem-ion-glow warm-glow" />
          <span className="chem-ion-text acid-text">H<sup>+</sup></span>
        </div>

        {/* H+ Acid Ion 2 */}
        <div className="chem-ion chem-ion-hplus-2">
          <span className="chem-ion-glow warm-glow" />
          <span className="chem-ion-text acid-text">H<sup>+</sup></span>
        </div>

        {/* OH- Base Ion 1 */}
        <div className="chem-ion chem-ion-ohminus-1">
          <span className="chem-ion-glow cool-glow" />
          <span className="chem-ion-text base-text">OH<sup>−</sup></span>
        </div>

        {/* OH- Base Ion 2 */}
        <div className="chem-ion chem-ion-ohminus-2">
          <span className="chem-ion-glow cool-glow" />
          <span className="chem-ion-text base-text">OH<sup>−</sup></span>
        </div>

        {/* H3O+ Hydronium Ion */}
        <div className="chem-ion chem-ion-h3oplus">
          <span className="chem-ion-glow amber-glow" />
          <span className="chem-ion-text amber-text">H<sub>3</sub>O<sup>+</sup></span>
        </div>

        {/* 2D. Chemistry Translucent Rising Bubbles (10 Bubbles) */}
        <div className="chem-bubble chem-bubble-1" />
        <div className="chem-bubble chem-bubble-2" />
        <div className="chem-bubble chem-bubble-3" />
        <div className="chem-bubble chem-bubble-4" />
        <div className="chem-bubble chem-bubble-5" />
        <div className="chem-bubble chem-bubble-6" />
        <div className="chem-bubble chem-bubble-7" />
        <div className="chem-bubble chem-bubble-8" />
        <div className="chem-bubble chem-bubble-9" />
        <div className="chem-bubble chem-bubble-10" />
      </div>

      {/* ====================================================================
          LAYER 3: Soft Atmospheric Depth Vignette
          Subtle darkening of extreme edges to focus depth inward
          ==================================================================== */}
      <div className="chem-bg-layer-3-vignette" />
    </div>
  )
}
