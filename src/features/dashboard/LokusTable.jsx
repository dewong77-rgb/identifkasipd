import StatusBadge from '@/ui/StatusBadge.jsx';
import { fmtDate, fmtDateTime } from '@/core/lib/format.js';

const TH = 'px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-muted';

export default function LokusTable({ rows }) {
  if (!rows.length) return <p className="rounded-md border border-line bg-navy-50 p-4 text-sm">Tidak ada lokus yang cocok dengan filter.</p>;
  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-line md:block">
        <table className="w-full min-w-[56rem] text-sm">
          <thead className="border-b border-line bg-slate-50">
            <tr>
              {['Tahap', 'Tanggal', 'Kab/Kota', 'Nama sekolah', 'Tim', 'Status', 'Butir', 'Tanggal submit'].map((h) => (
                <th key={h} scope="col" className={TH}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2">{r.tahap}</td>
                <td className="whitespace-nowrap px-3 py-2">{fmtDate(r.tgl)}</td>
                <td className="px-3 py-2">{r.kab}</td>
                <td className="px-3 py-2 font-semibold">
                  {r.nama}
                  <span className="block text-xs font-normal text-muted">NPSN {r.npsn}</span>
                </td>
                <td className="px-3 py-2">{r.tim}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={r.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-2">{r.terisi}/31</td>
                <td className="whitespace-nowrap px-3 py-2">{r.diperbarui ? fmtDateTime(r.diperbarui) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 md:hidden">
        {rows.map((r) => (
          <li key={r.id} className="rounded-lg border border-line p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold">{r.nama}</p>
              <StatusBadge status={r.status} />
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {r.kab}. Tahap {r.tahap}, {fmtDate(r.tgl)}. Tim {r.tim}
            </p>
            <p className="mt-0.5 text-sm">
              Butir {r.terisi}/31. Submit: {r.diperbarui ? fmtDateTime(r.diperbarui) : '-'}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
