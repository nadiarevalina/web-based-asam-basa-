export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

const STORAGE_KEY_FIREBASE_CONFIG = 'asambasa_firebase_custom_config'

/**
 * Daftar email resmi yang secara otomatis memperoleh hak akses sebagai Guru.
 * Akun baru lainnya otomatis ditetapkan sebagai Siswa.
 */
export const OFFICIAL_TEACHER_EMAILS: string[] = [
  'nadia.revalina.2403316.@students.um.ac.id',
  'nadia.revalina.2403316@students.um.ac.id',
]

/**
 * Memeriksa apakah suatu alamat email berhak mendapatkan peran Guru
 */
export function isTeacherEmail(email?: string | null): boolean {
  if (!email) return false
  const cleanEmail = email.trim().toLowerCase()
  
  // Periksa terhadap daftar email guru resmi
  const isOfficial = OFFICIAL_TEACHER_EMAILS.some(
    (official) => official.trim().toLowerCase() === cleanEmail
  )
  if (isOfficial) return true

  // Periksa terhadap variabel lingkungan VITE_TEACHER_EMAIL jika ada
  const env = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}) as Record<string, string | undefined>
  const envTeacher = (env.VITE_TEACHER_EMAIL || '').trim().toLowerCase()
  if (envTeacher && cleanEmail === envTeacher) {
    return true
  }

  return false
}

/**
 * Mengambil konfigurasi Firebase dari environment variables atau LocalStorage
 */
export function getFirebaseConfig(): FirebaseConfig {
  // Cek apakah ada konfigurasi tersimpan di LocalStorage (bila diinput lewat UI Portal)
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FirebaseConfig>
        if (parsed.apiKey && parsed.projectId) {
          return {
            apiKey: parsed.apiKey || '',
            authDomain: parsed.authDomain || '',
            projectId: parsed.projectId || '',
            storageBucket: parsed.storageBucket || '',
            messagingSenderId: parsed.messagingSenderId || '',
            appId: parsed.appId || '',
          }
        }
      }
    } catch {
      // Abaikan error parse
    }
  }

  // Gunakan variabel lingkungan (Vite env)
  const env = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}) as Record<string, string | undefined>
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || '',
  }
}

/**
 * Menyimpan konfigurasi Firebase ke LocalStorage secara langsung dari antarmuka pengguna
 */
export function saveFirebaseConfig(config: FirebaseConfig): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config))
  } catch (err) {
    console.error('Gagal menyimpan konfigurasi Firebase ke LocalStorage:', err)
  }
}

/**
 * Menghapus konfigurasi custom LocalStorage agar kembali menggunakan nilai environment (.env)
 */
export function clearCustomFirebaseConfig(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY_FIREBASE_CONFIG)
  } catch (err) {
    console.error('Gagal menghapus konfigurasi Firebase:', err)
  }
}

/**
 * Memeriksa apakah konfigurasi Firebase telah lengkap diisi
 */
export function isFirebaseConfigured(config: FirebaseConfig = getFirebaseConfig()): boolean {
  return Boolean(
    config.apiKey &&
    config.apiKey.trim() !== '' &&
    config.projectId &&
    config.projectId.trim() !== '' &&
    !config.apiKey.includes('YOUR_') &&
    !config.projectId.includes('YOUR_')
  )
}
