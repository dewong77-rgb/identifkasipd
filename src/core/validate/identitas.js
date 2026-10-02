import { toYmd } from '../lib/format.js';

const YMD = /^\d{4}-\d{2}-\d{2}$/;
export const validYmd = (s) => YMD.test(s) && toYmd(s) === s && !Number.isNaN(new Date(`${s}T00:00:00`).getTime());

export function validateIdentitas({ form, target }) {
  const out = [];
  const add = (field, message) => out.push({ step: 'identitas', field, message });
  if (!String(target.nama_sekolah || '').trim()) add('nama_sekolah', 'Nama sekolah wajib diisi.');
  if (target.sumber_lokus === 'manual') {
    if (!String(target.kab || '').trim()) add('kab', 'Kabupaten atau kota wajib diisi untuk sekolah tambahan.');
  } else if (!String(target.npsn || '').trim()) {
    add('npsn', 'NPSN sekolah belum terisi dari data lokus.');
  }
  if (!validYmd(form.tanggal_pelaksanaan)) add('tanggal_pelaksanaan', 'Tanggal pelaksanaan wajib dipilih.');
  const manual = form.pewawancara_manual.filter((n) => String(n).trim());
  if (form.pewawancara_ids.length + manual.length < 1) add('pewawancara', 'Pilih atau ketik minimal satu pewawancara.');
  const resp = form.responden;
  if (resp.length > 3) add('responden', 'Narasumber paling banyak tiga orang.');
  const terisi = resp.filter((r) => String(r.nama).trim());
  if (terisi.length < 1) add('responden', 'Isi nama minimal satu narasumber.');
  resp.forEach((r, i) => {
    if (!String(r.nama).trim() && String(r.jabatan).trim()) add(`responden_${i}`, `Narasumber ${i + 1}: nama belum diisi.`);
  });
  return out;
}
