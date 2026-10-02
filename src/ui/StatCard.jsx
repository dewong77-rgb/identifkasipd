export default function StatCard({ label, value, sub, emphasis = false, note }) {
  return (
    <div className={`rounded-lg border p-4 ${emphasis ? 'border-gold bg-gold-50' : 'border-line bg-white'}`}>
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${emphasis ? 'text-navy' : 'text-ink'}`}>{value}</p>
      {sub && <p className="mt-1 text-sm text-ink">{sub}</p>}
      {note && <p className="mt-1 text-xs font-semibold text-muted">{note}</p>}
    </div>
  );
}
