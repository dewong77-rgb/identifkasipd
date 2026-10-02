import { Card } from '@/ui/PageHeader.jsx';
import { fmtScore } from '@/core/lib/format.js';

// Definisi mengikuti paparan Indeks Kualitas Dapodik (Kemendikdasmen) dan laman IKD BPMP.
const ROWS = [
  { k: 'kelengkapan', label: 'Kelengkapan (Completeness)', arti: 'Ukuran tingkat keterisian dan kelengkapan setiap entitas data pokok pendidikan.' },
  { k: 'validitas', label: 'Validitas (Validity)', arti: 'Ukuran tingkat kesesuaian data dengan standar atau aturan yang telah ditetapkan.' },
  { k: 'mutakhir', label: 'Mutakhir (Up to date)', arti: 'Ukuran kemutakhiran atau kebaruan data pokok pendidikan, untuk memastikan data yang dikumpulkan melalui Dapodik adalah data terkini.' },
];
const clamp = (v) => Math.max(0, Math.min(100, Number(v)));
const has = (v) => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v));

function Bar({ label, arti, value, semua }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="font-bold text-navy">{fmtScore(value)}</span>
      </div>
      <div className="relative h-4 w-full rounded-full bg-slate-200" role="img" aria-label={`${label} ${fmtScore(value)}, rata-rata seluruh lokus ${fmtScore(semua)}`}>
        {has(value) && <div className="h-full rounded-full bg-navy" style={{ width: `${clamp(value)}%` }} />}
        {has(semua) && <span className="absolute -top-1 bottom-[-4px] w-0.5 border-l-2 border-dashed border-ink" style={{ left: `${clamp(semua)}%` }} />}
      </div>
      <p className="mt-1 text-xs text-muted">Rata-rata seluruh lokus {fmtScore(semua)}.</p>
      <p className="mt-1 text-sm text-ink">{arti}</p>
    </div>
  );
}

export default function QualityBars({ s, pembanding }) {
  const semua = pembanding?.semua || {};
  return (
    <Card aria-label="Indeks Kualitas Data Dapodik">
      <h2 className="text-base font-bold text-navy">Indeks Kualitas Data Dapodik (skala 0 sampai 100)</h2>
      <p className="mt-1 text-sm text-ink">
        Nilai yang menggambarkan kualitas data Dapodik suatu sekolah, dihitung dari rata-rata tiga komponen: kelengkapan, validitas, dan mutakhir. Nilai ini bahan diskusi, bukan penilaian terhadap sekolah.
      </p>
      <div className="mb-4 mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-navy" /> Nilai sekolah
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 border-l-2 border-dashed border-ink" /> Rata-rata seluruh lokus{pembanding?.n_semua ? ` (${pembanding.n_semua} lokus)` : ''}
        </span>
      </div>
      <div className="space-y-6">
        {ROWS.map((r) => (
          <Bar key={r.k} label={r.label} arti={r.arti} value={s[r.k]} semua={semua[r.k]} />
        ))}
      </div>
    </Card>
  );
}
