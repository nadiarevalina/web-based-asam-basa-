import { useState } from 'react'

export function TheorySection() {
  const [activeTab, setActiveTab] = useState<'teori' | 'sifat' | 'kehidupan' | 'netralisasi'>('teori')

  return (
    <section id="teori-section" className="content-section" aria-labelledby="teori-heading">
      <div className="section-header-left">
        <div className="section-tag-row">
          <span className="section-module-pill">Modul 1</span>
          <span className="section-topic-pill">Teori & Konsep Fundamental</span>
        </div>
        <h2 id="teori-heading" className="section-title">
          Mengenal Asam, Basa, dan Karakteristiknya
        </h2>
        <p className="section-description">
          Pahami evolusi pemikiran para kimiawan dalam mendefinisikan asam dan basa,
          pelajari sifat fisis-kimia larutan, serta eksplorasi peran krusialnya dalam kehidupan sehari-hari.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="theory-tabs-nav" role="tablist" aria-label="Tab Materi Teori">
        <button
          type="button"
          role="tab"
          id="tab-btn-teori"
          aria-selected={activeTab === 'teori'}
          aria-controls="tabpanel-teori"
          className={`theory-tab-btn ${activeTab === 'teori' ? 'active' : ''}`}
          onClick={() => setActiveTab('teori')}
        >
          <span className="tab-btn-num">01</span>
          <span className="tab-btn-title">3 Teori Asam-Basa</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-btn-sifat"
          aria-selected={activeTab === 'sifat'}
          aria-controls="tabpanel-sifat"
          className={`theory-tab-btn ${activeTab === 'sifat' ? 'active' : ''}`}
          onClick={() => setActiveTab('sifat')}
        >
          <span className="tab-btn-num">02</span>
          <span className="tab-btn-title">Sifat Fisis & Kimia</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-btn-kehidupan"
          aria-selected={activeTab === 'kehidupan'}
          aria-controls="tabpanel-kehidupan"
          className={`theory-tab-btn ${activeTab === 'kehidupan' ? 'active' : ''}`}
          onClick={() => setActiveTab('kehidupan')}
        >
          <span className="tab-btn-num">03</span>
          <span className="tab-btn-title">Aplikasi Sehari-hari</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-btn-netralisasi"
          aria-selected={activeTab === 'netralisasi'}
          aria-controls="tabpanel-netralisasi"
          className={`theory-tab-btn ${activeTab === 'netralisasi' ? 'active' : ''}`}
          onClick={() => setActiveTab('netralisasi')}
        >
          <span className="tab-btn-num">04</span>
          <span className="tab-btn-title">Reaksi Netralisasi</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="theory-tab-content">
        {/* Tab 1: 3 Teori Asam Basa */}
        {activeTab === 'teori' && (
          <div
            id="tabpanel-teori"
            role="tabpanel"
            aria-labelledby="tab-btn-teori"
            className="theory-panel"
          >
            <div className="theory-cards-grid">
              {/* Arrhenius */}
              <div className="theory-detail-card">
                <div className="theory-card-header">
                  <span className="theory-year">Tahun 1884</span>
                  <h3 className="theory-card-title">Teori Svante Arrhenius</h3>
                  <span className="theory-badge-keyword">Pelarut Air (H₂O)</span>
                </div>
                <div className="theory-card-body">
                  <p className="theory-explanation">
                    Fokus pada ionisasi senyawa dalam pelarut air:
                  </p>
                  <div className="theory-definition-box acid-def">
                    <strong>Asam:</strong> Zat yang menghasilkan ion hidrogen (
                    <code>H⁺</code> atau <code>H₃O⁺</code>) dalam air.
                    <div className="chem-equation">
                      HCl(aq) → H⁺(aq) + Cl⁻(aq)
                    </div>
                  </div>
                  <div className="theory-definition-box base-def">
                    <strong>Basa:</strong> Zat yang menghasilkan ion hidroksida (
                    <code>OH⁻</code>) dalam air.
                    <div className="chem-equation">
                      NaOH(aq) → Na⁺(aq) + OH⁻(aq)
                    </div>
                  </div>
                  <div className="theory-limitation-box">
                    <strong>Kelemahan:</strong> Hanya terbatas pada pelarut air dan tidak
                    dapat menjelaskan mengapa senyawa seperti <code>NH₃</code> (amonia)
                    bersifat basa padat maupun dalam pelarut non-air.
                  </div>
                </div>
              </div>

              {/* Bronsted-Lowry */}
              <div className="theory-detail-card highlight-card">
                <div className="theory-card-header">
                  <span className="theory-year">Tahun 1923</span>
                  <h3 className="theory-card-title">Teori Brønsted–Lowry</h3>
                  <span className="theory-badge-keyword">Transfer Proton (H⁺)</span>
                </div>
                <div className="theory-card-body">
                  <p className="theory-explanation">
                    Mendefinisikan asam-basa berdasarkan serah terima partikel proton (H⁺):
                  </p>
                  <div className="theory-definition-box acid-def">
                    <strong>Asam:</strong> Donor proton (pemberi ion <code>H⁺</code>).
                    <div className="chem-equation">
                      HCl + H₂O ⇌ H₃O⁺ + Cl⁻
                    </div>
                  </div>
                  <div className="theory-definition-box base-def">
                    <strong>Basa:</strong> Akseptor proton (penerima ion <code>H⁺</code>).
                    <div className="chem-equation">
                      NH₃ + H₂O ⇌ NH₄⁺ + OH⁻
                    </div>
                  </div>
                  <div className="theory-conjugate-box">
                    <strong>Pasangan Asam-Basa Konjugasi:</strong>
                    <p>
                      Spesi yang tersisa setelah asam mendonorkan proton adalah{' '}
                      <em>basa konjugasi</em> (contoh: <code>HCl</code> → <code>Cl⁻</code>
                      ). Spesi yang terbentuk setelah basa menerima proton adalah{' '}
                      <em>asam konjugasi</em> (contoh: <code>NH₃</code> → <code>NH₄⁺</code>
                      ).
                    </p>
                  </div>
                </div>
              </div>

              {/* Lewis */}
              <div className="theory-detail-card">
                <div className="theory-card-header">
                  <span className="theory-year">Tahun 1923</span>
                  <h3 className="theory-card-title">Teori Gilbert N. Lewis</h3>
                  <span className="theory-badge-keyword">Pasangan Elektron Bebas</span>
                </div>
                <div className="theory-card-body">
                  <p className="theory-explanation">
                    Teori paling umum yang berfokus pada serah-terima pasangan elektron bebas (PEB):
                  </p>
                  <div className="theory-definition-box acid-def">
                    <strong>Asam Lewis:</strong> Akseptor pasangan elektron (memiliki orbital kosong).
                  </div>
                  <div className="theory-definition-box base-def">
                    <strong>Basa Lewis:</strong> Donor pasangan elektron bebas (memiliki PEB).
                  </div>
                  <div className="chem-equation">
                    NH₃ (donor PEB) + BF₃ (akseptor PEB) → H₃N:BF₃
                  </div>
                  <div className="theory-limitation-box success">
                    <strong>Keunggulan:</strong> Berlaku pada reaksi pembentukan ikatan kovalen
                    koordinasi tanpa melibatkan transfer proton sama sekali, termasuk kompleks ion logam.
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Summary Table */}
            <div className="theory-summary-table-wrap">
              <h4 className="table-caption">Tabel Perbandingan 3 Teori Asam-Basa</h4>
              <div className="table-responsive">
                <table className="chem-table">
                  <thead>
                    <tr>
                      <th scope="col">Teori</th>
                      <th scope="col">Definisi Asam</th>
                      <th scope="col">Definisi Basa</th>
                      <th scope="col">Medium / Pelarut</th>
                      <th scope="col">Contoh Reaksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Arrhenius</strong></td>
                      <td>Pelepas <code>H⁺</code></td>
                      <td>Pelepas <code>OH⁻</code></td>
                      <td>Hanya air (akuos)</td>
                      <td><code>HCl → H⁺ + Cl⁻</code></td>
                    </tr>
                    <tr>
                      <td><strong>Brønsted–Lowry</strong></td>
                      <td>Donor proton (<code>H⁺</code>)</td>
                      <td>Akseptor proton (<code>H⁺</code>)</td>
                      <td>Air & non-air / fase gas</td>
                      <td><code>NH₃ + H₂O ⇌ NH₄⁺ + OH⁻</code></td>
                    </tr>
                    <tr>
                      <td><strong>Lewis</strong></td>
                      <td>Akseptor pasangan elektron</td>
                      <td>Donor pasangan elektron</td>
                      <td>Universal (tanpa batas pelarut)</td>
                      <td><code>NH₃ + BF₃ → F₃B:NH₃</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sifat Fisis & Kimia */}
        {activeTab === 'sifat' && (
          <div
            id="tabpanel-sifat"
            role="tabpanel"
            aria-labelledby="tab-btn-sifat"
            className="theory-panel"
          >
            <div className="properties-dual-grid">
              {/* Asam Properties */}
              <div className="property-column acid-prop">
                <div className="property-badge-header">
                  <span className="prop-icon">🍋</span>
                  <h3>Karakteristik Larutan Asam</h3>
                </div>
                <ul className="prop-list">
                  <li className="prop-item">
                    <strong>Rasa:</strong> Masam / asam khas (hanya diuji pada bahan makanan, jangan cicipi bahan kimia laboratorium!).
                  </li>
                  <li className="prop-item">
                    <strong>Daya Hantar Listrik:</strong> Merupakan larutan elektrolit karena menghasilkan ion-ion bebas (<code>H⁺</code> dan anion) yang mampu menghantarkan arus listrik.
                  </li>
                  <li className="prop-item">
                    <strong>Reaksi dengan Kertas Lakmus:</strong> Memerahkan kertas lakmus biru, dan mempertahankan warna merah pada lakmus merah.
                  </li>
                  <li className="prop-item">
                    <strong>Reaksi dengan Logam Aktif:</strong> Bersifat korosif terhadap logam aktif (Zn, Mg, Fe) dan menghasilkan gelembung gas hidrogen:
                    <div className="chem-equation-small">Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)↑</div>
                  </li>
                  <li className="prop-item">
                    <strong>Reaksi dengan Garam Karbonat:</strong> Bereaksi dengan batu kapur atau soda kue menghasilkan buih gas karbon dioksida:
                    <div className="chem-equation-small">CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑</div>
                  </li>
                </ul>
              </div>

              {/* Basa Properties */}
              <div className="property-column base-prop">
                <div className="property-badge-header">
                  <span className="prop-icon">🧼</span>
                  <h3>Karakteristik Larutan Basa</h3>
                </div>
                <ul className="prop-list">
                  <li className="prop-item">
                    <strong>Rasa & Tekstur:</strong> Terasa pahit di lidah dan licin jika disentuh dengan jari (akibat reaksi saponifikasi dengan minyak alami pada kulit).
                  </li>
                  <li className="prop-item">
                    <strong>Daya Hantar Listrik:</strong> Larutan elektrolit kuat maupun lemah melalui ion <code>OH⁻</code> dan kation logam pendukung.
                  </li>
                  <li className="prop-item">
                    <strong>Reaksi dengan Kertas Lakmus:</strong> Membirukan kertas lakmus merah, dan mempertahankan warna biru pada lakmus biru.
                  </li>
                  <li className="prop-item">
                    <strong>Sifat Kaustik:</strong> Bersifat merusak jaringan organik dan protein (dapat menimbulkan luka bakar kimia jika konsentrasi pekat).
                  </li>
                  <li className="prop-item">
                    <strong>Pelarut Lemak & Minyak:</strong> Sangat efektif mengemulsi kotoran berbasis lemak dan minyak, sehingga banyak digunakan sebagai formula sabun dan detergen pembersih.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Aplikasi Sehari-hari */}
        {activeTab === 'kehidupan' && (
          <div
            id="tabpanel-kehidupan"
            role="tabpanel"
            aria-labelledby="tab-btn-kehidupan"
            className="theory-panel"
          >
            <p className="tab-intro-text">
              Senyawa asam dan basa bukan sekadar rumus di papan tulis laboratorium; keduanya menjaga
              keseimbangan fisiologis tubuh manusia, memfasilitasi kebersihan rumah tangga, dan menggerakkan industri pangan.
            </p>

            <div className="everyday-grid">
              <div className="everyday-card">
                <div className="everyday-icon">🫀</div>
                <div className="everyday-content">
                  <span className="everyday-type acid">Asam Mineral Kuat</span>
                  <h4>Asam Klorida (HCl) di Lambung</h4>
                  <p>
                    Lambung manusia memproduksi cairan HCl berkadar pH 1.0–2.0 untuk mengaktifkan enzim
                    pepsinogen menjadi pepsin aktif pencerna protein, sekaligus membunuh mikroba patogen.
                  </p>
                </div>
              </div>

              <div className="everyday-card">
                <div className="everyday-icon">🥗</div>
                <div className="everyday-content">
                  <span className="everyday-type acid">Asam Organik Lemah</span>
                  <h4>Asam Asetat (CH₃COOH) dalam Cuka</h4>
                  <p>
                    Cuka dapur mengandung asam asetat berkonsentrasi sekitar 4–8%. Berfungsi sebagai
                    penyedap makanan, penstabil rasa acar, serta pengawet alami bahan pangan.
                  </p>
                </div>
              </div>

              <div className="everyday-card">
                <div className="everyday-icon">🍊</div>
                <div className="everyday-content">
                  <span className="everyday-type acid">Asam Triprotik Alami</span>
                  <h4>Asam Sitrat & Vitamin C (Asam Askorbat)</h4>
                  <p>
                    Melimpah pada buah jeruk dan lemon. Berfungsi sebagai antioksidan alami pencegah
                    radikal bebas, peningkat penyerapan zat besi, serta bahan pembuat minuman penyegar.
                  </p>
                </div>
              </div>

              <div className="everyday-card">
                <div className="everyday-icon">💊</div>
                <div className="everyday-content">
                  <span className="everyday-type base">Basa Sukar Larut</span>
                  <h4>Antasida (Mg(OH)₂ & Al(OH)₃)</h4>
                  <p>
                    Obat maag bekerja menetralkan kelebihan asam klorida lambung yang memicu nyeri ulu hati.
                    Karena sukar larut, obat ini aman dan tidak mengiritasi dinding lambung.
                  </p>
                </div>
              </div>

              <div className="everyday-card">
                <div className="everyday-icon">🧼</div>
                <div className="everyday-content">
                  <span className="everyday-type base">Basa Kuat Industri</span>
                  <h4>Natrium Hidroksida (NaOH) / Soda Api</h4>
                  <p>
                    Bahan baku utama proses saponifikasi trigliserida (minyak nabati/lemak hewani)
                    menjadi sabun padat, serta pembersih saluran pipa mampet akibat tumpukan lemak.
                  </p>
                </div>
              </div>

              <div className="everyday-card">
                <div className="everyday-icon">🧁</div>
                <div className="everyday-content">
                  <span className="everyday-type base">Garam Basa Lemah</span>
                  <h4>Natrium Bikarbonat (NaHCO₃)</h4>
                  <p>
                    Dikenal sebagai soda kue. Saat dipanaskan atau bereaksi dengan bahan asam adonan
                    roti, akan melepaskan gas CO₂ yang membuat tekstur kue mengembang empuk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reaksi Netralisasi */}
        {activeTab === 'netralisasi' && (
          <div
            id="tabpanel-netralisasi"
            role="tabpanel"
            aria-labelledby="tab-btn-netralisasi"
            className="theory-panel"
          >
            <div className="neutralization-hero-card">
              <div className="neutralization-formula-badge">
                Asam + Basa → Garam + Air
              </div>
              <h3 className="neutralization-title">
                Mekanisme Reaksi Netralisasi (Penetralan)
              </h3>
              <p className="neutralization-text">
                Reaksi netralisasi adalah reaksi kimia antara ion hidrogen (<code>H⁺</code>) dari asam
                dengan ion hidroksida (<code>OH⁻</code>) dari basa yang membentuk molekul air netral (<code>H₂O</code>).
              </p>

              <div className="equation-steps-box">
                <div className="eq-step">
                  <span className="eq-label">Persamaan Molekuler:</span>
                  <code>HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)</code>
                </div>
                <div className="eq-step">
                  <span className="eq-label">Persamaan Ion Lengkap:</span>
                  <code>H⁺(aq) + Cl⁻(aq) + Na⁺(aq) + OH⁻(aq) → Na⁺(aq) + Cl⁻(aq) + H₂O(l)</code>
                </div>
                <div className="eq-step highlight">
                  <span className="eq-label">Persamaan Ion Bersih (Net Ionic):</span>
                  <code>H⁺(aq) + OH⁻(aq) → H₂O(l) &nbsp; (ΔH = -57.1 kJ/mol)</code>
                </div>
              </div>

              <div className="neutralization-examples-grid">
                <div className="neutral-case">
                  <span className="case-tag">Kasus Pertanian</span>
                  <h4>Pengapuran Tanah Masam</h4>
                  <p>
                    Lahan gambut atau tanah pertanian masam (pH &lt; 5) dinetralkan dengan menaburkan kapur tohor (<code>CaO</code>) atau kapur sirih agar unsur hara fosfor dan nitrogen dapat diserap akar tanaman.
                  </p>
                </div>

                <div className="neutral-case">
                  <span className="case-tag">Pertolongan Pertama</span>
                  <h4>Penetralan Sengatan Serangga</h4>
                  <p>
                    Sengatan semut/lebah mengandung asam format (<code>HCOOH</code>), dapat diredakan dengan pasta soda kue (<code>NaHCO₃</code>). Sebaliknya sengatan tawon yang bersifat basa dapat diredakan dengan kompres cuka makan.
                  </p>
                </div>

                <div className="neutral-case">
                  <span className="case-tag">Analisis Laboratorium</span>
                  <h4>Titrasi Asam-Basa</h4>
                  <p>
                    Metode volumetri kuantitatif untuk menentukan konsentrasi larutan asam atau basa yang belum diketahui dengan meneteskan titran secara bertahap hingga mencapai <em>titik ekivalen</em>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
