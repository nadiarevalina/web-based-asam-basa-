# Dokumen Desain Teknis (Technical Design Document)
## AsamBasa Lab – Modern Academic Learning Platform & Inquiry Virtual Lab

---

### Informasi Dokumen
* **Nama Sistem:** AsamBasa Lab – Platform Pembelajaran Kimia Interaktif & Laboratorium Inkuiri Virtual
* **Mata Pelajaran:** Kimia SMA / MA (Fase F - Kelas XI)
* **Gaya Antarmuka:** *Modern Academic Learning Platform* (Sintesis Google Classroom, Moodle LMS, dan Dashboard EdTech Modern)
* **Tech Stack Utama:** React 19, TypeScript, Vite, CSS Design Tokens, Web Storage API (LocalStorage + Memory Fallback)
* **Target Pengguna:** Siswa Kelas XI, Guru Pengampu Mata Pelajaran Kimia, Laboran Sains
* **Status Dokumen:** Rilis Arsitektur Sistem Terpadu (Versi 2.0)

---

## 1. Pendahuluan & Filosofi Desain

### 1.1 Visi Platform
**AsamBasa Lab** dirancang sebagai media pembelajaran interaktif berbasis web yang memadukan keunggulan tiga platform pembelajaran digital terkemuka:
1. **Google Classroom:** Kesederhanaan alur kerja, kemudahan penyerahan tugas (*submission stream*), kartu materi terstruktur, dan komunikasi umpan balik dua arah antara siswa dan guru secara langsung.
2. **Moodle LMS:** Ketelitian hierarki akademik, pelacakan kompetensi berbasis inkuiri terbimbing, buku catatan jurnal praktikum (*inquiry log*), serta rubrik penilaian formatif yang transparan.
3. **Modern EdTech Dashboard (Coursera/Canvas):** Pengalaman visual imersif dengan tema *Deep Dark Science*, tipografi akademik berketerbacaan tinggi (*Plus Jakarta Sans* & *JetBrains Mono*), kartu metrik statistik, dan penanda status data *real-time*.

### 1.2 Prinsip Desain Edukatif
* **Cognitive Load Reduction:** Informasi disajikan secara berjenjang melalui 8 modul terpisah (*hash-routed views*), navigasi rekam jejak (*Breadcrumb*), dan navigasi halaman berurutan (*PageBottomNav*) agar siswa tidak kewalahan.
* **Preservation of Experiment Identity:** Setiap aktivitas eksperimen virtual dan pengerjaan kuis memiliki **ID Percobaan yang kekal (immutable)**, memastikan integritas data ilmiah saat ditautkan ke akun pengguna maupun dikirimkan ke server.
* **Transparent Feedback Loop:** Guru dapat membaca seluruh data kuantitatif dan kualitatif siswa, kemudian menyematkan catatan pembimbing saintifik yang langsung tampil di dashboard siswa.
* **Inclusive & Accessible (WCAG 2.1 AA):** Skema warna memiliki rasio kontras tinggi, navigasi keyboard penuh (`Ctrl+K` untuk pencarian global, tab fokus jelas), dan pembaca layar (*screen reader friendly*) dengan atribut ARIA semantik.

---

## 2. Arsitektur Sistem & Aliran Data

Sistem mengadopsi arsitektur *Client-Centric Progressive Learning Architecture* dengan lapisan abstraksi layanan (*service layer*) yang siap dialihkan ke backend API RESTful/GraphQL tanpa mengubah struktur antarmuka pengguna.

