import { useState } from 'react'

interface SavedReflectionDraft {
  studentName?: string
  studentClass?: string
  hypothesisEvaluation?: string
  overallConclusion?: string
  understoodConcept?: string
  challengingConcept?: string
  actionPlan?: string
  learningExperience?: string
  lastUpdated?: string
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
  const [hypothesisEvaluation, setHypothesisEvaluation] = useState(
    draft.hypothesisEvaluation || draft.learningExperience || ''
  )
  const [overallConclusion, setOverallConclusion] = useState(
    draft.overallConclusion || draft.understoodConcept || ''
  )
  const [challengingConcept, setChallengingConcept] = useState(draft.challengingConcept || '')
  const [actionPlan, setActionPlan] = useState(draft.actionPlan || '')
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const handleSaveDraft = () => {
    try {
      const draftData: SavedReflectionDraft = {
        studentName,
        studentClass,
        hypothesisEvaluation,
        overallConclusion,
        understoodConcept: overallConclusion, // backwards compatibility
        challengingConcept,
        actionPlan,
        learningExperience: hypothesisEvaluation, // backwards compatibility
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem('asambasa_reflection_draft', JSON.stringify(draftData))
      setSaveNotice('Draf lembar refleksi inkuiri berhasil disimpan di browser!')
      setTimeout(() => setSaveNotice(null), 3000)
    } catch {
      setSaveNotice('Gagal menyimpan draf ke memori browser.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleResetForm = () => {
    if (window.confirm('Apakah kamu yakin ingin mengosongkan lembar refleksi inkuiri ini?')) {
      setStudentName('')
      setStudentClass('')
      setHypothesisEvaluation('')
      setOverallConclusion('')
      setChallengingConcept('')
      setActionPlan('')
      localStorage.removeItem('asambasa_reflection_draft')
      setSaveNotice('Lembar refleksi telah dibersihkan.')
      setTimeout(() => setSaveNotice(null), 2500)
    }
  }

  return (
    <section id="refleksi-section" className="content-section" aria-labelledby="refleksi-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Modul Inkuiri 6</span>
          <span className="section-topic-pill">Tahap 6 &amp; 7: Kesimpulan Menyeluruh &amp; Refleksi Metakognitif</span>
        </div>
        <h2 id="refleksi-heading" className="section-title">
          Lembar Refleksi Inkuiri &amp; Evaluasi Hipotesis Awal
        </h2>
        <p className="section-description">
          Tahap puncak dari model Inkuiri Terbimbing: evaluasi kebenaran dugaan awalmu saat eksperimen,
          sintesiskan kesimpulan ilmiah menyeluruh, dan rencanakan tindak lanjut belajar mandiri.
        </p>
      </div>

      <div className="reflection-sheet-card printable-sheet">
        <div className="sheet-watermark">AsamBasa Lab • Lembar Kerja Inkuiri Siswa</div>

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

        {/* Prompt Questions for Guided Inquiry */}
        <div className="sheet-questions-list">
          {/* Question 1: Evaluasi Hipotesis Awal */}
          <div className="sheet-q-box">
            <label htmlFor="q-hypothesis" className="sheet-q-label">
              <span className="q-badge">1</span>
              <span>Evaluasi Hipotesis Awal: Bandingkan dugaanmu di Lab Virtual dengan data hasil pengamatan!</span>
            </label>
            <p className="sheet-q-hint">
              Apakah semua dugaan sifat sampelmu (asam kuat, asam lemah, netral, basa) terbukti benar? Jika ada dugaan yang berbeda/keliru, apa faktor kimiawi yang menjelaskannya?
            </p>
            <textarea
              id="q-hypothesis"
              className="sheet-textarea"
              rows={3}
              placeholder="Contoh: Awalnya saya menduga air sabun bersifat netral, namun setelah diteteskan BTB warnanya biru (pH 10) sehingga terbukti basa lemah karena pelepasan ion OH⁻..."
              value={hypothesisEvaluation}
              onChange={(e) => setHypothesisEvaluation(e.target.value)}
            />
          </div>

          {/* Question 2: Kesimpulan Menyeluruh */}
          <div className="sheet-q-box">
            <label htmlFor="q-conclusion" className="sheet-q-label">
              <span className="q-badge">2</span>
              <span>Menarik Kesimpulan Menyeluruh: Apa hakikat sifat larutan asam dan basa?</span>
            </label>
            <p className="sheet-q-hint">
              Sintesiskan definisi asam-basa dari sudut pandang Arrhenius (ion H⁺/OH⁻), Brønsted–Lowry (transfer proton), serta respon terhadap kertas lakmus dan skala pH 0–14.
            </p>
            <textarea
              id="q-conclusion"
              className="sheet-textarea"
              rows={3}
              placeholder="Contoh: Asam adalah spesi yang melepaskan ion H⁺ dalam air atau mendonorkan proton sehingga memiliki pH < 7 dan memerahkan lakmus, sedangkan basa..."
              value={overallConclusion}
              onChange={(e) => setOverallConclusion(e.target.value)}
            />
          </div>

          {/* Question 3: Identifikasi Tantangan & Miskonsepsi */}
          <div className="sheet-q-box">
            <label htmlFor="q-challenging" className="sheet-q-label">
              <span className="q-badge">3</span>
              <span>Identifikasi Tantangan: Bagian materi atau perhitungan apa yang masih membutuhkan bimbingan?</span>
            </label>
            <p className="sheet-q-hint">
              Misal: Menentukan pasangan asam-basa konjugasi, perhitungan pOH basa kuat monovalen, hubungan logaritmik pH, atau trayek indikator sintetis.
            </p>
            <textarea
              id="q-challenging"
              className="sheet-textarea"
              rows={3}
              placeholder="Tuliskan materi atau jenis soal yang masih terasa membingungkan..."
              value={challengingConcept}
              onChange={(e) => setChallengingConcept(e.target.value)}
            />
          </div>

          {/* Question 4: Rencana Tindak Lanjut Belajar */}
          <div className="sheet-q-box">
            <label htmlFor="q-action" className="sheet-q-label">
              <span className="q-badge">4</span>
              <span>Rencana Tindak Lanjut: Langkah konkret apa yang akan kamu lakukan untuk memperdalam penguasaan materi?</span>
            </label>
            <p className="sheet-q-hint">
              Misal: Mengulangi simulasi pengenceran pada Kalkulator pH, membaca ulang pembahasan kuis HOTS, atau menguji sampel bahan dapur lainnya.
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
              <span>Simpan Draf Inkuiri</span>
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
              <span>Cetak Lembar Inkuiri (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
