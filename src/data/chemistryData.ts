import type {
  ChemicalSample,
  Indicator,
  QuizQuestion,
  TopicModule,
} from '../types/chemistry'

export const TOPIC_MODULES: TopicModule[] = [
  {
    id: 'modul-1',
    title: 'Modul 1 — Mengenal Asam dan Basa',
    tagline: 'Konsep Dasar & Teori Kimia',
    badge: 'Teori Dasar',
    description:
      'Pelajari pengertian asam dan basa menurut Arrhenius, Brønsted–Lowry, serta Lewis, beserta sifat fisis, kimia, dan contoh nyata dalam kehidupan sehari-hari.',
    icon: 'flask',
    targetSectionId: 'teori-section',
    keyPoints: [
      'Teori Arrhenius: ion H⁺ dan OH⁻ dalam air',
      'Teori Brønsted–Lowry: donor dan akseptor proton',
      'Teori Lewis: pasangan elektron bebas',
      'Peran asam-basa dalam metabolisme tubuh & industri',
    ],
  },
  {
    id: 'modul-2',
    title: 'Modul 2 — Indikator & Lab Virtual',
    tagline: 'Eksplorasi Inkuiri Interaktif',
    badge: 'Simulasi Inkuiri',
    description:
      'Uji coba berbagai sampel larutan menggunakan kertas lakmus, indikator sintetis (PP, BTB, MO), indikator universal, hingga indikator alami (kol ungu & kunyit) secara virtual.',
    icon: 'test-tube',
    targetSectionId: 'lab-section',
    keyPoints: [
      'Perubahan warna kertas lakmus merah & biru',
      'Trayek pH indikator fenolftalein, metil jingga, & BTB',
      'Keunikan pigmen antosianin kol ungu & kurkumin kunyit',
      'Jurnal pengamatan digital berbasis inkuiri terbimbing',
    ],
  },
  {
    id: 'modul-3',
    title: 'Modul 3 — Konsep pH & Netralisasi',
    tagline: 'Kuantitatif & Reaksi Kimia',
    badge: 'Kalkulator & pH',
    description:
      'Pahami skala keasaman pH 0–14, autoionisasi air Kw, perhitungan pH larutan asam kuat monoprotik dan basa kuat monovalen, serta mekanisme reaksi netralisasi.',
    icon: 'calculator',
    targetSectionId: 'kalkulator-section',
    keyPoints: [
      'Konsep matematis pH = -log[H⁺] dan pOH = -log[OH⁻]',
      'Hubungan pH + pOH = 14 pada suhu 25°C',
      'Kalkulator interaktif asam kuat monoprotik & basa kuat',
      'Reaksi netralisasi: Asam + Basa → Garam + Air',
    ],
  },
]

