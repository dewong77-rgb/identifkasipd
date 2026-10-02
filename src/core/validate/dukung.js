export function validateDukung({ form, target, dukung }) {
  if (target.sumber_lokus !== 'master') return [];
  if (dukung && dukung.tersedia === false) return [];
  if (form.data_dukung_dilihat_pada) return [];
  return [{ step: 'dukung', field: 'data_dukung_dilihat_pada', message: 'Data dukung harus dilihat lebih dulu. Buka halaman data dukung dan tekan tombol konfirmasi.' }];
}
