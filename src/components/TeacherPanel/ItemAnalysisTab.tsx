import { useState, useMemo } from 'react'
import type { StudentActivityResult } from '../../types/teacher'
import { computeItemAnalysis } from '../../services/classroomService'

interface ItemAnalysisTabProps {
  data: StudentActivityResult[]
  onOpenQuestionDetail?: (questionNumber: number) => void
}

export function ItemAnalysisTab({ data }: ItemAnalysisTabProps) {
  // Filter & Pengaturan Metode
  const [selectedActivity, setSelectedActivity] = useState<string>('kuis-m1-asam-basa')
  const [selectedVersion, setSelectedVersion] = useState<string>('2.0.0')
  const [analysisMethod, setAnalysisMethod] = useState<'first' | 'latest'>('first')
  const [selectedQuestionModal, setSelectedQuestionModal] = useState<number | null>(null)

  // Ekstrak opsi aktivitas kuis yang tersedia
  const availableActivities = useMemo(() => {
    const quizItems = data.filter((d) => d.activityType === 'kuis_evaluasi')
    const map = new Map<string, string>()
    quizItems.forEach((item) => map.set(item.activityId, item.activityTitle))
    return Array.from(map.entries())
  }, [data])

  // Ekstrak opsi versi soal
  const availableVersions = useMemo(() => {
    const set = new Set(data.map((d) => d.questionVersion))
    return Array.from(set)
  }, [data])

  // Hitung Analisis Butir Soal
  const analysisData = useMemo(() => {
    return computeItemAnalysis(data, selectedVersion, analysisMethod)
  }, [data, selectedVersion, analysisMethod])

  // Cari Soal dengan Persentase Tertinggi & Terendah
  const { highestItems, lowestItems } = useMemo(() => {
    if (analysisData.length === 0) return { highestItems: [], lowestItems: [] }
    const valid = analysisData.filter((a) => a.validResponsesCount > 0)
    const sorted = [...valid].sort((a, b) => b.percentageCorrect - a.percentageCorrect)
    return {
      highestItems: sorted.slice(0, 3),
      lowestItems: sorted.slice(-3).reverse(),
    }
  }, [analysisData])

  const activeQuestionDetail = useMemo(() => {
    if (selectedQuestionModal === null) return null
    return analysisData.find((a) => a.questionNumber === selectedQuestionModal) || null
  }, [analysisData, selectedQuestionModal])

  return (
    <div className="tab-item-analysis animate-fade-in">
      {/* Pengaturan Filter dan Pemilihan Metode */}
      <div className="filter-search-bar" style={{ gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Aktivitas Pembelajaran:
            </label>
            <select
              className="filter-select"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              aria-label="Pilih Aktivitas"
            >
              {availableActivities.length > 0 ? (
                availableActivities.map(([id, title]) => (
                  <option key={id} value={id}>
                    {title}
                  </option>
                ))
              ) : (
                <option value="kuis-m1-asam-basa">Kuis Modul 1 Asam Basa</option>
              )}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Versi Bank Soal:
            </label>
            <select
              className="filter-select"
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              aria-label="Pilih Versi Soal"
            >
              {availableVersions.map((v) => (
                <option key={v} value={v}>
                  Versi {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pilihan Metode Analisis Multi-Percobaan */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
            Dasar Pengambilan Data Percobaan:
          </span>
          <div style={{ display: 'flex', gap: '14px', fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="analysisMethod"
                value="first"
                checked={analysisMethod === 'first'}
                onChange={() => setAnalysisMethod('first')}
              />
              <span>
                <strong>Percobaan Pertama Diterima</strong> (Dasar Analisis Awal)
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="analysisMethod"
                value="latest"
                checked={analysisMethod === 'latest'}
                onChange={() => setAnalysisMethod('latest')}
              />
              <span>Percobaan Terbaru</span>
            </label>
          </div>
        </div>
      </div>

      {/* Catatan Pedagogis & Kebijakan Analisis */}
      <div
        style={{
          background: '#f8fafc',
          borderLeft: '4px solid #7c3aed',
          padding: '12px 18px',
          borderRadius: '0 8px 8px 0',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#334155',
          lineHeight: 1.5,
        }}
      >
        <strong>Pedoman Interpretasi Rekap:</strong> Persentase dihitung dengan rumus{' '}
        <code style={{ background: '#ede9fe', color: '#5b21b6', padding: '2px 6px', borderRadius: '4px' }}>
          (Jumlah Benar / Respons Valid) × 100%
        </code>
        . Siswa yang belum mengirim jawaban atau respons kosong tidak dihitung sebagai jawaban salah.
        Interpretasi yang ditampilkan merupakan <em>indikator awal pemahaman</em>, bukan diagnosis mutlak kemampuan siswa.
      </div>

      {/* Ringkasan Soal Tertinggi vs Terendah */}
      <div className="charts-grid-two-col" style={{ marginBottom: '24px' }}>
        <div className="panel-card">
          <h4 className="panel-card-title" style={{ color: '#15803d' }}>
            <span>🏆</span> Persentase Jawaban Benar Tertinggi
          </h4>
          <p className="panel-card-subtitle">Soal yang telah dikuasai dengan sangat baik oleh mayoritas siswa</p>
          <div className="indicator-rank-list">
            {highestItems.map((item) => (
              <div key={item.questionNumber} className="indicator-rank-item">
                <div className="indicator-rank-content">
                  <span className="indicator-rank-badge green">
                    Soal #{item.questionNumber} ({item.cognitiveLevel})
                  </span>
                  <p className="indicator-rank-text">{item.topic}</p>
                </div>
                <div className="indicator-rank-percent green">{item.percentageCorrect}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h4 className="panel-card-title" style={{ color: '#be123c' }}>
            <span>⚡</span> Persentase Jawaban Benar Terendah (Prioritas)
          </h4>
          <p className="panel-card-subtitle">Soal yang paling banyak mengalami kekeliruan konsep oleh siswa</p>
          <div className="indicator-rank-list">
            {lowestItems.map((item) => (
              <div key={item.questionNumber} className="indicator-rank-item">
                <div className="indicator-rank-content">
                  <span className="indicator-rank-badge rose">
                    Soal #{item.questionNumber} ({item.cognitiveLevel})
                  </span>
                  <p className="indicator-rank-text">{item.topic}</p>
                </div>
                <div className="indicator-rank-percent rose">{item.percentageCorrect}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visualisasi Grafik Batang Persentase Benar per Butir Soal */}
      <div className="panel-card" style={{ marginBottom: '24px' }}>
        <h4 className="panel-card-title">
          <span>📊</span> Grafik Persentase Jawaban Benar Setiap Butir Soal (Soal 1 – 10)
        </h4>
        <p className="panel-card-subtitle">
          Klik bar soal untuk membuka distribusi pilihan opsi (A, B, C, D, E) dan analisis distraktor
        </p>

        <div className="chart-bars-list">
          {analysisData.map((item) => {
            const levelClass =
              item.interpretationLevel === 'good'
                ? 'green'
                : item.interpretationLevel === 'moderate'
                ? 'amber'
                : 'rose'

            return (
              <div
                key={item.questionNumber}
                className="chart-bar-item"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedQuestionModal(item.questionNumber)}
                title="Klik untuk melihat distribusi opsi"
              >
                <div className="chart-bar-header">
                  <span className="chart-bar-label">
                    <strong>Soal #{item.questionNumber}</strong> • {item.topic} ({item.cognitiveLevel})
                  </span>
                  <span className="chart-bar-stat">
                    {item.correctCount} / {item.validResponsesCount} benar ({item.percentageCorrect}%)
                  </span>
                </div>
                <div className="chart-bar-track">
                  <div
                    className={`chart-bar-fill ${levelClass}`}
                    style={{ width: `${Math.max(item.percentageCorrect, 3)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabel Lengkap Rekap Analisis per Butir Soal */}
      <div className="panel-table-container">
        <table className="panel-table" aria-label="Tabel Rekap Analisis Butir Soal">
          <thead>
            <tr>
              <th scope="col" style={{ width: '50px' }}>No.</th>
              <th scope="col">ID Soal</th>
              <th scope="col" style={{ width: '90px' }}>Kognitif</th>
              <th scope="col">Indikator Pembelajaran</th>
              <th scope="col" style={{ textAlign: 'center' }}>Respons Valid</th>
              <th scope="col" style={{ textAlign: 'center', color: '#15803d' }}>Benar</th>
              <th scope="col" style={{ textAlign: 'center', color: '#b91c1c' }}>Salah</th>
              <th scope="col" style={{ textAlign: 'center' }}>% Benar</th>
              <th scope="col">Interpretasi Hasil Awal</th>
              <th scope="col" style={{ textAlign: 'center' }}>Distraktor</th>
            </tr>
          </thead>
          <tbody>
            {analysisData.length > 0 ? (
              analysisData.map((item) => (
                <tr key={item.questionNumber}>
                  <td style={{ fontWeight: 700 }}>#{item.questionNumber}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>
                    {item.questionId}
                  </td>
                  <td>
                    <span className="q-cog-badge">{item.cognitiveLevel}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.topic}</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', lineHeight: 1.4 }}>
                      {item.indicator}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.validResponsesCount}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: '#15803d' }}>
                    {item.correctCount}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>
                    {item.wrongCount}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className={`score-badge ${
                        item.percentageCorrect >= 80
                          ? 'high'
                          : item.percentageCorrect >= 60
                          ? 'medium'
                          : 'low'
                      }`}
                    >
                      {item.percentageCorrect}%
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        background:
                          item.interpretationLevel === 'good'
                            ? '#dcfce7'
                            : item.interpretationLevel === 'moderate'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          item.interpretationLevel === 'good'
                            ? '#15803d'
                            : item.interpretationLevel === 'moderate'
                            ? '#b45309'
                            : '#b91c1c',
                      }}
                    >
                      {item.interpretation}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-action-detail"
                      onClick={() => setSelectedQuestionModal(item.questionNumber)}
                    >
                      Opsi A–E 🔍
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  Data belum cukup untuk dianalisis.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Distribusi Pilihan Jawaban Siswa (A, B, C, D, E) */}
      {activeQuestionDetail && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setSelectedQuestionModal(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="q-num-badge">Soal #{activeQuestionDetail.questionNumber}</span>{' '}
                <span className="q-cog-badge">{activeQuestionDetail.cognitiveLabel}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '6px 0 2px 0' }}>
                  Distribusi Pilihan Jawaban Siswa
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Topik: {activeQuestionDetail.topic}
                </p>
              </div>
              <button
                type="button"
                className="btn-page"
                onClick={() => setSelectedQuestionModal(null)}
                style={{ fontSize: '16px', padding: '4px 10px' }}
              >
                ✕
              </button>
            </div>

            {/* Stimulus & Pertanyaan */}
            {activeQuestionDetail.questionData?.stimulus && (
              <div className="q-stimulus-box" style={{ fontSize: '12px' }}>
                {activeQuestionDetail.questionData.stimulus}
              </div>
            )}
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
              {activeQuestionDetail.questionData?.question}
            </p>

            {/* Grafik Distribusi Opsi A-E */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Pilihan Jawaban Siswa ({activeQuestionDetail.validResponsesCount} Respons Valid):
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeQuestionDetail.questionData?.options.map((opt) => {
                  const isKey = opt.key === activeQuestionDetail.questionData?.correctAnswer
                  const count = activeQuestionDetail.optionDistribution[opt.key] || 0
                  const pct =
                    activeQuestionDetail.validResponsesCount > 0
                      ? Math.round((count / activeQuestionDetail.validResponsesCount) * 100)
                      : 0

                  return (
                    <div
                      key={opt.key}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: isKey ? '#f0fdf4' : '#f8fafc',
                        border: isKey ? '1px solid #86efac' : '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span>
                          <strong style={{ color: isKey ? '#15803d' : '#334155' }}>
                            Opsi {opt.key}: {opt.text}
                          </strong>{' '}
                          {isKey && <span style={{ color: '#15803d', fontWeight: 700 }}>(KUNCI BENAR)</span>}
                        </span>
                        <span style={{ fontWeight: 700, color: isKey ? '#15803d' : '#64748b' }}>
                          {count} siswa ({pct}%)
                        </span>
                      </div>
                      <div className="chart-bar-track">
                        <div
                          className={`chart-bar-fill ${isKey ? 'green' : 'amber'}`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Distraktor Paling Banyak Terpilih */}
            {activeQuestionDetail.mostCommonDistractor && (
              <div
                style={{
                  padding: '12px 14px',
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#9f1239',
                }}
              >
                <strong>Distraktor Utama: Opsi {activeQuestionDetail.mostCommonDistractor.optionKey}</strong>{' '}
                dipilih oleh {activeQuestionDetail.mostCommonDistractor.count} siswa.
                <div style={{ marginTop: '4px' }}>
                  <em>Analisis: {activeQuestionDetail.mostCommonDistractor.reason}</em>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