```mermaid
flowchart TD
    subgraph UI_Layer["Lapisan Antarmuka Pengguna (UI & Components)"]
        NAV["Navbar & Quick Search (Ctrl+K)"]
        STUDENT_VIEW["Portal Siswa: Tautkan Hasil, Antrean, & Riwayat"]
        TEACHER_VIEW["Portal Guru: Dashboard Penilaian & Validasi"]
        MODULES["Modul Pembelajaran: Teori, Lab Virtual, Skala pH, Kalkulator, Kuis, Refleksi"]
    end

    subgraph Service_Layer["Lapisan Logika Bisnis & Penyimpanan (Services)"]
        AUTH_SVC["authStorage.ts<br/>(User Management & Auth State)"]
        EXP_SVC["authStorage.ts<br/>(Experiment Repository & Binding)"]
        SYNC_SVC["authStorage.ts<br/>(Queue Dispatcher & Mock Server Sync)"]
        QUIZ_SVC["quizStorage.ts<br/>(Formative Evaluation Engine)"]
    end

    subgraph Storage_Layer["Lapisan Penyimpanan Klien & Server"]
        LOCAL_STORAGE[("Browser LocalStorage<br/>(Offline-First Persistence)")]
        SERVER_ACK[("Simulated Academic Server<br/>(HTTP 200 OK Response & Archival Log)")]
    end

    NAV --> AUTH_SVC
    MODULES --> EXP_SVC
    MODULES --> QUIZ_SVC
    STUDENT_VIEW --> EXP_SVC
    STUDENT_VIEW --> SYNC_SVC
    TEACHER_VIEW --> EXP_SVC
    TEACHER_VIEW --> SYNC_SVC

    AUTH_SVC <--> LOCAL_STORAGE
    EXP_SVC <--> LOCAL_STORAGE
    SYNC_SVC --> SERVER_ACK
    SERVER_ACK --> LOCAL_STORAGE
```

---

## 3. Siklus Hidup Percobaan & Protokol Server (Experiment Lifecycle)

Setiap pengujian laboratorium virtual atau pengerjaan evaluasi kuis melalui 5 tahapan status yang terdefinisi dengan ketat:

```mermaid
stateDiagram-v2
    [*] --> Belum_Dikaitkan: Percobaan Selesai (ID Dibuat)
    Belum_Dikaitkan --> Terkait: Siswa Memilih & Menautkan ke Akun
    Terkait --> Dalam_Antrean: Siswa Memasukkan ke Antrean Kirim
    Dalam_Antrean --> Diterima_Server: Payload Dikirim (Server ACK HTTP 200)
    Diterima_Server --> Dibaca_Guru: Guru Membaca & Memberi Catatan Evaluasi
    Dibaca_Guru --> [*]: Siklus Pembelajaran Tuntas
```

### 3.1 Spesifikasi Status Aliran Data

| Status | Kode Status | Keterangan Teknis | Hak Akses & Visibilitas |
| :--- | :--- | :--- | :--- |
| **Belum Dikaitkan** | `belum_dikaitkan` | Hasil percobaan dibuat saat mode tamu atau belum diklaim. Memiliki `id` unik, tetapi `ownerId = null`. | Muncul di tab "Pilih & Tautkan Hasil". |
| **Terkait Akun** | `terkait` | Telah dikaitkan ke siswa login. **ID percobaan asli dipertahankan**, `ownerName` dan `ownerClass` diisi. | Tampil di "Hasil Saya", siap dimasukkan ke antrean. |
| **Dalam Antrean** | `dalam_antrean` | Siap dikirim ke server pendidikan. Disertai stempel waktu `queuedAt`. | Tampil di tab antrean pengiriman siswa & guru. |
| **Diterima Server** | `diterima_server` | Server telah menerima payload kiriman secara utuh. Diterbitkan tiket bukti terima `serverAckId` dan respons HTTP 200. | Tampil di Dashboard Guru (status: *Perlu Diperiksa*). |
| **Dibaca Guru** | `dibaca_guru` | Guru telah membuka data ilmiah siswa, mengisi `teacherFeedback`, dan memberikan predikat evaluasi. | Dibaca oleh siswa di portal hasil pribadinya. |

---

## 4. Struktur Data & Kontrak Antarmuka (Data Schemas)

### 4.1 Entitas Akun Pengguna (`UserAccount`)
Mendukung pemisahan peran (*Role-Based Access Control / RBAC*) antara siswa dan tenaga pendidik.

