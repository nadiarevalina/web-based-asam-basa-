import type {
  ExperimentItem,
  ServerSyncLog,
  UserAccount,
  UserRole,
} from '../types/auth'

const STORAGE_KEYS = {
  USERS: 'asambasa_auth_users_v2',
  CURRENT_USER: 'asambasa_current_user_v2',
  EXPERIMENTS: 'asambasa_experiments_v2',
  SERVER_LOGS: 'asambasa_server_logs_v2',
}

// Akun Demo Bawaan
const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr_siswa_budi',
    username: 'budi',
    password: '123',
    fullName: 'Budi Pratama',
    role: 'siswa',
    identifierNumber: 'NIS-20261101',
    schoolClass: 'XI MIPA 1',
    avatarColor: '#0ea5e9',
  },
  {
    id: 'usr_siswa_nadia',
    username: 'nadia',
    password: '123',
    fullName: 'Nadia Revalina',
    role: 'siswa',
    identifierNumber: 'NIS-20261102',
    schoolClass: 'XI MIPA 2',
    avatarColor: '#ec4899',
  },
  {
    id: 'usr_guru_sri',
    username: 'guru',
    password: '123',
    fullName: 'Ibu Sri Wahyuni, M.Pd',
    role: 'guru',
    identifierNumber: 'NIP-198504122010012003',
    subject: 'Kimia SMA',
    avatarColor: '#8b5cf6',
  },
]

// Data Eksperimen Awal (Mencakup contoh: Belum Dikaitkan, Dalam Antrean, Diterima Server, Telah Dibaca Guru)
const INITIAL_EXPERIMENTS: ExperimentItem[] = [
  {
    id: 'EXP-LAB-CH3COOH-8291',
    experimentType: 'lab_simulasi',
    title: 'Uji Asam Cuka (CH3COOH) dengan Lakmus Biru',
    summary: 'Pengamatan perubahan warna lakmus biru menjadi merah pada larutan asam cuka rumah tangga.',
    createdAt: '2026-11-09T08:30:00.000Z',
    ownerId: null, // BELUM DIKAITKAN KE AKUN (Dapat dipilih siswa untuk dikaitkan!)
    ownerName: null,
    ownerRole: null,
    status: 'belum_dikaitkan',
    details: {
      sampleName: 'Asam Cuka Dapur (CH3COOH)',
      indicatorName: 'Kertas Lakmus Biru',
      ph: 2.8,
      colorName: 'Merah Cerah',
      colorHex: '#ef4444',
      natureLabel: 'Asam Kuat/Sedang',
    },
  },
  {
    id: 'ATT-QUIZ-M1-4820',
    experimentType: 'kuis_evaluasi',
    title: 'Evaluasi Formatif Kuis Modul 1 (Konsep Asam Basa)',
    summary: 'Pengerjaan 10 butir soal HOTS konsep Arrhenius, Brønsted–Lowry, dan Lewis.',
    createdAt: '2026-11-09T09:15:00.000Z',
    ownerId: null, // BELUM DIKAITKAN KE AKUN (Dapat dipilih siswa untuk dikaitkan!)
    ownerName: null,
    ownerRole: null,
    status: 'belum_dikaitkan',
    details: {
      score: 90,
      correctCount: 9,
      wrongCount: 1,
      totalQuestions: 10,
      durationSeconds: 245,
      moduleTitle: 'Modul 1: Mengenal Asam dan Basa',
    },
  },
  {
    id: 'EXP-LAB-NAOH-5104',
    experimentType: 'lab_simulasi',
    title: 'Uji Larutan Pembersih NaOH dengan Fenolftalein (PP)',
    summary: 'Pengujian indikator sintesis PP pada natrium hidroksida dengan perubahan warna merah muda keunguan.',
    createdAt: '2026-11-09T10:00:00.000Z',
    ownerId: 'usr_siswa_nadia',
    ownerName: 'Nadia Revalina',
    ownerRole: 'siswa',
    ownerClass: 'XI MIPA 2',
    status: 'dalam_antrean',
    queuedAt: '2026-11-09T10:05:00.000Z',
    details: {
      sampleName: 'Natrium Hidroksida (NaOH)',
      indicatorName: 'Fenolftalein (PP)',
      ph: 13.0,
      colorName: 'Merah Muda Keunguan (Magenta)',
      colorHex: '#ec4899',
      natureLabel: 'Basa Kuat',
    },
  },
  {
    id: 'EXP-LAB-HCL-1129',
    experimentType: 'lab_simulasi',
    title: 'Uji Larutan Asam Klorida (HCl 0.1 M) dengan Bromtimol Biru',
    summary: 'Eksperimen pembuktian ion H+ pada larutan HCl menggunakan indikator BTB menghasilkan warna kuning.',
    createdAt: '2026-11-08T14:20:00.000Z',
    ownerId: 'usr_siswa_budi',
    ownerName: 'Budi Pratama',
    ownerRole: 'siswa',
    ownerClass: 'XI MIPA 1',
    status: 'diterima_server',
    queuedAt: '2026-11-08T14:22:00.000Z',
    serverReceivedAt: '2026-11-08T14:22:05.120Z',
    serverAckId: 'SRV-ACK-9021',
    details: {
      sampleName: 'Asam Klorida (HCl 0.1 M)',
      indicatorName: 'Bromtimol Biru (BTB)',
      ph: 1.0,
      colorName: 'Kuning Terang',
      colorHex: '#eab308',
      natureLabel: 'Asam Kuat',
    },
  },
  {
    id: 'ATT-QUIZ-M1-3011',
    experimentType: 'kuis_evaluasi',
    title: 'Kuis Evaluasi Pemahaman pH & Sifat Asam Basa',
    summary: 'Pengerjaan kuis materi pH dan indikator oleh Budi Pratama.',
    createdAt: '2026-11-08T11:00:00.000Z',
    ownerId: 'usr_siswa_budi',
    ownerName: 'Budi Pratama',
    ownerRole: 'siswa',
    ownerClass: 'XI MIPA 1',
    status: 'dibaca_guru',
    queuedAt: '2026-11-08T11:15:00.000Z',
    serverReceivedAt: '2026-11-08T11:15:04.000Z',
    serverAckId: 'SRV-ACK-8812',
    teacherReadAt: '2026-11-08T13:40:00.000Z',
    teacherName: 'Ibu Sri Wahyuni, M.Pd',
    teacherRating: 'Sangat Baik',
    teacherFeedback:
      'Luar biasa Budi! Jawaban konsep asam basa Arrhenius dan identifikasi sifat asam sangat tepat. Pertahankan pemahaman untuk praktikum titrasi berikutnya.',
    details: {
      score: 95,
      correctCount: 10,
      wrongCount: 0,
      totalQuestions: 10,
      durationSeconds: 190,
      moduleTitle: 'Modul 1: Evaluasi Formatif',
    },
  },
]

