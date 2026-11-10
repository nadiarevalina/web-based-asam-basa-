# Dokumen Alur Pengguna (User Flow Document)
## AsamBasa Lab – Modern Academic Learning Platform & Inquiry Virtual Lab

---

### Informasi Dokumen
* **Nama Sistem:** AsamBasa Lab – Alur Pengalaman Pengguna Platform Pembelajaran Asam Basa
* **Mata Pelajaran:** Kimia SMA / MA Fase F (Kelas XI)
* **Pendekatan Pedagogis:** Inkuiri Terbimbing (*Guided Inquiry Learning*) & Siklus Belajar Formatik Dua Arah
* **Persona Pengguna:** 
  1. **Siswa (Student):** Mengakses materi, melakukan eksperimen virtual, mengerjakan kuis, menautkan hasil, mengantrekan ke server, dan membaca evaluasi guru.
  2. **Guru (Teacher):** Memantau metrik kelas, memeriksa kiriman percobaan siswa di server, membaca data kimia terperinci, dan memberikan umpan balik evaluasi.
* **Status Dokumen:** Versi Resmi Terintegrasi (Versi 2.0)

---

## 1. Peta Navigasi Global Platform (Sitemap & Hash Routing)

Aplikasi mengadopsi navigasi berbasis *URL Hash Routing* yang memastikan pengguna dapat langsung mengakses bagian manapun dan menggunakan tombol navigasi peramban (*Back/Forward*) secara alami.

```mermaid
flowchart TD
    ROOT["AsamBasa Lab Application"] --> B1["#/beranda (Beranda & Peta Modul)"]
    ROOT --> B2["#/teori (Materi Teori Asam Basa)"]
    ROOT --> B3["#/lab (Laboratorium Virtual Inkuiri)"]
    ROOT --> B4["#/skala (Visualisasi Skala pH 0–14)"]
    ROOT --> B5["#/kalkulator (Kalkulator pH Matematis)"]
    ROOT --> B6["#/kuis (Evaluasi Formatif 10 Soal HOTS)"]
    ROOT --> B7["#/refleksi (Jurnal Metakognisi & Cetak PDF)"]
    ROOT --> B8["#/login (Portal Akun, Antrean Server & Guru)"]
```

---

## 2. Alur Pengguna Siswa (Student User Flow)

### 2.1 Ringkasan Alur Perjalanan Siswa
Siswa memulai dari eksplorasi teori atau laboratorium virtual, mencatat hasil pengujian dengan **ID Percobaan yang unik**, mengaitkan hasil ke akun pribadi, mengantrekan pengiriman ke server pendidikan, dan membaca umpan balik kualitatif dari guru.

```mermaid
flowchart TD
    START([Siswa Membuka Platform]) --> LOGIN_CHECK{Sudah Masuk Akun?}
    
    LOGIN_CHECK -- Belum (Mode Tamu) --> EXPLORE[Eksplorasi Modul 1-6 & Praktikum]
    LOGIN_CHECK -- Sudah Masuk --> EXPLORE
    
    EXPLORE --> LAB_EXP[Praktikum Lab Virtual / Kuis]
    LAB_EXP --> SAVE_JOURNAL[Simpan ke Jurnal / Submit Kuis]
    SAVE_JOURNAL --> ID_GEN[Sistem Membuat ID Percobaan Unik<br/>Contoh: EXP-LAB-CH3COOH-8291]
    
    ID_GEN --> PORTAL[Buka Portal Akun '#/login']
    PORTAL --> AUTH_STEP{Autentikasi Siswa}
    AUTH_STEP -- Login / Daftar / Quick Demo --> LOGGED_IN[Masuk Sebagai Siswa e.g. Budi]
    
    LOGGED_IN --> TAB_LINK[Tab: Pilih & Tautkan Hasil]
    TAB_LINK --> SELECT_EXP[Pilih Checkbox Hasil Percobaan]
    SELECT_EXP --> BIND_ACC[Klik: Kaitkan Hasil ke Akun Saya<br/>ID Percobaan Tetap Dipertahankan!]
    
    BIND_ACC --> TAB_QUEUE[Tab: Antrean Kirim ke Server]
    TAB_QUEUE --> SEND_SRV[Klik: Kirim Antrean ke Server]
    SEND_SRV --> SRV_RESPONSE[Server Menerima Payload: HTTP 200 OK<br/>Terbit Tiket Bukti Terima SRV-ACK]
    
    SRV_RESPONSE --> WAIT_TEACHER[Menunggu Pemeriksaan Guru]
    WAIT_TEACHER --> TAB_RESULT[Tab: Hasil Saya & Umpan Balik Guru]
    TAB_RESULT --> READ_FEEDBACK[Siswa Membaca Nilai & Catatan Guru]
    READ_FEEDBACK --> FINISH([Refleksi Pembelajaran Tuntas])
```

