import { useState, useEffect } from 'react'
import type {
  ExperimentItem,
  ServerSyncLog,
  UserAccount,
  UserRole,
} from '../types/auth'
import {
  getCurrentUser,
  getAllUsers,
  loginUser,
  registerUser,
  logoutUser,
  getAllExperiments,
  getExperimentsByOwner,
  linkExperimentsToAccount,
  enqueueExperiments,
  sendQueueToServer,
  teacherReviewExperiment,
  getServerLogs,
  clearServerLogs,
} from '../services/authStorage'
import './LoginPortal.css'

interface LoginPortalProps {
  onNavigateHome?: () => void
  onNavigateLab?: () => void
  onNavigateQuiz?: () => void
}

export function LoginPortal({
  onNavigateHome,
  onNavigateLab,
  onNavigateQuiz,
}: LoginPortalProps) {
  // State Autentikasi
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser())
  const [usersList, setUsersList] = useState<UserAccount[]>(() => getAllUsers())
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Form Login
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)

  // Form Register
  const [regFullName, setRegFullName] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regRole, setRegRole] = useState<UserRole>('siswa')
  const [regIdNumber, setRegIdNumber] = useState('')
  const [regSchoolClass, setRegSchoolClass] = useState('XI MIPA 1')
  const [regSubject, setRegSubject] = useState('Kimia')
  const [regPassword, setRegPassword] = useState('123')

  // Tab di dalam Portal
  const [activeTab, setActiveTab] = useState<'tautkan' | 'antrean' | 'riwayat' | 'guru_dashboard' | 'server_logs'>(() => {
    const user = getCurrentUser()
    return user?.role === 'guru' ? 'guru_dashboard' : 'tautkan'
  })

  // State Percobaan & Antrean
  const [allExperiments, setAllExperiments] = useState<ExperimentItem[]>(() => getAllExperiments())
  const [selectedUnlinkedIds, setSelectedUnlinkedIds] = useState<string[]>([])
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [serverLogs, setServerLogs] = useState<ServerSyncLog[]>(() => getServerLogs())
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null)

  // State Evaluasi Guru
  const [evaluatingItem, setEvaluatingItem] = useState<ExperimentItem | null>(null)
  const [teacherFeedbackText, setTeacherFeedbackText] = useState('')
  const [teacherRating, setTeacherRating] = useState<'Sangat Baik' | 'Baik' | 'Perlu Perbaikan'>('Baik')
  const [guruFilterStudent, setGuruFilterStudent] = useState<string>('all')
  const [guruFilterStatus, setGuruFilterStatus] = useState<string>('all')
  const [guruSearchQuery, setGuruSearchQuery] = useState<string>('')

  // Muat ulang data saat ada aksi perubahan
  const refreshData = () => {
    const user = getCurrentUser()
    setCurrentUser(user)
    setUsersList(getAllUsers())
    setAllExperiments(getAllExperiments())
    setServerLogs(getServerLogs())

    if (user?.role === 'guru') {
      setActiveTab('guru_dashboard')
    }
  }

  // Bersihkan alert setelah 6 detik
  useEffect(() => {
    if (actionAlert) {
      const timer = setTimeout(() => setActionAlert(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [actionAlert])

  // ==========================================================================
  // Handler Autentikasi
  // ==========================================================================

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setAuthError(null)
    setAuthSuccess(null)

    const res = loginUser(loginUsername, loginPassword)
    if (res.success && res.user) {
      setCurrentUser(res.user)
      setAuthSuccess(`Selamat datang kembali, ${res.user.fullName}!`)
      if (res.user.role === 'guru') {
        setActiveTab('guru_dashboard')
      } else {
        setActiveTab('tautkan')
      }
      refreshData()
    } else {
      setAuthError(res.error || 'Gagal masuk akun.')
    }
  }

  const handleQuickLogin = (username: string) => {
    setAuthError(null)
    setAuthSuccess(null)
    const res = loginUser(username, '123')
    if (res.success && res.user) {
      setCurrentUser(res.user)
      setAuthSuccess(`Masuk cepat berhasil sebagai ${res.user.fullName} (${res.user.role === 'guru' ? 'Guru' : 'Siswa'}).`)
      if (res.user.role === 'guru') {
        setActiveTab('guru_dashboard')
      } else {
        setActiveTab('tautkan')
      }
      refreshData()
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthSuccess(null)

    if (!regFullName.trim() || !regUsername.trim() || !regIdNumber.trim()) {
      setAuthError('Harap lengkapi semua kolom bertanda wajib (*).')
      return
    }

    const res = registerUser({
      fullName: regFullName,
      username: regUsername,
      role: regRole,
      identifierNumber: regIdNumber,
      schoolClass: regRole === 'siswa' ? regSchoolClass : undefined,
      subject: regRole === 'guru' ? regSubject : undefined,
      password: regPassword,
    })

    if (res.success && res.user) {
      setCurrentUser(res.user)
      setAuthSuccess(`Akun berhasil dibuat! Selamat datang, ${res.user.fullName}.`)
      if (res.user.role === 'guru') {
        setActiveTab('guru_dashboard')
      } else {
        setActiveTab('tautkan')
      }
      refreshData()
    } else {
      setAuthError(res.error || 'Gagal mendaftarkan akun.')
    }
  }

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    setActiveTab('tautkan')
    setActionAlert({
      type: 'info',
      message: 'Anda telah keluar dari akun. Hasil percobaan baru akan berstatus draf lokal.',
    })
    refreshData()
  }

  // ==========================================================================
  // Handler Tautkan Hasil ke Akun
  // ==========================================================================

  const unlinkedList = allExperiments.filter((exp) => exp.status === 'belum_dikaitkan' || !exp.ownerId)

  const toggleSelectUnlinked = (id: string) => {
    setSelectedUnlinkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAllUnlinked = () => {
    if (selectedUnlinkedIds.length === unlinkedList.length) {
      setSelectedUnlinkedIds([])
    } else {
      setSelectedUnlinkedIds(unlinkedList.map((item) => item.id))
    }
  }

  const handleLinkSelectedToAccount = () => {
    if (!currentUser) {
      setActionAlert({
        type: 'error',
        message: 'Silakan masuk ke akun terlebih dahulu sebelum menautkan hasil percobaan.',
      })
      return
    }
    if (selectedUnlinkedIds.length === 0) {
      setActionAlert({
        type: 'info',
        message: 'Pilih minimal satu hasil percobaan yang ingin dikaitkan ke akun.',
      })
      return
    }

    const res = linkExperimentsToAccount(selectedUnlinkedIds, currentUser)
    if (res.success) {
      setActionAlert({
        type: 'success',
        message: `Berhasil menautkan ${res.count} hasil percobaan ke akun ${currentUser.fullName}! ID Percobaan tetap dipertahankan.`,
      })
      setSelectedUnlinkedIds([])
      refreshData()
    }
  }

  // ==========================================================================
  // Handler Antrekan & Kirim ke Server
  // ==========================================================================

  // Eksperimen milik pengguna saat ini yang siap diantrekan atau sudah dalam antrean
  const myExperiments = currentUser ? getExperimentsByOwner(currentUser.id) : []
  const myQueueItems = allExperiments.filter(
    (exp) => exp.status === 'dalam_antrean' && (!currentUser || currentUser.role === 'guru' || exp.ownerId === currentUser.id)
  )

  const handleEnqueueItem = (experimentId: string) => {
    const res = enqueueExperiments([experimentId])
    if (res.success) {
      setActionAlert({
        type: 'success',
        message: `Percobaan [${experimentId}] telah dimasukkan ke dalam antrean kirim server.`,
      })
      refreshData()
    }
  }

  const handleSendQueueToServer = async () => {
    if (myQueueItems.length === 0) {
      setActionAlert({
        type: 'info',
        message: 'Tidak ada item yang sedang berada dalam antrean kirim.',
      })
      return
    }

    setIsSyncing(true)
    try {
      const res = await sendQueueToServer()
      if (res.success) {
        setActionAlert({
          type: 'success',
          message: `Server HTTP 200 OK: ${res.processedCount} data percobaan berhasil diterima dan diarsipkan oleh server! Pemilik dan ID percobaan terverifikasi.`,
        })
        refreshData()
      }
    } catch {
      setActionAlert({
        type: 'error',
        message: 'Terjadi kegagalan koneksi jaringan saat mengirim ke server.',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // ==========================================================================
  // Handler Evaluasi Guru
  // ==========================================================================

  const handleOpenEvaluateModal = (item: ExperimentItem) => {
    setEvaluatingItem(item)
    setTeacherFeedbackText(item.teacherFeedback || '')
    setTeacherRating(item.teacherRating || 'Baik')
  }

  const handleSaveTeacherEvaluation = () => {
    if (!evaluatingItem || !currentUser || currentUser.role !== 'guru') return

    const feedback = teacherFeedbackText.trim() || 'Hasil percobaan telah diperiksa dan disetujui oleh Guru.'
    const res = teacherReviewExperiment(evaluatingItem.id, currentUser, feedback, teacherRating)

    if (res.success) {
      setActionAlert({
        type: 'success',
        message: `Evaluasi untuk percobaan [${evaluatingItem.id}] milik ${evaluatingItem.ownerName} berhasil disimpan. Siswa sekarang dapat membaca umpan balik ini.`,
      })
      setEvaluatingItem(null)
      refreshData()
    }
  }

  // Filter Data untuk Guru Dashboard
  const filteredGuruExperiments = allExperiments.filter((item) => {
    // Hanya tampilkan yang sudah dikaitkan atau diterima server/guru
    if (item.status === 'belum_dikaitkan') return false

    if (guruFilterStudent !== 'all' && item.ownerId !== guruFilterStudent) {
      return false
    }

    if (guruFilterStatus === 'perlu_review' && item.status !== 'diterima_server') {
      return false
    }
    if (guruFilterStatus === 'sudah_dibaca' && item.status !== 'dibaca_guru') {
      return false
    }

    if (guruSearchQuery.trim()) {
      const q = guruSearchQuery.toLowerCase()
      const matchId = item.id.toLowerCase().includes(q)
      const matchOwner = (item.ownerName || '').toLowerCase().includes(q)
      const matchTitle = item.title.toLowerCase().includes(q)
      if (!matchId && !matchOwner && !matchTitle) return false
    }

    return true
  })

  // Format Helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  const renderStatusBadge = (status: ExperimentItem['status']) => {
    switch (status) {
      case 'belum_dikaitkan':
        return <span className="status-badge status-unlinked">Belum Dikaitkan</span>
      case 'terkait':
        return <span className="status-badge status-linked">Terkait Akun</span>
      case 'dalam_antrean':
        return <span className="status-badge status-queued">Dalam Antrean Kirim</span>
      case 'diterima_server':
        return <span className="status-badge status-received">✓ Diterima Server</span>
      case 'dibaca_guru':
        return <span className="status-badge status-reviewed">★ Telah Dibaca Guru</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  return (
    <section id="login-portal-section" className="login-portal-section content-section" aria-labelledby="portal-heading">
      {/* Header Halaman */}
      <div className="section-header-left">
        {onNavigateHome && (
          <div style={{ marginBottom: '14px' }}>
            <button
              type="button"
              className="btn btn-outline-cyan btn-xs"
              onClick={onNavigateHome}
            >
              ← Kembali ke Beranda
            </button>
          </div>
        )}
        <div className="section-tag-row">
          <span className="section-module-pill">Sistem Autentikasi & Server</span>
          <span className="section-topic-pill">Sinkronisasi Percobaan Siswa & Guru</span>
        </div>
        <h2 id="portal-heading" className="section-title">
          Portal Akun, Tautan Hasil, & Antrean Server
        </h2>
        <p className="section-description">
          Kaitkan hasil eksperimen laboratorium dan kuis ke akun Anda dengan ID percobaan yang tetap terjaga.
          Antrekan data untuk dikirim ke server, dan pantau hasil evaluasi pembelajaran bersama Bapak/Ibu Guru.
        </p>
      </div>

      {/* Alert Notifikasi Aksi */}
      {actionAlert && (
        <div className={`portal-alert-box alert-${actionAlert.type} animate-fade-in`}>
          <div className="alert-content">
            <span className="alert-icon">
              {actionAlert.type === 'success' && '✅'}
              {actionAlert.type === 'info' && 'ℹ️'}
              {actionAlert.type === 'error' && '⚠️'}
            </span>
            <span className="alert-text">{actionAlert.message}</span>
          </div>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setActionAlert(null)}
            aria-label="Tutup notifikasi"
          >
            ×
          </button>
        </div>
      )}

      {/* Card Status Pengguna Saat Ini */}
      <div className="user-status-card">
        {currentUser ? (
          <div className="current-user-info-row">
            <div className="user-profile-left">
              <div
                className="user-avatar-circle"
                style={{ backgroundColor: currentUser.avatarColor }}
              >
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="user-profile-details">
                <div className="user-name-role-row">
                  <h3 className="user-full-name">{currentUser.fullName}</h3>
                  <span className={`role-badge role-${currentUser.role}`}>
                    {currentUser.role === 'guru' ? '👩‍🏫 Guru Kimia' : '👨‍🎓 Siswa'}
                  </span>
                </div>
                <div className="user-meta-row">
                  <span className="user-id-code">
                    {currentUser.identifierNumber}
                  </span>
                  {currentUser.schoolClass && (
                    <span className="user-class-tag">
                      Kelas: {currentUser.schoolClass}
                    </span>
                  )}
                  {currentUser.subject && (
                    <span className="user-class-tag">
                      Mata Pelajaran: {currentUser.subject}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="user-profile-actions">
              {currentUser.role === 'siswa' && (
                <button
                  type="button"
                  className="btn btn-outline-cyan btn-sm"
                  onClick={() => setActiveTab('tautkan')}
                >
                  🔗 Tautkan Hasil
                </button>
              )}
              {currentUser.role === 'guru' && (
                <button
                  type="button"
                  className="btn btn-outline-cyan btn-sm"
                  onClick={() => setActiveTab('guru_dashboard')}
                >
                  📊 Dashboard Guru
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                onClick={handleLogout}
              >
                Keluar (Logout)
              </button>
            </div>
          </div>
        ) : (
          <div className="guest-login-prompt">
            <div className="guest-prompt-text">
              <h4>Anda Sedang Menggunakan Mode Tamu (Belum Masuk)</h4>
              <p>
                Hasil praktikum dan kuis yang Anda kerjakan akan tersimpan sementara di peramban ini.
                Masuk ke akun Siswa untuk menautkan hasil, mengantrekan kiriman ke server, atau masuk sebagai Guru untuk memeriksa tugas siswa.
              </p>
            </div>
            <div className="fast-login-chips">
              <span className="fast-chip-label">Pilih Akses Cepat Demo:</span>
              <button
                type="button"
                className="fast-login-btn btn-chip-student"
                onClick={() => handleQuickLogin('budi')}
              >
                👨‍🎓 Siswa: Budi (XI MIPA 1)
              </button>
              <button
                type="button"
                className="fast-login-btn btn-chip-student"
                onClick={() => handleQuickLogin('nadia')}
              >
                👩‍🎓 Siswa: Nadia (XI MIPA 2)
              </button>
              <button
                type="button"
                className="fast-login-btn btn-chip-teacher"
                onClick={() => handleQuickLogin('guru')}
              >
                👩‍🏫 Guru: Ibu Sri Wahyuni
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Jika Belum Login: Tampilkan Form Login / Register */}
      {!currentUser && (
        <div className="auth-form-card">
          <div className="auth-tab-switch">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('login')
                setAuthError(null)
              }}
            >
              Masuk ke Akun
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('register')
                setAuthError(null)
              }}
            >
              Daftar Akun Baru
            </button>
          </div>

          {authError && <div className="form-error-banner">{authError}</div>}
          {authSuccess && <div className="form-success-banner">{authSuccess}</div>}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-inner-form">
              <div className="form-group">
                <label htmlFor="login-username">Nama Pengguna (Username):</label>
                <input
                  id="login-username"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: budi atau guru"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Kata Sandi (Password):</label>
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  placeholder="Masukkan kata sandi (demo: 123)"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary btn-submit-auth">
                  Masuk Sekarang →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-inner-form">
              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="reg-fullname">Nama Lengkap Siswa / Guru *</label>
                  <input
                    id="reg-fullname"
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Ahmad Fauzi"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-username">Username Unik *</label>
                  <input
                    id="reg-username"
                    type="text"
                    className="form-input"
                    placeholder="Contoh: ahmad_fauzi"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="reg-role">Peran (Role) Pengguna *</label>
                  <select
                    id="reg-role"
                    className="form-input form-select"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                  >
                    <option value="siswa">👨‍🎓 Siswa SMA (Kelas XI)</option>
                    <option value="guru">👩‍🏫 Guru / Pendidik Kimia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-idnum">
                    {regRole === 'siswa' ? 'Nomor Induk Siswa (NIS) *' : 'Nomor Induk Pegawai (NIP) *'}
                  </label>
                  <input
                    id="reg-idnum"
                    type="text"
                    className="form-input"
                    placeholder={regRole === 'siswa' ? 'Contoh: 20261103' : 'Contoh: 19850101...'}
                    value={regIdNumber}
                    onChange={(e) => setRegIdNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              {regRole === 'siswa' ? (
                <div className="form-group">
                  <label htmlFor="reg-class">Rombongan Belajar / Kelas:</label>
                  <input
                    id="reg-class"
                    type="text"
                    className="form-input"
                    placeholder="Contoh: XI MIPA 1"
                    value={regSchoolClass}
                    onChange={(e) => setRegSchoolClass(e.target.value)}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="reg-subject">Mata Pelajaran:</label>
                  <input
                    id="reg-subject"
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Kimia"
                    value={regSubject}
                    onChange={(e) => setRegSubject(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="reg-password">Kata Sandi (Password) *</label>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="Buat kata sandi akun"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary btn-submit-auth">
                  Daftarkan Akun & Masuk →
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ====================================================================
          TAB NAVIGASI UTAMA FITUR PORTAL
          ==================================================================== */}
      <div className="portal-subnav-bar">
        {currentUser?.role === 'guru' ? (
          <>
            <button
              type="button"
              className={`portal-subnav-tab ${activeTab === 'guru_dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('guru_dashboard')}
            >
              📊 Dashboard Penilaian & Evaluasi Siswa
            </button>
            <button
              type="button"
              className={`portal-subnav-tab ${activeTab === 'antrean' ? 'active' : ''}`}
              onClick={() => setActiveTab('antrean')}
            >
              📥 Antrean Masuk Server ({myQueueItems.length})
            </button>
            <button
              type="button"
              className={`portal-subnav-tab ${activeTab === 'server_logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('server_logs')}
            >
              🖥️ Log Transaksi Server
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`portal-subnav-tab ${activeTab === 'tautkan' ? 'active' : ''}`}
              onClick={() => setActiveTab('tautkan')}
            >
              🔗 Pilih & Tautkan Hasil ke Akun ({unlinkedList.length})
            </button>
            <button
              type="button"
              className={`portal-subnav-tab ${activeTab === 'antrean' ? 'active' : ''}`}
              onClick={() => setActiveTab('antrean')}
            >
              📤 Antrean Kirim ke Server ({myQueueItems.length})
            </button>
            <button
              type="button"
              className={`portal-subnav-tab ${activeTab === 'riwayat' ? 'active' : ''}`}
              onClick={() => setActiveTab('riwayat')}
            >
              📋 Hasil Saya & Umpan Balik Guru ({myExperiments.length})
            </button>
            <button
              type="button"
              className={`portal-subnav-tab ${activeTab === 'server_logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('server_logs')}
            >
              🖥️ Log Respon Server
            </button>
          </>
        )}
      </div>

      {/* ====================================================================
          VIEW 1: PILIH HASIL YANG AKAN DIKAITKAN KE AKUN
          ==================================================================== */}
      {activeTab === 'tautkan' && (
        <div className="portal-tab-content animate-fade-in">
          <div className="feature-intro-card">
            <div className="feature-intro-icon">🔗</div>
            <div>
              <h3 className="feature-intro-title">Pilih Hasil Percobaan untuk Dikaitkan ke Akun</h3>
              <p className="feature-intro-desc">
                Pilih pengujian laboratorium virtual atau kuis yang telah dilakukan pada sesi belajar lokal.
                Saat dikaitkan ke akun Anda, <strong>identitas pemilik</strong> akan dicatat dan <strong>ID Percobaan asli akan tetap dipertahankan</strong> secara utuh.
              </p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header-row">
              <div>
                <h4 className="portal-card-title">Daftar Hasil yang Belum Dikaitkan ({unlinkedList.length})</h4>
                <span className="portal-card-subtitle">
                  Centang hasil di bawah ini untuk dikaitkan dengan akun{' '}
                  <strong>{currentUser ? currentUser.fullName : '(Harap Masuk Akun)'}</strong>
                </span>
              </div>

              <div className="header-actions-group">
                <button
                  type="button"
                  className="btn btn-outline-cyan btn-sm"
                  onClick={handleSelectAllUnlinked}
                  disabled={unlinkedList.length === 0}
                >
                  {selectedUnlinkedIds.length === unlinkedList.length && unlinkedList.length > 0
                    ? 'Batal Pilih Semua'
                    : 'Pilih Semua'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleLinkSelectedToAccount}
                  disabled={selectedUnlinkedIds.length === 0 || !currentUser}
                >
                  Kaitkan {selectedUnlinkedIds.length > 0 ? `(${selectedUnlinkedIds.length})` : ''} ke Akun Saya →
                </button>
              </div>
            </div>

            {unlinkedList.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-icon">🎉</div>
                <h5>Semua hasil percobaan sudah dikaitkan ke akun!</h5>
                <p>
                  Belum ada percobaan baru yang belum bertuan. Anda dapat melakukan pengujian baru di Lab Virtual atau mengerjakan kuis untuk menghasilkan catatan baru.
                </p>
                <div className="empty-action-buttons">
                  {onNavigateLab && (
                    <button
                      type="button"
                      className="btn btn-outline-cyan btn-sm"
                      onClick={onNavigateLab}
                    >
                      Buka Lab Virtual
                    </button>
                  )}
                  {onNavigateQuiz && (
                    <button
                      type="button"
                      className="btn btn-outline-cyan btn-sm"
                      onClick={onNavigateQuiz}
                    >
                      Buka Kuis Asam Basa
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="experiments-table-wrapper">
                <table className="chem-table portal-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Pilih</th>
                      <th>ID Percobaan (Tetap)</th>
                      <th>Jenis & Judul</th>
                      <th>Detail Pengamatan / Nilai</th>
                      <th>Waktu Uji</th>
                      <th>Status Kepemilikan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unlinkedList.map((item) => {
                      const isSelected = selectedUnlinkedIds.includes(item.id)
                      return (
                        <tr
                          key={item.id}
                          className={isSelected ? 'row-selected' : ''}
                          onClick={() => toggleSelectUnlinked(item.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectUnlinked(item.id)}
                              aria-label={`Pilih percobaan ${item.id}`}
                            />
                          </td>
                          <td>
                            <code className="font-mono experiment-id-tag">{item.id}</code>
                          </td>
                          <td>
                            <div className="item-title-type">
                              <span className="item-type-pill">
                                {item.experimentType === 'lab_simulasi'
                                  ? '🔬 Lab Virtual'
                                  : '📝 Kuis Modul'}
                              </span>
                              <strong>{item.title}</strong>
                            </div>
                            <span className="item-summary-text">{item.summary}</span>
                          </td>
                          <td>
                            {item.experimentType === 'lab_simulasi' ? (
                              <div className="lab-detail-cell">
                                <div className="color-preview-pill">
                                  <span
                                    className="color-dot"
                                    style={{ backgroundColor: item.details.colorHex || '#ccc' }}
                                  />
                                  <span>{item.details.colorName}</span>
                                </div>
                                <span className="ph-badge">pH: {item.details.ph?.toFixed(1)}</span>
                                <span className="nature-badge">{item.details.natureLabel}</span>
                              </div>
                            ) : (
                              <div className="quiz-detail-cell">
                                <span className="score-badge">Skor: {item.details.score} / 100</span>
                                <span className="correct-badge">
                                  {item.details.correctCount} Benar, {item.details.wrongCount} Salah
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="text-muted font-mono">{formatDate(item.createdAt)}</td>
                          <td>
                            <span className="owner-status-tag unassigned">
                              ⚠️ Belum Dikaitkan
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          VIEW 2: ANTREAN PENGIRIMAN DATA KE SERVER
          ==================================================================== */}
      {activeTab === 'antrean' && (
        <div className="portal-tab-content animate-fade-in">
          <div className="feature-intro-card">
            <div className="feature-intro-icon">📤</div>
            <div>
              <h3 className="feature-intro-title">Antrean Pengiriman Data Percobaan ke Server</h3>
              <p className="feature-intro-desc">
                Data percobaan dalam antrean memuat <strong>identitas pemilik</strong> dan <strong>ID Percobaan yang tetap dipertahankan</strong>.
                Tekan tombol <em>"Kirim ke Server"</em> agar server menerima, mengarsipkan, dan memvalidasi payload HTTP 200 untuk dibaca oleh Guru.
              </p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header-row">
              <div>
                <h4 className="portal-card-title">
                  Daftar Antrean Siap Kirim ({myQueueItems.length})
                </h4>
                <span className="portal-card-subtitle">
                  {isSyncing
                    ? 'Sedang mengirim payload antrean ke server...'
                    : 'Server akan menerima data dan mengarsipkan ID percobaan beserta pemiliknya.'}
                </span>
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm btn-sync-server"
                  onClick={handleSendQueueToServer}
                  disabled={myQueueItems.length === 0 || isSyncing}
                >
                  {isSyncing ? (
                    <>
                      <span className="spinner-inline" />
                      <span>Mengirim ke Server...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀 Kirim Antrean ke Server</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {myQueueItems.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-icon">📬</div>
                <h5>Antrean pengiriman server sedang kosong</h5>
                <p>
                  Tidak ada percobaan yang tertahan di antrean. Hasil percobaan Anda yang sudah terkait dapat dimasukkan ke antrean dari tab <em>"Hasil Saya"</em>.
                </p>
              </div>
            ) : (
              <div className="experiments-table-wrapper">
                <table className="chem-table portal-table">
                  <thead>
                    <tr>
                      <th>ID Percobaan (Tetap)</th>
                      <th>Pemilik Terdaftar</th>
                      <th>Jenis Percobaan</th>
                      <th>Data Hasil</th>
                      <th>Waktu Masuk Antrean</th>
                      <th>Status Aliran</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myQueueItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <code className="font-mono experiment-id-tag">{item.id}</code>
                        </td>
                        <td>
                          <div className="owner-info-cell">
                            <strong>{item.ownerName || 'Anonim'}</strong>
                            <span className="owner-sub-badge">{item.ownerClass || 'Siswa'}</span>
                          </div>
                        </td>
                        <td>
                          <span className="item-type-pill">
                            {item.experimentType === 'lab_simulasi'
                              ? '🔬 Lab Virtual'
                              : '📝 Kuis Modul'}
                          </span>
                        </td>
                        <td>
                          {item.experimentType === 'lab_simulasi' ? (
                            <span>
                              {item.details.sampleName} • pH {item.details.ph?.toFixed(1)}
                            </span>
                          ) : (
                            <span>Skor Kuis: {item.details.score}/100</span>
                          )}
                        </td>
                        <td className="text-muted font-mono">{formatDate(item.queuedAt)}</td>
                        <td>{renderStatusBadge(item.status)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-cyan btn-xs"
                            onClick={() => sendQueueToServer([item.id]).then(() => refreshData())}
                            disabled={isSyncing}
                          >
                            Kirim Ini
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          VIEW 3: HASIL SAYA & UMPAN BALIK GURU (SISWA MEMBACA HASILNYA)
          ==================================================================== */}
      {activeTab === 'riwayat' && (
        <div className="portal-tab-content animate-fade-in">
          <div className="feature-intro-card">
            <div className="feature-intro-icon">📋</div>
            <div>
              <h3 className="feature-intro-title">Hasil Percobaan Saya & Pembacaan Guru</h3>
              <p className="feature-intro-desc">
                Siswa dapat membaca riwayat lengkap pengujian yang dikaitkan ke akun, memeriksa status penerimaan server,
                serta melihat umpan balik dan evaluasi yang telah diberikan oleh Guru.
              </p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header-row">
              <div>
                <h4 className="portal-card-title">
                  Riwayat Percobaan Terkait Akun ({myExperiments.length})
                </h4>
                <span className="portal-card-subtitle">
                  Pemilik: <strong>{currentUser ? currentUser.fullName : 'Tamu'}</strong>
                </span>
              </div>
            </div>

            {myExperiments.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-icon">🔬</div>
                <h5>Belum ada percobaan yang dikaitkan ke akun ini</h5>
                <p>
                  Buka tab <em>"Pilih & Tautkan Hasil"</em> untuk mengaitkan hasil pengujian sebelumnya ke akun Anda.
                </p>
              </div>
            ) : (
              <div className="student-results-grid">
                {myExperiments.map((item) => (
                  <div key={item.id} className="result-detail-card">
                    <div className="result-card-top">
                      <div className="result-id-group">
                        <span className="id-label">ID Percobaan:</span>
                        <code className="font-mono experiment-id-badge">{item.id}</code>
                      </div>
                      <div className="result-status-group">{renderStatusBadge(item.status)}</div>
                    </div>

                    <h4 className="result-title">{item.title}</h4>
                    <p className="result-summary">{item.summary}</p>

                    {/* Rincian Hasil Sains */}
                    <div className="result-science-box">
                      {item.experimentType === 'lab_simulasi' ? (
                        <div className="science-attributes-row">
                          <div className="attr-item">
                            <span className="attr-label">Sampel:</span>
                            <span className="attr-value">{item.details.sampleName}</span>
                          </div>
                          <div className="attr-item">
                            <span className="attr-label">Indikator:</span>
                            <span className="attr-value">{item.details.indicatorName}</span>
                          </div>
                          <div className="attr-item">
                            <span className="attr-label">Warna Pengamatan:</span>
                            <div className="color-inline-swatch">
                              <span
                                className="color-dot"
                                style={{ backgroundColor: item.details.colorHex || '#ccc' }}
                              />
                              <span className="attr-value">{item.details.colorName}</span>
                            </div>
                          </div>
                          <div className="attr-item">
                            <span className="attr-label">Estimasi pH:</span>
                            <span className="attr-value font-mono">
                              {item.details.ph?.toFixed(1)} ({item.details.natureLabel})
                            </span>
                          </div>
                          {item.details.hypothesisNature && (
                            <div className="attr-item">
                              <span className="attr-label">Hipotesis Awal:</span>
                              <span className="attr-value">
                                {item.details.hypothesisNature}{' '}
                                <span style={{ fontSize: '11px', color: item.details.isHypothesisCorrect ? '#166534' : '#b45309', fontWeight: 600 }}>
                                  ({item.details.isHypothesisCorrect ? '✓ Sesuai' : '⚡ Refleksi'})
                                </span>
                              </span>
                            </div>
                          )}
                          {item.details.studentConclusion && (
                            <div className="attr-item" style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
                              <span className="attr-label">Kesimpulan Inkuiri Siswa:</span>
                              <span className="attr-value" style={{ fontStyle: 'italic' }}>
                                "{item.details.studentConclusion}"
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="science-attributes-row">
                          <div className="attr-item">
                            <span className="attr-label">Skor Akhir:</span>
                            <span className="attr-value font-mono score-highlight">
                              {item.details.score} / 100
                            </span>
                          </div>
                          <div className="attr-item">
                            <span className="attr-label">Akurasi Jawaban:</span>
                            <span className="attr-value">
                              {item.details.correctCount} Benar, {item.details.wrongCount} Salah
                            </span>
                          </div>
                          <div className="attr-item">
                            <span className="attr-label">Modul:</span>
                            <span className="attr-value">{item.details.moduleTitle}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata Aliran Pengiriman Server */}
                    <div className="result-meta-row">
                      <span>Dibuat: {formatDate(item.createdAt)}</span>
                      {item.serverReceivedAt && (
                        <span className="text-cyan">
                          Server ACK: {item.serverAckId} ({formatDate(item.serverReceivedAt)})
                        </span>
                      )}
                    </div>

                    {/* Catatan / Feedback dari Guru (Kebutuhan: Siswa Membaca Hasilnya) */}
                    {item.status === 'dibaca_guru' && item.teacherFeedback && (
                      <div className="teacher-feedback-box animate-fade-in">
                        <div className="feedback-box-header">
                          <span className="feedback-teacher-badge">
                            👩‍🏫 Evaluasi Guru: {item.teacherName}
                          </span>
                          {item.teacherRating && (
                            <span className="feedback-rating-badge">{item.teacherRating}</span>
                          )}
                        </div>
                        <p className="feedback-text">"{item.teacherFeedback}"</p>
                        <span className="feedback-date">
                          Diperiksa pada: {formatDate(item.teacherReadAt)}
                        </span>
                      </div>
                    )}

                    {/* Tombol Antrekan jika status masih 'terkait' */}
                    {item.status === 'terkait' && (
                      <div className="result-card-bottom-actions">
                        <button
                          type="button"
                          className="btn btn-outline-cyan btn-sm"
                          onClick={() => handleEnqueueItem(item.id)}
                        >
                          📤 Masukkan ke Antrean Server
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          VIEW 4: DASHBOARD EVALUASI GURU (GURU MEMBACA HASIL SISWA)
          ==================================================================== */}
      {activeTab === 'guru_dashboard' && (
        <div className="portal-tab-content animate-fade-in">
          <div className="feature-intro-card teacher-theme">
            <div className="feature-intro-icon">👩‍🏫</div>
            <div>
              <h3 className="feature-intro-title">Dashboard Evaluasi & Penilaian Guru</h3>
              <p className="feature-intro-desc">
                Guru membaca hasil pengujian seluruh siswa yang telah diterima server.
                ID Percobaan dan Pemilik dipertahankan secara akurat. Guru dapat memberikan umpan balik saintifik dan menandai status pembacaan.
              </p>
            </div>
          </div>

          {/* Kartu Ringkasan Metrik Guru */}
          <div className="guru-metrics-grid">
            <div className="metric-box">
              <span className="metric-num">
                {allExperiments.filter((i) => i.status !== 'belum_dikaitkan').length}
              </span>
              <span className="metric-label">Total Percobaan Siswa Masuk</span>
            </div>
            <div className="metric-box metric-warning">
              <span className="metric-num">
                {allExperiments.filter((i) => i.status === 'diterima_server').length}
              </span>
              <span className="metric-label">Perlu Diperiksa & Dinilai</span>
            </div>
            <div className="metric-box metric-success">
              <span className="metric-num">
                {allExperiments.filter((i) => i.status === 'dibaca_guru').length}
              </span>
              <span className="metric-label">Telah Dibaca & Diberi Feedback</span>
            </div>
            <div className="metric-box metric-info">
              <span className="metric-num">
                {myQueueItems.length}
              </span>
              <span className="metric-label">Dalam Antrean Pengiriman</span>
            </div>
          </div>

          {/* Filter & Kontrol Pencarian Guru */}
          <div className="portal-card">
            <div className="filter-controls-row">
              <div className="filter-item">
                <label htmlFor="filter-student">Filter Siswa (Pemilik):</label>
                <select
                  id="filter-student"
                  className="form-input form-select"
                  value={guruFilterStudent}
                  onChange={(e) => setGuruFilterStudent(e.target.value)}
                >
                  <option value="all">Semua Siswa</option>
                  {usersList
                    .filter((u) => u.role === 'siswa')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.schoolClass || 'Siswa'})
                      </option>
                    ))}
                </select>
              </div>

              <div className="filter-item">
                <label htmlFor="filter-status">Filter Status:</label>
                <select
                  id="filter-status"
                  className="form-input form-select"
                  value={guruFilterStatus}
                  onChange={(e) => setGuruFilterStatus(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="perlu_review">⚠️ Perlu Diperiksa (Diterima Server)</option>
                  <option value="sudah_dibaca">✅ Sudah Dibaca & Dinilai</option>
                </select>
              </div>

              <div className="filter-item flex-grow">
                <label htmlFor="filter-search">Cari ID Percobaan / Judul:</label>
                <input
                  id="filter-search"
                  type="text"
                  className="form-input"
                  placeholder="Cari kata kunci atau ID..."
                  value={guruSearchQuery}
                  onChange={(e) => setGuruSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Tabel Pemeriksaan Guru */}
            {filteredGuruExperiments.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-icon">🔍</div>
                <h5>Tidak ditemukan data percobaan yang cocok dengan filter</h5>
              </div>
            ) : (
              <div className="experiments-table-wrapper">
                <table className="chem-table portal-table">
                  <thead>
                    <tr>
                      <th>ID Percobaan (Tetap)</th>
                      <th>Pemilik (Siswa)</th>
                      <th>Jenis & Uji</th>
                      <th>Hasil Percobaan</th>
                      <th>Waktu Server</th>
                      <th>Status Evaluasi</th>
                      <th>Aksi Guru</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuruExperiments.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <code className="font-mono experiment-id-tag">{item.id}</code>
                        </td>
                        <td>
                          <div className="owner-info-cell">
                            <strong>{item.ownerName || 'Anonim'}</strong>
                            <span className="owner-sub-badge">{item.ownerClass || 'Siswa'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="item-title-type">
                            <span className="item-type-pill">
                              {item.experimentType === 'lab_simulasi'
                                ? '🔬 Lab Virtual'
                                : '📝 Kuis Modul'}
                            </span>
                            <span className="table-item-title">{item.title}</span>
                          </div>
                        </td>
                        <td>
                          {item.experimentType === 'lab_simulasi' ? (
                            <div className="lab-table-summary">
                              <span
                                className="color-dot"
                                style={{ backgroundColor: item.details.colorHex || '#ccc' }}
                              />
                              <span>
                                pH {item.details.ph?.toFixed(1)} ({item.details.natureLabel})
                              </span>
                            </div>
                          ) : (
                            <span className="score-badge">Skor: {item.details.score} / 100</span>
                          )}
                        </td>
                        <td className="text-muted font-mono">{formatDate(item.serverReceivedAt || item.createdAt)}</td>
                        <td>{renderStatusBadge(item.status)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-xs"
                            onClick={() => handleOpenEvaluateModal(item)}
                          >
                            {item.status === 'dibaca_guru' ? '✏️ Edit Ulasan' : '📖 Periksa & Nilai'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL EVALUASI GURU
          ==================================================================== */}
      {evaluatingItem && (
        <div className="portal-modal-overlay" role="dialog" aria-modal="true">
          <div className="portal-modal-card animate-fade-in">
            <div className="modal-header-row">
              <div className="modal-title-group">
                <span className="modal-eyebrow">Form Evaluasi Guru</span>
                <h3 className="modal-title">Periksa Hasil: {evaluatingItem.title}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEvaluatingItem(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body-content">
              {/* Ringkasan Data Percobaan yang Tetap Dipertahankan */}
              <div className="modal-data-summary-box">
                <div className="summary-field">
                  <span className="summary-label">ID Percobaan:</span>
                  <code className="font-mono experiment-id-badge">{evaluatingItem.id}</code>
                </div>
                <div className="summary-field">
                  <span className="summary-label">Pemilik (Siswa):</span>
                  <strong>{evaluatingItem.ownerName}</strong> ({evaluatingItem.ownerClass})
                </div>
                <div className="summary-field">
                  <span className="summary-label">Waktu Diterima Server:</span>
                  <span>{formatDate(evaluatingItem.serverReceivedAt || evaluatingItem.createdAt)}</span>
                </div>
                {evaluatingItem.serverAckId && (
                  <div className="summary-field">
                    <span className="summary-label">Tiket Server:</span>
                    <span className="text-cyan font-mono">{evaluatingItem.serverAckId}</span>
                  </div>
                )}
              </div>

              {/* Rincian Sains */}
              <div className="modal-science-details">
                {evaluatingItem.experimentType === 'lab_simulasi' ? (
                  <div className="science-table-grid">
                    <p><strong>Sampel Kimia:</strong> {evaluatingItem.details.sampleName}</p>
                    <p><strong>Indikator:</strong> {evaluatingItem.details.indicatorName}</p>
                    <p><strong>Warna Akhir:</strong> {evaluatingItem.details.colorName}</p>
                    <p><strong>Estimasi pH:</strong> {evaluatingItem.details.ph?.toFixed(1)}</p>
                    <p><strong>Kesimpulan Sifat:</strong> {evaluatingItem.details.natureLabel}</p>
                    {evaluatingItem.details.hypothesisNature && (
                      <p>
                        <strong>Hipotesis Awal Siswa:</strong> {evaluatingItem.details.hypothesisNature}{' '}
                        <span style={{ color: evaluatingItem.details.isHypothesisCorrect ? '#166534' : '#b45309', fontWeight: 600 }}>
                          ({evaluatingItem.details.isHypothesisCorrect ? '✓ Sesuai Data' : '⚡ Perlu Refleksi'})
                        </span>
                      </p>
                    )}
                    {evaluatingItem.details.studentConclusion && (
                      <p style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
                        <strong>Kesimpulan Inkuiri Siswa:</strong> "{evaluatingItem.details.studentConclusion}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="science-table-grid">
                    <p><strong>Skor:</strong> {evaluatingItem.details.score} / 100</p>
                    <p><strong>Jawaban Benar:</strong> {evaluatingItem.details.correctCount}</p>
                    <p><strong>Jawaban Salah:</strong> {evaluatingItem.details.wrongCount}</p>
                    <p><strong>Waktu Pengerjaan:</strong> {evaluatingItem.details.durationSeconds || '-'} detik</p>
                  </div>
                )}
              </div>

              {/* Form Input Umpan Balik Guru */}
              <div className="teacher-input-area">
                <div className="form-group">
                  <label htmlFor="eval-rating">Predikat / Kategori Nilai Guru:</label>
                  <select
                    id="eval-rating"
                    className="form-input form-select"
                    value={teacherRating}
                    onChange={(e) => setTeacherRating(e.target.value as any)}
                  >
                    <option value="Sangat Baik">🌟 Sangat Baik (A)</option>
                    <option value="Baik">👍 Baik (B)</option>
                    <option value="Perlu Perbaikan">🔄 Perlu Perbaikan Konsep (C)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="eval-feedback">
                    Catatan Pembimbing / Umpan Balik Guru (Akan Dibaca oleh Siswa) *:
                  </label>
                  <textarea
                    id="eval-feedback"
                    className="form-input form-textarea"
                    rows={4}
                    placeholder="Tuliskan umpan balik saintifik untuk siswa, misalnya: Hasil analisis indikator sudah tepat..."
                    value={teacherFeedbackText}
                    onChange={(e) => setTeacherFeedbackText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setEvaluatingItem(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveTeacherEvaluation}
              >
                ✅ Simpan & Tandai Telah Dibaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          VIEW 5: LOG TRANSAKSI & RESPON SERVER (KIRIM BACA SERVER AKAN MENERIMA)
          ==================================================================== */}
      {activeTab === 'server_logs' && (
        <div className="portal-tab-content animate-fade-in">
          <div className="feature-intro-card">
            <div className="feature-intro-icon">🖥️</div>
            <div>
              <h3 className="feature-intro-title">Log Konsol Server Penerimaan & Pembacaan</h3>
              <p className="feature-intro-desc">
                Pantau komunikasi payload HTTP 200 antara peramban siswa, server penerima, dan portal pembacaan guru secara transparan.
              </p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header-row">
              <h4 className="portal-card-title">Riwayat Aktivitas Server ({serverLogs.length})</h4>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  clearServerLogs()
                  setServerLogs([])
                }}
              >
                Hapus Log Konsol
              </button>
            </div>

            <div className="server-console-terminal">
              {serverLogs.length === 0 ? (
                <div className="terminal-empty">Belum ada aktivitas transaksi server tercatat.</div>
              ) : (
                serverLogs.map((log) => (
                  <div key={log.id} className="terminal-log-line">
                    <span className="log-time">[{formatDate(log.timestamp)}]</span>{' '}
                    <span className={`log-code code-${log.httpCode}`}>HTTP {log.httpCode}</span>{' '}
                    <span className="log-expid font-mono">[{log.experimentId}]</span>{' '}
                    <span className="log-owner">({log.ownerName})</span>: {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