// ============================================================================
// Helper LocalStorage
// ============================================================================

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage write error:', e)
  }
}

// Inisialisasi data awal jika storage masih kosong
export function initAuthStorage(): void {
  const existingUsers = safeGetItem<UserAccount[]>(STORAGE_KEYS.USERS, [])
  if (existingUsers.length === 0) {
    safeSetItem(STORAGE_KEYS.USERS, DEFAULT_USERS)
  }

  const existingExperiments = safeGetItem<ExperimentItem[]>(STORAGE_KEYS.EXPERIMENTS, [])
  if (existingExperiments.length === 0) {
    safeSetItem(STORAGE_KEYS.EXPERIMENTS, INITIAL_EXPERIMENTS)
  }

  const existingLogs = safeGetItem<ServerSyncLog[]>(STORAGE_KEYS.SERVER_LOGS, [])
  if (existingLogs.length === 0) {
    const initialLogs: ServerSyncLog[] = [
      {
        id: 'log-001',
        timestamp: '2026-11-08T14:22:05.120Z',
        experimentId: 'EXP-LAB-HCL-1129',
        ownerName: 'Budi Pratama (XI MIPA 1)',
        status: 'SUCCESS',
        httpCode: 200,
        message: 'Payload percobaan EXP-LAB-HCL-1129 berhasil diterima server. ID Percobaan dan Pemilik diarsipkan.',
      },
      {
        id: 'log-002',
        timestamp: '2026-11-08T11:15:04.000Z',
        experimentId: 'ATT-QUIZ-M1-3011',
        ownerName: 'Budi Pratama (XI MIPA 1)',
        status: 'SUCCESS',
        httpCode: 200,
        message: 'Hasil kuis ATT-QUIZ-M1-3011 berhasil diterima server. Siap dibaca oleh Guru.',
      },
    ]
    safeSetItem(STORAGE_KEYS.SERVER_LOGS, initialLogs)
  }
}

