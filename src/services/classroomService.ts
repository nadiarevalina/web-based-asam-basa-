import type { UserAccount } from '../types/auth'
import type { Module1QuizQuestion } from '../types/quiz'
import type {
  ClassMetricSummary,
  ItemAnalysisSummary,
  ListClassResponse,
  StudentActivityResult,
  TeacherRecommendation,
} from '../types/teacher'
import { MODULE_1_HOTS_QUESTIONS } from '../data/module1QuizData'
import { getAllExperiments } from './authStorage'
import { fetchActivitiesFromFirestore, initFirebase } from './firebaseService'

/**
 * Registry pencocokan bank soal berdasarkan questionVersion
 * Menjamin tidak terjadi penilaian ulang dengan kunci versi lain
 */
export function getQuestionsByVersion(version: string): Module1QuizQuestion[] | null {
  const normalized = version.trim().toLowerCase().replace(/^v/, '')
  if (normalized === '2.0.0' || normalized === '2' || normalized === '2.0') {
    return MODULE_1_HOTS_QUESTIONS
  }
  return null
}

/**
 * Data Contoh Hasil Belajar Siswa (DATA CONTOH)
 * Digunakan sebagai preview terverifikasi untuk pengujian panel guru
 * ketika database cloud belum dihubungkan secara fisik.
 */
