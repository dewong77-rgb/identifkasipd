// Butir 15 disembunyikan bila peserta didik Dapodik (S2) sama dengan peserta didik BOSP 2027 pada data dukung.
export function isB15Hidden(dukung, s2) {
  if (!dukung || dukung.tersedia !== true) return false;
  const pd = dukung.sekolah?.pd_bos_2027;
  if (pd === null || pd === undefined || String(s2).trim() === '') return false;
  return Number(s2) === Number(pd);
}