---

### 2.2 Rincian Tahapan Alur Siswa

#### Alur S-1: Eksplorasi Inkuiri di Lab Virtual (`#/lab`)
1. Siswa mengakses modul Lab Virtual.
2. Memilih kategori larutan: *Bahan Sehari-hari* (misal Asam Cuka, Air Jeruk, Sabun) atau *Larutan Laboratorium* (misal HCl, NaOH).
3. Memilih indikator asam-basa (Kertas Lakmus Merah/Biru, Fenolftalein, Bromtimol Biru, Metil Oranye, atau Ekstrak Bahan Alam).
4. Menekan tombol interaksi: *"Celupkan Kertas Uji"* atau *"Teteskan Indikator"*.
5. Mengamati animasi cairan tabung reaksi SVG dan perubahan warna larutan.
6. Membaca hasil analisis saintifik: deskripsi warna, estimasi nilai pH, dan kategori sifat asam/basa.
7. Menekan tombol **"Simpan ke Jurnal"**:
   * Data masuk ke tabel jurnal pengamatan lokal.
   * Sistem otomatis mendaftarkan catatan eksperimen ke repositori dengan **ID Percobaan unik** (misal: `EXP-LAB-CH3COOH-8291`) berstatus awal `belum_dikaitkan`.

#### Alur S-2: Pengerjaan Kuis Formatif HOTS (`#/kuis`)
1. Siswa membuka menu Kuis dan Skor.
2. Menekan tombol *"Mulai Kuis Modul 1"*.
3. Timer countdown waktu pengerjaan otomatis berjalan.
4. Siswa menjawab 10 butir soal HOTS (analisis konsep Arrhenius, Brønsted–Lowry, Lewis, dan indikator).
5. Pada akhir kuis, siswa menekan *"Kirim Seluruh Jawaban"*.
6. Layar menampilkan skor akhir, jumlah benar/salah, serta pembahasan ilmiah komprehensif pada setiap nomor soal.
7. Sistem menerbitkan **ID Percobaan Kuis** (misal: `ATT-QUIZ-M1-4820`) dan menyimpannya ke repositori akun.

#### Alur S-3: Penautan Hasil ke Akun (`#/login` $\rightarrow$ Tab Tautkan)
1. Siswa membuka halaman Portal Akun (`#/login`).
2. Masuk menggunakan akun terdaftar atau memilih tombol akses cepat demo (**Budi Pratama** / **Nadia Revalina**).
3. Masuk ke tab **"🔗 Pilih & Tautkan Hasil ke Akun"**.
4. Siswa melihat daftar seluruh hasil pengujian yang belum memiliki pemilik.
5. Siswa memilih hasil yang ingin diklaim menggunakan kotak centang (*checkbox*) atau tombol *"Pilih Semua"*.
6. Siswa menekan tombol **"Kaitkan Hasil Terpilih ke Akun Saya"**:
   * **Ketentuan Kritis:** **ID Percobaan (`item.id`) tetap dipertahankan secara utuh**.
   * Identitas pemilik (`ownerName`, `ownerClass`, `ownerId`) diperbarui ke akun siswa yang sedang aktif.
   * Status berubah menjadi `terkait`.

#### Alur S-4: Pengantrean & Pengiriman ke Server (`#/login` $\rightarrow$ Tab Antrean)
1. Siswa membuka tab **"📤 Antrean Kirim ke Server"**.
2. Memeriksa daftar antrean yang memuat rincian: **ID Percobaan**, **Pemilik**, **Jenis Percobaan**, dan **Ringkasan Hasil**.
3. Siswa menekan tombol **"🚀 Kirim Antrean ke Server"**:
   * Tombol menampilkan animasi indikator proses (*spinner*): *"Mengirim ke Server..."*.
   * Terjadi simulasi transmisi data jaringan.
   * Server memvalidasi bahwa `ID Percobaan` dan `Pemilik` sah.
   * Server merespons dengan **`HTTP 200 OK`** dan stempel tiket konfirmasi (misal: `SRV-ACK-9021`).
   * Log transaksi real-time dicatat di konsol server.
   * Status eksperimen kini berubah menjadi `diterima_server` dan siap diperiksa oleh Guru.

