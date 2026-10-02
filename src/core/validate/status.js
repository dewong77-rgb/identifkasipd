import { validYmd } from './identitas.js';

const isInt = (v) => /^\d+$/.test(String(v).trim());

export function validateStatus({ form }) {
  const s = form.status_ringkasan;
  const out = [];
  const add = (field, message) => out.push({ step: 'status', field, message });
  if (!s.s1_sinkron_terakhir) add('s1_sinkron_terakhir', 'S1: tanggal sinkron terakhir wajib diisi.');
  else if (!validYmd(s.s1_sinkron_terakhir)) add('s1_sinkron_terakhir', 'S1: format tanggal tidak valid.');
  if (!isInt(s.s2_pd_dapodik)) add('s2_pd_dapodik', 'S2: jumlah peserta didik Dapodik wajib berupa bilangan bulat tidak negatif.');
  if (!isInt(s.s3_pd_riil)) add('s3_pd_riil', 'S3: jumlah peserta didik riil wajib berupa bilangan bulat tidak negatif.');
  if (!['Ada', 'Tidak ada'].includes(s.s5_residu_ada)) add('s5_residu_ada', 'S5: pilih Ada atau Tidak ada.');
  if (s.s5_residu_ada === 'Ada' && !isInt(s.s5_residu_jumlah)) add('s5_residu_jumlah', 'S5: jumlah residu wajib diisi bila residu Ada.');
  if (String(s.s6_pd_sk_pagu_2026).trim() !== '' && !isInt(s.s6_pd_sk_pagu_2026)) add('s6_pd_sk_pagu_2026', 'S6: harus berupa bilangan bulat tidak negatif.');
  if (s.s7_cek_terakhir_tanggal && !validYmd(s.s7_cek_terakhir_tanggal)) add('s7_cek_terakhir_tanggal', 'S7: format tanggal tidak valid.');
  if (!['Ada', 'Tidak ada'].includes(s.s8_bukti_ada)) add('s8_bukti_ada', 'S8: pilih Ada atau Tidak ada.');
  return out;
}
