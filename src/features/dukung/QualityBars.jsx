import { Card } from '@/ui/PageHeader.jsx';
import { fmtScore } from '@/core/lib/format.js';

// Penjelasan mengikuti istilah Indikator Kualitas Data Dapodik (IKD), Kemendikdasmen.
const ROWS = [
  {
    k: 'kelengkapan',
    label: 'Kelengkapan',
    arti: 'Seberapa lengkap data pokok sekolah terisi di Dapodik, misalnya data sekolah, peserta didik, pendidik, rombongan belajar, ruang, dan bangunan. Makin tinggi, makin sedikit isian yang kosong.',
  },
  {
    k: 'validitas',
    label: 'Validitas',
    arti: 'Seberapa sesuai isian dengan aturan pengisian, misalnya format NISN dan NIK, tanggal lahir yang wajar, dan usia yang sesuai jenjang. Makin tinggi, makin sedikit isian yang salah format atau tidak masuk akal.',
  },
  {
    k: 'mutakhir',
    label: 'Kemutakhiran',
    arti: 'Seberapa baru data diperbarui dan disinkronkan, misalnya sinkronisasi rutin tiap semester. Makin tinggi, makin terkini datanya.',
  },
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
        Ukuran kualitas data pokok pendidikan di satuan pendidikan, dinilai dari tiga aspek: lengkap, valid, dan mutakhir. Nilai ini bahan diskusi, bukan penilaian terhadap sekolah.
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