#### Alur S-5: Membaca Hasil & Umpan Balik Guru (`#/login` $\rightarrow$ Tab Hasil Saya)
1. Siswa membuka tab **"📋 Hasil Saya & Umpan Balik Guru"**.
2. Siswa membaca seluruh kartu riwayat eksperimen dan kuis yang telah dikaitkan.
3. Memeriksa badge status:
   * Jika masih `diterima_server`: Menampilkan tanda *"✓ Diterima Server (Menunggu Evaluasi Guru)"*.
   * Jika sudah `dibaca_guru`: Menampilkan kotak evaluasi khusus berwarna hijau zamrud (*Emerald Card*).
4. Siswa membaca **Catatan Pembimbing Guru** (misal: *"Luar biasa Budi! Analisis sifat asam cuka dengan lakmus biru sudah tepat. Pertahankan pemahaman untuk modul berikutnya!"*) beserta predikat penilaian (*Sangat Baik / Baik*).

---

## 3. Alur Pengguna Guru (Teacher User Flow)

### 3.1 Ringkasan Alur Perjalanan Guru
Guru bertindak sebagai evaluator akademik dan pembimbing sains. Guru memantau antrean kiriman server dari seluruh siswa di kelas, membuka detail eksperimen, dan menyematkan umpan balik kualitatif serta predikat nilai.

```mermaid
flowchart TD
    G_START([Guru Membuka Portal Akun '#/login']) --> G_LOGIN[Masuk Sebagai Guru Kimia<br/>e.g. Ibu Sri Wahyuni, M.Pd]
    G_LOGIN --> G_DASHBOARD[Otomatis Beralih ke Tab:<br/>Dashboard Penilaian & Evaluasi Siswa]
    
    G_DASHBOARD --> G_METRICS[Tinjau 4 Kartu Metrik Kelas:<br/>Total Masuk, Perlu Diperiksa, Sudah Dinilai, Antrean]
    G_METRICS --> G_FILTER{Filter Kiriman Siswa}
    
    G_FILTER --> G_TABLE[Tabel Menampilkan Data Percobaan:<br/>ID Percobaan Tetap, Nama Siswa, Kelas, Hasil]
    G_TABLE --> G_ACTION[Klik: 'Periksa & Nilai']
    
    G_ACTION --> G_MODAL[Modal Evaluasi Guru Terbuka:<br/>Rincian Sampel, Indikator, pH, Perubahan Warna, Skor Kuis]
    G_MODAL --> G_INPUT[Pilih Predikat Nilai & Tulis Catatan Pembimbing]
    G_INPUT --> G_SAVE[Klik: 'Simpan & Tandai Telah Dibaca']
    
    G_SAVE --> G_UPDATE[Status Diperbarui ke 'dibaca_guru'<br/>Log Tercatat di Server Console]
    G_UPDATE --> G_NOTIFY[Hasil Langsung Terbaca di Akun Siswa]
    G_NOTIFY --> G_FINISH([Evaluasi Siswa Selesai])
```

---

### 3.2 Rincian Tahapan Alur Guru

#### Alur G-1: Autentikasi Tenaga Pendidik
1. Guru membuka halaman Portal Akun (`#/login`).
2. Masuk menggunakan akun Guru (misal username: `guru`, password: `123`) atau menekan tombol akses cepat demo **"👩‍🏫 Guru: Ibu Sri Wahyuni"**.
3. Sistem mendeteksi `role === 'guru'` dan secara otomatis mengarahkan tampilan aktif ke **"📊 Dashboard Penilaian & Evaluasi Siswa"**.

#### Alur G-2: Tinjauan Metrik & Penyaringan Data Siswa
1. Guru memantau ringkasan statistik kelas di bagian atas dashboard:
   * **Total Percobaan Siswa Masuk**: Menghitung seluruh data yang telah tersinkronisasi ke server.
   * **Perlu Diperiksa & Dinilai**: Menampilkan jumlah tugas berstatus `diterima_server` yang membutuhkan feedback.
   * **Telah Dibaca & Diberi Feedback**: Menampilkan jumlah tugas yang telah tuntas dievaluasi.