```typescript
export type UserRole = 'siswa' | 'guru';

export interface UserAccount {
  id: string;                 // Identifier unik (e.g., 'usr_siswa_budi')
  username: string;           // Kredensial unik login
  password?: string;          // Kredensial keamanan
  fullName: string;           // Nama lengkap siswa/guru
  role: UserRole;             // 'siswa' | 'guru'
  identifierNumber: string;   // Nomor Induk Siswa (NIS) atau NIP Guru
  schoolClass?: string;       // Rombel/Kelas untuk Siswa (e.g., 'XI MIPA 1')
  subject?: string;           // Bidang keahlian untuk Guru (e.g., 'Kimia SMA')
  avatarColor: string;        // Aksen warna profil akademik
}
```

### 4.2 Entitas Percobaan & Hasil Belajar (`ExperimentItem`)
Struktur data tunggal yang menyatukan hasil eksperimen virtual lab dan kuis formatif dengan jaminan **ID Percobaan yang kekal**.

```typescript
export type ExperimentType = 'lab_simulasi' | 'kuis_evaluasi';

export interface ExperimentDetails {
  // Eksperimen Lab Virtual
  sampleName?: string;        // Nama larutan sampel (e.g., 'Asam Cuka Dapur')
  indicatorName?: string;     // Indikator yang dipakai (e.g., 'Lakmus Biru')
  ph?: number;                // Estimasi nilai pH larutan
  colorName?: string;         // Deskripsi perubahan warna teramati
  colorHex?: string;          // Kode heksadesimal warna pengamatan
  natureLabel?: string;       // Sifat larutan (Asam Kuat, Asam Lemah, Netral, dll.)
  
  // Evaluasi Kuis Formatif
  score?: number;             // Skor perolehan (skala 0 - 100)
  correctCount?: number;      // Jumlah jawaban benar
  wrongCount?: number;        // Jumlah jawaban salah
  totalQuestions?: number;    // Total butir soal HOTS
  durationSeconds?: number;   // Waktu pengerjaan dalam detik
  moduleTitle?: string;       // Judul modul kuis
}

export interface ExperimentItem {
  id: string;                 // ID Percobaan UNIK & KEKAL (e.g., 'EXP-LAB-CH3COOH-8291')
  experimentType: ExperimentType;
  title: string;
  summary: string;
  createdAt: string;          // Stempel waktu ISO-8601 pembuatan
  
  // Data Kepemilikan (Ditetapkan saat penautan hasil)
  ownerId: string | null;
  ownerName: string | null;
  ownerRole: UserRole | null;
  ownerClass?: string;
  
  // Status Aliran Data
  status: 'belum_dikaitkan' | 'terkait' | 'dalam_antrean' | 'diterima_server' | 'dibaca_guru';
  queuedAt?: string;
  serverReceivedAt?: string;
  serverAckId?: string;       // Tiket konfirmasi server (e.g., 'SRV-ACK-9021')
  
  // Evaluasi & Umpan Balik Guru (Google Classroom / Moodle Style)
  teacherReadAt?: string;
  teacherName?: string;
  teacherRating?: 'Sangat Baik' | 'Baik' | 'Perlu Perbaikan';
  teacherFeedback?: string;   // Catatan kualitatif dari guru
  
  details: ExperimentDetails;
}
```

### 4.3 Entitas Transaksi & Log Server (`ServerSyncLog`)
Menyediakan bukti forensik komunikasi jaringan antara klien dan server.

```typescript
export interface ServerSyncLog {
  id: string;
  timestamp: string;
  experimentId: string;       // ID Percobaan yang diverifikasi server
  ownerName: string;          // Nama pemilik terdaftar pada tiket
  status: 'SUCCESS' | 'QUEUED' | 'READ';
  httpCode: number;           // 200 OK
  message: string;            // Rincian pesan konfirmasi transaksi
}
```

---

## 5. Dekomposisi Komponen & Hierarki Halaman

Antarmuka disusun mengikuti pola modular berbasis komponen independen di dalam direktori `src/components/`.

