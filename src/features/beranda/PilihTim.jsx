import Icon from '@/ui/Icon.jsx';

// Kartu tim: nama tim, petugasnya, dan sekolah sasarannya.
export default function PilihTim({ tims, value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Tim" className="grid gap-3 md:grid-cols-2">
      {tims.map((t) => {
        const aktif = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={aktif}
            onClick={() => onChange(t.id)}
            className={`rounded-lg border p-4 text-left ${aktif ? 'border-navy bg-navy-50 ring-2 ring-gold' : 'border-line bg-white hover:border-navy'}`}
          >
            <span className="flex items-center justify-between">
              <span className="font-bold text-navy">Tim {t.label}</span>
              {aktif && <Icon name="check" size={18} className="text-navy" />}
            </span>
            <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-muted">Petugas</span>
            <span className="block text-sm text-ink">{t.petugas.map((p) => p.nama).join(', ') || '-'}</span>
            <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-muted">Sekolah sasaran</span>
            <ul className="text-sm text-ink">
              {t.sekolah.map((l) => (
                <li key={l.lokus_id}>
                  {l.nama_sekolah} <span className="text-muted">({l.kab})</span>
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