// ============================================================================
// Autentikasi & Akun
// ============================================================================

export function getCurrentUser(): UserAccount | null {
  initAuthStorage()
  return safeGetItem<UserAccount | null>(STORAGE_KEYS.CURRENT_USER, null)
}

export function setCurrentUser(user: UserAccount | null): void {
  safeSetItem(STORAGE_KEYS.CURRENT_USER, user)
}

export function getAllUsers(): UserAccount[] {
  initAuthStorage()
  return safeGetItem<UserAccount[]>(STORAGE_KEYS.USERS, DEFAULT_USERS)
}

export function loginUser(
  username: string,
  password?: string
): { success: boolean; user?: UserAccount; error?: string } {
  initAuthStorage()
  const users = getAllUsers()
  const user = users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  )

  if (!user) {
    return {
      success: false,
      error: `Pengguna dengan username "${username}" tidak ditemukan.`,
    }
  }

  if (password && user.password && user.password !== password) {
    return {
      success: false,
      error: 'Kata sandi tidak sesuai. Silakan coba kembali.',
    }
  }

  setCurrentUser(user)
  return { success: true, user }
}

export function registerUser(newUser: {
  username: string
  fullName: string
  role: UserRole
  identifierNumber: string
  schoolClass?: string
  subject?: string
  password?: string
}): { success: boolean; user?: UserAccount; error?: string } {
  initAuthStorage()
  const users = getAllUsers()

  if (users.some((u) => u.username.toLowerCase() === newUser.username.trim().toLowerCase())) {
    return {
      success: false,
      error: `Username "${newUser.username}" sudah digunakan. Silakan pilih username lain.`,
    }
  }

  const roleColors: Record<UserRole, string> = {
    siswa: '#0ea5e9',
    guru: '#8b5cf6',
  }

  const createdUser: UserAccount = {
    id: `usr_${newUser.role}_${Date.now().toString(36)}`,
    username: newUser.username.trim(),
    fullName: newUser.fullName.trim(),
    role: newUser.role,
    identifierNumber: newUser.identifierNumber.trim(),
    schoolClass: newUser.schoolClass?.trim(),
    subject: newUser.subject?.trim(),
    password: newUser.password || '123',
    avatarColor: roleColors[newUser.role] || '#06b6d4',
  }

  const updatedUsers = [...users, createdUser]
  safeSetItem(STORAGE_KEYS.USERS, updatedUsers)
  setCurrentUser(createdUser)

  return { success: true, user: createdUser }
}

export function logoutUser(): void {
  setCurrentUser(null)
}

// ============================================================================
// Manajemen Percobaan & Antrean Server
// ============================================================================

export function getAllExperiments(): ExperimentItem[] {
  initAuthStorage()
  return safeGetItem<ExperimentItem[]>(STORAGE_KEYS.EXPERIMENTS, INITIAL_EXPERIMENTS)
}

export function saveAllExperiments(experiments: ExperimentItem[]): void {
  safeSetItem(STORAGE_KEYS.EXPERIMENTS, experiments)
}

/**
 * Mengambil daftar hasil percobaan yang BELUM dikaitkan ke akun manapun (unlinked)
 */
export function getUnlinkedExperiments(): ExperimentItem[] {
  const all = getAllExperiments()
  return all.filter((exp) => exp.status === 'belum_dikaitkan' || !exp.ownerId)
}

/**
 * Mengambil riwayat percobaan milik siswa tertentu
 */
export function getExperimentsByOwner(ownerId: string): ExperimentItem[] {
  const all = getAllExperiments()
  return all.filter((exp) => exp.ownerId === ownerId)
}

/**
 * Mengambil percobaan yang sedang berada dalam antrean kirim
 */
export function getQueuedExperiments(): ExperimentItem[] {
  const all = getAllExperiments()
  return all.filter((exp) => exp.status === 'dalam_antrean')
}

/**
 * TAUTKAN HASIL KE AKUN (Sesuai kebutuhan: "pilih hasil yang akan dikaitkan ke akun")
 * KETENTUAN UTAMA: ID Percobaan tetap dipertahankan! Pemilik diperbarui sesuai akun.
 */
