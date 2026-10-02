import { toYmd } from '@/core/lib/format.js';

export const lokusToTarget = (l) => ({
  sumber_lokus: 'master',
  lokus_id: l.lokus_id,
  npsn: String(l.npsn ?? ''),
  nama_sekolah: l.nama_sekolah,
  prov: l.prov || '',
  kab: l.kab || '',
  kecamatan: l.kecamatan || '',
  tim_id: l.tim_id || '',
  status_sekolah: l.status || '',
});

export const manualTarget = ({ nama, npsn, kab, prov }) => ({
  sumber_lokus: 'manual',
  lokus_id: '',
  npsn: npsn || '',
  nama_sekolah: nama.trim(),
  prov: (prov || '').trim(),
  kab: kab.trim(),
  kecamatan: '',
  tim_id: '',
  status_sekolah: '',
  key: npsn ? `npsn-${npsn}` : `manual-${Date.now().toString(36)}`,
});

export const defaultTanggal = (l) => toYmd(l.tgl_mulai);
