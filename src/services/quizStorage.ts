import type {
  Module1QuizQuestion,
  QuizAttemptHistory,
  QuizBackendSubmissionPayload,
  QuizBackendSyncResult,
  QuizDraftSession,
  QuizItemAnswer,
  QuizQuestion,
  StorageStatus,
} from '../types/quiz'
import { QUIZ_MODULE_ID, QUIZ_QUESTION_VERSION } from '../types/quiz'

const DRAFT_STORAGE_KEY = 'asambasa_quiz_m1_draft_v2'
const HISTORY_STORAGE_KEY = 'asambasa_quiz_m1_history_v2'

// Penyimpanan cadangan berbasis memori (in-memory fallback) jika localStorage tidak tersedia
const memoryStorageMap = new Map<string, string>()

let lastKnownStorageStatus: StorageStatus = {
  isAvailable: true,
  error: null,
}

/**
 * Menghasilkan ID percobaan acak yang unik untuk satu sesi kuis
 */
export function generateAttemptId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 9)
  return `att_m1_${timestamp}_${randomPart}`
}

/**
 * Memeriksa apakah localStorage tersedia dan dapat digunakan untuk menulis dan membaca
 */
export function checkLocalStorageAvailability(): StorageStatus {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      lastKnownStorageStatus = {
        isAvailable: false,
        error: 'Penyimpanan lokal (localStorage) tidak didukung oleh lingkungan peramban ini.',
      }
      return lastKnownStorageStatus
    }

    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)

    lastKnownStorageStatus = {
      isAvailable: true,
      error: null,
    }
    return lastKnownStorageStatus
  } catch (err) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : 'Penyimpanan lokal ditolak atau tidak memiliki izin akses.'
    lastKnownStorageStatus = {
      isAvailable: false,
      error: `Penyimpanan lokal tidak tersedia (${errorMsg}). Draf berjalan menggunakan memori sementara.`,
    }
    return lastKnownStorageStatus
  }
}

/**
 * Mendapatkan nilai dari penyimpanan dengan penanganan fallback memori
 */
function readRawStorage(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key)
    }
  } catch {
    // Abaikan dan gunakan memori cadangan
  }
  return memoryStorageMap.get(key) ?? null
}

/**
 * Menyimpan nilai ke penyimpanan dengan penanganan kesalahan aman
 */
function writeRawStorage(key: string, value: string): { success: boolean; error: string | null } {
  let localStorageSuccess = false
  let localStorageError: string | null = null

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value)
      localStorageSuccess = true
    }
  } catch (err) {
    localStorageError =
      err instanceof Error ? err.message : 'Gagal menulis ke localStorage (kuota penuh atau dibatasi).'
  }

  // Tetap sinkronkan ke memori cadangan
  memoryStorageMap.set(key, value)

  if (!localStorageSuccess && localStorageError) {
    lastKnownStorageStatus = {
      isAvailable: false,
      error: localStorageError,
    }
    return { success: false, error: localStorageError }
  }

  return { success: true, error: null }
}

/**
 * Menghapus kunci dari penyimpanan
 */
function removeRawStorage(key: string): { success: boolean; error: string | null } {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key)
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Gagal menghapus dari localStorage.'
    return { success: false, error: errorMsg }
  }
  memoryStorageMap.delete(key)
  return { success: true, error: null }
}

/**
 * Membuat struktur draf awal yang kosong untuk daftar soal yang diberikan
 */
export function createInitialDraft(
  questions: (QuizQuestion | Module1QuizQuestion)[],
  forcedAttemptId?: string,
): QuizDraftSession {
  const initialItems: Record<number, QuizItemAnswer> = {}

  questions.forEach((q) => {
    initialItems[q.id] = {
      questionId: q.id,
      selectedOption: null,
      isSubmitted: false,
      isCorrect: null,
    }
  })

  const now = new Date().toISOString()
  return {
    attemptId: forcedAttemptId || generateAttemptId(),
    moduleId: QUIZ_MODULE_ID,
    questionVersion: QUIZ_QUESTION_VERSION,
    currentQuestionIndex: 0,
    items: initialItems,
    startedAt: now,
    updatedAt: now,
    isCompleted: false,
  }
}

/**
 * Memuat draf kuis yang tersimpan. Jika data rusak atau versi berbeda,
 * sistem akan menginisialisasi draf baru tanpa memicu error crash.
 */