export function linkExperimentsToAccount(
  experimentIds: string[],
  user: UserAccount
): { success: boolean; count: number; linkedIds: string[] } {
  const all = getAllExperiments()
  let count = 0
  const linkedIds: string[] = []

  const updated = all.map((item) => {
    if (experimentIds.includes(item.id)) {
      count++
      linkedIds.push(item.id)
      return {
        ...item,
        // ID PERCOBAAN TETAP DIPERTAHANKAN (item.id tidak diubah)
        ownerId: user.id,
        ownerName: user.fullName,
        ownerRole: user.role,
        ownerClass: user.schoolClass || 'Siswa Kimia',
        status: (item.status === 'belum_dikaitkan' ? 'terkait' : item.status) as ExperimentItem['status'],
      }
    }
    return item
  })

  saveAllExperiments(updated)
  return { success: true, count, linkedIds }
}

/**
 * ANTREKAN PERCOBAAN (Sesuai kebutuhan: "Antrekan berupa pemilik dan ID percobaan tetap dipertahankan")
 * Memasukkan hasil percobaan ke antrean kirim server
 */
export function enqueueExperiments(
  experimentIds: string[]
): { success: boolean; count: number } {
  const all = getAllExperiments()
  let count = 0

  const updated = all.map((item) => {
    if (experimentIds.includes(item.id)) {
      count++
      return {
        ...item,
        // Pemilik dan ID percobaan tetap dipertahankan
        status: 'dalam_antrean' as const,
        queuedAt: new Date().toISOString(),
      }
    }
    return item
  })

  saveAllExperiments(updated)
  return { success: true, count }
}

/**
 * KIRIM KE SERVER (Sesuai kebutuhan: "kirim baca server akan menerima")
 * Mensimulasikan server HTTP menerima payload data antrean percobaan
 */
export async function sendQueueToServer(
  targetExperimentIds?: string[]
): Promise<{
  success: boolean
  processedCount: number
  newLogs: ServerSyncLog[]
}> {
  const all = getAllExperiments()
  const queuedItems = all.filter((item) => {
    if (targetExperimentIds && targetExperimentIds.length > 0) {
      return targetExperimentIds.includes(item.id)
    }
    return item.status === 'dalam_antrean'
  })

  if (queuedItems.length === 0) {
    return { success: false, processedCount: 0, newLogs: [] }
  }

  // Simulasi latensi pengiriman jaringan ke server
  await new Promise((resolve) => setTimeout(resolve, 800))

  const nowIso = new Date().toISOString()
  const generatedLogs: ServerSyncLog[] = []

  const updatedAll = all.map((item) => {
    const isTarget = queuedItems.some((q) => q.id === item.id)
    if (isTarget) {
      const ackId = `SRV-ACK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      const logEntry: ServerSyncLog = {
        id: `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: nowIso,
        experimentId: item.id, // ID percobaan tetap dipertahankan
        ownerName: item.ownerName ? `${item.ownerName} (${item.ownerClass || 'Siswa'})` : 'Anonim',
        status: 'SUCCESS',
        httpCode: 200,
        message: `HTTP 200 OK: Server berhasil menerima & mengarsipkan percobaan [${item.id}] milik [${item.ownerName || 'Siswa'}]. Status tersinkronisasi.`,
      }
      generatedLogs.push(logEntry)

      return {
        ...item,
        status: 'diterima_server' as const,
        serverReceivedAt: nowIso,
        serverAckId: ackId,
      }
    }
    return item
  })

  saveAllExperiments(updatedAll)

  // Simpan catatan log server
  const existingLogs = safeGetItem<ServerSyncLog[]>(STORAGE_KEYS.SERVER_LOGS, [])
  safeSetItem(STORAGE_KEYS.SERVER_LOGS, [...generatedLogs, ...existingLogs])

  return {
    success: true,
    processedCount: queuedItems.length,
    newLogs: generatedLogs,
  }
}

/**
 * GURU MEMBACA & MENGEVALUASI HASIL (Sesuai kebutuhan: "siswa dan guru membaca hasilnya")
 * Guru membaca detail percobaan siswa, memberikan umpan balik, dan menandai status selesai dibaca
 */
