export default function ProgressBar({ value, max = 100, label, right, tone = 'navy' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      {(label || right) && (
        <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
          <span className="font-semibold text-ink">{label}</span>
          <span className="text-muted">{right}</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={typeof label === 'string' ? label : 'Progres'}>
        <div className={`h-full rounded-full ${tone === 'gold' ? 'bg-gold' : 'bg-navy'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
