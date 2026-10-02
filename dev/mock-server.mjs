// Server tiruan untuk pengembangan lokal. Data SINTETIS, bukan data sekolah asli.
// Meniru kontrak API pada dokumen perintah. Jalankan: npm run mock (port 8787).
import http from 'node:http';

const PORT = process.env.PORT || 8787;
const kabs = ['Kota Bogor', 'Kabupaten Bogor', 'Kota Depok', 'Kabupaten Tangerang', 'Kota Serang', 'Kabupaten Bekasi'];
const petugas = Array.from({ length: 42 }, (_, i) => ({ petugas_id: `P${String(i + 1).padStart(3, '0')}`, nama: `Petugas Uji ${String(i + 1).padStart(2, '0')}` }));
const tglTahap = { 1: '2026-10-05', 2: '2026-10-12', 3: '2026-10-19' };
const lokus = Array.from({ length: 72 }, (_, i) => {
  const tahap = Math.floor(i / 24) + 1;
  return {
    lokus_id: `L${String(i + 1).padStart(3, '0')}`, npsn: String(20268800 + i), nama_sekolah: `SMA Contoh ${i + 1}`,
    status: i % 3 ? 'Negeri' : 'Swasta', prov: i % 2 ? 'Jawa Barat' : 'Banten', kab: kabs[i % kabs.length], kecamatan: `Kec. ${i % 9 + 1}`,
    tim_id: `T${tahap}-${String(Math.floor((i % 24) / 2) + 1).padStart(2, '0')}`, tahap, label_waktu: `${tglTahap[tahap].slice(8)} Oktober 2026`,
    tgl_mulai: tglTahap[tahap], tgl_selesai: tglTahap[tahap],
  };
});
const petugas_lokus = lokus.flatMap((l, i) => [0, 1, 2].map((k) => ({ petugas_id: petugas[(i * 3 + k) % 42].petugas_id, lokus_id: l.lokus_id })));
const bagian = { A: ['Profil pengelolaan data', 4], B: ['Proses pembaruan data', 5], C: ['Perubahan jumlah peserta didik', 5], D: ['Dapodik dan BOSP', 4], E: ['Residu dan validasi', 5], F: ['Bukti dan dokumentasi', 4], G: ['Kendala dan dukungan', 4] };
const butir = []; let no = 1;
Object.entries(bagian).forEach(([kode, [nama, n]]) => { for (let j = 0; j < n; j++, no++) butir.push({ no_butir: no, kode_bagian: kode, bagian: nama, pertanyaan: `Pertanyaan contoh nomor ${no} pada bagian ${kode}?`, jml_pendalaman: 2, aturan_tampil: no === 15 ? 'Bila selisih' : 'Selalu', wajib_diisi: 'Ya', pendalaman: [`Pendalaman ${no}.1`, `Pendalaman ${no}.2`] }); });
const instStatus = ['S1','S2','S3','S4','S5','S6','S7','S8'].map((kode) => ({ kode, butir_status: `Butir status ${kode}`, tipe_isian: 'teks', satuan_atau_pilihan: '', wajib: 'Ya' }));
const dukungOf = (l, i) => {
  const b26 = 600 + i * 3; const b27 = b26 + (i % 4 === 0 ? 0 : (i % 7) - 3);
  return { lokus_id: l.lokus_id, npsn: l.npsn, nama_sekolah: l.nama_sekolah, status: l.status, kab: l.kab, kecamatan: l.kecamatan,
    pd_2023: i % 5 === 0 ? null : b26 - 20, pd_2024: i % 5 === 0 ? null : b26 - 10, pd_2025: i % 6 === 0 ? null : b26 - 4, pd_bos_2026: b26, pd_bos_2027: b27, pd_dapo_update: b27 + (i % 3 === 0 ? 0 : 5),
    selisih_bos: b27 - b26, selisih_abs: Math.abs(b27 - b26), kategori: b27 > b26 ? 'Naik' : b27 < b26 ? 'Turun' : 'Tetap', pct_perubahan: (b27 - b26) / b26,
    selisih_dapo_vs_bos2027: i % 3 === 0 ? 0 : 5, residu_nisn: i % 4, residu_nik: i % 3, residu_total: (i % 4) + (i % 3), kelengkapan: 90 - (i % 10), validitas: 85 + (i % 12), mutakhir: 70 + (i % 25) };
};
const avg = { kelengkapan: 88.4, validitas: 90.1, mutakhir: 82.7, residu_total: 2.1, selisih_abs: 2.4, pct_perubahan: 0.004 };
const sesi = {}; // npsn -> sesi
let failNext = null;
let seq = 1;