export function loadQuizDraft(questions: (QuizQuestion | Module1QuizQuestion)[]): {
  draft: QuizDraftSession
  fromStorage: boolean
  error: string | null
} {
  const raw = readRawStorage(DRAFT_STORAGE_KEY)
  if (!raw) {
    return {
      draft: createInitialDraft(questions),
      fromStorage: false,
      error: null,
    }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<QuizDraftSession>

    // Validasi skema dasar draf
    const isStructureValid =
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.attemptId === 'string' &&
      typeof parsed.items === 'object' &&
      parsed.items !== null

    if (!isStructureValid) {
      console.warn('[QuizStorage] Format draf tidak sesuai, membuat draf baru yang bersih.')
      const freshDraft = createInitialDraft(questions)
      return {
        draft: freshDraft,
        fromStorage: false,
        error: 'Data draf di penyimpanan lokal tidak valid dan telah direset secara aman.',
      }
    }

    // Periksa versi soal agar tidak merusak data lama jika versi berubah
    if (parsed.questionVersion && parsed.questionVersion !== QUIZ_QUESTION_VERSION) {
      console.warn(
        `[QuizStorage] Versi soal berubah dari ${parsed.questionVersion} ke ${QUIZ_QUESTION_VERSION}. Membuat draf baru.`,
      )
      const freshDraft = createInitialDraft(questions)
      return {
        draft: freshDraft,
        fromStorage: false,
        error: `Versi soal diperbarui ke v${QUIZ_QUESTION_VERSION}. Draf sesi kuis dimulai kembali dengan draf bersih.`,
      }
    }

    // Pastikan seluruh butir soal yang ada terisi dalam items draf
    const mergedItems: Record<number, QuizItemAnswer> = {}
    questions.forEach((q) => {
      const existing = parsed.items?.[q.id]
      if (
        existing &&
        typeof existing.questionId === 'number' &&
        (typeof existing.selectedOption === 'string' || existing.selectedOption === null) &&
        typeof existing.isSubmitted === 'boolean'
      ) {
        mergedItems[q.id] = {
          questionId: q.id,
          selectedOption: existing.selectedOption,
          isSubmitted: existing.isSubmitted,
          isCorrect: typeof existing.isCorrect === 'boolean' ? existing.isCorrect : null,
          submittedAt: existing.submittedAt,
        }
      } else {
        mergedItems[q.id] = {
          questionId: q.id,
          selectedOption: null,
          isSubmitted: false,
          isCorrect: null,
        }
      }
    })

    // Validasi indeks posisi soal aktif
    const rawIdx = typeof parsed.currentQuestionIndex === 'number' ? parsed.currentQuestionIndex : 0
    const safeIdx = Math.max(0, Math.min(rawIdx, questions.length - 1))

    const validDraft: QuizDraftSession = {
      attemptId: parsed.attemptId || generateAttemptId(),
      moduleId: parsed.moduleId || QUIZ_MODULE_ID,
      questionVersion: parsed.questionVersion || QUIZ_QUESTION_VERSION,
      currentQuestionIndex: safeIdx,
      items: mergedItems,
      startedAt: parsed.startedAt || new Date().toISOString(),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      isCompleted: Boolean(parsed.isCompleted),
    }

    return {
      draft: validDraft,
      fromStorage: true,
      error: null,
    }
  } catch (err) {
    console.error('[QuizStorage] Gagal mem-parse JSON draf kuis:', err)
    const freshDraft = createInitialDraft(questions)
    return {
      draft: freshDraft,
      fromStorage: false,
      error: 'Data draf lokal mengalami kerusakan (JSON corrupt). Sesi baru telah dimulai.',
    }
  }
}

/**
 * Menyimpan draf pengerjaan kuis ke penyimpanan lokal
 */
export function saveQuizDraft(draft: QuizDraftSession): { success: boolean; error: string | null } {
  const updatedDraft: QuizDraftSession = {
    ...draft,
    updatedAt: new Date().toISOString(),
  }

  try {
    const serialized = JSON.stringify(updatedDraft)
    return writeRawStorage(DRAFT_STORAGE_KEY, serialized)
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Gagal mengubah draf ke format penyimpanan.'
    return { success: false, error: errorMsg }
  }
}

/**
 * Mereset draf pengerjaan yang sedang aktif tanpa menghapus riwayat kuis terdahulu
 */
export function resetQuizDraft(questions: (QuizQuestion | Module1QuizQuestion)[]): {
  draft: QuizDraftSession
  success: boolean
  error: string | null
} {
  const removeRes = removeRawStorage(DRAFT_STORAGE_KEY)
  const freshDraft = createInitialDraft(questions)
  const saveRes = saveQuizDraft(freshDraft)

  return {
    draft: freshDraft,
    success: removeRes.success && saveRes.success,
    error: removeRes.error || saveRes.error,
  }
}

/**
 * Memuat seluruh riwayat hasil percobaan kuis yang telah selesai
 */
