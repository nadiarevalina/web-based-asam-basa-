import type { ClassMetricSummary, StudentActivityResult, TeacherPanelTab } from '../../types/teacher'

interface OverviewTabProps {
  metrics: ClassMetricSummary
  data: StudentActivityResult[]
  onSelectTab: (tab: TeacherPanelTab) => void
  onSelectActivity: (item: StudentActivityResult) => void
}

export function OverviewTab({
  metrics,
  data,
  onSelectTab,
  onSelectActivity,
}: OverviewTabProps) {
  // Ambil 3 percobaan terbaru untuk quick view
  const recentActivities = data.slice(0, 4)

  return (
    <div className="tab-overview-content animate-fade-in">
      {/* 5 Kartu Metrik Utama */}
      <div className="metrics-grid">
        <div className="metric-card purple">
          <div className="metric-icon-wrap">👥</div>
          <span className="metric-label">Siswa Diterima Server</span>
          <span className="metric-value">{metrics.totalStudentsReceived}</span>
          <span className="metric-sub">Terverifikasi di server akademik</span>
        </div>

        <div className="metric-card blue">
          <div className="metric-icon-wrap">📝</div>
          <span className="metric-label">Total Aktivitas Tercatat</span>
          <span className="metric-value">{metrics.totalActivitiesCount}</span>
          <span className="metric-sub">Kuis formatif & lab virtual</span>
        </div>

        <div className="metric-card green">
          <div className="metric-icon-wrap">🎯</div>
          <span className="metric-label">Rata-rata Nilai Siswa</span>
          <span className="metric-value">{metrics.averageScore}</span>
          <span className="metric-sub">Skala penilaian 0 – 100</span>
        </div>

        <div className="metric-card amber">
          <div className="metric-icon-wrap">✅</div>
          <span className="metric-label">Akurasi Jawaban Benar</span>
          <span className="metric-value">{metrics.percentageCorrect}%</span>
          <span className="metric-sub">Dari seluruh butir soal valid</span>
        </div>

        <div className="metric-card rose">
          <div className="metric-icon-wrap">⚠️</div>
          <span className="metric-label">Perlu Tindak Lanjut</span>
          <span className="metric-value">{metrics.studentsNeedingFollowUpCount}</span>
          <span className="metric-sub">Siswa dengan nilai &lt; 60</span>
        </div>
      </div>

      {/* Grid Grafik: Distribusi Nilai & Ketuntasan per Aktivitas */}
      <div className="charts-grid-two-col">
        {/* Grafik Distribusi Nilai */}
        <div className="panel-card">
          <h3 className="panel-card-title">
            <span>📊</span> Distribusi Nilai Siswa (Percobaan Pertama)
          </h3>
          <p className="panel-card-subtitle">
            Sebaran capaian nilai siswa yang telah diterima server secara berjenjang
          </p>

          <div className="chart-bars-list">
            {metrics.scoreDistribution.map((item, idx) => {
              const colorClasses = ['purple', 'blue', 'green', 'amber', 'rose']
              const colorClass = colorClasses[idx % colorClasses.length]

              return (
                <div key={item.rangeLabel} className="chart-bar-item">
                  <div className="chart-bar-header">
                    <span className="chart-bar-label">{item.rangeLabel}</span>
                    <span className="chart-bar-stat">
                      {item.count} siswa ({item.percentage}%)
                    </span>
                  </div>
                  <div className="chart-bar-track">
                    <div
                      className={`chart-bar-fill ${colorClass}`}
                      style={{ width: `${Math.max(item.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Persentase Ketuntasan per Aktivitas */}
        <div className="panel-card">
          <h3 className="panel-card-title">
            <span>🧪</span> Ketuntasan Berdasarkan Aktivitas
          </h3>
          <p className="panel-card-subtitle">
            Tingkat penguasaan konsep pada setiap modul kuis dan simulasi praktikum
          </p>

          <div className="chart-bars-list">
            {metrics.completionByActivity.map((act) => (
              <div key={act.activityTitle} className="chart-bar-item">
                <div className="chart-bar-header">
                  <span className="chart-bar-label">{act.activityTitle}</span>
                  <span className="chart-bar-stat">
                    Rata-rata: {act.averageScore} | Ketuntasan: {act.masteryRate}%
                  </span>
                </div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill blue"
                    style={{ width: `${Math.max(act.masteryRate, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-action-detail"
              style={{ width: '100%', padding: '10px' }}
              onClick={() => onSelectTab('rekap_soal')}
            >
              🔍 Buka Analisis Rekap per Butir Soal →
            </button>
          </div>
        </div>
      </div>

      {/* Indikator Paling Dikuasai vs Perlu Penguatan */}
      <div className="charts-grid-two-col">
        {/* Indikator Paling Dikuasai */}
        <div className="panel-card">
          <h3 className="panel-card-title" style={{ color: '#15803d' }}>
            <span>🌟</span> Indikator Pembelajaran Paling Dikuasai
          </h3>
          <p className="panel-card-subtitle">
            Capaian kompetensi kimia dengan persentase jawaban benar tertinggi di kelas
          </p>

          <div className="indicator-rank-list">
            {metrics.topMasteredIndicators.map((ind) => (
              <div key={ind.questionNumber} className="indicator-rank-item">
                <div className="indicator-rank-content">
                  <span className="indicator-rank-badge green">
                    Soal #{ind.questionNumber} • {ind.cognitiveLevel}
                  </span>
                  <p className="indicator-rank-text">{ind.indicator}</p>
                </div>
                <div className="indicator-rank-percent green">
                  {ind.percentageCorrect}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indikator Memerlukan Penguatan */}
        <div className="panel-card">
          <h3 className="panel-card-title" style={{ color: '#be123c' }}>
            <span>⚠️</span> Indikator Memerlukan Penguatan
          </h3>
          <p className="panel-card-subtitle">
            Titik materi yang perlu mendapat penguatan dan rekomendasi tindak lanjut guru
          </p>

          <div className="indicator-rank-list">
            {metrics.needsReinforcementIndicators.map((ind) => (
              <div key={ind.questionNumber} className="indicator-rank-item">
                <div className="indicator-rank-content">
                  <span className="indicator-rank-badge rose">
                    Soal #{ind.questionNumber} • {ind.cognitiveLevel}
                  </span>
                  <p className="indicator-rank-text">{ind.indicator}</p>
                </div>
                <div className="indicator-rank-percent rose">
                  {ind.percentageCorrect}%
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="btn-action-detail"
              style={{ width: '100%', padding: '10px', background: '#fff1f2', color: '#be123c', borderColor: '#fecdd3' }}
              onClick={() => onSelectTab('tindak_lanjut')}
            >
              💡 Lihat Rekomendasi Tindak Lanjut Guru →
            </button>
          </div>
        </div>
      </div>

      {/* Aktivitas Siswa Masuk Terbaru */}
      <div className="panel-card" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 className="panel-card-title">
              <span>🕒</span> Aktivitas Siswa Masuk Terbaru
            </h3>
            <p className="panel-card-subtitle" style={{ margin: 0 }}>
              Hasil pengerjaan terakhir yang berhasil disinkronisasi ke server
            </p>
          </div>
          <button
            type="button"
            className="btn-action-detail"
            onClick={() => onSelectTab('daftar_hasil')}
          >
            Lihat Semua Hasil ({data.length}) →
          </button>
        </div>

        <div className="panel-table-container" style={{ margin: 0 }}>
          <table className="panel-table">
            <thead>
              <tr>
                <th>Alias Siswa</th>
                <th>Aktivitas</th>
                <th>Nilai</th>
                <th>Diterima Server</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.alias}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{item.schoolClass}</div>
                  </td>
                  <td>{item.activityTitle}</td>
                  <td>
                    <span
                      className={`score-badge ${
                        item.score !== null && item.score !== undefined
                          ? item.score >= 80 ? 'high' : item.score >= 60 ? 'medium' : 'low'
                          : 'neutral'
                      }`}
                    >
                      {item.score !== null && item.score !== undefined ? item.score : '—'}
                    </span>
                  </td>
                  <td>
                    {new Date(item.serverReceivedAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}{' '}
                    WIB
                  </td>
                  <td>
                    <span className="status-tag sent">Diterima</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action-detail"
                      onClick={() => onSelectActivity(item)}
                    >
                      Buka Rincian →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