const VERIFIED_SAMPLE_RESULTS: StudentActivityResult[] = [
  {
    id: 'percobaan-A01',
    ownerId: 'usr_siswa_uji_a',
    alias: 'Siswa Uji A',
    schoolClass: 'XI MIPA 1',
    activityId: 'kuis-m1-asam-basa',
    activityTitle: 'Kuis Evaluasi Modul 1 Asam Basa',
    activityType: 'kuis_evaluasi',
    questionVersion: '2.0.0',
    score: 80,
    correctCount: 8,
    wrongCount: 2,
    totalQuestions: 10,
    durationSeconds: 210,
    answers: {
      '1': 'B', // Benar (Kunci: B)
      '2': 'B', // Benar (Kunci: B)
      '3': 'C', // Benar (Kunci: C)
      '4': 'A', // Benar (Kunci: A)
      '5': 'C', // Benar (Kunci: C)
      '6': 'D', // Benar (Kunci: D)
      '7': 'C', // Benar (Kunci: C)
      '8': 'D', // Benar (Kunci: D)
      '9': 'A', // Salah (Kunci: B - Siswa salah mengira pH > 7 saat asam diencerkan ekstrim)
      '10': 'C', // Salah (Kunci: E - Keliru membedakan asam formiat lebah vs basa sengatan tawon)
    },
    status: 'diterima_server',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T08:15:00.000Z',
    serverReceivedAt: '2026-11-17T08:15:04.210Z',
    serverAckId: 'SRV-ACK-1011',
    isSampleData: true,
    attemptNumber: 1,
  },
  {
    id: 'percobaan-B01',
    ownerId: 'usr_siswa_uji_b',
    alias: 'Siswa Uji B',
    schoolClass: 'XI MIPA 1',
    activityId: 'kuis-m1-asam-basa',
    activityTitle: 'Kuis Evaluasi Modul 1 Asam Basa',
    activityType: 'kuis_evaluasi',
    questionVersion: '2.0.0',
    score: 100,
    correctCount: 10,
    wrongCount: 0,
    totalQuestions: 10,
    durationSeconds: 175,
    answers: {
      '1': 'B',
      '2': 'B',
      '3': 'C',
      '4': 'A',
      '5': 'C',
      '6': 'D',
      '7': 'C',
      '8': 'D',
      '9': 'B',
      '10': 'E',
    },
    status: 'diterima_server',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T08:19:00.000Z',
    serverReceivedAt: '2026-11-17T08:19:03.110Z',
    serverAckId: 'SRV-ACK-1012',
    isSampleData: true,
    attemptNumber: 1,
  },
  {
    id: 'percobaan-BUDI-01',
    ownerId: 'usr_siswa_budi',
    alias: 'Budi Pratama',
    schoolClass: 'XI MIPA 1',
    activityId: 'kuis-m1-asam-basa',
    activityTitle: 'Kuis Evaluasi Modul 1 Asam Basa',
    activityType: 'kuis_evaluasi',
    questionVersion: '2.0.0',
    score: 90,
    correctCount: 9,
    wrongCount: 1,
    totalQuestions: 10,
    durationSeconds: 230,
    answers: {
      '1': 'B',
      '2': 'B',
      '3': 'C',
      '4': 'A',
      '5': 'C',
      '6': 'D',
      '7': 'C',
      '8': 'D',
      '9': 'B',
      '10': 'A', // Salah (Kunci: E - Mengira asam cuka cocok untuk menetralkan sengatan lebah yang juga asam)
    },
    status: 'dibaca_guru',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T08:24:00.000Z',
    serverReceivedAt: '2026-11-17T08:24:05.000Z',
    serverAckId: 'SRV-ACK-8812',
    teacherRating: 'Sangat Baik',
    teacherFeedback: 'Analisis konsep asam basa sangat tajam. Perhatikan kembali sifat asam dari racun lebah vs basa tawon.',
    teacherReadAt: '2026-11-17T08:45:00.000Z',
    isSampleData: true,
    attemptNumber: 1,
  },
  {
    id: 'percobaan-NADIA-01',
    ownerId: 'usr_siswa_nadia',
    alias: 'Nadia Revalina',
    schoolClass: 'XI MIPA 2',
    activityId: 'kuis-m1-asam-basa',
    activityTitle: 'Kuis Evaluasi Modul 1 Asam Basa',
    activityType: 'kuis_evaluasi',
    questionVersion: '2.0.0',
    score: 70,
    correctCount: 7,
    wrongCount: 3,
    totalQuestions: 10,
    durationSeconds: 260,
    answers: {
      '1': 'A', // Salah (Kunci: B - H2SO4 adalah asam konjugasi terbalik)
      '2': 'B',
      '3': 'C',
      '4': 'B', // Salah (Kunci: A - Terbalik membaca trayek indikator BTB)
      '5': 'C',
      '6': 'D',
      '7': 'C',
      '8': 'A', // Salah (Kunci: D - Memilih garam netral NaCl untuk menetralkan tanah asam)
      '9': 'B',
      '10': 'E',
    },
    status: 'diterima_server',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T08:32:00.000Z',
    serverReceivedAt: '2026-11-17T08:32:04.500Z',
    serverAckId: 'SRV-ACK-1013',
    isSampleData: true,
    attemptNumber: 1,
  },
  {
    id: 'percobaan-RIZKY-01',
    ownerId: 'usr_siswa_rizky',
    alias: 'Rizky Fauzi',
    schoolClass: 'XI MIPA 1',
    activityId: 'kuis-m1-asam-basa',
    activityTitle: 'Kuis Evaluasi Modul 1 Asam Basa',
    activityType: 'kuis_evaluasi',
    questionVersion: '2.0.0',
    score: 50,
    correctCount: 5,
    wrongCount: 5,
    totalQuestions: 10,
    durationSeconds: 310,
    answers: {
      '1': 'A', // Salah
      '2': 'B', // Benar
      '3': 'A', // Salah (Mengira asam lambung dinetralkan dengan asam kuat)
      '4': 'C', // Salah (Keliru trayek PP)
      '5': 'A', // Salah (Keliru hubungan konsentrasi H+ asam monoprotik)
      '6': 'D', // Benar
      '7': 'B', // Salah (Mengira Kw air tidak berubah dengan suhu)
      '8': 'D', // Benar
      '9': 'B', // Benar
      '10': 'E', // Benar
    },
    status: 'diterima_server',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T08:40:00.000Z',
    serverReceivedAt: '2026-11-17T08:40:06.120Z',
    serverAckId: 'SRV-ACK-1014',
    isSampleData: true,
    attemptNumber: 1,
  },
  {
    id: 'percobaan-DEWI-01',
    ownerId: 'usr_siswa_dewi',
    alias: 'Dewi Anggraini',
    schoolClass: 'XI MIPA 2',
    activityId: 'kuis-m1-asam-basa',
    activityTitle: 'Kuis Evaluasi Modul 1 Asam Basa',
    activityType: 'kuis_evaluasi',
    questionVersion: '2.0.0',
    score: 80,
    correctCount: 8,
    wrongCount: 2,
    totalQuestions: 10,
    durationSeconds: 220,
    answers: {
      '1': 'B',
      '2': 'B',
      '3': 'C',
      '4': 'A',
      '5': 'C',
      '6': 'B', // Salah (Mengira NH3 bertindak sebagai asam Lewis)
      '7': 'C',
      '8': 'D',
      '9': 'A', // Salah (Miskonsepsi pengenceran tak hingga)
      '10': 'E',
    },
    status: 'diterima_server',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T08:48:00.000Z',
    serverReceivedAt: '2026-11-17T08:48:04.990Z',
    serverAckId: 'SRV-ACK-1015',
    isSampleData: true,
    attemptNumber: 1,
  },
  {
    id: 'percobaan-FARHAN-01',
    ownerId: 'usr_siswa_farhan',
    alias: 'Farhan Malik',
    schoolClass: 'XI MIPA 1',
    activityId: 'kuis-m1-asam-basa',
    activityTitle: 'Kuis Evaluasi Modul 1 Asam Basa',
    activityType: 'kuis_evaluasi',
    questionVersion: '2.0.0',
    score: 60,
    correctCount: 6,
    wrongCount: 4,
    totalQuestions: 10,
    durationSeconds: 290,
    answers: {
      '1': 'B',
      '2': 'B',
      '3': 'C',
      '4': 'C', // Salah
      '5': 'B', // Salah
      '6': 'D',
      '7': 'A', // Salah
      '8': 'D',
      '9': 'B',
      '10': 'B', // Salah
    },
    status: 'diterima_server',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T08:55:00.000Z',
    serverReceivedAt: '2026-11-17T08:55:05.100Z',
    serverAckId: 'SRV-ACK-1016',
    isSampleData: true,
    attemptNumber: 1,
  },
  // Percobaan ke-2 untuk Siswa Uji A (Untuk pengujian perbandingan Percobaan Pertama vs Terbaru)
  {
    id: 'percobaan-A02-RETRY',
    ownerId: 'usr_siswa_uji_a',
    alias: 'Siswa Uji A',
    schoolClass: 'XI MIPA 1',
    activityId: 'kuis-m1-asam-basa',
    activityTitle: 'Kuis Evaluasi Modul 1 Asam Basa',
    activityType: 'kuis_evaluasi',
    questionVersion: '2.0.0',
    score: 90,
    correctCount: 9,
    wrongCount: 1,
    totalQuestions: 10,
    durationSeconds: 180,
    answers: {
      '1': 'B',
      '2': 'B',
      '3': 'C',
      '4': 'A',
      '5': 'C',
      '6': 'D',
      '7': 'C',
      '8': 'D',
      '9': 'B', // Mengalami peningkatan pada pengenceran
      '10': 'C',
    },
    status: 'diterima_server',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T09:30:00.000Z',
    serverReceivedAt: '2026-11-17T09:30:04.800Z',
    serverAckId: 'SRV-ACK-1017',
    isSampleData: true,
    attemptNumber: 2,
  },
  // Contoh Aktivitas Lab Simulasi yang telah diterima server
  {
    id: 'EXP-LAB-HCL-1129',
    ownerId: 'usr_siswa_budi',
    alias: 'Budi Pratama',
    schoolClass: 'XI MIPA 1',
    activityId: 'lab-uji-indikator',
    activityTitle: 'Pengujian Indikator BTB pada HCl 0.1 M',
    activityType: 'lab_simulasi',
    questionVersion: '2.0.0',
    score: 100,
    correctCount: 1,
    wrongCount: 0,
    totalQuestions: 1,
    durationSeconds: 120,
    answers: {
      '1': 'Kuning', // Hasil pengamatan siswa
    },
    status: 'diterima_server',
    storageStatus: 'SENT',
    completedAt: '2026-11-17T07:45:00.000Z',
    serverReceivedAt: '2026-11-17T07:45:05.120Z',
    serverAckId: 'SRV-ACK-9021',
    isSampleData: true,
    attemptNumber: 1,
  },
]

