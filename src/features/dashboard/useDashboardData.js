import { useMemo } from 'react';
import { normStatus } from '@/core/lib/status.js';
import { toYmd } from '@/core/lib/format.js';

export function useDashboardData(boot, statusMap) {
  return useMemo(() => {
    const rows = boot.lokus.map((l) => {
      const e = statusMap[String(l.npsn)];
      const st = normStatus(e);
      return {
        id: l.lokus_id,
        tahap: String(l.tahap),
        tgl: toYmd(l.tgl_mulai),
        kab: l.kab,
        nama: l.nama_sekolah,
        npsn: String(l.npsn ?? ''),
        tim: l.tim_id,
        status: st,
        terisi: e ? Number(e.jml_butir_terisi) || 0 : 0,
        diperbarui: e ? e.diperbarui_pada : '',
      };
    });
    const npsnLokus = new Set(boot.lokus.map((l) => String(l.npsn)));
    const tambahan = Object.entries(statusMap)
      .filter(([npsn]) => !npsnLokus.has(String(npsn)))
      .map(([npsn, e]) => ({
        id: `x-${npsn}`,
        npsn,
        status: normStatus(e),
        terisi: Number(e.jml_butir_terisi) || 0,
        diperbarui: e.diperbarui_pada,
        nama: e.nama_sekolah || '',
      }));
    const count = (k) => rows.filter((r) => r.status.key === k).length;
    const summary = { total: rows.length, selesai: count('selesai'), draft: count('draft'), belum: count('belum') };
    summary.persen = summary.total ? summary.selesai / summary.total : 0;
    const group = (keyFn, labelFn = (k) => k) => {
      const m = new Map();
      rows.forEach((r) => {
        const k = keyFn(r);
        if (!m.has(k)) m.set(k, { key: k, label: labelFn(k), total: 0, selesai: 0 });
        const g = m.get(k);
        g.total += 1;
        if (r.status.key === 'selesai') g.selesai += 1;
      });
      return [...m.values()].sort((a, b) => String(a.key).localeCompare(String(b.key), 'id', { numeric: true }));
    };
    return {
      rows,
      tambahan,
      summary,
      perTahap: group((r) => r.tahap, (k) => `Tahap ${k}`),
      perKab: group((r) => r.kab),
      tahapList: [...new Set(rows.map((r) => r.tahap))].sort(),
      kabList: [...new Set(rows.map((r) => r.kab))].sort((a, b) => a.localeCompare(b, 'id')),
    };
  }, [boot, statusMap]);
}
