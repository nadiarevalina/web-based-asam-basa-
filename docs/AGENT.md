# Tugas Pengembangan Beranda Website AsamBasa Lab

Baca `PRD.md` dan `AGENTS.md` di workspace terlebih dahulu. Pahami tujuan pembelajaran, kebutuhan pengguna, struktur proyek, standar kode, dan seluruh aturan yang berlaku.

Bertindaklah sebagai **senior React developer dan desainer UI/UX edukasi sains** yang berpengalaman dalam merancang website pembelajaran Kimia SMA yang interaktif, menarik, mudah digunakan, dan berorientasi pada pemahaman konsep.

Buat halaman **Beranda AsamBasa Lab**, yaitu website pembelajaran Kimia materi Asam–Basa untuk siswa SMA/MA kelas XI.

Halaman Beranda harus memuat:

1. **Navbar**
   - Identitas media berupa logo atau nama `AsamBasa Lab`.
   - Menu navigasi Beranda, Materi, Laboratorium Virtual, Kuis, dan Kalkulator pH.
   - Tombol navigasi yang berfungsi sesuai struktur proyek.
   - Tampilan responsif untuk desktop maupun perangkat seluler.

2. **Hero Section**
   - Judul utama yang menarik, misalnya: “Jelajahi Dunia Asam dan Basa!”
   - Deskripsi singkat yang mengajak siswa mempelajari konsep asam–basa melalui fenomena kehidupan sehari-hari.
   - Tombol utama **“Mulai Belajar”** yang mengarahkan siswa ke bagian materi.
   - Visual pendukung bertema kimia, seperti ilustrasi skala pH, tabung reaksi, atau indikator warna.
   - Desain yang menyenangkan (*joyful*), nyaman dilihat (*mindful*), dan tidak membebani siswa dengan terlalu banyak elemen visual.

3. **Topic Cards**
   Buat tiga kartu materi utama:
   - **Modul 1 — Mengenal Asam dan Basa:** konsep dasar, teori asam–basa, sifat, serta contoh dalam kehidupan sehari-hari.
   - **Modul 2 — Indikator Asam dan Basa:** jenis indikator, perubahan warna, dan aktivitas laboratorium virtual.
   - **Modul 3 — pH dan Netralisasi:** konsep pH, perhitungan pH sederhana, serta reaksi netralisasi.

   Setiap kartu harus memiliki ikon atau ilustrasi yang relevan, judul, deskripsi singkat, dan tombol **“Pelajari Materi”** yang mengarahkan siswa ke modul terkait.

Pecah antarmuka menjadi tiga komponen React terpisah:

- `Navbar.jsx`
- `HeroSection.jsx`
- `TopicCards.jsx`

Integrasikan ketiga komponen tersebut ke halaman utama yang sesuai dengan struktur proyek yang sudah ada. Jika proyek menggunakan TypeScript atau struktur komponen berbeda, ikuti konvensi yang sudah digunakan di workspace dan sesuaikan nama file tanpa merusak konfigurasi yang ada.

### Ketentuan desain dan pengembangan

- Gunakan React dan teknologi yang sudah tersedia di proyek.
- Terapkan prinsip UI/UX untuk pembelajaran sains: hierarki visual yang jelas, keterbacaan tinggi, navigasi intuitif, dan konsistensi warna.
- Gunakan bahasa Indonesia yang komunikatif dan sesuai untuk siswa kelas XI.
- Pastikan semua tombol dan tautan memiliki fungsi yang jelas.
- Buat layout responsif dan aksesibel, termasuk kontras warna yang memadai serta label navigasi yang jelas.
- Gunakan kembali dependensi dan komponen yang sudah tersedia; hindari menambahkan dependensi tanpa kebutuhan.
- Jangan menghapus fitur yang sudah ada atau membuat ulang proyek dari nol jika tidak diperlukan.
- Ikuti seluruh aturan dalam `AGENTS.md`, termasuk standar penamaan, struktur file, dan batasan teknis.
- Jangan mengklaim fitur sudah berfungsi jika belum diuji.

### Kriteria penyelesaian

1. Ketiga komponen berhasil dibuat dan digunakan pada halaman Beranda.
2. Tampilan sesuai dengan identitas AsamBasa Lab dan tujuan pembelajaran Kimia kelas XI.
3. Tombol “Mulai Belajar” dan “Pelajari Materi” mengarah ke tujuan yang benar.
4. Halaman tampil baik pada desktop dan perangkat seluler.
5. Tidak ada kesalahan impor, komponen yang tidak ditemukan, atau kesalahan build.
6. Jalankan pemeriksaan dan build yang tersedia di proyek, perbaiki kesalahan yang ditemukan, lalu laporkan file yang dibuat atau diubah serta hasil pengujiannya.

Mulailah dengan membaca `PRD.md` dan `AGENTS.md`, kemudian periksa struktur proyek sebelum menulis kode. Setelah itu, implementasikan halaman Beranda secara langsung di workspace.