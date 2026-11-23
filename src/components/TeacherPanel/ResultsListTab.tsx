import { useState, useMemo } from 'react'
import type { StudentActivityResult } from '../../types/teacher'

interface ResultsListTabProps {
  data: StudentActivityResult[]
  onSelectActivity: (item: StudentActivityResult) => void
}

export function ResultsListTab({ data, onSelectActivity }: ResultsListTabProps) {
  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all') // 'all' | 'selesai' | 'sedang_dikerjakan'
  const [filterActivity, setFilterActivity] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterScoreRange, setFilterScoreRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState<
    'time_desc' | 'time_asc' | 'score_desc' | 'score_asc' | 'progress_desc'
  >('time_desc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Ekstrak opsi aktivitas unik
  const uniqueActivities = useMemo(() => {
    const set = new Set(data.map((d) => d.activityTitle))
    return Array.from(set)
  }, [data])

  // Ringkasan metrik cepat untuk kartu ringkasan di atas tabel
  const summaryCards = useMemo(() => {
    const total = data.length
    const selesaiCount = data.filter(
      (d) => d.status === 'diterima_server' || d.status === 'dibaca_guru'
    ).length
    const sedangCount = data.filter((d) => d.status === 'sedang_dikerjakan').length

    const scoredItems = data.filter((d) => d.score !== null)
    const avgScore =
      scoredItems.length > 0
        ? Math.round(
            scoredItems.reduce((acc, curr) => acc + (curr.score ?? 0), 0) / scoredItems.length
          )
        : 0

    return { total, selesaiCount, sedangCount, avgScore }
  }, [data])

  // Filter & Sort
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        // 1. Search Query (Nama Siswa / Alias atau ID percobaan)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const matchAlias = item.alias.toLowerCase().includes(q)
          const matchId = item.id.toLowerCase().includes(q)
          const matchClass = item.schoolClass ? item.schoolClass.toLowerCase().includes(q) : false
          if (!matchAlias && !matchId && !matchClass) return false
        }

        // 2. Filter Status Pengerjaan (all | selesai | sedang_dikerjakan)
        if (filterStatus !== 'all') {
          if (filterStatus === 'selesai') {
            if (item.status !== 'diterima_server' && item.status !== 'dibaca_guru') return false
          } else if (filterStatus === 'sedang_dikerjakan') {
            if (item.status !== 'sedang_dikerjakan') return false
          }
        }

        // 3. Filter Nama Kuis / Aktivitas
        if (filterActivity !== 'all' && item.activityTitle !== filterActivity) {
          return false
        }

        // 4. Filter Jenis Aktivitas
        if (filterType !== 'all' && item.activityType !== filterType) {
          return false
        }

        // 5. Filter Rentang Nilai
        if (filterScoreRange !== 'all') {
          if (item.score === null) return false
          if (filterScoreRange === 'high' && item.score < 80) return false
          if (filterScoreRange === 'medium' && (item.score < 60 || item.score >= 80)) return false
          if (filterScoreRange === 'low' && item.score >= 60) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'score_desc') {
          const sA = a.score ?? -1
          const sB = b.score ?? -1
          return sB - sA
        }
        if (sortBy === 'score_asc') {
          const sA = a.score ?? 999
          const sB = b.score ?? 999
          return sA - sB
        }
        if (sortBy === 'progress_desc') {
          const pA = a.progressCount ?? (a.isCompleted ? a.totalQuestions : 0)
          const pB = b.progressCount ?? (b.isCompleted ? b.totalQuestions : 0)
          return pB - pA
        }
        if (sortBy === 'time_desc') {
          const tA = new Date(a.startedAt || a.serverReceivedAt || a.completedAt).getTime()
          const tB = new Date(b.startedAt || b.serverReceivedAt || b.completedAt).getTime()
          return tB - tA
        }
        if (sortBy === 'time_asc') {
          const tA = new Date(a.startedAt || a.serverReceivedAt || a.completedAt).getTime()
          const tB = new Date(b.startedAt || b.serverReceivedAt || b.completedAt).getTime()
          return tA - tB
        }
        return 0
      })
  }, [data, searchQuery, filterStatus, filterActivity, filterType, filterScoreRange, sortBy])

  // Pagination slicing
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const handleResetFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setFilterActivity('all')
    setFilterType('all')
    setFilterScoreRange('all')
    setSortBy('time_desc')
    setCurrentPage(1)
  }

  return (
    <div className="tab-results-content animate-fade-in">
      {/* Kartu Ringkasan Cepat */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '14px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '26px' }}>📊</div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Sesi Pengerjaan
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>
              {summaryCards.total}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '14px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '26px' }}>✅</div>
          <div>
            <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>
              Selesai Dikirim
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#166534' }}>
              {summaryCards.selesaiCount}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '14px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '26px' }}>⏳</div>
          <div>
            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>
              Sedang Dikerjakan
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#92400e' }}>
              {summaryCards.sedangCount}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '10px',
            padding: '14px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '26px' }}>🎯</div>
          <div>
            <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>
              Rata-Rata Nilai (Selesai)
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e40af' }}>
              {summaryCards.avgScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Bilah Pencarian & Filter */}
      <div className="filter-search-bar">
        {/* Input Pencarian */}
        <div className="search-input-wrapper-panel">
          <span className="search-icon-panel" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            className="search-input-panel"
            placeholder="Cari berdasarkan nama siswa, kelas, atau ID sesi..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Cari hasil siswa"
          />
        </div>

        {/* Dropdown Filter */}
        <div className="filter-selects-row">
          {/* Filter Status Pengerjaan (Sesuai Spesifikasi Wajib) */}
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Filter Status Pengerjaan"
            style={{ fontWeight: 600 }}
          >
            <option value="all">📌 Semua Status</option>
            <option value="selesai">✅ Selesai</option>
            <option value="sedang_dikerjakan">⏳ Sedang Dikerjakan</option>
          </select>

          <select
            className="filter-select"
            value={filterActivity}
            onChange={(e) => {
              setFilterActivity(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Filter Aktivitas"
          >
            <option value="all">Semua Kuis / Aktivitas</option>
            {uniqueActivities.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Filter Jenis"
          >
            <option value="all">Semua Jenis</option>
            <option value="kuis_evaluasi">Kuis Evaluasi HOTS</option>
            <option value="lab_simulasi">Lab Virtual</option>
            <option value="diagnostic">Diagnostik</option>
          </select>

          <select
            className="filter-select"
            value={filterScoreRange}
            onChange={(e) => {
              setFilterScoreRange(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Filter Nilai"
          >
            <option value="all">Semua Nilai</option>
            <option value="high">Nilai Tinggi (≥ 80)</option>
            <option value="medium">Nilai Cukup (60–79)</option>
            <option value="low">Perlu Penguatan (&lt; 60)</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Urutkan Data"
          >
            <option value="time_desc">Tanggal Mulai: Terbaru</option>
            <option value="time_asc">Tanggal Mulai: Terlama</option>
            <option value="score_desc">Nilai Akhir: Tertinggi</option>
            <option value="score_asc">Nilai Akhir: Terendah</option>
            <option value="progress_desc">Progres: Terbanyak</option>
          </select>

          {(searchQuery ||
            filterStatus !== 'all' ||
            filterActivity !== 'all' ||
            filterType !== 'all' ||
            filterScoreRange !== 'all') && (
            <button
              type="button"
              className="btn-page"
              onClick={handleResetFilters}
              title="Reset seluruh filter"
            >
              Reset Filter ↺
            </button>
          )}
        </div>
      </div>

      {/* Tabel Data Rekap Aktivitas Siswa: 8 Kolom Lengkap Sesuai Spesifikasi */}
      {paginatedData.length > 0 ? (
        <>
          <div className="panel-table-container">
            <table className="panel-table" aria-label="Tabel Rekap Aktivitas Siswa">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '45px', textAlign: 'center' }}>
                    No.
                  </th>
                  <th scope="col" style={{ minWidth: '150px' }}>
                    Nama Siswa
                  </th>
                  <th scope="col" style={{ minWidth: '180px' }}>
                    Nama Kuis / Aktivitas
                  </th>
                  <th scope="col" style={{ minWidth: '130px' }}>
                    Tanggal Mulai
                  </th>
                  <th scope="col" style={{ minWidth: '120px' }}>
                    Progres Pengerjaan
                  </th>
                  <th scope="col" style={{ minWidth: '130px', textAlign: 'center' }}>
                    Status Pengerjaan
                  </th>
                  <th scope="col" style={{ minWidth: '90px', textAlign: 'center' }}>
                    Nilai Akhir
                  </th>
                  <th scope="col" style={{ minWidth: '110px', textAlign: 'center' }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const rowNumber = (currentPage - 1) * pageSize + index + 1
                  const isOngoing = item.status === 'sedang_dikerjakan'
                  const totalQ = item.totalQuestions || 10
                  const progressCount =
                    item.progressCount !== undefined
                      ? item.progressCount
                      : isOngoing
                      ? Object.keys(item.answers || {}).length
                      : totalQ

                  const startDate = item.startedAt || item.serverReceivedAt || item.completedAt
                  const percentProgress = Math.min(100, Math.round((progressCount / totalQ) * 100))

                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: isOngoing ? 'rgba(254, 243, 199, 0.15)' : undefined,
                      }}
                    >
                      {/* 1. No. */}
                      <td style={{ fontWeight: 600, color: '#64748b', textAlign: 'center' }}>
                        {rowNumber}
                      </td>

                      {/* 2. Nama Siswa */}
                      <td>
                        <strong style={{ color: '#0f172a' }}>{item.alias}</strong>
                        {item.schoolClass && (
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {item.schoolClass}
                          </div>
                        )}
                        {item.attemptNumber && item.attemptNumber > 1 && (
                          <span
                            style={{
                              fontSize: '10px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              display: 'inline-block',
                              marginTop: '2px',
                            }}
                          >
                            Percobaan #{item.attemptNumber}
                          </span>
                        )}
                      </td>

                      {/* 3. Nama Kuis / Aktivitas */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>
                          {item.activityTitle}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#94a3b8',
                            fontFamily: 'monospace',
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center',
                          }}
                        >
                          <span>{item.id}</span>
                          <span style={{ color: '#64748b' }}>• v{item.questionVersion}</span>
                        </div>
                      </td>

                      {/* 4. Tanggal Mulai */}
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '12px', color: '#1e293b' }}>
                          {new Date(startDate).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {new Date(startDate).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          WIB
                        </div>
                      </td>

                      {/* 5. Progres Pengerjaan (e.g. 4/10 Soal) */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: isOngoing ? '#b45309' : '#15803d',
                            }}
                          >
                            {progressCount} / {totalQ} Soal
                          </div>
                          <div
                            style={{
                              background: '#e2e8f0',
                              borderRadius: '4px',
                              height: '6px',
                              width: '100%',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                background: isOngoing
                                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                  : 'linear-gradient(90deg, #10b981, #059669)',
                                height: '100%',
                                width: `${percentProgress}%`,
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 6. Status Pengerjaan (Sedang Dikerjakan vs Selesai) */}
                      <td style={{ textAlign: 'center' }}>
                        {isOngoing ? (
                          <span
                            style={{
                              background: '#fef3c7',
                              border: '1px solid #fde68a',
                              color: '#92400e',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ animation: 'spin 2s linear infinite' }}>⏳</span> Sedang Dikerjakan
                          </span>
                        ) : (
                          <span
                            style={{
                              background: '#dcfce7',
                              border: '1px solid #bbf7d0',
                              color: '#166534',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>✅</span> Selesai
                          </span>
                        )}
                      </td>

                      {/* 7. Nilai Akhir (Angka atau '-' jika belum selesai) */}
                      <td style={{ textAlign: 'center' }}>
                        {isOngoing || item.score === null ? (
                          <span
                            style={{
                              color: '#94a3b8',
                              fontWeight: 700,
                              fontSize: '18px',
                            }}
                            title="Nilai belum dihitung karena kuis masih berlangsung"
                          >
                            —
                          </span>
                        ) : (
                          <span
                            className={`score-badge ${
                              item.score >= 80 ? 'high' : item.score >= 60 ? 'medium' : 'low'
                            }`}
                            style={{
                              display: 'inline-block',
                              minWidth: '40px',
                              textAlign: 'center',
                            }}
                          >
                            {item.score}
                          </span>
                        )}
                      </td>

                      {/* 8. Aksi (Lihat Detail) */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-action-detail"
                          onClick={() => onSelectActivity(item)}
                          aria-label={`Lihat detail aktivitas ${item.alias}`}
                          style={{
                            background: isOngoing ? '#fef3c7' : undefined,
                            borderColor: isOngoing ? '#fde68a' : undefined,
                            color: isOngoing ? '#92400e' : undefined,
                          }}
                        >
                          Lihat Detail →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Bar Kontrol Pagination */}
          <div className="table-pagination-bar">
            <span className="pagination-info">
              Menampilkan {(currentPage - 1) * pageSize + 1} –{' '}
              {Math.min(currentPage * pageSize, filteredData.length)} dari {filteredData.length} hasil
            </span>

            <div className="pagination-controls">
              <button
                type="button"
                className="btn-page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Halaman sebelumnya"
              >
                ← Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`btn-page ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                className="btn-page"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Halaman selanjutnya"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="panel-state-card">
          <div className="panel-state-icon">🔍</div>
          <h3>Filter Tidak Menemukan Hasil</h3>
          <p>
            Tidak ada data hasil belajar siswa yang sesuai dengan kriteria pencarian atau penyaringan saat ini.
          </p>
          <button type="button" className="btn-action-detail" onClick={handleResetFilters}>
            Bersihkan Seluruh Filter
          </button>
        </div>
      )}
    </div>
  )
}
