import type { StudentActivityResult } from '../../types/teacher'
import { getQuestionsByVersion } from '../../services/classroomService'

interface ActivityDetailTabProps {
  activity: StudentActivityResult | null
  onBackToList: () => void
}

export function ActivityDetailTab({ activity, onBackToList }: ActivityDetailTabProps) {
  if (!activity) {
    return (
      <div className="panel-state-card animate-fade-in">
        <div className="panel-state-icon">📋</div>
        <h3>Belum Ada Aktivitas yang Dipilih</h3>
        <p>Silakan pilih salah satu data siswa pada tabel Daftar Hasil untuk melihat rincian jawaban.</p>
        <button type="button" className="btn-action-detail" onClick={onBackToList}>
          ← Kembali ke Daftar Hasil
        </button>
      </div>
    )
  }

  // 1. Verifikasi Kecocokan Versi Bank Soal
  const questions = getQuestionsByVersion(activity.questionVersion)
  const isVersionAvailable = questions !== null

  return (
    <div className="tab-detail-content animate-fade-in">
      {/* Tombol Kembali & Info Singkat */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button type="button" className="btn-action-detail" onClick={onBackToList}>
          ← Kembali ke Daftar Hasil
        </button>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          ID Percobaan: <strong style={{ color: '#1e293b' }}>{activity.id}</strong>
        </span>
      </div>

      {/* Kartu Informasi Umum Aktivitas */}
      <div className="activity-detail-overview">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="teacher-meta-pill">
                {activity.activityType === 'kuis_evaluasi'
                  ? 'Kuis Formatif HOTS'
                  : activity.activityType === 'lab_simulasi'
                  ? 'Eksperimen Lab Virtual'
                  : 'Uji Diagnostik'}
              </span>
              {activity.isSampleData ? (
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: '1px solid #cbd5e1' }}>
                  🧪 Data Contoh (Preview Sistem)
                </span>
              ) : (
                <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: '1px solid #bbf7d0' }}>
                  👤 Data Siswa Nyata
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '4px 0' }}>
              {activity.activityTitle}
            </h2>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              Nama Alias Siswa: <strong style={{ color: '#0f172a' }}>{activity.alias}</strong>
              {activity.schoolClass && ` • Kelas ${activity.schoolClass}`}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
              Nilai Akhir
            </div>
            <div
              className={`score-badge ${
                activity.score !== null && activity.score !== undefined
                  ? activity.score >= 80 ? 'high' : activity.score >= 60 ? 'medium' : 'low'
                  : 'neutral'
              }`}
              style={{ fontSize: '24px', padding: '4px 14px' }}
            >
              {activity.score !== null && activity.score !== undefined ? activity.score : '—'}
            </div>
          </div>
        </div>

        <div className="detail-grid-meta">
          <div className="detail-meta-box">
            <label>ID Percobaan (Kekal)</label>
            <span style={{ fontFamily: 'monospace' }}>{activity.id}</span>
          </div>

          <div className="detail-meta-box">
            <label>Versi Bank Soal</label>
            <span style={{ fontFamily: 'monospace', color: '#7c3aed' }}>
              v{activity.questionVersion}
            </span>
          </div>

          <div className="detail-meta-box">
            <label>Waktu Selesai (Perangkat Siswa)</label>
            <span>
              {new Date(activity.completedAt).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}{' '}
              WIB
            </span>
          </div>

          <div className="detail-meta-box">
            <label>Waktu Diterima Server</label>
            <span>
              {new Date(activity.serverReceivedAt).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}{' '}
              WIB
            </span>
          </div>
        </div>

        {activity.teacherFeedback && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              color: '#15803d',
              fontSize: '13px',
            }}
          >
            <strong>Catatan Pembimbing Guru ({activity.teacherRating || 'Baik'}):</strong>{' '}
            {activity.teacherFeedback}
          </div>
        )}
      </div>

      {/* Peringatan Jika Versi Soal Tidak Ditemukan */}
      {!isVersionAvailable && (
        <div
          style={{
            background: '#fffbeb',
            border: '2px solid #fcd34d',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            color: '#92400e',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              Versi Bank Soal "{activity.questionVersion}" Tidak Ditemukan di Sistem
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
            Data butir soal, kunci jawaban, dan pembahasan untuk versi ini tidak tersedia di repositori sistem saat ini.
            Sistem <strong>tidak melakukan penilaian ulang menggunakan kunci versi terbaru</strong> guna menjaga keaslian data historis siswa.
            Berikut adalah rekaman jawaban mentah yang dikirim oleh siswa:
          </p>
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #fde68a',
              fontFamily: 'monospace',
              fontSize: '13px',
            }}
          >
            {JSON.stringify(activity.answers, null, 2)}
          </div>
        </div>
      )}

      {/* Rincian Jawaban Per Butir Soal (Jika versi valid) */}
      {isVersionAvailable && (
        <div className="questions-detail-section">
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              Rincian Jawaban Per Butir Soal ({questions.length} Soal)
            </h3>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Akurasi: {activity.correctCount} Benar • {activity.wrongCount} Salah
            </span>
          </div>

          {(!activity.answers || Object.keys(activity.answers).length === 0) && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px 18px', marginBottom: '20px', color: '#475569', fontSize: '13px' }}>
              <strong>ℹ️ Rincian Pilihan Jawaban Tidak Tersedia:</strong> Rekaman aktivitas ini tidak memuat data pilihan butir soal per nomor (misalnya data arsip lama atau data sebelum rincian jawaban diaktifkan). Sistem tidak merekonstruksi jawaban secara buatan demi menjamin keaslian data.
            </div>
          )}

          {questions.map((q) => {
            const studentChoice = activity.answers
              ? (activity.answers[String(q.questionNumber)] ?? activity.answers[String(q.id)])
              : undefined
            const hasAnswered = studentChoice !== undefined && studentChoice !== null && studentChoice !== ''
            const isCorrect = hasAnswered && studentChoice === q.correctAnswer

            return (
              <div
                key={q.id}
                className={`question-detail-card ${
                  !hasAnswered ? 'unanswered' : isCorrect ? 'correct' : 'wrong'
                }`}
              >
                {/* Header Butir Soal */}
                <div className="q-header-row">
                  <div className="q-badge-group">
                    <span className="q-num-badge">Soal #{q.questionNumber}</span>
                    <span className="q-cog-badge">{q.cognitiveLabel}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>ID: {q.id}</span>
                  </div>

                  <div>
                    {!hasAnswered ? (
                      <span className="q-status-badge unanswered">⚠️ Tidak Tersedia / Kosong</span>
                    ) : isCorrect ? (
                      <span className="q-status-badge correct">✅ Jawaban Benar (+10 Poin)</span>
                    ) : (
                      <span className="q-status-badge wrong">❌ Jawaban Salah (0 Poin)</span>
                    )}
                  </div>
                </div>

                {/* Indikator Pembelajaran */}
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                  <strong>Indikator:</strong> {q.indicator}
                </div>

                {/* Stimulus Soal */}
                {q.stimulus && (
                  <div className="q-stimulus-box">
                    <strong>Stimulus / Konteks:</strong>
                    <div>{q.stimulus}</div>
                  </div>
                )}

                {/* Pertanyaan */}
                <div className="q-text">{q.question}</div>

                {/* 5 Opsi Jawaban A–E */}
                <div className="options-review-list">
                  {q.options.map((opt) => {
                    const isKey = opt.key === q.correctAnswer
                    const isChosen = studentChoice === opt.key
                    const isStudentWrong = isChosen && !isKey

                    return (
                      <div
                        key={opt.key}
                        className={`option-review-item ${isKey ? 'is-key' : ''} ${
                          isStudentWrong ? 'is-student-wrong' : ''
                        }`}
                      >
                        <span className="option-review-key">{opt.key}</span>
                        <div style={{ flex: 1 }}>
                          <span>{opt.text}</span>
                          {isKey && (
                            <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 700, color: '#15803d' }}>
                              (Kunci Jawaban Resmi)
                            </span>
                          )}
                          {isChosen && (
                            <span
                              style={{
                                marginLeft: '8px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: isKey ? '#15803d' : '#e11d48',
                              }}
                            >
                              (Dipilih oleh Siswa)
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pembahasan Soal Ilmiah */}
                <div className="q-explanation-card">
                  <div className="q-explanation-title">💡 Pembahasan Ilmiah:</div>
                  <p style={{ margin: '0 0 6px 0', lineHeight: 1.45 }}>{q.explanation}</p>
                  <div style={{ fontSize: '12px', color: '#86198f' }}>
                    <strong>Alasan Benar:</strong> {q.correctReason}
                  </div>
                  {!isCorrect && hasAnswered && q.distractorExplanations[studentChoice] && (
                    <div style={{ fontSize: '12px', color: '#9f1239', marginTop: '6px', borderTop: '1px dashed #f0abfc', paddingTop: '6px' }}>
                      <strong>Mengapa Opsi {studentChoice} Keliru:</strong> {q.distractorExplanations[studentChoice]}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

