# PRD – Web Pembelajaran Kimia

## Identitas

**Nama media:** AsamBasa Lab – Website Pembelajaran Asam Basa Interaktif

**Mata pelajaran:** Kimia

**Target pengguna:** Siswa SMA/MA kelas XI

**Peran pengembang:** Desainer pembelajaran yang merancang media pembelajaran kimia berbasis website dengan dukungan coding AI.

**Materi utama:** Asam dan Basa, meliputi teori asam-basa, sifat larutan asam dan basa, indikator asam-basa, konsep pH, serta netralisasi.

**Pendekatan pembelajaran:** Inkuiri terbimbing (Guided Inquiry).

Pembelajaran dirancang agar siswa membangun pemahaman konsep melalui tahapan:

1. Orientasi: Siswa diperkenalkan pada fenomena asam-basa dalam kehidupan sehari-hari.
2. Merumuskan masalah: Siswa diarahkan untuk mengidentifikasi pertanyaan berdasarkan fenomena yang diamati.
3. Merumuskan hipotesis: Siswa membuat dugaan sementara mengenai sifat larutan, perubahan warna indikator, atau nilai pH.
4. Mengumpulkan data: Siswa mengeksplorasi materi dan melakukan simulasi praktikum virtual.
5. Menganalisis data: Siswa membandingkan hasil pengamatan simulasi dengan hipotesis awal.
6. Menarik kesimpulan: Siswa menyimpulkan konsep berdasarkan hasil eksplorasi dan penjelasan ilmiah.
7. Evaluasi: Siswa mengerjakan kuis dan melakukan refleksi pembelajaran.

Website menyediakan pertanyaan pemantik, petunjuk eksplorasi, informasi pendukung, dan umpan balik pada setiap tahapan. Siswa tetap melakukan pengamatan dan penalaran secara aktif, sedangkan website berperan sebagai pembimbing.

**Masalah belajar:**
1. Siswa sering mengalami kesulitan membedakan sifat asam dan basa serta memahami perubahan warna indikator.
2. Siswa cenderung menghafal konsep pH tanpa memahami hubungan antara konsentrasi ion dan tingkat keasaman larutan.
3. Kegiatan praktikum tidak selalu dapat dilakukan karena keterbatasan alat, bahan, waktu, dan fasilitas laboratorium.
4. Siswa membutuhkan media belajar yang interaktif, menarik, dan dapat digunakan secara mandiri untuk memahami materi serta mengevaluasi hasil belajarnya.

**Tujuan pembelajaran:** Membantu siswa memahami konsep asam-basa melalui materi digital, simulasi praktikum, kalkulator pH, latihan soal, dan umpan balik yang mendukung pembelajaran mandiri.
## Struktur navigasi website

Website menggunakan navigasi utama (Navbar) yang konsisten dan mudah digunakan.

Menu navigasi utama:

1. Beranda: Mengarahkan siswa ke halaman utama website.
2. Materi: Mengarahkan siswa ke bagian atau halaman yang memuat tiga modul pembelajaran.
3. Laboratorium Virtual: Mengarahkan siswa ke fitur simulasi indikator asam-basa.
4. Kuis: Mengarahkan siswa ke halaman evaluasi pembelajaran.
5. Kalkulator pH: Mengarahkan siswa ke fitur perhitungan pH.

Ketentuan implementasi Navbar:

- Navbar harus mengikuti struktur folder, routing, sintaks, framework, dan konvensi komponen yang sudah digunakan dalam proyek.
- Sebelum membuat atau mengubah Navbar, periksa file halaman utama, konfigurasi routing, komponen navigasi, serta file konfigurasi proyek.
- Jangan mengasumsikan penggunaan React Router, Next.js Router, atau mekanisme routing tertentu sebelum memeriksa proyek.
- Gunakan tautan atau fungsi navigasi yang sesuai dengan teknologi proyek.
- Menu Materi harus dapat mengarahkan siswa menuju bagian tiga modul pembelajaran.
- Jika halaman tujuan sudah tersedia, gunakan rute yang sudah ada.
- Jika halaman tujuan belum tersedia, jangan membuat tautan palsu atau halaman kosong. Gunakan tujuan navigasi yang tersedia atau tampilkan menu sebagai bagian yang belum tersedia tanpa mengklaim fiturnya sudah berfungsi.
- Navbar harus responsif, memiliki navigasi mobile, dan mendukung aksesibilitas keyboard.
- Identitas visual Navbar harus konsisten dengan desain AsamBasa Lab.

## Fitur inti
Setiap modul pembelajaran menerapkan pendekatan inkuiri terbimbing dengan alur yang konsisten:

- Fenomena: Menampilkan peristiwa asam-basa yang dekat dengan kehidupan sehari-hari.
- Pertanyaan pemantik: Mengarahkan siswa untuk mengidentifikasi masalah.
- Hipotesis: Memberikan kesempatan kepada siswa untuk membuat dugaan sementara.
- Eksplorasi: Menyediakan materi, petunjuk, dan simulasi yang relevan.
- Analisis: Mengarahkan siswa menginterpretasikan hasil pengamatan.
- Kesimpulan: Membantu siswa merumuskan konsep kimia berdasarkan hasil eksplorasi.
- Evaluasi: Mengukur pemahaman siswa melalui pertanyaan dan kuis.

Semua tahapan harus ditampilkan sebagai halaman terpisah. Tahapan dapat disajikan dalam satu halaman modul dengan navigasi langkah yang jelas.
**1. Tiga modul pembelajaran**