export const CHEMICAL_SAMPLES: ChemicalSample[] = [
  {
    id: 'hcl',
    name: 'Asam Klorida (HCl 0.1 M)',
    formula: 'HCl (aq)',
    category: 'laboratorium',
    approximatePh: 1.0,
    nature: 'asam_kuat',
    initialColor: '#f1f5f9',
    description:
      'Asam mineral kuat monoprotik yang terionisasi sempurna menghasilkan ion H⁺ dan Cl⁻.',
    ionPresent: '[H⁺] = 0.1 M',
  },
  {
    id: 'lemon',
    name: 'Air Perasan Lemon',
    formula: 'C₆H₈O₇ (aq)',
    category: 'sehari-hari',
    approximatePh: 2.3,
    nature: 'asam_lemah',
    initialColor: '#fef08a',
    description:
      'Mengandung asam sitrat alami, memberikan rasa masam segar dengan pH berkisar 2.2–2.4.',
    ionPresent: 'Asam sitrat terionisasi sebagian',
  },
  {
    id: 'cuka',
    name: 'Cuka Dapur (Asam Asetat)',
    formula: 'CH₃COOH (aq)',
    category: 'sehari-hari',
    approximatePh: 2.8,
    nature: 'asam_lemah',
    initialColor: '#f8fafc',
    description:
      'Larutan asam asetat encer (~5%), asam organik lemah dengan bau khas yang menyengat.',
    ionPresent: 'CH₃COO⁻ dan H⁺ dalam kesetimbangan',
  },
  {
    id: 'soda',
    name: 'Minuman Bersoda (Karbonat)',
    formula: 'H₂CO₃ (aq)',
    category: 'sehari-hari',
    approximatePh: 3.2,
    nature: 'asam_lemah',
    initialColor: '#fef3c7',
    description:
      'Mengandung gas karbon dioksida terlarut membentuk asam karbonat yang memberi sensasi menggelitik di lidah.',
    ionPresent: 'HCO₃⁻ dan H⁺',
  },
  {
    id: 'tomat',
    name: 'Jus Tomat Segar',
    formula: 'Campuran Asam Organik',
    category: 'sehari-hari',
    approximatePh: 4.2,
    nature: 'asam_lemah',
    initialColor: '#fecdd3',
    description:
      'Mengandung asam malat dan asam sitrat alami dengan tingkat keasaman sedang.',
    ionPresent: 'Anion organik dan ion H⁺',
  },
  {
    id: 'kopi',
    name: 'Kopi Hitam Seduh',
    formula: 'Asam Klorogenat',
    category: 'sehari-hari',
    approximatePh: 5.0,
    nature: 'asam_lemah',
    initialColor: '#d97706',
    description:
      'Kopi mengandung asam klorogenat dan lipid organik, bersifat asam lemah.',
    ionPresent: 'Ion H⁺ konsentrasi rendah',
  },
  {
    id: 'susu',
    name: 'Susu Sapi Segar',
    formula: 'Asam Laktat & Kasein',
    category: 'sehari-hari',
    approximatePh: 6.6,
    nature: 'asam_lemah',
    initialColor: '#f8fafc',
    description:
      'Mendekati netral namun sedikit bersifat asam karena adanya asam laktat hasil fermentasi ringan.',
    ionPresent: 'Laktat dan kation kalsium',
  },
  {
    id: 'air-murni',
    name: 'Air Murni (Akuades)',
    formula: 'H₂O (l)',
    category: 'laboratorium',
    approximatePh: 7.0,
    nature: 'netral',
    initialColor: '#e0f2fe',
    description:
      'Pelarut netral sempurna pada 25°C dengan konsentrasi [H⁺] = [OH⁻] = 1.0 × 10⁻⁷ M.',
    ionPresent: '[H⁺] = [OH⁻] = 10⁻⁷ M',
  },
  {
    id: 'air-laut',
    name: 'Air Laut / Darah Manusia',
    formula: 'Sistem Buffer Bikarbonat',
    category: 'sehari-hari',
    approximatePh: 7.8,
    nature: 'basa_lemah',
    initialColor: '#bae6fd',
    description:
      'Sedikit basa karena peran sistem penyangga bikarbonat (HCO₃⁻) yang menstabilkan pH biologis.',
    ionPresent: 'HCO₃⁻, Na⁺, Cl⁻',
  },
  {
    id: 'soda-kue',
    name: 'Larutan Soda Kue',
    formula: 'NaHCO₃ (aq)',
    category: 'sehari-hari',
    approximatePh: 8.4,
    nature: 'basa_lemah',
    initialColor: '#f1f5f9',
    description:
      'Garam basa yang terhidrolisis sebagian menghasilkan ion hidroksida encer dalam air.',
    ionPresent: 'Na⁺, HCO₃⁻, dan sedikit OH⁻',
  },
  {
    id: 'sabun',
    name: 'Air Sabun Mandi',
    formula: 'R-COONa (aq)',
    category: 'sehari-hari',
    approximatePh: 9.5,
    nature: 'basa_lemah',
    initialColor: '#e2e8f0',
    description:
      'Garam dari asam lemak dan basa kuat yang terasa licin di kulit serta bersifat basa.',
    ionPresent: 'Sabun karboksilat dan OH⁻',
  },
  {
    id: 'antasida',
    name: 'Suspensi Antasida (Obat Maag)',
    formula: 'Mg(OH)₂ (aq)',
    category: 'sehari-hari',
    approximatePh: 10.2,
    nature: 'basa_lemah',
    initialColor: '#f8fafc',
    description:
      'Basa yang sukar larut, aman dikonsumsi untuk menetralkan kelebihan asam klorida lambung.',
    ionPresent: 'Mg²⁺ dan OH⁻ bertahap',
  },
  {
    id: 'amonia',
    name: 'Pembersih Lantai (Amonia Encer)',
    formula: 'NH₃ (aq) / NH₄OH',
    category: 'sehari-hari',
    approximatePh: 11.2,
    nature: 'basa_lemah',
    initialColor: '#f1f5f9',
    description:
      'Basa nitrogen lemah yang berbau tajam, efektif melarutkan noda lemak.',
    ionPresent: 'NH₄⁺ dan OH⁻',
  },
  {
    id: 'pemutih',
    name: 'Pemutih Pakaian (Klorin)',
    formula: 'NaClO (aq)',
    category: 'sehari-hari',
    approximatePh: 12.5,
    nature: 'basa_kuat',
    initialColor: '#fef9c3',
    description:
      'Mengandung natrium hipoklorit dengan sifat basa kuat dan pengoksidasi tajam.',
    ionPresent: 'Na⁺, ClO⁻, dan konsentrasi OH⁻ tinggi',
  },
  {
    id: 'naoh',
    name: 'Natrium Hidroksida (NaOH 0.1 M)',
    formula: 'NaOH (aq)',
    category: 'laboratorium',
    approximatePh: 13.0,
    nature: 'basa_kuat',
    initialColor: '#f8fafc',
    description:
      'Basa kuat monovalen yang terdisosiasi 100% menghasilkan ion hidroksida bebas [OH⁻] = 0.1 M.',
    ionPresent: '[OH⁻] = 0.1 M',
  },
]

