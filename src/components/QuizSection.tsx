import { useState } from 'react'
import { QUIZ_QUESTIONS } from '../data/chemistryData'

export function QuizSection() {
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({})
  const [isFinished, setIsFinished] = useState<boolean>(false)

  const activeQuestion = QUIZ_QUESTIONS[currentIdx]
  const totalQuestions = QUIZ_QUESTIONS.length

  const handleSelectOption = (key: string) => {
    if (isFinished) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: key,
    }))
  }

  const handleCheckCurrent = () => {
    if (!selectedAnswers[activeQuestion.id]) return
    setShowExplanation((prev) => ({
      ...prev,
      [activeQuestion.id]: true,
    }))
  }

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1)
    }
  }

  const handleFinish = () => {
    // Reveal all explanations
    const allExpl: Record<number, boolean> = {}
    QUIZ_QUESTIONS.forEach((q) => {
      allExpl[q.id] = true
    })
    setShowExplanation(allExpl)
    setIsFinished(true)
  }

  const handleRestart = () => {
    setSelectedAnswers({})
    setShowExplanation({})
    setIsFinished(false)
    setCurrentIdx(0)
  }

  // Calculate score
  const correctCount = QUIZ_QUESTIONS.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctAnswer ? acc + 1 : acc
  }, 0)

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100)
  const answeredCount = Object.keys(selectedAnswers).length

  return (
    <section id="kuis-section" className="content-section" aria-labelledby="kuis-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Evaluasi Formatif</span>
          <span className="section-topic-pill">Kuis Pemahaman Asam-Basa</span>
        </div>
        <h2 id="kuis-heading" className="section-title">
          Uji Pemahaman Konsep Asam &amp; Basa
        </h2>
        <p className="section-description">
          Ukur pemahamanmu terhadap teori, pengujian indikator, perhitungan pH, dan reaksi netralisasi.
          Setiap soal dilengkapi pembahasan ilmiah mendalam untuk memperkuat konsep kimia Anda.
        </p>
      </div>

      {!isFinished ? (
        <div className="quiz-card-wrapper">
          {/* Quiz Top Status Bar */}
          <div className="quiz-top-bar">
            <div className="quiz-progress-text">
              <span className="font-semibold">Soal {currentIdx + 1}</span> dari{' '}
              {totalQuestions}
              <span className="quiz-topic-badge">{activeQuestion.topic}</span>
            </div>

            <div className="quiz-answered-count">
              Terjawab: <strong>{answeredCount}</strong> / {totalQuestions}
            </div>
          </div>

          {/* Number Navigation Buttons */}
          <div className="quiz-nav-nums" role="navigation" aria-label="Navigasi Soal Kuis">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const isSelected = selectedAnswers[q.id] !== undefined
              const isCurrent = idx === currentIdx
              return (
                <button
                  key={q.id}
                  type="button"
                  className={`quiz-num-btn ${isCurrent ? 'current' : ''} ${
                    isSelected ? 'answered' : ''
                  }`}
                  onClick={() => setCurrentIdx(idx)}
                  aria-label={`Beralih ke soal nomor ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {/* Question Body */}
          <div className="quiz-body-area">
            <p className="quiz-question-text">{activeQuestion.question}</p>

            <div className="quiz-options-list" role="radiogroup">
              {activeQuestion.options.map((opt) => {
                const isSelected = selectedAnswers[activeQuestion.id] === opt.key
                const isChecked = showExplanation[activeQuestion.id]
                const isCorrect = opt.key === activeQuestion.correctAnswer

                let statusClass = ''
                if (isChecked) {
                  if (isCorrect) statusClass = 'option-correct'
                  else if (isSelected) statusClass = 'option-wrong'
                } else if (isSelected) {
                  statusClass = 'option-selected'
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`quiz-option-btn ${statusClass}`}
                    onClick={() => handleSelectOption(opt.key)}
                  >
                    <span className="option-key-badge">{opt.key}</span>
                    <span className="option-label-text">{opt.text}</span>
                    {isChecked && isCorrect && (
                      <span className="option-result-icon correct" title="Jawaban Benar">
                        ✓
                      </span>
                    )}
                    {isChecked && isSelected && !isCorrect && (
                      <span className="option-result-icon wrong" title="Jawaban Kurang Tepat">
                        ✕
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation box if checked */}
            {showExplanation[activeQuestion.id] && (
              <div className="quiz-explanation-box animate-fade-in">
                <div className="explanation-header">
                  <span className="explanation-icon">💡</span>
                  <strong>Pembahasan Ilmiah Soal {currentIdx + 1}:</strong>
                </div>
                <p className="explanation-detail">{activeQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Quiz Action Buttons */}
          <div className="quiz-footer-actions">
            <div className="footer-left">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                ← Sebelumnya
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleNext}
                disabled={currentIdx === totalQuestions - 1}
              >
                Berikutnya →
              </button>
            </div>

            <div className="footer-right">
              {!showExplanation[activeQuestion.id] ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCheckCurrent}
                  disabled={!selectedAnswers[activeQuestion.id]}
                >
                  Periksa Jawaban Soal Ini
                </button>
              ) : (
                <span className="text-checked-badge">✓ Sudah Diperiksa</span>
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinish}
              >
                Selesaikan Kuis &amp; Lihat Skor
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Score Summary Report Card */
        <div className="quiz-summary-card animate-fade-in">
          <div className="summary-header-badge">
            {scorePercentage >= 80 ? '🏆 Hasil Luar Biasa!' : scorePercentage >= 60 ? '🌟 Hasil Baik!' : '📚 Terus Semangat!'}
          </div>

          <h3 className="summary-title">Ringkasan Hasil Evaluasi Formatif</h3>

          <div className="score-circle-wrapper">
            <div className="score-circle">
              <span className="score-num font-mono">{scorePercentage}</span>
              <span className="score-denom">/ 100</span>
            </div>
            <p className="score-detail">
              Kamu menjawab <strong>{correctCount}</strong> benar dari{' '}
              <strong>{totalQuestions}</strong> butir soal.
            </p>
          </div>

          <div className="score-feedback-text">
            {scorePercentage >= 80 ? (
              <p>
                Selamat! Pemahaman konsep teori, pengujian indikator, dan perhitungan pH kamu sangat solid.
                Pertahankan dan aplikasikan konsep ini dalam studi kimia selanjutnya.
              </p>
            ) : scorePercentage >= 60 ? (
              <p>
                Kerja bagus! Sebagian besar konsep sudah kamu kuasai dengan baik.
                Tinjau kembali pembahasan di bawah untuk memperjelas beberapa bagian yang masih terlewat.
              </p>
            ) : (
              <p>
                Jangan berkecil hati! Pelajari kembali materi Modul 1, Modul 2, dan coba gunakan kalkulator pH
                untuk memperkuat pemahaman konsep, lalu ulangi kuis ini kapan saja.
              </p>
            )}
          </div>

          {/* Review of all questions */}
          <div className="summary-review-list">
            <h4 className="review-title">Pembahasan Seluruh Soal:</h4>
            {QUIZ_QUESTIONS.map((q, idx) => {
              const userAns = selectedAnswers[q.id]
              const isCorrect = userAns === q.correctAnswer
              return (
                <div
                  key={q.id}
                  className={`review-question-item ${isCorrect ? 'item-correct' : 'item-wrong'}`}
                >
                  <div className="review-q-header">
                    <span className="review-q-num">Soal {idx + 1}</span>
                    <span className={`review-q-status ${isCorrect ? 'correct' : 'wrong'}`}>
                      {isCorrect ? '✓ Benar' : '✕ Belum Tepat'}
                    </span>
                  </div>
                  <p className="review-q-text">{q.question}</p>
                  <div className="review-answers-row">
                    <span>
                      Jawabanmu:{' '}
                      <strong className={isCorrect ? 'text-success' : 'text-danger'}>
                        {userAns || '(Tidak dijawab)'}
                      </strong>
                    </span>
                    <span>
                      Kunci Jawaban: <strong className="text-success">{q.correctAnswer}</strong>
                    </span>
                  </div>
                  <div className="review-expl-box">
                    <strong>Penjelasan:</strong> {q.explanation}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="summary-footer-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRestart}
            >
              🔄 Ulangi Kuis dari Awal
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
