import { useState, useMemo } from 'react'
import type { StudentActivityResult } from '../../types/teacher'

interface ResultsListTabProps {
  data: StudentActivityResult[]
  onSelectActivity: (item: StudentActivityResult) => void
}

export function ResultsListTab({ data, onSelectActivity }: ResultsListTabProps) {
  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('')
  const [filterActivity, setFilterActivity] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterScoreRange, setFilterScoreRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'time_desc' | 'time_asc'>('time_desc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Ekstrak opsi aktivitas unik
  const uniqueActivities = useMemo(() => {
    const set = new Set(data.map((d) => d.activityTitle))
    return Array.from(set)
  }, [data])

  // Filter & Sort
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        // 1. Search Query (Alias atau ID)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const matchAlias = item.alias.toLowerCase().includes(q)
          const matchId = item.id.toLowerCase().includes(q)
          if (!matchAlias && !matchId) return false
        }

        // 2. Filter Aktivitas
        if (filterActivity !== 'all' && item.activityTitle !== filterActivity) {
          return false
        }

        // 3. Filter Jenis Aktivitas
        if (filterType !== 'all' && item.activityType !== filterType) {
          return false
        }

        // 4. Filter Rentang Nilai
        if (filterScoreRange !== 'all') {
          if (filterScoreRange === 'high' && item.score < 80) return false
          if (filterScoreRange === 'medium' && (item.score < 60 || item.score >= 80)) return false
          if (filterScoreRange === 'low' && item.score >= 60) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'score_desc') return b.score - a.score
        if (sortBy === 'score_asc') return a.score - b.score
        if (sortBy === 'time_desc') {
          return new Date(b.serverReceivedAt).getTime() - new Date(a.serverReceivedAt).getTime()
        }
        if (sortBy === 'time_asc') {
          return new Date(a.serverReceivedAt).getTime() - new Date(b.serverReceivedAt).getTime()
        }
        return 0
      })
  }, [data, searchQuery, filterActivity, filterType, filterScoreRange, sortBy])

  // Pagination slicing
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const handleResetFilters = () => {
    setSearchQuery('')
    setFilterActivity('all')
    setFilterType('all')
    setFilterScoreRange('all')
    setSortBy('time_desc')
    setCurrentPage(1)
  }

  return (
    <div className="tab-results-content animate-fade-in">
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
            placeholder="Cari berdasarkan alias siswa atau ID percobaan..."
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
          <select
            className="filter-select"
            value={filterActivity}
            onChange={(e) => {
              setFilterActivity(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Filter Aktivitas"
          >
            <option value="all">Semua Aktivitas</option>
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
            <option value="kuis_evaluasi">Kuis Evaluasi</option>
            <option value="lab_simulasi">Lab Simulasi</option>
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
            <option value="time_desc">Waktu Terima: Terbaru</option>
            <option value="time_asc">Waktu Terima: Terlama</option>
            <option value="score_desc">Nilai: Tertinggi</option>
            <option value="score_asc">Nilai: Terendah</option>
          </select>

          {(searchQuery || filterActivity !== 'all' || filterType !== 'all' || filterScoreRange !== 'all') && (
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

      {/* Tabel Data Hasil Belajar */}
      {paginatedData.length > 0 ? (
        <>
          <div className="panel-table-container">
            <table className="panel-table" aria-label="Tabel Hasil Belajar Siswa">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '45px' }}>No.</th>
                  <th scope="col">Nama Alias Siswa</th>
                  <th scope="col">Nama Aktivitas / Percobaan</th>
                  <th scope="col">Jenis Aktivitas</th>
                  <th scope="col">Versi Soal</th>
                  <th scope="col">Nilai</th>
                  <th scope="col">Waktu Selesai</th>
                  <th scope="col">Diterima Server</th>
                  <th scope="col" style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const rowNumber = (currentPage - 1) * pageSize + index + 1
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600, color: '#64748b' }}>{rowNumber}</td>
                      <td>
                        <strong>{item.alias}</strong>
                        {item.schoolClass && (
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {item.schoolClass}
                          </div>
                        )}
                        {item.attemptNumber && item.attemptNumber > 1 && (
                          <span style={{ fontSize: '10px', background: '#e0f2fe', color: '#0369a1', padding: '1px 5px', borderRadius: '4px' }}>
                            Percobaan #{item.attemptNumber}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{item.activityTitle}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {item.id}</div>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontSize: '12px' }}>
                          {item.activityType === 'kuis_evaluasi'
                            ? 'Kuis Evaluasi'
                            : item.activityType === 'lab_simulasi'
                            ? 'Lab Virtual'
                            : 'Diagnostik'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#475569' }}>
                          v{item.questionVersion}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`score-badge ${
                            item.score >= 80 ? 'high' : item.score >= 60 ? 'medium' : 'low'
                          }`}
                        >
                          {item.score}
                        </span>
                      </td>
                      <td>
                        {new Date(item.completedAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WIB
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {new Date(item.serverReceivedAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}{' '}
                          WIB
                        </div>
                        {item.serverAckId && (
                          <div style={{ fontSize: '10px', color: '#059669' }}>
                            {item.serverAckId}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-action-detail"
                          onClick={() => onSelectActivity(item)}
                          aria-label={`Lihat rincian untuk ${item.alias}`}
                        >
                          Lihat Rincian →
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