export const INDICATORS: Indicator[] = [
  {
    id: 'lakmus-merah',
    name: 'Kertas Lakmus Merah',
    type: 'kertas',
    phRange: 'pH 4.5 – 8.3',
    description:
      'Kertas uji klasik; tetap berwarna MERAH di lingkungan asam dan netral, berubah menjadi BIRU di lingkungan basa.',
    tips: 'Sangat cocok untuk deteksi cepat apakah suatu zat bersifat basa atau bukan.',
    getColorResult: (ph: number) => {
      if (ph > 7.4) {
        return {
          colorName: 'Biru (Menunjukkan Sifat Basa)',
          colorHex: '#2563eb',
          paperColorHex: '#2563eb',
          behaviorNote: 'Kertas lakmus merah berubah warna menjadi BIRU karena adanya ion OH⁻.',
        }
      }
      return {
        colorName: 'Tetap Merah (Asam atau Netral)',
        colorHex: '#ef4444',
        paperColorHex: '#ef4444',
        behaviorNote: 'Kertas lakmus merah TETAP MERAH dalam larutan asam maupun netral.',
      }
    },
  },
  {
    id: 'lakmus-biru',
    name: 'Kertas Lakmus Biru',
    type: 'kertas',
    phRange: 'pH 4.5 – 8.3',
    description:
      'Kertas uji klasik; berubah menjadi MERAH di lingkungan asam, dan tetap berwarna BIRU di lingkungan netral atau basa.',
    tips: 'Gunakan bersama lakmus merah untuk konfirmasi akurat: Asam (dua-duanya merah), Basa (dua-duanya biru), Netral (masing-masing tetap).',
    getColorResult: (ph: number) => {
      if (ph < 6.8) {
        return {
          colorName: 'Merah (Menunjukkan Sifat Asam)',
          colorHex: '#dc2626',
          paperColorHex: '#dc2626',
          behaviorNote: 'Kertas lakmus biru berubah menjadi MERAH akibat interaksi dengan proton H⁺.',
        }
      }
      return {
        colorName: 'Tetap Biru (Netral atau Basa)',
        colorHex: '#2563eb',
        paperColorHex: '#2563eb',
        behaviorNote: 'Kertas lakmus biru TETAP BIRU dalam larutan netral maupun basa.',
      }
    },
  },
  {
    id: 'universal',
    name: 'Indikator Universal (Larutan/Kertas)',
    type: 'universal',
    phRange: 'pH 0 – 14 (Spektrum Penuh)',
    description:
      'Campuran beberapa senyawa indikator sintetis yang memberikan gradasi warna unik untuk setiap rentang nilai pH dari 0 hingga 14.',
    tips: 'Dapat memperkirakan angka pH secara langsung dengan mencocokkan ke skala warna standar.',
    getColorResult: (ph: number) => {
      if (ph <= 2) {
        return {
          colorName: 'Merah Tua Pekat (pH 0–2)',
          colorHex: '#dc2626',
          paperColorHex: '#dc2626',
          behaviorNote: 'Warna merah pekat menandakan larutan asam kuat dengan keasaman ekstrem.',
        }
      } else if (ph <= 4) {
        return {
          colorName: 'Jingga / Oranye (pH 3–4)',
          colorHex: '#ea580c',
          paperColorHex: '#ea580c',
          behaviorNote: 'Warna jingga cerah menandakan larutan asam lemah atau sedang.',
        }
      } else if (ph <= 6) {
        return {
          colorName: 'Kuning Cerah (pH 5–6)',
          colorHex: '#eab308',
          paperColorHex: '#eab308',
          behaviorNote: 'Warna kuning menandakan larutan bersifat asam sangat lemah.',
        }
      } else if (ph <= 7.4) {
        return {
          colorName: 'Hijau Segar Netral (pH ~7)',
          colorHex: '#16a34a',
          paperColorHex: '#16a34a',
          behaviorNote: 'Warna hijau daun seimbang menandakan kondisi netral ([H⁺] = [OH⁻]).',
        }
      } else if (ph <= 9) {
        return {
          colorName: 'Toska Kehijauan (pH 8–9)',
          colorHex: '#0d9488',
          paperColorHex: '#0d9488',
          behaviorNote: 'Warna toska hijau kebiruan menandakan larutan basa lemah.',
        }
      } else if (ph <= 11) {
        return {
          colorName: 'Biru Tua (pH 10–11)',
          colorHex: '#2563eb',
          paperColorHex: '#2563eb',
          behaviorNote: 'Warna biru tua menandakan larutan basa sedang.',
        }
      } else {
        return {
          colorName: 'Ungu Violet Pekat (pH 12–14)',
          colorHex: '#7c3aed',
          paperColorHex: '#7c3aed',
          behaviorNote: 'Warna ungu violet pekat menandakan larutan basa kuat dengan konsentrasi OH⁻ tinggi.',
        }
      }
    },
  },
  {
    id: 'pp',
    name: 'Fenolftalein (PP)',
    type: 'sintesis',
    phRange: 'pH 8.3 – 10.0',
    description:
      'Indikator sintetis populer dalam titrasi asam-basa; tidak berwarna dalam suasana asam/netral, dan berubah menjadi merah muda/magenta dalam basa.',
    tips: 'Sering digunakan pada titrasi asam kuat dengan basa kuat karena titik beloknya yang sangat kontras.',
    getColorResult: (ph: number) => {
      if (ph < 8.3) {
        return {
          colorName: 'Tidak Berwarna (Bening Transparan)',
          colorHex: '#f1f5f9',
          behaviorNote: 'Dalam larutan asam dan netral (pH < 8.3), struktur molekul PP tidak menyerap cahaya tampak (bening).',
        }
      } else if (ph <= 10.0) {
        return {
          colorName: 'Merah Muda Muda (Pink Pastel)',
          colorHex: '#f472b6',
          behaviorNote: 'Mulai terjadi deprotonasi molekul PP menghasilkan ion berstruktur kuinonoid merah muda.',
        }
      } else {
        return {
          colorName: 'Magenta Tua / Merah Muda Pekat',
          colorHex: '#db2777',
          behaviorNote: 'Pada pH > 10, deprotonasi penuh menghasilkan warna magenta tajam khas basa kuat.',
        }
      }
    },
  },
  {
    id: 'btb',
    name: 'Bromtimol Biru (BTB)',
    type: 'sintesis',
    phRange: 'pH 6.0 – 7.6',
    description:
      'Indikator yang sangat sensitif di sekitar titik netral; berwarna KUNING dalam asam, HIJAU dalam netral, dan BIRU dalam basa.',
    tips: 'Ideal untuk mendeteksi perubahan pH mendekati pH fisiologis dan netral (pH 7.0).',
    getColorResult: (ph: number) => {
      if (ph < 6.0) {
        return {
          colorName: 'Kuning Terang',
          colorHex: '#eab308',
          behaviorNote: 'Dalam bentuk terprotonasi asam (pH < 6.0), BTB berwarna kuning cerah.',
        }
      } else if (ph <= 7.6) {
        return {
          colorName: 'Hijau Seimbang',
          colorHex: '#22c55e',
          behaviorNote: 'Pada rentang transisi netral (pH 6.0–7.6), campuran warna kuning dan biru membentuk hijau.',
        }
      } else {
        return {
          colorName: 'Biru Cerah',
          colorHex: '#2563eb',
          behaviorNote: 'Dalam bentuk terdeprotonasi basa (pH > 7.6), BTB memancarkan warna biru tua.',
        }
      }
    },
  },
  {
    id: 'mo',
    name: 'Metil Jingga (Methyl Orange / MO)',
    type: 'sintesis',
    phRange: 'pH 3.1 – 4.4',
    description:
      'Indikator sintetis berkeasaman tinggi; berwarna MERAH dalam asam kuat (pH < 3.1), dan KUNING dalam larutan netral maupun basa (pH > 4.4).',
    tips: 'Sangat cocok untuk titrasi basa lemah dengan asam kuat.',
    getColorResult: (ph: number) => {
      if (ph < 3.1) {
        return {
          colorName: 'Merah Cabai',
          colorHex: '#dc2626',
          behaviorNote: 'Dalam kondisi asam kuat (pH < 3.1), ion azo metil jingga terprotonasi menjadi merah.',
        }
      } else if (ph <= 4.4) {
        return {
          colorName: 'Jingga / Oranye',
          colorHex: '#f97316',
          behaviorNote: 'Rentang peralihan trayek metil jingga (pH 3.1–4.4).',
        }
      } else {
        return {
          colorName: 'Kuning Keemasan',
          colorHex: '#eab308',
          behaviorNote: 'Pada pH di atas 4.4, larutan berwarna kuning keemasan stabil.',
        }
      }
    },
  },
  {
    id: 'kol-ungu',
    name: 'Ekstrak Kol Ungu (Alami)',
    type: 'alami',
    phRange: 'pH 1 – 14 (Spektrum Alami Lebar)',
    description:
      'Indikator bahan alam ramah lingkungan yang kaya pigmen Flavonoid Antosianin. Berubah dari merah (asam kuat), ungu (netral), hijau, hingga kuning (basa kuat).',
    tips: 'Sering digunakan dalam eksperimen dapur untuk mempelajari asam basa tanpa bahan kimia berbahaya.',
    getColorResult: (ph: number) => {
      if (ph <= 2) {
        return {
          colorName: 'Merah Nyala (Asam Kuat)',
          colorHex: '#e11d48',
          behaviorNote: 'Kation flavilium antosianin stabil dalam asam pekat menghasilkan warna merah menyala.',
        }
      } else if (ph <= 5) {
        return {
          colorName: 'Merah Muda / Pink Ungu (Asam Lemah)',
          colorHex: '#ec4899',
          behaviorNote: 'Campuran bentuk flavilium dan basa anhydro menghasilkan rona merah muda.',
        }
      } else if (ph <= 7.5) {
        return {
          colorName: 'Ungu Violet Asli (Netral)',
          colorHex: '#9333ea',
          behaviorNote: 'Warna ungu asli antosianin dipertahankan dalam media akuos netral.',
        }
      } else if (ph <= 9) {
        return {
          colorName: 'Biru Laut Tua (Basa Lemah)',
          colorHex: '#0284c7',
          behaviorNote: 'Bentuk basa kuinonoid menghasilkan warna biru sejuk.',
        }
      } else if (ph <= 11) {
        return {
          colorName: 'Hijau Daun Segar (Basa Sedang)',
          colorHex: '#16a34a',
          behaviorNote: 'Dekomposisi bertahap cincin antosianin membentuk kalkon hijau segar.',
        }
      } else {
        return {
          colorName: 'Kuning Kehijauan (Basa Kuat)',
          colorHex: '#ca8a04',
          behaviorNote: 'Dalam basa kuat ekstrem, pigmen terhidrolisis menjadi kalkon kuning kecokelatan.',
        }
      }
    },
  },
  {
    id: 'kunyit',
    name: 'Ekstrak Kunyit (Alami)',
    type: 'alami',
    phRange: 'pH 7.4 – 9.2',
    description:
      'Mengandung zat aktif kurkumin alami; berwarna KUNING TERANG dalam lingkungan asam maupun netral, dan berubah drastis menjadi MERAH KECOKELATAN dalam lingkungan basa.',
    tips: 'Inilah alasan noda bumbu kunyit di pakaian berubah merah bata saat terkena sabun cuci detergen!',
    getColorResult: (ph: number) => {
      if (ph < 7.5) {
        return {
          colorName: 'Kuning Kunyit Cerah (Asam / Netral)',
          colorHex: '#eab308',
          behaviorNote: 'Kurkumin dalam bentuk keto-enol netral berwarna kuning terang menyala.',
        }
      } else if (ph <= 9.0) {
        return {
          colorName: 'Jingga Kemerahan',
          colorHex: '#ea580c',
          behaviorNote: 'Mulai terjadi deprotonasi gugus fenolik kurkumin.',
        }
      } else {
        return {
          colorName: 'Merah Bata / Cokelat Kemerahan Pekat (Basa)',
          colorHex: '#b91c1c',
          behaviorNote: 'Bentuk dianion enolat terkonjugasi penuh memancarkan warna merah bata gelap khas basa.',
        }
      }
    },
  },
]