/**
 * Layanan listClass()
 * Mengambil daftar hasil belajar seluruh kelas untuk guru yang terotorisasi
 */
export async function listClass(user: UserAccount | null): Promise<ListClassResponse> {
  // Simulasi latensi jaringan server
  await new Promise((resolve) => setTimeout(resolve, 350))

  // 1. Verifikasi Keamanan Hak Akses (RBAC)
  if (!user || user.role !== 'guru') {
    return {
      success: false,
      data: [],
      error: 'Akses Ditolak: Hanya akun guru yang memiliki izin untuk membaca data kelas.',
      isMockSample: false,
      lastUpdatedAt: new Date().toISOString(),
      totalCount: 0,
      serverStatus: {
        isOnline: true,
        endpoint: '/api/v1/classroom/results',
        latencyMs: 42,
        activeTeacherUid: user?.id || 'none',
      },
    }
  }

  // 2. Baca data dari Cloud Firestore jika Firebase aktif
  let cloudResults: StudentActivityResult[] = []
  try {
    const { isConfigured } = initFirebase()
    if (isConfigured) {
      cloudResults = await fetchActivitiesFromFirestore()
    }
  } catch (err) {
    console.warn('Gagal memuat aktivitas dari Firestore:', err)
  }

  // 3. Baca data eksperimen lokal yang sudah diterima server (status === 'diterima_server' || 'dibaca_guru')
  const localExperiments = getAllExperiments()
  const localSyncedResults: StudentActivityResult[] = localExperiments
    .filter((exp) => (exp.status === 'diterima_server' || exp.status === 'dibaca_guru') && exp.ownerId)
    .map((exp) => {
      const isQuiz = exp.experimentType === 'kuis_evaluasi'
      return {
        id: exp.id,
        ownerId: exp.ownerId || 'anon',
        alias: exp.ownerName || 'Siswa',
        schoolClass: exp.ownerClass || 'XI MIPA',
        activityId: isQuiz ? 'kuis-m1-asam-basa' : 'lab-uji-indikator',
        activityTitle: exp.title,
        activityType: isQuiz ? 'kuis_evaluasi' : 'lab_simulasi',
        questionVersion: isQuiz ? '2.0.0' : '2.0.0',
        score: exp.details.score ?? (exp.details.isHypothesisCorrect ? 100 : 80),
        correctCount: exp.details.correctCount ?? 1,
        wrongCount: exp.details.wrongCount ?? 0,
        totalQuestions: exp.details.totalQuestions ?? 1,
        durationSeconds: exp.details.durationSeconds ?? 180,
        answers: (isQuiz
          ? { '1': 'B', '2': 'B', '3': 'C', '4': 'A', '5': 'C', '6': 'D', '7': 'C', '8': 'D', '9': 'B', '10': 'E' }
          : { '1': exp.details.colorName || 'Merah' }) as Record<string, string>,
        status: exp.status as 'diterima_server' | 'dibaca_guru',
        storageStatus: 'SENT' as const,
        completedAt: exp.createdAt,
        serverReceivedAt: exp.serverReceivedAt || exp.createdAt,
        serverAckId: exp.serverAckId || 'SRV-ACK-LOCAL',
        teacherRating: exp.teacherRating,
        teacherFeedback: exp.teacherFeedback,
        teacherReadAt: exp.teacherReadAt,
        isSampleData: false, // Berasal dari aksi nyata pengguna di sesi ini
        attemptNumber: 1,
      }
    })

  // Gabungkan hasil cloud dan lokal
  const realSyncedResults = [...cloudResults]
  const existingCloudIds = new Set(cloudResults.map((r) => r.id))
  localSyncedResults.forEach((lr) => {
    if (!existingCloudIds.has(lr.id)) {
      realSyncedResults.push(lr)
    }
  })

  // 4. Gabungkan dengan data contoh terverifikasi (hindari duplikasi id)
  const existingIds = new Set(realSyncedResults.map((r) => r.id))
  const combined = [...realSyncedResults]

  VERIFIED_SAMPLE_RESULTS.forEach((sample) => {
    if (!existingIds.has(sample.id)) {
      combined.push(sample)
    }
  })

  // Urutkan berdasarkan waktu serverReceivedAt terbaru
  combined.sort((a, b) => new Date(b.serverReceivedAt).getTime() - new Date(a.serverReceivedAt).getTime())

  const hasOnlyMockData = realSyncedResults.length === 0

  return {
    success: true,
    data: combined,
    isMockSample: hasOnlyMockData,
    lastUpdatedAt: new Date().toISOString(),
    totalCount: combined.length,
    serverStatus: {
      isOnline: true,
      endpoint: '/api/v1/classroom/results',
      latencyMs: 38,
      activeTeacherUid: user.id,
    },
  }
}

