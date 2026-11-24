export type UserRole = 'siswa' | 'guru'

export interface UserAccount {
  id: string
  username: string
  password?: string
  fullName: string
  role: UserRole
  identifierNumber: string // NIS untuk siswa, NIP untuk guru
  schoolClass?: string // misal: 'XI MIPA 1'
  subject?: string // misal: 'Kimia'
  avatarColor: string
}

export type ExperimentStatus =
  | 'belum_dikaitkan' // Belum ditautkan ke akun pengguna (draft/anonim)
  | 'sedang_dikerjakan' // Sedang aktif dikerjakan oleh siswa
  | 'terkait' // Sudah ditautkan ke akun pemilik (tersimpan lokal)
  | 'dalam_antrean' // Masuk antrean siap dikirim ke server (menunggu pengiriman)
  | 'gagal_kirim' // Pengiriman ke server gagal/ditolak (siap dicoba ulang)
  | 'diterima_server' // Server telah mengonfirmasi penerimaan data secara valid
  | 'dibaca_guru' // Guru telah memeriksa dan membaca hasilnya

export type ExperimentType = 'lab_simulasi' | 'kuis_evaluasi'

export interface ExperimentDetails {
  // Untuk Lab Simulasi Inkuiri
  sampleName?: string
  indicatorName?: string
  ph?: number
  colorName?: string
  colorHex?: string
  natureLabel?: string
  hypothesisNature?: string
  studentConclusion?: string
  isHypothesisCorrect?: boolean
  // Untuk Kuis Evaluasi
  score?: number | null
  correctCount?: number
  wrongCount?: number
  totalQuestions?: number
  answeredCount?: number
  progressCount?: number
  durationSeconds?: number
  moduleTitle?: string
  answers?: Record<string, string>
  itemsDetail?: Record<number, any>
  questionVersion?: string
  startedAt?: string
  completedAt?: string
  syncError?: string
}

export interface ExperimentItem {
  id: string // ID Percobaan unik (harus tetap dipertahankan)
  experimentType: ExperimentType
  title: string
  summary: string
  createdAt: string
  // Kepemilikan (Pemilik)
  ownerId: string | null
  ownerName: string | null
  ownerRole: UserRole | null
  ownerClass?: string
  // Status aliran data
  status: ExperimentStatus
  queuedAt?: string
  serverReceivedAt?: string
  serverAckId?: string
  // Hasil pembacaan & umpan balik Guru
  teacherReadAt?: string
  teacherName?: string
  teacherFeedback?: string
  teacherRating?: 'Sangat Baik' | 'Baik' | 'Perlu Perbaikan'
  // Data detail kimia & kuis
  details: ExperimentDetails
}

export interface ServerSyncLog {
  id: string
  timestamp: string
  experimentId: string
  ownerName: string
  status: 'SUCCESS' | 'QUEUED' | 'READ' | 'FAILED'
  httpCode: number
  message: string
  error?: string
}