```
src/
├── components/
│   ├── Navbar.tsx             # Header sticky, 8 navigasi utama, badge akun, trigger Ctrl+K
│   ├── Breadcrumb.tsx         # Penunjuk rekam jejak posisi modul belajar
│   ├── PageBottomNav.tsx      # Navigasi cepat maju/mundur antar-modul
│   ├── SearchModal.tsx        # Dialog pencarian materi global (Command Palette)
│   ├── HeroSection.tsx        # Sambutan gerbang inkuiri & CTA utama
│   ├── TopicCards.tsx         # Tiga kartu modul pengantar kimia
│   ├── TheorySection.tsx      # Modul 1: Teori Arrhenius, Brønsted–Lowry, & Lewis
│   ├── VirtualLab.tsx         # Modul 2: Lab Virtual, animasi tabung SVG, & jurnal inkuiri
│   ├── PhScaleSection.tsx     # Modul 3: Visualisasi spektrum derajat keasaman 0–14
│   ├── PhCalculator.tsx       # Modul 4: Kalkulator matematis pH asam & basa kuat
│   ├── QuizSection.tsx        # Modul 5: Evaluasi formatif 10 soal HOTS ber-timer
│   ├── ReflectionSection.tsx  # Modul 6: Jurnal metakognisi & generator cetak PDF
│   ├── LoginPortal.tsx        # Modul 7: Portal Akun, Tautan Hasil, Antrean Server & Guru
│   └── Footer.tsx             # Penutup halaman dengan direktori peta modul
├── services/
│   ├── authStorage.ts         # Layanan auth, binding hasil, antrean server, evaluasi guru
│   └── quizStorage.ts         # Layanan penyimpanan riwayat kuis & validasi local storage
└── types/
    ├── auth.ts                # Kontrak data autentikasi, antrean, dan percobaan
    ├── navigation.ts          # Metadata rute 8 modul pembelajaran
    ├── chemistry.ts           # Definisi sampel kimia & indikator asam-basa
    └── quiz.ts                # Definisi butir soal HOTS & opsi jawaban
```

---

## 6. Desain Pengalaman Pengguna (Modern Academic UX)

### 6.1 Antarmuka Portal Siswa (Student Experience)
1. **Pilih & Tautkan Hasil ke Akun:**
   * Siswa dapat melihat daftar seluruh hasil eksperimen yang belum di-klaim (*unlinked*).
   * Fitur multi-select checkbox dengan aksi massal *"Kaitkan ke Akun Saya"*.
   * Sistem menjamin **ID Percobaan tetap utuh** sehingga rekam jejak inkuiri tidak hilang.
2. **Antrean Pengiriman Server (Sync Queue):**
   * Kartu tabel menyajikan data lengkap: ID Percobaan, Pemilik, Ringkasan Hasil Kimia, dan Status.
   * Tombol aksi *"🚀 Kirim Antrean ke Server"* dilengkapi simulasi latensi jaringan, pembaruan status `HTTP 200 OK`, serta penerbitan stempel bukti terima.
3. **Hasil Saya & Umpan Balik Guru (Feedback Stream):**
   * Kartu pengamatan menyajikan hasil uji larutan secara visual (lingkaran warna reaksi kimia, nilai pH, dan kategori asam-basa).
   * Kotak apresiasi bertema hijau zamrud (*Emerald Glow*) menampilkan **Catatan Evaluasi Guru** dan predikat nilai segera setelah guru memeriksa hasil.

### 6.2 Dashboard Evaluasi Guru (Teacher Grading Hub)
1. **Statistik Kelas Terpadu:**
   * Kartu metrik: *Total Percobaan Siswa Masuk*, *Perlu Diperiksa & Dinilai*, *Telah Dibaca & Diberi Feedback*, dan *Antrean Menunggu*.
2. **Filter & Pencarian Lanjutan:**
   * Penyaringan berdasarkan nama siswa/pemilik spesifik.
   * Penyaringan status (*Perlu Review* vs *Sudah Dinilai*).
   * Kotak pencarian pencocokan instan berdasarkan ID Percobaan atau kata kunci judul larutan.