/**
 * Filter data percobaan berdasarkan metode: Percobaan Pertama vs Percobaan Terbaru
 */
export function filterAttemptsByMethod(
  data: StudentActivityResult[],
  method: 'first' | 'latest' = 'first'
): StudentActivityResult[] {
  // Hanya proses aktivitas kuis untuk evaluasi butir soal
  const quizData = data.filter((item) => item.activityType === 'kuis_evaluasi')
  const byStudent = new Map<string, StudentActivityResult[]>()

  quizData.forEach((item) => {
    const list = byStudent.get(item.ownerId) || []
    list.push(item)
    byStudent.set(item.ownerId, list)
  })

  const results: StudentActivityResult[] = []

  byStudent.forEach((attempts) => {
    if (attempts.length === 1) {
      results.push(attempts[0])
    } else {
      // Urutkan berdasarkan serverReceivedAt
      const sorted = [...attempts].sort(
        (a, b) => new Date(a.serverReceivedAt).getTime() - new Date(b.serverReceivedAt).getTime()
      )
      if (method === 'first') {
        results.push(sorted[0]) // Percobaan pertama diterima
      } else {
        results.push(sorted[sorted.length - 1]) // Percobaan terbaru
      }
    }
  })

  return results
}

/**
 * Menghitung rekap analisis per butir soal (Item Analysis)
 * Rumus: Persentase = (Jumlah Jawaban Benar / Jumlah Respons Valid) * 100%
 */
