import { useState } from 'react'
import { SORTED_LAB_REFERENCES, type LabReferenceItem } from '../data/labCitationsData'

export function LabBibliography() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="lab-bibliography-section" id="lab-references" aria-labelledby="lab-bib-title">
      <div className="lab-bib-card card-surface">
        <div className="lab-bib-header">
          <div className="lab-bib-icon-box" aria-hidden="true">
            <svg
              className="lab-bib-icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
              <path d="M6 14h6" />
            </svg>
          </div>
          <div className="lab-bib-header-text">
            <div className="lab-bib-tag-row">
              <span className="lab-bib-tag">Referensi Ilmiah Terstandarisasi</span>
              <span className="lab-bib-tag-style">Format APA Edisi ke-7 (Author-Date)</span>
              <span className="lab-bib-tag-count">8 Sumber Akademik Terverifikasi</span>
            </div>
            <h3 id="lab-bib-title" className="lab-bib-title">
              Daftar Pustaka &amp; Landasan Teoretis Laboratorium Virtual
            </h3>
            <p className="lab-bib-subtitle">
              Seluruh konsep kimia, sifat fisis-kimia sampel, fungsi instrumen, trayek perubahan warna indikator,
              prosedur inkuiri, dan mekanisme reaksi yang disimulasikan dalam Laboratorium Virtual ini
              disusun serta diverifikasi berdasarkan literatur akademik berstandar internasional berikut:
            </p>
          </div>
        </div>

        {/* Methodological Clarification (Sesuai Aturan Bagian 6 & 8) */}
        <div className="lab-methodology-note">
          <div className="methodology-header">
            <span className="methodology-icon">🔬</span>
            <strong>Pemberitahuan Karakteristik Simulasi Digital (Bukan Eksperimen Fisik Basah):</strong>
          </div>
          <p className="methodology-desc">
            Hasil pengamatan perubahan warna dan estimasi derajat keasaman (pH) pada modul ini merupakan{' '}
            <strong>hasil simulasi komputasional digital</strong> yang dimodelkan berdasarkan konstanta disosiasi kesetimbangan{' '}
            (<em>Ka</em>/<em>pKa</em>) dan trayek visual standar dari buku teks kimia akademik (Haynes, 2016; Skoog et al., 2014).
            Simulasi ini bertujuan memvisualisasikan dinamika kesetimbangan kimiawi secara interaktif dan aman bagi siswa,
            serta bukan merupakan klaim hasil pengukuran basah langsung di laboratorium fisik.
          </p>
        </div>

        {/* List of References in Alphabetical Order */}
        <div className="lab-references-list">
          {SORTED_LAB_REFERENCES.map((item: LabReferenceItem, index: number) => {
            const isExpanded = expandedId === item.id
            return (
              <div key={item.id} className="lab-ref-item-card">
                <div className="lab-ref-item-top">
                  <span className="lab-ref-index-badge font-mono">0{index + 1}</span>
                  <div className="lab-ref-content-block">
                    <p className="lab-ref-apa-entry">
                      {item.authors} ({item.year}). <em>{item.title}</em>
                      {item.edition ? ` (${item.edition})` : ''}. {item.publisherOrJournal}.{' '}
                      {item.doi ? (
                        <a
                          href={`https://doi.org/${item.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lab-ref-link"
                        >
                          https://doi.org/{item.doi}
                        </a>
                      ) : (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lab-ref-link"
                        >
                          {item.url}
                        </a>
                      )}
                    </p>

                    <div className="lab-ref-inline-meta">
                      <span className="lab-ref-key-badge">Sitasi: <code>{item.inTextCitation}</code></span>
                      <button
                        type="button"
                        className="btn-toggle-concepts"
                        onClick={() => toggleExpand(item.id)}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Sembunyikan Konsep ▲' : 'Lihat Cakupan Konsep ▼'}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="lab-ref-expanded-concepts animate-fade-in">
                    <h5 className="expanded-concepts-title">
                      Cakupan Pernyataan &amp; Prosedur yang Didukung:
                    </h5>
                    <ul className="expanded-concepts-list">
                      {item.conceptsCovered.map((concept, cIdx) => (
                        <li key={cIdx} className="expanded-concept-item">
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Verification Guarantee Footer */}
        <div className="lab-bib-footer">
          <div className="bib-footer-col">
            <span className="check-icon">✓</span>
            <span>Seluruh sitasi dalam teks terhubung 1-ke-1 dengan daftar rujukan di atas.</span>
          </div>
          <div className="bib-footer-col">
            <span className="check-icon">✓</span>
            <span>Tautan DOI dan penerbit aktif serta dapat diverifikasi secara akademis.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
