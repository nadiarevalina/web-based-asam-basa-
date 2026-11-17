import { useMemo } from 'react'
import type { ItemAnalysisSummary } from '../../types/teacher'
import { generateTeacherRecommendations } from '../../services/classroomService'

interface NextStepsTabProps {
  analysis: ItemAnalysisSummary[]
  onNavigateToModule?: (moduleId: string) => void
}

export function NextStepsTab({ analysis }: NextStepsTabProps) {
  const recommendations = useMemo(() => {
    return generateTeacherRecommendations(analysis)
  }, [analysis])

  return (
    <div className="tab-next-steps animate-fade-in">
      {/* Pengantar Tindak Lanjut Saintifik */}
      <div className="panel-card" style={{ marginBottom: '24px' }}>
        <h3 className="panel-card-title">
          <span>🎯</span> Rekomendasi Tindak Lanjut Pembelajaran Asam Basa
        </h3>
        <p className="panel-card-subtitle" style={{ margin: 0 }}>
          Rencana aksi pedagogis yang dirumuskan secara ilmiah berdasarkan analisis pola kesalahan, distribusi distraktor, dan tingkat kognitif butir soal kuis siswa.
        </p>
      </div>

      {/* Daftar Rekomendasi Berdasarkan 5 Ranah Materi */}
      {recommendations.length > 0 ? (
        <div className="recommendations-list">
          {recommendations.map((rec) => {
            const priorityClass =
              rec.priorityLevel === 'Tinggi'
                ? 'priority-high'
                : rec.priorityLevel === 'Sedang'
                ? 'priority-medium'
                : 'priority-low'

            return (
              <div key={rec.id} className={`recommendation-card ${priorityClass}`}>
                <div className="rec-header">
                  <div>
                    <span className="rec-category">{rec.category}</span>
                    <h3 className="rec-title">{rec.title}</h3>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Fokus Soal Terkait: {rec.affectedQuestions.map((q) => `#${q}`).join(', ')}
                    </div>
                  </div>

                  <span className={`rec-priority-badge ${rec.priorityLevel}`}>
                    Prioritas {rec.priorityLevel}
                  </span>
                </div>

                <div className="rec-body-grid">
                  {/* 1. Indikator yang Diperkuat */}
                  <div className="rec-box">
                    <div className="rec-box-title">📌 Indikator yang Perlu Diperkuat</div>
                    <p className="rec-box-content">{rec.targetIndicator}</p>
                  </div>

                  {/* 2. Bukti Rekap Data */}
                  <div className="rec-box">
                    <div className="rec-box-title">📊 Bukti Berdasarkan Hasil Rekap</div>
                    <p className="rec-box-content">{rec.evidenceSummary}</p>
                  </div>

                  {/* 3. Kemungkinan Kesulitan Siswa */}
                  <div className="rec-box">
                    <div className="rec-box-title">💡 Kemungkinan Kesulitan Siswa</div>
                    <p className="rec-box-content">{rec.studentDifficultyHypothesis}</p>
                  </div>

                  {/* 4. Rekomendasi Kegiatan Pembelajaran */}
                  <div className="rec-box" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
                    <div className="rec-box-title" style={{ color: '#7c3aed' }}>
                      🛠️ Rekomendasi Kegiatan Pembelajaran
                    </div>
                    <p className="rec-box-content" style={{ color: '#4c1d95', fontWeight: 500 }}>
                      {rec.recommendedActivity}
                    </p>
                  </div>
                </div>

                {/* 5. Tujuan Tindak Lanjut */}
                <div
                  style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#15803d',
                  }}
                >
                  <strong>Tujuan Tindak Lanjut:</strong> {rec.followUpGoal}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="panel-state-card">
          <div className="panel-state-icon">🌟</div>
          <h3>Seluruh Indikator Memiliki Penguasaan Sangat Baik</h3>
          <p>
            Persentase jawaban benar pada semua butir soal telah melampaui ambang batas 85%. Anda dapat melanjutkan ke materi pengayaan modul berikutnya.
          </p>
        </div>
      )}
    </div>
  )
}

