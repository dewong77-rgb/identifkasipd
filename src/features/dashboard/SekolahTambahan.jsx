import { Card } from '@/ui/PageHeader.jsx';
import StatusBadge from '@/ui/StatusBadge.jsx';
import { fmtDateTime } from '@/core/lib/format.js';

export default function SekolahTambahan({ rows }) {
  if (!rows.length) return null;
  return (
    <Card>
      <h2 className="font-bold text-navy">Sekolah tambahan</h2>
      <p className="mb-3 text-sm text-muted">Sekolah di luar 72 lokus. Tidak dihitung dalam persentase.</p>
      <ul className="divide-y divide-line">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
            <span className="font-semibold">{r.nama || `NPSN ${r.npsn}`}</span>
            <span className="flex flex-wrap items-center gap-3">
              <StatusBadge status={r.status} />
              <span>{r.terisi}/31</span>
              <span className="text-muted">{r.diperbarui ? fmtDateTime(r.diperbarui) : '-'}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