3. **Modal Form Evaluasi Interaktif:**
   * Guru membaca ringkasan data eksperimen saintifik siswa (sampel, indikator, warna, pH, akurasi jawaban kuis).
   * Pemilihan predikat: *Sangat Baik (A)*, *Baik (B)*, atau *Perlu Perbaikan (C)*.
   * Kolom catatan pembimbing dengan textarea yang fleksibel.
   * Tombol *"✅ Simpan & Tandai Telah Dibaca"* yang secara reaktif memperbarui status server dan akun siswa.

---

## 7. Sistem Desain & Token Visual (Academic Design Tokens)

Platform menerapkan palet warna bertema sains gelap (*Deep Dark Science Theme*) dengan tingkat keterbacaan tinggi:

```css
:root {
  /* Latar Belakang & Permukaan Akademik */
  --bg-body: #0b0f19;              /* Slate hitam pekat */
  --bg-surface: #111827;           /* Permukaan kartu elevasi rendah */
  --bg-surface-elevated: #1f2937;  /* Permukaan kartu interaktif */
  --bg-surface-hover: #374151;     /* Status hover komponen */
  
  /* Garis Batas & Separator */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.16);
  --border-strong: rgba(255, 255, 255, 0.28);
  
  /* Tipografi */
  --text-primary: #f9fafb;         /* Putih terang untuk judul */
  --text-secondary: #cbd5e1;       /* Abu-abu terang untuk paragraf utama */
  --text-muted: #94a3b8;           /* Keterangan sekunder & stempel waktu */
  
  /* Aksen Kimia & Indikator Status */
  --accent-cyan: #06b6d4;          /* Identitas platform & ID percobaan */
  --acid-red: #ef4444;             /* Larutan asam & tombol pembatalan */
  --base-blue: #3b82f6;            /* Larutan basa & modul eksperimen */
  --neutral-green: #10b981;        /* Reaksi netral & status sukses diterima */
  --accent-amber: #f59e0b;         /* Peringatan antrean belum terkirim */
  --role-teacher-purple: #8b5cf6;  /* Aksen khusus Guru & pembimbing */
}
```

---

## 8. Keamanan, Validasi, & Aksesibilitas

1. **Integritas ID Percobaan (Immutability Guarantee):**
   * Fungsi `linkExperimentsToAccount()` secara tegas melarang perubahan properti `item.id`.
   * Hanya atribut `ownerId`, `ownerName`, `ownerRole`, `ownerClass`, dan `status` yang diperbarui saat kepemilikan dialihkan.
2. **Penyimpanan Tahan Kegagalan (Resilient Storage Fallback):**
   * Seluruh pembacaan dan penulisan `localStorage` dibungkus dalam blok proteksi `try-catch`.
   * Apabila peramban berada dalam mode *Private Browsing* atau kuota penyimpanan penuh, sistem secara transparan beralih ke struktur penyimpanan berbasis memori (`Map<string, string>`).
3. **Kepatuhan Aksesibilitas:**
   * Seluruh elemen tombol non-teks memiliki atribut `aria-label`.
   * Komponen dialog modal menerapkan `role="dialog"` dan `aria-modal="true"`.
   * Notifikasi aksi menyediakan tombol tutup manual dan timer otomatis pembersihan memori.

---

## 9. Rencana Ekstensi Masa Depan (Future Roadmap)

1. **Integrasi Backend REST API Riil:**
   * Mengganti fungsi `sendQueueToServer()` di `src/services/authStorage.ts` dengan pemanggilan `fetch('/api/v1/experiments/sync')` tanpa mengubah antarmuka React.
2. **Ekspor Nilai Kelas (Gradebook Export):**
   * Fitur bagi Guru untuk mengunduh rekapitulasi penilaian seluruh siswa dalam format spreadsheet (.xlsx / .csv).
3. **Sistem Notifikasi Push Akademik:**
   * Memberikan lencana notifikasi di navbar siswa saat guru telah memberikan catatan pada percobaan tertentu.

