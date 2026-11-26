import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  type Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  sendPasswordResetEmail,
} from 'firebase/auth'
import type { UserAccount, UserRole } from '../types/auth'
import {
  getFirebaseConfig,
  isFirebaseConfigured,
  isTeacherEmail,
} from './firebaseConfig'
import { setCurrentUser, getCurrentUser, getAllUsers, saveUser } from './authStorage'

let app: FirebaseApp | null = null
let auth: Auth | null = null

/**
 * Inisialisasi Firebase App dan Firebase Authentication
 * (Tanpa ketergantungan Cloud Firestore / Backend Database)
 */
export function initFirebase(): {
  isConfigured: boolean
  app: FirebaseApp | null
  auth: Auth | null
} {
  const config = getFirebaseConfig()
  const configured = isFirebaseConfigured(config)

  if (!configured) {
    return { isConfigured: false, app: null, auth: null }
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(config)
    } else {
      app = getApp()
    }
    auth = getAuth(app)
    return { isConfigured: true, app, auth }
  } catch (err) {
    console.warn('Inisialisasi Firebase Authentication mengalami kendala:', err)
    return { isConfigured: false, app: null, auth: null }
  }
}

/**
 * Memaksa re-inisialisasi Firebase saat pengguna memperbarui config di runtime
 */
export function reinitFirebase(): boolean {
  app = null
  auth = null
  const { isConfigured } = initFirebase()
  return isConfigured
}

/**
 * Mengonversi FirebaseUser menjadi UserAccount standar AsamBasa Lab
 */
export function mapFirebaseUserToUserAccount(
  fbUser: FirebaseUser,
  existingProfile?: Partial<UserAccount> | null
): UserAccount {
  const email = fbUser.email || ''
  const isTeacher = isTeacherEmail(email)
  const role: UserRole = isTeacher ? 'guru' : (existingProfile?.role === 'guru' ? 'guru' : 'siswa')

  return {
    id: fbUser.uid,
    username: email ? email.split('@')[0] : fbUser.uid.substring(0, 8),
    fullName: existingProfile?.fullName || fbUser.displayName || (email ? email.split('@')[0] : 'Pengguna AsamBasa'),
    role,
    identifierNumber:
      existingProfile?.identifierNumber ||
      (isTeacher ? 'NIP-GURU-OFFICIAL' : `NIS-${fbUser.uid.substring(0, 8).toUpperCase()}`),
    schoolClass: isTeacher ? undefined : (existingProfile?.schoolClass || 'XI MIPA 1'),
    subject: isTeacher ? (existingProfile?.subject || 'Kimia SMA') : undefined,
    avatarColor: isTeacher ? '#8b5cf6' : (existingProfile?.avatarColor || '#0ea5e9'),
  }
}

/**
 * Mendaftarkan akun baru ke Firebase Authentication dan menyimpan profil secara lokal di LocalStorage.
 * ATURAN PERAN:
 * - Email resmi guru otomatis ditetapkan sebagai 'guru'.
 * - Seluruh akun baru lainnya otomatis ditetapkan sebagai 'siswa'.
 */
export async function registerWithFirebase(params: {
  email: string
  password: string
  fullName: string
  schoolClass?: string
  identifierNumber?: string
}): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const { isConfigured } = initFirebase()
  if (!isConfigured || !auth) {
    return {
      success: false,
      error: 'Firebase Authentication belum terkonfigurasi. Pastikan API Key diatur.',
    }
  }

  const cleanEmail = params.email.trim()
  const isTeacher = isTeacherEmail(cleanEmail)
  const assignedRole: UserRole = isTeacher ? 'guru' : 'siswa'

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, params.password)
    const fbUser = userCredential.user

    const userAccount: UserAccount = {
      id: fbUser.uid,
      username: cleanEmail.split('@')[0],
      fullName: params.fullName.trim(),
      role: assignedRole,
      identifierNumber:
        params.identifierNumber?.trim() ||
        (isTeacher ? 'NIP-GURU-OFFICIAL' : `NIS-${Date.now().toString().slice(-6)}`),
      schoolClass: isTeacher ? undefined : (params.schoolClass?.trim() || 'XI MIPA 1'),
      subject: isTeacher ? 'Kimia SMA' : undefined,
      avatarColor: isTeacher ? '#8b5cf6' : '#0ea5e9',
    }

    // Simpan ke local storage
    const allUsers = getAllUsers()
    if (!allUsers.some((u) => u.id === userAccount.id || u.username.toLowerCase() === userAccount.username.toLowerCase())) {
      saveUser(userAccount)
    }
    setCurrentUser(userAccount)

    return {
      success: true,
      user: userAccount,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    let userFriendlyMsg = errorMsg
    if (errorMsg.includes('auth/email-already-in-use')) {
      userFriendlyMsg = 'Email ini sudah terdaftar. Silakan gunakan menu Masuk.'
    } else if (errorMsg.includes('auth/weak-password')) {
      userFriendlyMsg = 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.'
    } else if (errorMsg.includes('auth/invalid-email')) {
      userFriendlyMsg = 'Format alamat email tidak valid.'
    }
    return { success: false, error: userFriendlyMsg }
  }
}

/**
 * Masuk menggunakan akun Firebase Authentication
 */
