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
import {
  getFirestore,
  type Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore'
import type { UserAccount, UserRole, ExperimentItem } from '../types/auth'
import type { StudentActivityResult } from '../types/teacher'
import {
  getFirebaseConfig,
  isFirebaseConfigured,
  isTeacherEmail,
} from './firebaseConfig'
import { setCurrentUser, getCurrentUser } from './authStorage'

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

/**
 * Inisialisasi Firebase App, Auth, dan Firestore secara aman
 */
export function initFirebase(): {
  isConfigured: boolean
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
} {
  const config = getFirebaseConfig()
  const configured = isFirebaseConfigured(config)

  if (!configured) {
    return { isConfigured: false, app: null, auth: null, db: null }
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(config)
    } else {
      app = getApp()
    }
    auth = getAuth(app)
    db = getFirestore(app)
    return { isConfigured: true, app, auth, db }
  } catch (err) {
    console.warn('Inisialisasi Firebase mengalami kendala:', err)
    return { isConfigured: false, app: null, auth: null, db: null }
  }
}

/**
 * Memaksa re-inisialisasi Firebase saat pengguna memperbarui config di runtime
 */
export function reinitFirebase(): boolean {
  app = null
  auth = null
  db = null
  const { isConfigured } = initFirebase()
  return isConfigured
}

/**
 * Mengonversi FirebaseUser + Profile Firestore menjadi UserAccount standar AsamBasa Lab
 */
export function mapFirebaseUserToUserAccount(
  fbUser: FirebaseUser,
  profile?: DocumentData | null
): UserAccount {
  const email = fbUser.email || ''
  const isTeacher = isTeacherEmail(email)
  const role: UserRole = isTeacher ? 'guru' : (profile?.role === 'guru' ? 'guru' : 'siswa')

  return {
    id: fbUser.uid,
    username: email ? email.split('@')[0] : fbUser.uid.substring(0, 8),
    fullName: profile?.fullName || fbUser.displayName || (email ? email.split('@')[0] : 'Pengguna AsamBasa'),
    role,
    identifierNumber:
      profile?.identifierNumber ||
      (isTeacher ? 'NIP-GURU-OFFICIAL' : `NIS-${fbUser.uid.substring(0, 8).toUpperCase()}`),
    schoolClass: isTeacher ? undefined : (profile?.schoolClass || 'XI MIPA 1'),
    subject: isTeacher ? (profile?.subject || 'Kimia SMA') : undefined,
    avatarColor: isTeacher ? '#8b5cf6' : (profile?.avatarColor || '#0ea5e9'),
  }
}

/**
 * Mendaftarkan akun baru ke Firebase Authentication dan menyimpan profil di Cloud Firestore.
 * ATURAN PERAN UTAMA:
 * - Email nadia.revalina.2403316.@students.um.ac.id OTOMATIS ditetapkan sebagai 'guru'.
 * - Seluruh akun baru lainnya OTOMATIS ditetapkan sebagai 'siswa'.
 */
