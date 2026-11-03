import type { QuizQuestion } from './chemistry'

export const QUIZ_QUESTION_VERSION = '2.0.0'
export const QUIZ_MODULE_ID = 'modul-1'

export type CognitiveLevel = 'C3' | 'C4' | 'C5'

/**
 * Struktur data butir soal Kuis Modul 1 dengan lima opsi (A-E)
 * dan taksonomi kognitif HOTS (C3, C4, C5)
 */
export interface Module1QuizQuestion {
  id: number
  questionNumber: number
  topic: string
  cognitiveLevel: CognitiveLevel
  cognitiveLabel: string
  indicator: string
  stimulus?: string
  question: string
  options: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[]
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation: string
  correctReason: string
  distractorExplanations: Record<string, string>
  isVerified: boolean
}

/**
 * Representasi status jawaban per butir soal kuis
 */
export interface QuizItemAnswer {
  questionId: number
  selectedOption: string | null
  isSubmitted: boolean
  isCorrect: boolean | null
  submittedAt?: string
}

/**
 * Data draf sesi kuis yang sedang aktif berlangsung
 */
export interface QuizDraftSession {
  attemptId: string
  moduleId: string
  questionVersion: string
  currentQuestionIndex: number
  items: Record<number, QuizItemAnswer>
  startedAt: string
  updatedAt: string
  isCompleted: boolean
}

/**
 * Catatan riwayat percobaan kuis yang telah selesai
 */
export interface QuizAttemptHistory {
  attemptId: string
  moduleId: string
  questionVersion: string
  totalQuestions: number
  correctCount: number
  wrongCount: number
  score: number // Skor skala 0–100: (correctCount / 10) * 100
  items: Record<number, QuizItemAnswer>
  startedAt: string
  completedAt: string
  syncedToBackend: boolean
  syncedAt?: string
  userId?: string
}

/**
 * Kontrak payload pengiriman ke database backend (sesuai Bab 4 & Lampiran B)
 */
export interface QuizBackendSubmissionPayload {
  userId?: string
  attemptId: string
  moduleId: string
  questionVersion: string
  score: number
  correctCount: number
  wrongCount: number
  totalQuestions: number
  answers: {
    questionId: number
    selectedOption: string
    isCorrect: boolean
    submittedAt?: string
  }[]
  startedAt: string
  completedAt: string
}

/**
 * Kontrak respon sinkronisasi backend
 */
export interface QuizBackendSyncResult {
  success: boolean
  message: string
  timestamp: string
}

/**
 * Status ketersediaan penyimpanan peramban
 */
export interface StorageStatus {
  isAvailable: boolean
  error: string | null
}

export type { QuizQuestion }
