// Memetakan respons action=sesi ke bentuk form. Nama kolom meta belum terverifikasi
// terhadap backend asli, jadi pemetaan dibuat toleran. Sesuaikan di sini bila perlu.
import { toYmd } from './format.js';
import { emptyStatus, STATUS_KEYS } from './statusSchema.js';

const asList = (v) =>
  Array.isArray(v)
    ? v.map((x) => String(x).trim()).filter(Boolean)
    : String(v ?? '').split(/[;|,]/).map((s) => s.trim()).filter(Boolean);
const str = (v) => (v === null || v === undefined ? '' : String(v));

export function sesiToForm(sesi, { petugasNamaToId = {} } = {}) {
  const meta = sesi.meta || {};
  const src = meta.status_ringkasan && typeof meta.status_ringkasan === 'object' ? meta.status_ringkasan : meta;
  const status = emptyStatus();
  STATUS_KEYS.forEach((k) => {
    status[k] = k.includes('tanggal') || k === 's1_sinkron_terakhir' ? toYmd(src[k]) : str(src[k]);
  });
  const ids = asList(meta.pewawancara_ids);
  const manual = asList(meta.pewawancara_manual);
  // Bila server hanya menyimpan nama, cocokkan ke daftar.
  asList(meta.pewawancara).forEach((n) => {
    const id = petugasNamaToId[n.toLowerCase()];
    if (id && !ids.includes(id)) ids.push(id);
    else if (!id && !manual.includes(n)) manual.push(n);
  });
  const resp = (sesi.responden || []).map((r) => ({ nama: str(r.nama), jabatan: str(r.jabatan) }));
  const jawaban = {};
  Object.entries(sesi.jawaban || {}).forEach(([k, v]) => {
    jawaban[k] = str(v);
  });
  return {
    sesi_id: str(meta.sesi_id),
    tanggal_pelaksanaan: toYmd(meta.tanggal_pelaksanaan),
    pewawancara_ids: ids,
    pewawancara_manual: manual,
    responden: resp.length ? resp : [{ nama: '', jabatan: '' }],
    status_ringkasan: status,
    jawaban,
    data_dukung_dilihat_pada: str(meta.data_dukung_dilihat_pada),
  };
}