export async function registerWithFirebase(params: {
  email: string
  password: string
  fullName: string
  schoolClass?: string
  identifierNumber?: string
}): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const { isConfigured } = initFirebase()
  if (!isConfigured || !auth || !db) {
    return {
      success: false,
      error: 'Firebase belum terkonfigurasi. Pastikan apiKey, projectId, dan kredensial lain sudah diisi.',
    }
  }

  const cleanEmail = params.email.trim()
  const isTeacher = isTeacherEmail(cleanEmail)
  const assignedRole: UserRole = isTeacher ? 'guru' : 'siswa'

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, params.password)
    const fbUser = userCredential.user

    // Siapkan data profil pengguna
    const userProfileData = {
      uid: fbUser.uid,
      email: cleanEmail,
      fullName: params.fullName.trim(),
      role: assignedRole,
      identifierNumber:
        params.identifierNumber?.trim() ||
        (isTeacher ? 'NIP-GURU-OFFICIAL' : `NIS-${Date.now().toString().slice(-6)}`),
      schoolClass: isTeacher ? '' : (params.schoolClass?.trim() || 'XI MIPA 1'),
      subject: isTeacher ? 'Kimia SMA' : '',
      avatarColor: isTeacher ? '#8b5cf6' : '#0ea5e9',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Simpan ke Firestore users collection
    await setDoc(doc(db, 'users', fbUser.uid), userProfileData)

    const userAccount = mapFirebaseUserToUserAccount(fbUser, userProfileData)
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
  if (!isConfigured || !auth || !db) {
    return {
      success: false,
      error: 'Firebase belum terkonfigurasi. Silakan isi konfigurasi API Key terlebih dahulu.',
    }
  }

  const cleanEmail = email.trim()

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password)
    const fbUser = userCredential.user

    // Ambil data profil dari Firestore
    let profileData: DocumentData | null = null
    try {
      const userDocRef = doc(db, 'users', fbUser.uid)
      const userDocSnap = await getDoc(userDocRef)
      if (userDocSnap.exists()) {
        profileData = userDocSnap.data()
      } else {
        // Jika dokumen belum ada (misal registrasi via console), buat otomatis
        const isTeacher = isTeacherEmail(cleanEmail)
        profileData = {
          uid: fbUser.uid,
          email: cleanEmail,
          fullName: fbUser.displayName || cleanEmail.split('@')[0],
          role: isTeacher ? 'guru' : 'siswa',
          identifierNumber: isTeacher ? 'NIP-GURU-OFFICIAL' : `NIS-${fbUser.uid.substring(0, 8)}`,
          schoolClass: isTeacher ? '' : 'XI MIPA 1',
          createdAt: serverTimestamp(),
        }
        await setDoc(userDocRef, profileData)
      }
    } catch (e) {
      console.warn('Gagal membaca profil dari Firestore, menggunakan fallback Auth:', e)
    }

    const userAccount = mapFirebaseUserToUserAccount(fbUser, profileData)
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

    // Sesuai standar keamanan & instruksi: email enumeration protection
    // Jangan ungkap apakah suatu email terdaftar atau tidak ke pengguna jika Firebase mengembalikan auth/user-not-found
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
 * Menyimpan hasil aktivitas siswa (kuis atau lab) ke Cloud Firestore secara idempoten
 * Menggunakan document ID stabil berbasis attemptId atau ID aktivitas unik (activity.id)
 * sehingga proses coba ulang (retry) tidak pernah menduplikasi dokumen di server.
 */
export async function saveActivityToFirestore(
  activity: StudentActivityResult | ExperimentItem
): Promise<{ success: boolean; firestoreId?: string; error?: string }> {
  const { isConfigured } = initFirebase()
  if (!isConfigured || !db) {
    return { success: false, error: 'Cloud Firestore tidak aktif atau belum terkonfigurasi.' }
  }

  // Cek konektivitas jaringan perangkat
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { success: false, error: 'Koneksi internet terputus (offline).' }
  }

  try {
    const docId = activity.id
    if (!docId) {
      return { success: false, error: 'ID aktivitas tidak valid atau kosong.' }
    }

    // Dokumen unik diidentifikasi oleh ID percobaan / attemptId
    const docRef = doc(db, 'student_activities', docId)

    // Bersihkan nilai undefined agar Firestore SDK tidak memicu error skema
    const cleanPayload = JSON.parse(JSON.stringify(activity))

    await setDoc(
      docRef,
      {
        ...cleanPayload,
        syncedAt: serverTimestamp(),
        isSampleData: false,
      },
      { merge: true }
    )

    return { success: true, firestoreId: docId }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('Gagal menyimpan aktivitas ke Firestore:', errorMsg)
    return { success: false, error: errorMsg }
  }
}

/**
 * Mengambil daftar aktivitas siswa dari Cloud Firestore untuk Panel Guru
 */
export async function fetchActivitiesFromFirestore(): Promise<StudentActivityResult[]> {
  const { isConfigured } = initFirebase()
  if (!isConfigured || !db) {
    return []
  }

  try {
    const colRef = collection(db, 'student_activities')
    const q = query(colRef, orderBy('completedAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const list: StudentActivityResult[] = []
    querySnapshot.forEach((d) => {
      const data = d.data() as StudentActivityResult
      list.push({
        ...data,
        id: d.id,
      })
    })

    return list
  } catch (err) {
    console.warn('Gagal memuat aktivitas dari Firestore (mungkin rules belum dikonfigurasi):', err)
    return []
  }
}

/**
 * Listener status autentikasi Firebase
 */
export function subscribeToAuthChanges(callback: (user: UserAccount | null) => void): () => void {
  const { isConfigured } = initFirebase()
  if (!isConfigured || !auth || !db) {
    callback(getCurrentUser())
    return () => { }
  }

  const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      try {
        const userDocRef = doc(db!, 'users', fbUser.uid)
        const snap = await getDoc(userDocRef)
        const account = mapFirebaseUserToUserAccount(fbUser, snap.exists() ? snap.data() : null)
        setCurrentUser(account)
        callback(account)
      } catch {
        const account = mapFirebaseUserToUserAccount(fbUser, null)
        setCurrentUser(account)
        callback(account)
      }
    } else {
      callback(null)
    }
  })

  return unsubscribe
}
