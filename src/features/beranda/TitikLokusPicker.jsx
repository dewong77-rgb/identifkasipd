import Icon from '@/ui/Icon.jsx';
import { fmtRange } from '@/core/lib/format.js';

export default function TitikLokusPicker({ groups, value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Tahap pelaksanaan" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => {
        const aktif = g.key === value;
        return (
          <button
            key={g.key}
            type="button"
            role="radio"
            aria-checked={aktif}
            onClick={() => onChange(g.key)}
            className={`min-h-11 rounded-lg border p-4 text-left ${aktif ? 'border-navy bg-navy-50 ring-2 ring-gold' : 'border-line bg-white hover:border-navy'}`}
          >
            <span className="flex items-center justify-between">
              <span className="font-bold text-navy">Tahap {g.tahap}</span>
              {aktif && <Icon name="check" size={18} className="text-navy" />}
            </span>
            <span className="mt-0.5 block text-sm text-ink">{fmtRange(g.tgl, g.selesaiTgl)}</span>
            <span className="mt-0.5 block text-xs text-muted">
              {g.items.length} sekolah, {g.selesai} selesai
            </span>
          </button>
        );
      })}
    </div>
  );
}
