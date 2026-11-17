import { useState, useEffect, useCallback, useMemo } from 'react'
import type { UserAccount } from '../../types/auth'
import type {
  ClassMetricSummary,
  ItemAnalysisSummary,
  StudentActivityResult,
  TeacherPanelTab,
} from '../../types/teacher'
import { getCurrentUser } from '../../services/authStorage'
import {
  listClass,
  getClassMetrics,
  computeItemAnalysis,
} from '../../services/classroomService'
import type { PageId } from '../../types/navigation'
import { OverviewTab } from './OverviewTab'
import { ResultsListTab } from './ResultsListTab'
import { ActivityDetailTab } from './ActivityDetailTab'
import { ItemAnalysisTab } from './ItemAnalysisTab'
import { DataStatusTab } from './DataStatusTab'
import { NextStepsTab } from './NextStepsTab'
import './TeacherPanel.css'

interface TeacherPanelProps {
  onNavigatePage: (pageId: PageId) => void
}

export function TeacherPanel({ onNavigatePage }: TeacherPanelProps) {
  const [currentUser] = useState<UserAccount | null>(() => getCurrentUser())
  const [activeTab, setActiveTab] = useState<TeacherPanelTab>('ringkasan')
  const [selectedActivity, setSelectedActivity] = useState<StudentActivityResult | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

  // State Pemuatan Data
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [classData, setClassData] = useState<StudentActivityResult[]>([])
  const [isSampleData, setIsSampleData] = useState<boolean>(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>('')
  const [serverStatus, setServerStatus] = useState<{
    isOnline: boolean
    endpoint: string
    latencyMs: number
    activeTeacherUid: string
  }>({
    isOnline: true,
    endpoint: '/api/v1/classroom/results',
    latencyMs: 38,
    activeTeacherUid: '',
  })

  // Memuat data kelas dari layanan listClass() dengan perlindungan race condition
  useEffect(() => {
    let cancelled = false

    async function loadData() {
      if (!currentUser || currentUser.role !== 'guru') {
        setIsLoading(false)
        return
      }

      const currentTeacherUid = currentUser.id
      setErrorMessage(null)

      try {
        const response = await listClass(currentUser)

        // KETENTUAN KEAMANAN KRITIS:
        // Abaikan respons asynchronous yang datang setelah akun guru berubah agar data akun sebelumnya tidak tercampur.
        if (cancelled) return
        const freshUser = getCurrentUser()
        if (freshUser?.id !== currentTeacherUid) {
          return
        }

        if (response.success) {
          setClassData(response.data)
          setIsSampleData(response.isMockSample)
          setLastUpdatedAt(response.lastUpdatedAt)
          setServerStatus(response.serverStatus)
          if (response.data.length > 0) {
            setSelectedActivity((prev) => prev || response.data[0])
          }
        } else {
          setErrorMessage(response.error || 'Gagal memuat hasil belajar siswa.')
        }
      } catch (err) {
        if (cancelled) return
        setErrorMessage(
          err instanceof Error ? err.message : 'Terjadi kegagalan jaringan saat menghubungi server.'
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [currentUser, refreshTrigger])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  // Hitung Metrik & Analisis Butir Soal (Memoized)
  const metrics: ClassMetricSummary = useMemo(() => {
    return getClassMetrics(classData)
  }, [classData])

  const itemAnalysis: ItemAnalysisSummary[] = useMemo(() => {
    return computeItemAnalysis(classData, '2.0.0', 'first')
  }, [classData])

  // Navigasi ke rincian aktivitas tertentu
  const handleSelectActivity = (item: StudentActivityResult) => {
    setSelectedActivity(item)
    setActiveTab('rincian_aktivitas')
    window.scrollTo({ top: 180, behavior: 'smooth' })
  }

  // 1. KONDISI AKSES DITOLAK: Jika pengguna bukan akun Guru
  if (!currentUser || currentUser.role !== 'guru') {
    return (
      <div className="teacher-panel-container">
        <div className="access-denied-container animate-fade-in">
          <div className="access-denied-icon">🔒</div>
          <h2 className="access-denied-title">Akses Ditolak: Otorisasi Guru Diperlukan</h2>
          <p className="access-denied-desc">
            Halaman Panel Guru hanya dapat diakses oleh akun guru yang telah terverifikasi di sistem AsamBasa Lab.
            Siswa atau akun tamu tidak memiliki izin untuk membaca data hasil belajar kelas lain.
          </p>
          <div className="access-denied-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigatePage('login')}
            >
              Masuk sebagai Guru (Portal Akun) →
            </button>
            <button
              type="button"
              className="btn btn-outline-cyan"
              onClick={() => onNavigatePage('beranda')}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="teacher-panel-container">
      {/* Header Panel Guru */}
      <header className="teacher-panel-header">
        <div className="teacher-panel-title-group">
          <div className="teacher-panel-icon-badge" aria-hidden="true">
            👩‍🏫
          </div>
          <div>
            <h1 className="teacher-panel-title">Panel Guru AsamBasa Lab</h1>
            <p className="teacher-panel-subtitle">
              <span>{currentUser.fullName}</span>
              {currentUser.subject && <span className="teacher-meta-pill">{currentUser.subject}</span>}
              <span className="teacher-meta-pill">{currentUser.identifierNumber}</span>
            </p>
          </div>
        </div>

        <div className="teacher-panel-actions">
          {lastUpdatedAt && (
            <span className="last-updated-text">
              Terakhir diperbarui:{' '}
              {new Date(lastUpdatedAt).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}{' '}
              WIB
            </span>
          )}

          <button
            type="button"
            className="btn-refresh-panel"
            onClick={handleRefresh}
            disabled={isLoading}
            title="Segarkan data kelas dari server"
          >
            <span style={{ display: 'inline-block', transform: isLoading ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }}>
              🔄
            </span>
            <span>{isLoading ? 'Memuat...' : 'Segarkan Data'}</span>
          </button>
        </div>
      </header>

      {/* Label DATA CONTOH (Sesuai Ketentuan Bab 4 & PRD) */}
      {isSampleData && (
        <div className="sample-data-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="sample-data-badge">DATA CONTOH</span>
            <span>
              Preview menggunakan data contoh terverifikasi untuk pengujian panel. Data kelas riil akan tersinkronisasi otomatis saat siswa mengirim hasil.
            </span>
          </div>
          <span style={{ fontSize: '12px', opacity: 0.85 }}>Simulasi Server Mock HTTP 200</span>
        </div>
      )}

      {/* Tab Navigasi 6 Menu Utama */}
      <nav className="teacher-tabs-nav" aria-label="Menu Panel Guru">
        <button
          type="button"
          className={`teacher-tab-btn ${activeTab === 'ringkasan' ? 'active' : ''}`}
          onClick={() => setActiveTab('ringkasan')}
        >
          <span>📊</span>
          <span>1. Ringkasan</span>
        </button>

        <button
          type="button"
          className={`teacher-tab-btn ${activeTab === 'daftar_hasil' ? 'active' : ''}`}
          onClick={() => setActiveTab('daftar_hasil')}
        >
          <span>📋</span>
          <span>2. Daftar Hasil</span>
          <span className="tab-count-badge">{classData.length}</span>
        </button>

        <button
          type="button"
          className={`teacher-tab-btn ${activeTab === 'rincian_aktivitas' ? 'active' : ''}`}
          onClick={() => setActiveTab('rincian_aktivitas')}
        >
          <span>🔍</span>
          <span>3. Rincian Aktivitas</span>
          {selectedActivity && (
            <span className="tab-count-badge" style={{ background: '#7c3aed', color: '#fff' }}>
              {selectedActivity.alias.split(' ')[0]}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`teacher-tab-btn ${activeTab === 'rekap_soal' ? 'active' : ''}`}
          onClick={() => setActiveTab('rekap_soal')}
        >
          <span>📈</span>
          <span>4. Rekap per Butir Soal</span>
        </button>

        <button
          type="button"
          className={`teacher-tab-btn ${activeTab === 'status_data' ? 'active' : ''}`}
          onClick={() => setActiveTab('status_data')}
        >
          <span>📡</span>
          <span>5. Status Data</span>
        </button>

        <button
          type="button"
          className={`teacher-tab-btn ${activeTab === 'tindak_lanjut' ? 'active' : ''}`}
          onClick={() => setActiveTab('tindak_lanjut')}
        >
          <span>🎯</span>
          <span>6. Tindak Lanjut</span>
        </button>
      </nav>

      {/* Kondisi Error */}
      {errorMessage && (
        <div className="panel-state-card" style={{ borderColor: '#fca5a5', background: '#fff1f2', marginBottom: '24px' }}>
          <div className="panel-state-icon">❌</div>
          <h3 style={{ color: '#9f1239' }}>Gagal Memuat Data Hasil Kelas</h3>
          <p style={{ color: '#be123c' }}>{errorMessage}</p>
          <button type="button" className="btn-action-detail" onClick={handleRefresh}>
            Coba Muat Ulang ↺
          </button>
        </div>
      )}

      {/* Kondisi Loading */}
      {isLoading && (
        <div className="panel-state-card">
          <div className="panel-state-icon">⏳</div>
          <h3>Memuat Data Hasil Belajar Siswa...</h3>
          <p>Sedang membaca arsip pengujian kelas dari server akademik terenkripsi.</p>
        </div>
      )}

      {/* Kondisi Data Berhasil Dimuat: Tampilkan Tab yang Sesuai */}
      {!isLoading && !errorMessage && (
        <main className="teacher-panel-content-area">
          {activeTab === 'ringkasan' && (
            <OverviewTab
              metrics={metrics}
              data={classData}
              onSelectTab={setActiveTab}
              onSelectActivity={handleSelectActivity}
            />
          )}

          {activeTab === 'daftar_hasil' && (
            <ResultsListTab
              data={classData}
              onSelectActivity={handleSelectActivity}
            />
          )}

          {activeTab === 'rincian_aktivitas' && (
            <ActivityDetailTab
              activity={selectedActivity}
              onBackToList={() => setActiveTab('daftar_hasil')}
            />
          )}

          {activeTab === 'rekap_soal' && (
            <ItemAnalysisTab
              data={classData}
            />
          )}

          {activeTab === 'status_data' && (
            <DataStatusTab
              serverStatus={serverStatus}
            />
          )}

          {activeTab === 'tindak_lanjut' && (
            <NextStepsTab
              analysis={itemAnalysis}
            />
          )}
        </main>
      )}
    </div>
  )
}
