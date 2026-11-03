import { useState, useCallback } from 'react'
import { MODULE_1_HOTS_QUESTIONS } from '../data/module1QuizData'
import type {
  Module1QuizQuestion,
  QuizAttemptHistory,
  QuizDraftSession,
  StorageStatus,
} from '../types/quiz'
import {
  checkLocalStorageAvailability,
  clearQuizHistory,
  createInitialDraft,
  loadQuizDraft,
  loadQuizHistory,
  resetQuizDraft,
  saveCompletedAttempt,
  saveQuizDraft,
  buildBackendSubmissionPayload,
  syncQuizAttemptToBackend,
} from '../services/quizStorage'

export function QuizSection() {
  const questions: Module1QuizQuestion[] = MODULE_1_HOTS_QUESTIONS
  const totalQuestions = questions.length // 10 soal

  // State penyimpanan dan draf diinisialisasi secara sinkron saat mount
  const [storageStatus] = useState<StorageStatus>(() => checkLocalStorageAvailability())
  const [draft, setDraft] = useState<QuizDraftSession>(() => {
    const { draft: loadedDraft } = loadQuizDraft(questions)
    return loadedDraft
  })
  const [history, setHistory] = useState<QuizAttemptHistory[]>(() => {
    const { history: loadedHistory } = loadQuizHistory()
    return loadedHistory
  })
  const [storageNotice, setStorageNotice] = useState<string | null>(() => {
    const availability = checkLocalStorageAvailability()
    if (!availability.isAvailable && availability.error) return availability.error
    const { error: draftError } = loadQuizDraft(questions)
    if (draftError) return draftError
    const { error: historyError } = loadQuizHistory()
    if (historyError) return historyError
    return null
  })

  // State dialog & drawer
  const [showInstructions, setShowInstructions] = useState<boolean>(true)
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false)
  const [showClearHistoryModal, setShowClearHistoryModal] = useState<boolean>(false)
  const [showHistoryViewModal, setShowHistoryViewModal] = useState<boolean>(false)

  // State sinkronisasi backend (kontrak Bab 4 & Lampiran B)
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  const currentIdx = Math.max(0, Math.min(draft.currentQuestionIndex, totalQuestions - 1))
  const activeQuestion = questions[currentIdx]
  const currentItemState = draft.items[activeQuestion?.id] || {
    questionId: activeQuestion?.id,
    selectedOption: null,
    isSubmitted: false,
    isCorrect: null,
  }

  // Menghitung statistik pengerjaan
  const answeredDraftCount = Object.values(draft.items).filter(
    (item) => item.selectedOption !== null,
  ).length

  const submittedCount = Object.values(draft.items).filter((item) => item.isSubmitted).length
  const allSubmitted = questions.every((q) => draft.items[q.id]?.isSubmitted)

  // Simpan draf ke storage helper
  const persistDraft = useCallback((nextDraft: QuizDraftSession) => {
    setDraft(nextDraft)
    const saveRes = saveQuizDraft(nextDraft)
    if (!saveRes.success && saveRes.error) {
      setStorageNotice(`Penyimpanan draf gagal: ${saveRes.error}`)
    }
  }, [])

  // 1. Alur Memilih Jawaban (Draf Opsi A-E)
  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (draft.isCompleted || currentItemState.isSubmitted) {
      return // Terkunci jika sudah dikirim atau kuis sudah selesai
    }

    const updatedItems = {
      ...draft.items,
      [activeQuestion.id]: {
        ...currentItemState,
        questionId: activeQuestion.id,
        selectedOption: key,
      },
    }

    const updatedDraft: QuizDraftSession = {
      ...draft,
      items: updatedItems,
    }

    persistDraft(updatedDraft)
  }

  // 2. Alur Mengirim Jawaban (Submit, Penilaian, & Penguncian)
  const handleSubmitAnswer = () => {
    if (!currentItemState.selectedOption || currentItemState.isSubmitted || draft.isCompleted) {
      return
    }

    const isCorrect = currentItemState.selectedOption === activeQuestion.correctAnswer
    const submittedAt = new Date().toISOString()

    const updatedItems = {
      ...draft.items,
      [activeQuestion.id]: {
        ...currentItemState,
        isSubmitted: true,
        isCorrect,
        submittedAt,
      },
    }

    const updatedDraft: QuizDraftSession = {
      ...draft,
      items: updatedItems,
      updatedAt: submittedAt,
    }

    persistDraft(updatedDraft)
  }

  // 3. Alur Berpindah Soal (Navigasi dengan Posisi Tersimpan)
  const handleNavigateToQuestion = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= totalQuestions) return
    const updatedDraft: QuizDraftSession = {
      ...draft,
      currentQuestionIndex: targetIdx,
    }
    persistDraft(updatedDraft)
  }

  const handleNextQuestion = () => {
    if (currentIdx < totalQuestions - 1) {
      handleNavigateToQuestion(currentIdx + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      handleNavigateToQuestion(currentIdx - 1)
    }
  }

  // 4. Alur Menyelesaikan Kuis & Menampilkan Skor Akhir
  const handleFinishQuiz = () => {
    if (!allSubmitted) return

    const correctCount = questions.reduce((acc, q) => {
      return draft.items[q.id]?.isCorrect ? acc + 1 : acc
    }, 0)
    const wrongCount = totalQuestions - correctCount

    // Rumus Skor: (Jumlah Benar / 10) * 100
    const finalScore = Math.round((correctCount / totalQuestions) * 100)
    const completedAt = new Date().toISOString()

    const completedAttempt: QuizAttemptHistory = {
      attemptId: draft.attemptId,
      moduleId: draft.moduleId,
      questionVersion: draft.questionVersion,
      totalQuestions,
      correctCount,
      wrongCount,
      score: finalScore,
      items: { ...draft.items },
      startedAt: draft.startedAt,
      completedAt,
      syncedToBackend: false,
    }

    // Simpan ke riwayat lokal tanpa menimpa percobaan sebelumnya
    const saveRes = saveCompletedAttempt(completedAttempt)
    if (saveRes.success) {
      const { history: refreshedHistory } = loadQuizHistory()
      setHistory(refreshedHistory)
    } else if (saveRes.error) {
      setStorageNotice(`Gagal menyimpan hasil percobaan ke riwayat: ${saveRes.error}`)
    }

    const finishedDraft: QuizDraftSession = {
      ...draft,
      isCompleted: true,
      updatedAt: completedAt,
    }
    setDraft(finishedDraft)
  }

  // 5. Alur Percobaan Ulang (Menggunakan ID Percobaan Baru)
  const handleRestartNewAttempt = () => {
    const freshDraft = createInitialDraft(questions)
    persistDraft(freshDraft)
    setSyncStatusMessage(null)
  }

  // 6. Alur Reset Draf Berjalan
  const handleConfirmResetDraft = () => {
    const resetRes = resetQuizDraft(questions)
    setDraft(resetRes.draft)
    setShowResetConfirmModal(false)
    if (!resetRes.success && resetRes.error) {
      setStorageNotice(`Reset draf berhasil di memori, tetapi penyimpanan lokal melaporkan: ${resetRes.error}`)
    }
  }

  // 7. Alur Hapus Seluruh Riwayat dengan Konfirmasi Terpisah
  const handleConfirmClearHistory = () => {
    const clearRes = clearQuizHistory()
    if (clearRes.success) {
      setHistory([])
      setShowClearHistoryModal(false)
      setShowHistoryViewModal(false)
    } else {
      setStorageNotice(`Gagal membersihkan riwayat: ${clearRes.error}`)
    }
  }

  // 8. Alur Simulasi Kontrak Backend (Bab 4 & Lampiran B)
  const handleTriggerBackendSync = async () => {
    if (!draft.isCompleted) return

    const correctCount = questions.reduce((acc, q) => {
      return draft.items[q.id]?.isCorrect ? acc + 1 : acc
    }, 0)
    const wrongCount = totalQuestions - correctCount
    const finalScore = Math.round((correctCount / totalQuestions) * 100)

    const completedAttempt: QuizAttemptHistory = {
      attemptId: draft.attemptId,
      moduleId: draft.moduleId,
      questionVersion: draft.questionVersion,
      totalQuestions,
      correctCount,
      wrongCount,
      score: finalScore,
      items: { ...draft.items },
      startedAt: draft.startedAt,
      completedAt: draft.updatedAt,
      syncedToBackend: false,
    }

    const payload = buildBackendSubmissionPayload(completedAttempt)
    setIsSyncing(true)
    setSyncStatusMessage('Memverifikasi kontrak transmisi ke database...')

    try {
      const result = await syncQuizAttemptToBackend(payload)
      setSyncStatusMessage(result.message)
    } catch {
      setSyncStatusMessage('Terjadi kendala saat memproses kontrak transmisi backend.')
    } finally {
      setIsSyncing(false)
    }
  }

  // Perhitungan statistik akhir setelah kuis selesai
  const finishedCorrectCount = questions.reduce((acc, q) => {
    return draft.items[q.id]?.isCorrect ? acc + 1 : acc
  }, 0)
  const finishedWrongCount = totalQuestions - finishedCorrectCount
  const finishedScore = Math.round((finishedCorrectCount / totalQuestions) * 100)

  // Pengelompokan performa kognitif
  const c3Questions = questions.filter((q) => q.cognitiveLevel === 'C3')
  const c4Questions = questions.filter((q) => q.cognitiveLevel === 'C4')
  const c5Questions = questions.filter((q) => q.cognitiveLevel === 'C5')

  const c3Correct = c3Questions.filter((q) => draft.items[q.id]?.isCorrect).length
  const c4Correct = c4Questions.filter((q) => draft.items[q.id]?.isCorrect).length
  const c5Correct = c5Questions.filter((q) => draft.items[q.id]?.isCorrect).length

  return (
    <section id="kuis-section" className="content-section" aria-labelledby="kuis-heading">
      {/* Header Bagian Kuis */}
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Modul 1 — Mengenal Asam &amp; Basa</span>
          <span className="section-topic-pill">Kuis Formatif 10 Soal HOTS (C3, C4, C5)</span>
        </div>
        <h2 id="kuis-heading" className="section-title">
          Kuis Evaluasi Pemahaman Konsep Modul 1
        </h2>
        <p className="section-description">
          Ukur kemampuan berpikir tingkat tinggi melalui 10 soal pilihan ganda (opsi A–E) berbasis Taksonomi Bloom Revisi:
          mengaplikasikan konsep (C3), menganalisis fenomena dan data (C4), serta mengevaluasi permasalahan kontekstual (C5).
          Jawaban yang dikirim langsung dinilai dan dikunci untuk memberikan umpan balik diagnostik ilmiah.
        </p>
      </div>

      {/* Banner Peringatan Penyimpanan Lokal */}
      {(!storageStatus.isAvailable || storageNotice) && (
        <div
          className={`quiz-storage-banner ${!storageStatus.isAvailable ? 'warning' : 'info'}`}
          role="alert"
        >
          <div className="banner-text">
            <strong>⚠️ Info Penyimpanan:</strong>{' '}
            {storageNotice ||
              'Penyimpanan lokal tidak tersedia atau dibatasi oleh peramban. Draf kuis tetap dapat dikerjakan dalam memori sesi saat ini.'}
          </div>
          {storageNotice && (
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setStorageNotice(null)}
              aria-label="Tutup pemberitahuan penyimpanan"
            >
              Tutup
            </button>
          )}
        </div>
      )}

      {/* Petunjuk Pengerjaan Kuis */}
      <div className="quiz-instructions-box mb-6">
        <div className="instructions-header">
          <div className="instructions-title-row">
            <span className="instructions-icon">📋</span>
            <strong>Petunjuk Pengerjaan Kuis (10 Soal &bull; Opsi A–E &bull; Skor Maksimal 100)</strong>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-cyan"
            onClick={() => setShowInstructions((prev) => !prev)}
            aria-expanded={showInstructions}
          >
            {showInstructions ? 'Sembunyikan Petunjuk ▲' : 'Lihat Petunjuk ▼'}
          </button>
        </div>

        {showInstructions && (
          <div className="instructions-body animate-fade-in">
            <ul className="instructions-list">
              <li>
                <strong>Jumlah Butir:</strong> 10 butir soal pilihan ganda berdistribusi tingkat kognitif:
                <span className="cognitive-pill c3 ml-2 mr-1">C3 (3 soal)</span>
                <span className="cognitive-pill c4 mr-1">C4 (4 soal)</span>
                <span className="cognitive-pill c5 mr-2">C5 (3 soal)</span>.
              </li>
              <li>
                <strong>Pilihan Opsi:</strong> Setiap butir memiliki 5 pilihan jawaban homogen (A, B, C, D, dan E) dengan 1 jawaban paling tepat.
              </li>
              <li>
                <strong>Aturan Penilaian:</strong> Setiap jawaban benar memperoleh <strong>10 poin</strong>, jawaban salah <strong>0 poin</strong>. Skor akhir = (Jawaban Benar / 10) &times; 100.
              </li>
              <li>
                <strong>Penguncian Diagnostik:</strong> Tombol <em>Kirim Jawaban</em> aktif setelah memilih salah satu opsi. Setelah dikirim, jawaban terkunci dan pembahasan ilmiah mendalam akan langsung terbuka.
              </li>
              <li>
                <strong>Penyimpanan Otomatis:</strong> Draf pilihan dan posisi nomor soal tersimpan di <code>localStorage</code> perangkat. Memuat ulang halaman tidak akan menghilangkan progres pengerjaan.
              </li>
            </ul>
          </div>
        )}
      </div>

      {!draft.isCompleted ? (
        /* ================= TAMPILAN PENGERJAAN SOAL ================= */
        <div className="quiz-card-wrapper">
          {/* Top Status Bar: ID Percobaan, Versi, & Progres */}
          <div className="quiz-top-bar">
            <div className="quiz-progress-text">
              <span className="font-semibold text-lg">Soal {currentIdx + 1}</span> dari {totalQuestions}
              <span className={`quiz-cognitive-badge badge-${activeQuestion?.cognitiveLevel.toLowerCase()}`}>
                {activeQuestion?.cognitiveLabel}
              </span>
              <span className="quiz-version-badge" title="Versi butir soal terstruktur Modul 1">
                v{draft.questionVersion}
              </span>
            </div>

            <div className="quiz-status-meta">
              <span
                className="quiz-session-id"
                title={`ID Percobaan Sesi: ${draft.attemptId} (tetap selama satu sesi percobaan)`}
              >
                ID Sesi: <code>{draft.attemptId.substring(0, 15)}...</code>
              </span>
              <div className="quiz-answered-count">
                Terkirim: <strong>{submittedCount}</strong> / {totalQuestions}
                <span className="text-muted ml-2">
                  (Draf: {answeredDraftCount}/{totalQuestions})
                </span>
              </div>
            </div>
          </div>

          {/* Baris Tombol Navigasi Nomor Soal (1..10) */}
          <div className="quiz-nav-nums" role="navigation" aria-label="Navigasi Nomor Soal Kuis Modul 1">
            {questions.map((q, idx) => {
              const item = draft.items[q.id]
              const isCurrent = idx === currentIdx
              const isSubmitted = Boolean(item?.isSubmitted)
              const hasDraftAnswer = item?.selectedOption !== null && !isSubmitted
              const isCorrect = item?.isCorrect === true

              let statusCls = ''
              if (isSubmitted) {
                statusCls = isCorrect ? 'submitted-correct' : 'submitted-wrong'
              } else if (hasDraftAnswer) {
                statusCls = 'answered'
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  className={`quiz-num-btn ${isCurrent ? 'current' : ''} ${statusCls}`}
                  onClick={() => handleNavigateToQuestion(idx)}
                  aria-label={`Soal nomor ${idx + 1}: ${
                    isSubmitted
                      ? isCorrect
                        ? 'Terkirim dan Benar'
                        : 'Terkirim dan Kurang Tepat'
                      : hasDraftAnswer
                        ? 'Draf Jawaban Dipilih'
                        : 'Belum Dijawab'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span>{idx + 1}</span>
                  {isSubmitted && (
                    <span className="quiz-num-icon-sub" aria-hidden="true">
                      {isCorrect ? '✓' : '✕'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Area Konten Soal */}
          <div className="quiz-body-area">
            {/* Topik dan Indikator Soal */}
            <div className="quiz-meta-info-row">
              <span className="text-cyan font-semibold text-xs tracking-wider uppercase">
                {activeQuestion.topic}
              </span>
              <span className="text-muted text-xs">
                Indikator: {activeQuestion.indicator}
              </span>
            </div>

            {/* Stimulus Soal jika ada */}
            {activeQuestion.stimulus && (
              <div className="quiz-stimulus-box" role="region" aria-label="Stimulus Soal">
                <div className="stimulus-label">
                  <span className="stimulus-icon">🔬</span>
                  <strong>Stimulus / Data Percobaan:</strong>
                </div>
                <div className="stimulus-content whitespace-pre-line font-mono text-sm">
                  {activeQuestion.stimulus}
                </div>
              </div>
            )}

            {/* Teks Pertanyaan Utama */}
            <p className="quiz-question-text" id={`question-text-${activeQuestion.id}`}>
              {activeQuestion.question}
            </p>

            {/* Daftar Lima Pilihan Jawaban (A, B, C, D, E) */}
            <div
              className="quiz-options-list"
              role="radiogroup"
              aria-labelledby={`question-text-${activeQuestion.id}`}
            >
              {activeQuestion.options.map((opt) => {
                const isSelected = currentItemState.selectedOption === opt.key
                const isSubmitted = currentItemState.isSubmitted
                const isCorrectOption = opt.key === activeQuestion.correctAnswer

                let optionStateClass = ''
                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStateClass = 'option-correct'
                  } else if (isSelected) {
                    optionStateClass = 'option-wrong'
                  }
                } else if (isSelected) {
                  optionStateClass = 'option-selected'
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isSubmitted}
                    tabIndex={isSubmitted ? -1 : 0}
                    className={`quiz-option-btn ${optionStateClass}`}
                    onClick={() => handleSelectOption(opt.key)}
                    onKeyDown={(e) => {
                      if (!isSubmitted && (e.key === ' ' || e.key === 'Enter')) {
                        e.preventDefault()
                        handleSelectOption(opt.key)
                      }
                    }}
                  >
                    <span className="option-key-badge">{opt.key}</span>
                    <span className="option-label-text">{opt.text}</span>

                    {/* Penanda Jawaban Setelah Dikirim */}
                    {isSubmitted && isCorrectOption && (
                      <span className="option-result-icon correct" title="Jawaban Benar">
                        ✓ Benar (+10 Poin)
                      </span>
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <span className="option-result-icon wrong" title="Jawaban Kurang Tepat">
                        ✕ Kurang Tepat (0 Poin)
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Kotak Pembahasan Ilmiah (Tampil Setelah Jawaban Dikirim) */}
            {currentItemState.isSubmitted && (
              <div
                className={`quiz-explanation-box animate-fade-in ${
                  currentItemState.isCorrect ? 'expl-correct' : 'expl-wrong'
                }`}
                role="region"
                aria-label="Pembahasan Soal"
              >
                <div className="explanation-header">
                  <span className="explanation-icon">
                    {currentItemState.isCorrect ? '✅' : '💡'}
                  </span>
                  <strong>
                    {currentItemState.isCorrect
                      ? `Jawaban Anda Benar! (+10 Poin) — Pembahasan Soal ${currentIdx + 1}:`
                      : `Jawaban Kurang Tepat (0 Poin) — Kunci Jawaban: [${activeQuestion.correctAnswer}]. Pembahasan Soal ${currentIdx + 1}:`}
                  </strong>
                </div>

                <p className="explanation-detail">{activeQuestion.explanation}</p>

                {/* Alasan Jawaban Benar */}
                <div className="explanation-reason-block">
                  <strong className="text-success">Mengapa Pilihan {activeQuestion.correctAnswer} Tepat?</strong>
                  <p className="text-sm mt-1">{activeQuestion.correctReason}</p>
                </div>

                {/* Pembahasan Mengapa Distraktor Lain Keliru */}
                {activeQuestion.distractorExplanations && (
                  <div className="explanation-distractors-block">
                    <strong className="text-secondary text-xs uppercase tracking-wider">
                      Analisis Pilihan Jawaban Lainnya:
                    </strong>
                    <ul className="distractor-list mt-2">
                      {Object.entries(activeQuestion.distractorExplanations).map(([optKey, desc]) => (
                        <li key={optKey} className="distractor-item">
                          <span className="distractor-badge">{optKey}</span>
                          <span className="distractor-text">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="explanation-lock-note">
                  🔒 <em>Jawaban telah dikunci secara diagnostik dan tidak dapat dimanipulasi pada sesi percobaan ini.</em>
                </div>
              </div>
            )}
          </div>

          {/* Bagian Tombol Aksi Kuis */}
          <div className="quiz-footer-actions">
            <div className="footer-left">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handlePrevQuestion}
                disabled={currentIdx === 0}
                aria-label="Pindah ke soal sebelumnya"
              >
                ← Sebelumnya
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleNextQuestion}
                disabled={currentIdx === totalQuestions - 1}
                aria-label="Pindah ke soal berikutnya"
              >
                Berikutnya →
              </button>

              {/* Tombol Reset Draf Sesi Berjalan */}
              <button
                type="button"
                className="btn btn-ghost text-muted"
                onClick={() => setShowResetConfirmModal(true)}
                title="Mulai ulang pengerjaan draf sesi aktif ini"
                aria-label="Buka dialog konfirmasi reset draf"
              >
                🔄 Reset Draf
              </button>
            </div>

            <div className="footer-right">
              {/* Tombol Kirim Jawaban (Hanya aktif jika draf opsi dipilih dan belum dikirim) */}
              {!currentItemState.isSubmitted ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSubmitAnswer}
                  disabled={!currentItemState.selectedOption}
                  aria-label="Kirim dan kunci jawaban soal ini"
                >
                  Kirim Jawaban Soal Ini
                </button>
              ) : (
                <span className="text-checked-badge">
                  ✓ Jawaban Terkunci &amp; Dinilai
                </span>
              )}

              {/* Tombol Selesaikan Kuis (Muncul saat seluruh 10 soal telah dikirim) */}
              {allSubmitted ? (
                <button
                  type="button"
                  className="btn btn-primary animate-pulse"
                  onClick={handleFinishQuiz}
                  aria-label="Selesaikan seluruh 10 soal dan lihat hasil penilaian"
                >
                  🏆 Selesaikan Kuis &amp; Lihat Skor
                </button>
              ) : (
                <span className="quiz-unsubmitted-hint" title="Kirim seluruh 10 butir soal untuk membuka skor akhir">
                  ({submittedCount}/10 soal terkirim)
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ================= TAMPILAN RINGKASAN SKOR AKHIR ================= */
        <div className="quiz-summary-card animate-fade-in" role="region" aria-label="Hasil Kuis Modul 1">
          <div className="summary-header-badge">
            {finishedScore >= 80
              ? '🏆 Sangat Baik (Tuntas HOTS)'
              : finishedScore >= 60
                ? '🌟 Cukup Baik (Perlu Pemantapan)'
                : '📚 Perlu Remedial Pemahaman Konsep'}
          </div>

          <h3 className="summary-title">Laporan Hasil Penilaian Kuis Modul 1</h3>

          {/* Lingkaran Skor Kuis */}
          <div className="score-circle-wrapper">
            <div className="score-circle">
              <span className="score-num font-mono">{finishedScore}</span>
              <span className="score-denom">/ 100</span>
            </div>
            <p className="score-formula-hint">
              Rumus: <code>(Jawaban Benar / 10) &times; 100</code>
            </p>
          </div>

          {/* Rincian Jawaban Benar dan Salah */}
          <div className="score-breakdown-cards">
            <div className="breakdown-card correct-card">
              <span className="breakdown-num font-mono text-success">{finishedCorrectCount}</span>
              <span className="breakdown-label">Jawaban Benar (x10)</span>
            </div>
            <div className="breakdown-card wrong-card">
              <span className="breakdown-num font-mono text-danger">{finishedWrongCount}</span>
              <span className="breakdown-label">Jawaban Salah (x0)</span>
            </div>
            <div className="breakdown-card total-card">
              <span className="breakdown-num font-mono text-cyan">{totalQuestions}</span>
              <span className="breakdown-label">Total Butir Soal</span>
            </div>
          </div>

          {/* Analisis Distribusi Tingkat Kognitif Bloom Revisi */}
          <div className="cognitive-performance-card mb-6">
            <h4 className="cognitive-perf-title">Distribusi Capaian Berdasarkan Tingkat Kognitif:</h4>
            <div className="cognitive-perf-grid">
              <div className="cognitive-perf-item">
                <span className="cognitive-perf-badge c3">C3 — Mengaplikasikan</span>
                <span className="cognitive-perf-stat">
                  <strong>{c3Correct}</strong> / {c3Questions.length} Soal
                </span>
                <div className="cognitive-progress-bar">
                  <div
                    className="progress-fill fill-c3"
                    style={{ width: `${(c3Correct / c3Questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="cognitive-perf-item">
                <span className="cognitive-perf-badge c4">C4 — Menganalisis</span>
                <span className="cognitive-perf-stat">
                  <strong>{c4Correct}</strong> / {c4Questions.length} Soal
                </span>
                <div className="cognitive-progress-bar">
                  <div
                    className="progress-fill fill-c4"
                    style={{ width: `${(c4Correct / c4Questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="cognitive-perf-item">
                <span className="cognitive-perf-badge c5">C5 — Mengevaluasi</span>
                <span className="cognitive-perf-stat">
                  <strong>{c5Correct}</strong> / {c5Questions.length} Soal
                </span>
                <div className="cognitive-progress-bar">
                  <div
                    className="progress-fill fill-c5"
                    style={{ width: `${(c5Correct / c5Questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Meta Percobaan & Penyimpanan */}
          <div className="summary-session-metadata">
            <div className="meta-badge-item">
              <span className="meta-label">ID Percobaan:</span>
              <code className="meta-value">{draft.attemptId}</code>
            </div>
            <div className="meta-badge-item">
              <span className="meta-label">Versi Soal:</span>
              <span className="meta-value">v{draft.questionVersion} (10 Soal A–E)</span>
            </div>
            <div className="meta-badge-item">
              <span className="meta-label">Penyimpanan:</span>
              <span className="meta-value text-success">
                ✓ Local Storage Perangkat
              </span>
            </div>
          </div>

          {/* Umpan Balik Pedagogis */}
          <div className="score-feedback-text">
            {finishedScore >= 80 ? (
              <p>
                Luar biasa! Kemampuan berpikir tingkat tinggi kamu pada Modul 1 sudah sangat terasah.
                Kamu mampu mengaplikasikan teori asam-basa, menganalisis data eksperimen, serta mengevaluasi
                permasalahan kontekstual secara komprehensif. Lanjutkan pembelajaran ke Modul 2 untuk uji coba indikator virtual!
              </p>
            ) : finishedScore >= 60 ? (
              <p>
                Kerja yang baik! Kamu telah menguasai sebagian besar konsep dasar asam-basa.
                Pelajari kembali ulasan butir soal tingkat analisis (C4) dan evaluasi (C5) di bawah ini
                untuk memperkuat ketajaman penalaran ilmiahmu.
              </p>
            ) : (
              <p>
                Jangan patah semangat! Pelajari kembali materi Modul 1 mengenai 3 Teori Asam-Basa,
                sifat elektrolit larutan, dan reaksi penetralan. Setelah memahami materi, klik tombol di bawah
                untuk mengulang kuis dengan percobaan baru.
              </p>
            )}
          </div>

          {/* Kesiapan Kontrak Backend (Bab 4 & Lampiran B) */}
          <div className="quiz-backend-contract-box">
            <div className="contract-box-header">
              <span className="contract-icon">🔌</span>
              <strong>Kesiapan Transmisi Database Server (Bab 4 &amp; Lampiran B)</strong>
            </div>
            <p className="contract-box-desc">
              Data penilaian 10 butir soal ini telah terstruktur rapi sesuai spesifikasi kontrak API. Bila backend diaktifkan,
              data dapat disinkronkan ke server basis data tanpa mengubah format lokal.
            </p>
            <div className="contract-box-action">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleTriggerBackendSync}
                disabled={isSyncing}
              >
                {isSyncing ? 'Memproses Transmisi...' : 'Uji Kontrak Sinkronisasi Backend'}
              </button>
            </div>
            {syncStatusMessage && (
              <div className="contract-sync-message animate-fade-in" role="status">
                {syncStatusMessage}
              </div>
            )}
          </div>

          {/* Ulasan Menyeluruh 10 Butir Soal */}
          <div className="summary-review-list">
            <h4 className="review-title">Pembahasan Menyeluruh 10 Soal Pilihan Ganda (A–E):</h4>
            {questions.map((q, idx) => {
              const item = draft.items[q.id]
              const userAns = item?.selectedOption
              const isCorrect = item?.isCorrect === true

              return (
                <div
                  key={q.id}
                  className={`review-question-item ${isCorrect ? 'item-correct' : 'item-wrong'}`}
                >
                  <div className="review-q-header">
                    <span className="review-q-num">
                      Soal {idx + 1} &bull;{' '}
                      <span className={`quiz-cognitive-badge badge-${q.cognitiveLevel.toLowerCase()}`}>
                        {q.cognitiveLevel}
                      </span>{' '}
                      &bull; <span className="text-cyan">{q.topic}</span>
                    </span>
                    <span className={`review-q-status ${isCorrect ? 'correct' : 'wrong'}`}>
                      {isCorrect ? '✓ Benar (+10 Poin)' : '✕ Kurang Tepat (0 Poin)'}
                    </span>
                  </div>

                  {q.stimulus && (
                    <div className="review-stimulus-box font-mono text-xs mb-2">
                      {q.stimulus}
                    </div>
                  )}

                  <p className="review-q-text">{q.question}</p>

                  <div className="review-answers-row">
                    <span>
                      Jawabanmu:{' '}
                      <strong className={isCorrect ? 'text-success' : 'text-danger'}>
                        {userAns ? `${userAns}` : '(Tidak Dijawab)'}
                      </strong>
                    </span>
                    <span>
                      Kunci Jawaban:{' '}
                      <strong className="text-success">{q.correctAnswer}</strong>
                    </span>
                  </div>

                  <div className="review-expl-box mb-2">
                    <strong>Pembahasan Ilmiah:</strong> {q.explanation}
                  </div>

                  <div className="review-reason-box text-xs mb-2">
                    <strong className="text-success">Alasan Jawaban Benar:</strong> {q.correctReason}
                  </div>

                  {q.distractorExplanations && (
                    <div className="review-distractors-box text-xs">
                      <strong>Analisis Opsi Lainnya:</strong>
                      <ul className="mt-1 space-y-1">
                        {Object.entries(q.distractorExplanations).map(([optK, optD]) => (
                          <li key={optK}>
                            <code>[{optK}]</code>: {optD}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Tombol Aksi Akhir */}
          <div className="summary-footer-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRestartNewAttempt}
              aria-label="Mulai percobaan kuis baru dengan ID sesi baru"
            >
              🔄 Mulai Percobaan Baru
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowHistoryViewModal(true)}
              aria-label="Buka riwayat seluruh percobaan kuis"
            >
              📜 Riwayat Percobaan ({history.length})
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: KONFIRMASI RESET DRAF ================= */}
      {showResetConfirmModal && (
        <div
          className="modal-backdrop animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className="modal-card quiz-confirm-modal">
            <div className="modal-header">
              <h3 id="reset-modal-title" className="modal-heading">
                Konfirmasi Reset Draf
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowResetConfirmModal(false)}
                aria-label="Tutup dialog reset draf"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-modal-desc">
                Apakah Anda yakin ingin <strong>mereset draf pengerjaan saat ini</strong>?
              </p>
              <p className="confirm-modal-sub">
                Pilihan jawaban pada sesi berjalan ini akan dikosongkan dan soal akan dikembalikan ke nomor 1.
                Riwayat percobaan sebelumnya yang sudah selesai tetap aman dan tidak akan terhapus.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowResetConfirmModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmResetDraft}
              >
                Ya, Reset Draf
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RIWAYAT PERCOBAAN ================= */}
      {showHistoryViewModal && (
        <div
          className="modal-backdrop animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-modal-title"
        >
          <div className="modal-card quiz-history-modal">
            <div className="modal-header">
              <h3 id="history-modal-title" className="modal-heading">
                Riwayat Percobaan Kuis Modul 1
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowHistoryViewModal(false)}
                aria-label="Tutup riwayat percobaan"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {history.length === 0 ? (
                <div className="history-empty-state">
                  <p>Belum ada riwayat percobaan kuis yang diselesaikan pada perangkat ini.</p>
                </div>
              ) : (
                <div className="history-table-wrapper">
                  <table className="history-table" aria-label="Tabel Catatan Skor Kuis">
                    <thead>
                      <tr>
                        <th>Waktu Selesai</th>
                        <th>ID Percobaan</th>
                        <th>Versi</th>
                        <th>Benar / Salah</th>
                        <th>Skor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, i) => (
                        <tr key={item.attemptId || i}>
                          <td>{new Date(item.completedAt).toLocaleString('id-ID')}</td>
                          <td>
                            <code className="text-xs">{item.attemptId}</code>
                          </td>
                          <td>v{item.questionVersion}</td>
                          <td>
                            <span className="text-success font-semibold">{item.correctCount}</span> B /{' '}
                            <span className="text-danger font-semibold">{item.wrongCount ?? (item.totalQuestions - item.correctCount)}</span> S
                          </td>
                          <td>
                            <strong
                              className={
                                item.score >= 80
                                  ? 'text-success'
                                  : item.score >= 60
                                    ? 'text-cyan'
                                    : 'text-warning'
                              }
                            >
                              {item.score}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer justify-between">
              {history.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger-outline"
                  onClick={() => setShowClearHistoryModal(true)}
                >
                  🗑️ Hapus Seluruh Riwayat
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowHistoryViewModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KONFIRMASI HAPUS SELURUH RIWAYAT ================= */}
      {showClearHistoryModal && (
        <div
          className="modal-backdrop animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-history-title"
        >
          <div className="modal-card quiz-confirm-modal">
            <div className="modal-header">
              <h3 id="clear-history-title" className="modal-heading text-danger">
                Konfirmasi Hapus Seluruh Riwayat
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowClearHistoryModal(false)}
                aria-label="Tutup dialog konfirmasi"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-modal-desc">
                Apakah Anda benar-benar yakin ingin <strong>menghapus seluruh riwayat kuis</strong> yang tersimpan pada perangkat ini?
              </p>
              <p className="confirm-modal-sub text-danger">
                Tindakan ini permanen dan akan menghapus semua catatan percobaan sebelumnya dari Local Storage peramban Anda. Draf sesi yang sedang aktif tidak akan terhapus.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowClearHistoryModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmClearHistory}
              >
                Ya, Hapus Semua Riwayat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
