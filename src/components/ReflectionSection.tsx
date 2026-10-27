import { useState } from 'react'

interface SavedReflectionDraft {
  studentName?: string
  studentClass?: string
  understoodConcept?: string
  challengingConcept?: string
  actionPlan?: string
  learningExperience?: string
}

function getSavedDraft(): SavedReflectionDraft {
  if (typeof window === 'undefined') return {}
  try {
    const saved = localStorage.getItem('asambasa_reflection_draft')
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

export function ReflectionSection() {
  const [draft] = useState<SavedReflectionDraft>(getSavedDraft)
  const [studentName, setStudentName] = useState(draft.studentName || '')
  const [studentClass, setStudentClass] = useState(draft.studentClass || '')
  const [understoodConcept, setUnderstoodConcept] = useState(draft.understoodConcept || '')
  const [challengingConcept, setChallengingConcept] = useState(draft.challengingConcept || '')
  const [actionPlan, setActionPlan] = useState(draft.actionPlan || '')
  const [learningExperience, setLearningExperience] = useState(draft.learningExperience || '')
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const handleSaveDraft = () => {
    try {
      const draft = {
        studentName,
        studentClass,
        understoodConcept,
        challengingConcept,
        actionPlan,
        learningExperience,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem('asambasa_reflection_draft', JSON.stringify(draft))
      setSaveNotice('Draf refleksi berhasil disimpan di browser!')
      setTimeout(() => setSaveNotice(null), 3000)
    } catch {
      setSaveNotice('Gagal menyimpan draf ke memori browser.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleResetForm = () => {
    if (window.confirm('Apakah kamu yakin ingin mengosongkan lembar refleksi ini?')) {
      setStudentName('')
      setStudentClass('')
      setUnderstoodConcept('')
      setChallengingConcept('')
      setActionPlan('')
      setLearningExperience('')
      localStorage.removeItem('asambasa_reflection_draft')
      setSaveNotice('Lembar refleksi telah dibersihkan.')
      setTimeout(() => setSaveNotice(null), 2500)
    }
  }

  return (
    <section id="refleksi-section" className="content-section" aria-labelledby="refleksi-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Metakognisi</span>
          <span className="section-topic-pill">Refleksi Belajar Inkuiri</span>
        </div>
        <h2 id="refleksi-heading" className="section-title">
          Jurnal Refleksi Pembelajaran Mandiri
        </h2>
        <p className="section-description">
          Menuliskan refleksi membantu memperkuat pemahaman konsep, mendeteksi miskonsepsi secara mandiri,
          dan merancang langkah belajar lanjutan. Lembar refleksi ini dapat dicetak atau disimpan sebagai PDF.
        </p>
      </div>

      <div className="reflection-sheet-card printable-sheet">
        <div className="sheet-watermark">AsamBasa Lab • Lembar Kerja Siswa</div>

        {/* Student Identity Row */}
        <div className="sheet-identity-grid">
          <div className="sheet-field-group">
            <label htmlFor="student-name" className="sheet-label">
              Nama Lengkap Siswa:
            </label>
            <input
              id="student-name"
              type="text"
              className="sheet-input"
              placeholder="Contoh: Budi Santoso"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>

          <div className="sheet-field-group">
            <label htmlFor="student-class" className="sheet-label">
              Kelas / Sekolah:
            </label>
            <input
              id="student-class"
              type="text"
              className="sheet-input"
              placeholder="Contoh: XI MIPA 1 / SMAN 1"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
            />
          </div>
        </div>

        {/* Prompt Questions */}
        <div className="sheet-questions-list">
          <div className="sheet-q-box">
            <label htmlFor="q-understood" className="sheet-q-label">
              <span className="q-badge">1</span>
              <span>Konsep kimia apa yang paling kamu pahami dengan baik hari ini?</span>
            </label>
            <p className="sheet-q-hint">
              Misal: Perbedaan donor proton Brønsted–Lowry vs Arrhenius, perubahan warna lakmus, atau rumus pH asam kuat.
            </p>
            <textarea
              id="q-understood"
              className="sheet-textarea"
              rows={3}
              placeholder="Tuliskan pemahamanmu di sini..."
              value={understoodConcept}
              onChange={(e) => setUnderstoodConcept(e.target.value)}
            />
          </div>

          <div className="sheet-q-box">
            <label htmlFor="q-challenging" className="sheet-q-label">
              <span className="q-badge">2</span>
              <span>Materi, perhitungan, atau fenomena indikator apa yang masih terasa sulit?</span>
            </label>
            <p className="sheet-q-hint">
              Misal: Menentukan pasangan asam-basa konjugasi, perhitungan pOH basa kuat, atau trayek pH fenolftalein.
            </p>
            <textarea
              id="q-challenging"
              className="sheet-textarea"
              rows={3}
              placeholder="Tuliskan kesulitan atau keraguanmu di sini..."
              value={challengingConcept}
              onChange={(e) => setChallengingConcept(e.target.value)}
            />
          </div>

          <div className="sheet-q-box">
            <label htmlFor="q-action" className="sheet-q-label">
              <span className="q-badge">3</span>
              <span>Apa rencana tindakan belajarmu untuk memperdalam konsep tersebut?</span>
            </label>
            <p className="sheet-q-hint">
              Misal: Mencoba ulang kalkulator pH dengan variasi molaritas, membaca kembali penjelasan kuis, atau berdiskusi dengan guru/teman.
            </p>
            <textarea
              id="q-action"
              className="sheet-textarea"
              rows={3}
              placeholder="Tuliskan rencana belajarmu selanjutnya..."
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
            />
          </div>

          <div className="sheet-q-box">
            <label htmlFor="q-experience" className="sheet-q-label">
              <span className="q-badge">4</span>
              <span>Bagaimana pengalaman belajarmu menggunakan simulasi lab virtual AsamBasa Lab?</span>
            </label>
            <p className="sheet-q-hint">
              Tuliskan kesan, kemudahan pengamatan warna, atau ide eksperimen kimia lain yang ingin kamu coba.
            </p>
            <textarea
              id="q-experience"
              className="sheet-textarea"
              rows={3}
              placeholder="Tuliskan catatan pengalaman belajarmu..."
              value={learningExperience}
              onChange={(e) => setLearningExperience(e.target.value)}
            />
          </div>
        </div>

        {/* Status notice */}
        {saveNotice && (
          <div className="sheet-save-toast animate-fade-in" role="status">
            <span>✓</span> {saveNotice}
          </div>
        )}

        {/* Action buttons (hidden when printing) */}
        <div className="sheet-actions-row no-print">
          <div className="sheet-actions-left">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleResetForm}
            >
              Kosongkan Lembar
            </button>
          </div>

          <div className="sheet-actions-right">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSaveDraft}
              id="btn-save-reflection"
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
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Simpan Draf Lokal</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
              id="btn-print-reflection"
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
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