export const PH_SCALE_ITEMS = [
  {
    ph: 0,
    category: 'Asam Sangat Kuat',
    colorHex: '#b91c1c',
    hConc: '1.0 M (10⁰ M)',
    ohConc: '10⁻¹⁴ M',
    example: 'Asam Baterai / Aki Mobil pekat',
    description: 'Konsentrasi ion hidronium luar biasa tinggi, sangat korosif dan berbahaya.',
  },
  {
    ph: 1,
    category: 'Asam Kuat',
    colorHex: '#dc2626',
    hConc: '0.1 M (10⁻¹ M)',
    ohConc: '10⁻¹³ M',
    example: 'Asam Lambung Manusia (HCl), HCl 0.1 M',
    description: 'Kondisi optimal enzim pepsin lambung untuk mencerna protein makanan.',
  },
  {
    ph: 2,
    category: 'Asam Kuat / Sedang',
    colorHex: '#ef4444',
    hConc: '0.01 M (10⁻² M)',
    ohConc: '10⁻¹² M',
    example: 'Air Perasan Lemon, Cuka Makan',
    description: 'Terasa sangat masam di lidah, merusak enamel gigi bila kontak berkepanjangan.',
  },
  {
    ph: 3,
    category: 'Asam Sedang',
    colorHex: '#f97316',
    hConc: '10⁻³ M',
    ohConc: '10⁻¹¹ M',
    example: 'Minuman Bersoda (Soft Drinks), Buah Anggur',
    description: 'Asam karbonat dan asam fosfat terlarut memberikan rasa segar menggigit.',
  },
  {
    ph: 4,
    category: 'Asam Lemah',
    colorHex: '#fb923c',
    hConc: '10⁻⁴ M',
    ohConc: '10⁻¹⁰ M',
    example: 'Jus Tomat, Bir, Hujan Asam',
    description: 'Tingkat keasaman yang mulai mempengaruhi ekosistem perairan dan tanah.',
  },
  {
    ph: 5,
    category: 'Asam Lemah',
    colorHex: '#eab308',
    hConc: '10⁻⁵ M',
    ohConc: '10⁻⁹ M',
    example: 'Kopi Hitam Seduh, Air Hujan Bersih',
    description: 'Air hujan alami sedikit asam karena melarutkan gas CO₂ atmosfer.',
  },
  {
    ph: 6,
    category: 'Asam Sangat Lemah',
    colorHex: '#84cc16',
    hConc: '10⁻⁶ M',
    ohConc: '10⁻⁸ M',
    example: 'Susu Sapi Murni, Air Liur Sehat',
    description: 'Mendekati zona netral, ideal untuk menjaga keseimbangan flora mikroba rongga mulut.',
  },
  {
    ph: 7,
    category: 'Netral',
    colorHex: '#22c55e',
    hConc: '10⁻⁷ M',
    ohConc: '10⁻⁷ M',
    example: 'Air Murni (Akuades), Air Danau Sehat',
    description: 'Konsentrasi ion H⁺ setara persis dengan konsentrasi ion OH⁻ pada suhu 25°C.',
  },
  {
    ph: 8,
    category: 'Basa Lemah',
    colorHex: '#14b8a6',
    hConc: '10⁻⁸ M',
    ohConc: '10⁻⁶ M',
    example: 'Air Laut Alami, Darah Manusia Sehat (7.35–7.45)',
    description: 'Sedikit basa, dilindungi sistem penyangga darah agar fungsi fisiologis normal.',
  },
  {
    ph: 9,
    category: 'Basa Lemah',
    colorHex: '#06b6d4',
    hConc: '10⁻⁹ M',
    ohConc: '10⁻⁵ M',
    example: 'Larutan Soda Kue (NaHCO₃), Pasta Gigi',
    description: 'Membantu menetralkan keasaman sisa makanan di sela gigi setelah makan.',
  },
  {
    ph: 10,
    category: 'Basa Sedang',
    colorHex: '#3b82f6',
    hConc: '10⁻¹⁰ M',
    ohConc: '10⁻⁴ M',
    example: 'Obat Maag Antasida (Mg(OH)₂), Air Sabun Mandi',
    description: 'Terasa licin di kulit (saponifikasi minyak kulit), menetralkan asam lambung.',
  },
  {
    ph: 11,
    category: 'Basa Sedang',
    colorHex: '#6366f1',
    hConc: '10⁻¹¹ M',
    ohConc: '10⁻³ M',
    example: 'Pembersih Kaca & Lantai (Amonia Rumah Tangga)',
    description: 'Sangat efektif melarutkan lemak dan minyak yang melekat pada permukaan benda.',
  },
  {
    ph: 12,
    category: 'Basa Kuat',
    colorHex: '#8b5cf6',
    hConc: '10⁻¹² M',
    ohConc: '10⁻² M',
    example: 'Air Kapur Sirih (Ca(OH)₂ jenuh)',
    description: 'Basa kuat yang dapat mengendapkan kotoran dan membuat tekstur makanan kenyal.',
  },
  {
    ph: 13,
    category: 'Basa Sangat Kuat',
    colorHex: '#a855f7',
    hConc: '10⁻¹³ M',
    ohConc: '10⁻¹ M (0.1 M)',
    example: 'Pemutih Pakaian (NaClO), NaOH 0.1 M',
    description: 'Sangat kaustik, dapat membakar jaringan kulit dan merusak serat kain.',
  },
  {
    ph: 14,
    category: 'Basa Ekstrem',
    colorHex: '#4c1d95',
    hConc: '10⁻¹⁴ M',
    ohConc: '1.0 M (10⁰ M)',
    example: 'Soda Api Pekat (NaOH 1 M), Pembersih Saluran Air',
    description: 'Kaustik luar biasa kuat, melarutkan rambut dan sumbatan organik pipa air.',
  },
]

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Teori Asam Basa',
    question:
      'Menurut konsep Brønsted–Lowry, spesi kimia yang bertindak sebagai basa dalam suatu reaksi kimia adalah spesi yang...',
    options: [
      { key: 'A', text: 'Melepaskan ion OH⁻ ketika dilarutkan ke dalam air' },
      { key: 'B', text: 'Menerima (akseptor) proton H⁺ dari spesi lain' },
      { key: 'C', text: 'Memberikan (donor) pasangan elektron bebas' },
      { key: 'D', text: 'Melepaskan ion H⁺ ke dalam pelarut air' },
    ],
    correctAnswer: 'B',
    explanation:
      'Menurut teori Brønsted–Lowry (1923), asam didefinisikan sebagai donor proton (memberikan H⁺), sedangkan basa adalah akseptor proton (menerima ion H⁺). Pilihan A adalah teori Arrhenius, pilihan C adalah teori Lewis (basa Lewis donor pasangan elektron), dan pilihan D adalah asam Arrhenius.',
  },
  {
    id: 2,
    topic: 'Indikator Asam Basa',
    question:
      'Suatu larutan misterius diuji di laboratorium: ternyata kertas lakmus merah berubah menjadi biru, dan kertas lakmus biru tetap berwarna biru. Kesimpulan yang paling tepat mengenai sifat larutan tersebut adalah...',
    options: [
      { key: 'A', text: 'Larutan tersebut bersifat asam karena memerahkan lakmus' },
      { key: 'B', text: 'Larutan tersebut bersifat netral dengan pH persis 7.0' },
      { key: 'C', text: 'Larutan tersebut bersifat basa dengan pH > 7' },
      { key: 'D', text: 'Larutan tersebut adalah asam klorida pekat' },
    ],
    correctAnswer: 'C',
    explanation:
      'Ciri khas larutan basa adalah mengubah warna kertas lakmus merah menjadi biru dan mempertahankan warna biru pada kertas lakmus biru (keduanya berwarna biru). Jadi larutan tersebut memiliki pH > 7 (bersifat basa).',
  },
  {
    id: 3,
    topic: 'Indikator Fenolftalein',
    question:
      'Ketika beberapa tetes indikator fenolftalein (PP) ditambahkan ke dalam larutan asam klorida (HCl), larutan tetap tidak berwarna (bening). Namun saat diteteskan ke dalam larutan natrium hidroksida (NaOH), larutan berubah menjadi merah muda/magenta. Hal ini terjadi karena fenolftalein...',
    options: [
      { key: 'A', text: 'Hanya bereaksi dengan gas oksigen di udara bebas' },
      { key: 'B', text: 'Memiliki trayek pH 8.3–10.0 dan berwarna merah muda pada suasana basa' },
      { key: 'C', text: 'Berubah menjadi merah muda saat bereaksi dengan ion H⁺ asam' },
      { key: 'D', text: 'Adalah indikator alami dari ekstrak kunyit' },
    ],
    correctAnswer: 'B',
    explanation:
      'Fenolftalein (PP) memiliki trayek perubahan warna pada pH 8.3 – 10.0. Pada pH < 8.3 (lingkungan asam dan netral), strukturnya tidak berwarna. Pada pH > 8.3 (lingkungan basa), molekul PP terdeprotonasi membentuk anion berkonjugasi yang memancarkan warna merah muda/magenta.',
  },
  {
    id: 4,
    topic: 'Perhitungan pH Asam Kuat',
    question:
      'Berapakah nilai pH dari larutan asam klorida (HCl) yang memiliki konsentrasi 0.01 M pada suhu 25°C? (Asumsikan HCl terionisasi sempurna)',
    options: [
      { key: 'A', text: 'pH = 1' },
      { key: 'B', text: 'pH = 2' },
      { key: 'C', text: 'pH = 12' },
      { key: 'D', text: 'pH = 7' },
    ],
    correctAnswer: 'B',
    explanation:
      'HCl adalah asam kuat monoprotik (valensi asam a = 1). Maka: [H⁺] = M × a = 0.01 M × 1 = 10⁻² M. Dengan rumus pH = -log[H⁺] = -log(10⁻²) = 2. Jadi nilai pH larutan adalah 2.',
  },
  {
    id: 5,
    topic: 'Perhitungan pH Basa Kuat',
    question:
      'Sebuah botol laboratorium berisi larutan natrium hidroksida (NaOH) dengan konsentrasi 0.001 M. Berapakah nilai pH larutan tersebut pada suhu 25°C (Kw = 10⁻¹⁴)?',
    options: [
      { key: 'A', text: 'pH = 3' },
      { key: 'B', text: 'pH = 11' },
      { key: 'C', text: 'pH = 14' },
      { key: 'D', text: 'pH = 7' },
    ],
    correctAnswer: 'B',
    explanation:
      'NaOH adalah basa kuat monovalen (valensi basa b = 1). Konsentrasi ion hidroksida: [OH⁻] = M × b = 0.001 M × 1 = 10⁻³ M. Maka pOH = -log[OH⁻] = -log(10⁻³) = 3. Pada suhu 25°C, pH + pOH = 14, sehingga pH = 14 - pOH = 14 - 3 = 11.',
  },
  {
    id: 6,
    topic: 'Reaksi Netralisasi',
    question:
      'Persamaan reaksi molekuler antara asam klorida (HCl) dengan natrium hidroksida (NaOH) menghasilkan natrium klorida dan air. Persamaan reaksi ion bersih (net ionic equation) dari reaksi netralisasi tersebut adalah...',
    options: [
      { key: 'A', text: 'Na⁺(aq) + Cl⁻(aq) → NaCl(s)' },
      { key: 'B', text: 'H⁺(aq) + OH⁻(aq) → H₂O(l)' },
      { key: 'C', text: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)' },
      { key: 'D', text: '2H⁺(aq) + O²⁻(aq) → H₂O(l)' },
    ],
    correctAnswer: 'B',
    explanation:
      'Dalam larutan akuos, ion Na⁺ dan Cl⁻ adalah ion penonton (spectator ions) yang tidak mengalami perubahan. Reaksi netralisasi sejati yang terjadi antara asam kuat dan basa kuat adalah pembentukan molekul air netral dari ion hidrogen dan hidroksida: H⁺(aq) + OH⁻(aq) → H₂O(l).',
  },
  {
    id: 7,
    topic: 'Aplikasi Kehidupan Sehari-hari',
    question:
      'Penderita penyakit maag mengalami peningkatan produksi asam lambung (HCl) berlebih. Obat maag antasida umumnya mengandung magnesium hidroksida Mg(OH)₂ atau aluminium hidroksida Al(OH)₃. Prinsip kimia apa yang dimanfaatkan oleh antasida?',
    options: [
      { key: 'A', text: 'Oksidasi asam lambung menjadi gas klorin beracun' },
      { key: 'B', text: 'Reaksi netralisasi basa lemah dengan asam klorida berlebih' },
      { key: 'C', text: 'Penurunan suhu lambung untuk menghentikan sekresi cairan' },
      { key: 'D', text: 'Menambah keasaman lambung agar bakteri patogen mati' },
    ],
    correctAnswer: 'B',
    explanation:
      'Antasida bekerja berdasarkan prinsip reaksi netralisasi. Senyawa basa yang sukar larut seperti Mg(OH)₂ bereaksi dengan kelebihan asam klorida (HCl) di lambung membentuk garam magnesium klorida dan air yang netral, sehingga rasa perih nyeri lambung mereda.',
  },
  {
    id: 8,
    topic: 'Indikator Alami',
    question:
      'Ibu membuat gulai menggunakan kunyit. Saat mencuci taplak meja yang terkena noda kunyit dengan sabun cuci (detergen), noda kuning tersebut tiba-tiba berubah menjadi merah bata kecokelatan. Mengapa fenomena tersebut terjadi?',
    options: [
      { key: 'A', text: 'Zat kurkumin pada kunyit bertindak sebagai indikator alami yang berubah merah dalam suasana basa sabun' },
      { key: 'B', text: 'Sabun bereaksi membakar serat kain menjadi hangus kemerahan' },
      { key: 'C', text: 'Air cucian yang digunakan bersifat sangat asam kuat' },
      { key: 'D', text: 'Kunyit membusuk seketika saat terkena detergen' },
    ],
    correctAnswer: 'A',
    explanation:
      'Kunyit mengandung senyawa polifenol alami bernama kurkumin yang bersifat sebagai indikator asam-basa. Kurkumin berwarna kuning cerah pada kondisi asam dan netral (pH < 7.5), tetapi mengalami deprotonasi dan perubahan struktur menjadi warna merah kecokelatan saat terpapar larutan basa sabun (pH > 8.5).',
  },
]
