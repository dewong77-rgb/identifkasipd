import { kodeButir, isButir15, TIDAK_DITANYAKAN } from './instrumen.js';

const num = (v) => (String(v).trim() === '' ? '' : Number(v));

export function buildPayload({ form, target, butir, b15Hidden }) {
  const s = form.status_ringkasan;
  const jawaban = {};
  butir.forEach((b) => {
    const k = kodeButir(b);
    jawaban[k] = isButir15(b) && b15Hidden ? TIDAK_DITANYAKAN : String(form.jawaban[k] ?? '').trim();
  });
  const payload = {
    sumber_lokus: target.sumber_lokus,
    lokus_id: target.lokus_id || '',
    npsn: String(target.npsn || ''),
    nama_sekolah: String(target.nama_sekolah || '').trim(),
    prov: target.prov || '',
    kab: target.kab || '',
    tim_id: target.tim_id || '',
    tanggal_pelaksanaan: form.tanggal_pelaksanaan,
    pewawancara_ids: form.pewawancara_ids,
    pewawancara_manual: form.pewawancara_manual.map((n) => String(n).trim()).filter(Boolean),
    data_dukung_dilihat_pada: form.data_dukung_dilihat_pada || '',
    responden: form.responden
      .filter((r) => String(r.nama).trim())
      .map((r) => ({ nama: String(r.nama).trim(), jabatan: String(r.jabatan).trim() })),
    status_ringkasan: {
      s1_sinkron_terakhir: s.s1_sinkron_terakhir,
      s2_pd_dapodik: num(s.s2_pd_dapodik),
      s3_pd_riil: num(s.s3_pd_riil),
      s5_residu_ada: s.s5_residu_ada,
      s5_residu_jumlah: s.s5_residu_ada === 'Ada' ? num(s.s5_residu_jumlah) : '',
      s5_residu_jenis: s.s5_residu_ada === 'Ada' ? String(s.s5_residu_jenis).trim() : '',
      s6_pd_sk_pagu_2026: num(s.s6_pd_sk_pagu_2026),
      s7_cek_terakhir_tanggal: s.s7_cek_terakhir_tanggal,
      s7_cek_terakhir_oleh: String(s.s7_cek_terakhir_oleh).trim(),
      s8_bukti_ada: s.s8_bukti_ada,
    },
    jawaban,
    status_isian: 'selesai',
  };
  if (form.sesi_id) payload.sesi_id = form.sesi_id;
  return payload;
}
