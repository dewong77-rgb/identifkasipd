// Skema ringkasan status S1 sampai S8. Dipakai UI dan validasi.
export const STATUS_KEYS = [
  's1_sinkron_terakhir', 's2_pd_dapodik', 's3_pd_riil',
  's5_residu_ada', 's5_residu_jumlah', 's5_residu_jenis',
  's6_pd_sk_pagu_2026', 's7_cek_terakhir_tanggal', 's7_cek_terakhir_oleh', 's8_bukti_ada',
];
export const emptyStatus = () => Object.fromEntries(STATUS_KEYS.map((k) => [k, '']));

export const PILIHAN_S5 = ['Tidak ada', 'Ada'];
export const PILIHAN_S8 = ['Ada', 'Tidak ada'];

export const hitungS4 = (st) => {
  const a = st.s2_pd_dapodik;
  const b = st.s3_pd_riil;
  if (a === '' || b === '' || a === undefined || b === undefined) return null;
  return Number(a) - Number(b);
};
