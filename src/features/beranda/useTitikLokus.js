import { useMemo } from 'react';
import { toYmd } from '@/core/lib/format.js';
import { normStatus } from '@/core/lib/status.js';

const SORT = (a, b) => String(a).localeCompare(String(b), 'id');
export const provDari = (l) => l.prov || 'Provinsi belum tercatat';

// Alur: tahap pelaksanaan (tahap + tanggal) -> provinsi -> kabupaten/kota (titik lokus) -> petugas -> sekolah.
export function useTitikLokus(boot, statusMap) {
  return useMemo(() => {
    const map = new Map();
    boot.lokus.forEach((l) => {
      const k = `${l.tahap}|${toYmd(l.tgl_mulai)}`;
      if (!map.has(k)) map.set(k, { key: k, tahap: l.tahap, tgl: l.tgl_mulai, selesaiTgl: l.tgl_selesai, items: [] });
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

    const provinsiDi = (g) => [...new Set(g.items.map(provDari))].sort(SORT);
    const kabDi = (g, prov) => {
      const m = new Map();
      g.items.filter((l) => provDari(l) === prov).forEach((l) => m.set(l.kab, (m.get(l.kab) || 0) + 1));
      return [...m.entries()].sort((a, b) => SORT(a[0], b[0])).map(([kab, n]) => ({ kab, n }));
    };
    const sekolahDi = (g, prov, kab) =>
      g.items.filter((l) => provDari(l) === prov && l.kab === kab).sort((a, b) => SORT(a.nama_sekolah, b.nama_sekolah));
    const petugasDi = (lokusList) => {
      const ids = new Set();
      lokusList.forEach((l) => (plByLokus.get(l.lokus_id) || []).forEach((id) => ids.add(id)));
      return [...ids].map((id) => ({ petugas_id: id, nama: nama.get(id) || id })).sort((a, b) => SORT(a.nama, b.nama));
    };
    // Tim yang punya sekolah di kabupaten/kota terpilih. Sekolah tim = semua sekolahnya pada tahap itu.
    const timDi = (g, prov, kab) => {
      const kunci = (l) => l.tim_id || `tanpa-tim-${l.lokus_id}`;
      const ids = [...new Set(g.items.filter((l) => provDari(l) === prov && l.kab === kab).map(kunci))];
      return ids
        .map((id) => {
          const sekolah = g.items.filter((l) => kunci(l) === id).sort((a, b) => SORT(a.nama_sekolah, b.nama_sekolah));
          return { id, label: sekolah[0].tim_id || 'Tanpa tim', sekolah, petugas: petugasDi(sekolah) };
        })
        .sort((a, b) => SORT(a.label, b.label));
    };
    return { groups, provinsiDi, kabDi, sekolahDi, petugasDi, timDi };
  }, [boot, statusMap]);
}