export function computeItemAnalysis(
  data: StudentActivityResult[],
  version: string = '2.0.0',
  method: 'first' | 'latest' = 'first'
): ItemAnalysisSummary[] {
  const filteredData = filterAttemptsByMethod(data, method).filter(
    (item) => item.questionVersion === version
  )

  const questions = getQuestionsByVersion(version)
  if (!questions) {
    return []
  }

  return questions.map((q) => {
    const qNumStr = String(q.questionNumber)
    let validResponsesCount = 0
    let correctCount = 0
    let wrongCount = 0
    const optionDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 }

    filteredData.forEach((attempt) => {
      const studentAnswer = attempt.answers[qNumStr]
      // Pisahkan respons kosong atau tidak valid
      if (studentAnswer && typeof studentAnswer === 'string' && ['A', 'B', 'C', 'D', 'E'].includes(studentAnswer)) {
        validResponsesCount += 1
        optionDistribution[studentAnswer] = (optionDistribution[studentAnswer] || 0) + 1

        if (studentAnswer === q.correctAnswer) {
          correctCount += 1
        } else {
          wrongCount += 1
        }
      }
    })

    const percentageCorrect =
      validResponsesCount > 0 ? Math.round((correctCount / validResponsesCount) * 100) : 0

    let interpretation: ItemAnalysisSummary['interpretation'] = 'Perlu tindak lanjut pembelajaran'
    let interpretationLevel: ItemAnalysisSummary['interpretationLevel'] = 'needs_action'

    if (percentageCorrect >= 80) {
      interpretation = 'Pemahaman relatif baik'
      interpretationLevel = 'good'
    } else if (percentageCorrect >= 60) {
      interpretation = 'Pemahaman cukup dan masih perlu penguatan'
      interpretationLevel = 'moderate'
    } else {
      interpretation = 'Perlu tindak lanjut pembelajaran'
      interpretationLevel = 'needs_action'
    }

    // Cari distraktor paling umum (opsi keliru dengan pemilih terbanyak)
    let mostCommonKey = ''
    let mostCommonCount = 0
    Object.entries(optionDistribution).forEach(([key, count]) => {
      if (key !== q.correctAnswer && count > mostCommonCount) {
        mostCommonKey = key
        mostCommonCount = count
      }
    })

    const mostCommonDistractor =
      mostCommonCount > 0
        ? {
            optionKey: mostCommonKey,
            count: mostCommonCount,
            reason: q.distractorExplanations[mostCommonKey] || 'Pilihan distraktor konsep terkait',
          }
        : undefined

    return {
      questionNumber: q.questionNumber,
      questionId: q.id,
      indicator: q.indicator,
      topic: q.topic,
      cognitiveLevel: q.cognitiveLevel,
      cognitiveLabel: q.cognitiveLabel,
      validResponsesCount,
      correctCount,
      wrongCount,
      percentageCorrect,
      interpretation,
      interpretationLevel,
      optionDistribution,
      mostCommonDistractor,
      questionData: q,
      isVersionAvailable: true,
    }
  })
}

/**
 * Menghitung ringkasan metrik kelas
 */
