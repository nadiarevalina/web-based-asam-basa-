import type { Module1QuizQuestion, QuizItemAnswer } from './quiz'

export type ActivityKind = 'kuis_evaluasi' | 'lab_simulasi' | 'diagnostic'

export type DataSyncStatus = 'LOCAL' | 'PENDING' | 'SENT' | 'FAILED'

export type ActivityStatus =
  | 'sedang_dikerjakan'
  | 'diterima_server'
  | 'dibaca_guru'
  | 'SENT'
  | 'belum_selesai'

/**
 * Kontrak data hasil aktivitas siswa yang diterima server (sesuai DATABASE.md & Lampiran B)
 */
export interface StudentActivityResult {
  id: string // ID Percobaan unik & kekal (misal: "ATT-QUIZ-M1-4820", "percobaan-A01")
  ownerId: string // UID Siswa
  alias: string // Nama samaran / Alias Siswa
  schoolClass?: string // Kelas (misal: "XI MIPA 1")
  activityId: string // ID Aktivitas (misal: "kuis-m1-asam-basa")
  activityTitle: string // Judul aktivitas
  activityType: ActivityKind
  questionVersion: string // Versi bank soal (misal: "2.0.0")
  score: number | null // Nilai akhir (0-100) atau null jika sedang dikerjakan
  correctCount: number
  wrongCount: number
  totalQuestions: number
  progressCount?: number // Jumlah soal terjawab saat ini
  durationSeconds?: number
  answers: Record<string, string> // Jawaban per nomor soal (misal: {"1": "B", "2": "B"})
  itemsDetail?: Record<number, QuizItemAnswer>
  status: ActivityStatus
  storageStatus: DataSyncStatus
  startedAt?: string // Waktu mulai pengerjaan kuis
  completedAt: string // Waktu penyelesaian di perangkat siswa (ISO String)
  serverReceivedAt: string // Waktu diterima server akademik (ISO String)
  serverAckId?: string // Tiket konfirmasi server (misal: "SRV-ACK-9021")
  teacherRating?: 'Sangat Baik' | 'Baik' | 'Perlu Perbaikan'
  teacherFeedback?: string
  teacherReadAt?: string
  isSampleData?: boolean // Penanda apakah data ini merupakan DATA CONTOH
  attemptNumber?: number // Percobaan ke-1, ke-2, dst.
  isCompleted?: boolean // Status apakah percobaan telah tuntas dikumpulkan
}

/**
 * Respon standar layanan listClass()
 */
export interface ListClassResponse {
  success: boolean
  data: StudentActivityResult[]
  error?: string
  isMockSample: boolean
  lastUpdatedAt: string
  totalCount: number
  serverStatus: {
    isOnline: boolean
    endpoint: string
    latencyMs: number
    activeTeacherUid: string
  }
}

/**
 * Ringkasan metrik kelas
 */
export interface ClassMetricSummary {
  totalStudentsReceived: number
  totalStudentsStarted?: number
  inProgressCount?: number
  completedCount?: number
  totalActivitiesCount: number
  averageScore: number
  percentageCorrect: number
  studentsNeedingFollowUpCount: number
  scoreDistribution: {
    rangeLabel: string
    count: number
    percentage: number
  }[]
  completionByActivity: {
    activityTitle: string
    activityType: ActivityKind
    totalAttempts: number
    averageScore: number
    masteryRate: number
  }[]
  topMasteredIndicators: {
    questionNumber: number
    indicator: string
    topic: string
    cognitiveLevel: string
    percentageCorrect: number
  }[]
  needsReinforcementIndicators: {
    questionNumber: number
    indicator: string
    topic: string
    cognitiveLevel: string
    percentageCorrect: number
  }[]
}

/**
 * Rekap analisis pemahaman per butir soal
 */
export interface ItemAnalysisSummary {
  questionNumber: number
  questionId: number
  indicator: string
  topic: string
  cognitiveLevel: string
  cognitiveLabel: string
  validResponsesCount: number // Jumlah respons valid
  correctCount: number // Jumlah jawaban benar
  wrongCount: number // Jumlah jawaban salah
  percentageCorrect: number // (correctCount / validResponsesCount) * 100
  interpretation: 'Pemahaman relatif baik' | 'Pemahaman cukup dan masih perlu penguatan' | 'Perlu tindak lanjut pembelajaran'
  interpretationLevel: 'good' | 'moderate' | 'needs_action'
  optionDistribution: Record<string, number> // Jumlah siswa yang memilih opsi A, B, C, D, E
  mostCommonDistractor?: {
    optionKey: string
    count: number
    reason: string
  }
  questionData?: Module1QuizQuestion
  isVersionAvailable: boolean
}

/**
 * Rekomendasi tindak lanjut pembelajaran
 */
export interface TeacherRecommendation {
  id: string
  category: 'A. Sifat Asam dan Basa' | 'B. Indikator Asam Basa' | 'C. Konsep pH' | 'D. Perhitungan pH' | 'E. Analisis dan Evaluasi'
  title: string
  targetIndicator: string
  evidenceSummary: string // Bukti berdasarkan hasil rekap
  studentDifficultyHypothesis: string // Kemungkinan kesulitan siswa
  recommendedActivity: string // Rekomendasi kegiatan pembelajaran
  followUpGoal: string // Tujuan tindak lanjut
  priorityLevel: 'Tinggi' | 'Sedang' | 'Pemantauan'
  affectedQuestions: number[]
}

/**
 * Tab aktif di dalam Panel Guru
 */
export type TeacherPanelTab =
  | 'ringkasan'
  | 'daftar_hasil'
  | 'rincian_aktivitas'
  | 'rekap_soal'
  | 'status_data'
  | 'tindak_lanjut'
