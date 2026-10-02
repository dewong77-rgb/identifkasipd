import { Card } from '@/ui/PageHeader.jsx';
import { fmtDate } from '@/core/lib/format.js';

const Row = ({ k, v }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
    <dt className="w-32 shrink-0 text-sm text-muted">{k}</dt>
    <dd className="min-w-0 text-sm font-semibold text-ink">{v || '-'}</dd>
  </div>
);

export default function IdentitasCard({ sekolah, target, tanggal }) {
  const s = sekolah || {};
  return (
    <Card aria-label="Identitas sekolah">
      <h2 className="text-xl font-bold text-navy">{s.nama_sekolah || target.nama_sekolah}</h2>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <Row k="NPSN" v={s.npsn || target.npsn} />
        <Row k="Kabupaten atau kota" v={s.kab || target.kab} />
        <Row k="Kecamatan" v={s.kecamatan || target.kecamatan} />
        <Row k="Status" v={s.status || target.status_sekolah} />
        <Row k="Tanggal pelaksanaan" v={fmtDate(tanggal)} />
      </dl>
    </Card>
  );
}