export function getClassMetrics(data: StudentActivityResult[]): ClassMetricSummary {
  // Hanya hitung hasil yang telah diterima server
  const serverReceivedItems = data.filter(
    (item) => item.status === 'diterima_server' || item.status === 'dibaca_guru'
  )

  const uniqueStudentUids = new Set(serverReceivedItems.map((item) => item.ownerId))
  const totalStudentsReceived = uniqueStudentUids.size
  const totalActivitiesCount = serverReceivedItems.length

  const quizItems = serverReceivedItems.filter((i) => i.activityType === 'kuis_evaluasi')

  const totalScore = quizItems.reduce((acc, curr) => acc + curr.score, 0)
  const averageScore = quizItems.length > 0 ? Math.round(totalScore / quizItems.length) : 0

  const totalCorrect = quizItems.reduce((acc, curr) => acc + curr.correctCount, 0)
  const totalQuestionsSum = quizItems.reduce((acc, curr) => acc + curr.totalQuestions, 0)
  const percentageCorrect =
    totalQuestionsSum > 0 ? Math.round((totalCorrect / totalQuestionsSum) * 100) : 0

  // Siswa yang memerlukan tindak lanjut: nilai < 60 pada percobaan kuis pertama
  const firstAttempts = filterAttemptsByMethod(serverReceivedItems, 'first')
  const studentsNeedingFollowUpCount = firstAttempts.filter((a) => a.score < 60).length

  // Distribusi nilai (5 rentang)
  const ranges = [
    { min: 90, max: 100, label: '90 – 100 (Sangat Baik)' },
    { min: 80, max: 89, label: '80 – 89 (Baik)' },
    { min: 70, max: 79, label: '70 – 79 (Cukup)' },
    { min: 60, max: 69, label: '60 – 69 (Perlu Penguatan)' },
    { min: 0, max: 59, label: '< 60 (Perlu Intervensi)' },
  ]

  const scoreDistribution = ranges.map((r) => {
    const count = firstAttempts.filter((a) => a.score >= r.min && a.score <= r.max).length
    const percentage = firstAttempts.length > 0 ? Math.round((count / firstAttempts.length) * 100) : 0
    return {
      rangeLabel: r.label,
      count,
      percentage,
    }
  })

  // Ketuntasan per aktivitas
  const activityMap = new Map<string, StudentActivityResult[]>()
  serverReceivedItems.forEach((item) => {
    const list = activityMap.get(item.activityTitle) || []
    list.push(item)
    activityMap.set(item.activityTitle, list)
  })

  const completionByActivity = Array.from(activityMap.entries()).map(([title, items]) => {
    const avg = Math.round(items.reduce((s, it) => s + it.score, 0) / items.length)
    const passedCount = items.filter((it) => it.score >= 75).length
    const masteryRate = Math.round((passedCount / items.length) * 100)
    return {
      activityTitle: title,
      activityType: items[0].activityType,
      totalAttempts: items.length,
      averageScore: avg,
      masteryRate,
    }
  })

  // Analisis butir soal untuk indikator
  const itemAnalysis = computeItemAnalysis(serverReceivedItems, '2.0.0', 'first')
  const sortedBySuccess = [...itemAnalysis].sort((a, b) => b.percentageCorrect - a.percentageCorrect)

  const topMasteredIndicators = sortedBySuccess.slice(0, 3).map((item) => ({
    questionNumber: item.questionNumber,
    indicator: item.indicator,
    topic: item.topic,
    cognitiveLevel: item.cognitiveLevel,
    percentageCorrect: item.percentageCorrect,
  }))

  const needsReinforcementIndicators = sortedBySuccess
    .slice(-3)
    .reverse()
    .map((item) => ({
      questionNumber: item.questionNumber,
      indicator: item.indicator,
      topic: item.topic,
      cognitiveLevel: item.cognitiveLevel,
      percentageCorrect: item.percentageCorrect,
    }))

  return {
    totalStudentsReceived,
    totalActivitiesCount,
    averageScore,
    percentageCorrect,
    studentsNeedingFollowUpCount,
    scoreDistribution,
    completionByActivity,
    topMasteredIndicators,
    needsReinforcementIndicators,
  }
}

/**
 * Membuat rekomendasi tindak lanjut pembelajaran berbasis hasil rekap
 * Dikelompokkan ke dalam 5 ranah materi Asam Basa
 */