export async function loginWithFirebase(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const { isConfigured } = initFirebase()
  if (!isConfigured || !auth) {
    return {
      success: false,
      error: 'Firebase Authentication belum terkonfigurasi. Silakan periksa konfigurasi API Key.',
    }
  }

  const cleanEmail = email.trim()

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password)
    const fbUser = userCredential.user

    // Cari profil lokal yang cocok
    const allUsers = getAllUsers()
    const existingUser = allUsers.find(
      (u) => u.id === fbUser.uid || u.username.toLowerCase() === cleanEmail.toLowerCase()
    )

    const isTeacher = isTeacherEmail(cleanEmail)
    const userAccount: UserAccount = existingUser || {
      id: fbUser.uid,
      username: cleanEmail.split('@')[0],
      fullName: fbUser.displayName || cleanEmail.split('@')[0],
      role: isTeacher ? 'guru' : 'siswa',
      identifierNumber: isTeacher ? 'NIP-GURU-OFFICIAL' : `NIS-${fbUser.uid.substring(0, 8).toUpperCase()}`,
      schoolClass: isTeacher ? undefined : 'XI MIPA 1',
      subject: isTeacher ? 'Kimia SMA' : undefined,
      avatarColor: isTeacher ? '#8b5cf6' : '#0ea5e9',
    }

    setCurrentUser(userAccount)
    return { success: true, user: userAccount }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    let userFriendlyMsg = errorMsg
    if (errorMsg.includes('auth/user-not-found') || errorMsg.includes('auth/invalid-credential')) {
      userFriendlyMsg = 'Email atau kata sandi tidak cocok. Silakan periksa kembali.'
    } else if (errorMsg.includes('auth/wrong-password')) {
      userFriendlyMsg = 'Kata sandi tidak sesuai.'
    } else if (errorMsg.includes('auth/invalid-email')) {
      userFriendlyMsg = 'Format alamat email tidak valid.'
    }
    return { success: false, error: userFriendlyMsg }
  }
}

/**
 * Keluar dari Firebase Authentication
 */
export async function logoutFromFirebase(): Promise<void> {
  const { isConfigured } = initFirebase()
  if (isConfigured && auth) {
    try {
      await fbSignOut(auth)
    } catch (err) {
      console.warn('Gagal sign out dari Firebase:', err)
    }
  }
  setCurrentUser(null)
}

/**
 * Mengirimkan tautan reset kata sandi (Password Reset) ke email pengguna via Firebase Authentication
 */
export async function sendPasswordResetWithFirebase(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const { isConfigured } = initFirebase()
  if (!isConfigured || !auth) {
    return {
      success: false,
      error: 'Layanan Firebase belum terkonfigurasi. Pastikan API Key dan Project ID sudah diatur.',
    }
  }

  const cleanEmail = email.trim()
  if (!cleanEmail) {
    return {
      success: false,
      error: 'Alamat email wajib diisi.',
    }
  }

  // Validasi format email dasar
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(cleanEmail)) {
    return {
      success: false,
      error: 'Format alamat email tidak valid.',
    }
  }

  try {
    await sendPasswordResetEmail(auth, cleanEmail)
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.warn('sendPasswordResetEmail warning:', err)

    // Sesuai standar keamanan: email enumeration protection
    if (errorMsg.includes('auth/user-not-found')) {
      return { success: true }
    } else if (errorMsg.includes('auth/invalid-email')) {
      return {
        success: false,
        error: 'Format alamat email tidak valid.',
      }
    } else if (errorMsg.includes('auth/too-many-requests')) {
      return {
        success: false,
        error: 'Terlalu banyak permintaan reset kata sandi. Silakan tunggu beberapa saat.',
      }
    } else if (errorMsg.includes('auth/network-request-failed')) {
      return {
        success: false,
        error: 'Koneksi jaringan gagal. Periksa koneksi internet Anda dan coba lagi.',
      }
    }

    return {
      success: false,
      error: 'Terjadi kendala saat mengirim email reset password. Silakan coba lagi nanti.',
    }
  }
}

// Alias agar kompatibel
export const resetPasswordWithFirebase = sendPasswordResetWithFirebase

/**
 * Listener status autentikasi Firebase
 */
export function subscribeToAuthChanges(callback: (user: UserAccount | null) => void): () => void {
  const { isConfigured } = initFirebase()
  if (!isConfigured || !auth) {
    callback(getCurrentUser())
    return () => { }
  }

  const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      const cleanEmail = fbUser.email || ''
      const allUsers = getAllUsers()
      const existing = allUsers.find(
        (u) => u.id === fbUser.uid || (cleanEmail && u.username.toLowerCase() === cleanEmail.toLowerCase())
      )
      const isTeacher = isTeacherEmail(cleanEmail)
      const account: UserAccount = existing || {
        id: fbUser.uid,
        username: cleanEmail ? cleanEmail.split('@')[0] : fbUser.uid.substring(0, 8),
        fullName: fbUser.displayName || (cleanEmail ? cleanEmail.split('@')[0] : 'Pengguna AsamBasa'),
        role: isTeacher ? 'guru' : 'siswa',
        identifierNumber: isTeacher ? 'NIP-GURU-OFFICIAL' : `NIS-${fbUser.uid.substring(0, 8).toUpperCase()}`,
        schoolClass: isTeacher ? undefined : 'XI MIPA 1',
        subject: isTeacher ? 'Kimia SMA' : undefined,
        avatarColor: isTeacher ? '#8b5cf6' : '#0ea5e9',
      }
      setCurrentUser(account)
      callback(account)
    } else {
      callback(null)
    }
  })

  return unsubscribe
}