2. Guru menggunakan bilah filter interaktif:
   * Filter menurut Siswa (*Semua Siswa*, *Budi Pratama*, *Nadia Revalina*, dll.).
   * Filter menurut Status (*Perlu Diperiksa* vs *Sudah Dinilai*).
   * Kotak pencarian cepat berdasarkan kata kunci **ID Percobaan** atau nama sampel kimia.

#### Alur G-3: Pembacaan Hasil Ilmiah Siswa
1. Guru melihat baris tugas siswa pada tabel penilaian terpadu.
2. Setiap baris menyajikan informasi transparan:
   * **ID Percobaan (Tetap)** (misal: `EXP-LAB-HCL-1129`)
   * **Pemilik** (Nama siswa dan kelas)
   * **Jenis Uji** (Lab Virtual atau Kuis)
   * **Hasil Percobaan Ringkas** (pH, warna, skor kuis)
   * **Waktu Diterima Server**
3. Guru menekan tombol **"📖 Periksa & Nilai"**.

#### Alur G-4: Penilaian & Pemberian Catatan Pembimbing
1. Dialog modal evaluasi terbuka di layar guru.
2. Guru menelaah data saintifik lengkap:
   * Nama sampel larutan yang diuji dan indikator yang dipilih.
   * Warna hasil transformasi reaksi kimia dan nilai pH perhitungan.
   * Kesimpulan sifat larutan yang ditarik oleh siswa.
   * Rincian jawaban benar/salah jika jenis percobaan adalah kuis.
3. Guru memilih predikat penilaian pada menu dropdown:
   * 🌟 *Sangat Baik (A)*
   * 👍 *Baik (B)*
   * 🔄 *Perlu Perbaikan Konsep (C)*
4. Guru mengisi kolom teks **"Catatan Pembimbing / Umpan Balik Guru"**:
   * Memberikan apresiasi atau koreksi terhadap pemahaman konsep asam-basa siswa.
5. Guru menekan tombol **"✅ Simpan & Tandai Telah Dibaca"**:
   * Status eksperimen beralih menjadi `dibaca_guru`.
   * Stempel waktu pembacaan (`teacherReadAt`) dan identitas guru (`teacherName`) disimpan ke repositori.
   * Log transaksi server diterbitkan untuk mencatat bahwa tugas telah tuntas dibaca.
   * Siswa yang bersangkutan dapat langsung membaca umpan balik ini saat membuka portal akun mereka.

---

## 4. Matriks Skenario & Penanganan Kondisi Khusus (Edge Cases)

| Skenario Pengguna | Kondisi Sistem | Tindakan & Penanganan Antarmuka |
| :--- | :--- | :--- |
| **Siswa Melakukan Uji Coba Tanpa Login** | Mode Tamu (*Guest Session*) | Hasil percobaan tetap tersimpan di jurnal dan repositori lokal dengan status `belum_dikaitkan`. Tersedia notifikasi ramah untuk masuk ke akun jika ingin menyimpan permanen. |
| **Siswa Belum Memilih Checkbox saat Menautkan** | Aksi Pengaitan Kosong | Tombol aksi dinonaktifkan (*disabled*) dan muncul notifikasi panduan: *"Pilih minimal satu hasil percobaan yang ingin dikaitkan ke akun"*. |
| **Siswa Menautkan Hasil yang Sudah Ada** | Pengaitan Berhasil | Sistem memastikan `item.id` (ID Percobaan) **tidak berubah sedikitpun**, hanya data kepemilikan akun yang disematkan. |
| **Kirim Antrean saat Antrean Kosong** | Antrean Kosong | Tombol kirim dinonaktifkan dan layar menyajikan kartu *Empty State* dengan ilustrasi kotak pos kosong. |
| **Gangguan Penyimpanan Peramban (Private Browsing)** | LocalStorage dibatasi | Sistem secara otomatis mengaktifkan *In-Memory Fallback Map*, sehingga aplikasi tetap dapat digunakan tanpa memunculkan error fatal pada peramban. |
| **Guru Ingin Mengubah Catatan Feedback** | Tugas Sudah Dinilai | Tombol pada baris tabel berubah menjadi *"✏️ Edit Ulasan"*, memungkinkan guru memperbarui catatan pembimbing sewaktu-waktu. |