const send = (res, obj, code = 200) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(obj)); };
const err = (res, code, error, detail, extra = {}) => send(res, { ok: false, code, error, ...(detail ? { detail } : {}), ...extra });

http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }); return res.end(); }
  if (req.method === 'GET') {
    const a = u.searchParams.get('action');
    const npsn = u.searchParams.get('npsn');
    if (a === '_failnext') { failNext = u.searchParams.get('mode') || 'SERVER'; return send(res, { ok: true, armed: failNext }); }
    if (a === '_reset') { Object.keys(sesi).forEach((k) => delete sesi[k]); return send(res, { ok: true }); }
    if (a === 'bootstrap') return send(res, { ok: true, data: { petugas, lokus, petugas_lokus, instrumen: { status: instStatus, butir } } });
    if (a === 'status') return send(res, { ok: true, data: Object.fromEntries(Object.entries(sesi).map(([k, s]) => [k, { sesi_id: s.meta.sesi_id, status_isian: s.meta.status_isian, jml_butir_terisi: s.meta.jml_butir_terisi, diperbarui_pada: s.meta.diperbarui_pada }])) });
    if (a === 'dukung') {
      const i = lokus.findIndex((l) => l.npsn === npsn);
      if (i < 0) return send(res, { ok: true, data: { tersedia: false } });
      const s = dukungOf(lokus[i], i);
      return send(res, { ok: true, data: { tersedia: true, sekolah: s, pembanding: { kab: { ...avg, kelengkapan: 87 }, semua: avg, n_kab: 12, n_semua: 72 }, pemicu_b15: s.selisih_dapo_vs_bos2027 !== 0 } });
    }
    if (a === 'sesi') {
      const s = npsn ? sesi[npsn] : Object.values(sesi).find((x) => x.meta.sesi_id === u.searchParams.get('sesi_id'));
      return send(res, { ok: true, data: s ? { ada: true, sesi: s } : { ada: false } });
    }
    return err(res, 'SKEMA', 'Aksi tidak dikenal.');
  }
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    if (failNext) { const m = failNext; failNext = null; if (m === 'HTML') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<html>Galat Google</html>'); } if (m === 'HANG') return; return err(res, m, 'Server sedang sibuk. Coba lagi.'); }
    let p; try { p = JSON.parse(body); } catch { return err(res, 'SKEMA', 'Isi tidak valid.'); }
    const d = [];
    if (!p.nama_sekolah) d.push('Nama sekolah wajib diisi.');
    if (!(p.pewawancara_ids?.length || p.pewawancara_manual?.length)) d.push('Pewawancara minimal satu.');
    if (!p.responden?.length) d.push('Responden minimal satu.');
    const miss = Object.entries(p.jawaban || {}).filter(([, v]) => !String(v).trim()).map(([k]) => k);
    if (miss.length || Object.keys(p.jawaban || {}).length !== 31) d.push(`Butir ${miss.join(', ') || 'B01 sampai B31'} belum lengkap.`);
    if (p.sumber_lokus === 'master' && !p.data_dukung_dilihat_pada) d.push('Data dukung belum dilihat.');
    if (d.length) return err(res, 'VALIDASI', 'Isian belum valid.', d);
    const key = p.npsn || `manual-${p.nama_sekolah}`;
    if (sesi[key] && !p.sesi_id) return err(res, 'SESI_ADA', 'Sekolah sudah punya isian.', null, { sesi_id: sesi[key].meta.sesi_id });
    const id = p.sesi_id || `S${String(seq++).padStart(4, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const filled = Object.values(p.jawaban).filter((v) => String(v).trim()).length;
    sesi[key] = { meta: { sesi_id: id, ...p, status_isian: 'selesai', jml_butir_terisi: filled, diperbarui_pada: now, s4_selisih: p.status_ringkasan.s2_pd_dapodik - p.status_ringkasan.s3_pd_riil, ...p.status_ringkasan }, responden: p.responden, jawaban: p.jawaban };
    send(res, { ok: true, sesi_id: id, status_isian: 'selesai', jml_butir_terisi: filled, diperbarui_pada: now, baru: !p.sesi_id });
  });
}).listen(PORT, () => console.log(`Mock API di http://localhost:${PORT}/exec`));
