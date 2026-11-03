import type { Module1QuizQuestion } from '../types/quiz'

/**
 * Bank Data 10 Butir Soal Kuis Modul 1 (Mengenal Asam dan Basa)
 * Sesuai Taksonomi Bloom Revisi:
 * - C3 (Mengaplikasikan) : 3 Soal (Nomor 1, 2, 3)
 * - C4 (Menganalisis)    : 4 Soal (Nomor 4, 5, 6, 7)
 * - C5 (Mengevaluasi)    : 3 Soal (Nomor 8, 9, 10)
 *
 * Masing-masing butir soal memiliki lima pilihan jawaban (A–E),
 * stimulus kontekstual/ilmiah, pembahasan mendalam, alasan jawaban benar,
 * dan penjelasan mengapa opsi lainnya tidak tepat.
 */
export const MODULE_1_HOTS_QUESTIONS: Module1QuizQuestion[] = [
  {
    id: 1,
    questionNumber: 1,
    topic: 'Teori Brønsted–Lowry & Pasangan Konjugasi',
    cognitiveLevel: 'C3',
    cognitiveLabel: 'C3 — Mengaplikasikan',
    indicator:
      'Mengaplikasikan konsep donor-akseptor proton Brønsted–Lowry untuk menentukan pasangan asam-basa konjugasi pada reaksi transfer proton dalam medium non-akuos.',
    stimulus:
      'Pelarutan gas hidrogen fluorida ke dalam pelarut asam sulfat murni berlangsung menurut persamaan reaksi kesetimbangan berikut:\nHF(l) + H₂SO₄(l) ⇌ H₂F⁺(solv) + HSO₄⁻(solv)',
    question:
      'Berdasarkan reaksi kesetimbangan tersebut, spesi yang bertindak sebagai basa Brønsted–Lowry beserta pasangan asam konjugasinya secara berturut-turut adalah...',
    options: [
      { key: 'A', text: 'H₂SO₄ dan HSO₄⁻' },
      { key: 'B', text: 'HF dan H₂F⁺' },
      { key: 'C', text: 'HF dan HSO₄⁻' },
      { key: 'D', text: 'H₂SO₄ dan H₂F⁺' },
      { key: 'E', text: 'H₂F⁺ dan HF' },
    ],
    correctAnswer: 'B',
    explanation:
      'Menurut konsep Brønsted–Lowry (1923), basa adalah akseptor (penerima) proton H⁺, sedangkan asam adalah donor (pemberi) proton H⁺. Dalam reaksi di atas, molekul HF bertindak sebagai basa karena menerima satu ion H⁺ dari H₂SO₄, membentuk kation H₂F⁺ yang berperan sebagai asam konjugasinya.',
    correctReason:
      'HF menerima proton H⁺ dari H₂SO₄ sehingga bertindak sebagai basa Brønsted–Lowry. Spesi H₂F⁺ yang terbentuk setelah penerimaan proton tersebut merupakan pasangan asam konjugasinya.',
    distractorExplanations: {
      A: 'H₂SO₄ mendonorkan proton sehingga bertindak sebagai asam Brønsted–Lowry, dan HSO₄⁻ adalah basa konjugasinya (bukan pasangan basa-asam konjugasi yang ditanyakan).',
      C: 'HF dan HSO₄⁻ bukan pasangan konjugasi karena tersusun dari kerangka atom pusat yang sama sekali berbeda (fluorin vs sulfur).',
      D: 'H₂SO₄ dan H₂F⁺ bukan pasangan konjugasi karena berasal dari dua molekul reaktan yang berlainan.',
      E: 'Urutan terbalik; H₂F⁺ adalah asam konjugasi hasil reaksi, sedangkan HF adalah molekul basa awalnya.',
    },
    isVerified: true,
  },
  {
    id: 2,
    questionNumber: 2,
    topic: 'Reaksi Kimia Asam dengan Logam Aktif & Garam Karbonat',
    cognitiveLevel: 'C3',
    cognitiveLabel: 'C3 — Mengaplikasikan',
    indicator:
      'Mengaplikasikan sifat kimia larutan asam dalam memprediksi gas hasil reaksi penggantian tunggal dengan logam seng dan reaksi penetralan dengan garam kalsium karbonat.',
    stimulus:
      'Di laboratorium kimia, seorang siswa melakukan dua pengujian terpisah:\n• Tabung 1: Butiran logam seng (Zn) direaksikan dengan larutan asam klorida (HCl). Gas yang keluar ditampung dan didekatkan ke nyala api kecil, menimbulkan letupan ringan khas (pop sound).\n• Tabung 2: Serbuk batu pualam/kapur (CaCO₃) direaksikan dengan larutan asam cuka (CH₃COOH). Gas yang terbentuk dialirkan ke dalam air kapur jenuh (Ca(OH)₂), menyebabkan larutan menjadi keruh putih.',
    question:
      'Berdasarkan sifat kimia larutan asam tersebut, formula kimia gas yang dihasilkan pada Tabung 1 dan Tabung 2 secara berturut-turut beserta prinsip reaksinya adalah...',
    options: [
      {
        key: 'A',
        text: 'Gas Cl₂ dari oksidasi ion klorida dan gas CO dari pembakaran tidak sempurna kalsium',
      },
      {
        key: 'B',
        text: 'Gas H₂ dari reduksi ion hidrogen oleh seng dan gas CO₂ dari dekomposisi asam karbonat',
      },
      {
        key: 'C',
        text: 'Gas O₂ dari elektrolisis pelarut air dan gas CH₄ dari penguraian gugus asetat',
      },
      {
        key: 'D',
        text: 'Gas H₂O fasa uap dan gas SO₂ dari reduksi asam mineral klorida',
      },
      {
        key: 'E',
        text: 'Gas CO₂ dari reaksi logam aktif dan gas H₂ dari batuan kapur karbonat',
      },
    ],
    correctAnswer: 'B',
    explanation:
      'Larutan asam memiliki dua sifat kimia khas: (1) Bereaksi dengan logam aktif (seperti Zn, Mg, Fe) melepaskan gas hidrogen (H₂): Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)↑ yang memicu letupan kecil saat disulut api; (2) Bereaksi dengan garam karbonat (CaCO₃) melepaskan gas karbon dioksida (CO₂): CaCO₃(s) + 2CH₃COOH(aq) → (CH₃COO)₂Ca(aq) + H₂O(l) + CO₂(g)↑ yang mengeruhkan air kapur akibat pembentukan kembali endapan CaCO₃.',
    correctReason:
      'Reaksi logam seng dengan asam menghasilkan gas hidrogen (H₂), dan reaksi garam karbonat dengan asam menghasilkan gas karbon dioksida (CO₂).',
    distractorExplanations: {
      A: 'Gas klorin (Cl₂) berbau menyengat dan berwarna kuning kehijauan, bukan gas yang meletup saat disulut; reaksi asam dengan karbonat menghasilkan CO₂, bukan gas monoksida CO.',
      C: 'Reaksi asam dengan logam dan karbonat bukan reaksi elektrolisis ataupun dekarboksilasi penghasil metana (CH₄).',
      D: 'Tidak ada unsur belerang (sulfur) dalam pereaksi untuk menghasilkan gas sulfur dioksida (SO₂).',
      E: 'Penetapan formula gas terbalik antara Tabung 1 (logam menghasilkan H₂) dan Tabung 2 (karbonat menghasilkan CO₂).',
    },
    isVerified: true,
  },
  {
    id: 3,
    questionNumber: 3,
    topic: 'Aplikasi Reaksi Netralisasi Medis (Antasida)',
    cognitiveLevel: 'C3',
    cognitiveLabel: 'C3 — Mengaplikasikan',
    indicator:
      'Mengaplikasikan konsep reaksi penetralan asam-basa untuk menentukan mekanisme kerja antasida berbahan aktif magnesium hidroksida dalam mengatasi hiperasiditas lambung.',
    stimulus:
      'Penderita penyakit maag mengalami peningkatan konsentrasi asam klorida (HCl) dalam getah lambung (pH 1.0–1.5) yang menyebabkan nyeri ulu hati. Dokter meresepkan suspensi obat maag berbahan aktif magnesium hidroksida (Mg(OH)₂).',
    question:
      'Persamaan reaksi netralisasi molekuler yang berlangsung di lambung pasien serta alasan ilmiah penggunaan Mg(OH)₂ dibandingkan basa kuat seperti NaOH adalah...',
    options: [
      {
        key: 'A',
        text: 'Mg(OH)₂(s) + 2HCl(aq) → MgCl₂(aq) + 2H₂O(l); Mg(OH)₂ adalah basa sukar larut sehingga aman bagi dinding lambung dan tidak memicu sifat kaustik yang merusak jaringan',
      },
      {
        key: 'B',
        text: 'Mg(OH)₂(s) + HCl(aq) → MgCl(aq) + H₂O(l); Mg(OH)₂ membentuk gas klorin aktif yang membasmi bakteri lambung',
      },
      {
        key: 'C',
        text: 'MgOH(aq) + HCl(aq) → MgCl(aq) + H₂O(l); NaOH bereaksi terlalu lambat sehingga kurang efektif menetralkan asam lambung',
      },
      {
        key: 'D',
        text: 'Mg(OH)₂(s) + 2HCl(aq) → MgH₂(s) + Cl₂O(g); Mg(OH)₂ bekerja dengan mengikat kelebihan air dalam lambung',
      },
      {
        key: 'E',
        text: '2Mg(OH)₂(s) + HCl(aq) → Mg₂Cl(aq) + 2H₂O₂(aq); NaOH tidak dapat bereaksi dengan asam klorida lambung',
      },
    ],
    correctAnswer: 'A',
    explanation:
      'Antasida bekerja berdasarkan reaksi netralisasi: Mg(OH)₂(s) + 2HCl(aq) → MgCl₂(aq) + 2H₂O(l). Basa kuat terlarut seperti NaOH dilarang keras dikonsumsi karena bersifat kaustik, melepaskan ion OH⁻ dalam jumlah masif secara instan, dan menyebabkan luka bakar kimiawi pada jaringan esofagus dan mukosa lambung. Mg(OH)₂ yang sukar larut hanya terdisosiasi melepaskan ion OH⁻ sebanding dengan keberadaan ion H⁺ asam berlebih, sehingga menaikkan pH lambung ke kisaran aman (pH 3–4) tanpa merusak lambung.',
    correctReason:
      'Persamaan reaksi setara adalah Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O, dan sifat kelarutannya yang rendah menjadikan Mg(OH)₂ aman sebagai antasida lambung tanpa efek kaustik.',
    distractorExplanations: {
      B: 'Rumus senyawa magnesium klorida adalah MgCl₂ (bukan MgCl), dan reaksi netralisasi sama sekali tidak menghasilkan gas klorin beracun.',
      C: 'Rumus kimia MgOH keliru karena magnesium bermuatan +2 (Mg²⁺), dan pernyataan tentang NaOH bereaksi lambat keliru karena basa kuat bereaksi sangat cepat dan kaustik berbahaya.',
      D: 'Reaksi netralisasi menghasilkan garam dan air, bukan magnesium hidrida (MgH₂) atau gas diklorin monoksida (Cl₂O).',
      E: 'Reaksi netralisasi tidak menghasilkan hidrogen peroksida (H₂O₂), dan koefisien serta rumus kimianya tidak setara.',
    },
    isVerified: true,
  },
  {
    id: 4,
    questionNumber: 4,
    topic: 'Keterbatasan Teori Asam-Basa Arrhenius & Brønsted vs Teori Lewis',
    cognitiveLevel: 'C4',
    cognitiveLabel: 'C4 — Menganalisis',
    indicator:
      'Menganalisis alasan mengapa reaksi pembentukan ikatan kovalen koordinasi pada gas amonia dengan boron trifluorida tidak dapat dijelaskan oleh teori Arrhenius maupun Brønsted–Lowry, melainkan dijelaskan oleh teori Lewis.',
    stimulus:
      'Diberikan persamaan reaksi kimia yang berlangsung pada fasa gas tanpa pelarut air:\nNH₃(g) + BF₃(g) → H₃N:BF₃(s)\nBerdasarkan struktur Lewis: atom nitrogen pada NH₃ memiliki sepasang elektron bebas (PEB), sedangkan atom boron pada BF₃ hanya dikelilingi oleh 6 elektron valensi (memiliki orbital kosong dan belum memenuhi kaidah oktet).',
    question:
      'Analisis yang paling tepat mengenai peran kedua zat dan cakupan teori asam-basa pada reaksi tersebut adalah...',
    options: [
      {
        key: 'A',
        text: 'NH₃ bertindak sebagai asam Brønsted–Lowry karena mendonorkan proton ke inti atom boron',
      },
      {
        key: 'B',
        text: 'Reaksi tersebut dapat dijelaskan dengan teori Arrhenius karena menghasilkan endapan garam netral dalam air',
      },
      {
        key: 'C',
        text: 'BF₃ bertindak sebagai asam Lewis karena menerima pasangan elektron bebas dari atom N untuk membentuk ikatan kovalen koordinasi',
      },
      {
        key: 'D',
        text: 'BF₃ bertindak sebagai basa Lewis karena memiliki afinitas elektron atom fluorin yang sangat elektronegatif',
      },
      {
        key: 'E',
        text: 'NH₃ bertindak sebagai asam Lewis karena orbital nitrogen menerima sumbangan kerapatan elektron dari ikatan B–F',
      },
    ],
    correctAnswer: 'C',
    explanation:
      'Teori Arrhenius terbatas pada pelarut air dan pelepasan ion H⁺/OH⁻; teori Brønsted–Lowry mensyaratkan transfer proton H⁺. Reaksi NH₃(g) + BF₃(g) tidak melibatkan pelarut air maupun transfer proton H⁺, sehingga gagal dijelaskan oleh kedua teori tersebut. Gilbert N. Lewis (1923) memperluas definisi: basa Lewis adalah donor pasangan elektron bebas (PEB), yaitu NH₃; sedangkan asam Lewis adalah akseptor pasangan elektron bebas pada orbital kosongnya, yaitu BF₃. Keduanya membentuk ikatan kovalen koordinasi H₃N:BF₃.',
    correctReason:
      'BF₃ kekurangan pasangan elektron valensi (oktet tak lengkap) sehingga bertindak sebagai akseptor PEB (asam Lewis) saat bereaksi dengan NH₃ (basa Lewis).',
    distractorExplanations: {
      A: 'Tidak ada partikel proton H⁺ yang dipindahkan dari NH₃ ke atom boron, sehingga teori Brønsted–Lowry tidak berlaku.',
      B: 'Reaksi berlangsung dalam wujud gas murni tanpa keberadaan molekul air (H₂O), sehingga teori Arrhenius tidak dapat diterapkan.',
      D: 'BF₃ bertindak sebagai akseptor pasangan elektron (asam Lewis), bukan donor pasangan elektron (basa Lewis).',
      E: 'Atom nitrogen pada NH₃ menyumbangkan PEB (donor/basa Lewis), bukan bertindak sebagai asam Lewis.',
    },
    isVerified: true,
  },
  {
    id: 5,
    questionNumber: 5,
    topic: 'Analisis Data Uji Kertas Lakmus & Daya Hantar Elektrolit',
    cognitiveLevel: 'C4',
    cognitiveLabel: 'C4 — Menganalisis',
    indicator:
      'Menganalisis tabel data hasil pengujian kertas lakmus merah dan biru serta daya hantar listrik pada beberapa sampel larutan tak berlabel untuk menentukan klasifikasi sifat larutan secara akurat.',
    stimulus:
      'Tabel data pengamatan uji sifat larutan pada empat sampel cairan tak berlabel di laboratorium:\n' +
      '• Sampel W: Lakmus Merah → Tetap Merah | Lakmus Biru → Berubah Merah | Nyala Lampu: Terang, banyak gelembung gas\n' +
      '• Sampel X: Lakmus Merah → Berubah Biru | Lakmus Biru → Tetap Biru | Nyala Lampu: Terang, banyak gelembung gas\n' +
      '• Sampel Y: Lakmus Merah → Tetap Merah | Lakmus Biru → Tetap Biru | Nyala Lampu: Tidak menyala, tanpa gelembung\n' +
      '• Sampel Z: Lakmus Merah → Tetap Merah | Lakmus Biru → Berubah Merah | Nyala Lampu: Redup, sedikit gelembung gas',
    question:
      'Berdasarkan data eksperimen tersebut, analisis yang paling tepat mengenai klasifikasi larutan W, X, Y, dan Z adalah...',
    options: [
      {
        key: 'A',
        text: 'Larutan W adalah basa kuat, sedangkan larutan X adalah asam kuat',
      },
      {
        key: 'B',
        text: 'Larutan W adalah asam kuat, larutan X adalah basa kuat, larutan Y adalah netral non-elektrolit, dan larutan Z adalah asam lemah',
      },
      {
        key: 'C',
        text: 'Larutan Y adalah asam kuat karena kedua warna kertas lakmus tidak ada yang berubah menjadi biru',
      },
      {
        key: 'D',
        text: 'Larutan Z adalah basa lemah karena menghasilkan sedikit gelembung gas pada elektrode',
      },
      {
        key: 'E',
        text: 'Larutan W dan Z keduanya bersifat basa karena sama-sama memerahkan lakmus biru',
      },
    ],
    correctAnswer: 'B',
    explanation:
      'Indikator kertas lakmus: Asam memerahkan lakmus biru dan mempertahankan lakmus merah; Basa membirukan lakmus merah dan mempertahankan lakmus biru; Netral mempertahankan warna awal kedua lakmus. Uji elektrolit: Nyala terang menandakan ionisasi 100% (elektrolit kuat), nyala redup/gelembung sedikit menandakan ionisasi sebagian (elektrolit lemah), dan mati tanpa gelembung menandakan zat molekuler non-elektrolit. Maka:\n• W: Asam + Elektrolit Kuat = Asam Kuat (misal HCl 0.1 M)\n• X: Basa + Elektrolit Kuat = Basa Kuat (misal NaOH 0.1 M)\n• Y: Netral + Non-elektrolit = Netral Non-elektrolit (misal Akuades/Sukrosa)\n• Z: Asam + Elektrolit Lemah = Asam Lemah (misal CH₃COOH 0.1 M)',
    correctReason:
      'Klasifikasi W (asam kuat), X (basa kuat), Y (netral non-elektrolit), dan Z (asam lemah) sepenuhnya konsisten dengan data perubahan warna indikator dan gejala daya hantar listrik.',
    distractorExplanations: {
      A: 'Larutan W memerahkan lakmus biru yang merupakan ciri khas larutan asam, bukan basa.',
      C: 'Larutan asam kuat pasti akan mengubah lakmus biru menjadi merah, sedangkan pada larutan Y lakmus biru tetap biru (kondisi netral sempurna).',
      D: 'Larutan Z memerahkan lakmus biru sehingga bersifat asam lemah, bukan basa.',
      E: 'Zat yang memerahkan kertas lakmus biru adalah larutan asam, bukan larutan basa.',
    },
    isVerified: true,
  },
  {
    id: 6,
    questionNumber: 6,
    topic: 'Analisis Zat Amfiprotik pada Ionisasi Asam Poliprotik',
    cognitiveLevel: 'C4',
    cognitiveLabel: 'C4 — Menganalisis',
    indicator:
      'Menganalisis spesi kimia yang berperan sebagai zat amfiprotik (amfoter) pada reaksi kesetimbangan ionisasi bertahap asam fosfat (H₃PO₄).',
    stimulus:
      'Asam fosfat (H₃PO₄) adalah asam poliprotik yang mengalami tiga tahap reaksi ionisasi bertingkat dalam air:\n' +
      '(1) H₃PO₄(aq) + H₂O(l) ⇌ H₂PO₄⁻(aq) + H₃O⁺(aq)\n' +
      '(2) H₂PO₄⁻(aq) + H₂O(l) ⇌ HPO₄²⁻(aq) + H₃O⁺(aq)\n' +
      '(3) HPO₄²⁻(aq) + H₂O(l) ⇌ PO₄³⁻(aq) + H₃O⁺(aq)',
    question:
      'Berdasarkan ketiga persamaan reaksi kesetimbangan tersebut, pasangan spesi turunan fosfat yang bersifat amfiprotik (dapat bertindak sebagai asam Brønsted–Lowry sekaligus basa Brønsted–Lowry) adalah...',
    options: [
      { key: 'A', text: 'H₃PO₄ dan PO₄³⁻' },
      { key: 'B', text: 'H₃PO₄ dan H₂PO₄⁻' },
      { key: 'C', text: 'H₂PO₄⁻ dan HPO₄²⁻' },
      { key: 'D', text: 'PO₄³⁻ dan H₃O⁺' },
      { key: 'E', text: 'HPO₄²⁻ dan PO₄³⁻' },
    ],
    correctAnswer: 'C',
    explanation:
      'Spesi amfiprotik adalah spesi yang dapat mendonorkan proton (asam) atau menerima proton (basa). Pada tahapan reaksi di atas:\n• H₂PO₄⁻: Pada reaksi (1) bertindak sebagai basa konjugasi dari H₃PO₄ (akseptor proton ke arah kiri), namun pada reaksi (2) bertindak sebagai asam pendonor proton ke H₂O.\n• HPO₄²⁻: Pada reaksi (2) bertindak sebagai basa konjugasi dari H₂PO₄⁻, namun pada reaksi (3) bertindak sebagai asam pendonor proton ke H₂O.\nOleh karena itu, kedua anion H₂PO₄⁻ dan HPO₄²⁻ memiliki sifat amfiprotik ganda.',
    correctReason:
      'H₂PO₄⁻ dan HPO₄²⁻ keduanya memiliki proton yang dapat dilepaskan sekaligus muatan negatif yang dapat menerima proton pada tahapan reaksi kesetimbangan bertingkat.',
    distractorExplanations: {
      A: 'H₃PO₄ hanya dapat mendonorkan proton (asam), sedangkan PO₄³⁻ tidak memiliki proton lagi sehingga hanya bisa menerima proton (basa murni).',
      B: 'H₃PO₄ tidak dapat bertindak sebagai basa dalam larutan air encer (tidak membentuk H₄PO₄⁺).',
      D: 'PO₄³⁻ tidak memiliki proton untuk didonorkan, dan H₃O⁺ adalah asam kuat terhidrasi yang tidak menerima proton lagi di larutan encer.',
      E: 'PO₄³⁻ bukan zat amfiprotik karena tidak memiliki atom hidrogen asam yang dapat dilepas.',
    },
    isVerified: true,
  },
  {
    id: 7,
    questionNumber: 7,
    topic: 'Analisis Persamaan Ion Lengkap, Ion Bersih, & Ion Penonton',
    cognitiveLevel: 'C4',
    cognitiveLabel: 'C4 — Menganalisis',
    indicator:
      'Menganalisis perbedaan persamaan molekuler, ion lengkap, dan ion bersih pada reaksi penetralan asam sulfat encer dengan kalium hidroksida untuk mengidentifikasi ion penonton.',
    stimulus:
      'Diberikan persamaan reaksi molekuler antara larutan asam sulfat encer dengan larutan kalium hidroksida:\nH₂SO₄(aq) + 2KOH(aq) → K₂SO₄(aq) + 2H₂O(l)',
    question:
      'Pasangan ion manakah yang bertindak sebagai ion penonton (spectator ions), dan bagaimanakah persamaan reaksi ion bersih (net ionic equation) yang sesungguhnya menggambarkan proses netralisasi tersebut?',
    options: [
      {
        key: 'A',
        text: 'Ion penonton: H⁺ dan OH⁻; Persamaan ion bersih: 2K⁺(aq) + SO₄²⁻(aq) → K₂SO₄(s)',
      },
      {
        key: 'B',
        text: 'Ion penonton: K⁺ dan SO₄²⁻; Persamaan ion bersih: H⁺(aq) + OH⁻(aq) → H₂O(l)',
      },
      {
        key: 'C',
        text: 'Ion penonton: K⁺ dan H₂O; Persamaan ion bersih: H₂SO₄(aq) + 2OH⁻(aq) → SO₄²⁻(aq) + 2H₂O(l)',
      },
      {
        key: 'D',
        text: 'Ion penonton: SO₄²⁻ saja; Persamaan ion bersih: 2K⁺(aq) + 2OH⁻(aq) → 2KOH(aq)',
      },
      {
        key: 'E',
        text: 'Ion penonton: Tidak ada ion penonton karena seluruh pereaksi berubah fasa menjadi endapan padat',
      },
    ],
    correctAnswer: 'B',
    explanation:
      'Dalam larutan berair, senyawa asam kuat dan basa kuat terurai menjadi ion-ionnya:\nPersamaan Ion Lengkap: 2H⁺(aq) + SO₄²⁻(aq) + 2K⁺(aq) + 2OH⁻(aq) → 2K⁺(aq) + SO₄²⁻(aq) + 2H₂O(l)\nIon K⁺ dan SO₄²⁻ hadir di sisi reaktan maupun produk dalam keadaan terhidrasi bebas tanpa mengalami perubahan ikatan atau wujud (ion penonton / spectator ions). Mengeliminasi ion penonton menghasilkan Persamaan Ion Bersih: 2H⁺(aq) + 2OH⁻(aq) → 2H₂O(l) atau disederhanakan menjadi H⁺(aq) + OH⁻(aq) → H₂O(l).',
    correctReason:
      'Ion K⁺ dan SO₄²⁻ tidak berpartisipasi dalam pembentukan molekul baru (ion penonton), sehingga reaksi penetralan sejati adalah penggabungan ion hidrogen dan hidroksida membentuk air netral.',
    distractorExplanations: {
      A: 'H⁺ dan OH⁻ adalah spesi aktif pereaksi utama, bukan ion penonton; K₂SO₄ larut sempurna dalam air (aq) dan tidak mengendap sebagai padatan (s).',
      C: 'Molekul air (H₂O) adalah produk reaksi berwujud cairan murni, bukan ion penonton.',
      D: 'Ion K⁺ juga tidak mengalami perubahan sehingga berstatus sebagai ion penonton bersama sulfat.',
      E: 'Reaksi netralisasi ini memiliki dua ion penonton terlarut dan tidak membentuk endapan padat.',
    },
    isVerified: true,
  },
  {
    id: 8,
    questionNumber: 8,
    topic: 'Evaluasi Pengaruh Kepolaran Pelarut terhadap Ionisasi Asam',
    cognitiveLevel: 'C5',
    cognitiveLabel: 'C5 — Mengevaluasi',
    indicator:
      'Mengevaluasi klaim ilmiah mengenai perilaku keasaman dan daya hantar listrik gas hidrogen klorida (HCl) saat dilarutkan ke dalam pelarut non-polar (benzena) dibandingkan pelarut polar (air).',
    stimulus:
      'Seorang siswa membuat pernyataan tertulis:\n"Karena gas HCl merupakan asam kuat yang terionisasi sempurna, maka jika gas HCl dilarutkan ke dalam pelarut benzena murni (C₆H₆), larutan tersebut akan tetap memerahkan kertas lakmus biru kering dan menyalakan lampu alat uji elektrolit sama terangnya dengan larutan HCl dalam air."\nNamun saat dilakukan pengujian riil di laboratorium, ternyata larutan HCl dalam benzena tidak mengubah warna lakmus biru kering sama sekali dan lampu alat uji elektrolit tidak menyala.',
    question:
      'Evaluasi kritis yang paling tepat untuk mengoreksi kekeliruan pemikiran siswa tersebut berdasarkan teori asam-basa modern adalah...',
    options: [
      {
        key: 'A',
        text: 'Pendapat siswa keliru karena benzena merupakan senyawa basa kuat yang langsung menetralkan gas HCl seketika',
      },
      {
        key: 'B',
        text: 'Pendapat siswa keliru karena pelepasan proton (H⁺) oleh asam Brønsted hanya dapat terjadi jika terdapat molekul pelarut polar (seperti H₂O) yang bertindak sebagai basa akseptor proton; dalam benzena non-polar, HCl tetap berupa molekul kovalen netral dan tidak terionisasi',
      },
      {
        key: 'C',
        text: 'Pendapat siswa sebenarnya benar, namun kertas lakmus laboratorium tersebut telah rusak pigmennya sehingga gagal mendeteksi keasaman',
      },
      {
        key: 'D',
        text: 'Pendapat siswa keliru karena molekul HCl hanya dapat menunjukkan sifat asam bila dipanaskan hingga suhu di atas 100°C',
      },
      {
        key: 'E',
        text: 'Pendapat siswa keliru karena asam kuat hanya dapat menghantarkan arus listrik jika ditambahkan serbuk logam alkali',
      },
    ],
    correctAnswer: 'B',
    explanation:
      'Menurut konsep Brønsted–Lowry, asam hanya dapat mendonorkan proton (H⁺) apabila terdapat zat lain yang bertindak sebagai akseptor proton (basa). Molekul air (H₂O) bersifat polar dan memiliki pasangan elektron bebas yang mampu menarik proton membentuk ion hidronium (H₃O⁺) dan Cl⁻ (terjadi ionisasi dan menghantarkan arus listrik). Sebaliknya, benzena (C₆H₆) adalah senyawa hidrokarbon non-polar tanpa kemampuan menarik proton. Oleh karena itu, gas HCl dalam benzena tetap terlarut sebagai molekul kovalen diatomik netral HCl tanpa terionisasi, sehingga tidak menghasilkan ion bebas pembawa muatan listrik dan tidak dapat memerahkan lakmus kering.',
    correctReason:
      'Ionisasi asam membutuhkan pelarut polar amfiprotik yang bertindak sebagai akseptor proton; dalam pelarut non-polar seperti benzena, transfer proton tidak dapat berlangsung.',
    distractorExplanations: {
      A: 'Benzena adalah hidrokarbon aromatik netral non-polar, bukan zat basa kuat.',
      C: 'Kertas lakmus berfungsi normal; ketiadaan perubahan warna merupakan fakta ilmiah ketiadaan ion H⁺ bebas.',
      D: 'Sifat asam larutan HCl dalam air teramati pada suhu kamar biasa tanpa pemanasan.',
      E: 'Daya hantar listrik larutan asam kuat muncul spontan dari ionisasinya dalam air, bukan karena penambahan logam.',
    },
    isVerified: true,
  },
  {
    id: 9,
    questionNumber: 9,
    topic: 'Evaluasi Penanganan Medis Kontekstual Sengatan Serangga',
    cognitiveLevel: 'C5',
    cognitiveLabel: 'C5 — Mengevaluasi',
    indicator:
      'Mengevaluasi ketepatan prosedur pertolongan pertama pada sengatan serangga lebah dan tawon berdasarkan sifat kimia asam-basa cairan sengatan.',
    stimulus:
      'Dalam kegiatan perkemahan sains sekolah, dua siswa mengalami insiden sengatan serangga:\n• Siswa 1 tersengat lebah madu (honeybee) yang menyuntikkan racun bersifat asam (mengandung asam metanoat/format HCOOH dengan pH berkisar 4.5–5.5).\n• Siswa 2 tersengat tawon kuning (wasp) yang menyuntikkan racun bersifat basa (mengandung senyawa peptida alkalin dan histamin dengan pH berkisar 8.5–9.0).\nDi kotak P3K tersedia:\n(1) Larutan soda api (NaOH 1 M)\n(2) Cuka makan encer (CH₃COOH 5%)\n(3) Pasta soda kue (NaHCO₃)\n(4) Air perasan jeruk nipis pekat',
    question:
      'Berdasarkan prinsip netralisasi kimia dan keselamatan medis kulit, evaluasilah pasangan tindakan penanganan yang paling tepat, rasional, dan aman untuk Siswa 1 dan Siswa 2...',
    options: [
      {
        key: 'A',
        text: 'Siswa 1 diolesi larutan soda api (NaOH), sedangkan Siswa 2 diolesi air perasan jeruk nipis pekat',
      },
      {
        key: 'B',
        text: 'Siswa 1 diolesi pasta soda kue (NaHCO₃), sedangkan Siswa 2 dikompres dengan larutan cuka makan encer (CH₃COOH)',
      },
      {
        key: 'C',
        text: 'Siswa 1 dikompres cuka makan encer, sedangkan Siswa 2 diolesi pasta soda kue',
      },
      {
        key: 'D',
        text: 'Kedua siswa cukup dibasuh dengan larutan soda api encer karena basa kuat dapat menetralkan segala jenis racun organik',
      },
      {
        key: 'E',
        text: 'Kedua siswa tidak memerlukan penanganan kimia karena racun serangga akan dinetralkan secara otomatis oleh udara bebas',
      },
    ],
    correctAnswer: 'B',
    explanation:
      'Prinsip penetralan toksin serangga pada jaringan kulit:\n• Siswa 1 terkena racun asam (HCOOH) lebah madu, sehingga memerlukan senyawa penetral basa lemah yang tidak mengiritasi kulit, yaitu pasta soda kue (NaHCO₃): HCOOH + NaHCO₃ → HCOONa + H₂O + CO₂↑.\n• Siswa 2 terkena racun basa tawon, sehingga memerlukan penetral asam lemah yang aman bagi kulit, yaitu kompres cuka makan encer (CH₃COOH 5%).\n• Penggunaan soda api (NaOH) sangat dilarang karena merupakan basa kuat yang bersifat kaustik ekstrem dan dapat menyebabkan nekrosis jaringan kulit (luka bakar kimiawi parah).',
    correctReason:
      'Pasta NaHCO₃ (basa lemah) menetralkan racun asam lebah secara aman, dan larutan CH₃COOH encer (asam lemah) menetralkan racun basa tawon tanpa menimbulkan efek samping kaustik berbahaya.',
    distractorExplanations: {
      A: 'Soda api (NaOH) adalah zat kaustik berbahaya yang tidak boleh dioleskan ke kulit manusia karena akan menimbulkan luka bakar kimiawi parah.',
      C: 'Tindakan penanganan terbalik; mengoleskan cuka pada racun asam lebah akan memperparah rasa nyeri, demikian pula soda kue pada racun basa tawon.',
      D: 'Penggunaan basa kuat NaOH pada kulit melanggar protokol keselamatan medis dan kimiawi.',
      E: 'Membiarkan racun tanpa penetralan yang tepat dapat memicu respons inflamasi berkepanjangan dan kerusakan jaringan lokal.',
    },
    isVerified: true,
  },
  {
    id: 10,
    questionNumber: 10,
    topic: 'Evaluasi Remediasi Ekologis Tanah Gambut Masam',
    cognitiveLevel: 'C5',
    cognitiveLabel: 'C5 — Mengevaluasi',
    indicator:
      'Mengevaluasi efektivitas, kelayakan ekologis, dan profil keamanan zat penetral tanah masam dalam pertanian lahan gambut.',
    stimulus:
      'Kelompok tani menghadapi masalah lahan gambut yang sangat masam (pH ≈ 3.2) akibat tingginya konsentrasi asam humat dan fulvat alami serta oksidasi mineral pirit. Keasaman ekstrem ini mengikat unsur hara fosfor dan meracuni perakaran tanaman jagung. Pengurus kelompok tani mempertimbangkan tiga alternatif zat untuk menaikkan pH tanah ke rentang netral-ideal (pH 6.0–6.8):\n• Opsi I: Kalsium karbonat (CaCO₃ / dolomit / kapur pertanian)\n• Opsi II: Soda api padat (NaOH / natrium hidroksida)\n• Opsi III: Pupuk amonium sulfat ((NH₄)₂SO₄)',
    question:
      'Berdasarkan pertimbangan kapasitas netralisasi, dampak keberlanjutan ekosistem mikroba tanah, dan suplai hara esensial, evaluasi ilmiah yang paling tepat adalah...',
    options: [
      {
        key: 'A',
        text: 'Opsi II (NaOH) paling efektif karena menaikkan pH secara instan dan tidak meninggalkan endapan garam apapun',
      },
      {
        key: 'B',
        text: 'Opsi III ((NH₄)₂SO₄) paling tepat karena melepaskan ion amonium yang langsung berperan sebagai basa kuat penyubur tanah',
      },
      {
        key: 'C',
        text: 'Opsi I (CaCO₃) paling tepat karena menetralkan ion H⁺ secara bertahap dan terkontrol (self-buffering), memperbaiki aerasi melalui pelepasan gas CO₂, serta menyediakan nutrisi kation Ca²⁺ dan Mg²⁺ tanpa risiko lonjakan pH kaustik ekstrem yang mematikan mikroorganisme tanah',
      },
      {
        key: 'D',
        text: 'Opsi I dan Opsi II memiliki efek biologis yang sama karena keduanya merupakan senyawa basa logam',
      },
      {
        key: 'E',
        text: 'Semua opsi tidak layak karena tanah gambut tidak dapat dinetralkan oleh reaksi kimia asam-basa',
      },
    ],
    correctAnswer: 'C',
    explanation:
      'Evaluasi ilmiah remediasi tanah gambut masam:\n• CaCO₃ (dolomit/kapur pertanian) adalah zat penetral ideal karena memiliki kelarutan moderat dan daya sangga alami (buffering). Reaksi: CaCO₃(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂O(l) + CO₂(g)↑ berlangsung terkendali hingga pH tanah mencapai titik netral tanpa risiko kenaikan pH berlebih (over-liming). Selain itu, CaCO₃ menyuplai kation kalsium (Ca²⁺) yang memperbaiki agregat tanah serta melepaskan gas CO₂ yang meningkatkan aerasi tanah.\n• NaOH (Opsi II) dilarang karena merupakan basa kuat kaustik yang menaikkan pH secara liar (pH > 12), merusak materi organik, mematikan mikroba penyubur tanah, dan menyebabkan toksisitas ion natrium (salinisasi).\n• Amonium sulfat (Opsi III) adalah pupuk fisiologis masam; proses nitrifikasi NH₄⁺ menjadi NO₃⁻ justru memproduksi ion H⁺ tambahan yang kian memperparah keasaman tanah.',
    correctReason:
      'CaCO₃ bekerja dengan kapasitas sangga alami yang lembut, menaikkan pH ke rentang optimal secara stabil, serta menyumbang hara kalsium tanpa merusak ekosistem mikroba tanah.',
    distractorExplanations: {
      A: 'NaOH sangat kaustik, membunuh bakteri menguntungkan, merusak struktur fisik tanah gambut, dan menimbulkan keracunan ion Na⁺ bagi tanaman.',
      B: 'Amonium sulfat adalah zat pembentuk asam (fisiologis masam) yang justru menurunkan pH tanah saat ion amonium dioksidasi oleh mikroba tanah.',
      D: 'CaCO₃ adalah garam basa berdisolusi terkendali, sedangkan NaOH adalah basa kuat kaustik agresif; dampak biologis keduanya bertolak belakang.',
      E: 'Reaksi penetralan kapur pertanian pada tanah masam telah terbukti secara saintifik dan diterapkan secara luas dalam agronomi modern.',
    },
    isVerified: true,
  },
]

