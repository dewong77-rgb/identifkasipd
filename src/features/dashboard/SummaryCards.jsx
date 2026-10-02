import StatCard from '@/ui/StatCard.jsx';
import { fmtNum, fmtPct } from '@/core/lib/format.js';

export default function SummaryCards({ s }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <StatCard label="Jumlah lokus" value={fmtNum(s.total)} />
      <StatCard label="Sudah submit" value={fmtNum(s.selesai)} />
      <StatCard label="Draft" value={fmtNum(s.draft)} />
      <StatCard label="Belum diisi" value={fmtNum(s.belum)} />
      <div className="col-span-2 md:col-span-1">
        <StatCard label="Persen terisi" value={fmtPct(s.persen, 1)} emphasis note="Selesai dibagi total lokus" />
      </div>
    </div>
  );
}
