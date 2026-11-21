import React from 'react'
import './ChemistryBackground.css'

export const ChemistryBackground: React.FC = () => {
  return (
    <div className="chem-bg-root" aria-hidden="true">
      {/* 1. Luminous Soft Organic Blobs (Warm Yellow-Orange & Baby Blue) */}
      <div className="chem-blob chem-blob-yellow-top" />
      <div className="chem-blob chem-blob-blue-top" />
      <div className="chem-blob chem-blob-orange-mid" />
      <div className="chem-blob chem-blob-blue-bottom" />
      <div className="chem-blob chem-blob-yellow-bottom" />

      {/* 2. Molecular Network SVG (Subtle Atom Nodes & Connecting Bonds) */}
      <svg className="chem-molecular-network" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="netBondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#A2D2FF" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Bond connecting lines */}
        <line x1="120" y1="180" x2="240" y2="130" stroke="url(#netBondGrad)" strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="240" y1="130" x2="310" y2="220" stroke="url(#netBondGrad)" strokeWidth="1.2" />
        <line x1="310" y1="220" x2="210" y2="290" stroke="url(#netBondGrad)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="210" y1="290" x2="120" y2="180" stroke="url(#netBondGrad)" strokeWidth="1.2" />

        <line x1="1180" y1="140" x2="1280" y2="210" stroke="url(#netBondGrad)" strokeWidth="1.2" />
        <line x1="1280" y1="210" x2="1390" y2="160" stroke="url(#netBondGrad)" strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="1280" y1="210" x2="1230" y2="320" stroke="url(#netBondGrad)" strokeWidth="1" />
        <line x1="1230" y1="320" x2="1140" y2="260" stroke="url(#netBondGrad)" strokeWidth="1.2" />

        <line x1="80" y1="720" x2="180" y2="650" stroke="url(#netBondGrad)" strokeWidth="1.2" />
        <line x1="180" y1="650" x2="260" y2="740" stroke="url(#netBondGrad)" strokeWidth="1" strokeDasharray="4 4" />

        <line x1="1240" y1="680" x2="1350" y2="760" stroke="url(#netBondGrad)" strokeWidth="1.2" />
        <line x1="1350" y1="760" x2="1420" y2="690" stroke="url(#netBondGrad)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Atom node spheres */}
        <circle cx="120" cy="180" r="5" fill="#FFE38A" opacity="0.6" />
        <circle cx="240" cy="130" r="4" fill="#A2D2FF" opacity="0.7" />
        <circle cx="310" cy="220" r="6" fill="#FFB454" opacity="0.55" />
        <circle cx="210" cy="290" r="4.5" fill="#BCE0FF" opacity="0.65" />

        <circle cx="1180" cy="140" r="4.5" fill="#BCE0FF" opacity="0.7" />
        <circle cx="1280" cy="210" r="6.5" fill="#A2D2FF" opacity="0.8" />
        <circle cx="1390" cy="160" r="4" fill="#FFE38A" opacity="0.6" />
        <circle cx="1230" cy="320" r="5" fill="#FFD166" opacity="0.6" />
        <circle cx="1140" cy="260" r="3.5" fill="#DCEFFF" opacity="0.7" />

        <circle cx="80" cy="720" r="4" fill="#FFB454" opacity="0.6" />
        <circle cx="180" cy="650" r="5.5" fill="#FFE38A" opacity="0.7" />
        <circle cx="260" cy="740" r="4" fill="#A2D2FF" opacity="0.6" />

        <circle cx="1240" cy="680" r="5" fill="#A2D2FF" opacity="0.65" />
        <circle cx="1350" cy="760" r="6" fill="#BCE0FF" opacity="0.75" />
        <circle cx="1420" cy="690" r="4" fill="#FFD166" opacity="0.6" />
      </svg>

      {/* 3. Floating Molecules (H2O & Polyatomic Molecules) */}
      {/* Molecule 1: H2O (Oxygen Warm Yellow-Orange + 2 Hydrogens Baby Blue) */}
      <div className="chem-molecule chem-molecule-1">
        <svg width="84" height="74" viewBox="0 0 84 74" fill="none">
          <line x1="42" y1="46" x2="18" y2="18" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
          <line x1="42" y1="46" x2="66" y2="18" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
          {/* Oxygen atom (warm orange) */}
          <circle cx="42" cy="46" r="14" fill="url(#gradOxy)" />
          <text x="42" y="50.5" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="800" fontFamily="sans-serif">O</text>
          {/* Hydrogen atoms (baby blue) */}
          <circle cx="18" cy="18" r="9" fill="url(#gradHydro)" />
          <text x="18" y="21.5" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="800" fontFamily="sans-serif">H</text>
          <circle cx="66" cy="18" r="9" fill="url(#gradHydro)" />
          <text x="66" y="21.5" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="800" fontFamily="sans-serif">H</text>

          <defs>
            <radialGradient id="gradOxy" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFE38A" />
              <stop offset="70%" stopColor="#FFB454" />
              <stop offset="100%" stopColor="#FFA94D" />
            </radialGradient>
            <radialGradient id="gradHydro" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#EAF6FF" />
              <stop offset="60%" stopColor="#BCE0FF" />
              <stop offset="100%" stopColor="#A2D2FF" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Molecule 2: Diatomic Bond Molecule */}
      <div className="chem-molecule chem-molecule-2">
        <svg width="70" height="40" viewBox="0 0 70 40" fill="none">
          <line x1="20" y1="20" x2="50" y2="20" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <circle cx="20" cy="20" r="11" fill="url(#gradYellowAtom)" />
          <circle cx="50" cy="20" r="11" fill="url(#gradBlueAtom)" />
          <defs>
            <radialGradient id="gradYellowAtom" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF3C4" />
              <stop offset="100%" stopColor="#FFD166" />
            </radialGradient>
            <radialGradient id="gradBlueAtom" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#DCEFFF" />
              <stop offset="100%" stopColor="#A2D2FF" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Molecule 3: H2O on the right side */}
      <div className="chem-molecule chem-molecule-3">
        <svg width="76" height="66" viewBox="0 0 76 66" fill="none">
          <line x1="38" y1="24" x2="16" y2="50" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
          <line x1="38" y1="24" x2="60" y2="50" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
          <circle cx="38" cy="24" r="13" fill="url(#gradOxy2)" />
          <text x="38" y="28" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="800" fontFamily="sans-serif">O</text>
          <circle cx="16" cy="50" r="8" fill="url(#gradHydro2)" />
          <text x="16" y="53.5" textAnchor="middle" fill="#0369a1" fontSize="8" fontWeight="800" fontFamily="sans-serif">H</text>
          <circle cx="60" cy="50" r="8" fill="url(#gradHydro2)" />
          <text x="60" y="53.5" textAnchor="middle" fill="#0369a1" fontSize="8" fontWeight="800" fontFamily="sans-serif">H</text>
          <defs>
            <radialGradient id="gradOxy2" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFE38A" />
              <stop offset="100%" stopColor="#FFB454" />
            </radialGradient>
            <radialGradient id="gradHydro2" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#EAF6FF" />
              <stop offset="100%" stopColor="#A2D2FF" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Floating Ions Badges / Orbs (H+, OH-, H3O+) */}
      {/* H+ (Acid - Warm Yellow/Orange) */}
      <div className="chem-ion chem-ion-hplus-1">
        <span className="chem-ion-glow warm-glow" />
        <span className="chem-ion-text acid-text">H<sup>+</sup></span>
      </div>

      <div className="chem-ion chem-ion-hplus-2">
        <span className="chem-ion-glow warm-glow" />
        <span className="chem-ion-text acid-text">H<sup>+</sup></span>
      </div>

      {/* OH- (Base - Baby Blue) */}
      <div className="chem-ion chem-ion-ohminus-1">
        <span className="chem-ion-glow cool-glow" />
        <span className="chem-ion-text base-text">OH<sup>−</sup></span>
      </div>

      <div className="chem-ion chem-ion-ohminus-2">
        <span className="chem-ion-glow cool-glow" />
        <span className="chem-ion-text base-text">OH<sup>−</sup></span>
      </div>

      {/* H3O+ (Hydronium - Warm Amber) */}
      <div className="chem-ion chem-ion-h3oplus">
        <span className="chem-ion-glow warm-glow" />
        <span className="chem-ion-text acid-text">H<sub>3</sub>O<sup>+</sup></span>
      </div>

      {/* 5. Chemistry Translucent Bubbles (Warm Yellow & Baby Blue) */}
      <div className="chem-bubble chem-bubble-1" />
      <div className="chem-bubble chem-bubble-2" />
      <div className="chem-bubble chem-bubble-3" />
      <div className="chem-bubble chem-bubble-4" />
      <div className="chem-bubble chem-bubble-5" />
      <div className="chem-bubble chem-bubble-6" />
      <div className="chem-bubble chem-bubble-7" />
      <div className="chem-bubble chem-bubble-8" />
    </div>
  )
}
