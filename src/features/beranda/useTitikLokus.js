import { useMemo } from 'react';
import { toYmd } from '@/core/lib/format.js';
import { normStatus } from '@/core/lib/status.js';

// Titik lokus = tahap + tanggal kegiatan. Semua turunan dihitung dari bootstrap.
export function useTitikLokus(boot, statusMap) {
  return useMemo(() => {
    const map = new Map();
    boot.lokus.forEach((l) => {
      const k = `${l.tahap}|${toYmd(l.tgl_mulai)}`;
      if (!map.has(k)) map.set(k, { key: k, tahap: l.tahap, tgl: l.tgl_mulai, selesaiTgl: l.tgl_selesai, label: l.label_waktu, items: [] });
      map.get(k).items.push(l);
    });
    const groups = [...map.values()]
      .map((g) => ({ ...g, selesai: g.items.filter((l) => normStatus(statusMap[String(l.npsn)]).key === 'selesai').length }))
      .sort((a, b) => String(a.tahap).localeCompare(String(b.tahap)) || toYmd(a.tgl).localeCompare(toYmd(b.tgl)));

    const plByLokus = new Map();
    boot.petugas_lokus.forEach((x) => {
      if (!plByLokus.has(x.lokus_id)) plByLokus.set(x.lokus_id, new Set());
      plByLokus.get(x.lokus_id).add(x.petugas_id);
    });
    const nama = new Map(boot.petugas.map((p) => [p.petugas_id, p.nama]));

    // Petugas yang bertugas pada titik lokus tertentu.
    const petugasDi = (g) => {
      const ids = new Set();
      g.items.forEach((l) => (plByLokus.get(l.lokus_id) || []).forEach((id) => ids.add(id)));
      return [...ids].map((id) => ({ petugas_id: id, nama: nama.get(id) || id })).sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
    };
    // Sekolah sasaran dan rekan satu tim bagi seorang petugas pada titik lokus itu.
    const timDari = (g, petugasId) => {
      const sasaran = g.items.filter((l) => plByLokus.get(l.lokus_id)?.has(petugasId));
      const rekan = new Set();
      sasaran.forEach((l) => plByLokus.get(l.lokus_id).forEach((id) => rekan.add(id)));
      return {
        sasaran,
        rekan: [...rekan].map((id) => ({ petugas_id: id, nama: nama.get(id) || id })).sort((a, b) => a.nama.localeCompare(b.nama, 'id')),
      };
    };
    return { groups, petugasDi, timDari };
  }, [boot, statusMap]);
}