export function loadQuizHistory(): {
  history: QuizAttemptHistory[]
  error: string | null
} {
  const raw = readRawStorage(HISTORY_STORAGE_KEY)
  if (!raw) {
    return { history: [], error: null }
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      console.warn('[QuizStorage] Format riwayat kuis bukan array, mengembalikan list kosong.')
      return { history: [], error: 'Format riwayat lokal tidak valid.' }
    }

    // Saring dan petakan item yang memiliki format valid
    const validHistory: QuizAttemptHistory[] = parsed.filter(
      (item): item is QuizAttemptHistory =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.attemptId === 'string' &&
        typeof item.score === 'number' &&
        typeof item.correctCount === 'number' &&
        typeof item.totalQuestions === 'number',
    ).map((item) => ({
      ...item,
      wrongCount: typeof item.wrongCount === 'number' ? item.wrongCount : Math.max(0, item.totalQuestions - item.correctCount),
    }))

    return { history: validHistory, error: null }
  } catch (err) {
    console.error('[QuizStorage] Gagal mem-parse JSON riwayat kuis:', err)
    return {
      history: [],
      error: 'Data riwayat kuis di penyimpanan lokal rusak dan tidak dapat dibaca.',
    }
  }
}

/**
 * Menyimpan percobaan kuis yang telah selesai ke dalam riwayat
 * dan membersihkan draf aktif
 */
export function saveCompletedAttempt(attempt: QuizAttemptHistory): {
  success: boolean
  error: string | null
} {
  const { history } = loadQuizHistory()

  const completeData: QuizAttemptHistory = {
    ...attempt,
    wrongCount: attempt.wrongCount ?? (attempt.totalQuestions - attempt.correctCount),
  }

  // Hindari duplikasi jika attemptId yang sama sudah ada di riwayat
  const existingIdx = history.findIndex((h) => h.attemptId === completeData.attemptId)
  let updatedHistory: QuizAttemptHistory[]

  if (existingIdx >= 0) {
    updatedHistory = [...history]
    updatedHistory[existingIdx] = completeData
  } else {
    // Letakkan percobaan terbaru di urutan pertama
    updatedHistory = [completeData, ...history]
  }

  try {
    const serialized = JSON.stringify(updatedHistory)
    const writeRes = writeRawStorage(HISTORY_STORAGE_KEY, serialized)

    // Bersihkan draf aktif setelah sukses disimpan ke riwayat
    if (writeRes.success) {
      removeRawStorage(DRAFT_STORAGE_KEY)
    }

    return writeRes
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Gagal menyimpan hasil percobaan kuis ke riwayat.'
    return { success: false, error: errorMsg }
  }
}

/**
 * Menghapus seluruh catatan riwayat kuis pada perangkat pengguna
 */
export function clearQuizHistory(): { success: boolean; error: string | null } {
  return removeRawStorage(HISTORY_STORAGE_KEY)
}

/**
 * Membangun payload sinkronisasi backend sesuai ketentuan Bab 4 dan Lampiran B
 */
export function buildBackendSubmissionPayload(
  attempt: QuizAttemptHistory,
  userId?: string,
): QuizBackendSubmissionPayload {
  const answersList = Object.values(attempt.items).map((item) => ({
    questionId: item.questionId,
    selectedOption: item.selectedOption ?? '-',
    isCorrect: Boolean(item.isCorrect),
    submittedAt: item.submittedAt,
  }))

  return {
    userId: userId || 'anonymous_student',
    attemptId: attempt.attemptId,
    moduleId: attempt.moduleId,
    questionVersion: attempt.questionVersion,
    score: attempt.score,
    correctCount: attempt.correctCount,
    wrongCount: attempt.wrongCount ?? (attempt.totalQuestions - attempt.correctCount),
    totalQuestions: attempt.totalQuestions,
    answers: answersList,
    startedAt: attempt.startedAt,
    completedAt: attempt.completedAt,
  }
}

/**
 * Kontrak sinkronisasi backend (Bab 4 & Lampiran B)
 * Menyiapkan interface pengiriman data penilaian ke server backend tanpa mengklaim
 * palsu bahwa data sudah terkirim jika integrasi backend belum aktif.
 */
export async function syncQuizAttemptToBackend(
  payload: QuizBackendSubmissionPayload,
): Promise<QuizBackendSyncResult> {
  // Simulasi pemrosesan kontrak backend secara terstruktur
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: false,
    message: `Integrasi basis data server belum diaktifkan (Bab 4). Kontrak data percobaan ${payload.attemptId} telah siap dikirim saat endpoint API backend tersedia. Data Anda saat ini tersimpan aman di penyimpanan lokal (Local Storage) perangkat.`,
    timestamp: new Date().toISOString(),
  }
}
