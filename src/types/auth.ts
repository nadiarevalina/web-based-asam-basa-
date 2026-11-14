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
  | 'terkait' // Sudah ditautkan ke akun pemilik
  | 'dalam_antrean' // Masuk antrean siap dikirim ke server
  | 'diterima_server' // Server telah menerima data (HTTP 200)
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
  score?: number
  correctCount?: number
  wrongCount?: number
  totalQuestions?: number
  durationSeconds?: number
  moduleTitle?: string
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
  status: 'SUCCESS' | 'QUEUED' | 'READ'
  httpCode: number
  message: string
}

