import StatCard from '@/ui/StatCard.jsx';
import { fmtNum, fmtPct, fmtSigned } from '@/core/lib/format.js';

const n = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

export default function AngkaBesar({ s }) {
  const selBos = n(s.selisih_bos) ?? (n(s.pd_bos_2027) !== null && n(s.pd_bos_2026) !== null ? n(s.pd_bos_2027) - n(s.pd_bos_2026) : null);
  const selDapo = n(s.selisih_dapo_vs_bos2027);
  const residu = n(s.residu_total);
  return (
    <div className="grid gap-3 md:grid-cols-3" aria-label="Angka utama">
      <StatCard
        label="Selisih BOSP 2027 dikurangi BOSP 2026"
        value={fmtSigned(selBos)}
        sub={`${fmtPct(s.pct_perubahan)}${s.kategori ? `, ${s.kategori}` : ''}`}
        emphasis={selBos !== null && selBos !== 0}
        note={selBos !== null && selBos !== 0 ? 'Ada selisih' : 'Tidak ada selisih'}
      />
      <StatCard
        label="Selisih Dapodik terbaru dikurangi BOSP 2027"
        value={fmtSigned(selDapo)}
        emphasis={selDapo !== null && selDapo !== 0}
        note={selDapo !== null && selDapo !== 0 ? 'Ada selisih' : 'Tidak ada selisih'}
      />
      <StatCard
        label="Total residu"
        value={fmtNum(residu)}
        sub={`NISN ${fmtNum(s.residu_nisn)}, NIK ${fmtNum(s.residu_nik)}`}
        emphasis={residu !== null && residu !== 0}
        note={residu !== null && residu !== 0 ? 'Ada residu' : 'Tidak ada residu'}
      />
    </div>
  );
}
