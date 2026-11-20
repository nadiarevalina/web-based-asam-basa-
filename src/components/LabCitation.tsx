import { useState } from 'react'
import { LAB_REFERENCES, type LabReferenceItem } from '../data/labCitationsData'

interface LabCitationProps {
  id: keyof typeof LAB_REFERENCES | string
  narrative?: boolean
  showSourceBtn?: boolean
  className?: string
}

export function LabCitation({
  id,
  narrative = false,
  showSourceBtn = true,
  className = '',
}: LabCitationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const refItem = LAB_REFERENCES[id]

  if (!refItem) {
    return null
  }

  const label = narrative ? refItem.narrativeCitation : refItem.inTextCitation

  return (
    <>
      <span className={`lab-citation-inline-wrap ${className}`}>
        <button
          type="button"
          className="lab-citation-pill"
          onClick={() => setIsModalOpen(true)}
          title={`Lihat rujukan ilmiah: ${refItem.apaFormatted}`}
          aria-haspopup="dialog"
          aria-label={`Sitasi ilmiah ${label}. Klik untuk melihat detail sumber referensi.`}
        >
          <span className="citation-text">{label}</span>
          {showSourceBtn && (
            <span className="citation-source-icon" aria-hidden="true">
              [Sumber ↗]
            </span>
          )}
        </button>
      </span>

      {isModalOpen && (
        <LabCitationModal reference={refItem} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}

interface LabCitationModalProps {
  reference: LabReferenceItem
  onClose: () => void
}

export function LabCitationModal({ reference, onClose }: LabCitationModalProps) {
  return (
    <div
      className="modal-overlay lab-citation-modal-overlay animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citation-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-content lab-citation-modal-card card-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header lab-citation-modal-header">
          <div className="citation-modal-badge-group">
            <span className="badge-academic-ref">Rujukan Ilmiah Terverifikasi</span>
            <span className="badge-apa-style">Format APA Edisi ke-7</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup jendela rujukan"
          >
            ✕
          </button>
        </div>

        <div className="modal-body lab-citation-modal-body">
          <h3 id="citation-modal-title" className="citation-modal-title">
            {reference.title}
          </h3>

          <div className="citation-apa-quote-box">
            <p className="citation-apa-quote-text">{reference.apaFormatted}</p>
          </div>

          <div className="citation-meta-grid">
            <div className="citation-meta-item">
              <span className="meta-label">Penulis / Institusi</span>
              <span className="meta-value">{reference.authors}</span>
            </div>
            <div className="citation-meta-item">
              <span className="meta-label">Tahun Publikasi</span>
              <span className="meta-value font-mono">{reference.year}</span>
            </div>
            <div className="citation-meta-item">
              <span className="meta-label">Penerbit / Jurnal</span>
              <span className="meta-value">{reference.publisherOrJournal}</span>
            </div>
            {reference.edition && (
              <div className="citation-meta-item">
                <span className="meta-label">Edisi Buku</span>
                <span className="meta-value">{reference.edition}</span>
              </div>
            )}
            {reference.doi && (
              <div className="citation-meta-item">
                <span className="meta-label">Digital Object Identifier (DOI)</span>
                <span className="meta-value font-mono">
                  <a
                    href={`https://doi.org/${reference.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="citation-ext-link"
                  >
                    doi.org/{reference.doi} ↗
                  </a>
                </span>
              </div>
            )}
          </div>

          <div className="citation-concepts-box">
            <h4 className="citation-concepts-heading">
              <span className="bullet-icon">📌</span> Konsep &amp; Fakta yang Diverifikasi Sumber Ini:
            </h4>
            <ul className="citation-concepts-list">
              {reference.conceptsCovered.map((concept, idx) => (
                <li key={idx} className="citation-concept-item">
                  {concept}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer lab-citation-modal-footer">
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-cyan btn-sm"
          >
            <span>Buka Sumber Asli / Penerbit ↗</span>
          </a>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
