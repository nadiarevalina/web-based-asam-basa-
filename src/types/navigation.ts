export type PageId =
  | 'beranda'
  | 'teori'
  | 'lab'
  | 'skala'
  | 'kalkulator'
  | 'kuis'
  | 'refleksi'
  | 'login'

export interface NavItem {
  id: PageId
  label: string
  shortDescription?: string
}

export interface PageMeta {
  id: PageId
  number: number
  label: string
  subtitle: string
  shortDescription: string
  badge: string
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'beranda', label: 'Beranda', shortDescription: 'Halaman Pembuka & Pengenalan' },
  { id: 'teori', label: 'Materi Teori', shortDescription: 'Teori Asam Basa & Sifat Larutan' },
  { id: 'lab', label: 'Lab Virtual', shortDescription: 'Simulasi Pengujian Indikator' },
  { id: 'skala', label: 'Skala pH', shortDescription: 'Visualisasi Rentang pH 0–14' },
  { id: 'kalkulator', label: 'Kalkulator pH', shortDescription: 'Hitung pH Asam & Basa Kuat' },
  { id: 'kuis', label: 'Kuis dan Skor', shortDescription: 'Evaluasi Formatif 10 Soal HOTS' },
  { id: 'refleksi', label: 'Refleksi', shortDescription: 'Jurnal Metakognisi & Cetak PDF' },
  { id: 'login', label: 'Portal Akun & Server', shortDescription: 'Login Siswa/Guru & Antrean Server' },
]

export const PAGE_METADATA: Record<PageId, PageMeta> = {
  beranda: {
    id: 'beranda',
    number: 1,
    label: 'Beranda',
    subtitle: 'Gerbang Pembelajaran Kimia Asam dan Basa Kelas XI',
    shortDescription: 'Pengenalan platform pembelajaran, tujuan inkuiri, dan peta modul.',
    badge: 'Awal Pembelajaran',
  },
  teori: {
    id: 'teori',
    number: 2,
    label: 'Materi Teori',
    subtitle: 'Konsep Arrhenius, Brønsted–Lowry, Lewis & Sifat Larutan',
    shortDescription: 'Evolusi definisi asam basa, sifat fisis-kimia, dan aplikasinya di kehidupan.',
    badge: 'Modul 1: Teori',
  },
  lab: {
    id: 'lab',
    number: 3,
    label: 'Lab Virtual',
    subtitle: 'Simulasi Pengujian Indikator Asam Basa Terbimbing',
    shortDescription: 'Uji sampel larutan dengan lakmus, PP, BTB, MO, kol ungu, dan kunyit.',
    badge: 'Modul 2: Eksperimen',
  },
  skala: {
    id: 'skala',
    number: 4,
    label: 'Skala pH',
    subtitle: 'Visualisasi Derajat Keasaman 0–14 & Kesetimbangan Air',
    shortDescription: 'Memahami hubungan [H⁺], [OH⁻], dan tetapan autoionisasi air Kw = 10⁻¹⁴.',
    badge: 'Visualisasi Sains',
  },
  kalkulator: {
    id: 'kalkulator',
    number: 5,
    label: 'Kalkulator pH',
    subtitle: 'Perhitungan pH & pOH Asam Kuat Monoprotik serta Basa Kuat',
    shortDescription: 'Hitung derajat keasaman matematis dengan langkah perhitungan transparan.',
    badge: 'Modul 3: Kuantitatif',
  },
  kuis: {
    id: 'kuis',
    number: 6,
    label: 'Kuis dan Skor',
    subtitle: 'Evaluasi Formatif 10 Soal HOTS (C3–C5, Opsi A–E)',
    shortDescription: 'Uji pemahaman komprehensif dengan pembahasan ilmiah dan skor riwayat.',
    badge: 'Evaluasi Formatif',
  },
  refleksi: {
    id: 'refleksi',
    number: 7,
    label: 'Refleksi',
    subtitle: 'Jurnal Metakognisi Pembelajaran Mandiri & Lembar Kerja',
    shortDescription: 'Tuliskan capaian pemahaman, kendala, rencana aksi, dan cetak lembar PDF.',
    badge: 'Metakognisi & Tindak Lanjut',
  },
  login: {
    id: 'login',
    number: 8,
    label: 'Portal Akun & Server',
    subtitle: 'Autentikasi Siswa & Guru, Tautkan Hasil, dan Antrean Server',
    shortDescription: 'Kelola akun, pilih & kaitkan hasil percobaan, kirim ke server, dan tinjau evaluasi guru.',
    badge: 'Akun & Antrean Server',
  },
}

export function getAdjacentPages(currentPage: PageId): {
  prev: PageMeta | null
  next: PageMeta | null
} {
  const pageOrder: PageId[] = [
    'beranda',
    'teori',
    'lab',
    'skala',
    'kalkulator',
    'kuis',
    'refleksi',
    'login',
  ]
  const currentIndex = pageOrder.indexOf(currentPage)
  if (currentIndex === -1) return { prev: null, next: null }

  const prevId = currentIndex > 0 ? pageOrder[currentIndex - 1] : null
  const nextId = currentIndex < pageOrder.length - 1 ? pageOrder[currentIndex + 1] : pageOrder[0]

  return {
    prev: prevId ? PAGE_METADATA[prevId] : null,
    next: nextId ? PAGE_METADATA[nextId] : null,
  }
}

/**
 * Normalisasi id bagian lama (misal 'teori-section') ke PageId baru
 */
export function normalizePageId(rawId: string): PageId {
  const cleaned = rawId.replace(/-section$/, '').replace(/^#\/?/, '').toLowerCase()
  switch (cleaned) {
    case 'hero':
    case 'beranda':
      return 'beranda'
    case 'teori':
      return 'teori'
    case 'lab':
      return 'lab'
    case 'skala':
      return 'skala'
    case 'kalkulator':
      return 'kalkulator'
    case 'kuis':
      return 'kuis'
    case 'refleksi':
      return 'refleksi'
    case 'login':
    case 'akun':
    case 'auth':
    case 'portal':
    case 'server':
      return 'login'
    default:
      return 'beranda'
  }
}