- **Modul 1 – Mengenal Asam dan Basa:** Pengertian dan teori asam-basa, sifat larutan, serta contoh penerapan asam dan basa dalam kehidupan sehari-hari.
- **Modul 2 – Indikator Asam-Basa dan Simulasi Laboratorium:** Siswa memilih sampel larutan dan indikator untuk mengamati perubahan warna simulasi, kemudian mengidentifikasi sifat larutan berdasarkan hasil pengamatan.
- **Modul 3 – Konsep pH dan Netralisasi:** Siswa mempelajari konsep pH, hubungan konsentrasi ion dengan keasaman atau kebasaan, serta reaksi netralisasi. Tersedia kalkulator pH untuk membantu perhitungan larutan asam kuat dan basa kuat sesuai batasan model yang digunakan.

**2. Kuis dengan umpan balik**

- Kuis pilihan ganda untuk mengukur pemahaman siswa terhadap materi asam-basa.
- Hasil kuis ditampilkan dalam bentuk skor.
- Setiap jawaban dilengkapi penjelasan agar siswa memahami alasan jawaban benar atau salah.
- Kuis digunakan sebagai evaluasi formatif setelah siswa mempelajari materi.

**3. Simulasi praktikum interaktif**

- Siswa memilih jenis larutan dan indikator yang tersedia.
- Website menampilkan hasil simulasi perubahan warna indikator.
- Siswa mengamati hasil dan menghubungkannya dengan sifat asam atau basa.
- Simulasi bersifat virtual dan tidak menggantikan praktikum laboratorium nyata.

**4. Kalkulator pH**

- Siswa memasukkan nilai konsentrasi larutan sesuai jenis perhitungan yang didukung.
- Website menghitung dan menampilkan hasil pH.
- Hasil dilengkapi penjelasan singkat mengenai proses perhitungan.
- Perhitungan dibatasi pada model asam kuat monoprotik dan basa kuat yang menghasilkan satu ion OH⁻ per satuan rumus; model ini tidak digunakan untuk menghitung seluruh jenis asam dan basa.

**5. Refleksi pembelajaran**

- Siswa menuliskan pemahaman yang diperoleh, kesulitan yang dialami, dan konsep yang perlu dipelajari kembali.
- Hasil refleksi dapat dicetak atau disimpan sebagai PDF melalui fitur cetak pada perangkat.

## Jika waktu cukup

**1. Pencarian materi**

Siswa dapat mencari istilah atau topik tertentu, seperti indikator asam-basa, pH, atau netralisasi, untuk menemukan materi yang dibutuhkan dengan lebih cepat.

**2. Penyimpanan progres anonim**

Website dapat menyimpan progres belajar tanpa meminta nama lengkap siswa, misalnya modul yang telah dipelajari dan hasil kuis. Fitur ini memerlukan mekanisme penyimpanan tambahan dan pemberitahuan privasi yang jelas.

**3. Visualisasi skala pH**

Menampilkan skala pH 0–14 dengan penanda sifat asam, netral, dan basa untuk membantu siswa memahami perbedaan tingkat keasaman larutan.

**4. Desain responsif**

Tampilan website disesuaikan untuk komputer, tablet, dan telepon genggam agar dapat digunakan secara nyaman di berbagai perangkat.

## Prinsip desain pembelajaran dan antarmuka

1. Website menggunakan pendekatan visual yang menyenangkan, modern, bersih, dan sesuai untuk siswa SMA/MA kelas XI.
2. Setiap modul harus memiliki alur pembelajaran yang jelas berdasarkan tahapan inkuiri terbimbing.
3. Gunakan warna yang konsisten dengan identitas AsamBasa Lab.
4. Gunakan visualisasi kimia seperti skala pH, indikator warna, tabung reaksi, dan ilustrasi larutan untuk membantu pemahaman konsep.
5. Hindari penggunaan dekorasi berlebihan yang dapat mengganggu konsentrasi siswa.
6. Gunakan bahasa Indonesia yang komunikatif, sederhana, dan tetap ilmiah.
7. Berikan umpan balik yang informatif, bukan hanya menunjukkan jawaban benar atau salah.
8. Pastikan navigasi mudah dipahami dan konsisten pada seluruh halaman.
9. Bedakan secara visual aktivitas pengamatan, pertanyaan pemantik, hipotesis, hasil simulasi, analisis, dan kesimpulan.
10. Pastikan setiap simulasi memberikan hasil yang sesuai dengan konsep kimia dan batasan model yang digunakan.

## Kriteria keberhasilan

1. Siswa dapat mengakses dan menggunakan website tanpa kesulitan navigasi yang berarti.
2. Siswa dapat membedakan sifat asam dan basa berdasarkan hasil simulasi indikator.
3. Siswa dapat menggunakan kalkulator pH pada jenis larutan yang didukung.
4. Siswa memperoleh umpan balik yang membantu memperbaiki pemahamannya melalui kuis.
5. Materi, simulasi, dan perhitungan telah diperiksa agar sesuai dengan konsep kimia yang benar.

## Batasan produk

Website ini merupakan media pembelajaran pendamping untuk siswa SMA/MA kelas XI. Fitur simulasi menggunakan data dan aturan yang ditentukan dalam program, bukan pengukuran eksperimen nyata. Fitur pencarian materi dan penyimpanan progres anonim termasuk pengembangan lanjutan apabila belum tersedia dalam versi awal.

