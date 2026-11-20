export interface LabReferenceItem {
  id: string
  inTextCitation: string
  narrativeCitation: string
  authors: string
  year: number | string
  title: string
  publisherOrJournal: string
  edition?: string
  doi?: string
  url: string
  conceptsCovered: string[]
  apaFormatted: string
}

export const LAB_REFERENCES: Record<string, LabReferenceItem> = {
  'brown-2018': {
    id: 'brown-2018',
    inTextCitation: '(Brown et al., 2018)',
    narrativeCitation: 'Brown et al. (2018)',
    authors: 'Brown, T. L., LeMay, H. E., Bursten, B. E., Murphy, C. J., Woodward, P. M., & Stoltzfus, M. W.',
    year: 2018,
    title: 'Chemistry: The Central Science',
    edition: '14th ed.',
    publisherOrJournal: 'Pearson Education',
    url: 'https://www.pearson.com/en-us/subject-catalog/p/chemistry-the-central-science/P200000006760',
    conceptsCovered: [
      'Konsep asam-basa Brønsted–Lowry dan transfer proton',
      'Ionisasi sempurna asam klorida (HCl) dan natrium hidroksida (NaOH)',
      'Prinsip kesetimbangan autoionisasi air murni pada 25°C',
      'Aturan keselamatan kerja laboratorium kimia dan penggunaan APD',
    ],
    apaFormatted:
      'Brown, T. L., LeMay, H. E., Bursten, B. E., Murphy, C. J., Woodward, P. M., & Stoltzfus, M. W. (2018). Chemistry: The Central Science (14th ed.). Pearson Education.',
  },
  'chang-2016': {
    id: 'chang-2016',
    inTextCitation: '(Chang & Goldsby, 2016)',
    narrativeCitation: 'Chang & Goldsby (2016)',
    authors: 'Chang, R., & Goldsby, K. A.',
    year: 2016,
    title: 'Chemistry',
    edition: '12th ed.',
    publisherOrJournal: 'McGraw-Hill Education',
    url: 'https://www.mheducation.com/highered/product/chemistry-chang-goldsby/M9780078021510.html',
    conceptsCovered: [
      'Ionisasi asam lemah organik (asam sitrat, asam asetat, dan asam karbonat)',
      'Perilaku kertas lakmus merah dan biru sebagai indikator asam-basa klasik',
      'Karakteristik larutan amonia sebagai basa lemah nitrogen',
      'Pentingnya pembilasan alat reaksi dengan akuades untuk mencegah kontaminasi residu',
    ],
    apaFormatted:
      'Chang, R., & Goldsby, K. A. (2016). Chemistry (12th ed.). McGraw-Hill Education.',
  },
  'harborne-1998': {
    id: 'harborne-1998',
    inTextCitation: '(Harborne, 1998)',
    narrativeCitation: 'Harborne (1998)',
    authors: 'Harborne, J. B.',
    year: 1998,
    title: 'Phytochemical Methods: A Guide to Modern Techniques of Plant Analysis',
    edition: '3rd ed.',
    publisherOrJournal: 'Chapman & Hall / Springer',
    doi: '10.1007/978-94-009-5570-7',
    url: 'https://doi.org/10.1007/978-94-009-5570-7',
    conceptsCovered: [
      'Perubahan struktur pigmen antosianin pada ekstrak kol ungu (Brassica oleracea)',
      'Kation flavilium merah stabil pada pH sangat asam (< 3)',
      'Bentuk kuinoid ungu-biru pada pH netral dan kalkon kuning pada pH basa pekat',
      'Tautomerisme keto-enolat pigmen kurkumin kunyit (Curcuma longa) dari kuning ke merah-oranye dalam basa',
    ],
    apaFormatted:
      'Harborne, J. B. (1998). Phytochemical Methods: A Guide to Modern Techniques of Plant Analysis (3rd ed.). Chapman & Hall. https://doi.org/10.1007/978-94-009-5570-7',
  },
  'haynes-2016': {
    id: 'haynes-2016',
    inTextCitation: '(Haynes, 2016)',
    narrativeCitation: 'Haynes (2016)',
    authors: 'Haynes, W. M. (Ed.)',
    year: 2016,
    title: 'CRC Handbook of Chemistry and Physics',
    edition: '97th ed.',
    publisherOrJournal: 'CRC Press / Taylor & Francis Group',
    doi: '10.1201/9781315380476',
    url: 'https://doi.org/10.1201/9781315380476',
    conceptsCovered: [
      'Data termodinamika konstanta ionisasi asam (Ka) dan pKa indikator sintetik',
      'Trayek transisi pH presisi untuk fenolftalein (pH 8.3–10.0)',
      'Trayek transisi pH presisi untuk bromtimol biru (pH 6.0–7.6)',
      'Trayek transisi pH presisi untuk metil jingga (pH 3.1–4.4)',
    ],
    apaFormatted:
      'Haynes, W. M. (Ed.). (2016). CRC Handbook of Chemistry and Physics (97th ed.). CRC Press. https://doi.org/10.1201/9781315380476',
  },
  'iupac-2019': {
    id: 'iupac-2019',
    inTextCitation: '(IUPAC, 2019)',
    narrativeCitation: 'IUPAC (2019)',
    authors: 'International Union of Pure and Applied Chemistry (IUPAC)',
    year: 2019,
    title: 'Compendium of Chemical Terminology (Gold Book)',
    edition: '2nd ed.',
    publisherOrJournal: 'IUPAC',
    doi: '10.1351/goldbook',
    url: 'https://goldbook.iupac.org/',
    conceptsCovered: [
      'Definisi standar pH operasional berbasis aktivitas ion hidrogen: pH = -log10(aH+)',
      'Definisi formal indikator asam-basa (acid-base indicator)',
      'Standar nomenklatur larutan standar analitis dan spesi ionik',
    ],
    apaFormatted:
      'International Union of Pure and Applied Chemistry. (2019). Compendium of Chemical Terminology (2nd ed.). IUPAC. https://doi.org/10.1351/goldbook',
  },
  'openstax-2019': {
    id: 'openstax-2019',
    inTextCitation: '(OpenStax, 2019)',
    narrativeCitation: 'OpenStax (2019)',
    authors: 'OpenStax',
    year: 2019,
    title: 'Chemistry 2e',
    publisherOrJournal: 'OpenStax, Rice University',
    url: 'https://openstax.org/details/books/chemistry-2e',
    conceptsCovered: [
      'Model kesetimbangan disosiasi indikator: HIn(aq) + H2O(l) <=> H3O+(aq) + In-(aq)',
      'Pergeseran kesetimbangan indikator berdasarkan Asas Le Chatelier',
      'Pemanfaatan indikator universal sebagai campuran pewarna multi-spektrum pH 0-14',
      'Metodologi inkuiri saintifik dan perumusan hipotesis sebelum pengujian',
      'Penetapan estimasi derajat keasaman pada bahan rumah tangga sehari-hari',
    ],
    apaFormatted:
      'OpenStax. (2019). Chemistry 2e. OpenStax, Rice University. https://openstax.org/details/books/chemistry-2e',
  },
  'skoog-2014': {
    id: 'skoog-2014',
    inTextCitation: '(Skoog et al., 2014)',
    narrativeCitation: 'Skoog et al. (2014)',
    authors: 'Skoog, D. A., West, D. M., Holler, F. J., & Crouch, S. R.',
    year: 2014,
    title: 'Fundamentals of Analytical Chemistry',
    edition: '9th ed.',
    publisherOrJournal: 'Cengage Learning',
    url: 'https://www.cengage.com/c/fundamentals-of-analytical-chemistry-9e-skoog/9780495558286/',
    conceptsCovered: [
      'Mekanisme pergeseran kromofor pada molekul indikator asam-basa',
      'Rentang transisi visual mata manusia: pH = pKa +/- 1 (rentang ~2 unit pH)',
      'Struktur kuinonoid merah muda pada deprotonasi fenolftalein',
      'Struktur sulfonftalein kuning-biru pada bromtimol biru',
      'Struktur garam azo terprotonasi merah pada metil jingga',
      'Volume tetesan mikro indikator agar kapasitas penyangga sampel tidak terganggu',
    ],
    apaFormatted:
      'Skoog, D. A., West, D. M., Holler, F. J., & Crouch, S. R. (2014). Fundamentals of Analytical Chemistry (9th ed.). Cengage Learning.',
  },
  'zumdahl-2020': {
    id: 'zumdahl-2020',
    inTextCitation: '(Zumdahl & DeCoste, 2020)',
    narrativeCitation: 'Zumdahl & DeCoste (2020)',
    authors: 'Zumdahl, S. S., & DeCoste, D. J.',
    year: 2020,
    title: 'Chemical Principles',
    edition: '8th ed.',
    publisherOrJournal: 'Cengage Learning',
    url: 'https://www.cengage.com/c/chemical-principles-8e-zumdahl/9781305581982/',
    conceptsCovered: [
      'Reaksi hidrolisis garam basa natrium bikarbonat (NaHCO3) menghasilkan ion OH-',
      'Karakteristik antasida magnesium hidroksida Mg(OH)2 sebagai basa sukar larut',
      'Sifat pengoksidasi dan kebasaan natrium hipoklorit (NaClO) pada pemutih',
      'Sistem penyangga bikarbonat dalam menstabilkan pH cairan tubuh dan air laut',
    ],
    apaFormatted:
      'Zumdahl, S. S., & DeCoste, D. J. (2020). Chemical Principles (8th ed.). Cengage Learning.',
  },
}

export const SORTED_LAB_REFERENCES: LabReferenceItem[] = Object.values(LAB_REFERENCES).sort(
  (a, b) => a.authors.localeCompare(b.authors)
)