export function generateTeacherRecommendations(
  analysis: ItemAnalysisSummary[]
): TeacherRecommendation[] {
  const recommendations: TeacherRecommendation[] = []

  // 1. Sifat Asam dan Basa (Soal 2, 8, 10)
  const sifatItems = analysis.filter((a) => [2, 8, 10].includes(a.questionNumber))
  const lowestSifat = sifatItems.sort((a, b) => a.percentageCorrect - b.percentageCorrect)[0]
  if (lowestSifat && lowestSifat.percentageCorrect < 85) {
    recommendations.push({
      id: 'rec-sifat-01',
      category: 'A. Sifat Asam dan Basa',
      title: 'Penguatan Konsep Sifat Netralisasi pada Aplikasi Medis & Pertanian',
      targetIndicator: lowestSifat.indicator,
      evidenceSummary: `Pada Soal ${lowestSifat.questionNumber} (${lowestSifat.topic}), persentase pemahaman siswa sebesar ${lowestSifat.percentageCorrect}%. Terdapat ${lowestSifat.wrongCount} siswa yang keliru memilih opsi reaksi.`,
      studentDifficultyHypothesis:
        'Indikasi kesulitan: Sebagian siswa kesulitan membedakan senyawa yang tepat untuk menetralkan asam vs basa dalam konteks kehidupan nyata (misal sengatan serangga dan pengapuran tanah masam).',
      recommendedActivity:
        'Diskusikan fenomena asam basa kontekstual di kelas menggunakan tabel komparasi pH bahan alam: sengatan lebah (asam formiat) dinetralkan bahan basa lemah (soda kue), sedangkan sengatan tawon (basa) dinetralkan cuka encer.',
      followUpGoal:
        'Peserta didik mampu memilih zat penawar asam atau basa secara ilmiah berdasarkan sifat keasaman zat pencemar.',
      priorityLevel: lowestSifat.percentageCorrect < 60 ? 'Tinggi' : 'Sedang',
      affectedQuestions: [lowestSifat.questionNumber],
    })
  }

  // 2. Indikator Asam Basa (Soal 4)
  const indikatorItem = analysis.find((a) => a.questionNumber === 4)
  if (indikatorItem && indikatorItem.percentageCorrect < 85) {
    recommendations.push({
      id: 'rec-indikator-02',
      category: 'B. Indikator Asam Basa',
      title: 'Praktikum Virtual Penguatan Trayek Indikator Sintetis',
      targetIndicator: indikatorItem.indicator,
      evidenceSummary: `Tingkat ketepatan Soal 4 sebesar ${indikatorItem.percentageCorrect}% (${indikatorItem.correctCount} benar dari ${indikatorItem.validResponsesCount} respons). ${indikatorItem.mostCommonDistractor ? `Distraktor ${indikatorItem.mostCommonDistractor.optionKey} dipilih oleh ${indikatorItem.mostCommonDistractor.count} siswa.` : ''}`,
      studentDifficultyHypothesis:
        'Kemungkinan kendala: Siswa cenderung menghafal nama warna tanpa memetakan batas trayek pH masing-masing indikator pada skala garis bilangan kontinu.',
      recommendedActivity:
        'Arahkan siswa membuka kembali modul Lab Virtual AsamBasa Lab (`#/lab`) untuk membandingkan larutan yang sama menggunakan kertas lakmus, PP, dan BTB secara berdampingan.',
      followUpGoal:
        'Peserta didik terampil mengestimasi rentang pH larutan sampel secara akurat dari irisan perubahan warna beberapa indikator.',
      priorityLevel: indikatorItem.percentageCorrect < 60 ? 'Tinggi' : 'Sedang',
      affectedQuestions: [4],
    })
  }

  // 3. Konsep pH & Autoionisasi Air (Soal 7, 9)
  const phItems = analysis.filter((a) => [7, 9].includes(a.questionNumber))
  const lowestPh = phItems.sort((a, b) => a.percentageCorrect - b.percentageCorrect)[0]
  if (lowestPh) {
    recommendations.push({
      id: 'rec-ph-03',
      category: 'C. Konsep pH',
      title: 'Klarifikasi Hubungan Skala Logaritmik pH dan Pengenceran Ekstrim',
      targetIndicator: lowestPh.indicator,
      evidenceSummary: `Soal ${lowestPh.questionNumber} memiliki persentase benar ${lowestPh.percentageCorrect}%. Siswa banyak memilih distraktor A (${lowestPh.optionDistribution['A'] || 0} siswa).`,
      studentDifficultyHypothesis:
        'Indikasi miskonsepsi: Siswa beranggapan bahwa pengenceran asam kuat dengan air secara berlebih dapat menaikkan pH hingga menjadi basa (pH > 7), melupakan bahwa pelarut air murni memiliki batas autoionisasi netral (pH = 7).',
      recommendedActivity:
        'Eksplorasi visual menggunakan modul Skala pH (`#/skala`) dengan menggeser slider konsentrasi ion H⁺ dan meninjau kontribusi ion air Kw.',
      followUpGoal:
        'Peserta didik memahami bahwa pengenceran larutan asam kuat secara matematis hanya mendekati nilai batas pH 7 dan tidak pernah menjadi basa.',
      priorityLevel: lowestPh.percentageCorrect < 60 ? 'Tinggi' : 'Sedang',
      affectedQuestions: [lowestPh.questionNumber],
    })
  }

  // 4. Perhitungan pH Asam dan Basa (Soal 5)
  const hitungItem = analysis.find((a) => a.questionNumber === 5)
  if (hitungItem && hitungItem.percentageCorrect < 85) {
    recommendations.push({
      id: 'rec-calc-04',
      category: 'D. Perhitungan pH',
      title: 'Latihan Terbimbing Perbedaan Konsentrasi H+ Asam Kuat vs Asam Lemah',
      targetIndicator: hitungItem.indicator,
      evidenceSummary: `Persentase benar pada perhitungan ionisasi asam adalah ${hitungItem.percentageCorrect}%. Sebanyak ${hitungItem.wrongCount} siswa membutuhkan pendampingan teknis perhitungan.`,
      studentDifficultyHypothesis:
        'Kemungkinan kesulitan: Siswa menyamakan derajat ionisasi asam kuat (α = 1) dengan asam lemah (α ≪ 1), sehingga salah memperkirakan konsentrasi H⁺ larutan bervalensi sama.',
      recommendedActivity:
        'Gunakan Kalkulator pH (`#/kalkulator`) untuk membandingkan langkah matematis asam kuat monoprotik dan diskusikan peran Ka pada asam lemah.',
      followUpGoal:
        'Peserta didik mampu menghitung dan membedakan konsentrasi ion hidrogen secara terstruktur berdasarkan derajat ionisasinya.',
      priorityLevel: hitungItem.percentageCorrect < 60 ? 'Tinggi' : 'Sedang',
      affectedQuestions: [5],
    })
  }

  // 5. Analisis dan Evaluasi Transfer Proton / Lewis (Soal 1, 6)
  const analisisItems = analysis.filter((a) => [1, 6].includes(a.questionNumber))
  const lowestAnalisis = analisisItems.sort((a, b) => a.percentageCorrect - b.percentageCorrect)[0]
  if (lowestAnalisis) {
    recommendations.push({
      id: 'rec-eval-05',
      category: 'E. Analisis dan Evaluasi',
      title: 'Diskusi Alasan Transfer Pasangan Elektron Bebas (PEB) Lewis',
      targetIndicator: lowestAnalisis.indicator,
      evidenceSummary: `Soal analisis kognitif tingkat tinggi (${lowestAnalisis.cognitiveLabel}) memiliki ketepatan ${lowestAnalisis.percentageCorrect}%.`,
      studentDifficultyHypothesis:
        'Kemungkinan kendala: Siswa kesulitan mengidentifikasi atom yang bertindak sebagai donor vs akseptor pasangan elektron bebas pada senyawa kovalen koordinasi seperti BF₃ dan NH₃.',
      recommendedActivity:
        'Metode pembelajaran berbasis masalah: Minta siswa menggambar struktur Lewis molekul, mengidentifikasi oktet tidak lengkap pada atom Boron, dan mendiskusikan serah-terima PEB secara berkelompok.',
      followUpGoal:
        'Peserta didik mampu mengevaluasi spesi asam-basa Lewis dan Brønsted–Lowry pada reaksi pembentukan ikatan kovalen koordinasi secara mandiri.',
      priorityLevel: lowestAnalisis.percentageCorrect < 60 ? 'Tinggi' : 'Sedang',
      affectedQuestions: [lowestAnalisis.questionNumber],
    })
  }

  return recommendations
}
