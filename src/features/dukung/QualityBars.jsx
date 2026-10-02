import { Card } from '@/ui/PageHeader.jsx';
import { fmtScore } from '@/core/lib/format.js';

const ROWS = [
  ['kelengkapan', 'Kelengkapan data'],
  ['validitas', 'Validitas data'],
  ['mutakhir', 'Kemutakhiran data'],
];
const clamp = (v) => Math.max(0, Math.min(100, Number(v)));
const has = (v) => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v));

function Bar({ label, value, kab, semua }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="font-bold text-navy">{fmtScore(value)}</span>
      </div>
      <div className="relative h-4 w-full rounded-full bg-slate-200" role="img" aria-label={`${label} ${fmtScore(value)}, rata-rata kabupaten atau kota ${fmtScore(kab)}, rata-rata seluruh lokus ${fmtScore(semua)}`}>
        {has(value) && <div className="h-full rounded-full bg-navy" style={{ width: `${clamp(value)}%` }} />}
        {has(kab) && <span className="absolute -top-1 bottom-[-4px] w-0.5 bg-gold" style={{ left: `${clamp(kab)}%` }} />}
        {has(semua) && <span className="absolute -top-1 bottom-[-4px] w-0.5 border-l-2 border-dashed border-ink" style={{ left: `${clamp(semua)}%` }} />}
      </div>
      <p className="mt-1 text-xs text-muted">
        Rata-rata kab/kota {fmtScore(kab)}. Rata-rata seluruh lokus {fmtScore(semua)}.
      </p>
    </div>
  );
}

export default function QualityBars({ s, pembanding }) {
  const kab = pembanding?.kab || {};
  const semua = pembanding?.semua || {};
  return (
    <Card aria-label="Kualitas data">
      <h2 className="text-base font-bold text-navy">Kualitas data (skala 0 sampai 100)</h2>
      <div className="mb-4 mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-navy" /> Nilai sekolah
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-0.5 bg-gold" /> Rata-rata kab/kota{pembanding?.n_kab ? ` (${pembanding.n_kab} lokus)` : ''}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 border-l-2 border-dashed border-ink" /> Rata-rata seluruh lokus{pembanding?.n_semua ? ` (${pembanding.n_semua} lokus)` : ''}
        </span>
      </div>
      <div className="space-y-5">
        {ROWS.map(([k, l]) => (
          <Bar key={k} label={l} value={s[k]} kab={kab[k]} semua={semua[k]} />
        ))}
      </div>
    </Card>
  );
}
