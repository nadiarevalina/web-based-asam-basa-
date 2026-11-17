export function Citation({ narrative = false }: { narrative?: boolean }) {
  if (narrative) {
    return (
      <span
        className="citation-narrative"
        title="Chang, R. (2004). Kimia dasar: Konsep-konsep inti (Edisi ke-3, Jilid 2). Erlangga."
      >
        Chang (2004)
      </span>
    )
  }
  return (
    <cite
      className="citation-tag"
      title="Chang, R. (2004). Kimia dasar: Konsep-konsep inti (Edisi ke-3, Jilid 2). Erlangga."
    >
      (Chang, 2004)
    </cite>
  )
}

interface AcademicReferenceProps {
  topic?: string
  relevantConcepts?: string[]
  boundaryNotes?: string
}

export function AcademicReference({
  topic = 'Konsep Asam dan Basa',
  relevantConcepts,
  boundaryNotes,
}: AcademicReferenceProps) {
  return (
    <div className="academic-ref-container" aria-label="Bagian Sumber Referensi Akademik">
      <div className="academic-ref-card">
        <div className="academic-ref-header">
          <div className="academic-ref-icon" aria-hidden="true">
            <svg
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
          <div className="academic-ref-header-text">
            <div className="academic-ref-badge-row">
              <span className="academic-ref-badge">Sumber Referensi Akademik</span>
              <span className="academic-ref-style-badge">Format APA Edisi ke-7</span>
            </div>
            <h3 className="academic-ref-title">Daftar Pustaka &amp; Rujukan Materi</h3>
            <p className="academic-ref-subtitle">
              Materi pada bagian <strong>{topic}</strong> disusun dan diverifikasi berdasarkan buku teks kimia akademik berikut:
            </p>
          </div>
        </div>

        <div className="academic-ref-entry-box">
          <div className="academic-ref-entry">
            <p className="academic-ref-apa-text">
              Chang, R. (2004). <em>Kimia dasar: Konsep-konsep inti</em> (Edisi ke-3, Jilid 2). Erlangga.
            </p>
          </div>

          <div className="academic-ref-details-grid">
            <div className="ref-detail-item">
              <span className="ref-detail-label">Penulis</span>
              <span className="ref-detail-value">Raymond Chang</span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Tahun Terbit</span>
              <span className="ref-detail-value">2004</span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Edisi / Jilid</span>
              <span className="ref-detail-value">Edisi ke-3, Jilid 2</span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Penerbit</span>
              <span className="ref-detail-value">Erlangga (Jakarta)</span>
            </div>
          </div>
        </div>

        {relevantConcepts && relevantConcepts.length > 0 && (
          <div className="academic-ref-scope-box">
            <h4 className="ref-scope-title">
              <span className="scope-bullet">📌</span> Cakupan Konsep yang Dirujuk dari Sumber Ini:
            </h4>
            <ul className="ref-scope-list">
              {relevantConcepts.map((concept, idx) => (
                <li key={idx} className="ref-scope-item">
                  {concept}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="academic-ref-disclaimer">
          <div className="ref-disclaimer-header">
            <span className="ref-disclaimer-icon" aria-hidden="true">ℹ️</span>
            <strong>Integritas &amp; Batasan Verifikasi Akademik:</strong>
          </div>
          <p className="ref-disclaimer-text">
            Sitasi dalam teks mengikuti kaidah APA Edisi ke-7 dengan format nama penulis dan tahun: <code>(Chang, 2004)</code> atau bentuk naratif <code>Chang (2004)</code>.
            Sesuai etika penulisan ilmiah, nomor halaman tidak dicantumkan secara perkiraan/spekulatif karena verifikasi fisik salinan cetak halaman per halaman tidak tersedia di lingkungan digital ini.
            {boundaryNotes && (
              <span className="ref-custom-boundary"> {boundaryNotes}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