export function teacherReviewExperiment(
  experimentId: string,
  teacher: UserAccount,
  feedback: string,
  rating: 'Sangat Baik' | 'Baik' | 'Perlu Perbaikan' = 'Baik'
): { success: boolean; updatedItem?: ExperimentItem } {
  const all = getAllExperiments()
  let updatedItem: ExperimentItem | undefined

  const updatedAll = all.map((item) => {
    if (item.id === experimentId) {
      updatedItem = {
        ...item,
        status: 'dibaca_guru' as const,
        teacherReadAt: new Date().toISOString(),
        teacherName: teacher.fullName,
        teacherFeedback: feedback.trim(),
        teacherRating: rating,
      }
      return updatedItem
    }
    return item
  })

  saveAllExperiments(updatedAll)

  // Tambahkan log pembacaan guru
  if (updatedItem) {
    const existingLogs = safeGetItem<ServerSyncLog[]>(STORAGE_KEYS.SERVER_LOGS, [])
    const readLog: ServerSyncLog = {
      id: `log-read-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      experimentId: (updatedItem as ExperimentItem).id,
      ownerName: (updatedItem as ExperimentItem).ownerName || 'Siswa',
      status: 'READ',
      httpCode: 200,
      message: `Guru ${(teacher.fullName)} telah membaca & memberikan evaluasi pada percobaan [${(updatedItem as ExperimentItem).id}].`,
    }
    safeSetItem(STORAGE_KEYS.SERVER_LOGS, [readLog, ...existingLogs])
  }

  return { success: true, updatedItem }
}

/**
 * Menambahkan hasil pengujian baru dari Virtual Lab ke antrean/penyimpanan
 */
export function addLabExperimentRecord(params: {
  sampleName: string
  indicatorName: string
  ph: number
  colorName: string
  colorHex: string
  natureLabel: string
  currentUser?: UserAccount | null
}): ExperimentItem {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  const experimentId = `EXP-LAB-${timestamp}-${random}`

  const user = params.currentUser || getCurrentUser()

  const newExperiment: ExperimentItem = {
    id: experimentId, // ID percobaan unik
    experimentType: 'lab_simulasi',
    title: `Uji ${params.sampleName} (${params.indicatorName})`,
    summary: `Pengujian inkuiri virtual: warna ${params.colorName}, estimasi pH ${params.ph.toFixed(1)} (${params.natureLabel}).`,
    createdAt: new Date().toISOString(),
    ownerId: user ? user.id : null,
    ownerName: user ? user.fullName : null,
    ownerRole: user ? user.role : null,
    ownerClass: user?.schoolClass,
    status: user ? 'terkait' : 'belum_dikaitkan',
    details: {
      sampleName: params.sampleName,
      indicatorName: params.indicatorName,
      ph: params.ph,
      colorName: params.colorName,
      colorHex: params.colorHex,
      natureLabel: params.natureLabel,
    },
  }

  const all = getAllExperiments()
  saveAllExperiments([newExperiment, ...all])
  return newExperiment
}

/**
 * Menambahkan hasil kuis yang baru diselesaikan ke penyimpanan percobaan
 */
export function addQuizExperimentRecord(params: {
  attemptId: string
  score: number
  correctCount: number
  wrongCount: number
  totalQuestions: number
  durationSeconds?: number
  moduleTitle?: string
  currentUser?: UserAccount | null
}): ExperimentItem {
  const user = params.currentUser || getCurrentUser()

  const newExperiment: ExperimentItem = {
    id: params.attemptId, // ID percobaan dipertahankan dari attempt kuis
    experimentType: 'kuis_evaluasi',
    title: params.moduleTitle || 'Kuis Evaluasi Modul 1 Asam Basa',
    summary: `Pengerjaan kuis formatif: Skor ${params.score}/100 (${params.correctCount} Benar, ${params.wrongCount} Salah).`,
    createdAt: new Date().toISOString(),
    ownerId: user ? user.id : null,
    ownerName: user ? user.fullName : null,
    ownerRole: user ? user.role : null,
    ownerClass: user?.schoolClass,
    status: user ? 'terkait' : 'belum_dikaitkan',
    details: {
      score: params.score,
      correctCount: params.correctCount,
      wrongCount: params.wrongCount,
      totalQuestions: params.totalQuestions,
      durationSeconds: params.durationSeconds,
      moduleTitle: params.moduleTitle,
    },
  }

  const all = getAllExperiments()
  // Cegah duplikasi jika attemptId sudah ada
  const filtered = all.filter((e) => e.id !== params.attemptId)
  saveAllExperiments([newExperiment, ...filtered])
  return newExperiment
}

export function getServerLogs(): ServerSyncLog[] {
  initAuthStorage()
  return safeGetItem<ServerSyncLog[]>(STORAGE_KEYS.SERVER_LOGS, [])
}

export function clearServerLogs(): void {
  safeSetItem(STORAGE_KEYS.SERVER_LOGS, [])
}

