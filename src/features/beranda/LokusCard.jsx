import StatusBadge from '@/ui/StatusBadge.jsx';
import Icon from '@/ui/Icon.jsx';
import { fmtRange } from '@/core/lib/format.js';
import { normStatus } from '@/core/lib/status.js';

export default function LokusCard({ lokus, entry, onOpen }) {
  const st = normStatus(entry);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-11 w-full items-start gap-3 rounded-lg border border-line bg-white p-4 text-left hover:border-navy hover:bg-navy-50"
    >
      <Icon name="school" className="mt-0.5 shrink-0 text-navy" />
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-ink">{lokus.nama_sekolah}</span>
        <span className="mt-0.5 block text-sm text-muted">
          {lokus.kab}
          {lokus.npsn ? `, NPSN ${lokus.npsn}` : ''}
        </span>
        <span className="mt-0.5 block text-sm text-muted">{fmtRange(lokus.tgl_mulai, lokus.tgl_selesai)}</span>
      </span>
      <span className="shrink-0 pt-0.5">
        <StatusBadge status={st} />
      </span>
    </button>
  );
}
