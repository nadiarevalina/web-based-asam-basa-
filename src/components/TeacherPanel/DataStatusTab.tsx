import { useState } from 'react'
import type { ServerSyncLog } from '../../types/auth'
import { getServerLogs } from '../../services/authStorage'

interface DataStatusTabProps {
  serverStatus: {
    isOnline: boolean
    endpoint: string
    latencyMs: number
    activeTeacherUid: string
  }
}

export function DataStatusTab({ serverStatus }: DataStatusTabProps) {
  const [logs] = useState<ServerSyncLog[]>(() => getServerLogs())

  return (
    <div className="tab-data-status animate-fade-in">
      {/* Pengantar Status Pipeline Penyimpanan */}
      <div className="panel-card" style={{ marginBottom: '24px' }}>
        <h3 className="panel-card-title">
          <span>🔄</span> Alur & Siklus Status Penyimpanan Bukti Belajar Siswa
        </h3>
        <p className="panel-card-subtitle" style={{ marginBottom: '16px' }}>
          Platform AsamBasa Lab menerapkan 4 status ketat untuk menjaga integritas data ilmiah dan keamanan data siswa:
        </p>

        <div className="pipeline-steps-grid">
          {/* 1. LOCAL */}
          <div className="pipeline-card local">
            <div className="pipeline-card-header">
              <span className="pipeline-tag">1. LOCAL</span>
              <span style={{ fontSize: '18px' }}>💻</span>
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#1e293b' }}>
              Tersimpan di Perangkat
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>
              Hasil pengerjaan disimpan di cache / LocalStorage perangkat siswa. Guru <strong>belum dapat</strong> membaca atau mengakses data ini.
            </p>
          </div>

          {/* 2. PENDING */}
          <div className="pipeline-card pending">
            <div className="pipeline-card-header">
              <span className="pipeline-tag">2. PENDING</span>
              <span style={{ fontSize: '18px' }}>⏳</span>
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#1e293b' }}>
              Antrean Pengiriman
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>
              Siswa telah memasukkan hasil ke antrean kirim. Payload sedang menunggu koneksi stabil untuk ditransmisikan ke server akademik.
            </p>
          </div>

          {/* 3. SENT */}
          <div className="pipeline-card sent">
            <div className="pipeline-card-header">
              <span className="pipeline-tag">3. SENT</span>
              <span style={{ fontSize: '18px' }}>✅</span>
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#1e293b' }}>
              Diterima Server
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>
              Server telah menerima payload lengkap (HTTP 200 OK) dan menerbitkan tiket bukti <code>serverAckId</code>. <strong>Hanya status ini yang tampil di Panel Guru.</strong>
            </p>
          </div>

          {/* 4. FAILED */}
          <div className="pipeline-card failed">
            <div className="pipeline-card-header">
              <span className="pipeline-tag">4. FAILED</span>
              <span style={{ fontSize: '18px' }}>❌</span>
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#1e293b' }}>
              Gagal Pengiriman
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>
              Transmisi jaringan terputus atau ditolak validasi. Data tetap aman di penyimpanan lokal siswa untuk dicoba kirim kembali (*retry*).
            </p>
          </div>
        </div>

        {/* Kotak Integritas & Keamanan Data Guru */}
        <div
          style={{
            background: '#f5f3ff',
            border: '1px solid #ddd6fe',
            borderRadius: '10px',
            padding: '14px 18px',
            fontSize: '13px',
            color: '#4c1d95',
            lineHeight: 1.5,
          }}
        >
          <strong>Prinsip Keamanan & Otorisasi Guru:</strong>
          <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px' }}>
            <li>
              Panel Guru hanya membaca hasil kelas yang berstatus <strong>SENT / DITERIMA SERVER</strong>.
            </li>
            <li>
              Status online <em>tidak berarti</em> data otomatis tersimpan di server.
            </li>
            <li>
              Proses pengiriman dimulai <em>tidak berarti</em> server telah berhasil menerima payload.
            </li>
            <li>
              Antrean lokal siswa tidak ditampilkan seolah-olah guru dapat mengakses atau memanipulasinya secara sepihak.
            </li>
          </ul>
        </div>
      </div>

      {/* Status Kesehatan Koneksi Server & Endpoint */}
      <div className="panel-card" style={{ marginBottom: '24px' }}>
        <h4 className="panel-card-title">
          <span>📡</span> Status Koneksi Layanan Server Akademik
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginTop: '12px',
          }}
        >
          <div className="detail-meta-box">
            <label>Kondisi Jaringan Layanan</label>
            <span style={{ color: serverStatus.isOnline ? '#15803d' : '#b91c1c' }}>
              {serverStatus.isOnline ? '🟢 Terhubung (HTTP 200 Ready)' : '🔴 Terputus'}
            </span>
          </div>

          <div className="detail-meta-box">
            <label>Endpoint API Kelas</label>
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {serverStatus.endpoint}
            </span>
          </div>

          <div className="detail-meta-box">
            <label>Latensi Rata-rata</label>
            <span>{serverStatus.latencyMs} ms (Respon Cepat)</span>
          </div>

          <div className="detail-meta-box">
            <label>UID Guru Terotentikasi</label>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#7c3aed' }}>
              {serverStatus.activeTeacherUid}
            </span>
          </div>
        </div>
      </div>

      {/* Tabel Log Transaksi Bukti Server (Server Logs) */}
      <div className="panel-card">
        <h4 className="panel-card-title">
          <span>📜</span> Log Bukti Penerimaan Server (Server Archival Log)
        </h4>
        <p className="panel-card-subtitle">
          Rekaman stempel waktu dan tiket konfirmasi resmi dari server akademik
        </p>

        {logs.length > 0 ? (
          <div className="panel-table-container" style={{ margin: 0 }}>
            <table className="panel-table">
              <thead>
                <tr>
                  <th>Waktu Diterima</th>
                  <th>ID Percobaan</th>
                  <th>Nama Pemilik</th>
                  <th>Status HTTP</th>
                  <th>Pesan Server</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {new Date(log.timestamp).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}{' '}
                      WIB
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{log.experimentId}</td>
                    <td>{log.ownerName}</td>
                    <td>
                      <span className="status-tag sent">HTTP {log.httpCode}</span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#475569' }}>{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="panel-state-card" style={{ padding: '24px' }}>
            <p style={{ margin: 0 }}>Belum ada catatan log transaksi server pada sesi ini.</p>
          </div>
        )}
      </div>
    </div>
  )
}
